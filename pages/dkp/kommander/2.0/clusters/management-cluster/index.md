---
layout: layout.pug
beta: true
draft: true
navigationTitle: Management Cluster
title: Management Cluster
menuWeight: 7
excerpt:
---

When Kommander is installed, the host cluster is attached in the Default Workspace as the Management Cluster. This allows the Management Cluster to be included in [Projects](/dkp/kommander/2.0/projects/) and enables the management of its [Platform Services](/dkp/kommander/2.0/workspaces/workspace-platform-services/) from the Default Workspace.

## Editing

As an attached cluster, the Management Cluster can be edited to add or remove Labels. These labels can be used to include the Management Cluster in Projects inside of the Default Workspace.

## Disconnecting

The Management Cluster cannot be disconnected from the GUI like other attached clusters. Because of this, the Default Workspace cannot be deleted from the GUI as it will always have the Management Cluster inside itself.
