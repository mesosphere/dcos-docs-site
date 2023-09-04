---
layout: layout.pug
title: Deploying with FluxCD
navigationTitle: Deploying with FluxCD
beta: false
menuWeight: 105
excerpt: This tutorial demonstrates how to setup a GitOps application using FluxCD.
---

# Deploy a GitOps application using FluxCD

This tutorial demonstrates how to setup a GitOps application using [FluxCD](https://toolkit.fluxcd.io/). In this tutorial, the application will be deployed onto the same cluster that Dispatch is installed on.

## Prerequisites

This tutorial assumes that you have followed the steps on the following pages:

- [Dispatch Installation](../../../install/)

## Setup credentials

First, we need to create credentials that FluxCD can use. You can use either the Dispatch interface or the CLI for this.

### Using the CLI

Run the CLI command to create a service account and then login:

```
dispatch serviceaccount create builder
dispatch login github --service-account=builder --token $GITHUB_TOKEN --user $GITHUB_USERNAME
```

Replace `$GITHUB_TOKEN` and `$GITHUB_USERNAME` with your Github token and username, respectively.

The Dispatch CLI will output the name of the Kubernetes secret that was created. Copy this for the next step.

### Using the interface

To login via the web interface, navigate to the Dispatch interface wherever you have it deployed.

Click on the `Continuous Integration (CI)` tab on the sidebar, and then click on the `Secrets` tab. Click `Create Secret` to create a new secret.

Fill in the form to login to your Github, GitLab, or Bitbucket account and copy the name of the secret you created.

## Create the repository

Now that we have logged in, we can create the GitOps repository to deploy our application:

```
dispatch cd gitops-repository create --repository-url $REPOSITORY_URL --scm-secret $SCM_SECRET my-app
```

Replace `$SCM_SECRET` with the secret name from the previous step. Replace `$REPOSITORY_URL` with the URL to the repository you want to deploy. You can also set the `--path` flag to deploy from a non-root directory or `--revision` flags to deploy from a non-default directory.

## Checking deployment status

In the previous step, the Dispatch CLI creates a `GitopsRepository` object called `my-app`. Once this object is created, the Dispatch `repository-controller` creates an `Addon` and `GitRepository` object. The `Addon` object deploys Flux for your application, and the `GitRepository` object configures Flux.

We can check the deployment status of Flux by checking the created addon. It will be an addon called `flux` in the same namespace as your application, we should see that the addon has been deployed:

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
