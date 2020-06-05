---
layout: layout.pug
navigationTitle: Centralized Cost Monitoring
title: Centralized Cost Monitoring
menuWeight: 7
beta: true
excerpt: Monitoring costs of all managed clusters with Kubecost
---

[Kubecost][https://docs.kubecost.com/], running on Kommander, provides centralized cost monitoring for all managed clusters.
This feature, installed by default in every Kommander cluster, provides a centralized view of Kubernetes resources used on all managed clusters. By default, up to 15 days of cost metrics are retained, with no backup to an external store.

## Centralized Costs

The Kommander cluster collects cost metrics remotely, using Thanos, from each managed cluster. An overview of cost, by workspace and project, is shown in the respective Kommander UI pages. Further cost analysis and details are found in the Kubecost UI running on Kommander, at:

```
https://<CLUSTER_URL>/ops/portal/kommander/kubecost/detail.html#&agg=cluster
```

<p class="message--note"><strong>NOTE: </strong>It takes at least 3 hours for each managed cluster to generate sufficient cost data to be aggregated and presented in the UI.</p>

To identify clusters in Kubecost, managed clusters are distinguished by a monitoring ID.
The monitoring ID corresponds to the kube-system namespace UID of the cluster.
To find a cluster's monitoring ID, go to the **Clusters** tab on the Kommander UI, in the relevant workspace:

```
https://<CLUSTER_URL>/ops/portal/kommander/ui/#/clusters
```

Select `View Details` on the managed cluster card, and find the monitoring ID under `Monitoring ID (clusterId)`.

You can also search or filter by monitoring IDs on the Clusters page.

Alternatively, you can run the following  kubectl command, **using the correct cluster's context or kubeconfig**, to look up the cluster's kube-system namespace UID and determine the cluster with the corresponding costs.

```bash
$ kubectl get namespace kube-system -o jsonpath='{.metadata.uid}'
```

### Grafana dashboards

A set of Grafana dashboards with cost metrics are installed to the centralized Grafana UI:

```
https://<CLUSTER_URL>/ops/portal/kommander/monitoring/grafana
```

These dashboards provide a global view of accumulated costs from all managed clusters.
