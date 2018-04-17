---
layout: layout.pug
navigationTitle:  Uninstalling
title: Uninstalling
menuWeight: 30
excerpt:
featureMaturity:
enterprise: false
---

<!-- This source repo for this topic is https://github.com/mesosphere/dse-private -->


Follow these steps to uninstall the service.
1. Stop the service. From the DC/OS CLI, enter `dcos package uninstall datastax-dse`.
1. Clean up remaining reserved resources with the framework cleaner script, `janitor.py`. [More information about the framework cleaner script](/1.8/usage/managing-services/uninstall/#framework-cleaner).

NOTE: Repeat the above steps if you need to uninstall OpsCenter, but substitute `datastax-ops` for `datastax-dse`.

To uninstall a DSE instance named `datastax-dse` (the default), run:
```
MY_SERVICE_NAME=datastax-dse
dcos package uninstall --app-id=$MY_SERVICE_NAME datastax-dse
dcos node ssh --master-proxy --leader "docker run mesosphere/janitor /janitor.py \
    -r $MY_SERVICE_NAME-role \
    -p $MY_SERVICE_NAME-principal \
    -z dcos-service-$MY_SERVICE_NAME"
```
