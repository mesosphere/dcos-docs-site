---
layout: layout.pug
navigationTitle:  Identity provider-based authentication
title: Identity provider-based authentication
menuWeight: 3
excerpt:
featureMaturity: stable
enterprise: true
---



# Configuring identity provider-based authentication

To provide Single Sign-On (SSO) in your organization, you can configure Enterprise DC/OS to authenticate users against one or more external user identity providers. In contrast to directory-based authentication, the identity provider-based authentication is not as rich (less information available) but more flexible for individual users.

When a user attempts to log on, they will be presented with a list of the third-party identity providers that you have configured. They can click the one that they have an account with for SSO. 

Enterprise DC/OS supports two types of identity provider-based authentication methods: [Security Assertion Markup Language (SAML)](https://wiki.oasis-open.org/security/FrontPage) and [OpenID Connect (OIDC)](http://openid.net/connect/):

- Adding a [SAML Identity Provider](/1.8/administration/id-and-access-mgt/sso/setup-saml/)
- Adding an [OpenID Identity Provider](/1.8/administration/id-and-access-mgt/sso/setup-openid/):
