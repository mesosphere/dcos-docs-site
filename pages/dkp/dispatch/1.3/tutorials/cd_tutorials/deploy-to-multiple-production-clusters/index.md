---
layout: layout.pug
title: Deploy an application to multiple production clusters
navigationTitle: Deploy an application to multiple production clusters
beta: false
menuWeight: 105
excerpt: This tutorial describes how to deploy an application to multiple production clusters.
---

# Deploy an application to multiple production clusters

## Prerequisites

This tutorial builds upon the following tutorials and assumes you have met their prerequisites and
have followed them to completion:
- [Deploy an application to multiple environments](../deploy-application-to-multiple-environments/)

## Introduction

In this tutorial you configure a "hello-world" application to deploy a "production" version of the application to multiple production clusters.

## Add the clusters to ArgoCD

In order to manage the staging and production clusters, ArgoCD needs access to those clusters. Add the clusters to ArgoCD:

List the Kubernetes cluster contexts that are configured in your local Kubernetes configuration file:

```sh
dispatch gitops cluster add --list-available
```

You will see output looking something like this:

```sh
CURRENT  NAME                         CLUSTER         SERVER
         staging-admin@staging        staging         https://staging.example.com:6443
         admin@prod-us-east-1         prod-us-east-1  https://us-east-1.production.example.com:6443
         admin@prod-us-west-1         prod-us-west-1  https://us-west-1.production.example.com:6443
         admin@prod-us-west-2         prod-us-west-2  https://us-west-2.production.example.com:6443
*        dispatch-admin@dispatch      dispatch    https://dispatch-ci.example.com:6443
```

In this example output, the asterisk (`*`) indicates that `dispatch-admin@dispatch` is the currently active Kubernetes cluster context. There is also a `storage-admin@staging` context which is the staging cluster, and three production clusters called `prod-us-east-1`, `prod-us-west-1` and `prod-us-west-2`, respectively.

Add the three production clusters passing their Kubernetes context name to the `dispatch gitops cluster add` command:

```sh
dispatch gitops cluster add admin@prod-us-east-1
dispatch gitops cluster add admin@prod-us-west-1
dispatch gitops cluster add admin@prod-us-west-2
```

At this point, the three production clusters have been added to ArgoCD.

The add command uses the provided context to set up a clusterrole, clusterrolebinding and serviceaccount for ArgoCD itself to use when administering application deployed to these clusters. ArgoCD stores the tokens associated with these administration serviceaccount as secrets in the same cluster in which Dispatch is running.

## The GitOps repository

The "hello-world-gitops" GitOps repository currently has the following structure:

```bash
├── production
│   ├── application.yaml
│   └── application.yaml.tmpl
└── staging
    ├── application.yaml
    └── application.yaml.tmpl
```

In this example there are three clusters: one in the AWS `us-east-1` region, the second in the `us-west-1` region and the third in the `us-west-2` region.

Add a new directory for every production cluster you want to deploy your application to.

```bash
mkdir ./production/us-east-1
mkdir ./production/us-west-1
mkdir ./production/us-west-2
```

Copy the `application.yaml` and `application.yaml.tmpl` files from your `./production/` directory to the per-cluster subdirectories:

```bash
cp ./production/*.yaml* ./production/us-east-1/
cp ./production/*.yaml* ./production/us-west-1/
cp ./production/*.yaml* ./production/us-west-2/
```

Remove the old `application.yaml` and `application.yaml.tmpl` files that are no longer being used now that the single production cluster has been separated into into multiple ones.

```bash
rm ./production/application.yaml
rm ./production/application.yaml.tmpl
```

Commit these changes to your GitOps repository and push them to your remote repository.

Your GitOps repository is now configured to deploy your application to all three clusters.

## The application repository

The "hello-world" application's Dispatchfile is already correctly configured.

The `deploy` task, defined in the Dispatchfile, currently looks as follows:

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

The `-filepath=$(context.git.branch)/**.yaml.tmpl` option tells the `update-gitops-repo` utility to compile all `.yaml.tmpl` file anywhere in the `$(context.git.branch)/` directory tree. When the CI build is executing for the `staging` branch, the `staging/application.yaml.tmpl` template file will be compiled and the output stored in `staging/application.yaml`. When the CI build executes for the `production` branch, the `production/us-east-1/application.yaml.tmpl`, `production/us-west-1/application.yaml.tmpl` and `production/us-west-2/application.yaml.tmpl` files will be compiled and the output written to their respective `application.yaml` files.

Each build of the `staging` or `production` branches will execute the `deploy` task, as is specified in the `actions` section at the bottom of the Dispatchfile.

## Setup applications in ArgoCD

Use the Dispatch CLI to create the `hello-world-prod-us-east-1`, `hello-world-us-west-1`, and `hello-world-us-west-2` applications.

List the available clusters so can pick the staging one.

```sh
dispatch gitops cluster list
```

Copy the URL corresponding to each production cluster from the SERVER column and pass it to the `--dest-server=` option in the following command.

```sh
dispatch gitops app create hello-world-prod-us-east-1 --repository=https://github.com/your-github-user/cicd-hello-world-gitops --path=productionus-east-1 --dest-server=https://prod-us-east-1.staging.example.com:6443/ --service-account=team-1
dispatch gitops app create hello-world-prod-us-west-1 --repository=https://github.com/your-github-user/cicd-hello-world-gitops --path=productionus-west-1 --dest-server=https://prod-us-west-1.staging.example.com:6443/ --service-account=team-1
dispatch gitops app create hello-world-prod-us-west-2 --repository=https://github.com/your-github-user/cicd-hello-world-gitops --path=productionus-west-2 --dest-server=https://prod-us-west-2.staging.example.com:6443/ --service-account=team-1
```

## Verify your installation

Open up the ArgoCD UI at https://your-dispatch-cluster-url/dispatch/argo-cd and view the hello-world-prod-us-east-1, -west-1, and -west-2 applications to check that they are both healthy and synchronized.

Next, open up your browser to https://prod-us-east-1.example.com/hello-world, https://prod-us-west-1.example.com/hello-world and https://prod-us-west-2.example.com/hello-world URLs, substituting the real cluster URLs. Confirm that all three applications are displaying correctly.

## Deploy new changes to production, then push them to production.

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

Once the master branch passes CI, push the new change to `production`, and deploy the new version to all three production clusters, by merging the master branch into the `production` branch and pushing the updated `production` branch to GitHub.

First, get the latest master branch code from GitHub:

```sh
git checkout master
git pull
```

Next, merge master into the production branch as follows:

```sh
git checkout production
git merge master
git push -u origin production
```

This will trigger another round of CI, this time for the production branch. You can watch the build progress in the Tekton UI. Once it completes, you'll notice that it ran the "deploy" task and that a new pull request has been created against your GitOps repository. This pull request updates the image digest of the application.yaml files in the `production/*/` subdirectories.

Merge the pull request, then visit the hello-world-us-east-1 application in the ArgoCD UI and watch the changes roll out. Once the hello-world-us-east-1 application has been synchronized, visit https://prod-us-east-1.example.com/hello-world to see the new change has been rolled out to the production clusters.

## Conclusion

This tutorial describes a practical strategy for deploying the same version of an application, e.g., production, to different multiple clusters.
