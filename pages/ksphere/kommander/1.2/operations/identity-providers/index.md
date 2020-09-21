---
layout: layout.pug
beta: true
navigationTitle: Identity Providers
title: Identity Providers
menuweight: 1
excerpt: Grant access to users in your organization
---

## Logging in with Username and Password

By default, you login to konvoy with a credential given by `konvoy up`. You can retrieve it later by using `konvoy get ops-portal`.

These static credentials should only be used to access **operations portal** for configuring an external identity provider. Since there is no way of updating static credentials they should be treated as backup credentials and not used for normal access. Always login with your own identity from external identity providers that provide additional security features like Multi-Factor Authentication.

You can perform the following operations on Identity Providers:

- [Create an Identity Provider](#identity-providers)
- [Temporarily Disable an Identity Provider](#temporarily-disabling-a-provider)
- [Create Groups](#groups)

## Identity Providers

To provide simple access for the users of your organization, Identity Providers can be set up.

Currently, Kommander supports **Github**, **LDAP**, and any standard **OIDC** provider such as **Google**.

You can configure as many Identity Providers as you like and users will be able to select any of those methods when logging in.

![Identity](/ksphere/kommander/1.2/img/Identity-providers-table.png)

Identity Providers

#### Limiting who has access:

- The Github provider allows to specify which orgs and teams are eligible for access.

![Github Form](/ksphere/kommander/1.2/img/Identity-provider-Github.png)

Github Form

- The LDAP provider allows to configure search filters for either users or groups.

![LDAP Form](/ksphere/kommander/1.2/img/Identity-provider-LDAP.png)

LDAP Form

- The OIDC provider cannot limit users based on identity.

![OIDC Form](/ksphere/kommander/1.2/img/Identity-provider-OIDC.png)

OIDC Form

### Temporarily disabling a provider

Open the actions menu on the Identity Providers table and click Disable. The provider option will no longer appear on the login screen.

![Identity Provider Table Row Action Menu](/ksphere/kommander/1.2/img/Identity-provider-table-action-menu.png)

Identity Provider Table Row Action Menu

## Groups

Access control groups are configured in the Groups tab of the Identity Providers page. Refer to [Access Control](https://docs.d2iq.com/ksphere/kommander/1.2/operations/access-control/) for an overview of groups in Kommander.

![Identity Provider Groups](/ksphere/kommander/1.2/img/access-control-idp-groups.png)

Identity Provider Groups

## Related Information

- [Authorize a group across clusters](https://docs.d2iq.com/ksphere/kommander/1.2/tutorials/authorize-all-users/)
- [Granting access to Kubernetes resources in Kommander](https://docs.d2iq.com/ksphere/kommander/1.2/tutorials/configure-rbac/)
