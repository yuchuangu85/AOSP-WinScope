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

package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/http/httptest"
	"net/url"
	"os"
	"path/filepath"
	"strings"
	"testing"
	"time"
)

func TestValidManifestPath(t *testing.T) {
	tests := map[string]bool{
		"web/index.html":      true,
		"web/assets/app.js":   true,
		"":                    false,
		"web/":                false,
		"index.html":          false,
		"web/../secret":       false,
		"web/./index.html":    false,
		"web/assets//app.js":  false,
		"web\\assets\\app.js": false,
	}
	for value, want := range tests {
		if got := validManifestPath(value); got != want {
			t.Errorf("validManifestPath(%q) = %t, want %t", value, got, want)
		}
	}
}

func TestValidSHA256(t *testing.T) {
	tests := map[string]bool{
		"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855": true,
		"E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855": false,
		"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b85":  false,
		"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b85z": false,
		"": false,
	}
	for value, want := range tests {
		if got := validSHA256(value); got != want {
			t.Errorf("validSHA256(%q) = %t, want %t", value, got, want)
		}
	}
}

func TestValidCapturePath(t *testing.T) {
	tests := map[string]bool{
		"/capture/status":        true,
		"/capture/session/start": true,
		"/capture/":              false,
		"/capture":               false,
		"/capture/../secret":     false,
		"/capture/./status":      false,
		"/capture//status":       false,
		"/capture/status/":       true,
		"/capture\\status":       false,
		"/other/status":          false,
	}
	for value, want := range tests {
		if got := validCapturePath(value); got != want {
			t.Errorf("validCapturePath(%q) = %t, want %t", value, got, want)
		}
	}
}

func TestParseLoopbackPort(t *testing.T) {
	tests := map[string]bool{
		"1":     true,
		"65535": true,
		"0":     false,
		"65536": false,
		"-1":    false,
		"abc":   false,
		"1/2":   false,
	}
	for value, wantValid := range tests {
		got, err := parseLoopbackPort(value)
		if (err == nil) != wantValid {
			t.Errorf("parseLoopbackPort(%q) error = %v, want valid = %t", value, err, wantValid)
		}
		if wantValid && got != value {
			t.Errorf("parseLoopbackPort(%q) = %q, want original value", value, got)
		}
	}
}

func TestDefaultLaunchFlags(t *testing.T) {
	tests := []struct {
		name      string
		arguments []string
		wantOpen  bool
	}{
		{name: "no arguments", wantOpen: true},
		{name: "explicit port", arguments: []string{"--port", "56745"}},
		{name: "explicit open", arguments: []string{"--open"}, wantOpen: true},
	}
	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			if got := defaultLaunchFlags(test.arguments); got != test.wantOpen {
				t.Fatalf("defaultLaunchFlags(%v) = %t, want %t", test.arguments, got, test.wantOpen)
			}
		})
	}
}

func TestDistributionRootForExecutable(t *testing.T) {
	root := t.TempDir()
	if err := os.WriteFile(filepath.Join(root, "manifest.json"), []byte("{}"), 0600); err != nil {
		t.Fatal(err)
	}

	tests := []struct {
		name       string
		executable string
	}{
		{name: "root Windows entry point", executable: filepath.Join(root, "AOSP-WinScope.exe")},
		{name: "nested platform launcher", executable: filepath.Join(root, "bin", "windows-amd64", "winscope-launcher.exe")},
	}
	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			if got := distributionRootForExecutable(test.executable); got != root {
				t.Fatalf("distributionRootForExecutable(%q) = %q, want %q", test.executable, got, root)
			}
		})
	}
}

func TestValidateLaunchOptions(t *testing.T) {
	for _, port := range []int{0, 1, 8080, 65535} {
		if err := validateLaunchOptions(port); err != nil {
			t.Errorf("validateLaunchOptions(%d) error = %v", port, err)
		}
	}
	for _, port := range []int{-1, 65536} {
		if err := validateLaunchOptions(port); err == nil {
			t.Errorf("validateLaunchOptions(%d) unexpectedly succeeded", port)
		}
	}
}

