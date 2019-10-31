---
layout: layout.pug
navigationTitle: Identity Providers
title: Identity Providers
excerpt: excerpt goes here
menuWeight: 10
---

Identity Providers
By default, you login to konvoy with a credential given by konvoy up (or later using konvoy get ops-portal.) This login option is always available but other established identity providers can be connected using Kommander in order to make access for other users simple.
Identity Providers settings allow you to connect the ops login and authentication with an established source of users in your organization. Currently, Kommander supports Github, LDAP, and any standard OIDC provider such as Google. You can configure as many Identity Providers as you like and users will be able to select any of those methods when logging in.
Limiting who has access
The Github Identity Provider allows you to specify which orgs and teams are eligible for access.
The LDAP provider allows you to configure search filters for either users or groups.
The OIDC provider cannot limit users based on identity.
Temporarily disabling a provider: Untick the checkbox labelled “enabled” on the Identity Providers table. The provider option will no longer appear on the login screen.