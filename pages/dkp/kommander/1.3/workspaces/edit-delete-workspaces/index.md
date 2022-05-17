---
layout: layout.pug
beta: false
navigationTitle: Edit and Delete Workspaces
title: Edit and Delete Workspaces
menuWeight: 8
excerpt: Use Kommander to edit and delete workspaces
---

A new Kubernetes namespace, with your workspace name, is created in the management cluster. All workspace assets are created in this new namespace. The namespace name cannot be changed but the display name and description can be modified.

<p class="message--note"><strong>NOTE: </strong>
  Workspaces can only be deleted if all the clusters in the workspace have been deleted.
</p>

## Edit workspaces

From the workspace selection dropdown at the top of the screen, select the workspace you want to edit. Select  the **Actions** drop-down button and select **Edit Workspace**.

### Advanced Options

![Workspace Form Advanced Annotations](/dkp/kommander/1.3/img/workspace-annotations.png)
<br />_Edit Workspace Advanced Options_

When creating or editing a workspace, you can use the **Advanced Options** to add, edit, or delete annotations and labels to your workspace. Both the annotations and labels are applied to the workspace namespace.

Labels that are added to a workspace, are also applied to all the clusters in the workspace.
