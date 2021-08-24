---
layout: layout.pug
navigationTitle: Verify Project Logging Stack Installation
title: Verify Project Logging Stack Installation
menuWeight: 30
excerpt: How to verify the project logging stack installation for multi-tenant logging
beta: false
---

<!-- markdownlint-disable MD030 -->

You must wait for the Project's logging stack `HelmReleases` to deploy before attempting to configure or use the Project-level logging features, including multi-tenancy. You can check the deployment status using this command **on the attached clusters**:

1. Ensure to switch to the correct [context or Kubeconfig](https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/) of the attached cluster for the following kubectl commands.

1. Set the environment variables needed for this procedure with the command:

   ``` bash
   export WORKSPACE_NAMESPACE=$(kubectl get workspace <type_your_workspace_name> -o jsonpath='{.status.namespaceRef.name}')
   export PROJECT_NAMESPACE=$(kubectl get project -n ${WORKSPACE_NAMESPACE} <type_your_project_name> -o jsonpath='{.status.namespaceRef.name}')
   ```

1. Check the deployment status using this command on the attached cluster:

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
