# flagcdn.io Memory

## Stack

- **Frontend:** Nuxt 3 (`apps/web/`) — SSG pages, SEO, i18n
- **Backend:** Go (`cmd/api/`) — `/api/v1/*`, `/api/stats`, `/i/*` raster CDN
- **Assets:** `flags/`, `raster/`, `css/flag-icons.min.css`, `data/country.json`
- **No PHP** in this repository

## Local dev

```bash
make dev    # Go :8080 + Nuxt preview :3000
```

## Production

- Build: `make build-static` (starts Go during prerender)
- Deploy Nuxt `.output/public/` + static assets + Go API behind Nginx
- See `deploy/nginx.conf.example` and `docs/STACK.md`

## Deployment server

- Production: `136.243.151.32` (`hz-sites`), path `/opt/1panel/www/sites/flagcdn.io/index`
- GitHub: `https://github.com/gentpan/flagcdn`
