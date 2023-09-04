---
layout: layout.pug
title: Deploying with FluxCD to multiple clusters
navigationTitle: Deploying with FluxCD to multiple clusters
beta: false
menuWeight: 105
excerpt: This tutorial demonstrates how to setup a GitOps application using FluxCD and federation using Kommander.
---

# Deploy a GitOps application using FluxCD with Federation Support

This tutorial demonstrates how to setup a GitOps application using [FluxCD](https://toolkit.fluxcd.io/). In this tutorial, the application will be deployed onto the clusters attached to a Kommander project.

## Prerequisites

This tutorial assumes that you have followed the steps on the following pages:

- [Dispatch Installation](../../../install/)
- [Created a Kommander Project](https://docs.d2iq.com/dkp/kommander/1.3/projects/)

## Setup credentials

First, we need to create credentials that FluxCD can use. Currently this is only supported via the CLI.

Run the CLI command to create a service account and then login:

```
kubectl create secret generic github-secret -o json --dry-run --from-literal=username=$GITHUB_USERNAME --from-literal=password=$GITHUB_TOKEN | \
    jq '{ kind: "FederatedSecret", apiVersion: "types.kubefed.io/v1beta1", metadata: .metadata, spec: { template: .data, placement: { clusterSelector: { matchLabels: {} } } } }' | \
    kubectl apply -f -
```

Replace `$GITHUB_TOKEN` and `$GITHUB_USERNAME` with your Github token and username, respectively.

## Create the repository

Now that we have logged in, we can create the GitOps repository to deploy our application:

```
dispatch cd gitops-repository create --repository-url $REPOSITORY_URL --scm-secret github-secret my-app --federated
```

Replace `$REPOSITORY_URL` with the URL to the repository you want to deploy. You can also set the `--path` flag to deploy from a non-root directory or `--revision` flags to deploy from a non-default directory.

## Checking deployment status

In the previous step, the Dispatch CLI creates a `GitopsRepository` object called `my-app`. Once this object is created, the Dispatch `repository-controller` creates a `FederatedAddon` and `FederatedGitRepository` object. These objects are federated out to the clusters attached to the Kommander project. The `FederatedAddon` creates an `Addon` which installs Flux and the `FederatedGitRepository` creates a `GitRepository` which configures Flux.

Check the `FederatedAddon` and `FederatedGitRepository` to ensure they are deployed:

```
$ kubectl describe federatedaddon flux
Name:         flux
Namespace:    default
Status:
  Conditions:
    Last Transition Time:  2021-01-27T14:18:55Z
    Last Update Time:      2021-01-27T14:18:55Z
    Status:                True
    Type:                  Propagation
```

Now we need to switch to the attached cluster in order to further check the status. We can check the deployment status of Flux by checking the created addon. It will be an addon called `flux` in the same namespace as your application, we should see that the addon is deployed:

```
$ kubectl get addon flux
NAME   READY   STAGE      REVISION
flux   true    deployed   
```

Next, we can check the created `GitRepository`:

```
$ kubectl get gitrepository my-app
NAME     URL                                                     READY   STATUS                                                              AGE
my-app   https://github.com/mesosphere/gitopsdemo.git   True    Fetched revision: master/93fb3583190384c77efbf90730375e1e38387569   19m
```

If your application has not deployed correctly, you can inspect it by using `kubectl describe`, which will show any errors that Flux encountered deploying your application:

```
$ kubectl describe gitrepository my-app
Name:         my-app
Namespace:    default
...
Events:
  Type    Reason  Age                 From               Message
  ----    ------  ----                ----               -------
  Normal  error   12m (x16 over 14m)  source-controller  unable to clone 'https://github.com/mesosphere/gitopsdemo.git', error: remote repository is empty
```
