---
layout: layout.pug
beta: false
navigationTitle: Access Control
title: Access Control
menuWeight: 10
excerpt: Centrally manage access across clusters
---

You can centrally define role-based authorization within Kommander to control resource access on the management cluster and a set, or all, of the target clusters.
These resources are similar to Kubernetes RBAC but with crucial differences, and they make it possible to define the roles and role bindings once, and have them federated to clusters within a given scope.

DKP has two concepts used to manage access control:

- DKP Roles: control access to resources on the management cluster.
- Cluster Roles: control access to resources on all target clusters in scope.

Use these two sets of resources to manage access control within 3 levels of scope:

| Context   | DKP Roles                                                                     | Cluster Roles                                                                              |
| --------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Global    | Create ClusterRoles on the management cluster.                                | Federates ClusterRoles on all target clusters across all workspaces.                       |
| Workspace | Create namespaced Roles on the management cluster in the workspace namespace. | Federates ClusterRoles on all target clusters in the workspace.                            |
| Project   | Create namespaced Roles on the management cluster in the project namespace.   | Federates namespaced Roles on all target clusters in the project in the project namespace. |

The [role bindings][role-bindings] for each level and type create `RoleBindings` or `ClusterRoleBindings` on the clusters that apply to each category.

This approach gives you maximum flexibility over who has access to what resources, conveniently mapped to your existing identity providers' claims.

### Special Limitation for DKP Roles

In addition to granting a DKP Role, you must also grant the appropriate DKP role to allow external users and groups into the UI.
See [RBAC - DKP UI Authorization][kommander-rbac] for details about the built-in DKP roles.
Here are examples of `ClusterRoleBindings` that grant an IDP group admin access to the Kommander routes:

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

### Propagating Workspace Roles to Projects

By default, users granted the Kommander Workspace Admin, Edit, or View roles will also be granted the equivalent Kommander Project Admin, Edit, or View role for any project created in the workspace.
Other workspace roles are not automatically propagated to the equivalent role for a project in the workspace.

Each workspace has roles defined using `KommanderWorkspaceRole` resources.
Automatic propagation is controlled using the annotation `"workspace.kommander.mesosphere.io/sync-to-project": "true"` on a `KommanderWorkspaceRole` resource.
You can manage this only by using the CLI.

```bash
kubectl get kommanderworkspaceroles -n test-qznrn-6sz52
```

```sh
NAME                        DISPLAY NAME                     AGE
kommander-workspace-admin   Kommander Workspace Admin Role   2m18s
kommander-workspace-edit    Kommander Workspace Edit Role    2m18s
kommander-workspace-view    Kommander Workspace View Role    2m18s
```

To prevent propagation of the `kommander-workspace-view` role, remove this annotation from the `KommanderWorkspaceRole` resource.

```bash
kubectl annotate kommanderworkspacerole -n test-qznrn-6sz52 kommander-workspace-view workspace.kommander.mesosphere.io/sync-to-project-
```

To enable propagation of the role, add this annotation to the relevant `KommanderWorkspaceRole` resource.

```bash
kubectl annotate kommanderworkspacerole -n test-qznrn-6sz52 kommander-workspace-view workspace.kommander.mesosphere.io/sync-to-project=true
```

### Special Limitation for Workspace > Project Role Inheritance

When granting users access to a workspace, you must manually grant access to the projects within that workspace.
Each project is created with a set of admin/edit/view roles, and you can choose to add an additional `RoleBinding` to each group or user of the workspace for one of these project roles.
Usually these are prefixed `kommander-project-(admin/edit/view)`.
Here is an example `RoleBinding` that grants the Kommander Project Admin role access for the project namespace to the engineering group:

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

## Role Bindings

DKP role bindings, cluster role bindings, and project role bindings bind a group of users to any number of roles. All groups defined by [Identity Providers][groups] are present in the **Cluster Role Bindings** tab at the global and workspace level, or within the **Role Bindings** tab at the project level.

Before you can create a Role Binding, ensure an administrator has created a [Group][groups]. A Kommander Group can contain one or several Identity Provider users, groups, or both.

You can assign a role to this Kommander Group:

1.  From the top menu bar, select your target workspace.

1.  Select **Access Control** in the **Administration** section of the sidebar menu.

1.  Select the **Cluster Role Bindings** tab, and then select the **Add Roles** button next to the group you want.

1.  Select the Role, or Roles, you want from the drop-down menu and select **Save**.

## Related Information

- [Kommander RBAC Tutorial][kommander-rbac-tutorial]
- [RBAC - DKP UI Authorization][kommander-rbac]
- [Kubernetes RBAC Authorization][k8s-rbac-auth]
- [Groups][groups]

[k8s-rbac-auth]: https://kubernetes.io/docs/reference/access-authn-authz/rbac/
[kommander-rbac]: rbac#dkp-ui-authorization
[kommander-rbac-tutorial]: rbac
[role-bindings]: #role-bindings
[groups]: ../identity-providers#groups
