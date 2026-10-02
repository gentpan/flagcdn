# flagcdn.io Memory

## Stack

- **Frontend:** Nuxt 3 (`apps/web/`) — SSG pages, SEO, i18n
- **Backend:** Go (`cmd/api/`) — `/api/v1/*`, `/api/stats`, `/1x1/*`, `/4x3/*` raster CDN
- **Assets:** `flags/`, `1x1/`, `4x3/`, `css/flag-icons.min.css`, `data/country.json`
- **Current public site:** PHP source in `apps/php/`, served by FrankenPHP/Caddy

## Local dev

```bash
make dev    # Go :8080 + Nuxt preview :3000
```

## Production

- Build: `make build-static` (starts Go during prerender)
- Deploy Nuxt `.output/public/` + static assets + Go API behind Nginx
- See `deploy/nginx.conf.example` and `docs/STACK.md`

## Deployment server

- Public PHP site path: `/var/www/flagcdn.io`
- Nuxt + Go project path: `/opt/flagcdn/app`; keep its deployment separate from the PHP site
- GitHub: `https://github.com/gentpan/flagcdn`
