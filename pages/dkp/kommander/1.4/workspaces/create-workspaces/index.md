---
layout: layout.pug
beta: false
navigationTitle: Create New Workspaces
title: Create New Workspaces
menuWeight: 8
excerpt: Use Kommander to create new workspaces
---

## Create new workspaces

From the workspace selection dropdown at the top of the screen, select **Create Workspace**. Enter a name and description. The workspace is now accessible from the workspace selection dropdown.

![Organization / Workspace Selection](/dkp/kommander/1.4/img/org-nav.png)
<br />_Organization / Workspace Selection_

![Create Workspace Form](/dkp/kommander/1.4/img/create-workspace.png)
<br />_Create Workspace Form_

### Advanced Options

![Workspace Form Advanced Annotations](/dkp/kommander/1.4/img/workspace-annotations.png)
<br />_Create Workspace Advanced Options_

When creating or editing a workspace, you can use the Advanced Options to add, edit, or delete annotations and labels to your workspace. Both the annotations and labels are applied to the workspace's namespace.

Labels that are added to a workspace, are also applied to all of the clusters in the workspace.

You can also create a **custom namespace** for the Workspace you are creating.
By default, a unique ID Namespace will be auto-generated based on the first 57 characters of your workspace name plus 5 unique alphanumeric characters.
![Workspace default naming](/dkp/kommander/1.4/img/workspace-default-name.png)
<br />_Workspace namespace fields_

To override this default behavior, add your custom namespace name for the Workspace.
![Workspace default naming](/dkp/kommander/1.4/img/workspace-custom-name.png)
<br />_Adding a custom namespace for your Workspace_

<p class="message--warning"><strong>NOTE: </strong>Setting a custom ID for the namespace in Kommander does not guarantee safety and uniqueness of the namespace across all clusters. This may override any namespaces, with the same name, on attached clusters.</p>
