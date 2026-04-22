# flagcdn.io Memory

## Project shape

- This is a small PHP website, not a Node or framework app.
- Main entry pages are `index.php`, `docs.php`, `issues.php`, and `changelog.php`.
- Shared layout is split across `header.php` and `footer.php`.
- Frontend behavior lives mostly in `assets/app.js`, `assets/i18n.js`, and `assets/site.js`.
- Data storage is file-based under `data/`.

## Important runtime details

- The homepage map modal currently uses a public Mapbox token hardcoded in `assets/app.js`.
- The header visitor flag is rendered from Cloudflare's `CF-IPCountry` request header in `header.php`.
- The site uses clean URLs like `/docs/`, `/issues/`, and `/changelog/`.
- Apache routing and dotfile protection are defined in `.htaccess`.
- `.env` is currently inside the web root, so web-server blocking of dotfiles is important.

## Deployment

- Production server: `136.243.151.32` (`hz-sites`), managed with 1Panel.
- Production site path: `/opt/1panel/www/sites/flagcdn.io/index`.
- The production site directory is not a git worktree.
- Current deployment flow is:
  - commit locally
  - push to GitHub `origin/main`
  - sync changed files to the 1Panel site path with `rsync` over SSH
- Latest deployed GitHub commit: `7ad00ed` (`Use Cloudflare country header for visitor flag`).

## What was changed on 2026-04-03

- Added `assets/site.js` to centralize shared page scripts:
  - visitor country flag
  - GitHub stars
  - latest release announcement
  - footer back-to-top behavior
- Updated `footer.php` to load `assets/site.js` globally.
- Removed duplicated shared header/footer JS from `docs.php`, `issues.php`, and `changelog.php`.
- Fixed race conditions in `api/download-count.php` by using a single locked read-modify-write flow.
- Fixed race conditions in `api/issues.php` rate limiting by locking the per-IP temp file during the full update.
- Added `.htaccess` with:
  - clean URL rewrites for `/docs/`, `/issues/`, `/changelog/`
  - dotfile blocking such as `.env`
  - `DirectoryIndex index.php`

## What was changed on 2026-04-22

- Replaced homepage CTA icons with Font Awesome icons instead of custom SVG/mask rendering:
  - docs button uses `fa-file-lines`
  - download button uses `fa-arrow-down-to-line`
- Replaced the flag-card "copy image URL" action icon with Font Awesome `fa-clone`.
- Added a CSS override for `.fi::before` in `assets/main.css` to avoid mojibake rendering (`A` / `Â`) over sample flags on some setups.
- Removed the browser-side `https://api.cnip.io/geoip` fetch and switched the header visitor flag to Cloudflare `CF-IPCountry`, fixing the CORS error and removing the third-party geo-IP dependency from the browser.
- Synced these changes to GitHub and deployed them to the 1Panel production server via `rsync`.

## Current architecture notes

- Download stats are stored in `data/download-count.txt`.
- Feedback items are stored in `data/issues.json`.
- Rate limiting for feedback uses temp files in `sys_get_temp_dir()`.
- Pages still call third-party APIs directly from the browser for GitHub metadata.

## Good next improvements

- Move GitHub metadata fetches behind local cached PHP endpoints.
- Either complete or hide partially supported languages in `assets/i18n.js` (`ja`, `de`, `ru`, `ar` are mostly fallback content).
- Consider moving `.env` outside the web root if deployment allows it.
