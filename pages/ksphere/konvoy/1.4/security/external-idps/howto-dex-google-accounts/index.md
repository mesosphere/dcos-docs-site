---
layout: layout.pug
navigationTitle: Connect to Google Accounts
title: Connect to Google Accounts
menuWeight: 10
excerpt: Connect your Konvoy cluster to Google Accounts
enterprise: false
---

## How to connect Konvoy to Google Accounts

This guide shows how to configure your Konvoy cluster so that users can log in with Google Accounts credentials via single sign-on.

This requires your Konvoy cluster to be reachable via a public DNS name. In this example let's say this is `https://<YOUR-CLUSTER-HOST>/`

### Step 1: set up Google project and Google OAuth app

1. Go to [Google's developer console] and create a project.
2. Select that project.
3. In the `Credentials` tab of that project start with setting up the `OAuth consent screen`.
4. Here it is important to configure `Authorized domains`: add the DNS name via which your Konvoy cluster is publicly reachable, i.e. `<YOUR-CLUSTER-HOST>` in this example.
5. Save the `OAuth consent screen` configuration.
6. Press `Create credentials`, select `OAuth client ID`, and then `Web application`.
7. Under `Authorized redirect URIs` insert `https://<YOUR-CLUSTER-HOST>/dex/callback`.
8. Save the configuration and note down the client ID and the client secret.

### Step 2: add OpenID Connect (OIDC) connector

In step 1 you have created an OpenID Connect identity provider served by Google Accounts.

Now create a YAML file (`oidc.yaml`) like the following:

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

And then run the following command:

```bash
kubectl apply -f oidc.yaml
```

### Step 4: log in

Visit `https://<YOUR-CLUSTER-HOST>/token` and initiate a login flow.
On the login page choose the `Log in with Google Accounts` button, and follow the login flow.

[Google's developer console]: https://console.developers.google.com
