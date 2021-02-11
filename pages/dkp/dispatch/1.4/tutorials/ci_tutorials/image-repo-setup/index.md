---
layout: layout.pug
navigationTitle: Configure an Image Repository
title: Setting up an Image Repository in Dispatch
menuWeight: 25
beta: false
excerpt: Configure and set up an image (docker registry) repository for access by Dispatch
---

# Setting up an Image Repository in Dispatch

This is a follow-up guide to [setting up a Repository](../repo-setup) that walks through setting up an ImageRepository in Dispatch. ImageRepository can be used to monitor a Docker registry and trigger Pipelines based on Image related events.

An `ImageRepository` resource can be created using CLI command `dispatch ci image-repository create <...>`. An `ImageRepository` resource is responsible for creating webhooks on a given Docker Registry Image Repository and triggering pipelines based on the events received from the Docker registry webhook.

## Prerequisites
This tutorial assumes that you have done the following:

- [Installed Dispatch](../../../install/)
- [Set up a Repository in Dispatch](../repo-setup) that has a valid Dispatchfile hosting tasks to run on Docker related events
- Set up access to a valid Docker repository with sufficient authentication to [manage webhooks](https://docs.docker.com/docker-hub/webhooks/).

### Setting up a `Dispatchfile` in Repository with Docker image related actions
Consider the following `Dispatchfile` that has a task named `test` that triggers on every `push` to `image` with `tags` matching `["release"]`:

```json
#!mesosphere/dispatch-cue:v0.7
resource "src-git": {
  type: "git"
  param url: "$(context.git.url)"
  param revision: "$(context.git.commit)"
}

task "test": {
  inputs: ["src-git"]

  steps: [
    {
      name: "test"
      image: "golang:1.15.7-buster"
      command: [ "go", "test", "./..." ]
      workingDir: "/workspace/src-git"
    }
  ]
}

actions: [
  {
    tasks: ["test"]
    on image push: {
      tags: ["release"]
    }
  }
]
``` 

Currently, only `push` events from registries are supported. The `tags` field supports globbing and negative matching as well.

### Setting up an `ImageRepository`

To configure Dispatch to listen to incoming Docker events, an `ImageRepository` resource needs to be created. This can be achieved by using the CLI command:

```bash
➜ dispatch ci image-repository create --help
Add an ImageRepository to Dispatch.

Usage:
  dispatch ci image-repository create [flags]

Flags:
      --dispatchfile-git-server string                      The Git server hosting the repository where the Dispatchfile resides. Defaults to the Git remote given by --remote, if the current directory is a Git repository.
      --dispatchfile-path string                            Override the default Dispatchfile path. (default "Dispatchfile")
      --dispatchfile-repository string                      Repository to fetch the Dispatchfile from
      --dispatchfile-repository-scm-secret string           SCM secret to use when fetching the Dispatchfile
      --dispatchfile-revision string                        Revision of Dispatchfile in SCM repo (default "master")
  -h, --help                                                help for create
      --image-repository string                             Set the Docker repository name.
      --image-repository-name string                        Name of the image repository to be created. Name is auto generated if empty.
      --image-repository-secret string                      Secret to use to create Docker webhooks
      --log-storage-rules LogStorageRules                   Json Array of rules specifying underlying log pruning rules.
                                                            Each element of array specifies three values:
                                                            - "maxBuildAge" (in days, minimum 1 day),
                                                            - "maxBuildRuns", and
                                                            - "tasks" (glob expr to match pipeline and tasks). E.g.:
                                                            [
                                                            	{"maxBuildAge": 30, "maxBuildRuns": 100, "tasks": "*"}, // Applies to entire pipeline
                                                            	{"maxBuildAge": 7, "maxBuildRuns": 200, "tasks": "unit-*"} // Applies to task(s) beginning with "unit-"
                                                            ] (default null)
      --pod-template-config-map-key string                  Set the key in ConfigMap to access the pod template (default "default-pod-template")
      --pod-template-config-map-name default-pod-template   Set the name of a ConfigMap containing a key named default-pod-template to override the globally defined pod template for this repository
      --pod-template-config-map-optional                    Specify whether the ConfigMap or its key must be defined (default true)
      --remote string                                       Git remote to look up Github repository from. (default "origin")
      --service-account string                              The service account name to use when creating pipelines.
      --timeout duration                                    Duration after which pipelines fail due to timeout. Default is to use the globally defined timeout.
      --url string                                          If set, uses this URL for the webhook URL instead of detecting from an Ingress rule.

Global Flags:
      --dry-run            Set to only print Tekton YAML but not apply it
  -n, --namespace string   Target namespace in the Kubernetes cluster to use (If empty, this is determined from kubeconfig)
  -o, --output string      Output format to use (default "yaml")
```

The following steps should be completed before creating an `ImageRepository` resource:

- Ensure that the [namespace to be used exists](https:///tutorials/ci_tutorials/repo-setup/#namespaces). 
- Esnure that you have [set up scm credentials](///tutorials/ci_tutorials/credentials/#setting-up-github-credentials) for the service account for Dispatch to access the source control management service on behalf of your account.
- Ensure that you have [set up registry credentials](///tutorials/ci_tutorials/credentials/#setting-up-github-credentials) for the service account for Dispatch to access the registry service on behalf of your account.

After a service account is created and `scm` and `registry` credentials are associated with it using `dispatch ci login github` and `dispatch ci login Docker` respectively, an `ImageRepository` resource can be created using:

```bash
dispatch ci image-repository create --service-account=<service-account> --image-repository <image-repository> --dispatchfile-repository=<dispatchfile-scm-repository>
```
It takes a few minutes for the ImageRepository to be reconciled which results in creation of webhooks on given Docker repository.
