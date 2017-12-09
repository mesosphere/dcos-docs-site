---
layout: layout.pug
navigationTitle:  Uninstall
title: Uninstall
menuWeight: 20
excerpt:
featureMaturity:
enterprise: false
---

<!-- This source repo for this topic is https://github.com/dcos-kafka-service -->











Run the following command from the DC/OS CLI to uninstall Kafka. Alternatively, you can uninstall Kafka from the DC/OS web interface. [More information about uninstalling DC/OS services](/1.9/deploying-services/uninstall/).

Replace `name` with the name of the kafka instance to be uninstalled.

    $ dcos package uninstall --app-id=<name> kafka
    
Then, use the [framework cleaner script](/1.9/deploying-services/uninstall/#framework-cleaner) to remove your Kafka instance from Zookeeper and to destroy all data associated with it. The script require several arguments, the values for which are derived from your service name:

*   `framework-role` is `<name>-role`.
*   `framework-principal` is `<name>-principal`.
*   `zk_path` is `dcos-service-<name>`.
