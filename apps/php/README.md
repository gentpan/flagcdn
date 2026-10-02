# flagcdn.io PHP site

This directory contains the PHP site currently served at [flagcdn.io](https://flagcdn.io). The repository also includes a separate Nuxt + Go implementation in `apps/web/` and `cmd/`.

## Local preview

Requires PHP 8.2+ with `curl` and `mbstring` for analytics and feedback.

```sh
php -S 127.0.0.1:8090 -t apps/php
```

The homepage works at `http://127.0.0.1:8090/`. PHP's built-in server uses `/docs.php`, `/changelog.php`, and `/issues.php`; production uses the clean routes configured below. Optional integrations read `apps/php/.env`; copy `.env.example` and fill in your own credentials. Without credentials the GitHub link, download counter, and static flag library still work.

## Deploy with FrankenPHP

Copy this directory to your PHP site's document root. The service account needs write access to `data/` and the download counter. For a service running as `caddy`:

```sh
sudo install -d -o caddy -g caddy -m 2775 /var/www/flagcdn.io/data
# Create the counter only when it does not already exist.
sudo -u caddy sh -c 'test -e /var/www/flagcdn.io/data/download-count.txt || printf 0 > /var/www/flagcdn.io/data/download-count.txt'
sudo chown caddy:caddy /var/www/flagcdn.io/data/download-count.txt
sudo chmod 640 /var/www/flagcdn.io/data/download-count.txt
```

Use the example in [`../../deploy/php.Caddyfile.example`](../../deploy/php.Caddyfile.example), adapting the domain, TLS, and document root for your environment.

Deploy source without deleting or replacing `.env`, `data/download-count.txt`, `data/issues.json`, or `data/cache/`. These contain site configuration and runtime state, are excluded from Git, and must survive later deployments.

## Download count

`GET /api/download-count.php` reads the stored total without write access. `POST /api/download-count.php` records one ZIP download-button click under an exclusive file lock. It counts button clicks, not CDN image requests or confirmed completed transfers. Direct ZIP links do not increment it.

If storage is inaccessible, the API returns a JSON error with HTTP 500 and the UI displays `-` instead of inventing a zero. Existing counts are preserved. Permission changes can restore a stored total, but clicks missed while writes failed cannot be recovered from this file.

Run the storage and concurrency checks with:

```sh
python3 scripts/test-php-download-count.py
```

## Asset formats

The library contains 543 SVG sources: 271 codes in each of the 1:1 and 4:3 ratios, plus one standalone original variant. All SVGs have PNG, WebP, and AVIF exports at widths 16, 24, 32, 48, 64, 128, 256, and 512px: 4,344 files per raster format, 13,032 raster files total.

The homepage offers a complete bundle plus separate SVG, PNG, WebP, and AVIF archives. Ready-to-use downloads are also published in [GitHub Releases](https://github.com/gentpan/flagcdn/releases). Generated files are excluded from Git and distributed as release assets.

To reproduce the exports, install Go, `rsvg-convert`, `cwebp`, and `avifenc`, then run:

```sh
python3 scripts/build-flag-assets.py
```

Output appears in `apps/php/raster/` and `apps/php/download/flags-*.zip`. The asset manifest records counts and SHA-256 archive hashes. The `i` symlink maps CDN URLs such as `/i/4x3/64/cn.png`, `/i/1x1/128/us.webp`, and `/i/4x3/512/jp.avif` to the generated files. Deploy the generated folders and retain the symlink. The original standalone SVG uses `original/` exports to preserve its native proportions.

The map uses country coordinates from the repository and OpenStreetMap tiles with visible attribution; no Mapbox access token is needed.

## GitHub and assets

The GitHub button links to `gentpan/flagcdn` and reads that repository's Star count. The count and star icon stay hidden if GitHub cannot be reached or the repository has no stars. Flag asset attribution and upstream release information continue to identify [lipis/flag-icons](https://github.com/lipis/flag-icons).

Project code is MIT licensed; see the root [`LICENSE`](../../LICENSE). Flag SVGs originate from the MIT-licensed `lipis/flag-icons` project. Leaflet's bundled license header and font attribution files are retained alongside their assets.
