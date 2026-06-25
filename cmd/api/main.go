package main

import (
	"archive/zip"
	"encoding/json"
	"flag"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"flagcdn.io/internal/data"
	"flagcdn.io/internal/raster"
	"flagcdn.io/internal/stats"
	"flagcdn.io/internal/visitor"
)

var (
	addr = flag.String("addr", ":8080", "listen address")
	root = flag.String("root", ".", "project root")
)

func main() {
	flag.Parse()
	absRoot, err := filepath.Abs(*root)
	if err != nil {
		log.Fatal(err)
	}

	store := data.NewStore(absRoot)
	if err := store.Load(); err != nil {
		log.Fatal("load countries:", err)
	}

	mux := http.NewServeMux()
	mux.HandleFunc("GET /healthz", func(w http.ResponseWriter, _ *http.Request) {
		w.Write([]byte("ok"))
	})
	mux.HandleFunc("GET /api/v1/flags", func(w http.ResponseWriter, _ *http.Request) {
		writeJSON(w, store.All())
	})
	mux.HandleFunc("GET /api/v1/flags/{cc}/svg", func(w http.ResponseWriter, r *http.Request) {
		cc := strings.ToLower(r.PathValue("cc"))
		serveFlagSVGJSON(w, r, absRoot, cc)
	})
	mux.HandleFunc("GET /api/v1/flags/{cc}/download.zip", func(w http.ResponseWriter, r *http.Request) {
		cc := strings.ToLower(r.PathValue("cc"))
		serveFlagBundle(w, r, absRoot, cc)
	})
	mux.HandleFunc("GET /api/v1/flags/{cc}", func(w http.ResponseWriter, r *http.Request) {
		cc := strings.ToLower(r.PathValue("cc"))
		writeFlagDetail(w, r, store, absRoot, cc)
	})
	mux.HandleFunc("GET /api/v1/visitor-country", func(w http.ResponseWriter, r *http.Request) {
		code := visitor.FromRequest(r)
		var out any
		if code == "" {
			out = map[string]any{"code": nil}
		} else {
			out = map[string]string{"code": code}
		}
		writeJSON(w, out)
	})
	mux.HandleFunc("GET /api/stats", func(w http.ResponseWriter, r *http.Request) {
		raw, err := stats.FetchCloudflare(absRoot)
		if err != nil {
			log.Println("stats:", err)
			writeJSON(w, map[string]int{"requests": 0})
			return
		}
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.Header().Set("Cache-Control", "public, max-age=300")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Write(raw)
	})
	mux.HandleFunc("GET /flags/{ratio}/{file}", serveFlagSVG(absRoot))
	mux.HandleFunc("GET /i/{ratio}/{w}/{file}", serveRaster(absRoot))
	mux.HandleFunc("GET /api/v1/render", serveRender(absRoot))

	srv := &http.Server{
		Addr:              *addr,
		Handler:           withCORS(mux),
		ReadHeaderTimeout: 10 * time.Second,
	}
	log.Printf("flagcdn api listening on %s root=%s", *addr, absRoot)
	log.Fatal(srv.ListenAndServe())
}

func writeFlagDetail(w http.ResponseWriter, r *http.Request, store *data.Store, root, cc string) {
	c, ok := store.Get(cc)
	if !ok {
		if !isFile(raster.SrcSVG(root, "1x1", cc)) {
			http.NotFound(w, r)
			return
		}
		writeJSON(w, map[string]any{
			"country": map[string]any{"code": cc, "name": strings.ToUpper(cc), "iso": false},
			"related": []any{},
			"svg": map[string]string{
				"1x1": "/flags/1x1/" + cc + ".svg",
				"4x3": "/flags/4x3/" + cc + ".svg",
			},
		})
		return
	}
	related := store.Related(cc, 11)
	writeJSON(w, map[string]any{
		"country": c,
		"related": related,
		"svg": map[string]string{
			"1x1": "/flags/1x1/" + cc + ".svg",
			"4x3": "/flags/4x3/" + cc + ".svg",
		},
	})
}

func serveFlagBundle(w http.ResponseWriter, r *http.Request, root, cc string) {
	if !raster.ValidCC(cc) {
		http.NotFound(w, r)
		return
	}
	if !isFile(raster.SrcSVG(root, "1x1", cc)) && !isFile(raster.SrcSVG(root, "4x3", cc)) {
		http.NotFound(w, r)
		return
	}

	w.Header().Set("Content-Type", "application/zip")
	w.Header().Set("Content-Disposition", fmt.Sprintf(`attachment; filename="%s-flag-assets.zip"`, cc))
	w.Header().Set("Cache-Control", "public, max-age=31536000, immutable")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	zw := zip.NewWriter(w)
	defer zw.Close()

	for _, ratio := range raster.Ratios {
		src := raster.SrcSVG(root, ratio, cc)
		if isFile(src) {
			if err := addZipFile(zw, src, fmt.Sprintf("%s/%s/%s_%s.svg", cc, ratio, cc, ratio)); err != nil {
				log.Println("zip svg:", err)
				return
			}
		}
		for _, format := range raster.Formats {
			for _, size := range raster.Sizes {
				out := raster.FilePath(root, ratio, size, cc, format)
				if !isFile(out) {
					if !isFile(src) {
						continue
					}
					if err := raster.Render(src, out, ratio, size, format); err != nil {
						log.Println("zip render:", err)
						continue
					}
				}
				name := fmt.Sprintf("%s/%s/%d/%s_%s_%d.%s", cc, ratio, size, cc, ratio, size, format)
				if err := addZipFile(zw, out, name); err != nil {
					log.Println("zip raster:", err)
					return
				}
			}
		}
	}
}

