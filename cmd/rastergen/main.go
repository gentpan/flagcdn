// rastergen — 批量将 SVG 国旗栅格化为 PNG / WebP / AVIF
//
// 输出: raster/{ratio}/{size}/{cc}.{ext}
// URL:  /i/{ratio}/{size}/{cc}.{ext}
//
//   go run ./cmd/rastergen
//   go run ./cmd/rastergen -verify
//   go run ./cmd/rastergen -codes cn,us -workers 8
package main

import (
	"flag"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"
	"sync"
	"sync/atomic"
)

type job struct {
	ratio, code string
	w           int
	fmt         string
}

var (
	root    = flag.String("root", ".", "项目根目录")
	workers = flag.Int("workers", runtime.NumCPU(), "并行 worker 数")
	sizes   = flag.String("sizes", "16,24,32,48,64,128,256,512", "宽度列表")
	formats = flag.String("formats", "png,webp,avif", "格式列表")
	ratios  = flag.String("ratios", "1x1,4x3", "比例列表")
	codes   = flag.String("codes", "", "限定国家代码，逗号分隔")
	skip    = flag.Bool("skip-existing", true, "跳过已存在的有效文件")
	verify  = flag.Bool("verify", false, "仅校验完整性")
	dryRun  = flag.Bool("dry-run", false, "统计任务数后退出")
)

func main() {
	flag.Parse()

	sizesList := parseInts(*sizes)
	formatsList := splitTrim(*formats)
	ratiosList := splitTrim(*ratios)
	codesFilter := parseCodes(*codes)

	srcRoot := *root
	flagsDir := filepath.Join(srcRoot, "flags")
	outRoot := filepath.Join(srcRoot, "raster")

	allCodes := collectCodes(flagsDir)
	if len(allCodes) == 0 {
		fatal("no SVG flags in %s", flagsDir)
	}

	jobs := buildJobs(flagsDir, allCodes, ratiosList, sizesList, formatsList, codesFilter)
	fmt.Printf("flags=%d jobs=%d workers=%d\n", len(allCodes), len(jobs), *workers)

	if *dryRun {
		return
	}
	if *verify {
		runVerify(outRoot, jobs)
		return
	}

	var done, skipped, failed atomic.Int64
	jc := make(chan job, *workers*2)
	var wg sync.WaitGroup

	for i := 0; i < *workers; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for j := range jc {
				out := outPath(outRoot, j.ratio, j.w, j.code, j.fmt)
				if *skip {
					if ok, _ := validFile(out, j.fmt); ok {
						skipped.Add(1)
						done.Add(1)
						continue
					}
				}
				src := filepath.Join(flagsDir, j.ratio, j.code+".svg")
				if err := render(src, out, j.ratio, j.w, j.fmt); err != nil {
					failed.Add(1)
					fmt.Fprintf(os.Stderr, "FAIL %s: %v\n", rel(outRoot, out), err)
				}
				n := done.Add(1)
				if n%500 == 0 {
					fmt.Printf("progress %d/%d skipped=%d failed=%d\n", n, len(jobs), skipped.Load(), failed.Load())
				}
			}
		}()
	}

	for _, j := range jobs {
		jc <- j
	}
	close(jc)
	wg.Wait()

	fmt.Printf("finished ok=%d skipped=%d failed=%d\n", done.Load()-failed.Load(), skipped.Load(), failed.Load())
	if failed.Load() > 0 {
		os.Exit(1)
	}
}

func buildJobs(flagsDir string, allCodes, ratiosList []string, sizesList []int, formatsList []string, codesFilter map[string]struct{}) []job {
	var jobs []job
	for _, ratio := range ratiosList {
		for _, code := range allCodes {
			if codesFilter != nil {
				if _, ok := codesFilter[code]; !ok {
					continue
				}
			}
			if _, err := os.Stat(filepath.Join(flagsDir, ratio, code+".svg")); err != nil {
				continue
			}
			for _, w := range sizesList {
				for _, fmt := range formatsList {
					jobs = append(jobs, job{ratio, code, w, fmt})
				}
			}
		}
	}
	return jobs
}

func runVerify(outRoot string, jobs []job) {
	missing, bad := 0, 0
	for _, j := range jobs {
		out := outPath(outRoot, j.ratio, j.w, j.code, j.fmt)
		ok, reason := validFile(out, j.fmt)
		if ok {
			continue
		}
		if reason == "missing or empty" {
			missing++
		} else {
			bad++
			fmt.Fprintf(os.Stderr, "BAD %s: %s\n", rel(outRoot, out), reason)
		}
	}
	ok := len(jobs) - missing - bad
	fmt.Printf("verify total=%d ok=%d missing=%d bad=%d (%.2f%%)\n",
		len(jobs), ok, missing, bad, pct(ok, len(jobs)))
	if missing > 0 || bad > 0 {
		os.Exit(1)
	}
}

