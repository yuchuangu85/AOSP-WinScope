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
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"testing"
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
		name        string
		goos        string
		arguments   []string
		wantCapture bool
		wantOpen    bool
	}{
		{name: "Windows Explorer double click", goos: "windows", wantCapture: true, wantOpen: true},
		{name: "Windows explicit arguments", goos: "windows", arguments: []string{"--port", "56745"}},
		{name: "macOS no arguments", goos: "darwin"},
		{name: "Linux no arguments", goos: "linux"},
	}
	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			capture, openBrowser := defaultLaunchFlags(test.goos, test.arguments)
			if capture != test.wantCapture || openBrowser != test.wantOpen {
				t.Fatalf(
					"defaultLaunchFlags(%q, %v) = (%t, %t), want (%t, %t)",
					test.goos,
					test.arguments,
					capture,
					openBrowser,
					test.wantCapture,
					test.wantOpen,
				)
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
	tests := []struct {
		name        string
		port        int
		capture     bool
		offlineOnly bool
		wantError   bool
	}{
		{name: "random offline", port: 0, offlineOnly: true},
		{name: "fixed capture", port: 8080, capture: true},
		{name: "maximum port", port: 65535},
		{name: "negative port", port: -1, wantError: true},
		{name: "overflow port", port: 65536, wantError: true},
		{name: "conflicting modes", capture: true, offlineOnly: true, wantError: true},
	}
	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			err := validateLaunchOptions(test.port, test.capture, test.offlineOnly)
			if (err != nil) != test.wantError {
				t.Fatalf("validateLaunchOptions() error = %v, wantError = %t", err, test.wantError)
			}
		})
	}
}

func TestStaticHandlerRejectsHostileRequests(t *testing.T) {
	webRoot := t.TempDir()
	if err := os.WriteFile(filepath.Join(webRoot, "index.html"), []byte("ok"), 0600); err != nil {
		t.Fatal(err)
	}
	handler := newHandler(webRoot, map[string]bool{"index.html": true}, "http://127.0.0.1:1234", nil)

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

func TestHandlerAddsSecurityHeaders(t *testing.T) {
	webRoot := t.TempDir()
	if err := os.WriteFile(filepath.Join(webRoot, "index.html"), []byte("ok"), 0600); err != nil {
		t.Fatal(err)
	}
	handler := newHandler(webRoot, map[string]bool{"index.html": true}, "http://127.0.0.1:1234", nil)
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
