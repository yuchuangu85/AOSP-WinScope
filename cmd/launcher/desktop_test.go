package main

import (
	"errors"
	"fmt"
	"io"
	"net"
	"os"
	"os/exec"
	"path/filepath"
	"reflect"
	"runtime"
	"sync"
	"testing"
	"time"
)

func TestDesktopUsesBundledCaptureWithoutPython(t *testing.T) {
	for _, goos := range []string{"darwin", "linux", "windows"} {
		t.Run(goos, func(t *testing.T) {
			root := t.TempDir()
			name := "winscope-capture"
			if goos == "windows" {
				name += ".exe"
			}
			capture := filepath.Join(root, "capture", name)
			if err := os.MkdirAll(filepath.Dir(capture), 0755); err != nil {
				t.Fatal(err)
			}
			if err := os.WriteFile(capture, []byte("native capture"), 0755); err != nil {
				t.Fatal(err)
			}
			command, err := captureCommand(root, goos, func(string) (string, error) {
				t.Fatal("packaged capture must not discover a system Python")
				return "", errors.New("unavailable")
			})
			if err != nil || command.path != capture || len(command.prefixArguments) != 0 {
				t.Fatalf("packaged capture = %+v, %v", command, err)
			}
		})
	}
}

func TestDesktopUsesBundledAdbBeforePATH(t *testing.T) {
	for _, goos := range []string{"darwin", "linux", "windows"} {
		t.Run(goos, func(t *testing.T) {
			root := t.TempDir()
			name := "adb"
			if goos == "windows" {
				name += ".exe"
			}
			adb := filepath.Join(root, "platform-tools", name)
			if err := os.MkdirAll(filepath.Dir(adb), 0755); err != nil {
				t.Fatal(err)
			}
			if err := os.WriteFile(adb, []byte("bundled adb"), 0755); err != nil {
				t.Fatal(err)
			}
			got, err := adbCommand(root, goos)
			if err != nil || got != adb {
				t.Fatalf("adb = %q, %v", got, err)
			}
		})
	}
}

