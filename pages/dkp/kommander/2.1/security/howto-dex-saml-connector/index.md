---
layout: layout.pug
navigationTitle: SAML
title: SAML connector
menuWeight: 33
excerpt: Connect your Kommander cluster to an IdP using SAML
beta: false
enterprise: false
---

## Connect Kommander to an IdP using SAML

This procedure configures your Kommander cluster to use SAML, to connect to an identity provider (IdP).

1.  [Install Kommander](../../install).

1.  Configure the IdP

    Provide the issuer URL and the Assertion Consumer Service (ACS) or callback URL to your IdP. The issuer URL points to the authentication endpoint at the service provider (Dex), which issues a request towards the IdP via the user agent.

    The issuer URL follows this schema:

    ```text
    https://<your-cluster-host>/dex
    ```

    The ACS URL points to the service provider (Dex) endpoint that receives SAML assertions issued by the IdP.

    The ACS or callback URL should look like this:

    ```text
    https://<your-cluster-host>/dex/callback
    ```

    Depending on the IdP, you might be asked to provide the configuration in some form of an XML snippet. See the following example, making sure to replace `<your-cluster-host>` with your URL:

    ```xml
    <?xml version="1.0" encoding="UTF-8"?>
    <EntityDescriptor xmlns="urn:oasis:names:tc:SAML:2.0:metadata" entityID="https://<your-cluster-host>/dex">
        <SPSSODescriptor AuthnRequestsSigned="false" WantAssertionsSigned="true" protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
            <NameIDFormat>urn:oasis:names:tc:SAML:2.0:nameid-format:persistent</NameIDFormat>
            <AssertionConsumerService index="0" isDefault="true" Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" Location="https://<your-cluster-host>/dex/callback" />
        </SPSSODescriptor>
    </EntityDescriptor>
    ```

1.  Modify the `dex` configuration:

    For this step, obtain the following from your IdP:

    - single sign-on URL or SAML URL -> `ssoURL`
    - base64 encoded, PEM encoded CA certificate -> `caData`
    - username attribute name in SAML response -> `usernameAttr`
    - email attribute name in SAML response -> `emailAttr`

    From above you need:

    - issuer URL -> `entityIssuer`
    - callback URL -> `redirectURI`

    Ensure you base64 encode the contents of the PEM file. As an example, the prefix of the contents will result into this exact base64 prefix:

    ```text
    LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tC[...]
    ```

    You can add the configuration as the values field in the `dex` application. An example `dex` configuration provided to the [Kommander CLI’s install command][kommander-install] should look similar to:

    ```yaml
    apiVersion: config.kommander.mesosphere.io/v1alpha1
    kind: Installation
    apps:
      dex:
        values: |
          config:
          connectors:
          - type: saml
              id: saml
              name: SAML
              config:
                ssoURL: < url for POST request >
                caData: < base64 PEM encoded CA for the IdP server >
                redirectURI: https://<your-cluster-host>/dex/callback
                entityIssuer: https://<your-cluster-host>/dex
                usernameAttr: < user attribute in saml response >
                emailAttr: < email attribute in saml response >
    [...]
    ```

1.  Modify the `traefik-foward-auth-mgmt` configuration and add a whitelist:

    This step is required to give access to a user to the Kommander dashboard. For each user, you must [give access to Kubernetes resources](../../operations/access-control/rbac) and add an entry in the `whitelist` below.

    ```yaml
    apiVersion: config.kommander.mesosphere.io/v1alpha1
    kind: Installation
    apps:
    ...
      traefik-forward-auth-mgmt:
        values: |
          traefikForwardAuth:
            allowedUser:
              valueFrom:
                secretKeyRef: null
            whitelist:
            - < allowed email addresses >

    ```

1.  Run `kommander install --installer-config kommander.yaml` to deploy modified `dex`.

1.  Visit `https://<your-cluster-host>/dkp/kommander/dashboard` to login to the Kommander dashboard.

1.  Select `Launch Console` and follow the authentication steps to complete the procedure.

[kommander-install]: ../../install/configuration/
