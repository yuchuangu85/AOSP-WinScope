// Copyright (C) 2026 The Android Open Source Project
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// winscope-launcher serves a packaged Winscope distribution on loopback only.
// It intentionally uses only the Go standard library so release builds can use
// CGO_ENABLED=0 for every supported desktop target.
package main

import (
	"bufio"
	"context"
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"flag"
	"fmt"
	"io"
	"log"
	"mime"
	"net"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"os/exec"
	"os/signal"
	"path"
	"path/filepath"
	"runtime"
	"strings"
	"sync"
	"syscall"
	"time"
)

const (
	capturePrefix       = "/capture/"
	aiPrefix            = "/ai/"
	runtimeConfigPath   = "/runtime-config.json"
	maxManifestBytes    = 4 << 20
	shutdownGracePeriod = 5 * time.Second
	securityHeaders     = "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; media-src 'self' blob:; font-src 'self' data:; worker-src 'self' blob:; connect-src 'self'"
)

type manifest struct {
	SchemaVersion int             `json:"schemaVersion"`
	Assets        []manifestAsset `json:"assets"`
}

type manifestAsset struct {
	Path   string `json:"path"`
	SHA256 string `json:"sha256"`
}

type captureProxy struct {
	command  *exec.Cmd
	stdin    io.WriteCloser
	done     chan struct{}
	stopOnce sync.Once
	url      *url.URL
	secret   string
}

func main() {
	var distributionRoot string
	arguments := os.Args[1:]
	openBrowser := defaultLaunchFlags(arguments)
	var browser string
	var port int
	var aiURL string
	var parentPipe bool
	flag.StringVar(&distributionRoot, "root", defaultDistributionRoot(), "path to the packaged aosp-winscope distribution")
	flag.BoolVar(&openBrowser, "open", openBrowser, "open the local Winscope URL with the operating system browser handler")
	flag.StringVar(&browser, "browser", "", "browser executable to launch with the local Winscope URL")
	flag.IntVar(&port, "port", 0, "fixed loopback Web port; 0 selects a random available port")
	flag.StringVar(&aiURL, "ai-url", "", "loopback AI gateway URL to expose at the same-origin /ai/ path")
	flag.BoolVar(&parentPipe, "parent-pipe", false, "stop when the desktop host closes standard input")
	flag.Parse()
	aiTarget, err := parseAIURL(aiURL)
	if err != nil {
		log.Fatal(err)
	}
	if err := validateLaunchOptions(port); err != nil {
		log.Fatal(err)
	}

	root, err := filepath.Abs(distributionRoot)
	if err != nil {
		log.Fatal(err)
	}
	webRoot, staticAssets, err := validateDistribution(root)
	if err != nil {
		log.Fatal(err)
	}

	listener, err := net.Listen("tcp", fmt.Sprintf("127.0.0.1:%d", port))
	if err != nil {
		log.Fatal(err)
	}
	defer listener.Close()
	var parentDone <-chan struct{}
	if parentPipe {
		parentDone = watchParentPipe(os.Stdin)
	}

	origin := "http://" + listener.Addr().String()
	proxy, err := startCaptureProxyWithParent(root, origin, parentDone)
	if err != nil {
		log.Fatal(err)
	}
	defer proxy.stop()

	server := &http.Server{
		Handler:      newHandler(webRoot, staticAssets, origin, proxy, aiTarget),
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 60 * time.Second,
		IdleTimeout:  60 * time.Second,
	}
	url := origin + "/"
	fmt.Println("Winscope is available at " + url)
	if browser != "" || openBrowser {
		if err := openLocalURLWithBrowser(url, browser); err != nil {
			log.Printf("Could not open a browser: %v", err)
		}
	}

	errCh := make(chan error, 1)
	go func() { errCh <- server.Serve(listener) }()
	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt, syscall.SIGTERM)
	select {
	case <-stop:
	case <-parentDone:
	case err := <-errCh:
		if !errors.Is(err, http.ErrServerClosed) {
			log.Printf("Local server stopped: %v", err)
		}
	}
	// Release capture requests before draining HTTP, including in-flight ADB work.
	proxy.stop()
	ctx, cancel := context.WithTimeout(context.Background(), shutdownGracePeriod)
	defer cancel()
	if err := server.Shutdown(ctx); err != nil {
		log.Printf("Local server shutdown failed: %v", err)
	}
}