func TestParseAIURLRequiresLoopbackWithPort(t *testing.T) {
	valid, err := parseAIURL("http://127.0.0.1:7341")
	if err != nil || valid == nil {
		t.Fatalf("valid AI URL = %v, %v", valid, err)
	}
	for _, raw := range []string{
		"",
		"https://127.0.0.1:7341",
		"http://example.test:7341",
		"http://127.0.0.1",
		"http://127.0.0.1:7341/ai",
		"http://user:pass@127.0.0.1:7341",
	} {
		if _, err := parseAIURL(raw); raw != "" && err == nil {
			t.Errorf("parseAIURL(%q) unexpectedly succeeded", raw)
		}
	}
}

func TestAIProxyUsesSameOriginPathAndRuntimeConfig(t *testing.T) {
	gateway := httptest.NewServer(http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		if request.URL.Path != "/health" {
			t.Fatalf("gateway path = %q, want /health", request.URL.Path)
		}
		writer.Header().Set("Content-Type", "application/json")
		_, _ = writer.Write([]byte(`{"ok":true}`))
	}))
	defer gateway.Close()
	aiTarget, err := url.Parse(gateway.URL)
	if err != nil {
		t.Fatal(err)
	}
	webRoot := t.TempDir()
	if err := os.WriteFile(filepath.Join(webRoot, "index.html"), []byte("ok"), 0600); err != nil {
		t.Fatal(err)
	}
	handler := newHandler(webRoot, map[string]bool{"index.html": true}, "http://127.0.0.1:1234", nil, aiTarget)
	recorder := httptest.NewRecorder()
	handler.ServeHTTP(recorder, httptest.NewRequest(http.MethodGet, "http://127.0.0.1:1234/ai/health", nil))
	if recorder.Code != http.StatusOK || recorder.Body.String() != `{"ok":true}` {
		t.Fatalf("AI proxy response = (%d, %q)", recorder.Code, recorder.Body.String())
	}
	recorder = httptest.NewRecorder()
	handler.ServeHTTP(recorder, httptest.NewRequest(http.MethodGet, "http://127.0.0.1:1234/runtime-config.json", nil))
	var config map[string]any
	if err := json.NewDecoder(recorder.Body).Decode(&config); err != nil {
		t.Fatal(err)
	}
	ai, ok := config["ai"].(map[string]any)
	if !ok || ai["provider"] != "loopback-ai-v1" || ai["endpoint"] != "./ai/" {
		t.Fatalf("runtime AI config = %#v", config["ai"])
	}
}

func TestAIEventStreamOutlivesServerWriteTimeout(t *testing.T) {
	for _, flushEarly := range []bool{false, true} {
		t.Run(fmt.Sprintf("flushEarly=%t", flushEarly), func(t *testing.T) {
			gateway := httptest.NewServer(http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
				writer.Header().Set("Content-Type", "text/event-stream")
				if flushEarly {
					_, _ = io.WriteString(writer, "event: analysis_started\ndata: {}\n\n")
					writer.(http.Flusher).Flush()
				}
				time.Sleep(200 * time.Millisecond)
				_, _ = io.WriteString(writer, "event: analysis_completed\ndata: {\"answer\":\"delayed\"}\n\n")
			}))
			defer gateway.Close()
			target, _ := url.Parse(gateway.URL)
			launcher := httptest.NewUnstartedServer(newHandler(t.TempDir(), nil, "http://127.0.0.1:1234", nil, target))
			launcher.Config.WriteTimeout = 50 * time.Millisecond
			launcher.Start()
			defer launcher.Close()
			client := &http.Client{Timeout: 3 * time.Second}
			response, err := client.Get(launcher.URL + "/ai/api/sessions/slow/stream?after=0")
			if err != nil {
				t.Fatal(err)
			}
			defer response.Body.Close()
			body, err := io.ReadAll(response.Body)
			if err != nil {
				t.Fatalf("event stream interrupted: %v", err)
			}
			if response.StatusCode != http.StatusOK || !strings.Contains(string(body), "analysis_completed") {
				t.Fatalf("missing delayed completion: status=%d body=%q", response.StatusCode, body)
			}
		})
	}
}

