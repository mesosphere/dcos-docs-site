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

Run the following commands on the **management** cluster:

1. Execute the following command to get the namespace of your workspace

   ```bash
   kubectl get workspaces
   ```

   Copy the value under `WORKSPACE NAMESPACE` column for your workspace. This may NOT be identical to the Display Name of the `Workspace`.

1. Export the `WORKSPACE_NAMESPACE` variable:

   ```bash
   export WORKSPACE_NAMESPACE=<WORKSPACE_NAMESPACE>
   ```

Run the following commands on the **attached** cluster:

Ensure you switched to the correct [context or kubeconfig](https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/) of the attached cluster for the following kubectl commands:

1. Check the deployment status using this command on the attached cluster:

   ```bash
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
