# LISAHOST homepage advertisement

The homepage shows a three-frame carousel between the download area and the five feature cards. The advertisement frame shares their content width: 1168px at the 1200px container maximum.

## Assets and crops

The original Chinese artwork is preserved byte-for-byte in `apps/php/assets/images/lisahost-banner-zh.png`. The English artwork is `apps/php/assets/images/lisahost-banner-en.png`. Both are 2141 × 734px. The site crops each row with CSS, leaving the white separators outside the viewport.

| Artwork | Frame | Start Y | Height |
| --- | --- | --- | --- |
| Chinese | 1 | 0 | 238 |
| Chinese | 2 | 247 | 239 |
| Chinese | 3 | 495 | 239 |
| English | 1 | 0 | 237 |
| English | 2 | 246 | 237 |
| English | 3 | 491 | 243 |

Cloudflare's visitor-country header selects Chinese for CN, HK, MO and TW; all other or unknown countries receive English. The choice is independent of the site's language selector. Homepage responses are private and uncacheable so visitor-specific artwork is not shared.

## Interaction

The slideshow changes frames every four seconds, with manual frame selection and pause/play controls. Hover, keyboard focus and hidden tabs pause rotation. Reduced-motion users see a static first frame and may still use the controls.

The artwork uses a native GET form targeting `https://lisahost.com/aff.php`, with `aff=7877` as its hidden parameter. Clicking opens the supplied affiliate URL in the current tab. The visual is a submit button, so hovering shows no link URL or URL tooltip.

## English image generation

Created with the built-in image generation tool in text-localization edit mode using the Chinese artwork as the edit target. No CLI or external generation API was used. The result retains the original composition, app logos and brand colors.

Initial localization prompt:

```text
Use case: text-localization.
Asset type: an English localized website banner sprite, THREE ultra-wide horizontal ad strips stacked vertically, based on Image 1.
Image 1 is the EDIT TARGET. Create its English-language version. Preserve the blue/white top strip with globe and app cards, the electric-blue middle strip with LIAHOST logo and house, and the dark navy bottom strip with app icons. Preserve all brand logos, all app cards, composition, colors, whitespace, white separator lines and hierarchy. Keep exactly THREE equal-height rows in the same very-wide overall 2.918:1 canvas ratio (about 2144x736 px), without extra padding. Each strip will later be cropped independently at its original full width; all text must stay within each strip and remain legible.
Change ONLY Chinese copy to this exact English copy:
TOP large headline: "Choose VPS. Choose Better IPs." The "Better IPs." portion should be blue; other headline words near-black. Fit this on one line in the original left headline area without colliding with the app cards. TOP smaller subtitle: "Cleaner networks. More possibilities." Keep the handwritten English "Open a Bigger World" and all original brand/app labels as shown.
MIDDLE left branding: keep L-shaped logo and replace Chinese branding above LIAHOST with "LIAHOST"; do not duplicate it awkwardly if the original English LIAHOST wordmark already provides the full brand. MIDDLE main headline: "Residential IPs · Dual ISP". "Dual ISP" in the original lime green. MIDDLE small subtitle: "Real home networks | Multiple locations | Dedicated IPs | Stable speeds". House tags: "Residential IP" and "Dual ISP". Three right benefit lines: "Cleaner IPs", "More stable", "Wider access".
BOTTOM main headline remains exactly "Netflix · ChatGPT · Claude". Replace the Chinese subtitle with "Reliable access across all platforms". Keep the seven branded app cards and handwritten "More Possibilities".
Use correct spelling, natural spacing, faithful bold typography and aligned baselines. No remaining Chinese characters, no new brands, no extra marketing claims, no URLs, no QR codes, no watermark. High quality final bitmap preserving the reference design.
```

## Final edits

The English wordmark was corrected to LISAHOST. At the user's request, the main headline and house-side label then changed from Dual ISP to ISP IP. Both edits used the built-in image tool and kept the three-strip layout.

Brand correction prompt:

```text
Use case: text-localization correction. Image 1 is the edit target, an English three-strip advertisement sprite. Make ONLY ONE precise text correction: the white brand wordmark at the LEFT of the MIDDLE BLUE STRIP currently reads LIAHOST (missing S). Replace it with the exact brand spelling "LISAHOST" (L I S A H O S T), bold white and aligned beside the existing L-shaped logo. Fit it inside the same left branding area before the white vertical divider. Preserve everything else: all three strips, all English headlines/subtitles, benefit labels, app icons, globe, house, colors, image dimensions 2141x734, white separators, margins and layout. Do not change any other text, do not alter any logo other than this wordmark correction, add no new elements. Keep the full source canvas unchanged.
```

Final user-requested edit prompt:

```text
Use case: text-localization edit. Image 1 is the current approved English advertisement, THREE stacked wide banner strips. Make exactly this user-requested change in the MIDDLE blue strip: replace the large lime-green words "Dual ISP" with "ISP IP", and replace the small floating blue house-side label "Dual ISP" with "ISP IP". The complete main headline becomes "Residential IPs · ISP IP". Match the existing fonts, colors, size hierarchy, spacing and alignment; center the shorter lime-green "ISP IP" within its current title area. The brand at the left MUST remain exactly "LISAHOST" (L I S A H O S T). Preserve all other English text verbatim, every app logo, globe, house, benefit checks, original blue/white/dark three-row design, two white separator lines and the full 2141×734 canvas. Change no Chinese artwork, add no new words, URLs, QR codes, or elements. No "Dual ISP" text may remain in this English image. Keep the three strips full-width so each can be cropped independently.
```


