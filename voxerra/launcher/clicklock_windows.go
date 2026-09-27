//go:build windows

package main

import (
	"syscall"
	"unsafe"
)

var procSystemParametersInfo = syscall.NewLazyDLL("user32.dll").NewProc("SystemParametersInfoW")

const (
	spiGetMouseClickLock     = 0x101E
	spiSetMouseClickLock     = 0x101F
	spiGetMouseClickLockTime = 0x2008
)

// Verrouillage du clic de Windows (ClickLock) : activé ? délai avant verrouillage (ms).
func getClickLock() (bool, uint32) {
	var on int32 // BOOL
	if r, _, _ := procSystemParametersInfo.Call(spiGetMouseClickLock, 0, uintptr(unsafe.Pointer(&on)), 0); r == 0 {
		return false, 0
	}
	var ms uint32
	procSystemParametersInfo.Call(spiGetMouseClickLockTime, 0, uintptr(unsafe.Pointer(&ms)), 0)
	return on != 0, ms
}

// Active ou coupe le verrouillage du clic pour la session Windows en cours seulement :
// sans SPIF_UPDATEINIFILE, le réglage enregistré dans le profil de l'utilisateur ne change pas.
func setClickLock(on bool) error {
	v := uintptr(0)
	if on {
		v = 1
	}
	if r, _, err := procSystemParametersInfo.Call(spiSetMouseClickLock, 0, v, 0); r == 0 {
		return err
	}
	return nil
}
