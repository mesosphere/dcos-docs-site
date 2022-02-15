---
layout: layout.pug
beta: false
navigationTitle: Granting access to Kubernetes resources in Kommander
title: Granting access to Kubernetes resources in Kommander
menuWeight: 1
excerpt: Configure role-based access control for Kubernetes resources in Kommander
---

<!-- markdownlint-disable MD024 -->

## Before you begin

This procedure requires the following configurations and background:

- A Konvoy cluster with [Kommander installed](/dkp/kommander/1.4/install/).
- An [Identity Provider](/dkp/kommander/1.4/tutorials/authorize-all-users/) has been created.
- Some familiarity with [Kubernetes role-based access control](https://kubernetes.io/docs/reference/access-authn-authz/rbac/) principles.
- 4 configured [groups](/dkp/kommander/1.4/operations/identity-providers/) in Kommander

## Create Role-Based Access Control Personas

Manage access to resources on Kubernetes clusters through the [RBAC API](https://kubernetes.io/docs/reference/access-authn-authz/rbac/). The base premise revolves around assigning users to groups, which are then associated with roles that control their level of access through role bindings.
This procedure describes how a cluster administrator can assign different levels of access to Kubernetes and Kommander resources in the Kommander UI.

Kommander has [three levels of access control](/dkp/kommander/1.4/operations/access-control/) to support global, workspace, and project use cases. Kommander creates default roles at all three levels to simplify the process of assigning users to different levels of access to resources.

In this procedure, using these default roles, you will create four different personas with users assigned to them:

- _Global admin_: these users can administer all Kubernetes and Kommander resources on the management cluster and all target clusters.
- _Global viewer_: these users have read-only viewing access to all Kubernetes and Kommander resources on the management cluster and all target clusters.
- _Workspace admin_: these users can administer the workspaces they have specifically been given access to.
- _Workspace viewer_: these users can access the workspaces they specifically have access to, in a read-only capacity.

If you have not done so already, create a group to represent each of the personas. For more details on groups, see the [Identity Providers page](/dkp/kommander/1.4/operations/identity-providers/) and the [Identity Provider tutorial](/dkp/kommander/1.4/tutorials/authorize-all-users/).

### Federation of personas

Personas created in a workspace will get federated in all attached clusters. This means that policies created in a workspace will result in `federatedclusterrolebindings` objects in the Kommander cluster and the federation of `clusterrolebindings` objects in the attached clusters binding a group to specific roles.

## Grant access to personas

You have already assigned users to groups that represent the four different personas. You must now change resource access levels for each persona, and associate roles with the groups using policies.

### Global Admin persona

The _Global Admin_ persona should have admin access to all resources on the management cluster and all target clusters in all workspaces.

This persona has these roles:

- _Cluster Admin Role_: a `ClusterRole` that applies to all target clusters in all workspaces.
- _Kommander Global Admin Role_: a `ClusterRole` applies to the management cluster.

Users in groups bound to these roles will have admin rights across all clusters managed on Kommander, including the management cluster.

#### Using the Kommander UI

In the Kommander UI, do the following:

1. Select _Global_ in the header drop-down.
2. Select _Administration_ > _Access Control_.
3. Select the _Cluster Roles_ tab. Kommander creates several default roles. Select the _Cluster Admin Role_ and _Kommander Global Admin Role_ for this persona.
4. Select the _Cluster Policies_ tab and add these two roles to the _Global Admin_ group.

You have now created role bindings that associate the Global Admin group with these two roles. These roles ensure the users in the Global Admin group have admin access to the management cluster and all target clusters.

#### Using kubectl

Assuming you have `kubectl` attached to your Kommander cluster and you have a `VirtualGroup` named `global-admin`. Apply these two `VirtualGroupKommanderClusterRoleBinding` to link the group to roles:

```yaml
apiVersion: workspaces.kommander.mesosphere.io/v1alpha1
kind: VirtualGroupKommanderClusterRoleBinding
metadata:
  name: global-admin-cluster-role-binding
spec:
  clusterRoleRef:
    name: cluster-admin
  virtualGroupRef:
    name: global-admin
---
apiVersion: workspaces.kommander.mesosphere.io/v1alpha1
kind: VirtualGroupKommanderClusterRoleBinding
metadata:
  name: global-admin-kommander-role-binding
spec:
  clusterRoleRef:
    name: kommander-global-admin
  virtualGroupRef:
    name: global-admin
```

### Global Viewer persona

The _Global Viewer_ persona should have read-only access to all resources on the management cluster and all target clusters.

This persona has the follow cluster roles:

- _View Role_: a `ClusterRole` applies to all target clusters in all workspaces.
- _Global Kommander View Role_: a `ClusterRole` applies to the management cluster.

#### Using the Kommander UI

In the Kommander UI, do the following:

1. Select _Global_ in the header drop-down.
2. Select _Administration_ > _Access Control_.
3. Select the _Cluster Roles_ tab. Kommander creates several default roles. Select _View Role_ and _Global Kommander View Role_ for this persona.
4. Select the Cluster Policies tab and add these two roles to the _Global Viewer_ group.

You have now created role bindings that associate the Global Viewer group with these two roles. These roles ensure that the users in the Global Viewer group have read-only access to the management cluster and all target clusters.

#### Using kubectl

Assuming you have `kubectl` on your Kommander cluster and you have a `VirtualGroup` named `global-viewer`. You can apply these two `VirtualGroupKommanderClusterRoleBinding` to link the group to roles:

```yaml
apiVersion: workspaces.kommander.mesosphere.io/v1alpha1
kind: VirtualGroupKommanderClusterRoleBinding
metadata:
  name: workspace-admin-cluster-role-binding
spec:
  clusterRoleRef:
    name: view
  virtualGroupRef:
    name: workspace-admin
---
apiVersion: workspaces.kommander.mesosphere.io/v1alpha1
kind: VirtualGroupKommanderClusterRoleBinding
metadata:
  name: workspace-admin-kommander-role-binding
spec:
  clusterRoleRef:
    name: kommander-global-view
  virtualGroupRef:
    name: workspace-admin
```

### Workspace Admin persona

The _Workspace Admin_ persona should have admin access to the Default Workspace. This allows users to administer all namespaced resources in the workspace namespace on the management cluster and all cluster resources on the workspace’s target clusters.

This persona has the following roles:

- _Workspace Admin Role_: a `WorkspaceRole` that applies to all target clusters in all workspaces
- _Kommander Workspace Admin Role_: a `KommanderWorkspaceRole` that applies to the management cluster. This role grants admin access to the workspace namespace on the management cluster. When a `VirtualGroupKommanderWorkspaceRoleBinding` with this role gets created, a `ClusterRole` and `VirtualGroupKommanderClusterRoleBinding` automatically create at the global level to allow access to this workspace specifically, instead of all workspaces.

#### Using the Kommander UI

In the Kommander UI, do the following:

1. Select _Global_ in the header drop-down.
2. Select _Administration_ > _Access Control_.
3. Select the _Cluster Roles_ tab. This persona has these roles: _Workspace Admin Role_ and _Kommander Workspace Admin Role_.
4. Select the Cluster Policies tab and assign these two roles to the _Workspace Admin_ group.

#### Using kubectl

Assuming you have `kubectl` on to your Kommander cluster and a `VirtualGroup` named `workspace-admin, you can apply this template to link the group to roles:

```yaml
apiVersion: workspaces.kommander.mesosphere.io/v1alpha1
kind: VirtualGroupWorkspaceRoleBinding
metadata:
  name: workspace-admin-role-binding
  namespace: <namespace-of-workspacerole-workspace-admin>
spec:
  workspaceRoleRef:
    name: workspace-admin
  virtualGroupRef:
    name: workspace-admin
---
apiVersion: workspaces.kommander.mesosphere.io/v1alpha1
kind: VirtualGroupKommanderWorkspaceRoleBinding
metadata:
  name: workspace-admin-kommander-role-binding
  namespace: <namespace-of-kommanderworkspacerole-kommander-workspace-admin>
spec:
  kommanderWorkspaceRoleRef:
    name: kommander-workspace-admin
  virtualGroupRef:
    name: workspace-admin
```

### Workspace Viewer persona

The _Workspace Viewer_ persona grants users in a specific group read access to the Default Workspace. Users in the group can view all namespaced resources in the workspace namespace on the management cluster and all cluster resources on the workspace’s target clusters.

This persona has the following roles:

- _Workspace View Role_: a `WorkspaceRole` that applies to all target clusters in all workspaces
- _Kommander Workspace View Role_: a `KommanderWorkspaceRole` that applies to the management cluster. This role grants read access to the workspace namespace on the management cluster. When a `VirtualGroupKommanderWorkspaceRoleBinding` with this role gets created, a `ClusterRole` and `VirtualGroupKommanderClusterRoleBinding` creates automatically at the global level to allow access to this workspace specifically, instead of all workspaces.

#### Using the Kommander UI

In the Kommander UI, do the following:

1. Select _Global_ in the header drop-down.
2. Select _Administration_ > _Access Control_.
3. Select the _Cluster Roles_ tab. This persona has the following roles: _Workspace View Role_ and _Kommander Workspace View Role_.
4. Select the Cluster Policies tab and assign these two roles to the _Workspace Viewer_ group.

#### Using kubectl

Assuming you have `kubectl` on your Kommander cluster and a `VirtualGroup` named `workspace-viewer`, you can apply this template to link the group to roles:

```yaml
apiVersion: workspaces.kommander.mesosphere.io/v1alpha1
kind: VirtualGroupWorkspaceRoleBinding
metadata:
  name: workspace-viewer-role-binding
  namespace: <namespace-of-workspacerole-workspace-view>
spec:
  workspaceRoleRef:
    name: workspace-view
  virtualGroupRef:
    name: workspace-viewer
---
apiVersion: workspaces.kommander.mesosphere.io/v1alpha1
kind: VirtualGroupKommanderWorkspaceRoleBinding
metadata:
  name: workspace-viewer-kommander-role-binding
  namespace: <namespace-of-kommanderworkspacerole-kommander-workspace-view>
spec:
  kommanderWorkspaceRoleRef:
    name: kommander-workspace-view
  virtualGroupRef:
    name: workspace-viewer
```

### Custom personas

You have customized the access level of the four examples using default roles provided by Kommander. You can extend the same process to use any custom configured roles as well by:

- Creating a group with users to represent a persona.
- Selecting roles that represent that persona’s level of access.
- Creating policies that bind roles to groups.

## Related information

- [Installing and configuring Kommander](/dkp/kommander/1.4/install/)
- [Identity Providers in Kommander](/dkp/kommander/1.4/operations/identity-providers/)
- [Configuring a GitHub Identity Provider in Kommander](/dkp/kommander/1.4/tutorials/authorize-all-users/)
- [Granting access to Kubernetes resources in the CLI](/dkp/konvoy/1.8/access-authentication/install-rbac/)
- [Access control in Kommander](/dkp/kommander/1.4/operations/access-control/)
- [Kubernetes RBAC (Role-Based Access Control) authorization](https://kubernetes.io/docs/reference/access-authn-authz/rbac/)
