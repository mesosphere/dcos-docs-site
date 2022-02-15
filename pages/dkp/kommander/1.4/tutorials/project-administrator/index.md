---
layout: layout.pug
beta: false
navigationTitle: Grant project admin access to Kubernetes resources in Kommander
title: Grant project admin access to Kubernetes resources in Kommander
menuWeight: 1
excerpt: Configure role-based access control for namespaced Kubernetes resources in Kommander
---

## Before you begin

This procedure requires the following configurations and background:

- A Konvoy cluster with [Kommander installed][kommander-install].
- An [Identity Provider][kommander-authorize].
- Familiarity with [Kubernetes role-based access control][k8s-rbac] principles.
- A configured [group][kommander-group] in Kommander for project administrators.

## Create role-based access control persona

This procedure describes how a cluster administrator can assign project administrator level access to Kubernetes and Kommander resources in the Kommander UI.

- _Project admin_: these users can administer projects they have specific access to.

If you have not done so already, create a group to represent this persona. For more details on groups, see the [Identity Providers page][kommander-id-providers] and the [Identity Provider tutorial][kommander-authorize].

At this point, you have already assigned users to the group that represents the persona. You must now change the resource access level for this persona by associating roles with the groups using policies.

## Grant workspace access to project admin persona

The _Project Admin_ persona must have view or greater access to the workspace that contains the project.

In the Kommander UI, do the following:

1. Select a _Workspace_ in the header drop-down. This must be the workspace in which the project your group will administrate will live.
1. Select _Access Control_ in the side menu.
1. Select the _Cluster Policies_ tab.
1. Select _Add or remove roles_ and select the _Workspace View Role_ and _Kommander Workspace View Role_ roles.
1. Select _Save_.

## Grant project access to project admin persona

The _Project Admin_ persona should have admin access to the project. This allows users to administer all namespaced resources in the project namespace on the management cluster, and all namespaced resources in the project namespace on the target clusters.

In the Kommander UI, do the following:

1.  Select a _Workspace_ in the header drop-down.
1.  Select _Projects_ and select or create the project to grant access to.
1.  Select the _Policies_ tab.

    ![Project Policies Table](/dkp/kommander/1.4/img/tutorial-project-policies.png)
    Project Policies Table

    The default role for this persona:

    - _Kommander Project Admin Role_: because this is a Kommander Role type role, it applies to the management cluster. This role grants admin access to the project namespace on the management cluster.

1.  Assign this role to the _Project Admin_ group.

    ![Project Policies Edit](/dkp/kommander/1.4/img/tutorial-project-policies-edit.png)
    Project Policies Form

## Related information

- [Project Policies][kommander-policies]
- [Granting access to Kubernetes resources in Kommander][kommander-rbac]
- [Installing and configuring Kommander][kommander-install]
- [Identity Providers in Kommander][kommander-id-providers]
- [Configuring a GitHub Identity Provider in Kommander][kommander-authorize]
- [Granting access to Kubernetes resources in the CLI][konvoy-rbac]
- [Access control in Kommander][kommander-access-control]
- [Kubernetes RBAC authorization][k8s-rbac]

[kommander-access-control]: ../../operations/access-control/
[kommander-authorize]: ../authorize-all-users/
[kommander-group]: ../../operations/identity-providers#groups
[kommander-id-providers]: ../../operations/identity-providers/
[kommander-install]: ../../install/
[kommander-policies]: ../../projects/project-policies/
[kommander-rbac]: ../configure-rbac/
[konvoy-rbac]: /dkp/konvoy/1.8/access-authentication/install-rbac/
[k8s-rbac]: https://kubernetes.io/docs/reference/access-authn-authz/rbac/
