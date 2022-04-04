---
layout: layout.pug
navigationTitle: OpenID Connect (OIDC)
title: OpenID Connect (OIDC) Introduction
menuWeight: 10
excerpt: An introduction to OpenID Connect (OIDC) Authentication in Kubernetes
beta: false
enterprise: false
---

<!--- markdownlint-disable MD030 --->

All Kubernetes clusters have two categories of users: service accounts and normal users. Kubernetes manages authentication for service accounts, but the cluster administrator, or a separate service, manages authentication for normal users.

Kommander configures the cluster to use OpenID Connect (OIDC), a popular and extensible user authentication method, and installs Dex, a popular, open-source software product that integrates your existing Identity Providers with Kubernetes.

To begin, set up an Identity Provider with Dex, then use OIDC as the Authentication method.

## Identity Provider

An Identity Provider (IdP) is a service that lets you manage identity information for users, including groups. A cluster created in Kommander uses Dex as its IdP. Dex, in turn, delegates to one or more external IdPs.

If you use already use one or more of the following IdPs, you can configure Dex to use them:

| Name | Supports Refresh Tokens | Supports Groups Claim | Supports `preferred_username` Claim | Status | Notes |
| ---- | ----------------------- | --------------------- | --------------------------------- | ------ | ----- |
| [LDAP](https://github.com/dexidp/dex/blob/v2.22.0/Documentation/connectors/ldap.md) | yes | yes | yes | stable | |
| [GitHub](https://github.com/dexidp/dex/blob/v2.22.0/Documentation/connectors/github.md) | yes | yes | yes | stable | |
| [SAML 2.0](https://github.com/dexidp/dex/blob/v2.22.0/Documentation/connectors/saml.md) | no | yes | no | stable |
| [GitLab](https://github.com/dexidp/dex/blob/v2.22.0/Documentation/connectors/gitlab.md) | yes | yes | yes | beta | |
| [OpenID Connect](https://github.com/dexidp/dex/blob/v2.22.0/Documentation/connectors/oidc.md) | yes | yes | yes | beta | Includes Salesforce, Azure, etc. |
| [Google](https://github.com/dexidp/dex/blob/v2.22.0/Documentation/connectors/google.md) | yes | yes | yes | alpha | |
| [LinkedIn](https://github.com/dexidp/dex/blob/v2.22.0/Documentation/connectors/linkedin.md) | yes | no | no | beta | |
| [Microsoft](https://github.com/dexidp/dex/blob/v2.22.0/Documentation/connectors/microsoft.md) | yes | yes | no | beta | |
| [AuthProxy](https://github.com/dexidp/dex/blob/v2.22.0/Documentation/connectors/authproxy.md) | no | no | no | alpha | Authentication proxies such as Apache2 mod_auth, etc. |
| [Bitbucket Cloud](https://github.com/dexidp/dex/blob/v2.22.0/Documentation/connectors/bitbucketcloud.md) | yes | yes | no | alpha | |
| [OpenShift](https://github.com/dexidp/dex/blob/v2.22.0/Documentation/connectors/openshift.md) | no | yes | no | stable | |

<p class="message--note"><strong>NOTE: </strong>These are the Identity Providers supported by Dex <a href="https://github.com/dexidp/dex/blob/v2.22.0/README.md">2.22.0</a>, the version used by DKP.</p>

<!--- ## Identity Provider Procedures

[Set up an identity provider with Dex](./set-up-identity-provider-with-dex) --->

## Add login connectors

Kommander uses Dex to provide OpenID Connect single sign-on (SSO) to the cluster. Dex can be configured to use multiple connectors, including GitHub, LDAP, and SAML 2.0. The [Dex Connector documentation](https://dexidp.io/docs/connectors/) describes how to configure different connectors. You can add the configuration as the values field in the Dex application. An example Dex configuration provided to the Kommander CLI's `install` command would look similar to this:

```yaml
apiVersion: config.kommander.mesosphere.io/v1alpha1
kind: Installation
apps:
  dex:
    values: |
      config:
        connectors:
        - type: oidc
          id: google
          name: Google
          config:
            issuer: https://accounts.google.com/o/oauth2/v2/auth
            clientID: YOUR_CLIENT_ID
            clientSecret: YOUR_CLIENT_SECRET
            redirectURI: https://DKP_CLUSTER_DOMAIN/dex/callback
            scopes:
            - openid
            - profile
            - email
            insecureSkipEmailVerified: true
            insecureEnableGroups: true
            userIDKey: email
            userNameKey: email
[...]
```

## Authentication

OpenID Connect is an extension of the [OAuth2 authentication protocol](https://oauth.net/2/). As required by OAuth2, the client must be registered with Dex. Do this by passing the name of the application and a callback/redirect URI. These handle the processing of the OpenID token after the user authenticates successfully. After registration, Dex returns a `client_id` and a `secret`. Authentication requests use these between the client and Dex to identify the client.

Users access Kommander in two ways:

-   To interact with Kubernetes API, usually through `kubectl`.

-   To interact with the D2iQ DKP UI, which has GUI dashboards for Prometheus, Grafana, and so on.

In Kommander, Dex comes pre-configured with a client for these access use cases. The clients talk to Dex for authentication. Dex talks to the configured Identity Provider, or IdP, (for example LDAP, SAML and so on) to perform the actual task of authenticating the user.

If the user authenticates successfully, Dex pulls the user’s information from the IdP and forms an OpenID token. The token contains this information and returns it to the respective client’s callback URL. The client or end user uses this token for communicating with the D2iQ DKP UI or Kubernetes API respectively.

This figure illustrates these components and their interaction at a high level:

![OIDC authentication flow](./oidc-auth-flow-with-dex.png)

<!--- ## Authentication Procedures

- [Generate client access token](./generate-client-access-token)
- [Change token lifetime](./change-token-lifetime)
- [Change the group prefix](./change-group-prefix)

## Users & Groups

TODO High-level overview of why there is a user and a group.

## Users & Groups Procedures

TODO Assign Permission to Users & Groups (Note: This should link to procedure under the forthcoming RBAC section.)

## Troubleshoot

[Troubleshoot OIDC and Dex](./troubleshoot) --->
