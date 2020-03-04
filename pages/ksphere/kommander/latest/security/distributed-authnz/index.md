---
layout: layout.pug
navigationTitle: Authentication and authorization
title: Authentication and authorization architecture
menuWeight: 9
excerpt: Details on distributed authentication and authorization between clusters
---

## Authentication

A Kommander is part of a Konvoy cluster installation. Konvoy comes with pre-configured authentication [Dex][dex_service] identity broker and provider.

**Important:** Kubernetes, Konvoy and Dex do not store any user identities. Konvoy installation comes with default admin static credentials. These credentials should be used only to access **operations portal** for configuring an external identity provider. Since there is currently no way of updating them they should be treated only as backup credentials and not used for normal access. Always login with own identity from [external identity provider](../../operations/identity-providers/) that usually provide additional security features like Multi Factor Authentication. For more information review [Konvoy security documentation](/ksphere/konvoy/latest/security/).

The operational portal admin credentials are stored as a secret. They never leave the boundary of the Kommander cluster and are never shared to any other cluster.

The Dex service issues an [OIDC ID token][oidc_id_token] on successful user authentication. Other Konvoy components use the id token as an authentication proof. User identity to the Kubernetes API server is provided by [`kube-oidc-proxy`](https://github.com/jetstack/kube-oidc-proxy) Addon that reads the identity from an id token. Web requests to operations portal access are authenticated by [traefik forward auth](https://github.com/mesosphere/traefik-forward-auth) Addon.

A user identity is shared across Kommander cluster and all other provisioned clusters.

### Kommander provisioned clusters

A newly provisioned is federated `kube-oidc-proxy`, `dex-k8s-authenticator` and `traefik-forward-auth` Addons that are configured to trust Kommander cluster Dex issued id tokens.

When the `traefik-forward-auth` is used as a [Traefik ingress authenticator](https://docs.traefik.io/v1.7/configuration/backends/kubernetes/#annotations) it checks if the user identity was issued by the Kommander's cluster Dex service. An anonymous user is redirected to Kommander cluster Dex service to authenticate and confirm its identity.

A user never enters its own credentials on any of the provisioned clusters but always only on Kommander cluster (when using static admin credentials) or external identity provider.

## Authorization

There is no centralized authorization component in Kommander. Each component and service makes own authorization decision based on user identity.

Kommander provides an [interface to federate authorization RBAC rules](../../operations/access-control/) across multiple clusters.

* Kubernetes API server is using [RBAC Authorization](https://kubernetes.io/docs/reference/access-authn-authz/rbac/).

* `traefik-forward-auth` applies [RBAC rules to authorize](/ksphere/konvoy/latest/security/external-idps/rbac/#portal-authorization) access based on an HTTP request. The [default Kommander workspace](../../workspaces/) comes with preconfigured Roles for accessing different operational portal services with View, Edit or Admin permissions.

[dex_service]: https://github.com/dexidp/dex
[oidc_id_token]: https://openid.net/specs/openid-connect-core-1_0.html#IDToken