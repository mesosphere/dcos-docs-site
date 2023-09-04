---
layout: layout.pug
navigationTitle:  CI - Pipelines
title: Continuous Integration Pipelines
menuWeight: 10
beta: false
excerpt: Building, Testing and Delivering cloud native applications into Kubernetes.
---
In Dispatch, CI pipelines are configured using a [`Dispatchfile`](../dispatchfile/). The `Dispatchfile` describes:

* All tasks that run as a part of a pipeline
* Rules for triggering tasks in a pipeline
* Resources produced and consumed as a part of the pipeline (images, git repositories, S3 artifacts, etc).

# Configuration Format

Dispatch supports several different configuration formats for you to choose from. Choose the format with which you are most comfortable.

By default, the `cue` configuration format is used. However, at the top of your `Dispatchfile`, you can declare the `Dispatchfile` format using a shebang syntax, for example:

| Frontend |            Example               |
| -------- | ---------------------------------------- |
| starlark | `#!mesosphere/dispatch-starlark:v0.6`    |
| cue      | `#!mesosphere/dispatch-cue:v0.4`  |
| json     | `#!mesosphere/dispatch-json:v0.3` |
| yaml     | `#!mesosphere/dispatch-yaml:v0.3` |

For the available frontend language versions supported in your Dispatch version, refer to the [release notes.](../../release-notes/index.md).

The four choices of frontend languages enable the the developer to leverage their existing skills for developing applications in building out their pipeline.


**For More Information**

For examples of these frontend languages refer next to the [dispatchfile](../Dispatchfile/).

For references on pipeline configuration, see the [Pipeline Configuration Reference](../../references/pipeline-config-ref/) page.

Also, be sure to check out the list of CI tutorials for building out a pipeline see the [CI tutorials](../../tutorials/ci_tutorials/) for some commonly used scenarios.
