---
layout: layout.pug
navigationTitle: Workspaces
title: Workspaces
menuWeight: 8
excerpt: Allow teams to manage their own clusters using workspaces
---

## Introducing Workspaces

Workspaces give you the flexibility to represent your organization in a way that makes sense for your team and configuration.

For example, you can create separate workspaces for each department, product, or business function. Each workspace manages their own clusters and role-based permissions, while retaining an overall organization-level view of all clusters in operation.

#### Organization / Workspace UI

The UI is designed to be accessible for different roles:

![Organization / Workspace Selection](/ksphere/kommander/img/org-nav.png)
<br />_Organization / Workspace Selection_

At the top level, **Organization**, IT administrators manage all clusters across all workspaces.

At the **Workspace** level, devops administrators manage multiple clusters within a workspace.

At the **Projects** level, devops administrators or developers manage configuration and services across multiple clusters.

#### Default Workspace

To get started immediately you can use the default workspace deployed in Kommander. Your Workspace delegation can be done at a later time.

#### Creating new Workspaces

From the top level navigation, select **Actions** and **Create Workspace**. Enter a name and description. The workspace is now accessible from the **Organization** drop-down at the top of the screen.

![Create Cluster, Create Workspace](/ksphere/kommander/img/org-actions.png)
<br />_Create Actions_

#### Editing and Deleting Workspaces

A new Kubernetes namespace, with your workspace name, is created in the management cluster. All workspace assets are created in this new namespace. The namespace name cannot be changed but the display name and description can be modified.

<p class="message--note"><strong>NOTE: </strong>
  Workspaces can only be deleted if all the clusters belonging to it have been deleted.
</p>

