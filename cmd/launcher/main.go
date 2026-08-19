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
	"syscall"
	"time"
)

const (
	capturePrefix       = "/capture/"
	runtimeConfigPath   = "/runtime-config.json"
	maxManifestBytes    = 4 << 20
	shutdownGracePeriod = 5 * time.Second
	securityHeaders     = "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; worker-src 'self' blob:; connect-src 'self'"
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
	command *exec.Cmd
	url     *url.URL
	secret  string
}

func main() {
	var distributionRoot string
	var enableCapture bool
	var openBrowser bool
	flag.StringVar(&distributionRoot, "root", defaultDistributionRoot(), "path to the packaged aosp-winscope distribution")
	flag.BoolVar(&enableCapture, "capture", false, "start the launcher-managed Android device capture session")
	flag.BoolVar(&openBrowser, "open", false, "open the local Winscope URL with the operating system browser handler")
	flag.Parse()

	root, err := filepath.Abs(distributionRoot)
	if err != nil {
		log.Fatal(err)
	}
	webRoot, staticAssets, err := validateDistribution(root)
	if err != nil {
		log.Fatal(err)
	}

	listener, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		log.Fatal(err)
	}
	defer listener.Close()

	origin := "http://" + listener.Addr().String()
	var proxy *captureProxy
	if enableCapture {
		proxy, err = startCaptureProxy(root, origin)
		if err != nil {
			log.Fatal(err)
		}
		defer proxy.stop()
	}

	server := &http.Server{
		Handler:      newHandler(webRoot, staticAssets, origin, proxy),
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 60 * time.Second,
		IdleTimeout:  60 * time.Second,
	}
	url := origin + "/"
	fmt.Println("Winscope is available at " + url)
	if openBrowser {
		if err := openLocalURL(url); err != nil {
			log.Printf("Could not open a browser: %v", err)
		}
	}

	errCh := make(chan error, 1)
	go func() { errCh <- server.Serve(listener) }()
	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt, syscall.SIGTERM)
	select {
	case <-stop:
	case err := <-errCh:
		if !errors.Is(err, http.ErrServerClosed) {
			log.Printf("Local server stopped: %v", err)
		}
	}
	ctx, cancel := context.WithTimeout(context.Background(), shutdownGracePeriod)
	defer cancel()
	if err := server.Shutdown(ctx); err != nil {
		log.Printf("Local server shutdown failed: %v", err)
	}
}

func defaultDistributionRoot() string {
	executable, err := os.Executable()
	if err == nil {
		// Packaged launchers live at bin/<os>-<arch>/winscope-launcher.
		candidate := filepath.Clean(filepath.Join(filepath.Dir(executable), "..", ".."))
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

func newHandler(webRoot string, staticAssets map[string]bool, origin string, proxy *captureProxy) http.Handler {
	static := newStaticHandler(webRoot, staticAssets)
	return http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		addSecurityHeaders(writer.Header())
		if request.URL.Path == runtimeConfigPath {
			if request.Method != http.MethodGet && request.Method != http.MethodHead {
				methodNotAllowed(writer)
				return
			}
			writeRuntimeConfig(writer, proxy != nil)
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
		if request.URL.RawQuery != "" || strings.Contains(request.URL.Path, "\\") {
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

func writeRuntimeConfig(writer http.ResponseWriter, captureEnabled bool) {
	writer.Header().Set("Content-Type", "application/json; charset=utf-8")
	writer.Header().Set("Cache-Control", "no-store")
	config := `{"schemaVersion":1,"host":{"kind":"standalone"},"capture":{"provider":"none"}}`
	if captureEnabled {
		config = `{"schemaVersion":1,"host":{"kind":"standalone"},"capture":{"provider":"loopback-proxy-v1","endpoint":"./capture/"}}`
	}
	_, _ = io.WriteString(writer, config+"\n")
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
	if request.Header.Get("Origin") != origin || request.Host != strings.TrimPrefix(origin, "http://") {
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
	if _, err := exec.LookPath("adb"); err != nil {
		return nil, errors.New("device capture requires adb in PATH")
	}
	python, err := pythonCommand()
	if err != nil {
		return nil, err
	}
	proxyPath := filepath.Join(root, "proxy", "winscope_proxy.py")
	if info, err := os.Stat(proxyPath); err != nil || info.IsDir() {
		return nil, errors.New("launcher-managed capture proxy is missing")
	}
	secret, err := randomSecret()
	if err != nil {
		return nil, err
	}
	command := exec.Command(python, proxyPath, "--port", "0", "--token", secret, "--allowed-origin", origin)
	command.Stderr = os.Stderr
	stdout, err := command.StdoutPipe()
	if err != nil {
		return nil, err
	}
	if err := command.Start(); err != nil {
		return nil, fmt.Errorf("start launcher-managed capture proxy: %w", err)
	}
	ready := make(chan string, 1)
	go func() {
		line, readErr := bufio.NewReader(stdout).ReadString('\n')
		if readErr == nil || len(line) > 0 {
			ready <- strings.TrimSpace(line)
		}
	}()
	select {
	case line := <-ready:
		fields := strings.Fields(line)
		if len(fields) != 2 || fields[0] != "READY" {
			_ = command.Process.Kill()
			_ = command.Wait()
			return nil, errors.New("launcher-managed capture proxy did not report a valid loopback port")
		}
		port, err := parseLoopbackPort(fields[1])
		if err != nil {
			_ = command.Process.Kill()
			_ = command.Wait()
			return nil, err
		}
		proxyURL, _ := url.Parse("http://127.0.0.1:" + port)
		return &captureProxy{command: command, url: proxyURL, secret: secret}, nil
	case <-time.After(10 * time.Second):
		_ = command.Process.Kill()
		_ = command.Wait()
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

func pythonCommand() (string, error) {
	for _, candidate := range []string{"python3", "python"} {
		if command, err := exec.LookPath(candidate); err == nil {
			return command, nil
		}
	}
	return "", errors.New("device capture requires Python 3.10+ in PATH")
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
	_ = proxy.command.Process.Signal(os.Interrupt)
	done := make(chan error, 1)
	go func() { done <- proxy.command.Wait() }()
	select {
	case <-done:
	case <-time.After(shutdownGracePeriod):
		_ = proxy.command.Process.Kill()
		<-done
	}
}

func openLocalURL(value string) error {
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
