/**
 * Fetch CLDR territory names (ja, de, ru, ar) and add name_ja, name_de, name_ru, name_ar to data/country.json.
 * Run: node scripts/add-name-ja-de-ru-ar.js
 */
const fs = require("fs");
const path = require("path");
const https = require("https");

const root = path.join(__dirname, "..");
const countryPath = path.join(root, "data", "country.json");

const CLDR_BASE = "https://raw.githubusercontent.com/unicode-org/cldr-json/main/cldr-json/cldr-localenames-full/main";
const LANGS = ["ja", "de", "ru", "ar"];

const codeToCldr = {
  "sh-ac": "AC",
  "ic": "IC",
  "dg": "DG",
  "un": "UN",
  "um": "UM",
  "sh-ta": "TA",
  "xk": "XK",
  "sh-hl": "SH",
  "sh": "SH",
};

/** 完整清单：CLDR 无条目的 code 使用以下四语名称（ja, de, ru, ar） */
const manualNames = {
  asean: { ja: "東南アジア諸国連合", de: "ASEAN", ru: "АСЕАН", ar: "آسيان" },
  "es-pv": { ja: "バスク", de: "Baskenland", ru: "Страна Басков", ar: "إقليم الباسك" },
  "es-ct": { ja: "カタルーニャ", de: "Katalonien", ru: "Каталония", ar: "كاتالونيا" },
  cefta: { ja: "中欧自由貿易協定", de: "CEFTA", ru: "ЦЕФТА", ar: "سيفتا" },
  eac: { ja: "東アフリカ共同体", de: "Ostafrikanische Gemeinschaft", ru: "Восточноафриканское сообщество", ar: "الجماعة الشرق أفريقية" },
  "gb-eng": { ja: "イングランド", de: "England", ru: "Англия", ar: "إنجلترا" },
  "es-ga": { ja: "ガリシア", de: "Galizien", ru: "Галисия", ar: "غاليسيا" },
  arab: { ja: "アラブ連盟", de: "Arabische Liga", ru: "Лига арабских государств", ar: "جامعة الدول العربية" },
  pc: { ja: "太平洋共同体", de: "Pazifikgemeinschaft", ru: "Тихоокеанское сообщество", ar: "مجتمع المحيط الهادئ" },
  "gb-nir": { ja: "北アイルランド", de: "Nordirland", ru: "Северная Ирландия", ar: "أيرلندا الشمالية" },
  "gb-sct": { ja: "スコットランド", de: "Schottland", ru: "Шотландия", ar: "اسكتلندا" },
  "gb-wls": { ja: "ウェールズ", de: "Wales", ru: "Уэльс", ar: "ويلز" },
};

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on("error", reject);
  });
}

function getCldrKey(code) {
  if (codeToCldr[code]) return codeToCldr[code];
  if (code.length === 2) return code.toUpperCase();
  return null;
}

async function main() {
  const countries = JSON.parse(fs.readFileSync(countryPath, "utf8"));

  const territories = {};
  for (const lang of LANGS) {
    const url = `${CLDR_BASE}/${lang}/territories.json`;
    const json = await fetchJson(url);
    territories[lang] = json.main[lang].localeDisplayNames.territories || {};
  }

  countries.forEach((c) => {
    const manual = manualNames[c.code];
    const cldrKey = getCldrKey(c.code);
    LANGS.forEach((lang) => {
      const key = "name_" + lang;
      let value = c.name;
      if (manual && manual[lang]) {
        value = manual[lang];
      } else if (cldrKey && territories[lang][cldrKey]) {
        value = territories[lang][cldrKey];
      }
      c[key] = value;
    });
  });

  fs.writeFileSync(countryPath, JSON.stringify(countries, null, 2) + "\n", "utf8");
  console.log("Updated country.json with name_ja, name_de, name_ru, name_ar for", countries.length, "entries.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
