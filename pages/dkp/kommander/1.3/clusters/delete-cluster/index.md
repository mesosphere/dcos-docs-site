---
layout: layout.pug
beta: false
navigationTitle: Disconnect or Delete Clusters
title: Disconnect or Delete Clusters
menuWeight: 7
excerpt: Disconnect or delete a cluster
---

## Disconnect vs. delete

When you attach a cluster to Kommander that was not created with Kommander, you can later disconnect it. This does not alter the running state of the cluster, but simply removes it from the Kommander UI. User workloads, platform services, and other Kubernetes resources are not cleaned up at detach.

If you created the managed clusters with Kommander you cannot disconnect the cluster but you can delete the cluster. This completely removes the cluster and all of its cloud assets.

<p class="message--warning"><strong>WARNING: </strong>
If you delete the management (Konvoy) cluster, you can not use Kommander to delete any managed clusters created by Kommander. If you want. to delete all clusters ensure you delete any managed clusters before finally deleting the Konvoy cluster.
</p>

### Statuses

See [Statuses](/dkp/kommander/1.3/clusters/#statuses) for a list of possible states a cluster can have when it is getting disconnected or deleted.

## Related information

- [Troubleshooting: I cannot detach an attached cluster that is "Pending"](/dkp/kommander/1.3/troubleshooting/#i-cannot-detach-an-attached-cluster-that-is-pending)