func TestCaptureEnvironmentScopesBundledLinuxAdbLibraries(t *testing.T) {
	for _, test := range []struct {
		name        string
		goos        string
		library     string
		adb         string
		wantLibrary bool
	}{
		{"linux bundled", "linux", "directory", "bundled", true},
		{"linux bundled path with spaces", "linux", "spaces", "bundled", true},
		{"mac bundled", "darwin", "directory", "bundled", false},
		{"windows bundled", "windows", "directory", "bundled", false},
		{"missing libraries", "linux", "missing", "bundled", false},
		{"library file", "linux", "file", "bundled", false},
		{"library symlink", "linux", "symlink", "bundled", false},
		{"dangling library symlink", "linux", "dangling", "bundled", false},
		{"library path separator", "linux", "colon", "bundled", false},
		{"system adb with sibling libraries", "linux", "directory", "system", false},
		{"path adb", "linux", "directory", "path", false},
		{"wrong bundled executable", "linux", "directory", "wrong", false},
		{"relative adb", "linux", "directory", "relative", false},
		{"unnormalized adb", "linux", "directory", "unnormalized", false},
	} {
		t.Run(test.name, func(t *testing.T) {
			if runtime.GOOS == "windows" && (test.wantLibrary || test.library == "colon") {
				t.Skip("Linux library paths require a POSIX filesystem")
			}
			root := t.TempDir()
			if test.library == "colon" {
				root = filepath.Join(root, "bundle:extra")
			} else if test.library == "spaces" {
				root = filepath.Join(root, "bundle with spaces")
			}
			tools := filepath.Join(root, "platform-tools")
			if err := os.MkdirAll(tools, 0755); err != nil {
				t.Fatal(err)
			}
			library := filepath.Join(tools, "lib64")
			switch test.library {
			case "directory", "spaces", "colon":
				if err := os.Mkdir(library, 0755); err != nil {
					t.Fatal(err)
				}
			case "file":
				if err := os.WriteFile(library, []byte("not a directory"), 0600); err != nil {
					t.Fatal(err)
				}
			case "symlink", "dangling":
				target := filepath.Join(root, "libraries")
				if test.library == "symlink" {
					if err := os.Mkdir(target, 0755); err != nil {
						t.Fatal(err)
					}
				}
				if err := os.Symlink(target, library); err != nil {
					t.Skipf("symlinks unavailable: %v", err)
				}
			}
			adb := filepath.Join(tools, "adb")
			if test.goos == "windows" {
				adb += ".exe"
			}
			switch test.adb {
			case "system":
				systemTools := filepath.Join(t.TempDir(), "platform-tools")
				if err := os.MkdirAll(filepath.Join(systemTools, "lib64"), 0755); err != nil {
					t.Fatal(err)
				}
				adb = filepath.Join(systemTools, "adb")
			case "path":
				adb = "adb"
			case "wrong":
				adb = filepath.Join(tools, "other-adb")
			case "relative":
				adb = filepath.Join("platform-tools", "adb")
			case "unnormalized":
				adb = tools + string(os.PathSeparator) + "." + string(os.PathSeparator) + "adb"
			}
			base := []string{
				"PATH=/system/bin", "LD_LIBRARY_PATH=/capture/_internal:/inherited/lib",
				"WINSCOPE_ADB=/inherited/adb", "WINSCOPE_ADB_LIBRARY_PATH=/untrusted/lib",
				"winscope_adb_library_path=/duplicate/lib", "KEEP=value",
			}
			before := append([]string(nil), base...)
			wantLibrary := ""
			if test.wantLibrary {
				wantLibrary = library
			}
			want := []string{
				"PATH=/system/bin", "LD_LIBRARY_PATH=/capture/_internal:/inherited/lib", "KEEP=value",
				"WINSCOPE_ADB=" + adb, "WINSCOPE_ADB_LIBRARY_PATH=" + wantLibrary,
			}
			if got := captureEnvironment(root, adb, test.goos, base); !reflect.DeepEqual(got, want) {
				t.Fatalf("capture environment = %q, want %q", got, want)
			}
			if !reflect.DeepEqual(base, before) {
				t.Fatalf("base environment mutated: %q", base)
			}
		})
	}
}

