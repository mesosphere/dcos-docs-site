---
layout: layout.pug
navigationTitle: GitHub OAuth App
title: GitHub OAuth App
menuWeight: 10
excerpt: Connect your Konvoy cluster to a GitHub OAuth App
enterprise: false
---

## How to connect Konvoy to a GitHub OAuth App

This guide shows how to configure your Konvoy cluster so that users can log in with GitHub credentials.

### Login using a GitHub Organization account

Login using a GitHub Organization account allows you to provide access to all members of a GitHub Organization or to members of specific teams within an Organization.

Step 1: Create a Konvoy cluster.

Step 2: In a GitHub organization account, [add a new OAuth app]. For the Authorization callback URL, use `https://<your-cluster-host>/dex/callback`.

Step 3: Modify the `dex` addon in your `cluster.yaml` to

```yaml
    - name: dex
      enabled: true
      values: |
        config:
          connectors:
          - type: github
            # `id` must be unique amongst all connectors
            id: github
            # `name` controls the text displayed for Login with GitHub
            name: GitHub
            config:
              clientID: <GitHub Client ID>
              clientSecret: <GitHub Client Secret>
              redirectURI: https://<your-cluster-host>/dex/callback
              orgs:
                - name: <GitHub Account (e.g. "myorg" for https://github.com/myorg)>
```

Step 4: Run `konvoy up` to deploy modified Dex.

Step 5: As a member of the GitHub organization, visit `https://<your-cluster-host>/token` to obtain a token to authenticate `kubectl`.

To only allow users from specific teams in the GitHub organization, see the [Dex GitHub Connector documentation].

### Login using a GitHub Individual account

Login using a GitHub Individual account allows you to provide access to the single user that owns the account.

Step 1: Create a Konvoy cluster.

Step 2: In your GitHub account, [add a new OAuth app]. For the Authorization callback URL, use `https://<your-cluster-host>/dex/callback`.

Step 3: Modify the `dex` addon in your `cluster.yaml` to

```yaml
    - name: dex
      enabled: true
      values: |
        config:
          connectors:
          - type: github
            # `id` must be unique amongst all connectors
            id: github
            # `name` controls the text displayed for Login with GitHub
            name: GitHub
            config:
              clientID: <GitHub Client ID>
              clientSecret: <GitHub Client Secret>
              redirectURI: https://<your-cluster-host>/dex/callback
```

Step 4: Run `konvoy up` to deploy modified Dex.

Step 5: Visit `https://<your-cluster-host>/token` to obtain a token to authenticate `kubectl`.

[add a new OAuth app]: https://developer.github.com/apps/building-oauth-apps/creating-an-oauth-app/
[Dex GitHub Connector documentation]: https://github.com/dexidp/dex/blob/master/Documentation/connectors/github.md
