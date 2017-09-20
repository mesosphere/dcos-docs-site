---
layout: layout.pug
title: >
  Adding an OpenID Connect identity
  provider
menuWeight: 2
excerpt: >
  This topic discusses OpenID Connect IdPs
  in general and provides a step-by-step
  procedure for setting up a Google OpenID
  Connect IdP.
featureMaturity: experimental
enterprise: true
navigationTitle:  >
---



# About adding an OpenID Connect identity provider

Enterprise DC/OS can integrate with any identity provider (IdP) that uses OpenID Connect 1.0. 

The following procedure will take a Google IdP as an example and walk you through each step of the set up process.


# Adding a Google OpenID Connect IdP


## Configuring the IdP in Google

1. Visit the [Credentials page of the Google Developer Console](https://console.developers.google.com/apis/credentials?project=_).

2. Type the name of your project in the **Project Name** box.

3. Opt in or out of email communications and accept the terms of service.

4. Click **Create**.

5. In the **Credentials** dialog, select **OAuth client ID**.

6. Click **Configure consent screen**.

7. The next screen allows you to provide a range of information to be displayed to users when they provide their credentials. At a minimum, you must specify a name for the IdP in the **Product name shown to users** box.

8. Click **Save**.

9. Select **Web application** as the **Application type**.

10. Type a name for the IdP in the **Name** box.

11. Paste the URL of your cluster into the **Authorized JavaScript origins** box. Example: `https://jp-ybwutd-elasticl-1r2iui8i0z9b7-1590150926.us-west-2.elb.amazonaws.com`

    **Note:** The domain name of the DC/OS web interface is your cluster URL. You can copy this from your browser and paste it into this field. Alternatively, you can log into the DC/OS CLI and type `dcos config show core.dcos_url` to get your cluster URL. 

12. Paste your cluster URL into the **Authorized redirect URIs** field as well.

13. Paste `/acs/api/v1/auth/oidc/callback` to the end of your cluster URL in the **Authorized redirect URIs** field. Example: `https://jp-ybwutd-elasticl-1r2iui8i0z9b7-1590150926.us-west-2.elb.amazonaws.com/acs/api/v1/auth/oidc/callback`

13. Click **Create**.

14. Copy and paste the client ID and client secret values to a text file.

## Configuring the IdP in DC/OS

1. Log into the DC/OS web interface as a `superuser`.

2. Open the **System** -> **Organization** -> **Identity providers** tab.

3. Click **Add Provider**.

4. Click **OpenID Connect**.

5. Type a name for your IdP in the **Provider ID** field. This name will be passed in a URL, so make sure it is lowercase and contains no spaces. Example: `google-idp`.

6. Type a human-readable name for your IdP in the **Description** field. Example, `Google`.

7. Paste the following into the **Issuer** field: `https://accounts.google.com`.

8. Paste your cluster URL into the **Base URI** field. Please see the previous section for more information on obtaining this value.   

9. Paste the client secret value from Google into the **Client Secret** field.

10. Paste the client ID value from Google into the **Client ID** field.

    ![Google IdP Configuration](/docs/1.8/administration/id-and-access-mgt/sso/img/oidc-google.png) 

11. Click **Submit**.

12. You should now see your new IdP listed in the DC/OS web interface.


## Verifying the IdP

1. Log out of the DC/OS web interface as `superuser`.

2. You should see a new button on your login dialog that reads **Login with <your-IdP- description>**.

3. Click the new button.

4. You will be redirected to Google.

5. Click to allow DC/OS access to your Google account information.

6. You should be returned to the DC/OS web interface, however, because the new user has no permissions, you will not see very much.

7. Log out as the new Google user.

8. Log back in as the `superuser`.

9. Open the **System** -> **Organization** -> **Users** tab.

10. You should see your new user listed there.

    **Tip:** Users imported via OpenID Connect will have a series of numbers as their user ID.

11. Go ahead and assign this user the appropriate [permissions](/docs/1.8/administration/id-and-access-mgt/permissions/). 
 