func TestAIEventStreamDisconnectCancelsUpstream(t *testing.T) {
	cancelled := make(chan struct{})
	gateway := httptest.NewServer(http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		writer.Header().Set("Content-Type", "text/event-stream")
		_, _ = io.WriteString(writer, "event: analysis_started\ndata: {}\n\n")
		writer.(http.Flusher).Flush()
		<-request.Context().Done()
		close(cancelled)
	}))
	defer gateway.Close()
	target, _ := url.Parse(gateway.URL)
	launcher := httptest.NewUnstartedServer(newHandler(t.TempDir(), nil, "http://127.0.0.1:1234", nil, target))
	launcher.Config.WriteTimeout = 50 * time.Millisecond
	launcher.Start()
	defer launcher.Close()
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	request, _ := http.NewRequestWithContext(ctx, http.MethodGet, launcher.URL+"/ai/api/sessions/slow/stream", nil)
	response, err := http.DefaultClient.Do(request)
	if err != nil {
		t.Fatal(err)
	}
	cancel()
	response.Body.Close()
	select {
	case <-cancelled:
	case <-time.After(2 * time.Second):
		t.Fatal("browser disconnect did not cancel upstream stream")
	}
}

type deadlineRecorder struct {
	*httptest.ResponseRecorder
	deadlines []time.Time
}

func (writer *deadlineRecorder) SetWriteDeadline(deadline time.Time) error {
	writer.deadlines = append(writer.deadlines, deadline)
	return nil
}

func TestOnlyAIEventStreamClearsWriteDeadline(t *testing.T) {
	gateway := httptest.NewServer(http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		_, _ = io.WriteString(writer, "ok")
	}))
	defer gateway.Close()
	target, _ := url.Parse(gateway.URL)
	handler := newHandler(t.TempDir(), nil, "http://127.0.0.1:1234", nil, target)
	for _, test := range []struct {
		method string
		path   string
		clear  bool
	}{
		{http.MethodGet, "/ai/api/sessions/a/stream?after=0", true},
		{http.MethodPost, "/ai/api/analyze", false},
		{http.MethodGet, "/ai/api/sessions/a/report?format=markdown", false},
		{http.MethodGet, "/ai/other/stream", false},
		{http.MethodPost, "/ai/api/sessions/a/stream", false},
		{http.MethodGet, "/ai/api/sessions/a/stream?secret=x", false},
	} {
		t.Run(test.method+test.path, func(t *testing.T) {
			writer := &deadlineRecorder{ResponseRecorder: httptest.NewRecorder()}
			handler.ServeHTTP(writer, httptest.NewRequest(test.method, "http://127.0.0.1:1234"+test.path, nil))
			if got := len(writer.deadlines) == 1 && writer.deadlines[0].IsZero(); got != test.clear {
				t.Fatalf("cleared deadline = %t, want %t", got, test.clear)
			}
		})
	}
}

func TestStaticHandlerRejectsHostileRequests(t *testing.T) {
	webRoot := t.TempDir()
	if err := os.WriteFile(filepath.Join(webRoot, "index.html"), []byte("ok"), 0600); err != nil {
		t.Fatal(err)
	}
	handler := newHandler(webRoot, map[string]bool{"index.html": true}, "http://127.0.0.1:1234", nil, nil)

	tests := []struct {
		name   string
		path   string
		query  string
		method string
		want   int
	}{
		{name: "parent traversal", path: "/../secret", want: http.StatusBadRequest},
		{name: "dot traversal", path: "/./index.html", want: http.StatusBadRequest},
		{name: "query string", path: "/index.html", query: "x=1", want: http.StatusBadRequest},
		{name: "method", path: "/index.html", method: http.MethodPost, want: http.StatusMethodNotAllowed},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			method := tt.method
			if method == "" {
				method = http.MethodGet
			}
			request := httptest.NewRequest(method, "http://example.test"+tt.path, nil)
			request.URL.RawQuery = tt.query
			recorder := httptest.NewRecorder()
			handler.ServeHTTP(recorder, request)
			if recorder.Code != tt.want {
				t.Fatalf("status = %d, want %d", recorder.Code, tt.want)
			}
		})
	}
}

