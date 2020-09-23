---
layout: layout.pug
navigationTitle:  Configure Buildkit with Dispatch
title: Building Docker images with Buildkit in Dispatch
menuWeight: 40
beta: false
excerpt: Building Docker images with Buildkit in Dispatch
---

Buildkit is a cache-efficient, distributed build system for Docker images made by Moby. It is the standard builder used in the Docker daemon, however, it can also be deployed as a service. This tutorial covers how to use the bundled Buildkit instance with Dispatch.

# Prerequisites

* Basic knowledge of git, bash, and Docker.
* A [GitHub](https://github.com/) account.
* Owner permissions for a project hosted on [GitHub](../credentials/index.md#setting-up-github-credentials) or access to create one.
* A Git repository containing a Dockerfile.
* Deploy access to a namespace in Kubernetes cluster.
* Dispatch [CLI installed](../../../install/cli) in the environment.

# Install Dispatch

See [Dispatch Installation](../../../install/) for details.

**Note** When installing Dispatch, be sure to enable the `buildkit.enabled` flag to enable Buildkit.

# Setup repository in Dispatch

See [Setting up a Repository in Dispatch](../repo-setup/) for details.

Add your repository to the Dispatch instance:

```bash
dispatch ci repository create --service-account=team-1
```
# Add a Dispatchfile to git repository

This tutorial uses [starlark](https://docs.bazel.build/versions/master/skylark/language.html) to create a file named `Dispatchfile` that holds the build specification. This is a step-by-step walk-through of creating the `Dispatchfile`:

1. Declare the DSL (Domain Specific Language) syntax for our `Dispatchfile` using shebang:

    ```bash
    #!mesosphere/dispatch-starlark:v0.5
    ```
   This specifies to use version `0.5` of starlark DSL parser.

1.  [Dispatch Catalog](https://github.com/mesosphere/dispatch-catalog) holds syntactic sugar for reusing various starlark functions that makes your `Dispatchfile` smaller and allows you focus on actual testing aspects. 

1. Next, import the following helpers:
    1. `gitResource`: to declare the git repository as a resource that can be sent as input to tasks
    1. `pullRequest`: to declare a condition to trigger the builds whenever a pull request is updated
    1. `buildkit`: to build and publish the Docker image

    ```python
    # Import the gitResource, pullRequest, and kaniko helpers from dispatch catalog
    load("github.com/mesosphere/dispatch-catalog/starlark/stable/pipeline@0.0.4", "gitResource", "pullRequest")
    load("github.com/mesosphere/dispatch-catalog/starlark/stable/buildkit@0.0.4", "buildkit")
    ```
1.  Declare the git resource:

    ```python
    git = gitResource("helloworld-git")
    ```
    Any valid kubernetes resource name can be chosen here.

1.  Declare a task to build and push the Docker image using [buildkit](https://github.com/moby/buildkit/):

    ```python
    # Build and push the docker image
    simple_docker = buildkit("build", git, "$YOURDOCKERUSERNAME/helloworld")
    ```
1.  Define an _Action_ to run the task on every pull request:

    ```python
    action(tasks=["build"], on=pullRequest())
    ```
The entire `Dispatchfile` looks like the following:

`Dispatchfile`:

```python
#!mesosphere/dispatch-starlark:v0.5
# vi:syntax=python

load("github.com/mesosphere/dispatch-catalog/starlark/stable/pipeline@0.0.4", "gitResource", "pullRequest")
load("github.com/mesosphere/dispatch-catalog/starlark/stable/buildkit@0.0.4", "buildkit")

git = gitResource("helloworld-git")

# Build and push the docker image
simple_docker = buildkit("build", git, "$YOURDOCKERUSERNAME/helloworld")

simpleTasks = ["unit-test-simple"]
action(tasks=simpleTasks, on=pullRequest())
```

See full reference of a [Dispatchfile](../../../references/pipeline-config-ref/). After you commit and push the Dispatchfile and then create a pull request to your repository, the image will build.
