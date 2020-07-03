const fetch = require("node-fetch");
const fs = require("fs");
const PromisePool = require("es6-promise-pool");

// const MAP = "./docker/nginx/redirects-301.map";
const MAP = "./docker/nginx/redirects-wp-ee.map";
const CONCURRENCY = 5;
const START_AT_OFFSET = 150;

let rules = fs.readFileSync(MAP).toString().split("\n");

const targets = rules
  .filter((line) => !line.startsWith("~") && line.includes(" "))
  .map((line) => line.split(" ")[1].replace(";", ""))
  .filter((x) => !x.startsWith("https:"))
  .slice(START_AT_OFFSET);

const jobs = targets.map((url) => () =>
  fetch(`https://docs.d2iq.com${url}`, { redirect: "follow" })
    .then((res) => {
      console.log(res.status, url);
      if (res.status >= 300) {
        rules = rules.filter((line) => !line.includes(url));
        fs.writeFileSync(MAP, rules.join("\n"));
      }
    })
    .catch((err) => void console.log(err.message))
);

new PromisePool(() => {
  const next = jobs.pop();
  return next ? next() : null;
}, CONCURRENCY).start();
