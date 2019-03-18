---
layout: layout.pug
navigationTitle:  Identity provider-based authentication
title: Identity provider-based authentication
menuWeight: 70
excerpt: Configuring identity provider-based authentication

enterprise: true
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->

To provide Single Sign-On (SSO) in your organization, you can configure DC/OS Enterprise to authenticate users against one or more external user identity providers (IdP). In contrast to directory-based authentication, the identity provider-based authentication is not as rich (less information available) but more flexible for individual users.

When a user attempts to log on from the DC/OS web interface, they will be presented with a list of the third-party identity providers that you have configured. They can click the one that they have an account with for SSO.

Users logging in from the DC/OS CLI can use the following command to discover the names of the IdPs that have been configured `dcos auth list-providers`. They can then use the following command to log in using an IdP `dcos auth login --provider=<provider-name> --username=<user-email> --password=<secret-password`.

DC/OS Enterprise supports two types of identity provider-based authentication methods: [Security Assertion Markup Language (SAML)](https://wiki.oasis-open.org/security/FrontPage) and [OpenID Connect (OIDC)](http://openid.net/connect/):

- Adding a [SAML Identity Provider](/1.13/security/ent/sso/setup-saml/)
- Adding an [OpenID Identity Provider](/1.13/security/ent/sso/setup-openid/):
