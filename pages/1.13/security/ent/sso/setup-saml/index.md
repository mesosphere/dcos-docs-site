---
layout: layout.pug
navigationTitle:  Configuring a SAML IdP
title: Configuring a SAML Identity Provider
menuWeight: 1
excerpt: Configuring a SAML Identity Provider and OneLogin IdP

enterprise: true
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->

This topic discusses what is required of Security Assertion Markup Language (SAML) IdPs in general and provides a step-by-step procedure for setting up a OneLogin IdP.

# Adding a SAML identity provider

DC/OS Enterprise requires the SAML identity provider (IdP) to:

- Sign its authentication assertion.
- Not use `urn:oasis:names:tc:SAML:2.0:nameid-format:transient` as its `NameIDFormat`.

Upon receiving the SAML response from the IdP, DC/OS searches it for a value that it can use as the DC/OS user ID. It does so in the following sequence, stopping upon locating the necessary value.

1. If the `NameID` of the `Subject` appears to contain an email address, DC/OS uses the email address value.
1. If the response contains an attribute statement, DC/OS uses the first attribute value that appears to be an email address, especially if is of the [LDAP `mail` attribute](https://tools.ietf.org/html/rfc4524#section-5) type.
1. DC/OS uses the `NameID`.

While DC/OS Enterprise supports the full range of SAML 2.0 IdPs, the following procedure takes the OneLogin IdP as an example and provides step-by-step instructions.

# Adding a OneLogin identity provider

## Obtaining the identity provider metadata

1. Log into the OneLogin dashboard as a OneLogin superuser.
2. [Create](https://admin.us.onelogin.com/apps/find) an IdP app that can send attributes and sign the auth assertion.
3. Click to add the app.
4. Type a descriptive name for this IdP in the **Display Name** field.
5. Click **Save**.
7. Click the **SSO** tab.
8. Copy the **Issuer URL** value.
9. Make a `GET` request to the **Issuer URL** from either a browser or using curl.
10. It should return the identity provider XML.

  ```xml
<?xml version="1.0?>
<EntityDescriptor xmlns="urn:oasis:names:tc:SAML:2.0:metadata" entityID="https://app.onelogin.com/saml/metadata/555370">
  [...]
</EntityDescriptor>
  ```

11. Copy the XML to a clipboard or into a text editor.
12. Click the **Access** tab. Activate all roles you want to be able to log in to your cluster. For example: **Employee** and **Engineer**.

  <p class="message--warning"><strong>WARNING: </strong>Don't click <strong>Save</strong>* at this stage; it will fail.</p>

## Configuring DC/OS 
This procedure will show you how to configure DC/OS to act as a SAML service provider. 

1. Log in to the DC/OS GUI as a user in the `superuser` group or with the `dcos:superuser` permission.
1. Open the **Settings** -> **Identity Providers** tab.
1. Click the **+** icon in the top right.
1. Click **SAML 2.0**.
1. In the **Provider ID** field, type an identifier for your IdP that can be passed in a URL, i.e., only lowercase alphanumeric and `-` characters. Each SAML IdP that you configure needs a unique identifier. If you have another SAML IdP, you must pick a different identifier for this one. Example: `my-saml-idp`.
1. Type a descriptive name for the IdP in the **Description** field. This string will appear in a button presented to the user to allow them to select the IdP that they want to use. For example, if you type `Fantastic SAML IdP` in the **Description** field, the button will read **Login with Fantastic SAML IdP**.
1. Paste the identity provider XML metadata obtained in the previous section into the **IDP Metadata** field.
1. Copy the URL in the top of your browser, everything before the first slash, and paste it into the **Service Provider Base URL** field.
1. Click **Submit**.

## Obtain the DC/OS callback URL

This procedure uses the Identity and Access Management API (IAM API). For more details on the IAM API, you can visit the [IAM API documentation](/1.13/security/ent/iam-api/).


1. Make a `GET` request to `<your-cluster-URL>/acs/api/v1/auth/saml/providers` using either your browser or curl.
2. It will return a JSON object containing the provider IDs and descriptions of each identity provider you have configured.

    ```json
    {
      "my-saml-idp": "SAML IdP"
    }
    ```

3. Locate your identity provider in the list and copy its provider ID to your clipboard or a text editor. In the previous example, the provider ID is `my-saml-idp`.
4. Make a `GET` request to `<your-cluster-URL>/acs/api/v1/auth/saml/providers/{provider-id}/acs-callback-url`, replacing `{provider-id}` with the provider ID you obtained in the previous step.
5. This request returns the callback URL.

    ```json
    {
      "acs-callback-url": "https://me-9w7g-elasticl-3tifi04qqdhz-692669367.us-west-2.elb.amazonaws.com/acs/api/v1/auth/saml/providers/my-saml-idp/acs-callback"
    }
    ```

6. Copy this value to your clipboard or a text editor.

## Provide the callback URL

1. Click to open the **Configuration** tab in the OneLogin dashboard.
2. Paste the callback URL obtained in the previous procedure into the following three fields: **Recipient**, **ACS (Consumer) URL Validator**, and **ACS (Consumer) URL**.
3. Paste your cluster URL into the **Audience** field. Append the following to it: `/acs/api/v1/auth/saml/providers/{provider-id}/sp-metadata`.
4. Replace `{provider-id}` with your provider ID. Example, `https://me-9w7g-elasticl-3tifi04qqdhz-692669367.us-west-2.elb.amazonaws.com/acs/api/v1/auth/saml/providers/my-saml-idp/sp-metadata`.
5. Click **Save**.

## Verify the connection

1. Clear your cookies or start a new browser session.
2. Navigate to the login page of the DC/OS GUI.
3. Click on the button of the SAML provider you just configured.
4. You should receive an "Access denied" message from DC/OS.

   <p class="message--note"><strong>NOTE: </strong>This indicates that DC/OS verified your account with the third party provider and imported it into DC/OS. Since your account has no permissions by default, it returns "Access denied."</p>

## Assign permissions

1. Log into the DC/OS GUI as a user with the `dcos:superuser` permission.
2. Locate the email address of the user you just tried to log in as in the **Organization** -> **Users** tab and double-click it.
3. Assign the desired permissions to the account. For more information about assigning permissions, visit the [Permissions](/1.13/security/ent/perms-reference/) documentation.


# Troubleshooting

User logons may fail with the following message.

```
SAML SSO authentication not successful. Could not extract the subject identity from the SAML response.
```

Check to see if the IdP's SAML response includes `urn:oasis:names:tc:SAML:2.0:nameid-format:transient`. DC/OS does not support `urn:oasis:names:tc:SAML:2.0:nameid-format:transient`.
