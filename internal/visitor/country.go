package visitor

import (
	"net/http"
	"strings"
)

var headerKeys = []string{
	"CF-IPCountry",
	"CDN-RequestCountryCode",
	"CloudFront-Viewer-Country",
	"X-Country-Code",
}

// FromRequest reads a 2-letter country code from CDN edge headers.
func FromRequest(r *http.Request) string {
	for _, key := range headerKeys {
		v := strings.ToUpper(strings.TrimSpace(r.Header.Get(key)))
		if len(v) == 2 && v != "XX" && v != "T1" {
			return strings.ToLower(v)
		}
	}
	return ""
}
