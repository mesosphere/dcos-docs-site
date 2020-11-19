---
layout: layout.pug
beta: false
navigationTitle: Workspaces
title: Workspaces
menuWeight: 8
excerpt: Allow teams to manage their own clusters using workspaces
---

## Introducing Workspaces

Workspaces give you the flexibility to represent your organization in a way that makes sense for your team and configuration.

For example, you can create separate workspaces for each department, product, or business function. Each workspace manages their own clusters and role-based permissions, while retaining an overall organization-level view of all clusters in operation.

#### Global / Workspace UI

The UI is designed to be accessible for different roles:

At the top level, **Global**, IT administrators manage all clusters across all workspaces.

At the **Workspace** level, devops administrators manage multiple clusters within a workspace.

At the **Projects** level, devops administrators or developers manage configuration and services across multiple clusters.

#### Default Workspace

To get started immediately you can use the default workspace deployed in Kommander. Your Workspace delegation can be done at a later time.

#### Creating new Workspaces

From the workspace selection dropdown at the top of the screen, select **Create Workspace**. Enter a name and description. The workspace is now accessible from the workspace selection dropdown.

![Organization / Workspace Selection](/dkp/kommander/1.2/img/org-nav.png)
<br />_Organization / Workspace Selection_

![Create Workspace Form](/dkp/kommander/1.2/img/create-workspace.png)
<br />_Create Workspace Form_

##### Advanced Options

![Workspace Form Advanced Annotations](/dkp/kommander/1.2/img/workspace-annotations.png)
<br />_Create Workspace Advanced Options_

When creating, or editing, a workspace you can use the Advanced options to add, edit or delete annotations and labels to your workspace. Both the annotations and labels will be applied to the Workspace namespace.

Labels that are added to a Workspace, will also be applied to all of that Workspace’s clusters.

#### Editing and Deleting Workspaces

A new Kubernetes namespace, with your workspace name, is created in the management cluster. All workspace assets are created in this new namespace. The namespace name cannot be changed but the display name and description can be modified.

<p class="message--note"><strong>NOTE: </strong>
  Workspaces can only be deleted if all the clusters belonging to it have been deleted.
</p>
