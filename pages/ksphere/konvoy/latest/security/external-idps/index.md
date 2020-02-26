---
layout: layout.pug
navigationTitle: Setting up an external identity provider
title: Setting up an external identity provider
menuWeight: 10
excerpt: Connect your Konvoy cluster to an external identity provider
enterprise: false
---

Your Konvoy cluster contains a [Dex](https://github.com/dexidp/dex) instance which serves as an identity broker.
Towards cluster internals this Dex instance appears as an OpenID Connect identity provider.
Towards cluster-external identity providers it can appear as a relying party, through a variety of interfaces (LDAP, SAML, OAuth2, ...).
This section contains documentation for how to configure Konvoy's Dex against popular types of external identity providers.
