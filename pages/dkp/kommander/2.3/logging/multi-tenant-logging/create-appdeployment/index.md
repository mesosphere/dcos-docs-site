---
layout: layout.pug
navigationTitle: Create Project-level logging AppDeployments
title: Create Project-level logging AppDeployments
menuWeight: 15
excerpt: How to create Project-level AppDeployments for use in multi-tenant logging
beta: false
---

You must create AppDeployments in the Project namespace to enable and deploy the logging stack to all clusters within a Project. You can use the CLI to do this, or use the DKP UI to enable the logging applications.

To create the AppDeployments needed for Project-level logging, follow these steps **on the management cluster**:

1.  Execute the following command to get the namespace of your workspace

    ```bash
    kubectl get workspaces
    ```

    Copy the value under `WORKSPACE NAMESPACE` column for your workspace. This may NOT be identical to the Display Name of the `Workspace`.

1.  Export the `WORKSPACE_NAMESPACE` variable:

    ```bash
    export WORKSPACE_NAMESPACE=<WORKSPACE_NAMESPACE>
    ```

1.  Execute the following command to get the namespace of your project

    ```bash
    kubectl get projects -n ${WORKSPACE_NAMESPACE}
    ```

    Copy the value under `PROJECT NAMESPACE` column for your project. This may NOT be identical to the Display Name of the `Project`.

1.  Export the `PROJECT_NAMESPACE` variable:

    ```bash
    export PROJECT_NAMESPACE=<PROJECT_NAMESPACE>
    ```

1.  Copy this command and execute it from a command line:

    ``` bash
    cat <<EOF | kubectl apply -f -
    ---
    apiVersion: apps.kommander.d2iq.io/v1alpha2
    kind: AppDeployment
    metadata:
      name: project-grafana-loki
      namespace: ${PROJECT_NAMESPACE}
    spec:
      appRef:
        name: project-grafana-loki-0.48.3
        kind: ClusterApp
    ---
    apiVersion: apps.kommander.d2iq.io/v1alpha2
    kind: AppDeployment
    metadata:
      name: project-grafana-logging
      namespace: ${PROJECT_NAMESPACE}
    spec:
      appRef:
        name: project-grafana-logging-6.28.0
        kind: ClusterApp
    EOF
    ```

Then, you can [verify the project logging stack installation for multi-tenant logging][verify-project-logstack].

[verify-project-logstack]: ../verify-proj-logstack-install