func watchParentPipe(reader io.Reader) <-chan struct{} {
	done := make(chan struct{})
	go func() {
		_, _ = io.Copy(io.Discard, reader)
		close(done)
	}()
	return done
}

func defaultLaunchFlags(arguments []string) bool {
	return len(arguments) == 0 || containsArgument(arguments, "--open")
}

func containsArgument(arguments []string, target string) bool {
	for _, argument := range arguments {
		if argument == target {
			return true
		}
	}
	return false
}

func defaultDistributionRoot() string {
	executable, err := os.Executable()
	if err != nil {
		return "."
	}
	return distributionRootForExecutable(executable)
}

func distributionRootForExecutable(executable string) string {
	executableDirectory := filepath.Dir(executable)
	candidates := []string{
		executableDirectory,
		// Platform launchers live at bin/<os>-<arch>/winscope-launcher.
		filepath.Clean(filepath.Join(executableDirectory, "..", "..")),
	}
	for _, candidate := range candidates {
		if _, err := os.Stat(filepath.Join(candidate, "manifest.json")); err == nil {
			return candidate
		}
	}
	return "."
}

func validateDistribution(root string) (string, map[string]bool, error) {
	manifestPath := filepath.Join(root, "manifest.json")
	contents, err := os.ReadFile(manifestPath)
	if err != nil {
		return "", nil, fmt.Errorf("read distribution manifest: %w", err)
	}
	if len(contents) > maxManifestBytes {
		return "", nil, errors.New("distribution manifest exceeds the size limit")
	}
	var value manifest
	if err := json.Unmarshal(contents, &value); err != nil {
		return "", nil, fmt.Errorf("parse distribution manifest: %w", err)
	}
	if value.SchemaVersion != 1 || len(value.Assets) == 0 {
		return "", nil, errors.New("distribution manifest has an unsupported schema or no assets")
	}

	seenIndex := false
	seenRuntimeConfig := false
	staticAssets := make(map[string]bool, len(value.Assets))
	for _, asset := range value.Assets {
		if !validManifestPath(asset.Path) || !validSHA256(asset.SHA256) {
			return "", nil, errors.New("distribution manifest contains an invalid asset")
		}
		assetPath := strings.TrimPrefix(asset.Path, "web/")
		if staticAssets[assetPath] {
			return "", nil, errors.New("distribution manifest contains a duplicate asset")
		}
		filePath := filepath.Join(root, filepath.FromSlash(asset.Path))
		relative, err := filepath.Rel(root, filePath)
		if err != nil || relative == ".." || strings.HasPrefix(relative, ".."+string(os.PathSeparator)) {
			return "", nil, errors.New("distribution manifest asset escapes its root")
		}
		info, err := os.Lstat(filePath)
		if err != nil || !info.Mode().IsRegular() {
			return "", nil, fmt.Errorf("distribution asset is not a regular file: %s", asset.Path)
		}
		digest, err := sha256File(filePath)
		if err != nil {
			return "", nil, fmt.Errorf("verify %s: %w", asset.Path, err)
		}
		if !strings.EqualFold(digest, asset.SHA256) {
			return "", nil, fmt.Errorf("distribution asset digest mismatch: %s", asset.Path)
		}
		seenIndex = seenIndex || asset.Path == "web/index.html"
		seenRuntimeConfig = seenRuntimeConfig || asset.Path == "web/runtime-config.json"
		staticAssets[assetPath] = true
	}
	if !seenIndex || !seenRuntimeConfig {
		return "", nil, errors.New("distribution manifest omits required web assets")
	}
	webRoot := filepath.Join(root, "web")
	info, err := os.Stat(webRoot)
	if err != nil || !info.IsDir() {
		return "", nil, errors.New("distribution web directory is missing")
	}
	return webRoot, staticAssets, nil
}

func validManifestPath(value string) bool {
	return strings.HasPrefix(value, "web/") && value != "web/" && path.Clean(value) == value && !strings.Contains(value, "\\") && !strings.Contains(value, "//")
}

