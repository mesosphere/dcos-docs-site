---
layout: layout.pug
navigationTitle:  Uninstalling
title: Uninstalling
menuWeight: 20
excerpt:
featureMaturity:
enterprise: false
---

<!-- This source repo for this topic is https://github.com/mesosphere/confluent -->


Follow these steps to uninstall the service.


## CLI

1. Uninstall the service. From the DC/OS CLI, enter `dcos package uninstall confluent-kafka`.

1. If you are using DC/OS version 1.9 or older, you must clean up remaining reserved resources with the framework cleaner script, `janitor.py`. [More information about the framework cleaner script](/1.9/deploying-services/uninstall/#framework-cleaner).

To uninstall an instance named `confluent-kafka` (the default), run:
```
MY_SERVICE_NAME=confluent-kafka
dcos package uninstall $MY_SERVICE_NAME
dcos node ssh --master-proxy --leader "docker run mesosphere/janitor /janitor.py \
    -r $MY_SERVICE_NAME-role \
    -p $MY_SERVICE_NAME-principal \
    -z dcos-service-confluent-kafka"
```
