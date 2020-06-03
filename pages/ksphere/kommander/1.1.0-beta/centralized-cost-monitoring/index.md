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

<p class="message--note"><strong>NOTE: </strong>It will take at least 3 hours for each managed cluster to generate sufficient cost data to be aggregated and presented in the UI.</p>

Managed clusters are distinguished by a monitoring ID which is used to identify clusters in Kubecost.
The monitoring ID corresponds to the kube-system namespace UID of the cluster.
To find a cluster's monitoring ID, you can go to the Clusters tab on the Kommander UI (in the relevant workspace):

```
https://<CLUSTER_URL>/ops/portal/kommander/ui/#/clusters
```

Click on the `View Details` link on the managed cluster card, and the monitoring ID can be found under `Monitoring ID (clusterId)`.

You may also search or filter by monitoring IDs on the Clusters page, linked above.

Alternatively, you can run this kubectl command, **using the correct cluster's context or kubeconfig**, to look up the cluster's kube-system namespace UID to determine which cluster the costs correspond to:

```bash
$ kubectl get namespace kube-system -o jsonpath='{.metadata.uid}'
```

### Grafana dashboards

There is also a set of Grafana dashboards with cost metrics that are installed to the centralized Grafana UI:

```
https://<CLUSTER_URL>/ops/portal/kommander/monitoring/grafana
```

These dashboards provide a global view of accumulated costs from all managed clusters.

[kubecost_website]: https://kubecost.com
