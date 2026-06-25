import type { Country } from "~/types/flag";
import { isCountryFlag } from "~/utils/country-kind";

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
  const flagKind = isCountryFlag(country) ? "country flag" : "regional or territory flag";
  const codeType = country.iso ? "an ISO 3166-1 alpha-2 code" : "a non-ISO extension code";

  const title = `${name} Flag (${ccUpper}) – SVG, PNG, WebP, AVIF Download`;
  const description =
    `Download the ${name} flag (${ccUpper}) as SVG, PNG, WebP or AVIF in 1:1 and 4:3 ratios. ` +
    `Copy HTML snippets, inline SVG, CSS classes, or direct CDN URLs for websites and apps. ` +
    `${ccUpper} is ${codeType}; this page is categorized as a ${flagKind}. ` +
    (continent ? `Region: ${continent}. ` : "") +
    (country.capital ? `Capital: ${country.capital}. ` : "") +
    "Free, MIT-licensed, optimized for fast global delivery.";

  const keywords = [
    `${name} flag`,
    `${ccUpper} flag`,
    `${name} flag SVG`,
    `${ccUpper} country flag`,
    `${name} flag PNG`,
    `${name} flag download`,
    `${name} flag icon`,
    `${name} SVG flag`,
    `${name} PNG flag`,
    `${ccUpper} SVG flag`,
    `${ccUpper} flag CDN`,
    "country flag icon",
    "free flag icons",
    "SVG flag download",
    "PNG flag download",
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
        width: 256,
        height: 256,
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
        about: {
          "@type": "Thing",
          name: `${name} flag`,
          alternateName: [`${ccUpper} flag`, country.name_zh, country.name_ja, country.name_de, country.name_ru, country.name_ar].filter(Boolean),
        },
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
