---
layout: layout.pug
title: Access Control
navigationTitle: Access Control
menuWeight: 1
excerpt: Centrally manage access across clusters
---

Role-based authorization can be defined centrally within Kommander to control resource access on the management cluster, all target clusters, or a subset of target clusters. These resources are similar to Kubernetes RBAC but with crucial differences. These resources make it possible to define the roles and policies once and have them federated to clusters within a given scope.

Kommander has two conceptual groups of resources that are used to manage access control:
- Kommander roles: control access to resources on the management cluster.
- Cluster Roles, Workspace Roles, and Project Roles: control access to resources on all target clusters in scope.

These two groups of resources can be used to manage access control within 3 levels of scope:

|           | Kommander Roles                                                                                         | Global/Workspace/Project Roles                                                                           |
|-----------|---------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------|
| Global    | Global Kommander Roles create ClusterRoles on the management cluster.                                   | Global Cluster Roles federates ClusterRoles on all target clusters across all workspaces.                |
| Workspace | Workspace Kommander Roles create namespaced Roles on the management cluster in the workspace namespace. | Workspace Cluster Roles federates ClusterRoles on all target clusters in the workspace.                  |
| Project   | Project Kommander Roles create namespaced Roles on the management cluster in the project namespace.     | Project Roles federates namespaced Roles on all target clusters in the project in the project namespace. |

The policies for each level and type create RoleBindings or ClusterRoleBindings on the clusters that apply to each category.

This approach gives you maximum flexibility over who has access to what resources, conveniently mapped to your existing identity providers' claims.


## Types of Access Control Objects

Kubernetes role-based access control can be controlled with three different object categories: Groups, Roles and Policies. These are explained in more detail below. 

### Groups

You can map group and user claims made by your configured identity providers to Kommander groups by clicking the *Groups* tab under Administration / Identity providers on the global level.

![Identity Provider Groups](/ksphere/kommander/1.1.0-beta/img/access-control-idp-groups.png)

### Roles

Cluster roles and project roles are named collections of rules defining which verbs can be applied to which resources. The Kommander types of these resources specifically apply to resources on the management cluster. The non-Kommander types apply to target clusters within their scope: at the global level, this is all target clusters in all workspaces, at the workspace level this is all target clusters in the workspace, at the project level this is all target clusters that have been added to the project.

![Cluster Roles](/ksphere/kommander/1.1.0-beta/img/access-control-cluster-roles.png)

### Policies

Kommander policies, cluster policies and project policies bind a Kommander group to any number of roles. All groups that have been defined in the groups tab will be present at the global, workspace, or project level and are ready for you to assign roles to them.

![Cluster Policies](/ksphere/kommander/1.1.0-beta/img/access-control-cluster-policies.png)

## Related Information
- [Kommander RBAC Tutorial](https://docs.d2iq.com/ksphere/kommander/1.1.0-beta/tutorials/configure-rbac/)
- [Kubernetes RBAC authorization](https://kubernetes.io/docs/reference/access-authn-authz/rbac/)