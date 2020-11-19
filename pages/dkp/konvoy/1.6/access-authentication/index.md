---
layout: layout.pug
navigationTitle: Authentication and Access
title: Authentication and Access
menuWeight: 90
excerpt: Manage cluster security, authentication, and authorization for the Konvoy cluster
beta: false
enterprise: false
---

As Konvoy is based on Kubernetes, it uses [Kubernetes security mechanisms](https://kubernetes.io/docs/reference/access-authn-authz/controlling-access/).
This includes role-based access control (RBAC) for determining which resources a user can access. An OpenID Connect interface identifies users for use in RBAC. This supports login using various connectors, including GitHub, Google, and LDAP.

## Operator credentials

The cluster operator initially accesses Konvoy using the username and password provided after running `konvoy up` or, for a running cluster, `konvoy get ops-portal`. To use these credentials, select `Launch Console`.

This same username and password provides access to the Ops Portal, including various dashboards for management of the cluster. Only these credentials provide access to the Ops Portal.

## Client tokens

To configure `kubectl` to access the Kubernetes cluster:

1. Generate a token from the web landing page, by selecting `Generate Kubectl Token`.
1. Select an identity provider and cluster.
1. Many of the backends provide single-sign on (SSO), so you may already be signed in. Otherwise, you will be redirected to your identity provider's web page to log in.
1. After you have logged in, a page will show the commands required to configure `kubectl` to access the Konvoy cluster.
1. When the token expires, you must repeat the above process to obtain a fresh token.
1. When refreshing a token, only the `kubectl config set-credentials` command needs to be executed with the new token.

## Add login connectors

Konvoy uses Dex to provide OpenID Connect single sign-on to the cluster.

Dex can be configured to use multiple connectors, including GitHub, LDAP, and SAML 2.0.

The [Dex Connector documentation](https://dexidp.io/docs/connectors/) describes how to configure different connectors.

The configuration can be added as the `values` field in the `dex` addon.

Examples of tested configurations are described in the [External Providers] section.

## Kubernetes dashboard

When accessing the dashboard at `/ops/portal/kubernetes`, the authenticated user's username and groups are impersonated for all requests. Impersonation applies existing RBAC policies which govern access to the API server (`kubectl`) to the dashboard. The operator user has the `cluster-admin` role and has full access to all resources exposed by the Kubernetes dashboard. Users which are authenticated by external identity providers have no privileges. External users must be bound to `Roles` and `ClusterRoles` by their username or by any groups which they are members of. More information about Kubernetes RBAC can be found in the [Kubernetes Documentation](https://kubernetes.io/docs/reference/access-authn-authz/rbac/).

## Addon application security notices

**Note:** This security notice only applies to Konvoy versions 1.5 and below. In Konvoy 1.6, Helm v2 was removed in favor of Helm v3, which fixed security issues.

Konvoy clusters manage addon applications through a tool called *Kubeaddons*. Kubeaddons is implemented using [Kubernetes CRDs](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/) and [Controllers](https://kubernetes.io/docs/concepts/architecture/controller/).

Kubeaddons use drivers to deploy and manage addons thrugh the controller. The default currently is [Helm v2](https://helm.sh). The server component of Helm v2 is Tiller which architecturally introduces [security problems](https://v2.helm.sh/docs/securing_installation/) on the clusters its installed.

Helm v2 remains a supported driver. Helm v3 takes over these responsibilities in Konvoy 1.6 or above. Kubeaddons inherits the Helm v2 security issues present in any Tiller installation on the cluster. **Take great care with [RBAC](https://kubernetes.io/docs/reference/access-authn-authz/rbac/) permissions for users and service accounts on Konvoy clusters**. **Operators *should not provide RBAC permissions to create or manage Addon or ClusterAddon resources* as these permissions provide that user with [cluster-admin](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#user-facing-roles) privileges**.
