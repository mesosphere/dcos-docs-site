---
layout: layout.pug
title: Deploy an application to multiple clusters
navigationTitle: Deploy an application to multiple clusters
beta: false
menuWeight: 105
excerpt: This tutorial describes how to deploy different versions of an application to staging and production environments.
---

# Deploy an application to multiple environments

## Prerequisites

This tutorial assumes that you have followed the steps on the following pages:

- [Dispatch Installation](../../../install/)
- [Setting up a Repository in Dispatch](../../ci_tutorials/repo-setup/)
- [GitOps Based Deployments](../rolling-deployment/)

You must have:
- the "hello-world" and "hello-world-gitops" git repositories checked out.
- the "hello-world" application configured for Dispatch CI (via `dispatch ci repository create`), and
- a "hello-world" application created in ArgoCD (via `dispatch gitops app create hello-world`).

## Introduction

This tutorial modifies the "hello-world" application repository and the accompanying "hello-world-gitops" gitops repository to deploy to separate "staging" and "production" environments.

## Add the clusters to ArgoCD

In order to manage the staging and production clusters, ArgoCD needs access to those clusters. Add two new clusters to ArgoCD (i.e., staging and production) to serve as the two clusters:

List the Kubernetes cluster contexts that are configured in your local Kubernetes configuration file:

```sh
dispatch gitops cluster add --list-available
```

You will see output looking something like this:

```sh
CURRENT  NAME                         CLUSTER     SERVER
         production-admin@production  production  https://production.example.com:6443
         staging-admin@staging        staging     https://staging.example.com:6443
*        dispatch-admin@dispatch      dispatch    https://dispatch-ci.example.com:6443
```

In this example output, the asterisk (`*`) indicates that `dispatch-admin@dispatch` is the currently active Kubernetes cluster context, and that there are two other contexts configured in our Kubernetes configuration file, `production-admin@production` and `staging-admin@staging`.

First, add the staging cluster by passing the `staging-admin@staging` context to the `dispatch gitops cluster add` command:

```sh
dispatch gitops cluster add staging-admin@staging
```

Next, add the production cluster by passing the `production-admin@staging` context to the `dispatch gitops cluster add` command:

```sh
dispatch gitops cluster add production-admin@staging
```

The add command uses the provided context to set up a clusterrole, clusterrolebinding and serviceaccount for ArgoCD itself to use when administering application deployed to these clusters. ArgoCD stores the tokens associated with these administration serviceaccount as secrets in the same cluster in which Dispatch is running.

At this point, both staging and production clusters have been added to ArgoCD. You can verify that by running:

```sh
dispatch gitops cluster list
```

## Adjust the GitOps repository

The staging and production clusters are managed from the same GitOps repository. Instead of having the Kubernetes manifests at the root directory of the GitOps repository, create two new directories: staging and production.

```sh
cd hello-world-gitops/
mkdir staging
mkdir production
```

Next, copy the existing `application.yaml.tmpl` file from the root of the GitOps repository to the new staging and production directories, and remove the existing files from the root directory.

```sh
cp application.yaml.tmpl ./staging/
cp application.yaml.tmpl ./production/
rm application.yaml application.yaml.tmpl
```

Commit these changes to your GitOps repository and push them to your remote repository.

## Adjust the application repository

Update the "hello-world" application's Dispatchfile so the `./staging/application.yaml` file and the `./production/application.yaml` file are updated when the application's `staging` and `production` branches are built, respectively.

In the Dispatchfile, modify the Dispatchfile's `deploy` task as follows:

```cue
task "deploy": {
  inputs: ["docker-image", "gitops-git"]
  steps: [
    {
      name: "update-gitops-repo"
      image: "mesosphere/update-gitops-repo:1.2.0"
      workingDir: "/workspace/gitops-git"
      args: [
        "-git-revision=$(context.git.commit)",
        "-substitute=imageName=your-dockerhub-user/hello-world@$(inputs.resources.docker-image.digest)",
        "-filepath=$(context.git.branch)/**.yaml.tmpl"
      ]
    }
  ]
}
```

The only change is that a new `-filepath` argument is provided that ensures that `update-gitops-repo` will only compile templates in the `staging` directory of the GitOps repository when the `staging` branch of the application repository is being built, and only compile templates in the `production` directory of the GitOps repository when the `production` branch of the application repository is being build.

Modify the Dispatchfile to only trigger the "deploy" task when the `staging` or `production` branches are built. Modify the `actions` section at the bottom of the Dispatchfile as follows:

