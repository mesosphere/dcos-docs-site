---
layout: layout.pug
navigationTitle:  Authentication
title: Authentication
excerpt: Authenticating users against DC/OS
render: mustache
model: /data.yml
menuWeight: 30
---

<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->

# Authentication in DC/OS

In DC/OS, user authentication is required by default. Every user who wants to perform an operation on a DC/OS cluster (other than logging in) must first be authenticated.

DC/OS handles user authentication decentralized by using authentication tokens. Authentication tokens are distributed by the Identity and Access Manager (IAM) on a per user basis. The tokens can are verified out-of-band by any third-party entity. Allowing token verification to happen independent of the IAM makes this approach highly scalable in comparison to centralized session state keeping. Furthermore, with tokens user authentication state cannot be easily revoked.

Upon [login](/1.13/security/oss/login/) to DC/OS users receive a [DC/OS Authentication token](/1.13/security/oss/authentication/authentication-token). The DC/OS Authentication token can be used for authenticating subsequent requests to the API; see [Pass an authentication token to the API](/1.13/security/oss/authentication/authentication-token/#pass-an-authentication-token-to-the-api).

A DC/OS Authentication token is also used internally by the [DC/OS CLI](/1.13/cli/) for authenticating subsequent CLI commands. Authentication is only supported for DC/OS CLI version 0.4.3 and later. See [here](/1.13/cli/update/) for upgrade instructions.

In DC/OS the only authenticator in the system is [Admin Router](/1.13/overview/architecture/components/#admin-router). It enforces DC/OS Authentication token verification based on information from the [Identity and Access Manager (IAM)](/1.13/overview/architecture/components/#dcos-iam).

Third-party entities can be enabled to become authenticators for DC/OS Authentication tokens by using out-of-band verficiation via public key cryptography; see [Out-of-band token verification](/1.13/security/oss/authentication/out-of-band-verification/) for instructions.

<p class="message--note"><strong>NOTE: </strong>In DC/OS Open Source authentication equals authorization. Therefore, any entity that obtains a valid DC/OS Authentication token has full access to the cluster.</p>

## Disabling authentication

You can disable authentication using one of the following ways:
1. Disable authentication using [advanced installation](/1.13/installing/production/deploying-dcos/installation/): You can disable authentication by adding this parameter to your configuration file (`genconf/config.yaml`).

    ```yaml
    oauth_enabled: 'false'
    ```
    For more information, see the configuration [documentation](/1.13/installing/production/advanced-configuration/configuration-reference/).

2. Disable authentication using cloud installation on [AWS](/1.13/installing/oss/cloud/aws/): You can set the `OAuthEnabled` option to `false` on the **Specify Details** step to disable authentication.

<p class="message--warning"><strong>WARNING: </strong>You cannot disable authentication using cloud installation on <a href ="/1.13/installing/evaluation/azure/">Azure</a>.</p>

<p class="message--note"><strong>NOTE: </strong>If you have already installed your cluster and would like to disable this in-place, you can go through an upgrade with the configuration parameter set.</p>
