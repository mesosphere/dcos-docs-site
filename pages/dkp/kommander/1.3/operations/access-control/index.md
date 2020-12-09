---
layout: layout.pug
beta: false
title: Access Control
navigationTitle: Access Control
menuWeight: 1
excerpt: Centrally manage access across clusters
---

Role-based authorization can be defined centrally within Kommander to control resource access on the management cluster and a set or all of the target clusters.
These resources are similar to Kubernetes RBAC but with crucial differences.
These resources make it possible to define the roles and policies once and have them federated to clusters within a given scope.

Kommander has two conceptual groups of resources that are used to manage access control:

- Kommander Roles: control access to resources on the management cluster.
- Cluster Roles: control access to resources on all target clusters in scope.

These two groups of resources can be used to manage access control within 3 levels of scope:

| Context   | Kommander Roles                                                               | Cluster Roles                                                                              |
| --------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Global    | Create ClusterRoles on the management cluster.                                | Federates ClusterRoles on all target clusters across all workspaces.                       |
| Workspace | Create namespaced Roles on the management cluster in the workspace namespace. | Federates ClusterRoles on all target clusters in the workspace.                            |
| Project   | Create namespaced Roles on the management cluster in the project namespace.   | Federates namespaced Roles on all target clusters in the project in the project namespace. |

The policies for each level and type create RoleBindings or ClusterRoleBindings on the clusters that apply to each category.

This approach gives you maximum flexibility over who has access to what resources, conveniently mapped to your existing identity providers' claims.

### Special Limitation for Opsportal and Kommander Roles

In addition to granting a Kommander Role, you must also grant the appropriate opsportal role to allow external users and groups into the UI.
See [Konvoy RBAC - OpsPortal](/dkp/konvoy/1.6/access-authentication/rbac/#portal-authorization) for details about the built-in opsportal roles.
This role may be automatically added to Kommander role binding subjects in future versions of Kommander.
Here are examples of ClusterRoleBindings that grant an IDP group admin access to the Opsportal and Kommmander routes:

```yaml
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: nat-kommander-ops-portal
  labels:
    "workspaces.kommander.mesosphere.io/rbac": ""
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: opsportal-kommander-admin
subjects:
  - apiGroup: rbac.authorization.k8s.io
    kind: Group
    name: oidc:engineering
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: nat-ops-portal
  labels:
    "workspaces.kommander.mesosphere.io/rbac": ""
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: opsportal-admin
subjects:
  - apiGroup: rbac.authorization.k8s.io
    kind: Group
    name: oidc:engineering
```

## Types of Access Control Objects

Kubernetes role-based access control can be controlled with three different object categories: Groups, Roles and Policies.
These are explained in more detail below.

### Groups

You can map group and user claims made by your configured identity providers to Kommander groups by clicking the _Groups_ tab under Administration / Identity providers on the global level.

![Identity Provider Groups](/dkp/kommander/1.3/img/access-control-idp-groups.png)

### Roles

ClusterRoles are named collections of rules defining which verbs can be applied to which resources.

- Kommander Roles apply specifically to resources on the management cluster.
- Cluster Roles apply to target clusters within their scope: at the global level, this is all target clusters in all workspaces, at the workspace level this is all target clusters in the workspace, at the project level this is all target clusters that have been added to the project.

![Cluster Roles](/dkp/kommander/1.3/img/access-control-cluster-roles.png)

### Special Limitation for Workspace > Project Role Inheritance

When granting users access to a workspace it is currently necessary to manually grant access to the projects within it.
Each project is created with a set of admin/edit/view roles so it may be most convenient to add an additional RoleBinding to each group or user of the workspace for one of these project roles.
Usually these are prefixed `kommander-project-(admin/edit/view)`.
Here is an example RoleBinding that grants the Kommander Project Admin role for the project namespace to the engineering group:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: workspace-admin-project1-admin
  namespace: my-project-namespace-xxxxx
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: kommander-project-admin-xxxxx
subjects:
  - apiGroup: rbac.authorization.k8s.io
    kind: Group
    name: oidc:engineering
```

### Policies

Kommander policies, cluster policies and project policies bind a Kommander group to any number of roles.
All groups that have been defined in the groups tab will be present at the global, workspace, or project level and are ready for you to assign roles to them.

![Cluster Policies](/dkp/kommander/1.3/img/access-control-cluster-policies.png)

## Related Information

- [Konvoy RBAC - OpsPortal](/dkp/konvoy/1.6/access-authentication/rbac/#portal-authorization)
- [Kommander RBAC Tutorial](/dkp/kommander/1.3/tutorials/configure-rbac/)
- [Kubernetes RBAC Authorization](https://kubernetes.io/docs/reference/access-authn-authz/rbac/)
