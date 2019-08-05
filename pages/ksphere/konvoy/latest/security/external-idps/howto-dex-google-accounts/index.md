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

This requires your Konvoy cluster to be reachable via a public DNS name. In this example let's say this is `https://<public-cluster-dns-name>/`

### Step 1: set up Google project and Google OAuth app

1. Go to [Google's developer console] and create a project.
2. Select that project.
3. In the `Credentials` tab of that project start with setting up the `OAuth consent screen`.
4. Here it is important to configure `Authorized domains`: add the DNS name via which your Konvoy cluster is publicly reachable, i.e. `<public-cluster-dns-name>` in this example.
5. Save the `OAuth consent screen` configuration.
6. Press `Create credentials`, select `OAuth client ID`, and then `Web application`.
7. Under `Authorized redirect URIs` insert `https://<public-cluster-dns-name>/dex/callback`.
8. Save the configuration and note down the client ID and the client secret.

### Step 2: modify Konvoy `cluster.yaml`

In step 1 you have created an OpenID Connect identity provider served by Google Accounts.

Now modify your Konvoy cluster's main configuration file `cluster.yaml` for adding the Dex connector configuration corresponding to that OpenID Connect provider.

See below for an example (and fill in your client ID, client secret, and `<public-cluster-dns-name>`):

```yaml
    - name: dex
      enabled: true
      values: |
        config:
          connectors:
          - type: oidc
            id: google
            name: Google Accounts
            config:
              issuer: https://accounts.google.com
              clientID: <CLIENT-ID>
              clientSecret: <CLIENT-SECRET>
              redirectURI: https://<public-cluster-dns-name>/dex/callback
              userIDKey: email
              userNameKey: email
```

### Step 3: reconfigure the Konvoy cluster

If you already have a Konvoy cluster running please re-configure Dex in that cluster.
Running `konvoy up` again should achieve that goal.
If that does not take effect then do a `konvoy reset` followed by another `konvoy up`.

### Step 4: log in

Visit `https://<public-cluster-dns-name>/token` and initiate a login flow.
On the login page choose the `Log in with Google Accounts` button, and follow the login flow.

[Google's developer console]: https://console.developers.google.com
