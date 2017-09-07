const jsdom = require("jsdom");
const { Script } = require("vm");
const { JSDOM } = jsdom;
const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');

const inputFile = process.argv[2];
const outputFile = process.argv[3];

const htmlTemplate = `
  <!DOCTYPE html>
  <div id="main">
    <div id="swagger-ui" class="swagger-ui" data-api="${inputFile.replace("./pages", "")}">Loading...</div>
  </div>
`;

const dom = new JSDOM(htmlTemplate, { runScripts: "outside-only" });

const yamlObj = yaml.load(fs.readFileSync(inputFile, {encoding: 'utf-8'}));
dom.window.spec = yamlObj;

let swaggerUIBundle = fs.readFileSync('./js/vendor/swagger/swagger-ui-bundle.js', { encoding: 'utf-8' });
let swaggerUIStandAlonePreset = fs.readFileSync('./js/vendor/swagger/swagger-ui-standalone-preset.js', { encoding: 'utf-8' });
let script = fs.readFileSync('./scripts/swagger-js-dom.js', { encoding: 'utf-8' });

let concatScript = swaggerUIBundle + '\n' +  swaggerUIStandAlonePreset + '\n' + script;
const s = new Script(concatScript);
dom.runVMScript(s);

dom.window.onModulesLoaded = () => {
  let html = dom.window.document.querySelector("#main").innerHTML.trim();
  fs.writeFileSync(outputFile, html);
};
