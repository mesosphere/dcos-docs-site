---
layout: layout.pug
beta: false
navigationTitle: Edit and Delete Workspaces
title: Edit and Delete Workspaces
menuWeight: 8
excerpt: Use Kommander to edit and delete workspaces
---

A new Kubernetes namespace, with your workspace name, is created in the management cluster. All workspace assets are created in this new namespace. The namespace name cannot be changed but the display name and description can be modified.

## Edit workspaces

From the workspace selection dropdown at the top of the screen, select the workspace you want to edit. Select  the **Actions** dropdown button and select **Edit Workspace**.

### Advanced Options

![Workspace Form Advanced Annotations](/dkp/kommander/1.4/img/workspace-annotations.png)
<br />_Edit Workspace Advanced Options_

When creating or editing a workspace, you can use the **Advanced Options** to add, edit, or delete annotations and labels to your workspace. Both the annotations and labels are applied to the workspace namespace.

Labels that are added to a workspace, are also applied to all the clusters in the workspace.

## Delete workspaces

<p class="message--note"><strong>NOTE: </strong>
  Workspaces can only be deleted if all the clusters in the workspace have been deleted.
</p>

From the workspace selection dropdown at the top of the screen, select **Global**.
From the left rail menu, click on **Workspaces**.
Click on the three-button action menu to the right of the workspace you intend to delete and then click Delete:
![Workspace menu delete](/dkp/kommander/1.4/img/workspaces-menu-delete.png)
<br />_Deleting a workspace_

Confirm deleting the Workspace in the Delete Workspace modal:
![Workspace menu delete](/dkp/kommander/1.4/img/workspace-confirm-delete.png)
<br />_Workspace delete confirmation_
