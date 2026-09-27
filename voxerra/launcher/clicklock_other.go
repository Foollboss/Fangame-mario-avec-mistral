//go:build !windows

package main

import (
	"fmt"
	"os"
)

// Hors Windows, pas de verrouillage du clic ; VOXERRA_TEST_CLICKLOCK=1 le simule (essais sous Linux).
var simulatedClickLock = os.Getenv("VOXERRA_TEST_CLICKLOCK") == "1"

func getClickLock() (bool, uint32) {
	return simulatedClickLock, 1200
}

func setClickLock(on bool) error {
	simulatedClickLock = on
	if os.Getenv("VOXERRA_TEST_CLICKLOCK") != "" {
		fmt.Println("verrouillage du clic (simulé) :", on)
	}
	return nil
}
