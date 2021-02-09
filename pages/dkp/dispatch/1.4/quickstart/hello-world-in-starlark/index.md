---
layout: layout.pug
navigationTitle: Helloworld in Starlark
title: Setting up Helloworld on GitHub in Starlark
menuWeight: 50
beta: false
excerpt: Using Starlark, configure and set up a code repository for access by Dispatch, including configuring a Dispatchfile
---

This topic provides a step-by-step tutorial for setting up dispatch and getting your first successful cloud native CI build on your GitHub repository. It will leverage the Starlark front end language.

# Prerequisites

* Some basic knowledge of git, bash, and Docker.
* A [GitHub](https://github.com/) account.
* Owner permissions for a project hosted on [GitHub](../../tutorials/ci_tutorials/credentials/) or access to create one.
* Deploy access to a namespace in Kubernetes cluster.
* Dispatch [CLI installed](../../install/cli/) in the environment.

# Setup a git repository

## Initialize a git repository

Begin by creating a [new repository on GitHub](https://github.com/new) and clone it locally. You may skip this if you intend to use an existing repository on GitHub. Throughout the rest of this tutorial, this repository is named `helloworld`.

For the purposes of this tutorial, focus on creating a CI check that uses a Docker image to test the source code. This tutorial assumes the Docker image is testing the `golang` source code present in the repository but this can be replaced with any other Docker image trivially.

Go to the directory where you've cloned the repository
```bash
cd helloworld
```

Add some golang source and test files:

`main.go`:

```go
package main

import "fmt"

func main() {
	fmt.Printf("Hello %v!", World())
}

func World() string {
	return "World"
}
```

`main_test.go`:

```go
package main

import (
	"testing"
)

func Test_World(t *testing.T) {
	actual := World()
	if actual != "World" {
		t.Fail()
	}
}
```

If you have `go` in the environment, you can verify that the above code works using `go test -v ./...`.

For the sake of this tutorial, we can add a simple `Dockerfile` that builds from the base `golang` image to run the tests. Create this dockerfile:

`Dockerfile`:

```dockerfile
FROM golang:1.14.0

ADD main.go /test/main.go
ADD main_test.go /test/main_test.go
```

In the later sections, we will setup CI infrastructure to run the tests on every pull request. As a side note, real life test scripts are much more complicated (obviously!) such as launching a kind cluster and running some tests on the cluster. The focus of this tutorial is to demonstrate the ability to run a simple CI build and this should be extendable to more complicated tests.

# Install Dispatch

[Refer to this guide for install options](../../install/).

By default, Dispatch installs to `dispatch` namespace and can be overridden during install time. This tutorial assumes Dispatch is installed to `dispatch` namespace.

Rest of the tutorial assumes you are working with `default` namespace for pipelines. Add a `--namespace` flag to commands as applicable if you are  working with a different namespace.

# Setup credentials & Service accounts

Refer to this guide on setting up [credentials](../../tutorials/ci_tutorials/credentials/).

For the purposes of this tutorial, you need at least Github & Docker credentials. At the bare minimum, you should have executed (with appropriate names):

1. Create a service account named team-1

    ```bash
    dispatch serviceaccount create team-1
    ```

1. Create a Docker credential

    ```bash
    dispatch login docker --service-account team-1
    ```

1. Create a github credential

    ```bash
    dispatch login github --service-account team-1 --user $YOURGITHUBUSERNAME --token $YOURGITHUBTOKEN
    ```

	<p class="message--note">NOTE: </strong>If your Kubernetes cluster endpoint presents a self-signed TLS certificates you must pass `--insecure-webhook-skip-tls-verify` to the `login github` command, otherwise GitHub will refuse to deliver webhook events to Dispatch.</p>


1. Create a git SSH credential __only__ if you want to be able to build locally

    ```bash
    dispatch login git --service-account team-1 --private-key-path $SSH_KEY_PATH
    ```

# Setup repository in Dispatch

[Refer to this guide for repo setup](../../tutorials/ci_tutorials/repo-setup/).

At the least, you should execute the following:

```bash
dispatch ci repository create --service-account=team-1
```

In the next section, we are going to define the build specification in a file named `Dispatchfile`

# Adding a Dispatchfile to git repository

In this tutorial, we are going to use [Starlark](https://docs.bazel.build/versions/master/skylark/language.html) and create a file named `Dispatchfile` which holds our build specification. This is a step-by-step walk-through of creating our `Dispatchfile`:

1. Declare the DSL (Domain Specific Language) syntax for our `Dispatchfile` using shebang:

    ```bash
    #!mesosphere/dispatch-starlark:v0.5
    ```

   This specifies to use version `0.5` of Starlark DSL parser.

1.  [Dispatch Catalog](https://github.com/mesosphere/dispatch-catalog) holds syntactic sugar for reusing various Starlark functions that makes your `Dispatchfile` smaller and lets you focus on actual testing aspects. Let's import the following helpers:
    1. `gitResource`: to declare the git repository as a resource that can be sent as input to tasks
    1. `pullRequest`: to declare a condition to trigger the builds whenever a pull request is updated
    1. `kaniko`: to build and publish the Docker image

    ```python
    # Import the gitResource, pullRequest, and kaniko helpers from dispatch catalog
    load("github.com/mesosphere/dispatch-catalog/starlark/stable/pipeline@0.0.4", "gitResource", "pullRequest")
    load("github.com/mesosphere/dispatch-catalog/starlark/stable/kaniko@0.0.4", "kaniko")
    ```

1.  Declare the git resource:

    ```python
    git = gitResource("helloworld-git")
    ```

    Any valid Kubernetes resource name can be chosen here.

1.  Declare a task to build and push the Docker image using [kaniko](https://github.com/GoogleContainerTools/kaniko):

    ```python
    # Build and push the docker image
    simple_docker = kaniko(git, "$YOURDOCKERUSERNAME/helloworld")
    ```

1.  Declare a task using above Docker image to run tests:

    ```python
    # This is a simple unit test that uses the base golang image to validate the go source code
    task("unit-test-simple",
        inputs=[simple_docker],
        steps=[k8s.corev1.Container(
            name="unit-test-simple",
            image="$YOURDOCKERUSERNAME/helloworld:$(context.build.name)",
            workingDir="/test",
            command=["go", "test", "./..."])])
    ```

    We specified the `workingDir` as `/test` as that is the location of our source code. Access to repo source code can be gained by using `git` as one of the inputs and setting `workingDir` to `"/workspace/{}".format(git)`.

1.  Define an _Action_ to run the task on every pull request:

    ```python
    simpleTasks = ["unit-test-simple"]
    action(tasks=simpleTasks, on=pullRequest())
    action(tasks=simpleTasks, on=pullRequest(chatops=["test"]))
    ```

    The first action triggers the `unit-test-simple` task upon creating/updating a pull request. The second action triggers `unit-test-simple` whenever a comment `/test` is made on the pull request.

Hence, The entire `Dispatchfile` becomes:

`Dispatchfile`:

```python
#!mesosphere/dispatch-starlark:v0.5
# vi:syntax=python

load("github.com/mesosphere/dispatch-catalog/starlark/stable/pipeline@0.0.4", "gitResource", "pullRequest")
load("github.com/mesosphere/dispatch-catalog/starlark/stable/kaniko@0.0.4", "kaniko")

git = gitResource("helloworld-git")

# Build and push the docker image
simple_docker = kaniko(git, "$YOURDOCKERUSERNAME/helloworld")

# Use the pushed docker image to run CI
task("unit-test-simple",
    inputs=[simple_docker],
    steps=[k8s.corev1.Container(
        name="unit-test-docker",
        image="$YOURDOCKERUSERNAME/helloworld:$(context.build.name)",
        workingDir="/test",
        command=["go", "test", "./..."])])

simpleTasks = ["unit-test-simple"]
action(tasks=simpleTasks, on=pullRequest())
action(tasks=simpleTasks, on=pullRequest(chatops=["build"]))
```

You can use the Dispatch CLI to validate above Dispatchfile:

```bash
dispatch ci render --file=Dispatchfile
```

which would result in an output similar to:

```yaml
...
#!yaml
# vi:syntax=yaml

actions:
- "on":
    pull_request: {}
  tasks:
  - unit-test-simple
- "on":
    pull_request:
      chatops:
      - build
  tasks:
  - unit-test-simple
resource:
  $YOURDOCKERUSERNAME-helloworld:
    param:
      digest: $(inputs.resources.$YOURDOCKERUSERNAME-helloworld.digest)
      url: $YOURDOCKERUSERNAME/helloworld:$(context.build.name)
    type: image
  helloworld-git:
    param:
      revision: $(context.git.commit)
      url: $(context.git.url)
    type: git
task:
  $YOURDOCKERUSERNAME-helloworld:
    inputs:
    - helloworld-git
    outputs:
    - $YOURDOCKERUSERNAME-helloworld
    steps:
    - args:
      - --destination=$YOURDOCKERUSERNAME/helloworld:$(context.build.name)
      - --context=/workspace/helloworld-git/
      - --oci-layout-path=/workspace/output/$YOURDOCKERUSERNAME-helloworld
      - --dockerfile=/workspace/helloworld-git/Dockerfile
      image: gcr.io/kaniko-project/executor
      name: docker-build
      resources: {}
  unit-test-simple:
    inputs:
    - $YOURDOCKERUSERNAME-helloworld
    steps:
    - command:
      - go
      - test
      - ./...
      image: $YOURDOCKERUSERNAME/helloworld:$(context.build.name)
      name: unit-test-docker
      resources: {}
      workingDir: /test
```

See full reference of a [Dispatchfile](../../references/pipeline-config-ref/).

After setting up Dispatch, adding relevant credentials, and creating `helloworld` repository, we can move on to running our CI.

# Continuous Integration in Action

After creating your `Dispatchfile`, you can push it to a branch of your choice and create a pull request against default branch (or any branch).
When you executed the `dispatch ci create repository` command in earlier sections, `Dispatch` repository controller created a [webhook in your GitHub repository](https://developer.github.com/webhooks/). This webhook enables Dispatch to receive events (such as pull request events) from GitHub. When you create a Pull Request, a `PullRequest` event is posted to `Dispatch` and this in turn triggers a pipeline to run `unit-test-simple` task as declared in your `Dispatchfile`. If you make a comment on the Pull Request that starts with `/test` then this would have a similar effect (useful in cases where you want to rerun a flaky CI test). Make such a comment and the build status should be reflected shortly on your Pull Request as soon as the build is scheduled. See [the troubleshooting guide](../../troubleshooting/) if you are having problems.

You can look at [logs](../../operations/logging/) of various Dispatch components as well as pipelines.

# Advanced reading

There may be cases where you may need to have Docker runtime in your CI builds (e.g.: launch a [kind cluster](https://kind.sigs.k8s.io/docs/user/quick-start/) and run tests on it). The [`dindTask`](https://github.com/mesosphere/dispatch-catalog/blob/0.0.4/starlark/stable/docker.star#L19) provided in [dispatch-catalog](https://github.com/mesosphere/dispatch-catalog/) can be used exactly for this purpose. As an example, the `unit-test-simple` task from earlier can be rewritten as follows:

```python
#!mesosphere/dispatch-starlark:v0.5

# Import the predefined Docker-in-Docker task from Dispatch Catalog.
load("github.com/mesosphere/dispatch-catalog/starlark/stable/docker@0.0.4", "dindTask")

# This is the same test as above rewritten using Docker-in-Docker image
dindTask("unit-test-dind",
    inputs=[git], steps=[k8s.corev1.Container(
    name="go-test",
    args=[
        "docker",
        "run",
        "--volume", "/workspace/{}:/workspace/{}".format(git, git),
        "--workdir", "/workspace/{}".format(git),
        "golang:1.14.0",
        "go", "test", "./..."])])
```

This is similar to previous task definition except that this runs [mesosphere/dispatch-dind:1.0.0](https://github.com/mesosphere/dispatch-catalog/blob/0.0.4/starlark/stable/docker.star#L39) Docker-in-Docker image. You can override the image by using `image` field in `Container` definition above and run any arbitrary scripts that require Docker. Explore various other predefined constructs from [dispatch-catalog](https://github.com/mesosphere/dispatch-catalog/) and contribute your own!
