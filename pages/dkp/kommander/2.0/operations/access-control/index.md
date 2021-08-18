---
layout: layout.pug
beta: true
title: Access Control
navigationTitle: Access Control
menuWeight: 1
excerpt: Centrally manage access across clusters
---

You can centrally define role-based authorization within Kommander to control resource access on the management cluster and a set or all of the target clusters. These resources are similar to Kubernetes RBAC but with crucial differences, and they make it possible to define the roles and policies once and have them federated to clusters within a given scope.

Kommander has two conceptual groups of resources that are used to manage access control:

- Kommander Roles: control access to resources on the management cluster.
- Cluster Roles: control access to resources on all target clusters in scope.

Use these two groups of resources to manage access control within 3 levels of scope:

| Context   | Kommander Roles                                                               | Cluster Roles                                                                              |
| --------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Global    | Create ClusterRoles on the management cluster.                                | Federates ClusterRoles on all target clusters across all workspaces.                       |
| Workspace | Create namespaced Roles on the management cluster in the workspace namespace. | Federates ClusterRoles on all target clusters in the workspace.                            |
| Project   | Create namespaced Roles on the management cluster in the project namespace.   | Federates namespaced Roles on all target clusters in the project in the project namespace. |

The policies for each level and type create RoleBindings or ClusterRoleBindings on the clusters that apply to each category.

This approach gives you maximum flexibility over who has access to what resources, conveniently mapped to your existing identity providers' claims.

### Special Limitation for Kommander Roles

In addition to granting a Kommander Role, you must also grant the appropriate dkp role to allow external users and groups into the UI.
See [RBAC - Kommander Dashboard Authorization](/dkp/kommander/2.0/operations/access-control/rbac/#kommander-dashboard-authorization) for details about the built-in dkp roles.
Here are examples of ClusterRoleBindings that grant an IDP group admin access to the Kommmander routes:

```yaml
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: eng-kommander-dashboard
  labels:
    "workspaces.kommander.mesosphere.io/rbac": ""
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: dkp-kommander-admin
subjects:
  - apiGroup: rbac.authorization.k8s.io
    kind: Group
    name: oidc:engineering
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: eng-dkp-routes
  labels:
    "workspaces.kommander.mesosphere.io/rbac": ""
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: dkp-admin
subjects:
  - apiGroup: rbac.authorization.k8s.io
    kind: Group
    name: oidc:engineering
```

## Types of Access Control Objects

Kubernetes role-based access control can be controlled with three different object categories: Groups, Roles and Policies, as explained in more detail below.

### Groups

You can map group and user claims made by your configured identity providers to Kommander groups by clicking the _Groups_ tab under Administration / Identity providers on the global level.

![Identity Provider Groups](/dkp/kommander/2.0/img/access-control-idp-groups.png)

### Roles

ClusterRoles are named collections of rules defining which verbs can be applied to which resources.

- Kommander Roles apply specifically to resources on the management cluster.
- Cluster Roles apply to target clusters within their scope: at the global level, this is all target clusters in all workspaces, at the workspace level this is all target clusters in the workspace, at the project level this is all target clusters that have been added to the project.

![Cluster Roles](/dkp/kommander/2.0/img/access-control-cluster-roles.png)

### Propagating Workspace Roles to Projects

By default, users granted the Kommander Workspace Admin, Edit, or View roles will also be granted the equivalent Kommander Project Admin, Edit, or View role for any project created in the workspace.
Other workspace roles are not automatically propagated to the equivalent role for a project in the workspace.

Each workspace has roles defined using `KommanderWorkspaceRole` resources.
Automatic propagation is controlled using the annotation `"workspace.kommander.mesosphere.io/sync-to-project": "true"` on a `KommanderWorkspaceRole` resource.
You can manage this only by using the CLI.

```shell
kubectl get kommanderworkspaceroles -n test-qznrn-6sz52
NAME                        DISPLAY NAME                     AGE
kommander-workspace-admin   Kommander Workspace Admin Role   2m18s
kommander-workspace-edit    Kommander Workspace Edit Role    2m18s
kommander-workspace-view    Kommander Workspace View Role    2m18s
```

To prevent propagation of the `kommander-workspace-view` role, remove this annotation from the `KommanderWorkspaceRole` resource.

```shell
kubectl annotate kommanderworkspacerole -n test-qznrn-6sz52 kommander-workspace-view workspace.kommander.mesosphere.io/sync-to-project-
```

To enable propagation of the role, add this annotation to the relevant `KommanderWorkspaceRole` resource.

```shell
kubectl annotate kommanderworkspacerole -n test-qznrn-6sz52 kommander-workspace-view workspace.kommander.mesosphere.io/sync-to-project=true
```

### Special Limitation for Workspace > Project Role Inheritance

When granting users access to a workspace, you must manually grant access to the projects within that workspace.
Each project is created with a set of admin/edit/view roles, and you can choose to add an additional RoleBinding to each group or user of the workspace for one of these project roles.
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

![Cluster Policies](/dkp/kommander/2.0/img/access-control-cluster-policies.png)

## Related Information

<!--
- [Kommander RBAC Tutorial](/dkp/kommander/1.4/tutorials/configure-rbac/) -->

- [RBAC - Kommander Dashboard Authorization](/dkp/kommander/2.0/operations/access-control/rbac/#kommander-dashboard-authorization)
- [Kubernetes RBAC Authorization](https://kubernetes.io/docs/reference/access-authn-authz/rbac/)
