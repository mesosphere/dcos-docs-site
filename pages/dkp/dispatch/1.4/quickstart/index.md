---
layout: layout.pug
navigationTitle: Quickstart
title: Quickstart
menuWeight: 30
beta: false
excerpt: Immedately get started with a quick tutorial for installation and configuration of Dispatch.
---

# Prerequisites

Before you begin using Dispatch, you should set up your local environment with the following tools:

- **git** commands. Many CI/CD and GitOps use cases require Git. If you do not already have it installed, see the directions [here](https://help.github.com/en/github/getting-started-with-github/set-up-git#setting-up-git).

If you want to get started using GitHub, DockerHub, and the default Dispatch configuration you can follow any of the following quickstart guides:

- [Hello-World example using Starlark](./hello-world-in-starlark/).
- [Hello-World example using CUE](./hello-world-in-cue/).
- [Hello-World example using JSON](./hello-world-in-json/).
- [Hello-World example using YAML](./hello-world-in-yaml/).

Alternatively, follow these five steps to set up your CI/CD pipeline using Dispatch on D2iQ Konvoy.

1. Install [the Dispatch CLI](../install/cli/).

    Note that unless otherwise specified, the Dispatch CLI commands create repositories, secrets, pipelines and tasks in the `default` namespace. For production installations, we suggest you create a new namespace dedicated to your CI workloads, for example, `dispatch-work` or `dispatch-ci`. You will then specify that namespace when using the CLI.

    Examples:

    ```bash
    dispatch -n dispatch-ci login docker --service-account=team1
    ```

    or

    ```bash
    dispatch -n dispatch-work ci repository create
    ```

1. Install Dispatch on Kubernetes. Dispatch is built to run on Kubernetes and leverage its native features and services. To install Dispatch onto an existing D2iQ Konvoy cluster, see [install Dispatch](../install/).

1. Set Up Continuous Integration (CI). To build and test your Continuous Integration (CI), you can leverage one of multiple declarative languages to rapidly create and execute the pipeline. To set up CI for your project, follow the [repository configuration instructions](../tutorials/ci_tutorials/repo-setup/).

1. Build Your Pipeline. Configuring your CI pipeline using CUE, Starlark, JSON or YAML greatly simplifies pipeline configuration and increases its abilities. The simplest way to do this is to prepare a `Dispatchfile`. For a reference on creating a `Dispatchfile`, see the [pipeline configuration reference](../overview_concepts/dispatch-ci/).

1. Configure Continuous Deployment (CD). Dispatch lets you automatically detect changes to how the application should be deployed or automatically resolve deployment issues. To configure continuous deployment for your project, follow the [deployment instructions](../overview_concepts/dispatch-cd/)