func addZipFile(zw *zip.Writer, srcPath, name string) error {
	f, err := os.Open(srcPath)
	if err != nil {
		return err
	}
	defer f.Close()
	dst, err := zw.Create(name)
	if err != nil {
		return err
	}
	_, err = io.Copy(dst, f)
	return err
}

func serveFlagSVGJSON(w http.ResponseWriter, r *http.Request, root, cc string) {
	read := func(ratio string) string {
		b, err := os.ReadFile(raster.SrcSVG(root, ratio, cc))
		if err != nil {
			return ""
		}
		return string(b)
	}
	svg1x1 := read("1x1")
	svg4x3 := read("4x3")
	if svg1x1 == "" && svg4x3 == "" {
		http.NotFound(w, r)
		return
	}
	writeJSON(w, map[string]string{"svg1x1": svg1x1, "svg4x3": svg4x3})
}

func serveFlagSVG(root string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ratio := r.PathValue("ratio")
		file := r.PathValue("file")
		if !raster.ValidRatio(ratio) || !strings.HasSuffix(file, ".svg") {
			http.NotFound(w, r)
			return
		}
		cc := strings.TrimSuffix(file, ".svg")
		if !raster.ValidCC(cc) {
			http.NotFound(w, r)
			return
		}
		path := raster.SrcSVG(root, ratio, cc)
		serveFile(w, r, path, "image/svg+xml")
	}
}

func serveRaster(root string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ratio := r.PathValue("ratio")
		wStr := r.PathValue("w")
		file := r.PathValue("file")
		if !raster.ValidRatio(ratio) {
			http.Error(w, "invalid ratio", 400)
			return
		}
		wi, err := strconv.Atoi(wStr)
		if err != nil || wi < 8 || wi > 2048 {
			http.Error(w, "invalid width", 400)
			return
		}
		parts := strings.SplitN(file, ".", 2)
		if len(parts) != 2 {
			http.NotFound(w, r)
			return
		}
		cc, ext := parts[0], parts[1]
		if !raster.ValidCC(cc) || !raster.ValidFormat(ext) || ext == "svg" {
			http.NotFound(w, r)
			return
		}
		out := raster.FilePath(root, ratio, wi, cc, ext)
		if isFile(out) {
			w.Header().Set("X-Cache", "HIT")
			serveFile(w, r, out, raster.ContentType(ext))
			return
		}
		src := raster.SrcSVG(root, ratio, cc)
		if !isFile(src) {
			http.NotFound(w, r)
			return
		}
		if err := raster.Render(src, out, ratio, wi, ext); err != nil {
			log.Println("render:", err)
			http.Error(w, "render failed", 500)
			return
		}
		w.Header().Set("X-Cache", "MISS")
		serveFile(w, r, out, raster.ContentType(ext))
	}
}

func serveRender(root string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		q := r.URL.Query()
		ratio := q.Get("ratio")
		cc := q.Get("cc")
		fmtStr := q.Get("fmt")
		wi, _ := strconv.Atoi(q.Get("w"))
		if !raster.ValidRatio(ratio) || !raster.ValidCC(cc) || !raster.ValidFormat(fmtStr) || wi < 8 || wi > 2048 {
			http.Error(w, "bad params", 400)
			return
		}
		src := raster.SrcSVG(root, ratio, cc)
		if !isFile(src) {
			http.NotFound(w, r)
			return
		}
		setCacheHeaders(w)
		if fmtStr == "svg" {
			b, err := raster.RenderSVGBytes(src, wi, ratio)
			if err != nil {
				http.Error(w, "read failed", 500)
				return
			}
			w.Header().Set("Content-Type", "image/svg+xml")
			w.Write(b)
			return
		}
		out := raster.FilePath(root, ratio, wi, cc, fmtStr)
		if !isFile(out) {
			if err := raster.Render(src, out, ratio, wi, fmtStr); err != nil {
				http.Error(w, "render failed", 500)
				return
			}
		}
		serveFile(w, r, out, raster.ContentType(fmtStr))
	}
}

func serveFile(w http.ResponseWriter, r *http.Request, path, ctype string) {
	setCacheHeaders(w)
	w.Header().Set("Content-Type", ctype)
	http.ServeFile(w, r, path)
}

func setCacheHeaders(w http.ResponseWriter) {
	w.Header().Set("Cache-Control", "public, max-age=31536000, immutable")
	w.Header().Set("Access-Control-Allow-Origin", "*")
}

func writeJSON(w http.ResponseWriter, v any) {
	setCacheHeaders(w)
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Header().Set("Cache-Control", "public, max-age=300")
	enc := json.NewEncoder(w)
	enc.SetEscapeHTML(false)
	_ = enc.Encode(v)
}

func isFile(p string) bool {
	st, err := os.Stat(p)
	return err == nil && !st.IsDir() && st.Size() > 0
}

func withCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		if r.Method == http.MethodOptions {
			w.WriteHeader(204)
			return
		}
		next.ServeHTTP(w, r)
	})
}
