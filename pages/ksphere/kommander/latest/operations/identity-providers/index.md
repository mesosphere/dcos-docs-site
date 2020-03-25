---
layout: layout.pug
navigationTitle: Identity Providers
title: Identity Providers
menuweight: 1
excerpt: Grant access to users in your organization
---

## Logging in with Username and Password

By default, you login to konvoy with a credential given by `konvoy up`. You can retrieve it later by using `konvoy get ops-portal`.

Static credentials should only be used to access **operations portal** for configuring an external identity provider. Since there is  no way of updating static credentials they should be treated as backup credentials and not used for normal access. Always login with your own identity from external identity providers that provide additional security features like Multi Factor Authentication.

## Identity Providers

To provide simple access for the users of your organization, Identity Providers can be set up.

Currently, Kommander supports **Github**, **LDAP**, and any standard **OIDC** provider such as **Google**. 

You can configure as many Identity Providers as you like and users will be able to select any of those methods when logging in.

![Identity](/ksphere/kommander/img/Identity-providers-table.png)

Figure 1 - Identity Providers

#### Limiting who has access:

- The Github provider allows to specify which orgs and teams are eligible for access.

![Github Form](/ksphere/kommander/img/Identity-provider-Github.png)

Figure 2 - Github Form

- The LDAP provider allows to configure search filters for either users or groups.

![LDAP Form](/ksphere/kommander/img/Identity-provider-LDAP.png)

Figure 3 - LDAP Form

- The OIDC provider cannot limit users based on identity.

![OIDC Form](/ksphere/kommander/img/Identity-provider-OIDC.png)

Figure 4 - OIDC Form

#### Temporarily disabling a provider

Untick the checkbox labelled “enabled” on the Identity Providers table. The provider option will no longer appear on the login screen.

- The OIDC provider cannot limit users based on identity.

![Enabled Checkbox](/ksphere/kommander/img/Identity-provider-enabled-checkbox.png)

Figure 5 - Enabled Checkbox
