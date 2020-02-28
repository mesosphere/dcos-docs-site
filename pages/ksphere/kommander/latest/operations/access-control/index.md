---
layout: layout.pug
title: Access Control
navigationTitle: Access Control
menuWeight: 1
excerpt: Centrally manage access across clusters
---

Role-based authorization can be defined centrally within Kommander to control resource access on all clusters or a subset of clusters. The resources are similar to Kubernetes RBAC but with crucial differences. These resouces make it possible to define the roles and policies once and have them federated to clusters within a given scope:

- Global or workspace-level roles and policies federate those resources to cluster-scoped roles and policies on all clusters. In the case of workspace-level resources, they only apply to workspace clusters.

- Project-level roles and policies federate namespace-scoped roles and policies to project clusters.

This approach gives you maximum flexibility over who has access to what resources, conveniently mapped to your existing identity providers' claims.

## Types of Access Control Objects

### Groups

You can map group and user claims made by your configured identity providers to Kommander groups by clicking the Groups tab under Administration / Identity providers on the global-level.

![Identity Provider Groups](/ksphere/kommander/img/access-control-idp-groups.png)

### Roles

Cluster roles and project roles are named collections of rules defining which verbs can be applied to which resources.

![Cluster Roles](/ksphere/kommander/img/access-control-cluster-roles.png)

### Policies

Cluster policies and project policies bind a Kommander group to any number of roles. All groups that have been defined in the groups tab will be present at the global, workspace, or project level and ready for you to assign roles to them.

![Cluster Policies](/ksphere/kommander/img/access-control-cluster-policies.png)