func validSHA256(value string) bool {
	if len(value) != sha256.Size*2 {
		return false
	}
	_, err := hex.DecodeString(value)
	return err == nil && value == strings.ToLower(value)
}

func validateLaunchOptions(port int) error {
	if port < 0 || port > 65535 {
		return errors.New("Web port must be between 0 and 65535")
	}
	return nil
}

func sha256File(name string) (string, error) {
	file, err := os.Open(name)
	if err != nil {
		return "", err
	}
	defer file.Close()
	digest := sha256.New()
	if _, err := io.Copy(digest, file); err != nil {
		return "", err
	}
	return hex.EncodeToString(digest.Sum(nil)), nil
}

func newHandler(
	webRoot string,
	staticAssets map[string]bool,
	origin string,
	proxy *captureProxy,
	aiTarget *url.URL,
) http.Handler {
	static := newStaticHandler(webRoot, staticAssets)
	var aiProxy *httputil.ReverseProxy
	if aiTarget != nil {
		aiProxy = httputil.NewSingleHostReverseProxy(aiTarget)
	}
	return http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		addSecurityHeaders(writer.Header())
		if request.URL.Path == runtimeConfigPath {
			if request.Method != http.MethodGet && request.Method != http.MethodHead {
				methodNotAllowed(writer)
				return
			}
			writeRuntimeConfig(writer, aiTarget != nil)
			return
		}
		if strings.HasPrefix(request.URL.Path, aiPrefix) {
			if aiProxy == nil {
				http.NotFound(writer, request)
				return
			}
			serveAI(writer, request, aiProxy)
			return
		}
		if strings.HasPrefix(request.URL.Path, capturePrefix) {
			if proxy == nil {
				http.NotFound(writer, request)
				return
			}
			serveCapture(writer, request, origin, proxy)
			return
		}
		static.ServeHTTP(writer, request)
	})
}

func newStaticHandler(webRoot string, staticAssets map[string]bool) http.Handler {
	return http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		if request.Method != http.MethodGet && request.Method != http.MethodHead {
			methodNotAllowed(writer)
			return
		}
		if !validStaticQuery(request.URL) || strings.Contains(request.URL.Path, "\\") {
			http.Error(writer, "invalid resource path", http.StatusBadRequest)
			return
		}
		requestPath := request.URL.Path
		if requestPath == "/" {
			requestPath = "/index.html"
		}
		for _, segment := range strings.Split(requestPath, "/") {
			if segment == "." || segment == ".." {
				http.Error(writer, "invalid resource path", http.StatusBadRequest)
				return
			}
		}
		cleaned := path.Clean(requestPath)
		if !strings.HasPrefix(cleaned, "/") {
			http.Error(writer, "invalid resource path", http.StatusBadRequest)
			return
		}
		assetPath := strings.TrimPrefix(cleaned, "/")
		if !staticAssets[assetPath] {
			http.NotFound(writer, request)
			return
		}
		filePath := filepath.Join(webRoot, filepath.FromSlash(assetPath))
		relative, err := filepath.Rel(webRoot, filePath)
		if err != nil || relative == ".." || strings.HasPrefix(relative, ".."+string(os.PathSeparator)) {
			http.Error(writer, "invalid resource path", http.StatusBadRequest)
			return
		}
		file, err := os.Open(filePath)
		if err != nil {
			http.NotFound(writer, request)
			return
		}
		defer file.Close()
		info, err := file.Stat()
		if err != nil || info.IsDir() {
			http.NotFound(writer, request)
			return
		}
		if contentType := mime.TypeByExtension(filepath.Ext(filePath)); contentType != "" {
			writer.Header().Set("Content-Type", contentType)
		}
		if strings.HasSuffix(filePath, ".html") {
			writer.Header().Set("Cache-Control", "no-store")
		} else {
			writer.Header().Set("Cache-Control", "public, max-age=31536000, immutable")
		}
		http.ServeContent(writer, request, info.Name(), info.ModTime(), file)
	})
}

// Privacy mode is an entry-page flag, not an arbitrary asset/query capability.
// Match raw spelling so duplicate, escaped and malformed query variants fail closed.
func validStaticQuery(resource *url.URL) bool {
	if resource.RawQuery == "" {
		return true
	}
	if resource.Path != "/" && resource.Path != "/index.html" {
		return false
	}
	if resource.EscapedPath() != resource.Path {
		return false
	}
	return resource.RawQuery == "no-persistence" || resource.RawQuery == "no-persistence="
}

