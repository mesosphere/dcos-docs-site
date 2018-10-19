const ncp = require('ncp').ncp;
const fs = require('fs');

ncp.limit = 16;

const mapFile = fs.readFileSync('./config/submodules-location-map.json');

const submodulesMapping = JSON.parse(mapFile);

Object.keys(submodulesMapping).forEach(subName => {
  const fullSubPath = `submodules/${subName}/docs`;
  const docsDestination = submodulesMapping[subName];

  ncp(fullSubPath, docsDestination, (err) => {
    if (err) {
      throw err;
    }
    console.log(`Files moved for ${subName}.`);
  });
});
