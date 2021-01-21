---
layout: layout.pug
beta: true
navigationTitle: Disconnecting or Deleting Clusters
title: Disconnecting or Deleting Clusters
menuWeight: 7
excerpt: Disconnect or delete a cluster
---

## Disconnect vs. delete

When you attach a cluster to Kommander that was not created with Kommander, you may later disconnect it. This does not alter the running state of the cluster, but simply removes it from the Kommander UI.

For managed clusters created with Kommander, disconnecting the cluster is not an option, but it can be deleted. This completely removes the cluster and all of its cloud assets.

<p class="message--warning"><strong>WARNING: </strong>
If you delete the management (Konvoy) cluster, you won't be able to use Kommander to delete the managed clusters that were created by Kommander. Be sure and delete any managed clusters before finally deleting the Konvoy cluster if your intention is to delete all clusters.
</p>

### Statuses

See [Statuses](/dkp/kommander/1.3/clusters/#statuses) for a list of possible statuses a cluster can have when it is getting disconnected or deleted.
