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

The library contains 543 SVG sources: 271 codes in each of the 1:1 and 4:3 ratios, plus one standalone original variant. All SVGs have lossless PNG, WebP, and AVIF exports at widths 16, 24, 32, 48, 64, 128, 256, and 512px: 4,344 files per raster format, 13,032 raster files total. WebP uses `-lossless -exact`; AVIF uses `--lossless` to preserve RGB and alpha, including transparent edges. Lossless AVIF may be larger than WebP or PNG for flag graphics.

The homepage's copy format and image width controls apply to both card copy buttons. SVG HTML uses the existing CSS classes; raster HTML includes an absolute image URL, dimensions and an escaped country name. The 4:3 / 1:1 switch also controls copied URLs and HTML. Image and archive URLs have no query parameters.

The homepage offers a complete bundle plus separate SVG, PNG, WebP, and AVIF archives. Ready-to-use downloads are also published in [GitHub Releases](https://github.com/gentpan/flagcdn/releases). Generated files are excluded from Git and distributed as release assets.

To reproduce the exports, install Go, `rsvg-convert`, `cwebp`, `avifenc`, and Python with Pillow's PNG/WebP/AVIF decoders, then run:

```sh
python3 scripts/build-flag-assets.py
```

Image exports appear directly in `apps/php/4x3/`, `apps/php/1x1/`, and `apps/php/original/`; archives appear in `apps/php/download/flags-*.zip`. The asset manifest records counts and SHA-256 archive hashes. CDN URLs such as `/4x3/64/cn.png`, `/1x1/128/us.webp`, and `/4x3/512/jp.avif` map directly to these files. Deploy the generated folders alongside the PHP application. The original standalone SVG uses `original/` exports to preserve its native proportions.

The build regenerates existing images rather than retaining older lossy encodings, then verifies every decoded RGBA pixel against a fresh SVG render before writing any release archive. `--package-only` skips generation but still runs full pixel validation. Counts, exact matches and error totals are included in the manifest. Independent validation:

```sh
python3 scripts/validate-flag-images.py --require-lossless --keep-references
```

This validates conversion fidelity to the repository's SVGs, not the historical or political accuracy of the source flag designs. Rendering at 16px still loses fine detail through downscaling; choose a larger width for detailed flags.

## CSS formats

Choose one stylesheet; every version keeps the `fi`, `fi-xx`, `fis`, and `fib` selectors:

| Format | CDN stylesheet |
| --- | --- |
| SVG (default) | `https://flagcdn.io/css/flag-icons.min.css` |
| PNG | `https://flagcdn.io/css/flag-icons-png.min.css` |
| WebP | `https://flagcdn.io/css/flag-icons-webp.min.css` |
| AVIF | `https://flagcdn.io/css/flag-icons-avif.min.css` |

The generated raster CSS uses 64px images with 128px `image-set()` choices for high-density screens and a plain URL declaration for browsers without `image-set()`. The browser must support the selected image format. For large flags use a direct image URL at the desired width.

`python3 scripts/build-flag-css.py` generates the three raster stylesheets from the SVG stylesheet and validates every 64/128px file reference; `--check` verifies the committed CSS without writing it. Asset packaging also regenerates the CSS.

The map uses country coordinates from the repository and OpenStreetMap tiles with visible attribution; no Mapbox access token is needed.

## Homepage advertisement

The three-frame LISAHOST carousel appears below the download area and above the five feature cards, at their shared content width. Original Chinese and localized English artwork live in `assets/images/lisahost-banner-zh.png` and `lisahost-banner-en.png`. CSS crops the three rows while preserving the original artwork.

Cloudflare visitor countries CN, HK, MO and TW receive Chinese; other or unknown countries receive English. This choice is independent of the site's language selector. The homepage is private and uncacheable to keep visitor-specific artwork separate. The artwork submits a native GET form to the configured affiliate URL, so hovering does not show a link URL. See [crop coordinates, controls and English generation prompt](../../docs/lisahost-ad.md).

## GitHub and assets

The header shows only a GitHub icon linking to `gentpan/flagcdn`. It does not fetch or display star counts, release versions, or update dates. Flag asset attribution continues to identify [lipis/flag-icons](https://github.com/lipis/flag-icons).

Project code is MIT licensed; see the root [`LICENSE`](../../LICENSE). Flag SVGs originate from the MIT-licensed `lipis/flag-icons` project. Leaflet's bundled license header and font attribution files are retained alongside their assets.