func writeRuntimeConfig(writer http.ResponseWriter, aiEnabled bool) {
	writer.Header().Set("Content-Type", "application/json; charset=utf-8")
	writer.Header().Set("Cache-Control", "no-store")
	capture := map[string]string{
		"provider": "loopback-proxy-v1",
		"endpoint": "./capture/",
	}
	config := map[string]any{
		"schemaVersion": 1,
		"host":          map[string]string{"kind": "standalone"},
		"capture":       capture,
	}
	if aiEnabled {
		config["ai"] = map[string]string{
			"provider": "loopback-ai-v1",
			"endpoint": "./ai/",
		}
	}
	_ = json.NewEncoder(writer).Encode(config)
}

func parseAIURL(raw string) (*url.URL, error) {
	if raw == "" {
		return nil, nil
	}
	target, err := url.Parse(raw)
	if err != nil || target.Scheme != "http" || target.User != nil || target.Path != "" || target.RawQuery != "" || target.Fragment != "" {
		return nil, errors.New("AI gateway URL must be a loopback http URL without path, query or credentials")
	}
	host := target.Hostname()
	if host != "127.0.0.1" && host != "localhost" && host != "[::1]" && host != "::1" {
		return nil, errors.New("AI gateway URL must target loopback")
	}
	if target.Port() == "" {
		return nil, errors.New("AI gateway URL must include an explicit port")
	}
	return target, nil
}

func serveAI(writer http.ResponseWriter, request *http.Request, proxy *httputil.ReverseProxy) {
	if request.Method != http.MethodGet && request.Method != http.MethodPost && request.Method != http.MethodDelete {
		methodNotAllowed(writer)
		return
	}
	if !validAIQuery(request) || !strings.HasPrefix(request.URL.Path, aiPrefix) {
		http.Error(writer, "invalid AI request", http.StatusBadRequest)
		return
	}
	parts := strings.Split(strings.TrimPrefix(request.URL.Path, aiPrefix), "/")
	if request.Method == http.MethodGet && len(parts) == 4 && parts[0] == "api" && parts[1] == "sessions" && parts[2] != "" && parts[3] == "stream" {
		// SSE waits can outlive the normal response deadline while a model runs.
		// Browser disconnects still cancel the proxied request via its context.
		if err := http.NewResponseController(writer).SetWriteDeadline(time.Time{}); err != nil && !errors.Is(err, http.ErrNotSupported) {
			http.Error(writer, "AI stream is unavailable", http.StatusServiceUnavailable)
			return
		}
	}
	forwarded := request.Clone(request.Context())
	forwarded.URL.Path = strings.TrimPrefix(request.URL.Path, strings.TrimSuffix(aiPrefix, "/"))
	if forwarded.URL.Path == "" {
		forwarded.URL.Path = "/"
	}
	forwarded.URL.RawPath = ""
	proxy.ServeHTTP(writer, forwarded)
}

// AI replay and report selection use bounded, route-specific query fields.
// Keep all other queries rejected rather than widening the proxy boundary.
func validAIQuery(request *http.Request) bool {
	if request.URL.RawQuery == "" {
		return true
	}
	if request.Method != http.MethodGet {
		return false
	}
	query, err := url.ParseQuery(request.URL.RawQuery)
	if err != nil || len(query) != 1 {
		return false
	}
	if strings.HasSuffix(request.URL.Path, "/stream") {
		values := query["after"]
		if len(values) != 1 || len(values[0]) == 0 || len(values[0]) > 16 {
			return false
		}
		for _, digit := range values[0] {
			if digit < '0' || digit > '9' {
				return false
			}
		}
		return true
	}
	if strings.HasSuffix(request.URL.Path, "/report") {
		values := query["format"]
		return len(values) == 1 && (values[0] == "markdown" || values[0] == "html")
	}
	return false
}

