---
layout: layout.pug
navigationTitle: Disable Audit Log Collection
title: Disable Audit Log Collection
menuWeight: 11
excerpt: Audit Logs are enabled and collected by default. If needed, you can disable Audit Log Collection.
beta: false
enterprise: false
---

### Disable Audit Log Collection

Audit Logs are collected using the FluentBit Addon and enabled for collection by default. In some cases this may not be necessary and turning off audit-log-collection would be ideal. This procedure shows how to disable Audit Log Collection.

#### Before you begin

This procedure requires that you have the FluentBit addon enabled. If this is not the case then no further action is required.

#### Disable Audit Log Collection

1.  Update your `cluster.yaml` file’s `ClusterConfiguration` section with the following `values` entries to the `fluentbit` addon entry.

    ```yaml
    ---
    kind: ClusterConfiguration
    apiVersion: konvoy.mesosphere.io/v1beta1
    metadata:
    name: my-cluster
    creationTimestamp: "2020-06-05T16:57:18Z"
    spec:
    kubernetes:
        version: 1.16.8
    …
    addons:
    - configRepository: https://github.com/mesosphere/kubernetes-base-addons
        …
        addonsList:
        …
        - name: fluentbit
          enabled: true
          values: |
            audit:
              enabled: false
        …
    ```

    (Optional) Also, if you wish to remove the Audit Log Dashboard from Kibana, you can update the `cluster.yaml` file with the following `values` entry of kibana

    ```yaml
    …
    addons:
    - configRepository: https://github.com/mesosphere/kubernetes-base-addons
        …
        addonsList:
        …
        - name: kibana
          enabled: true
          values: |
            dashboardImport:
              enabled: false
        …
    ...
    ```

1.  With the `cluster.yaml` file modified, you may now run:

   ```bash
   konvoy up -y
   ```

The changes will be applied if your cluster already exists or audit-logs not collected if this is the first time running the cluster.

## Related information

For information on related topics or procedures, refer to the following:

- [Logging](../../logging)
- [Resource Recommendations](../../logging/recommendations)
- [Fluentbit Addon](../../logging/fluentbit)
