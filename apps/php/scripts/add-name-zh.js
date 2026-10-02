const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const countryPath = path.join(root, "data", "country.json");
const mapPath = path.join(root, "data", "name-zh-map.json");

const countries = JSON.parse(fs.readFileSync(countryPath, "utf8"));
const nameZh = JSON.parse(fs.readFileSync(mapPath, "utf8"));

countries.forEach((c) => {
  c.name_zh = nameZh[c.code] != null ? nameZh[c.code] : c.name;
});

fs.writeFileSync(countryPath, JSON.stringify(countries, null, 2) + "\n", "utf8");
console.log("Updated country.json with name_zh for", countries.length, "entries.");
