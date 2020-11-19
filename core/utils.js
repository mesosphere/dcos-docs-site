// These utils can be used in any JS and are injected into templates as well.
// Use like this: Utils.getPathParts(path)
const _ = require("lodash");

// Names are usually infered via _.startCase: E.g: "kafka-zookeeper" => "Kafka Zookeeper". We have some overrides here though:
const toProductName = (slug) =>
  ({
    conductor: "Conductor",
    dcos: "DC/OS",
    dispatch: "Dispatch",
    kaptain: "Kaptain",
    kommander: "Kommander",
    konvoy: "Konvoy",
  }[slug] || _.startCase(slug));

module.exports = {
  toProductName,
  // take a path and normalize things for services.
  getPathParts(path) {
    const fragments = path.split("/");

    // if you think about changing this, make sure that /mesosphere/dcos/cn/services/hdfs/2.2.0 works. you're welcome!
    const lang = fragments[2] === "cn" ? "cn" : "en";
    if (lang !== "en") fragments.splice(2, 1);
    // a service would now be services/kafka/2.1
    //                   sphere^  product^    ^version
    const isService = fragments[2] === "services";
    if (isService) fragments.splice(0, 2);

    const [sphere, product, version] = fragments;
    const productName = toProductName(product);

    return { lang, sphere, product, productName, version };
  },
};
