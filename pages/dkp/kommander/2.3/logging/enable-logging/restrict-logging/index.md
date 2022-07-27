---
layout: layout.pug
navigationTitle: Override ConfigMap to Restrict Logging
title: Override ConfigMap to Restrict Logging to Specific Namespaces
menuWeight: 25
excerpt: How to override the logging configMap to restrict logging to specific namespaces
beta: false
---

<!-- markdownlint-disable MD030 -->

As a cluster administrator, you may have a need to limit, or restrict, logging activities only to certain namespaces. Kommander allows you to do this by creating an override configMap that modifies the logging configuration created in the [Create AppDeployment for Workspace Logging](../../../logging/enable-logging/create-appdeployment-workspace) procedure.

## Prerequisites

-  Implement each of the steps listed in [Enable Workspace-level Logging](../../../logging/enable-logging).

-  Ensure that log data is available before you execute this procedure.

## Create and use the override entries

To create and use the override configMap entries, follow these steps:

1.  Identify one or more namespaces to which you want to restrict logging.

1.  Create a file named `logging-operator-logging-overrides.yaml` and paste the following YAML code into it to create the overrides configMap:

    ```bash
    apiVersion: v1
    kind: ConfigMap
    metadata:
      name: logging-operator-logging-overrides
      namespace: <your-workspace-namespace>
    data:
      values.yaml: |
        ---
        clusterFlows:
        - name: cluster-containers
          spec:
            globalOutputRefs:
            - loki
            match:
            - exclude:
                namespaces:
                - <your-namespace>
                - <your-other-namespace>
    ```

1.  Add the relevant namespace values for `metadata.namespace` and the `clusterFlows[0].spec.match[0].exclude.namespaces` values at the end of the file, and save the file.

1.  Use the following command to apply the YAML file:

    ```bash
    kubectl apply -f logging-operator-logging-overrides.yaml
    ```

1.  Edit the logging-operator AppDeployment to replace the `spec.configOverrides.name` value with `logging-operator-logging-overrides`. (You can use the steps in the procedure, [Deploy a service with a custom configuration](../../../workspaces/applications/platform-applications/application-deployment#deploy-an-application-with-a-custom-configuration) as a guide.) When your editing is complete, the AppDeployment will resemble this code sample:

    ```yaml
    apiVersion: apps.kommander.d2iq.io/v1alpha2
    kind: AppDeployment
    metadata:
      name: logging-operator
      namespace: ${WORKSPACE_NAMESPACE}
    spec:
      appRef:
        name: logging-operator-3.17.7
        kind: ClusterApp
      configOverrides:
        name: logging-operator-logging-overrides
    ```

1.  Perform actions that generate log data, both in the specified namespaces _and_ the namespaces you mean to exclude.

1.  Verify that the log data contains only the data you expected to receive.
