---
layout: layout.pug
navigationTitle:  Starlark Reference
title: Starlark Reference
menuWeight: 80
beta: false
excerpt: Reference Guide for Configuring Dispatch pipelines with Starlark.
---


# Starlark reference

[Starlark](https://github.com/bazelbuild/starlark) is a configuration language originally developed for use in the Bazel build tool which is based on Python. Using Starlark, you can take advantage of language features you're used to in regular development (loops, user defined functions, conditionals, modules, testing, editor integrations, etc). Additionally, the Dispatch project provides a basic standard library that can make it simpler to define pipelines.

See the [repository setup guide](../repo_setup/) and the [pipeline reference](../pipeline-configuration/) for complete documentation on configuring your pipeline.

## Unit testing

Any method that starts with `test_` in your Dispatchfile is run immediately after parsing the Dispatchfile. This allows you to write tests that verify your methods as well as the formation of your pipeline.

```sh
#!starlark

task("test", steps=[k8s.corev1.Container(
    name="test",
    image="golang:1.13.0-buster",
    command=["go", "test", "./..."],
    workingDir="/workspace",
    resources = k8s.corev1.ResourceRequirements(
        limits = {
            "cpu": k8s.resource_quantity("1000m"),
            "memory": k8s.resource_quantity("8Gi")
        }
    )
)])

def test_task(ctx):
    test_pipeline = p.Pipeline()
    task("test", steps=[k8s.corev1.Container(name="test")], pipeline=test_pipeline)

    if test_pipeline.tasks["test"].steps[0].name != "test":
        fail("invalid task output")
```

## Dispatch Starlark Standard Library Methods

Dispatch provides a number of standard library methods that can be used to simplify pipeline definition. In addition to the Dispatch standard library, the entire [Starlark standard library](https://docs.bazel.build/versions/master/skylark/language.html) is also available for use.

Most methods have an optional `pipeline` parameter that can be used for passing in pipelines other than the main pipeline object for use in unit tests (see [unit testing](#Unit_testing)). If not specified, it defaults to the global pipeline object.

### Kubernetes helpers

#### k8s.resource_quantity

`k8s.resource_quantity(quantity)`

Allows defining a Kubernetes resource quantity for use in a Kubernetes limit or request.

Example usage:

```sh
task("test", inputs=["git"], steps=[k8s.corev1.Container(
    name="test",
    image="golang:1.13.0-buster",
    command=["go", "test", "./..."],
    workingDir="/workspace/git",
    resources = k8s.corev1.ResourceRequirements(
        limits = {
            "cpu": k8s.resource_quantity("1000m"),
            "memory": k8s.resource_quantity("8Gi")
        }
    )
)])
```

### Task helpers

#### task

`task(name, pipeline=None, **kwargs)`

Defines a new task in a pipeline.

Example usage:

```sh
task("test", inputs=["git"], steps=[k8s.corev1.Container(
    name="test",
    image="golang:1.13.0-buster",
    command=["go", "test", "./..."],
    workingDir="/workspace/git"
)])
```

#### dindTask

`dindTask(name, pipeline=None, **kwargs)`

Defines a new docker-in-docker task in a pipeline. The steps are run in the default `mesosphere/dispatch-dind` image unless an alternative image is specified.

Example usage:

```sh
dindTask("test", inputs=["git"], steps=[k8s.corev1.Container(
    name="test",
    command=["docker", "run", "-v", "/workspace/git:/workspace/git", "-w", "/workspace/git", "golang:1.13.0-buster", "go", "test", "./..."],
)])
```


### Resource helpers

#### resource

`resource(name, pipeline=None, **kwargs)`

Defines a new resource in a pipeline.

Example usage:

```sh
resource("git", params={
    "url": "$(context.git.url)",
    "revision": "$(context.git.commit)"
})
```

#### gitResource

`gitResource(name, url, revision, pipeline=None)`

Define a new git resource in a pipeline.

Example usage: `gitResource("git", url="$(context.git.url)", revision="$(context.git.commit)")`

#### imageResource

`imageResource(name, url, digest, pipeline=None)`

Define a new image resource in a pipeline.

Example usage: `imageResource("my-image", url="mesosphere/dispatch:latest")`

### Action helpers

#### action

`action(pipeline=None, **kwargs)`

Defines a new action in a pipeline.

Example usage: `action(tasks = ["test"], on = p.Condition(push=p.PushCondition(branches = ["master"])))`

#### push

`push(**kwargs)`

A sugar function for creating a new push condition.

Example usage: `action(tasks = ["test"], on = push(branches = ["master"]))`

#### pullRequest

`pullRequest(**kwargs)`

A sugar function for creating a new pull request condition.

Example usage: `action(tasks = ["test"], on = pullRequest(chatops=["build"]))`
