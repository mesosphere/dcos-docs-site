---
layout: layout.pug
title: Running pipelines from ChatOps Commands
navigationTitle: Run pipelines from ChatOps Commands
beta: false
menuWeight: 90
excerpt: This tutorial describes how to trigger pipelines from Github comments
---

# Triggering Dispatch pipelines using ChatOps

## Prerequisites

This tutorial assumes that you followed the steps on following pages:

- [Dispatch Installation](../../../install/)
- [Setting up a Repository in Dispatch](../repo-setup/)
- Checked out the ["hello-world"](https://github.com/mesosphere/cicd-hello-world) repository on your laptop
- Configured the "hello-world" application for Dispatch CI (via `dispatch ci repository create`)

## Introduction

In this tutorial, a task test will be triggered by defining and using a ChatOps command `/test`

## Configure ChatOps Trigger in Dispatchfile

To use the ChatOps feature, you must include a ChatOps action to trigger when a chat event occurs. As an example, we will examine a task written in Starlark from the [pipeline configuration docs](../../index.md)

```python
#!mesosphere/dispatch-starlark:v0.5

load("github.com/mesosphere/dispatch-catalog/starlark/stable/pipeline@0.0.3", "gitResource")

gitResource("src-git")

task("test", inputs = ["src-git"], steps = [k8s.corev1.Container(
    name = "test",
    image = "golang:1.15.7-buster",
    command = [ "go", "test", "./..." ],
    workingDir = "/workspace/src-git",
    resources = k8s.corev1.ResourceRequirements(
        limits = {
            "cpu": k8s.resource_quantity("1000m"),
            "memory": k8s.resource_quantity("8Gi")
        }
    )
)])

action(tasks = ["test"], on = push(branches = ["master"]))
action(tasks = ["test"], on = pullRequest(chatops = ["test"]))
```

The following action:

`action(tasks = ["test"], on = pullRequest(chatops = ["test"]))`

runs the task `test` when there is a pull request when commented with `/test`. However, you can trigger the task with any word trailing a slash (`/`) for more details refer the [configuration reference](../../../references/pipeline-config-ref).

1. Configure the tests to run in verbose mode, to enable viewing logs as the tests execute. Start by creating a new branch on the hello-world repo:

```bash
git checkout -b verbose-tests
```

2. Make the change to the `test` task by changing the `command` to the following:

```python
command = [ "go", "test", "-v", "./..." ],
```

3. Add, commit, and push the changes to the Git repository.

```bash
git add Dispatchfile
git commit -m "Makes tests more verbose"
git push origin verbose-tests
```

4. Open a Pull Request on GitHub. If you are unfamiliar, refer to the [following documentation on GitHub](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request)

5. Trigger a test by commenting `/test` on our Pull Request. To view the run, navigate to your Dispatch dashboard.
