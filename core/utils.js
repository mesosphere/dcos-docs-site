// These utils can be used in any JS and are injected into templates as well.
// Use like this: Utils.getPathParts(path)
const _ = require("lodash");

// Names are usually infered via _.startCase: E.g: "kafka-zookeeper" => "Kafka Zookeeper"
// Here you can specify overrides for that behaviour. The names are deduced from the filesystem-paths. E.g: pages/mesosphere/>dcos</2.1
const customNames = {
  dcos: "DC/OS",
  kaptain: "Kaptain",
};

module.exports = {
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
    const productName = customNames[product] || _.startCase(product);

    return { lang, sphere, product, productName, version };
  },
};
