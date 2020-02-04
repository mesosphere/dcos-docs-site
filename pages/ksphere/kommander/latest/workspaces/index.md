---
layout: layout.pug
navigationTitle: Workspaces
title: Workspaces
menuWeight: 8
excerpt: Allow teams to manage their own clusters using workspaces
---

## Introducing Workspaces

Workspaces provide a substantial level of flexibility by allowing you to represent your organization in a way that makes sense for your teams and configuration.

For example, you can create a separate workspace for each department, product, or business function and delegate the management of clusters and role-based permissions to each one while retaining an overall organization-level view of all clusters in operation.

#### Organization / Workspace UI

The UI is divided into a heirarchy suitable for different roles:

![Organization / Workspace Selection](/ksphere/kommander/img/org-nav.png)
<br />_Fig. 1: Organization / Workspace Selection_

At the top level, called Organization, IT admins can manage all clusters across all workspaces.

At the Workspace level, devops admins can manage multiple clusters within a workspace.

And using projects, devops admins or developers can manage configuration and services across multiple clusters.

#### Default Workspace

If you want to get started without thinking about Workspace delegation, simply use the default workspace that is deployed with Kommander.

#### Creating new Workspaces

From the top level navigation, click Actions and Create Workspace. Fill in a name and description. The workspace is now accessible from the Organization dropdown at the top of the screen.

![Create Cluster, Create Workspace](/ksphere/kommander/img/org-actions.png)
<br />_Fig. 2: Create Actions_

#### Editing and Deleting Workspaces

Within the management cluster a new Kubernetes namespace is created, named after the workspace, into which all workspace assets will be created. While the namespace itself can't be renamed, the display name and description can be edited any time.

<p class="message--note"><strong>NOTE: </strong>
  Workspaces can only be deleted if all the clusters belonging to it have been deleted.
</p>