func serveCapture(writer http.ResponseWriter, request *http.Request, origin string, proxy *captureProxy) {
	if request.Method != http.MethodGet && request.Method != http.MethodPost {
		methodNotAllowed(writer)
		return
	}
	if request.URL.RawQuery != "" || !validCapturePath(request.URL.Path) {
		http.Error(writer, "invalid capture request", http.StatusBadRequest)
		return
	}
	if request.Method == http.MethodPost && !strings.HasPrefix(strings.ToLower(request.Header.Get("Content-Type")), "application/json") {
		http.Error(writer, "capture requests must use JSON", http.StatusUnsupportedMediaType)
		return
	}
	if request.ContentLength > 1<<20 {
		http.Error(writer, "capture request is too large", http.StatusRequestEntityTooLarge)
		return
	}
	if !authorizedCaptureRequest(request, origin) {
		http.Error(writer, "capture request origin is not authorized", http.StatusForbidden)
		return
	}

	cloned := request.Clone(request.Context())
	cloned.URL.Path = strings.TrimPrefix(request.URL.Path, capturePrefix)
	if cloned.URL.Path == "" {
		cloned.URL.Path = "/"
	} else {
		cloned.URL.Path = "/" + cloned.URL.Path
	}
	// Preserve the browser-facing origin through the reverse-proxy hop. The
	// Python proxy validates both fields independently of the session token.
	cloned.Host = request.Host
	cloned.Header.Set("Origin", origin)
	cloned.Header.Set("Winscope-Token", proxy.secret)
	cloned.Header.Del("Cookie")
	cloned.Header.Del("Authorization")
	http.MaxBytesReader(writer, cloned.Body, 1<<20)

	reverse := httputil.NewSingleHostReverseProxy(proxy.url)
	reverse.ErrorHandler = func(response http.ResponseWriter, _ *http.Request, _ error) {
		http.Error(response, "launcher-managed capture service is unavailable", http.StatusBadGateway)
	}
	reverse.ServeHTTP(writer, cloned)
}

func authorizedCaptureRequest(request *http.Request, origin string) bool {
	if request.Host != strings.TrimPrefix(origin, "http://") {
		return false
	}
	requestOrigin := request.Header.Get("Origin")
	if requestOrigin == "" {
		// Browsers commonly omit Origin on same-origin GET requests. Read-only
		// capture endpoints remain protected by the exact loopback Host check;
		// state-changing POST requests must include the same-origin header.
		return request.Method == http.MethodGet
	}
	return requestOrigin == origin
}

func validCapturePath(value string) bool {
	if !strings.HasPrefix(value, capturePrefix) || strings.Contains(value, "\\") {
		return false
	}
	endpointPath := strings.TrimSuffix(strings.TrimPrefix(value, capturePrefix), "/")
	if endpointPath == "" || strings.Contains(endpointPath, "//") {
		return false
	}
	for _, segment := range strings.Split(endpointPath, "/") {
		if segment == "" || segment == "." || segment == ".." {
			return false
		}
	}
	return true
}

func methodNotAllowed(writer http.ResponseWriter) {
	writer.Header().Set("Allow", "GET, HEAD, POST")
	http.Error(writer, "method not allowed", http.StatusMethodNotAllowed)
}

func addSecurityHeaders(header http.Header) {
	header.Set("Content-Security-Policy", securityHeaders)
	header.Set("X-Content-Type-Options", "nosniff")
	header.Set("Referrer-Policy", "no-referrer")
	header.Set("Cross-Origin-Opener-Policy", "same-origin")
	header.Set("Cross-Origin-Resource-Policy", "same-origin")
	header.Set("Permissions-Policy", "camera=(), microphone=(), geolocation=()")
}

func startCaptureProxy(root, origin string) (*captureProxy, error) {
	return startCaptureProxyWithParent(root, origin, nil)
}

func startCaptureProxyWithParent(root, origin string, parentDone <-chan struct{}) (*captureProxy, error) {
	adb, err := adbCommand(root, runtime.GOOS)
	if err != nil {
		return nil, err
	}
	capture, err := captureCommand(root, runtime.GOOS, exec.LookPath)
	if err != nil {
		return nil, err
	}
	secret, err := randomSecret()
	if err != nil {
		return nil, err
	}
	arguments := append([]string{}, capture.prefixArguments...)
	arguments = append(arguments, "--port", "0", "--token", secret, "--allowed-origin", origin, "--parent-pipe")
	command := exec.Command(capture.path, arguments...)
	command.Env = captureEnvironment(root, adb, runtime.GOOS, os.Environ())
	command.Stderr = os.Stderr
	proxy, err := startCaptureCommand(command, parentDone)
	if err != nil {
		return nil, err
	}
	proxy.secret = secret
	return proxy, nil
}

