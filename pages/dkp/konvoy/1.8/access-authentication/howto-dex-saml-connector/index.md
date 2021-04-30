---
layout: layout.pug
navigationTitle: SAML
title: SAML connector
menuWeight: 33
excerpt: Connect your Konvoy cluster to an Idp using SAML
beta: false
enterprise: false
---

## How to connect Konvoy to an IdP using SAML

This guide shows how to configure your Konvoy cluster to use SAML to connect to an identity provider (IdP).

Step 1: [Create a Konvoy cluster](/mesosphere/dcos/2.0/administering-clusters/locate-public-agent/).

Step 2: Configure the IdP

You will provide the issuer URL and the Assertion Consumer Service (ACS) or callback URL to your IdP.

The issuer URL points to the authentication endpoint at the service provider (Dex) that issues a request towards the IdP via the user agent.

The issuer URL follows this schema:

```text
https://<your-cluster-host>/dex
```

The ACS URL points to the service provider (Dex) endpoint that will receive SAML assertions issued by the IdP.

The ACS or callback URL will look like this:

```text
https://<your-cluster-host>/dex/callback
```

Depending on the IdP, you may be asked to provide the configuration in some form of an XML snippet - see an example below;

```xml
<?xml version="1.0" encoding="UTF-8"?>
<EntityDescriptor xmlns="urn:oasis:names:tc:SAML:2.0:metadata" entityID="https://<your-cluster-host>/dex">
   <SPSSODescriptor AuthnRequestsSigned="false" WantAssertionsSigned="true" protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
      <NameIDFormat>urn:oasis:names:tc:SAML:2.0:nameid-format:persistent</NameIDFormat>
      <AssertionConsumerService index="0" isDefault="true" Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" Location="https://<your-cluster-host>/dex/callback" />
   </SPSSODescriptor>
</EntityDescriptor>
```

Step 3: Modify the `dex` addon in your `cluster.yaml` file:

For this step, you will need to get the following from your IdP:

- single sign-on URL or SAML URL -> `ssoURL`
- base64 encoded, PEM encoded CA certificate -> `caData`
- username attribute name in SAML response -> `usernameAttr`
- email attribute name in SAML response -> `emailAttr`

From step 2 you need:

- issuer URL -> `entityIssuer`
- callback URL -> `redirectURI`

Make sure you base64 encode the contents of the PEM file. As an example, the prefix of the contents will result into this exact base64 prefix:

```text
LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tC[...]
```

Update your `dex` addon configuration:

```yaml
    - name: dex
      enabled: true
      values: |
        config:
          connectors:
          - type: saml
            id: saml
            name: SAML
            config:
              ssoURL: <url for POST request>
              caData: < base64 PEM encoded CA for the IdP server >
              redirectURI: https://<your-cluster-host>/dex/callback
              entityIssuer: https://<your-cluster-host>/dex
              usernameAttr: < user attribute in saml response >
              emailAttr: < email attribute in saml response >
```

Step 4: Modify `traefik-foward-auth` addon in your `cluster.yaml` and add a whitelist

This step is required to give access to a user to ops-portal. For each user, you must [give access to Kubernetes resources](../rbac) and add an entry in the `whitelist` below.

```yaml
   - name: traefik-forward-auth
     enabled: true
     values: |
       traefikForwardAuth:
         allowedUser:
           valueFrom:
             secretKeyRef: null
         whitelist:
         - < allowed email addresses >
```

Step 5: Run `konvoy up` to deploy modified Dex.

Step 6: Visit `https://<your-cluster-host>/ops/landing` to login to ops portal.

Step 7: Select `Launch Console` and follow the authentication steps.
