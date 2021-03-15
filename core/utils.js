// These utils can be used in any JS and are injected into templates as well.
// Use like this: Utils.getPathInfo(path)
const _ = require("lodash");
const semver = require("semver");

// Names are usually infered via _.startCase: E.g: "kafka-zookeeper" => "Kafka Zookeeper". We respect the mapping specified in `products` though.
const toProductName = (slug) => products[slug] || _.startCase(slug);
const products = {
  conductor: "Conductor",
  dcos: "DC/OS",
  dispatch: "Dispatch",
  kaptain: "Kaptain",
  kommander: "Kommander",
  konvoy: "Konvoy",
};

const isValue = (v) => v !== undefined && v !== null;
function spaceship(val1, val2) {
  if (!isValue(val1) || !isValue(val2) || typeof val1 !== typeof val2) return 0;

  if (typeof val1 === "string") {
    return val1.localeCompare(val2);
  }
  return val1 - val2;
}
const semverCompare = (a, b) => {
  try {
    return semver.rcompare(a, b);
  } catch (_) {
    return 0;
  }
};

module.exports = {
  // take a path and normalize things for services.
  getPathInfo(path) {
    const fragments = path.split("/").slice(1);

    // if you think about changing this, make sure that /mesosphere/dcos/cn/services/hdfs/2.2.0 works. you're welcome!
    const lang = fragments[2] === "cn" ? "cn" : "en";
    if (lang !== "en") fragments.splice(2, 1);
    // a service would now be services/kafka/2.1
    //                   sphere^  product^    ^version
    const isService = fragments[2] === "services";
    if (isService) fragments.splice(0, 2);

    const [sphere, product, version] = fragments;
    const productName = toProductName(product);

    // prettier-ignore
    // We have a dropdown on search pages that allows to select products in a given version:
    const searchFacet =
      // Aggregate all DC/OS services in one facet
      sphere === "services" ? "DC/OS Services"
        // only add things that look like version. we could change our file layout to get rid of this. we'd currently see a `DC/OS - example snippets` if we didn't sieve.
        : (version || "").match(/^\d.\d/) ? `${productName}${version ? " " + version : ""}`
        : null;

    return { lang, sphere, searchFacet, product, productName, version };
  },
  products,
  sortPages(a, b) {
    return (
      spaceship(a.menuWeight, b.menuWeight) ||
      semverCompare(a.id, b.id) ||
      spaceship(a.navigationTitle, b.navigationTitle) ||
      spaceship(a.title, b.title) ||
      spaceship(a.path, b.path)
    );
  },
};
