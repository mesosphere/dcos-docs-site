---
layout: layout.pug
navigationTitle: Connect to Google Accounts
title: Connect to Google Accounts
menuWeight: 31
excerpt: Connect your Konvoy cluster to Google Accounts
beta: false
enterprise: false
---

## How to connect Konvoy to Google Accounts

This guide shows how to configure your Konvoy cluster so that users can log in with Google Accounts credentials via single sign-on.

This requires your Konvoy cluster to be reachable via a public DNS name. In this example let's say this is `https://<YOUR-CLUSTER-HOST>/`

### Step 1: set up Google project and Google OAuth app

This step creates an OpenID Connect identity provider served by Google Accounts.

1. Go to [Google's developer console] and create a project.
2. Select that project.
3. Select `OAuth consent screen` in the sidebar.
4. Configure the OAuth consent screen. Make sure to configure `Authorized domains` with the publicly reachable DNS name for your cluster, i.e. `<YOUR-CLUSTER-HOST>` in this example.
5. Save the `OAuth consent screen` configuration.
6. Select `Credentials` in the sidebar.
7. Select `Create credentials` and create an `OAuth client ID`. Set its `Application type` to `Web application`.
8. Under `Authorized redirect URIs` add `https://<YOUR-CLUSTER-HOST>/dex/callback`.
9. Select `Create`. Write down the client ID and the client secret. These are used in the next step.

### Step 2: add OpenID Connect (OIDC) connector

Create a YAML file (`oidc.yaml`) with the following contents:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: oidc-client-secret
  namespace: kubeaddons
type: Opaque
stringData:
  client-id: <CLIENT-ID>
  client-secret: <CLIENT-SECRET>
---
apiVersion: dex.mesosphere.io/v1alpha1
kind: Connector
metadata:
  name: google
  namespace: kubeaddons
spec:
  enabled: true
  type: oidc
  displayName: Google Accounts
  oidc:
    issuer: https://accounts.google.com
    clientSecretRef:
      name: oidc-client-secret
    redirectURI: "https://<YOUR-CLUSTER-HOST>/dex/callback"
    userIDKey: email
    userNameKey: email
```

Replace `<CLIENT-ID>` and `<CLIENT-SECRET>` with the values from step 1, and replace `<YOUR-CLUSTER-HOST>` with your cluster's DNS name.

Create the resources defined in the file:

```bash
kubectl apply -f oidc.yaml
```

### Step 4: log in

Browse to `https://<YOUR-CLUSTER-HOST>/token` and select `Log in with Google Accounts`, then follow the login flow.

[Google's developer console]: https://console.developers.google.com
