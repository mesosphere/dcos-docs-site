---
layout: layout.pug
navigationTitle: Update Cluster
title: Update Cluster
excerpt: Update a Kubernetes cluster to upgrade Kubernetes, or change machine hardware properties
subtree:
  beta: true
  draft: true
menuWeight: 35
---

Before you begin, make sure you have created a workload cluster, as described in [Create a New Cluster][createnewcluster].

<!-- TODO: Remove warning. -->
<p class="message--warning"><strong>NOTE: </strong> This feature is under development, and not yet available.</p>

## Update a workload cluster

There are many reasons to update a workload cluster. The most common reasons are:

- To upgrade the Kubernetes version
- To update the machine image of control plane, or node pool machines
- To update the hardware properties of control plane, or node pool machines

<!--
## Known Limitations

<p class="message--note"><strong>NOTE: </strong>Be aware of these limitations in the current release of Konvoy.</p>

-->

[createnewcluster]: ../new
