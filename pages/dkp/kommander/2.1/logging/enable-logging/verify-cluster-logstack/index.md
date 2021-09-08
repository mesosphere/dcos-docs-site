---
layout: layout.pug
navigationTitle: Verify Cluster Logging Stack Installation
title: Verify Cluster Logging Stack Installation
menuWeight: 15
excerpt: How to verify the cluster's logging stack installed successfully
beta: false
---

<!-- markdownlint-disable MD030 -->

You must wait for the cluster’s logging stack `HelmReleases` to deploy before attempting to configure or use the logging features.

1. Set the `WORKSPACE_NAMESPACE` environment variable needed for this procedure using the command to get the name of the workspace's namespace:

   ``` bash
   export WORKSPACE_NAMESPACE=$(kubectl get workspace <type_your_workspace_name> -o jsonpath='{.status.namespaceRef.name}')
   ```

1. Check the deployment status using this command on the attached cluster:

   ``` bash
   kubectl get helmreleases -n ${WORKSPACE_NAMESPACE}
   ```

<p class="message--note"><strong>NOTE: </strong>It may take some time for these changes to take effect, based on the duration configured for the Flux GitRepository reconciliation.</p>

When the logging stack is successfully deployed, you will see output that includes the following `HelmReleases`:

``` bash
NAME                         READY   STATUS                             AGE
fluent-bit                   True    Release reconciliation succeeded   15m
grafana-logging              True    Release reconciliation succeeded   15m
logging-operator             True    Release reconciliation succeeded   15m
logging-operator-logging     True    Release reconciliation succeeded   15m
minio-operator               True    Release reconciliation succeeded   15m
grafana-loki                 True    Release reconciliation succeeded   15m
```

Then, you [can view cluster log data][view-data].

[view-data]: ../view-cluster-logdata