```cue
actions: [
  {
    tasks: ["build"]
    on push branches: ["master"]
  },
  {
    tasks: ["build", "deploy"]
    on push branches: ["staging", "production"]
  },
  ...
]
```

Commit these changes and push them to your remote application repository and merge them into master.

Create new `staging` and `production` branches from the current `master` branch and push them to GitHub.

```sh
git checkout master
git checkout -b staging
git push -u origin staging
git checkout -b production
git push -u origin production
```

Pushing the two new branches to GitHub will trigger two new builds of your application: one for the staging branch and one for the production branch.

Each build will execute the `deploy` task. The `staging` build will open a new pull request against our GitOps repository to create the `./staging/application.yaml` file. The `production` build will open a new pull request against our GitOps repository to create the `./production/application.yaml` file.

Whenever you push new commits to the `staging` or `production` branches, your application's CI build will build the new docker image, push it to DockerHub, and open a new pull request against our GitOps repository to update the `./staging/application.yaml` or `./production/application.yaml` file with the new docker image digest.

## Setup applications in ArgoCD

Use the Dispatch CLI to create the `hello-world-staging` and `hello-world-production` applications.

First, list the available clusters so can pick the staging one.

```sh
dispatch gitops cluster list
```

Copy the URL corresponding to your staging cluster from the SERVER column and pass it to the `--dest-server=` option in the following command.

```sh
dispatch gitops app create hello-world-staging --repository=https://github.com/your-github-user/cicd-hello-world-gitops --path=staging --dest-server=https://staging.example.com:6443/ --service-account=team-1
```

Next, copy the URL corresponding to your production cluster from the SERVER column of the `cluster list` output above and pass it to the `--dest-server=` option in the following command.

```sh
dispatch gitops app create hello-world-production --repository=https://github.com/your-github-user/cicd-hello-world-gitops --path=production --dest-server=https://production.example.com:6443/ --service-account=team-1
```

## Verify your installation

Open up the ArgoCD UI at https://your-dispatch-cluster-url/dispatch/argo-cd and view the hello-world-staging and hello-world-production applications to check that they are both healthy and synchronized.

Next, open up your browser to https://staging.example.com/hello-world and https://production.example.com/hello-world (substituting the real cluster URLs). Confirm that both applications are displaying correctly. While viewing the hello-world-staging or hello-world-production application in the ArgoCD UI, you can click on the 'punch-out arrow' icon on the "hello-world" Ingress to be taken directly to the respective cluster's hello-world URL.

## Deploy new changes to master, then push them to staging

Open the `main.go` file and modify the message at the very bottom of the file:

```go
// hello responds to the request with a plain-text "Hello, world" message.
func hello(w http.ResponseWriter, r *http.Request) {
  log.Printf("Serving request: %s", r.URL.Path)
  fmt.Fprintf(w, "Hello, world!\n")
  fmt.Fprintf(w, "Version: %s\n", Version)
  fmt.Fprintf(w, "Build time: %s\n", Buildtime)
  fmt.Fprintf(w, "This is an example, it will be deployed to staging first.\n")
}
```

Save the file, commit the change on a feature branch, push the feature branch to GitHub, open a pull request and confirm that CI passes. Once your CI checks all pass, merge the pull request into the master branch.

Wait for the master branch to finish running its CI build. You can watch the master branch CI progress in the Tekton UI by visiting https://dispatch-ci.example.com/dispatch/tekton/ - note the trailing slash. Alternatively, click on the 'view' links for the CI checks shown at the bottom of the pull request page.

Once the master branch passes CI, push the new change to `staging` by merging the master branch into the `staging` branch and pushing the updated `staging` branch to GitHub.

First, get the latest master branch code from GitHub:

```sh
git checkout master
git pull
```

Next, merge master into the staging branch as follows:

```sh
git checkout staging
git merge master
git push -u origin staging
```

This will trigger another round of CI, this time for the staging branch. You can watch the build progress in the Tekton UI. Once it completes, you'll notice that it ran the "deploy" task and that a new pull request has been created against your GitOps repository. This pull request updates the image digest of the application.yaml file in the `staging/` subdirectory.

Merge the pull request, then visit the hello-world-staging application in the ArgoCD UI and watch the changes roll out. Once the hello-world-staging application has been synchronized, visit https://staging.example.com/hello-world to see the new change has been rolled out to the staging application. Then, visit https://production.example.com/hello-world and confirm that the hello-world application is still running the older "stable" version of the hello-world application.

## Conclusion

This tutorial describes a practical strategy for maintaining different versions of the same application, deployed to different environments using GitOps.
