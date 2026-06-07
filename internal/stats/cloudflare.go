package stats

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"flagcdn.io/internal/envfile"
)

type Result struct {
	Requests  int64  `json:"requests"`
	Bytes     int64  `json:"bytes"`
	PageViews int64  `json:"pageViews"`
	Visitors  int64  `json:"visitors"`
	Since     string `json:"since"`
	Until     string `json:"until"`
}

type cachePayload struct {
	At   int64  `json:"at"`
	Body string `json:"body"`
}

// FetchCloudflare returns CDN request stats (30-day window), cached 1 hour.
func FetchCloudflare(root string) ([]byte, error) {
	envPath := filepath.Join(root, ".env")
	token := envfile.Get(envPath, "CLOUDFLARE_API_TOKEN", "")
	zone := envfile.Get(envPath, "CLOUDFLARE_ZONE_ID", "")
	if token == "" || zone == "" {
		return nil, fmt.Errorf("missing Cloudflare credentials")
	}

	cachePath := filepath.Join(os.TempDir(), "flagcdn_cf_stats.json")
	if raw, err := os.ReadFile(cachePath); err == nil {
		var c cachePayload
		if json.Unmarshal(raw, &c) == nil && time.Now().Unix()-c.At < 3600 && c.Body != "" {
			return []byte(c.Body), nil
		}
	}

	since := time.Now().AddDate(0, 0, -30).Format("2006-01-02")
	until := time.Now().Format("2006-01-02")

	query := fmt.Sprintf(`{
  viewer {
    zones(filter: { zoneTag: "%s" }) {
      httpRequests1dGroups(
        limit: 1
        filter: { date_geq: "%s", date_leq: "%s" }
      ) {
        sum { requests bytes pageViews }
        uniq { uniques }
      }
    }
  }
}`, zone, since, until)

	body, _ := json.Marshal(map[string]string{"query": query})
	req, err := http.NewRequest(http.MethodPost, "https://api.cloudflare.com/client/v4/graphql", bytes.NewReader(body))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	raw, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("cloudflare api: %s", resp.Status)
	}

	var parsed struct {
		Data struct {
			Viewer struct {
				Zones []struct {
					Groups []struct {
						Sum struct {
							Requests  int64 `json:"requests"`
							Bytes     int64 `json:"bytes"`
							PageViews int64 `json:"pageViews"`
						} `json:"sum"`
						Uniq struct {
							Uniques int64 `json:"uniques"`
						} `json:"uniq"`
					} `json:"httpRequests1dGroups"`
				} `json:"zones"`
			} `json:"viewer"`
		} `json:"data"`
	}
	if err := json.Unmarshal(raw, &parsed); err != nil {
		return nil, err
	}
	if len(parsed.Data.Viewer.Zones) == 0 || len(parsed.Data.Viewer.Zones[0].Groups) == 0 {
		return nil, fmt.Errorf("no analytics data")
	}
	g := parsed.Data.Viewer.Zones[0].Groups[0]
	out, err := json.Marshal(Result{
		Requests:  g.Sum.Requests,
		Bytes:     g.Sum.Bytes,
		PageViews: g.Sum.PageViews,
		Visitors:  g.Uniq.Uniques,
		Since:     since,
		Until:     until,
	})
	if err != nil {
		return nil, err
	}

	_ = os.WriteFile(cachePath, mustJSON(cachePayload{At: time.Now().Unix(), Body: string(out)}), 0o644)
	return out, nil
}

func mustJSON(v any) []byte {
	b, _ := json.Marshal(v)
	return b
}
