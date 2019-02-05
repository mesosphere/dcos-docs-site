---
layout: layout.pug
navigationTitle:  Configuring an OpenID Connect IdP
title: Configuring an OpenID identity provider
menuWeight: 2
excerpt: Configuring an OpenID identity provider

enterprise: true
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->


This page discusses what is required of OpenID IdPs in general and provides a step-by-step procedure for setting up a OneLogin IdP. DC/OS Enterprise can integrate with any identity provider (IdP) that uses OpenID Connect 1.0. The following procedure will take a Google IdP as an example and walk you through each step of the set up process. 

# Adding an OpenID Connect identity provider

You can add a Google OpenID Connect IdP in Google or DC/OS.

## Configuring the IdP in Google

1. Visit the [Credentials page of the Google Developer Console](https://console.developers.google.com/apis/credentials?project=_).

1. If you already have a project, click **Select a Project**, select the project, and click **Open**.

   If you do not already have a project, click **Create a project**, type the name of your project in the **Project Name** box, opt in or out of email communications, accept the terms of service, and click **Create**.

1. In the **Credentials** dialog, select **OAuth client ID**.

1. Click **Configure consent screen**.

1. The next screen allows you to provide a range of information to be displayed to users when they provide their credentials. At a minimum, you must specify a name for the IdP in the **Product name shown to users** box.

1. Click **Save**.

1. Select **Web application** as the **Application type**.

1. Type a name for the IdP in the **Name** box.

1. Paste the URL of your cluster into the **Authorized JavaScript origins** box. Example: `https://jp-ybwutd-elasticl-1r2iui8i0z9b7-1590150926.us-west-2.elb.amazonaws.com`

    If your cluster is fronted by a load balancer (recommended) the cluster URL will be the path to the load balancer. The cluster URL is the same as the path to the DC/OS web interface and can be copied from your browser bar. Alternatively, you can log into the DC/OS CLI and type `dcos config show core.dcos_url` to get your cluster URL.

1. Paste your cluster URL into the **Authorized redirect URIs** field as well.

1. Paste `/acs/api/v1/auth/oidc/callback` to the end of your cluster URL in the **Authorized redirect URIs** field. Example: `https://jp-ybwutd-elasticl-1r2iui8i0z9b7-1590150926.us-west-2.elb.amazonaws.com/acs/api/v1/auth/oidc/callback`

1. Click **Create**.

1. Copy and paste the client ID and client secret values to a text file.

## Configuring the IdP in DC/OS

1. Log into the DC/OS web interface as a user with the `dcos:superuser` permission.

1. Open the **Settings** -> **Identity Providers** tab.

1. Click the **+** icon in the top right.

1. Click **OpenID Connect**.

1. Type a name for your IdP in the **Provider ID** field. This name will be passed in a URL, so make sure it contains only lowercase alphanumeric and `-` characters. Example: `google-idp`.

1. Type a human-readable name for your IdP in the **Description** field. Example, `Google`.

1. Paste the following into the **Issuer** field: `https://accounts.google.com`.

1. Paste your cluster URL into the **Base URI** field. Please see the previous section for more information on obtaining this value.

1. Paste the client ID value from Google into the **Client ID** field.

1. Paste the client secret value from Google into the **Client Secret** field.

    ![Google IdP Configuration](/1.13/img/oidc-google.png)

    Figure 1. Google IdP configuration

11. Click **Submit**.

12. You should now see your new IdP listed in the DC/OS web interface.


## Verifying the IdP

### About verifying the IdP

You can use either of the following to verify that you have set up your IdP correctly.

- [Using the DC/OS web interface](#using-gui)
- [Using the DC/OS CLI](#using-cli)

### <a name="using-gui"></a>Using the DC/OS GUI

1. Sign out of the DC/OS GUI.

1. You should see a new button on your login dialog that reads **LOGIN WITH GOOGLE**.

1. Click the new button.

1. You will be redirected to Google.

1. Click to allow DC/OS access to your Google account information.

1. You should see an **Access Denied** message from DC/OS. This signifies that the logon was successful, the user account has been added to DC/OS, but the new user has no permissions and therefore cannot view anything in the DC/OS web interface.

1. Click **LOG OUT**.

1. Log back in as a user with the `dcos:superuser` permission.

1. Open the **Organization** -> **Users** tab.

1. You should see your new user listed there.

1. Assign this user the appropriate [permissions](/1.13/security/ent/perms-reference/).

### <a name="using-cli"></a>Using the DC/OS CLI

**Prerequisite:** [DC/OS CLI installed](/1.13/cli/install/).

1. Use the following command to log in as your new user.

   ```bash
   dcos auth login --provider=google-idp --username=<user-email> --password=<secret-password>
   ```

1. The CLI should return a message similar to the following.

   ```bash
   Please go to the following link in your browser:

    https://eanicich-elasticl-c3kpgqk7jdft-820516824.us-west-2.elb.amazonaws.com/acs/api/v1/auth/login?oidc-provider=google-idp&target=dcos:authenticationresponse:html
   ```

1. Copy the path and paste it into your browser.

1. You should see a message similar to the following.

    ![CLI IdP Auth Token](/1.13/img/cli-auth-token.png)

    Figure 2. CLI IdP auth token

1. Click **Copy to clipboard**.

1. Return to your terminal prompt and paste in the authentication token value.

1. You should receive the following message.

   ```bash
   Login successful!
   ```