func pct(n, total int) float64 {
	if total == 0 {
		return 0
	}
	return float64(n) / float64(total) * 100
}

func parseInts(s string) []int {
	var out []int
	for _, p := range splitTrim(s) {
		var w int
		if _, err := fmt.Sscanf(p, "%d", &w); err != nil || w < 8 || w > 2048 {
			fatal("invalid size %q", p)
		}
		out = append(out, w)
	}
	return out
}

func parseCodes(s string) map[string]struct{} {
	if s == "" {
		return nil
	}
	m := make(map[string]struct{})
	for _, c := range splitTrim(s) {
		m[strings.ToLower(c)] = struct{}{}
	}
	return m
}

func splitTrim(s string) []string {
	var out []string
	for _, p := range strings.Split(s, ",") {
		p = strings.TrimSpace(p)
		if p != "" {
			out = append(out, p)
		}
	}
	return out
}

func collectCodes(flagsDir string) []string {
	seen := map[string]struct{}{}
	for _, ratio := range []string{"1x1", "4x3"} {
		entries, err := os.ReadDir(filepath.Join(flagsDir, ratio))
		if err != nil {
			continue
		}
		for _, e := range entries {
			if !e.IsDir() && strings.HasSuffix(e.Name(), ".svg") {
				seen[strings.TrimSuffix(e.Name(), ".svg")] = struct{}{}
			}
		}
	}
	out := make([]string, 0, len(seen))
	for c := range seen {
		out = append(out, c)
	}
	for i := 0; i < len(out); i++ {
		for j := i + 1; j < len(out); j++ {
			if out[j] < out[i] {
				out[i], out[j] = out[j], out[i]
			}
		}
	}
	return out
}

func outPath(root, ratio string, w int, code, ext string) string {
	return filepath.Join(root, ratio, fmt.Sprint(w), code+"."+ext)
}

func height(ratio string, w int) int {
	if ratio == "1x1" {
		return w
	}
	return (w * 3) / 4
}

func render(srcSVG, outFile, ratio string, w int, ext string) error {
	if err := os.MkdirAll(filepath.Dir(outFile), 0o775); err != nil {
		return err
	}
	h := height(ratio, w)
	tmpPNG := outFile + ".tmp.png"

	cmd := exec.Command("rsvg-convert", "-w", fmt.Sprint(w), "-h", fmt.Sprint(h), "-a", srcSVG, "-o", tmpPNG)
	if out, err := cmd.CombinedOutput(); err != nil {
		os.Remove(tmpPNG)
		return fmt.Errorf("rsvg: %w %s", err, trimOut(out))
	}

	var err error
	switch ext {
	case "png":
		err = os.Rename(tmpPNG, outFile)
	case "webp":
		cmd = exec.Command("cwebp", "-q", "90", "-quiet", "-m", "6", tmpPNG, "-o", outFile)
		if out, e := cmd.CombinedOutput(); e != nil {
			err = fmt.Errorf("cwebp: %w %s", e, trimOut(out))
		}
		os.Remove(tmpPNG)
	case "avif":
		cmd = exec.Command("avifenc", "-q", "60", tmpPNG, outFile)
		if out, e := cmd.CombinedOutput(); e != nil {
			err = fmt.Errorf("avifenc: %w %s", e, trimOut(out))
		}
		os.Remove(tmpPNG)
	default:
		os.Remove(tmpPNG)
		return fmt.Errorf("unknown format %s", ext)
	}
	if err != nil {
		os.Remove(outFile)
		return err
	}
	ok, reason := validFile(outFile, ext)
	if !ok {
		os.Remove(outFile)
		return fmt.Errorf("invalid: %s", reason)
	}
	return nil
}

func validFile(path, ext string) (bool, string) {
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

func rel(root, path string) string {
	if r, err := filepath.Rel(filepath.Join(root, ".."), path); err == nil {
		return r
	}
	return path
}

func trimOut(b []byte) string {
	s := strings.TrimSpace(string(b))
	if len(s) > 100 {
		return s[:100] + "..."
	}
	return s
}

func fatal(format string, args ...any) {
	fmt.Fprintf(os.Stderr, format+"\n", args...)
	os.Exit(1)
}
