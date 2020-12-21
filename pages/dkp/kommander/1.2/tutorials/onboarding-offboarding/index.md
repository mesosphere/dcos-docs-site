---
layout: layout.pug
beta: false
navigationTitle: Onboarding and offboarding a user in Kommander
title: Onboarding and offboarding a user in Kommander
menuWeight: 1
excerpt: Authorize a group and add or remove users in it.
---

## Before you begin

This procedure requires the following configurations and background:

- A Konvoy cluster with [Kommander installed](/dkp/kommander/1.2/install/).
- A configured [Identity Provider](/dkp/kommander/1.2/tutorials/authorize-all-users/).
- Some familiarity with [Kubernetes role-based access control](https://kubernetes.io/docs/reference/access-authn-authz/rbac/) principles.
- A configured [group](/dkp/kommander/1.2/operations/identity-providers/) in Kommander.

## Give access to a certain group

You can give access for a group to certain objects by creating policies that bind that group to a role. You can use roles available by default such as _View Role_ or create custom fine-grained roles fitting your use-cases.

You can use the Kommander UI or the `kubectl` CLI to create policies, as explained in the [role-based access control configuration tutorial](/dkp/kommander/1.2/tutorials/configure-rbac/). This tutorial explains you how to offer a certain access to a given group.

## Add and remove a member to a group

Everything related to members happens in the Identity Providers section of Kommander.

You can add members in a group while creating a group and edit the members in the group later.

![Create Group Add Members](/dkp/kommander/1.2/img/access-control-create-group.png)

Use the cross at the right of the member name to remove a member from a group. You can list the groups in the `Identity Providers` section to access and edit list members.

Once a member is part of a group, you can login to the clusters targeted by the group's roles using the user's credentials. This requires using the right Identity Provider (GitHub, LDAP, or a configured OIDC provider).

## Related information

- [Installing and configuring Kommander](/dkp/kommander/1.2/install/)
- [Identity Providers in Kommander](/dkp/kommander/1.2/operations/identity-providers/)
- [Configuring a GitHub Identity Provider in Kommander](/dkp/kommander/1.2/tutorials/authorize-all-users/)
- [Granting access to Kubernetes resources in the CLI](/dkp/konvoy/1.4/security/external-idps/rbac/)
- [Access control in Kommander](/dkp/kommander/1.2/operations/access-control/)
- [Kubernetes RBAC authorization](https://kubernetes.io/docs/reference/access-authn-authz/rbac/)
