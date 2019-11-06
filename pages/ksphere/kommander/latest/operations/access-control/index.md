---
layout: layout.pug
navigationTitle: Access Control
title: Access Control
excerpt: Centrally manage access across clusters
---

Role-based authorization can be defined centrally within Kommander to control access to resources on all clusters. The resources are similar to Kubernetes RBAC but with some crucial differences.

#### Types of Access Control Objects

**Groups** map to groups and user claims from your identity providers.

![Groups](/ksphere/kommander/img/Access-control-groups-table.png)

Figure 8 - Groups

**Roles** are named collections of rules defining which verbs can be applied to which resources.

![Roles](/ksphere/kommander/img/Access-control-roles-table.png)

Figure 9 - Roles

**Policies** bind a group to a role

![Policies](/ksphere/kommander/img/Access-control-policies-table.png)

Figure 10 - Policies

Roles and Policies can be defined in the cluster scope which makes them apply to all Konvoy clusters.

Roles and Policies can be defined within a project and apply only to the clusters matching the project's selector labels.

![Project Roles](/ksphere/kommander/img/Project-roles-table.png)

Figure 11 - Project Roles

![Project Policies](/ksphere/kommander/img/Project-policies-table.png)

Figure 12 - Project Policies
