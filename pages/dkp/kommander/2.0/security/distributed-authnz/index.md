---
layout: layout.pug
beta: false
navigationTitle: Authentication and authorization
title: Authentication and authorization architecture
menuWeight: 9
excerpt: Details on distributed authentication and authorization between clusters
---

## Authentication

Kommander comes with a pre-configured authentication [Dex][dex_service] identity broker and provider.

<p class="message--important"><strong>IMPORTANT: </strong> Kubernetes, Kommander, and Dex do not store any user identities. The Kommander installation comes with default admin static credentials. These credentials should only be used to access the <strong>Kommander dashboard</strong> for configuring an external identity provider. There is currently no way to update these credentials so they should be treated as backup credentials and not used for normal access.<!--- Always login with your own identity from an <a href="../../operations/identity-providers/">external identity provider</a>. These provide additional security features like multi-factor authentication. For more information see the <a href="https://docs.d2iq.com/dkp/konvoy/latest/access-authentication/letsencrypt/">Kommander security documentation</a>. --></p>

The Kommander dashboard admin credentials are stored as a secret. They never leave the boundary of the Kommander cluster and are never shared to any other cluster.

The Dex service issues an [OIDC ID token][oidc_id_token] on successful user authentication. Other platform services use the ID token as an authentication proof. User identity to the Kubernetes API server is provided by the [`kube-oidc-proxy`][kube_oidc_proxy] platform service that reads the identity from an ID token. Web requests to Kommander dashboard access are authenticated by the [traefik forward auth][traefik_forward_auth] platform service.

<p class="message--note"><strong>NOTE: </strong>The <a href="https://github.com/jetstack/kube-oidc-proxy">kube-oidc-proxy</a> service authenticates kubectl CLI requests using the Kubernetes API Server Go library. This library requires that if an <strong>email_verified</strong> claim is present, it must be set to <strong>true</strong>, even if the <code>insecureSkipEmailVerified: true</code> flag is configured in the Dex connector. Thus, ensure that the OIDC provider is configured to set the email_verified field to 'true' </p>

A user identity is shared across a Kommander cluster and all other attached clusters.

### Kommander attached clusters

A newly attached cluster has federated `kube-oidc-proxy`, `dex-k8s-authenticator`, and `traefik-forward-auth` platform services. These platform services are configured to accept Kommander cluster Dex issued ID tokens.

When the `traefik-forward-auth` is used as a [Traefik Ingress authenticator][traefik_ingress], it checks if the user identity was issued by the Kommander cluster Dex service. An anonymous user is redirected to the Kommander cluster Dex service to authenticate and confirm their identity.

Never enter your own credentials on any of the attached clusters. On the Kommander cluster use the static admin credentials or an external identity provider (IDP).

## Authorization

There is no centralized authorization component in Kommander. Each component and service makes its own authorization decisions based on user identity.

<!--- Kommander provides an [interface to federate authorization RBAC rules][access_control] across multiple clusters.

- The Kubernetes API server is using [RBAC Authorization][rbac_authz].
- `traefik-forward-auth` applies [RBAC rules to authorize][portal_auth] access based on an HTTP request. The [default Kommander workspace][workspaces] comes with preconfigured Roles for accessing different portal services with View, Edit, or Admin permissions.
[portal_auth]: ../access-authentication/rbac/#portal-authorization

-->

[access_control]: ../../operations/access-control/
[dex_service]: https://github.com/dexidp/dex
[kube_oidc_proxy]: https://github.com/jetstack/kube-oidc-proxy
[oidc_id_token]: https://openid.net/specs/openid-connect-core-1_0.html#IDToken
[rbac_authz]: https://kubernetes.io/docs/reference/access-authn-authz/rbac/
[traefik_forward_auth]: https://github.com/mesosphere/traefik-forward-auth
[traefik_ingress]: https://docs.traefik.io/v2.4/providers/kubernetes-ingress/
[workspaces]: ../../workspaces/
