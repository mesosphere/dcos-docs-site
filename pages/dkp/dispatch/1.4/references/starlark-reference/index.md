---
layout: layout.pug
navigationTitle: Starlark Reference
title: Starlark Reference
menuWeight: 80
beta: false
excerpt: Reference Guide for Configuring Dispatch pipelines with Starlark.
---


# Starlark reference

[Starlark](https://github.com/bazelbuild/starlark) is a configuration language originally developed for use in the Bazel build tool which is based on Python. Using Starlark, you can take advantage of language features you are used to in regular development (loops, user defined functions, conditionals, modules, testing, editor integrations, etc). Additionally, the Dispatch project provides a basic standard library that can make it simpler to define pipelines.

See the [repository setup guide](../../tutorials/ci_tutorials/repo-setup/) and the [pipeline reference](../pipeline-config-ref/) for complete documentation on configuring your pipeline.

## Unit testing

Any method that starts with `test_` in your Dispatchfile is run immediately after parsing the Dispatchfile. This allows you to write tests that verify your methods as well as the formation of your pipeline.

```sh
#!mesosphere/dispatch-starlark:v0.5

task("test", steps=[k8s.corev1.Container(
    name="test",
    image="golang:1.15.7-buster",
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

## Closures

The Dispatch version of Starlark has enabled support for nested methods and lambdas. This allows for the construction of methods as you may be used to in Python.

## Importing custom libraries

The Dispatch Starlark frontend supports importing from other Starlark files using the `load()` method. The `load()` method supports specifying Starlark files to include by repository URL. For example, `./starlark/stable/pipeline.star` in the `mesosphere/dispatch-catalog` Github repository can be imported as `github.com/mesosphere/dispatch-catalog/starlark/stable/pipeline`. The import URL is the Git provider address, the repository name, and the path in the repository to load with the `.star` extension removed.

The `load()` method requires two arguments: an import path and a symbol to load. For example, if the following Dispatch library is hosted in the `mesosphere/dispatch` Github repository at `./lib.star`:

```
def resourceRequirements(cpu, memory):
    return k8s.corev1.ResourceRequirements(
        limits = {
            "cpu": k8s.resource_quantity(cpu),
            "memory": k8s.resource_quantity(memory)
        },
        requests = {
            "cpu": k8s.resource_quantity(cpu),
            "memory": k8s.resource_quantity(memory)
        }
    )

```

Then this can be imported and used as `github.com/mesosphere/dispatch/lib`:

```
#!mesosphere/dispatch-starlark:v0.5

load("github.com/mesosphere/dispatch/lib", "resourceRequirements")

task("build", steps = [
    k8s.corev1.Container(resources = resourceRequirements("1000m", "4Gi"))
])
```

A version can be specified by appending it to the import path, for example, `github.com/mesosphere/dispatch/lib@master`. If a version is not specified, then the library will be loaded from the most recent release tag according to semver.

### Local imports

In the above import examples, the full import URL is always specified. However, it is possible for a Starlark file to import another file from the same repository and revision by specifying _only_ the import path and not the full URL or version.

This makes it easier to maintain local libraries or break out a Dispatchfile across multiple files.

For example, if a Starlark file at `github.com/mesosphere/dispatch/lib@master` imports `/other`, then it would import the Starlark library `github.com/mesosphere/dispatch/other@master`.

This also works for your local Dispatchfile. In the previous section, we created a Dispatchfile that imports `lib.star`. This can be modified to instead load `load("/lib", "resourceRequirements")`:

```
#!mesosphere/dispatch-starlark:v0.5

load("/lib", "resourceRequirements")

task("build", steps = [
    k8s.corev1.Container(resources = resourceRequirements("1000m", "4Gi"))
])
```

This would import `lib.star` from the local repository at the same revision as the Dispatchfile was fetched at.

### Generating documentation

It is possible to generate markdown formatted documentation for Starlark files. Documentation strings for functions will be written to the generated file, along with a header comprised of the contents of the `__doc__` variable, if it exists.

For example:

```
__doc__ = """
A set of helper methods
"""

def resourceRequirements(cpu, memory):
    """
    resourceRequirements returns a Kubernetes resource limit and request object that can be added onto a step.
    """
    return k8s.corev1.ResourceRequirements(
        limits = {
            "cpu": k8s.resource_quantity(cpu),
            "memory": k8s.resource_quantity(memory)
        },
        requests = {
            "cpu": k8s.resource_quantity(cpu),
            "memory": k8s.resource_quantity(memory)
        }
    )
```

Run `dispatch ci gen-doc` to generate the documentation:

```
A set of helper methods

### resourceRequirements(cpu, memory)


resourceRequirements returns a Kubernetes resource limit and request object that can be added onto a step.


```

## Dispatch Starlark Standard Library Methods

There is a Dispatch standard library hosted at the [dispatch-catalog](https://github.com/mesosphere/dispatch-catalog) Github repository. See standard library's documentation [here](https://mesosphere.github.io/dispatch-catalog/).

## Dispatch Starlark Built-in Methods

Dispatch provides a number of built-in methods that can be used to simplify pipeline definition. In addition to the Dispatch built-ins, the entire [Starlark standard library](https://docs.bazel.build/versions/master/skylark/language.html) is also available for use.

Most methods have an optional `pipeline` parameter that can be used for passing in pipelines other than the main pipeline object for use in unit tests (see [unit testing](#Unit-testing)). If not specified, it defaults to the global pipeline object.

### Kubernetes helpers

#### k8s.resource_quantity

`k8s.resource_quantity(quantity)`

Allows defining a Kubernetes resource quantity for use in a Kubernetes limit or request.

Example usage:

```sh
task("test", inputs=["git"], steps=[k8s.corev1.Container(
    name="test",
    image="golang:1.15.7-buster",
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
    image="golang:1.15.7-buster",
    command=["go", "test", "./..."],
    workingDir="/workspace/git"
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

### Action helpers

#### action

`action(pipeline=None, **kwargs)`

Defines a new action in a pipeline.

Example usage: `action(tasks = ["test"], on = p.Condition(push=p.PushCondition(branches = ["master"])))`
