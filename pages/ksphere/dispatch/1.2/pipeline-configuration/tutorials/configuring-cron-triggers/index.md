---
layout: layout.pug
title: Configuring Cron Triggers
navigationTitle: Configuring Cron Triggers
beta: false
category: K-Sphere
menuWeight: 120
excerpt: This tutorial describes how to trigger pipelines using cron expressions
---

# Triggering Dispatch pipelines using Cron expressions

## Prerequisites

This tutorial assumes that you have done the following:

- [Installed Dispatch](../../../install/)
- [Set up a Repository in Dispatch](../../../repo-setup/)
- Checked out the ["hello-world"](https://github.com/mesosphere/cicd-hello-world) repository
- Configured the "hello-world" application for Dispatch CI (via `dispatch ci repository create`)

## Introduction

In this tutorial, you will learn how to periodically trigger a task test by configuring and using a cron expression.

## Configure Cron Trigger in Dispatchfile

To use the cron trigger, you must include a cron action. As an example, take a look at a task written in Cue from the [pipeline configuration docs](../../index.md)

```json
#!mesosphere/dispatch-cue:v0.4

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
      image: "golang:1.13.0-buster"
      command: [ "go", "test", "./..." ]
      workingDir: "/workspace/src-git"
    }
  ]
}

actions: [
  {
    name: "my-nightly-trigger"
    tasks: ["test"]
    on: cron: schedule: "@daily"
  }
]
```

The action named `my-nightly-trigger` runs the task named `test` every day at midnight. For more information, see the [configuration reference](../../../references/pipeline-config-ref).
