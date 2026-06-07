package envfile

import (
	"bufio"
	"os"
	"strings"
)

// Load reads KEY=VALUE lines from path (ignores comments and blank lines).
func Load(path string) map[string]string {
	out := make(map[string]string)
	f, err := os.Open(path)
	if err != nil {
		return out
	}
	defer f.Close()
	sc := bufio.NewScanner(f)
	for sc.Scan() {
		line := strings.TrimSpace(sc.Text())
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}
		k, v, ok := strings.Cut(line, "=")
		if !ok {
			continue
		}
		out[strings.TrimSpace(k)] = strings.Trim(strings.TrimSpace(v), `"'`)
	}
	return out
}

func Get(path, key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	if m := Load(path); m[key] != "" {
		return m[key]
	}
	return fallback
}
