package raster

import (
	"fmt"
	"path/filepath"
	"strings"
)

var (
	Ratios  = []string{"1x1", "4x3"}
	Formats = []string{"png", "webp", "avif"}
	Sizes   = []int{16, 24, 32, 48, 64, 128, 256, 512}
)

func Height(ratio string, w int) int {
	if ratio == "1x1" {
		return w
	}
	return (w * 3) / 4
}

func FilePath(root, ratio string, w int, cc, ext string) string {
	return filepath.Join(root, "raster", ratio, fmt.Sprint(w), cc+"."+ext)
}

func SrcSVG(root, ratio, cc string) string {
	return filepath.Join(root, "flags", ratio, cc+".svg")
}

func PublicURL(ratio string, w int, cc, ext string) string {
	return fmt.Sprintf("/i/%s/%d/%s.%s", ratio, w, cc, ext)
}

func ValidRatio(r string) bool {
	return r == "1x1" || r == "4x3"
}

func ValidFormat(f string) bool {
	switch f {
	case "svg", "png", "webp", "avif":
		return true
	}
	return false
}

func ValidCC(cc string) bool {
	if len(cc) < 1 || len(cc) > 16 {
		return false
	}
	for i, c := range cc {
		if i == 0 {
			if c < 'a' || c > 'z' {
				if c < '0' || c > '9' {
					return false
				}
			}
		} else {
			if (c < 'a' || c > 'z') && (c < '0' || c > '9') && c != '-' {
				return false
			}
		}
	}
	return true
}

func ContentType(ext string) string {
	switch strings.ToLower(ext) {
	case "svg":
		return "image/svg+xml"
	case "png":
		return "image/png"
	case "webp":
		return "image/webp"
	case "avif":
		return "image/avif"
	default:
		return "application/octet-stream"
	}
}