func TestStaticHandlerPrivacyEntryFlag(t *testing.T) {
	webRoot := t.TempDir()
	for name, content := range map[string]string{"index.html": "privacy entry", "app.js": "asset"} {
		if err := os.WriteFile(filepath.Join(webRoot, name), []byte(content), 0600); err != nil {
			t.Fatal(err)
		}
	}
	handler := newHandler(webRoot, map[string]bool{"index.html": true, "app.js": true}, "http://127.0.0.1:1234", nil, nil)
	for _, entry := range []string{"/", "/index.html"} {
		for _, flag := range []string{"no-persistence", "no-persistence="} {
			for _, method := range []string{http.MethodGet, http.MethodHead} {
				t.Run(method+entry+"?"+flag, func(t *testing.T) {
					request := httptest.NewRequest(method, "http://127.0.0.1:1234"+entry+"?"+flag, nil)
					recorder := httptest.NewRecorder()
					handler.ServeHTTP(recorder, request)
					if recorder.Code != http.StatusOK {
						t.Fatalf("privacy entry status = %d, want 200", recorder.Code)
					}
					if method == http.MethodGet && recorder.Body.String() != "privacy entry" {
						t.Fatalf("privacy entry body = %q", recorder.Body.String())
					}
					if got := recorder.Header().Get("Cache-Control"); got != "no-store" {
						t.Fatalf("privacy entry cache policy = %q", got)
					}
				})
			}
		}
	}
	for _, target := range []string{
		"/?unknown", "/?no-persistence=1", "/?no-persistence=false",
		"/?no-persistence&no-persistence", "/?no-persistence=&no-persistence=",
		"/?no-persistence&x=1", "/?x=1&no-persistence", "/?no-persistence&",
		"/?no-persistence;", "/?no-persistence%26x=1", "/?%6eo-persistence",
		"/?no%2dpersistence", "/?no-persistence=%00", "/?no-persistence=%",
		"/?no-persistence+", "/?NO-PERSISTENCE", "/?no-persistence==",
		"/app.js?no-persistence", "/app.js?no-persistence=", "/index.html/?no-persistence",
		"//index.html?no-persistence", "/./index.html?no-persistence", "/%69ndex.html?no-persistence",
		"/index%2ehtml?no-persistence", "/%2f?no-persistence",
	} {
		t.Run(target, func(t *testing.T) {
			recorder := httptest.NewRecorder()
			handler.ServeHTTP(recorder, httptest.NewRequest(http.MethodGet, "http://127.0.0.1:1234"+target, nil))
			if recorder.Code != http.StatusBadRequest {
				t.Fatalf("hostile privacy query status = %d, want 400", recorder.Code)
			}
		})
	}
}

func TestRuntimeConfigAlwaysEnablesCapture(t *testing.T) {
	webRoot := t.TempDir()
	if err := os.WriteFile(filepath.Join(webRoot, "index.html"), []byte("ok"), 0600); err != nil {
		t.Fatal(err)
	}
	handler := newHandler(
		webRoot,
		map[string]bool{"index.html": true},
		"http://127.0.0.1:1234",
		nil,
		nil,
	)
	recorder := httptest.NewRecorder()
	handler.ServeHTTP(
		recorder,
		httptest.NewRequest(http.MethodGet, "http://127.0.0.1:1234/runtime-config.json", nil),
	)
	if recorder.Code != http.StatusOK {
		t.Fatalf("runtime config status = %d", recorder.Code)
	}
	var config struct {
		Capture struct {
			Provider string `json:"provider"`
			Endpoint string `json:"endpoint"`
		} `json:"capture"`
	}
	if err := json.NewDecoder(recorder.Body).Decode(&config); err != nil {
		t.Fatal(err)
	}
	if config.Capture.Provider != "loopback-proxy-v1" || config.Capture.Endpoint != "./capture/" {
		t.Fatalf("runtime capture config = %#v", config.Capture)
	}
}

