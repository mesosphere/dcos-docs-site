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

Step 3: Create a YAML file (`github.yaml`) like the following:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: github-client-secret
  namespace: kubeaddons
type: Opaque
stringData:
  client-id: <GITHUB-CLIENT-ID>
  client-secret: <GITHUB-CLIENT-SECRET>
---
apiVersion: dex.mesosphere.io/v1alpha1
kind: Connector
metadata:
  name: github
  namespace: kubeaddons
spec:
  enabled: true
  type: github
  displayName: Github
  github:
    clientSecretRef:
      name: github-client-secret
    redirectURI: "https://<YOUR-CLUSTER-HOST>/dex/callback"
    orgs:
    - name: <GITHUB-ORG-NAME> # e.g., "myorg" for https://github.com/myorg
```

Step 4: Run `kubectl apply -f github.yaml` to deploy the Github connector.

Step 5: As a member of the GitHub organization, visit `https://<YOUR-CLUSTER-HOST>/token` to obtain a token to authenticate `kubectl`.

To only allow users from specific teams in the GitHub organization, see the [Dex GitHub Connector documentation].

### Login using a GitHub Individual account

Login using a GitHub Individual account allows you to provide access to the single user that owns the account.

Step 1: Create a Konvoy cluster.

Step 2: In your GitHub account, [Add a new OAuth app]. For the Authorization callback URL, use `https://<your-cluster-host>/dex/callback`.

Step 3: Create a YAML file (`github.yaml`) like the following:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: github-client-secret
  namespace: kubeaddons
type: Opaque
stringData:
  client-id: <GITHUB-CLIENT-ID>
  client-secret: <GITHUB-CLIENT-SECRET>
---
apiVersion: dex.mesosphere.io/v1alpha1
kind: Connector
metadata:
  name: github
  namespace: kubeaddons
spec:
  enabled: true
  type: github
  displayName: Github
  github:
    clientSecretRef:
      name: github-client-secret
    redirectURI: "https://<YOUR-CLUSTER-HOST>/dex/callback"
```

Step 4: Run `kubectl apply -f github.yaml` to deploy the Github connector.

Step 5: Visit `https://<YOUR-CLUSTER-HOST>/token` to obtain a token to authenticate `kubectl`.

[Add a new OAuth app]: https://developer.github.com/apps/building-oauth-apps/creating-an-oauth-app/
[Dex GitHub Connector documentation]: https://github.com/dexidp/dex/blob/master/Documentation/connectors/github.md
