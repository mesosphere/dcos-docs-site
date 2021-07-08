---
layout: layout.pug
navigationTitle: Verify Cluster Logging Stack Installation
title: Verify Cluster Logging Stack Installation
menuWeight: 10
excerpt: How to verify the cluster's logging stack installed successfully
beta: true
---

You must wait for the cluster’s logging stack `HelmReleases` to deploy before attempting to configure or use the logging features. You can check the deployment status using this command on the attached cluster:

``` bash
kubectl get helmreleases -n ${WORKSPACE_NAMESPACE}
```

It may take some time for these changes to take effect, based on the duration configured for the Flux GitRepository reconciliation.

When the logging stack is successfully deployed, you will see output that includes the following `HelmReleases`:

``` bash
NAMESPACE                NAME                         READY    STATUS                             AGE
${WORKSPACE_NAMESPACE}    grafana-logging              True    Release reconciliation succeeded   15m
${WORKSPACE_NAMESPACE}    logging-operator             True    Release reconciliation succeeded   15m
${WORKSPACE_NAMESPACE}    logging-operator-logging     True    Release reconciliation succeeded   15m
${WORKSPACE_NAMESPACE}    loki-distributed             True    Release reconciliation succeeded   15m
```
