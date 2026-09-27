//go:build !windows

package main

// Other systems have no WebView2: play in the default browser.
func runWindow(base string, ping *int64) {
	browserFallback(base, ping)
}
