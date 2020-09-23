---
layout: layout.pug
navigationTitle: Centralized Cost Monitoring
title: Centralized Cost Monitoring
menuWeight: 7
beta: true
excerpt: Monitoring costs of all managed clusters with Kubecost
---

[Kubecost][kubecost_website], running on Kommander, provides centralized cost monitoring for all managed clusters.
This feature, installed by default in every Kommander cluster, provides a centralized view of Kubernetes resources used on all managed clusters.
By default, up to 15 days of cost metrics are retained, with no backup to an external store.

## Centralized Costs

The Kommander cluster collects cost metrics remotely, using Thanos, from each managed cluster.
Costs from the last 1 day and last 7 days are displayed for each cluster, workspace, and project breakdown in the respective Kommander UI pages.
Further cost analysis and details can be found in the Kubecost UI running on Kommander, at:

```
https://<CLUSTER_URL>/ops/portal/kommander/kubecost/frontend/detail.html#&agg=cluster
```

For more information on cost allocation metrics and how to navigate this view in the Kubecost UI, please see the [Kubecost docs on Kubernetes Cost Allocation][kubecost_cost_allocation].

To identify the clusters in Kubecost, use the cluster's monitoring ID.
The monitoring ID corresponds to the kube-system namespace UID of the cluster.
To find a cluster's monitoring ID, go to the **Clusters** tab on the Kommander UI in the relevant workspace:

```
https://<CLUSTER_URL>/ops/portal/kommander/ui/clusters
```

Select **View Details** on the managed cluster card, select the **Configuration** tab, and find the monitoring ID under **Monitoring ID (clusterId)**.

You can also search or filter by monitoring ID on the **Clusters** page.

To look up a cluster's kube-system namespace UID directly via the CLI, run the following kubectl command, **using the cluster's context or kubeconfig**.

```bash
$ kubectl get namespace kube-system -o jsonpath='{.metadata.uid}'
```

### Kubecost

Kubecost integrates directly with the Kubernetes API and cloud billing APIs to give you real-time visibility into Kubernetes spend and cost allocation.
By monitoring your Kubernetes spend across clusters, you can avoid overspend that may be caused by uncaught bugs or oversights.
Further, with a cost monitoring solution in place, you can realize the full potential and cost of these resources and avoid over-provisioning resources.

To customize pricing and out of cluster costs for AWS and GCP, you must apply these settings using the Kubecost UI running on each relevant cluster.
You can access the attached cluster's Kubecost Settings page at:

```
https://<MANAGED_CLUSTER_URL>/ops/portal/kubecost/frontend/settings.html
```

<p class="message--important"><strong>IMPORTANT: </strong>Make sure to access the cluster's Kubecost UI linked above, not the centralized Kubecost UI running on Kommander.</p>

#### AWS

For more accurate AWS Spot pricing, follow [these steps][kubecost_aws_spot_instance] to configure a data feed for the AWS Spot instances.

To allocate out of cluster costs for AWS, visit [this guide][kubecost_aws_out_of_cluster].

#### GCP

To allocate out of cluster costs for GCP, visit [this guide][kubecost_gcp_out_of_cluster].

### Grafana dashboards

A set of Grafana dashboards providing visualization of cost metrics is provided in the centralized Grafana UI:

```
https://<CLUSTER_URL>/ops/portal/kommander/monitoring/grafana
```

These dashboards give a global view of accumulated costs from all managed clusters.
From the navigation in Grafana, you can find these dashboards by selecting those tagged with `cost`, `metrics`, and `utilization`.

## Related information

For information on related topics or procedures, refer to the following:

- [Kubecost documentation][kubecost_docs]

[kubecost_website]: https://kubecost.com/
[kubecost_docs]: https://docs.kubecost.com/
[kubecost_cost_allocation]: https://docs.kubecost.com/cost-allocation.html
[kubecost_aws_spot_instance]: https://docs.kubecost.com/getting-started#spot-nodes
[kubecost_aws_out_of_cluster]: https://docs.kubecost.com/aws-out-of-cluster.html
[kubecost_gcp_out_of_cluster]: https://docs.kubecost.com/gcp-out-of-cluster.html
