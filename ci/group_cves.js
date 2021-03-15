const groupBy = require("lodash/groupBy");
const fs = require("fs");

const input = `${__dirname}/../assets/konvoy_latest.json`;
const output = `${__dirname}/../assets/cves.json`;

const grouped = Object.values(
  groupBy(JSON.parse(fs.readFileSync(input)), (c) => c.vulnerability_name)
).map((group) => ({ ...group[0], purls: group.map((c) => c.resource_purl) }));
fs.writeFileSync(output, JSON.stringify(grouped));
