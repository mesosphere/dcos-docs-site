---
layout: layout.pug
navigationTitle: Management Cluster
title: Management Cluster
menuWeight: 40
excerpt: A guide for the Management Cluster and the Management Cluster Workspace
---

When you install Kommander, the host cluster is attached in the **Management Cluster Workspace** as the **Management Cluster**, called **Management Cluster** in the Global workspace dashboard and **Kommander Host** inside the Management Cluster Workspace. This allows the Management Cluster to be included in [Projects](../../projects/) and enables the management of its [Platform Applications](../../workspaces/applications/platform-applications/) from the Management Cluster Workspace.

<p class="message--note"><strong>NOTE: </strong>Do not attach a cluster in the "Management Cluster Workspace" workspace. This workspace is reserved for your Kommander Management cluster only.</p>

## Editing

As an attached cluster, you can edit the Management Cluster to add or remove Labels, then you can use these labels to include the Management Cluster in Projects inside of the Management Cluster Workspace.

## Disconnecting

The Management Cluster cannot be disconnected from the GUI like other attached clusters. Because of this, the Management Cluster Workspace cannot be deleted from the GUI as it will always have the Management Cluster inside itself.
