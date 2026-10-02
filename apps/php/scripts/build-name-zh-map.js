const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const countryPath = path.join(root, "data", "country.json");
const mapPath = path.join(root, "data", "name-zh-map.json");

const countries = JSON.parse(fs.readFileSync(countryPath, "utf8"));
const nameZh = {};
countries.forEach((c) => {
  if (c.code && c.name_zh) nameZh[c.code] = c.name_zh;
});

fs.writeFileSync(mapPath, JSON.stringify(nameZh, null, 2) + "\n", "utf8");
console.log("Wrote name-zh-map.json with", Object.keys(nameZh).length, "entries.");
