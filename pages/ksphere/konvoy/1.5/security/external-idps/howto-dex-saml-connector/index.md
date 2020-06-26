---
layout: layout.pug
navigationTitle: SAML
title: SAML connector
menuWeight: 10
excerpt: Connect your Konvoy cluster to an Idp using SAML
enterprise: false
---

## How to connect Konvoy to an Idp using SAML

This guide shows how to configure your Konvoy cluster to use SAML to connect to an Idp.

Step 1: [Create a Konvoy cluster](/mesosphere/dcos/2.0/administering-clusters/locate-public-agent/).

Step 2: Configure the Idp

The metadata file you must upload to your Idp will look similar to:

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
              caData: < base64 PEM encoded CA for the Idp server >
              redirectURI: https://<your-cluster-host>/dex/callback
              entityIssuer: https://<your-cluster-host>/dex
              usernameAttr: < user attribute in saml response >
              emailAttr: < email attribute in saml response >
```

Step 4: Modify `traefik-foward-auth` addon in your `cluster.yaml` to

This step is required to give access to a user to ops-portal

```yaml
   - name: traefik-forward-auth
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
