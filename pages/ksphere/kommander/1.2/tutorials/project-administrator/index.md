---
layout: layout.pug
beta: true
navigationTitle: Granting project admin access to Kubernetes resources in Kommander
title: Granting project admin access to Kubernetes resources in Kommander
menuWeight: 1
excerpt: Configure role-based access control for namespaced Kubernetes resources in Kommander
---

## Before you begin

This procedure requires the following configurations and background:

- A Konvoy cluster with [Kommander installed](https://docs.d2iq.com/ksphere/kommander/1.2/install/).
- An [Identity Provider](https://docs.d2iq.com/ksphere/kommander/1.2/tutorials/authorize-all-users/).
- Familiarity with [Kubernetes role-based access control](https://kubernetes.io/docs/reference/access-authn-authz/rbac/) principles.
- A configured [group](https://docs.d2iq.com/ksphere/kommander/1.2/operations/identity-providers/) in Kommander for project administrators.

## Create role-based access control persona

This procedure describes how a cluster administrator can assign project administrator level access to Kubernetes and Kommander resources in the Kommander UI.

- _Project admin_: these users can administer projects they have specific access to.

If you have not done so already, create a group to represent this persona. For more details on groups, see the [Identity Providers page](https://docs.d2iq.com/ksphere/kommander/1.2/operations/identity-providers/) and the [Identity Provider tutorial](https://docs.d2iq.com/ksphere/kommander/1.2/tutorials/authorize-all-users/).

## Grant access to project admin persona

You have already assigned users to the group that represents the persona. You must now change the resource access level for this persona by associating roles with the groups using policies.

The _Project Admin_ persona should have admin access to the project. This allows users to administer all namespaced resources in the project namespace on the management cluster, as well as all namespaced resources in the project namespace on the target clusters.

In the Kommander UI, do the following:

1. Select a _Workspace_ in the header drop-down.
2. Select _Projects_ and select or create the project to grant access to.
3. Select the _Policies_ tab.

![Project Policies Table](/ksphere/kommander/1.2/img/tutorial-project-policies.png)
Project Policies Table

   The default role for this persona:

- _Kommander Project Admin Role_: because this is a Kommander Role type role, it applies to the management cluster. This role grants admin access to the project namespace on the management cluster.

4. Assign this role to the _Project Admin_ group.

![Project Policies Edit](/ksphere/kommander/1.2/img/tutorial-project-policies-edit.png)
Project Policies Form

## Related information

- [Project Policies](https://docs.d2iq.com/ksphere/kommander/1.2/projects/project-policies/)
- [Granting access to Kubernetes resources in Kommander](https://docs.d2iq.com/ksphere/kommander/1.2/projects/configure-rbac/)
- [Installing and configuring Kommander](https://docs.d2iq.com/ksphere/kommander/1.2/install/)
- [Identity Providers in Kommander](https://docs.d2iq.com/ksphere/kommander/1.2/operations/identity-providers/)
- [Configuring a GitHub Identity Provider in Kommander](https://docs.d2iq.com/ksphere/kommander/1.2/tutorials/authorize-all-users/)
- [Granting access to Kubernetes resources in the CLI](https://docs.d2iq.com/ksphere/konvoy/1.4/security/external-idps/rbac/)
- [Access control in Kommander](https://docs.d2iq.com/ksphere/kommander/1.2/operations/access-control/)
- [Kubernetes RBAC authorization](https://kubernetes.io/docs/reference/access-authn-authz/rbac/)