func TestLegacyCaptureKeepsPythonArguments(t *testing.T) {
	root := t.TempDir()
	proxy := filepath.Join(root, "proxy", "winscope_proxy.py")
	if err := os.MkdirAll(filepath.Dir(proxy), 0755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(proxy, []byte("# proxy"), 0600); err != nil {
		t.Fatal(err)
	}
	command, err := captureCommand(root, "windows", func(name string) (string, error) {
		if name == "py" {
			return "C:\\Windows\\py.exe", nil
		}
		return "", errors.New("unavailable")
	})
	if err != nil || !reflect.DeepEqual(command.prefixArguments, []string{"-3", proxy}) {
		t.Fatalf("legacy command = %+v, %v", command, err)
	}
}

func TestCaptureRejectsInvalidBundledExecutable(t *testing.T) {
	root := t.TempDir()
	if err := os.MkdirAll(filepath.Join(root, "capture", "winscope-capture"), 0755); err != nil {
		t.Fatal(err)
	}
	if _, err := captureCommand(root, "linux", func(string) (string, error) {
		t.Fatal("invalid packaged capture must not fall back to Python")
		return "", nil
	}); err == nil {
		t.Fatal("invalid packaged capture was accepted")
	}
}

func TestParentPipeRemainsOpenUntilDesktopClosesIt(t *testing.T) {
	reader, writer := io.Pipe()
	defer reader.Close()
	defer writer.Close()
	done := watchParentPipe(reader)
	if _, err := writer.Write([]byte("keep running")); err != nil {
		t.Fatal(err)
	}
	select {
	case <-done:
		t.Fatal("data on the parent pipe must not stop the launcher")
	default:
	}
	writer.Close()
	select {
	case <-done:
	case <-time.After(time.Second):
		t.Fatal("closing the parent pipe did not stop the launcher")
	}
}

// A native helper keeps pipe shutdown tests independent of Python and signals.
func TestCapturePipeHelper(t *testing.T) {
	mode := os.Getenv("WINSCOPE_CAPTURE_PIPE_TEST")
	if mode == "" {
		return
	}
	if err := os.WriteFile(os.Getenv("WINSCOPE_CAPTURE_STARTED"), []byte("started"), 0600); err != nil {
		os.Exit(2)
	}
	switch mode {
	case "ready", "unresponsive":
		fmt.Println("READY 43210")
	case "bad-ready":
		fmt.Println("not ready")
	case "bad-port":
		fmt.Println("READY 0")
	case "exited":
		os.Exit(3)
	}
	_, _ = io.Copy(io.Discard, os.Stdin)
	if mode == "unresponsive" {
		for {
			time.Sleep(time.Second)
		}
	}
	if err := os.WriteFile(os.Getenv("WINSCOPE_CAPTURE_CLOSED"), []byte("EOF"), 0600); err != nil {
		os.Exit(4)
	}
	os.Exit(0)
}

func capturePipeHelper(t *testing.T, mode string) (*exec.Cmd, string, string) {
	t.Helper()
	root := t.TempDir()
	started, closed := filepath.Join(root, "started"), filepath.Join(root, "closed")
	command := exec.Command(os.Args[0], "-test.run=^TestCapturePipeHelper$")
	command.Env = append(os.Environ(),
		"WINSCOPE_CAPTURE_PIPE_TEST="+mode,
		"WINSCOPE_CAPTURE_STARTED="+started,
		"WINSCOPE_CAPTURE_CLOSED="+closed,
	)
	return command, started, closed
}

func assertCaptureReaped(t *testing.T, command *exec.Cmd, closed string) {
	t.Helper()
	if command.ProcessState == nil || !command.ProcessState.Success() {
		t.Fatalf("capture was not gracefully reaped: %v", command.ProcessState)
	}
	if value, err := os.ReadFile(closed); err != nil || string(value) != "EOF" {
		t.Fatalf("capture did not observe owned stdin EOF: %q, %v", value, err)
	}
}

func TestCaptureStopClosesOwnedPipeAndWaitsExactlyOnce(t *testing.T) {
	command, _, closed := capturePipeHelper(t, "ready")
	proxy, err := startCaptureCommand(command, nil)
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(proxy.stop)
	if proxy.url.String() != "http://127.0.0.1:43210" {
		t.Fatalf("capture URL = %s", proxy.url)
	}
	var stops sync.WaitGroup
	for range 3 {
		stops.Go(proxy.stop)
	}
	stops.Wait()
	assertCaptureReaped(t, command, closed)
}

func TestLegacyCaptureProcessStopsThroughOwnedParentPipe(t *testing.T) {
	t.Setenv("WINSCOPE_ADB_LIBRARY_PATH", "/untrusted/inherited/lib")
	python, err := pythonCommand(runtime.GOOS, exec.LookPath)
	if err != nil {
		t.Skip("Python is not available for the optional source-entry integration test")
	}
	arguments := append([]string{}, python.prefixArguments...)
	arguments = append(arguments, "-c", "import sys; sys.exit(sys.version_info < (3, 10))")
	if err := exec.Command(python.path, arguments...).Run(); err != nil {
		t.Skip("Python 3.10+ is not available for the optional source-entry integration test")
	}
	root := t.TempDir()
	source, err := os.ReadFile(filepath.Join("..", "..", "src", "adb", "winscope_proxy.py"))
	if err != nil {
		t.Fatal(err)
	}
	adb := "adb"
	if runtime.GOOS == "windows" {
		adb += ".exe"
	}
	for name, contents := range map[string][]byte{
		filepath.Join("proxy", "winscope_proxy.py"): source,
		filepath.Join("platform-tools", adb):        []byte("unused test adb"),
	} {
		target := filepath.Join(root, name)
		if err := os.MkdirAll(filepath.Dir(target), 0755); err != nil {
			t.Fatal(err)
		}
		if err := os.WriteFile(target, contents, 0755); err != nil {
			t.Fatal(err)
		}
	}
	proxy, err := startCaptureProxy(root, "http://127.0.0.1:43210")
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(proxy.stop)
	libraryCleared := false
	for _, entry := range proxy.command.Env {
		if entry == "WINSCOPE_ADB_LIBRARY_PATH=" {
			libraryCleared = true
		}
	}
	if !libraryCleared {
		t.Fatal("capture inherited an untrusted ADB library path")
	}
	connection, err := net.DialTimeout("tcp", proxy.url.Host, time.Second)
	if err != nil {
		t.Fatal(err)
	}
	connection.Close()
	proxy.stop()
	if !proxy.command.ProcessState.Success() {
		t.Fatalf("source capture was not gracefully reaped: %v", proxy.command.ProcessState)
	}
	if connection, err := net.DialTimeout("tcp", proxy.url.Host, time.Second); err == nil {
		connection.Close()
		t.Fatal("source capture listener remained open after shutdown")
	}
}

func TestFailedCaptureStartupClosesOwnedPipeBeforeKilling(t *testing.T) {
	for _, mode := range []string{"bad-ready", "bad-port"} {
		t.Run(mode, func(t *testing.T) {
			command, _, closed := capturePipeHelper(t, mode)
			if _, err := startCaptureCommand(command, nil); err == nil {
				t.Fatal("invalid capture startup was accepted")
			}
			assertCaptureReaped(t, command, closed)
		})
	}
}

func TestParentEOFStopsCaptureDuringStartup(t *testing.T) {
	command, started, closed := capturePipeHelper(t, "starting")
	parentDone := make(chan struct{})
	done := make(chan error, 1)
	go func() {
		_, err := startCaptureCommand(command, parentDone)
		done <- err
	}()
	deadline := time.Now().Add(3 * time.Second)
	for {
		if _, err := os.Stat(started); err == nil || time.Now().After(deadline) {
			break
		}
		time.Sleep(10 * time.Millisecond)
	}
	close(parentDone)
	select {
	case err := <-done:
		if err == nil {
			t.Fatal("capture startup ignored parent EOF")
		}
	case <-time.After(3 * time.Second):
		t.Fatal("parent EOF did not stop capture startup promptly")
	}
	assertCaptureReaped(t, command, closed)
}

func TestExitedCaptureFailsStartupPromptly(t *testing.T) {
	command, _, _ := capturePipeHelper(t, "exited")
	started := time.Now()
	if _, err := startCaptureCommand(command, nil); err == nil {
		t.Fatal("exited capture was accepted")
	}
	if time.Since(started) >= 3*time.Second || command.ProcessState == nil {
		t.Fatal("exited capture was not promptly reaped")
	}
}

func TestCaptureStopForceKillsOnlyAsFallback(t *testing.T) {
	command, _, closed := capturePipeHelper(t, "unresponsive")
	proxy, err := startCaptureCommand(command, nil)
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(proxy.stop)
	started := time.Now()
	proxy.stop()
	if time.Since(started) < shutdownGracePeriod {
		t.Fatal("capture was killed before its cleanup grace period")
	}
	if command.ProcessState == nil || command.ProcessState.Success() {
		t.Fatalf("unresponsive capture was not reaped: %v", command.ProcessState)
	}
	if _, err := os.Stat(closed); !os.IsNotExist(err) {
		t.Fatal("unresponsive capture unexpectedly completed cleanup")
	}
}
