---
layout: layout.pug
navigationTitle: Verify Project Logging Stack Installation
title: Verify Project Logging Stack Installation
menuWeight: 30
excerpt: How to verify the project logging stack installation for multi-tenant logging
beta: false
---

You must wait for the Project's logging stack `HelmReleases` to deploy before configuring or using the Project-level logging features, including multi-tenancy:

Run the following commands on the **management** cluster:

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

    Run the following commands on the **attached** cluster:

    Ensure you switch to the correct [context or kubeconfig](https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/) of the attached cluster for the following kubectl commands:

1.  Check the deployment status using this command on the attached cluster:

    ``` bash
    kubectl get helmreleases -n ${PROJECT_NAMESPACE}
    ```

<p class="message--note"><strong>NOTE: </strong>It may take some time for these changes to take effect, based on the duration configured for the Flux GitRepository reconciliation.</p>

When successfully deployed, you will see output that includes the following `HelmReleases`:

``` bash
NAMESPACE              NAME                 READY   STATUS                             AGE
${PROJECT_NAMESPACE}   grafana-logging      True    Release reconciliation succeeded   15m
${PROJECT_NAMESPACE}   loki-distributed     True    Release reconciliation succeeded   11m
```

Then, you can [view project log data within multi-tenant logging][view-project-logging].

[view-project-logging]: ../view-proj-logdata
