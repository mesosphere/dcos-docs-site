const groupBy = require("lodash/groupBy");
const fs = require("fs");

const cves = JSON.parse(fs.readFileSync("../assets/konvoy_latest.json"));
const grouped = Object.values(groupBy(cves, (c) => c.vulnerability_name)).map(
  (group) => {
    return { ...group[0], purls: group.map((c) => c.resource_purl) };
  }
);
fs.writeFileSync("../assets/konvoy_cves.json", JSON.stringify(grouped));