func startCaptureCommand(command *exec.Cmd, parentDone <-chan struct{}) (*captureProxy, error) {
	stdin, err := command.StdinPipe()
	if err != nil {
		return nil, err
	}
	stdout, err := command.StdoutPipe()
	if err != nil {
		_ = stdin.Close()
		return nil, err
	}
	if err := command.Start(); err != nil {
		_ = stdin.Close()
		_ = stdout.Close()
		return nil, fmt.Errorf("start launcher-managed capture proxy: %w", err)
	}
	proxy := &captureProxy{command: command, stdin: stdin, done: make(chan struct{})}
	ready := make(chan string, 1)
	go func() {
		line, _ := bufio.NewReader(stdout).ReadString('\n')
		ready <- strings.TrimSpace(line)
		_ = command.Wait()
		close(proxy.done)
	}()
	select {
	case line := <-ready:
		fields := strings.Fields(line)
		if len(fields) != 2 || fields[0] != "READY" {
			proxy.stop()
			return nil, errors.New("launcher-managed capture proxy did not report a valid loopback port")
		}
		port, err := parseLoopbackPort(fields[1])
		if err != nil {
			proxy.stop()
			return nil, err
		}
		proxy.url, _ = url.Parse("http://127.0.0.1:" + port)
		return proxy, nil
	case <-parentDone:
		proxy.stop()
		return nil, errors.New("desktop host closed during capture startup")
	case <-time.After(10 * time.Second):
		proxy.stop()
		return nil, errors.New("launcher-managed capture proxy did not become ready")
	}
}

func parseLoopbackPort(value string) (string, error) {
	address, err := net.ResolveTCPAddr("tcp", "127.0.0.1:"+value)
	if err != nil || address.Port < 1 || address.Port > 65535 {
		return "", errors.New("launcher-managed capture proxy reported an invalid port")
	}
	return value, nil
}

type executableCommand struct {
	path            string
	prefixArguments []string
}

func adbCommand(distributionRoot string, goos string) (string, error) {
	filename := "adb"
	if goos == "windows" {
		filename = "adb.exe"
	}
	bundled := filepath.Join(distributionRoot, "platform-tools", filename)
	if info, err := os.Lstat(bundled); err == nil {
		if !info.Mode().IsRegular() {
			return "", errors.New("packaged Android Platform Tools executable is not a regular file")
		}
		return bundled, nil
	}
	if command, err := exec.LookPath("adb"); err == nil {
		return command, nil
	}
	candidates := []string{}
	for _, environmentVariable := range []string{"ANDROID_SDK_ROOT", "ANDROID_HOME"} {
		if sdkRoot := os.Getenv(environmentVariable); sdkRoot != "" {
			candidates = append(candidates, filepath.Join(sdkRoot, "platform-tools", filename))
		}
	}
	switch goos {
	case "windows":
		if localAppData := os.Getenv("LOCALAPPDATA"); localAppData != "" {
			candidates = append(candidates, filepath.Join(localAppData, "Android", "Sdk", "platform-tools", filename))
		}
		if userProfile := os.Getenv("USERPROFILE"); userProfile != "" {
			candidates = append(candidates, filepath.Join(userProfile, "AppData", "Local", "Android", "Sdk", "platform-tools", filename))
		}
	case "darwin", "linux":
		if home, err := os.UserHomeDir(); err == nil {
			if goos == "darwin" {
				candidates = append(candidates, filepath.Join(home, "Library", "Android", "sdk", "platform-tools", filename))
			} else {
				candidates = append(candidates, filepath.Join(home, "Android", "Sdk", "platform-tools", filename))
			}
		}
	}
	for _, candidate := range candidates {
		if info, err := os.Stat(candidate); err == nil && !info.IsDir() {
			return candidate, nil
		}
	}
	return "", errors.New("device capture requires Android Platform Tools (adb)")
}

