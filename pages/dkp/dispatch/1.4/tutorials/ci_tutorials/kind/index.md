---
layout: layout.pug
title: Using Kind with Dispatch
navigationTitle: Using Kind with Dispatch
beta: false
menuWeight: 105
excerpt: This tutorial demonstrates how to use a Kind cluster in Dispatch.
---

# Using Kind with Dispatch

[Kind](kind.sigs.k8s.io/) is a tool that allows you to run Kubernetes clusters inside of Docker. This tutorial describes how to run Kind clusters inside of Dispatch to make it easy to test software running on Kubernetes.

## Prerequisites

This tutorial assumes that you have followed the steps on the following pages:

- [Dispatch Installation](../../../install/)

## Create a Dispatchfile

The Dispatch Starlark catalog provides a convenience method that makes it easy to create Docker-in-Docker containers. Using this method, we can easily create a task that starts a kind cluster:

```
#!mesosphere/dispatch-starlark:v0.9
# vi:syntax=python

load("github.com/mesosphere/dispatch-catalog/starlark/stable/docker@0.0.9", "dind_task")

dind_task("test", steps=[
    k8s.corev1.Container(
        name="test",
        args=[
            "sh", "-c", """
curl -Lo kind https://github.com/kubernetes-sigs/kind/releases/download/v0.10.0/kind-linux-amd64
chmod +x kind
./kind create cluster
"""
        ]
    )
])

action(tasks=["test"], on=pull_request())
```

This task fetches the kind CLI and then creates a kind cluster. This task's script can be extended to use the created kind cluster for any necessary testing.

## Custom image

The `dind_task` method uses a custom Dispatch Docker-in-Docker image based on Debian in order to simplify configuration. This image can further be customized by extending the `mesosphere/dispatch-dind:1.4.0` image.

First, create a Dockerfile as `Dockerfile.kind` and push and commit it to your repository:

```
FROM mesosphere/dispatch-dind:1.4.0

RUN curl -Lo kind https://github.com/kubernetes-sigs/kind/releases/download/v0.10.0/kind-linux-amd64 && chmod +x kind && mv kind /usr/bin/kind
```

Then, we can use the kaniko method to build and push our image before it is used by `dind_task`:

```
#!mesosphere/dispatch-starlark:v0.9
# vi:syntax=python

load("github.com/mesosphere/dispatch-catalog/starlark/stable/git@0.0.9", "git_resource")
load("github.com/mesosphere/dispatch-catalog/starlark/stable/pipeline@0.0.9", "image_reference")
load("github.com/mesosphere/dispatch-catalog/starlark/stable/docker@0.0.9", "dind_task")
load("github.com/mesosphere/dispatch-catalog/starlark/stable/kaniko@0.0.9", "kaniko")

git = git_resource("git")

kind = kaniko("build-kind-image", git, "mesosphere/dispatch-dind-kind", dockerfile="Dockerfile.kind", context=".")

dind_task("test", inputs=[kind], steps=[
    k8s.corev1.Container(
        name="test",
        image=image_reference(kind),
        args=[
            "sh", "-c", "kind create cluster"
        ]
    )
])

action(tasks=["test"], on=pull_request())
```

As you can see, we have added the `kaniko` task here to build a Docker image from the `Dockerfile.kind` file that we pushed. Make sure to update the image reference ("mesosphere/dispatch-dind-kind") with one that you control.

Once the `kaniko` task builds the image, it is then leveraged by the "test" task by using the `image_reference()` method to use the built image.
