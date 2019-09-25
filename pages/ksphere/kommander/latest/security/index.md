---
layout: layout.pug
navigationTitle: Security
title: Security
menuWeight: 10
excerpt: Manage cluster security, authentication, and authorization for the Konvoy cluster
enterprise: false
---

As Konvoy is based on Kubernetes, it uses [Kubernetes security mechanisms].
This includes role-based access control (RBAC) for determining which resources a user can access.

Users are identified through an OpenID Connect interface, which supports login using multiple connectors, including GitHub, Google, and LDAP.

## Client tokens

To configure `kubectl` to access the Kubernetes cluster, obtain a token from the web landing page, by selecting `Generate Kubectl Token`.
Select an identity provider and cluster.
As many of the backends provide single-sign on (SSO), you may already be signed in.
Otherwise, you will be redirected to your identity provider's web page to login.
Once you have signed in, a page will show the commands required to configure `kubectl` to access the Konvoy cluster.

When the token expires, it is necessary to repeat the above process to obtain a fresh token.
When refreshing a token, only the `kubectl config set-credentials` command needs to be executed with the new token.

## Operator credentials

The cluster operator gets initial access using the username and password provided after running `konvoy up` or, for a running cluster, `konvoy get ops-portal`.
To use these credentials, select `Log in with Email`.

This same username and password provides access to the Ops Portal, including multiple dashboards for management of the cluster.

Only these credentials provide access to the Ops Portal.
Adding additional Ops Portal users may be provided in a future release.

## Adding login connectors

Konvoy uses Dex to provide OpenID Connect single sign-on to the cluster.

Dex can be configured to use multiple connectors, including GitHub, LDAP, and SAML 2.0.
The [Dex Connector documentation] describes how to configure different connectors.
The configuration can be added as the `values` field in the `dex` addon.

Examples of tested configurations are described in the [External Providers] section.

[Dex Connector documentation]: https://github.com/dexidp/dex/tree/master/Documentation/connectors
[External Providers]: ./external-idps
[Kubernetes security mechanisms]: https://kubernetes.io/docs/reference/access-authn-authz/controlling-access/
