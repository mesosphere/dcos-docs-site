---
layout: layout.pug
navigationTitle: Centralized Cost Monitoring
title: Centralized Cost Monitoring
menuWeight: 7
beta: true
excerpt: Monitoring costs of all managed clusters with Kubecost
---

[Kubecost][kubecost_website] running on Kommander provides centralized cost monitoring for all managed clusters.
This feature is provided by default in every Kommander cluster and provides a centralized view of Kubernetes resource spend on all managed clusters.

In its beta phase, up to 15 days of cost metrics is retained by default, with no backup to an external store.

## Centralized Costs

The Kommander cluster collects cost metrics remotely from each managed cluster using Thanos.
An overview of cost by workspace and project is shown in the Kommander UI on the respective pages.
Further cost analysis and details can be perused in the Kubecost UI running on Kommander, which can be accessed at:

```
https://<CLUSTER_URL>/ops/portal/kommander/kubecost/detail.html#&agg=cluster
```

<p class="message--note"><strong>NOTE: </strong>It will take at least 2 hours for cost data from managed clusters to be accumulated and presented in the UI.</p>

### Grafana dashboards

There is also a set of Grafana dashboards with cost metrics that are installed to the centralized Grafana UI:

```
https://<CLUSTER_URL>/ops/portal/kommander/monitoring/grafana
```

These dashboards provide a global view of accumulated costs from all managed clusters.

[kubecost_website]: https://kubecost.com
