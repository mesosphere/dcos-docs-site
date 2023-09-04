---
layout: layout.pug
title: Configuring Cron Triggers
navigationTitle: Configure Cron Based Triggers
beta: false
menuWeight: 60
excerpt: Schedule CI pipeline runs using cron expressions
---
# Triggering Dispatch pipelines using Cron expressions

## Prerequisites

This tutorial assumes that you have done the following:

- [Installed Dispatch](../../../install/)
- [Set up a Repository in Dispatch](../repo-setup/)
- Checked out the ["hello-world"](https://github.com/mesosphere/cicd-hello-world) repository
- Configured the "hello-world" application for Dispatch CI (via `dispatch ci repository create`)

## Introduction

In this tutorial, you will learn how to configure a periodically triggered task by configuring and using a cron expression.

## Configure Cron Trigger in Dispatchfile

Periodic pipelines enable a Dispatch pipeline to be executed at a predetermined time according to a schedule. This schedule can be set to execute a set of Dispatch tasks as defined within the Dispatchfile. For example, a development team may choose to create a schedule that executes the pipeline everyday at midnight to represent their *daily* build. Dispatch leverages the common cron model for scheduling these pipeline runs. To schedule a pipeline, and trigger it to be executed, a cron action must be specified for the action. Each cron action needs to be named uniquely (within the scope of a single Dispatchfile) using the `name` field. The cron condition accepts a mandatory field `schedule` and an optional field `revision`. The `schedule` field is backed by the Kubernetes [CronJob Schedule field](https://kubernetes.io/docs/tasks/job/automated-tasks-with-cron-jobs/#schedule). The `revision` field corresponds to the actual revision of the scm repository to pull in to run the tests. This can point to a branch/tag/commit sha. If not specified, this defaults to the default branch of scm repository. This is how a simple action should look:

```json
{
  "name": "unique-name-of-action",
  "tasks": ["list", "of", "tasks"],
  "on" : {
    "cron": {
      "schedule": "standard-cron-syntax-schedule",
      "revision": "optional-revision"
    }
  }
}
```

As a real world example, take a look at a task written in Cue from the [pipeline configuration docs](../../../overview_concepts/Dispatchfile/)

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
      image: "golang:1.15.7-buster"
      command: [ "go", "test", "./..." ]
      workingDir: "/workspace/src-git"
    }
  ]
}

actions: [
  {
    name: "my-nightly-build"
    tasks: ["test"]
    on: cron: schedule: "@daily"
  }
]
```

The action named `my-nightly-build` runs the task named `test` every day at midnight. For more information, see the [configuration reference](../../../references/pipeline-config-ref/).
