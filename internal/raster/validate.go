package raster

import (
	"os"
	"strings"
)

func ValidFile(path, ext string) (bool, string) {
	st, err := os.Stat(path)
	if err != nil || st.Size() == 0 {
		return false, "missing or empty"
	}
	f, err := os.Open(path)
	if err != nil {
		return false, err.Error()
	}
	defer f.Close()
	head := make([]byte, 32)
	n, _ := f.Read(head)
	head = head[:n]
	switch ext {
	case "png":
		if len(head) >= 8 && string(head[:8]) == "\x89PNG\r\n\x1a\n" {
			return true, ""
		}
		return false, "bad png magic"
	case "webp":
		if len(head) >= 12 && string(head[:4]) == "RIFF" && string(head[8:12]) == "WEBP" {
			return true, ""
		}
		return false, "bad webp magic"
	case "avif":
		s := string(head)
		if strings.Contains(s, "ftyp") && (strings.Contains(s, "avif") || strings.Contains(s, "mif1")) {
			return true, ""
		}
		return false, "bad avif magic"
	}
	return true, ""
}
