---
layout: layout.pug
navigationTitle:  External User Login
title: External User Login
excerpt: Logging in to DC/OS as an external user
render: mustache
model: /1.13/data.yml
menuWeight: 10
---

<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->

# Login using the DC/OS CLI

**Prerequisite:**
- [DC/OS CLI](/1.13/cli/)

1.  To log in to the DC/OS CLI, enter the following [auth login](/1.13/cli/command-reference/dcos-auth/dcos-auth-login/) command.

    ```bash
    dcos auth login --provider dcos-oidc-auth0
    If your browser didn't open, please go to the following link:

        http://172.17.0.2/login?redirect_uri=urn:ietf:wg:oauth:2.0:oob

    Enter OpenID Connect ID Token: 
    >
    ```

1. Follow the displayed instructions to trigger the browser login flow.

1. After logging in through your provider, copy the `OpenID Connect ID token` that appears in the browser.

1. Paste the `OpenID Connect ID token` into the DC/OS CLI for login completion.

    <p class="message--note"><strong>NOTE: </strong>The <code>--provider</code> argument is set to <code>dcos-oidc-auth0</code> by default.</p>

1. Display the DC/OS Authentication token by executing the following command.

    ```bash
    dcos config show core.dcos_acs_token
    ```
1. Export the DC/OS Authentication token into environment as `TOKEN` to use it in API requests:

    ```bash
    export TOKEN=$(dcos config show core.dcos_acs_token)
    ```

# Login using the web interface

1.  Launch the DC/OS web interface.
2.  Log in through a single sign-on flow using the identity provider of your choice (Google, GitHub, or Microsoft).

<p class="message--note"><strong>NOTE: </strong>The Single Sign-On flow will result in the DC/OS Authentication token being stored in a browser cookie.</p>


