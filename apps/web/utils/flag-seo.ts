import type { Country } from "~/types/flag";

export interface FlagSeoInput {
  country: Country;
  siteUrl: string;
}

export interface FlagSeoPack {
  title: string;
  description: string;
  keywords: string;
  canonical: string;
  ogImage: string;
  jsonLd: Record<string, unknown>;
}

function siteBase(siteUrl: string) {
  return siteUrl.replace(/\/$/, "");
}

export function buildFlagSeo({ country, siteUrl }: FlagSeoInput): FlagSeoPack {
  const base = siteBase(siteUrl);
  const cc = country.code.toLowerCase();
  const ccUpper = cc.toUpperCase();
  const name = country.name || ccUpper;
  const continent = country.continent || "";

  const title = `${ccUpper} Flag – ${name} SVG, PNG, WebP, AVIF Download`;
  const description =
    `Download the ${name} flag (${ccUpper}) in SVG, PNG, WebP and AVIF at sizes 16–512px. ` +
    `Copy inline SVG for HTML, or hotlink CDN URLs. ` +
    (country.iso ? "ISO 3166-1 alpha-2. " : "Non-ISO extension code. ") +
    (continent ? `${continent}. ` : "") +
    "Free, MIT-licensed, fast global CDN.";

  const keywords = [
    `${name} flag`,
    `${ccUpper} flag`,
    `${name} flag SVG`,
    `${ccUpper} country flag`,
    `${name} flag PNG`,
    `${name} flag download`,
    "country flag icon",
    "flag CDN",
    continent ? `${continent} flag` : "",
    country.capital ? `${country.capital} flag` : "",
    country.name_zh ? `${country.name_zh}国旗` : "",
  ]
    .filter(Boolean)
    .join(", ");

  const canonical = `${base}/flag/${cc}`;
  const ogImage = `${base}/i/1x1/256/${cc}.png`;
  const svgUrl = `${base}/flags/1x1/${cc}.svg`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ImageObject",
        "@id": `${canonical}#image`,
        name: `${name} flag`,
        description,
        contentUrl: svgUrl,
        thumbnailUrl: ogImage,
        encodingFormat: "image/svg+xml",
        keywords,
        license: "https://opensource.org/licenses/MIT",
        creator: { "@type": "Organization", name: "flagcdn.io", url: base },
      },
      {
        "@type": "WebPage",
        "@id": canonical,
        name: title,
        description,
        url: canonical,
        primaryImageOfPage: { "@id": `${canonical}#image` },
        isPartOf: { "@type": "WebSite", name: "flagcdn.io", url: base },
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: base },
            { "@type": "ListItem", position: 2, name: "Flags", item: `${base}/flags` },
            {
              "@type": "ListItem",
              position: 3,
              name: `${name} (${ccUpper})`,
              item: canonical,
            },
          ],
        },
      },
    ],
  };

  return { title, description, keywords, canonical, ogImage, jsonLd };
}
