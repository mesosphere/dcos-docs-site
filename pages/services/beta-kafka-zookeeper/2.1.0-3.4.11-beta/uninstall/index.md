---
layout: layout.pug
navigationTitle:
title: Uninstall
menuWeight: 20
excerpt: Uninstalling Apache ZooKeeper
featureMaturity:
enterprise: false
---

<!-- https://github.com/mesosphere/dcos-zookeeper/ -->


<!-- THIS CONTENT DUPLICATES THE DC/OS OPERATION GUIDE -->

### DC/OS 1.10

If you are using DC/OS 1.10 and the installed service has a version greater than 2.0.0-x:

1. Uninstall the service. From the DC/OS CLI, enter `dcos package uninstall --app-id=<instancename> kafka-zookeeper`.

For example, to uninstall an Apache ZooKeeper instance named `kafka-zookeeper-dev`, run:

```shell
dcos package uninstall --app-id=kafka-zookeeper-dev kafka-zookeeper
```

### Older versions

If you are running DC/OS 1.9 or older, or a version of the service that is older than 2.0.0-x, follow these steps:

1. Stop the service. From the DC/OS CLI, enter `dcos package uninstall --app-id=<instancename> kafka-zookeeper`.
   For example, `dcos package uninstall --app-id=kafka-zookeeper-dev kafka-zookeeper`.
1. Clean up remaining reserved resources with the framework cleaner script, `janitor.py`. See the [DC/OS documentation](/1.9/deploying-services/uninstall/#framework-cleaner) for more information about the framework cleaner script.

For example, to uninstall an Apache ZooKeeper instance named `kafka-zookeeper-dev`, run:

```shell
MY_SERVICE_NAME=kafka-zookeeper-dev
dcos package uninstall --app-id=$MY_SERVICE_NAME kafka-zookeeper`.
dcos node ssh --master-proxy --leader "docker run mesosphere/janitor /janitor.py \
    -r $MY_SERVICE_NAME-role \
    -p $MY_SERVICE_NAME-principal \
    -z dcos-service-$MY_SERVICE_NAME"
```

<!-- END DUPLICATE BLOCK -->
