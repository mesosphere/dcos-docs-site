---
layout: layout.pug
navigationTitle: Authentication and authorization
title: Authentication and authorization architecture
menuWeight: 9
excerpt: Details on distributed authentication and authorization between clusters
---

## Authentication

Kommander is part of a Konvoy cluster installation. Konvoy comes with a pre-configured authentication [Dex][dex_service] identity broker and provider.

<p class="message--important"><strong>IMPORTANT: </strong> Kubernetes, Konvoy and Dex do not store any user identities. The Konvoy installation comes with default admin static credentials. These credentials should only be used to access the <strong>operations portal</strong> for configuring an external identity provider. There is currently no way to update these credentials so they should be treated as backup credentials and not used for normal access. Always login with your own identity from an <a href="../../operations/identity-providers/">external identity provider</a>. These provide additional security features like Multi Factor Authentication. For more information refer to the <a href="/ksphere/konvoy/latest/security/">Konvoy security documentation</a>.</p>

The operational portal admin credentials are stored as a secret. They never leave the boundary of the Kommander cluster and are never shared to any other cluster.

The Dex service issues an [OIDC ID token][oidc_id_token] on successful user authentication. Other Konvoy components use the id token as an authentication proof. User identity to the Kubernetes API server is provided by the [`kube-oidc-proxy`](https://github.com/jetstack/kube-oidc-proxy) Addon that reads the identity from an id token. Web requests to operations portal access are authenticated by the [traefik forward auth](https://github.com/mesosphere/traefik-forward-auth) Addon.

A user identity is shared across a Kommander cluster and all other provisioned clusters.

### Kommander provisioned clusters

A newly provisioned cluster gets federated `kube-oidc-proxy`, `dex-k8s-authenticator` and `traefik-forward-auth` Addons. These Addons are configured to accept Kommander cluster Dex issued id tokens.

When the `traefik-forward-auth` is used as a [Traefik ingress authenticator](https://docs.traefik.io/v1.7/configuration/backends/kubernetes/#annotations) it checks if the user identity was issued by the Kommander cluster Dex service. An anonymous user is redirected to the Kommander cluster Dex service to authenticate and confirm their identity.

Never enter your own credentials on any of the provisioned clusters. On the Kommander cluster use the static admin credentials or an external identity provider.

## Authorization

There is no centralized authorization component in Kommander. Each component and service makes its own authorization decisions based on user identity.

Kommander provides an [interface to federate authorization RBAC rules](../../operations/access-control/) across multiple clusters.

* The Kubernetes API server is using [RBAC Authorization](https://kubernetes.io/docs/reference/access-authn-authz/rbac/).

* `traefik-forward-auth` applies [RBAC rules to authorize](/ksphere/konvoy/latest/security/external-idps/rbac/#portal-authorization) access based on an HTTP request. The [default Kommander workspace](../../workspaces/) comes with preconfigured Roles for accessing different operational portal services with View, Edit or Admin permissions.

[dex_service]: https://github.com/dexidp/dex
[oidc_id_token]: https://openid.net/specs/openid-connect-core-1_0.html#IDToken