func TestHandlerAddsSecurityHeaders(t *testing.T) {
	webRoot := t.TempDir()
	if err := os.WriteFile(filepath.Join(webRoot, "index.html"), []byte("ok"), 0600); err != nil {
		t.Fatal(err)
	}
	handler := newHandler(webRoot, map[string]bool{"index.html": true}, "http://127.0.0.1:1234", nil, nil)
	recorder := httptest.NewRecorder()
	handler.ServeHTTP(recorder, httptest.NewRequest(http.MethodGet, "http://example.test/", nil))

	for name, want := range map[string]string{
		"Content-Security-Policy":      securityHeaders,
		"X-Content-Type-Options":       "nosniff",
		"Referrer-Policy":              "no-referrer",
		"Cross-Origin-Opener-Policy":   "same-origin",
		"Cross-Origin-Resource-Policy": "same-origin",
		"Permissions-Policy":           "camera=(), microphone=(), geolocation=()",
	} {
		if got := recorder.Header().Get(name); got != want {
			t.Errorf("%s = %q, want %q", name, got, want)
		}
	}
}

func TestCaptureRequestOrigin(t *testing.T) {
	origin := "http://127.0.0.1:1234"

	tests := []struct {
		name   string
		method string
		host   string
		origin string
		want   bool
	}{
		{name: "same-origin GET without browser Origin header", method: http.MethodGet, host: "127.0.0.1:1234", want: true},
		{name: "same-origin GET with Origin header", method: http.MethodGet, host: "127.0.0.1:1234", origin: origin, want: true},
		{name: "same-origin POST requires Origin header", method: http.MethodPost, host: "127.0.0.1:1234", want: false},
		{name: "same-origin POST with Origin header", method: http.MethodPost, host: "127.0.0.1:1234", origin: origin, want: true},
		{name: "wrong Origin", method: http.MethodGet, host: "127.0.0.1:1234", origin: "http://localhost:1234", want: false},
		{name: "wrong Host", method: http.MethodGet, host: "localhost:1234", want: false},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			request := httptest.NewRequest(test.method, origin+"/capture/status", nil)
			request.Host = test.host
			if test.origin != "" {
				request.Header.Set("Origin", test.origin)
			}
			if got := authorizedCaptureRequest(request, origin); got != test.want {
				t.Fatalf("authorizedCaptureRequest() = %t, want %t", got, test.want)
			}
		})
	}
}

func TestAIProxyAllowsOnlyReplayAndReportQueries(t *testing.T) {
	gateway := httptest.NewServer(http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		_, _ = writer.Write([]byte(request.URL.RequestURI()))
	}))
	defer gateway.Close()
	target, _ := url.Parse(gateway.URL)
	handler := newHandler(t.TempDir(), nil, "http://127.0.0.1:1234", nil, target)
	for _, test := range []struct {
		path  string
		valid bool
	}{
		{"/ai/api/sessions/a/stream?after=12", true},
		{"/ai/api/sessions/a/stream?after=0", true},
		{"/ai/api/sessions/a/report?format=html", true},
		{"/ai/api/sessions/a/report?format=markdown", true},
		{"/ai/api/sessions/a/stream?after=-1", false},
		{"/ai/api/sessions/a/stream?after=1&after=2", false},
		{"/ai/api/sessions/a/stream?after=1&secret=x", false},
		{"/ai/api/sessions/a/report?format=html&secret=x", false},
		{"/ai/api/sessions/a/report?format=script", false},
		{"/ai/api/sessions?secret=x", false},
	} {
		t.Run(test.path, func(t *testing.T) {
			recorder := httptest.NewRecorder()
			handler.ServeHTTP(recorder, httptest.NewRequest(http.MethodGet, "http://127.0.0.1:1234"+test.path, nil))
			if test.valid {
				if recorder.Code != http.StatusOK || recorder.Body.String() != strings.TrimPrefix(test.path, "/ai") {
					t.Fatalf("AI query forwarding failed: %d %s", recorder.Code, recorder.Body.String())
				}
			} else if recorder.Code != http.StatusBadRequest {
				t.Fatalf("hostile AI query accepted: %d", recorder.Code)
			}
		})
	}
}
