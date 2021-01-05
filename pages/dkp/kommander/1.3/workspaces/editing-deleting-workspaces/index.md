---
layout: layout.pug
beta: true
navigationTitle: Editing and Deleting Workspaces
title: Editing and Deleting Workspaces
menuWeight: 8
excerpt: A guide for how to edit and delete workspaces
---

A new Kubernetes namespace, with your workspace name, is created in the management cluster. All workspace assets are created in this new namespace. The namespace name cannot be changed but the display name and description can be modified.

<p class="message--note"><strong>NOTE: </strong>
  Workspaces can only be deleted if all the clusters belonging to it have been deleted.
</p>

## Advanced Options

![Workspace Form Advanced Annotations](/dkp/kommander/1.3/img/workspace-annotations.png)
<br />_Edit Workspace Advanced Options_

When creating or editing a workspace, you can use the Advanced Options to add, edit or delete annotations and labels to your workspace. Both the annotations and labels will be applied to the workspace namespace.

Labels that are added to a Workspace, will also be applied to all of that workspace’s clusters.