func captureCommand(
	root string,
	goos string,
	lookPath func(string) (string, error),
) (executableCommand, error) {
	filename := "winscope-capture"
	if goos == "windows" {
		filename += ".exe"
	}
	bundled := filepath.Join(root, "capture", filename)
	if info, err := os.Lstat(bundled); err == nil {
		if !info.Mode().IsRegular() {
			return executableCommand{}, errors.New("packaged capture executable is not a regular file")
		}
		return executableCommand{path: bundled}, nil
	} else if !os.IsNotExist(err) {
		return executableCommand{}, fmt.Errorf("read packaged capture executable: %w", err)
	}
	python, err := pythonCommand(goos, lookPath)
	if err != nil {
		return executableCommand{}, err
	}
	proxyPath := filepath.Join(root, "proxy", "winscope_proxy.py")
	if info, err := os.Stat(proxyPath); err != nil || !info.Mode().IsRegular() {
		return executableCommand{}, errors.New("launcher-managed capture proxy is missing")
	}
	python.prefixArguments = append(python.prefixArguments, proxyPath)
	return python, nil
}

func pythonCommand(
	goos string,
	lookPath func(string) (string, error),
) (executableCommand, error) {
	candidates := []executableCommand{
		{path: "python3"},
		{path: "python"},
	}
	if goos == "windows" {
		candidates = []executableCommand{
			{path: "py", prefixArguments: []string{"-3"}},
			{path: "python"},
			{path: "python3"},
		}
	}
	for _, candidate := range candidates {
		if command, err := lookPath(candidate.path); err == nil {
			candidate.path = command
			return candidate, nil
		}
	}
	return executableCommand{}, errors.New("device capture requires Python 3.10+")
}

func captureEnvironment(root, adb, goos string, baseEnv []string) []string {
	libraryPath := ""
	if goos == "linux" {
		absoluteRoot, err := filepath.Abs(root)
		if err == nil && adb == filepath.Join(absoluteRoot, "platform-tools", "adb") {
			candidate := filepath.Join(absoluteRoot, "platform-tools", "lib64")
			if info, err := os.Lstat(candidate); err == nil && info.IsDir() && !strings.Contains(candidate, ":") {
				libraryPath = candidate
			}
		}
	}
	// Only the ADB leaf consumes this private hint; capture keeps its loader env.
	environment := environmentWithValue(baseEnv, "WINSCOPE_ADB", adb)
	return environmentWithValue(environment, "WINSCOPE_ADB_LIBRARY_PATH", libraryPath)
}

func environmentWithValue(environment []string, key string, value string) []string {
	prefix := key + "="
	updated := make([]string, 0, len(environment)+1)
	for _, entry := range environment {
		name, _, found := strings.Cut(entry, "=")
		if found && strings.EqualFold(name, key) {
			continue
		}
		updated = append(updated, entry)
	}
	return append(updated, prefix+value)
}

func randomSecret() (string, error) {
	value := make([]byte, 32)
	if _, err := rand.Read(value); err != nil {
		return "", err
	}
	return hex.EncodeToString(value), nil
}

func (proxy *captureProxy) stop() {
	if proxy == nil || proxy.command == nil || proxy.command.Process == nil {
		return
	}
	proxy.stopOnce.Do(func() {
		// Closing our private pipe works for Python and frozen capture on Windows,
		// unlike os.Interrupt, and lets capture reap only its own ADB children.
		_ = proxy.stdin.Close()
		select {
		case <-proxy.done:
		case <-time.After(shutdownGracePeriod):
			_ = proxy.command.Process.Kill()
			<-proxy.done
		}
	})
}

func openLocalURL(value string) error {
	return openLocalURLWithBrowser(value, "")
}

func openLocalURLWithBrowser(value string, browser string) error {
	if browser != "" {
		command, err := exec.LookPath(browser)
		if err != nil {
			return fmt.Errorf("find requested browser: %w", err)
		}
		return exec.Command(command, value).Start()
	}
	var command *exec.Cmd
	switch runtime.GOOS {
	case "darwin":
		command = exec.Command("open", value)
	case "windows":
		command = exec.Command("rundll32", "url.dll,FileProtocolHandler", value)
	default:
		command = exec.Command("xdg-open", value)
	}
	return command.Start()
}
