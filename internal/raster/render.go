package raster

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"regexp"
	"strings"
)

var svgDimRe = regexp.MustCompile(`\s(width|height)="[^"]*"`)

func Render(srcSVG, outFile, ratio string, w int, ext string) error {
	if err := os.MkdirAll(filepath.Dir(outFile), 0o775); err != nil {
		return err
	}
	h := Height(ratio, w)
	tmpPNG := outFile + ".tmp.png"

	cmd := exec.Command("rsvg-convert", "-w", fmt.Sprint(w), "-h", fmt.Sprint(h), "-a", srcSVG, "-o", tmpPNG)
	if out, err := cmd.CombinedOutput(); err != nil {
		os.Remove(tmpPNG)
		return fmt.Errorf("rsvg: %w %s", err, trim(out))
	}

	var err error
	switch ext {
	case "png":
		err = os.Rename(tmpPNG, outFile)
	case "webp":
		cmd = exec.Command("cwebp", "-q", "90", "-quiet", "-m", "6", tmpPNG, "-o", outFile)
		if out, e := cmd.CombinedOutput(); e != nil {
			err = fmt.Errorf("cwebp: %w %s", e, trim(out))
		}
		os.Remove(tmpPNG)
	case "avif":
		cmd = exec.Command("avifenc", "-q", "60", tmpPNG, outFile)
		if out, e := cmd.CombinedOutput(); e != nil {
			err = fmt.Errorf("avifenc: %w %s", e, trim(out))
		}
		os.Remove(tmpPNG)
	default:
		os.Remove(tmpPNG)
		return fmt.Errorf("unsupported format %s", ext)
	}
	if err != nil {
		os.Remove(outFile)
		return err
	}
	ok, reason := ValidFile(outFile, ext)
	if !ok {
		os.Remove(outFile)
		return fmt.Errorf("invalid output: %s", reason)
	}
	return nil
}

func RenderSVGBytes(srcSVG string, w int, ratio string) ([]byte, error) {
	svg, err := os.ReadFile(srcSVG)
	if err != nil {
		return nil, err
	}
	h := Height(ratio, w)
	s := svgDimRe.ReplaceAllString(string(svg), "")
	s = regexp.MustCompile(`(<svg\b[^>]*?)(>)`).ReplaceAllString(s, fmt.Sprintf(`${1} width="%d" height="%d"${2}`, w, h))
	return []byte(s), nil
}

func trim(b []byte) string {
	s := strings.TrimSpace(string(b))
	if len(s) > 80 {
		return s[:80] + "..."
	}
	return s
}
