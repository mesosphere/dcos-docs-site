---
layout: layout.pug
navigationTitle: Verify Project Logging Stack Installation
title: Verify Project Logging Stack Installation
menuWeight: 30
excerpt: How to verify the project logging stack installation for multi-tenant logging
beta: true
---

You must wait for the Project's logging stack `HelmReleases` to deploy before attempting to configure or use the Project-level logging features, including multi-tenancy. You can check the deployment status using this command on the attached clusters:

``` bash
kubectl get helmreleases -n ${PROJECT_NAMESPACE}
```

It may take some time for these changes to take effect, based on the duration configured for the Flux GitRepository reconciliation.

When successfully deployed, you will see output that includes the following `HelmReleases`:

``` bash
NAMESPACE              NAME                 READY   STATUS                             AGE
${PROJECT_NAMESPACE}   grafana-logging      True    Release reconciliation succeeded   15m
${PROJECT_NAMESPACE}   loki-distributed     True    Release reconciliation succeeded   11m
```
