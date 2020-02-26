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

## Kubernetes Dashboard

When accessing the dashboard at `/ops/portal/kubernetes`, the authenticated user's username and groups are impersonated for all request. Impersonation applies existing RBAC policies which govern access to the API server (`kubectl`) to the dashboard. The operator user has the `cluster-admin` role and has full access to all resources exposed by the Kubernetes dashboard. Users which are authenticated by external identity providers have no privileges. External users must be bound to `Roles` and `ClusterRoles` by their username or by any groups which they are members of. More information about Kubernetes RBAC can be found in the [Kubernetes Documentation](https://kubernetes.io/docs/reference/access-authn-authz/rbac/).

## Addon Application Security Notices

Konvoy clusters manage Addon applications through a tool called "Kubeaddons". Kubeaddons is implemented via [Kubernetes CRDs](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/) and [Controllers](https://kubernetes.io/docs/concepts/architecture/controller/).

Kubeaddons uses "drivers" under the hood to deploy and manage Addons via the Controller, the default currently is [Helm V2](https://helm.sh). The server component of Helm V2 is "Tiller" which is known historically to architecturally introduce some [security problems](https://v2.helm.sh/docs/securing_installation/) to the cluster its installed on.

While Helm V2 remains a supported driver (Helm V3 should take over these responsibilities in later releases) Kubeaddons inherits the security issues present in any Tiller installation on the cluster. **Great care needs to be taken with [RBAC](https://kubernetes.io/docs/reference/access-authn-authz/rbac/) permissions for users and service accounts on Konvoy clusters**. **Operators *should not provide RBAC permissions to create or manage Addon or ClusterAddon resources* as these permissions essentially provide that user with [cluster-admin](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#user-facing-roles)**.

[Dex Connector documentation]: https://github.com/dexidp/dex/tree/master/Documentation/connectors
[External Providers]: ./external-idps
[RBAC Examples]: ./external-idps/rbac
[Kubernetes security mechanisms]: https://kubernetes.io/docs/reference/access-authn-authz/controlling-access/
