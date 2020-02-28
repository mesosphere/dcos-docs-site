---
layout: layout.pug
navigationTitle:  Getting Started
title: Getting Started
menuWeight: 30
beta: false
excerpt: Getting started
---

# Prerequisites

Before you begin using Dispatch, you should set up your local environment with the following tools:

- **git** commands. Many CI/CD and GitOps use cases require Git. If you do not already have it installed, see the directions [here](https://help.github.com/en/github/getting-started-with-github/set-up-git#setting-up-git).

Get started using Dispatch in five steps:

1. Install [the Dispatch CLI](../install/cli/). 

    Note that unless otherwise specified, the Dispatch CLI commands create repositories, secrets, pipelines and tasks in the `default` namespace. For production installations, we suggest you create a new namespace dedicated to your CI workloads, for example, `dispatch-work` or `dispatch-ci`. You will then specify that namespace when using the CLI.

    Examples:

    ```bash
    dispatch -n dispatch-ci login docker --serviceaccount=team1
    ```

    or

    ```bash
    dispatch -n dispatch-work create repository
    ```

1. Install Dispatch on Kubernetes. Dispatch is built to run on Kubernetes and leverage its native features and services. To install Dispatch onto an existing Kubernetes cluster, see [install Dispatch](../install/).

1. Set Up Continuous Integration (CI). To build and test your Continuous Integration (CI), you can leverage one of multiple declarative languages to rapidly create and execute the pipeline. To set up CI for your project, follow the [repository configuration instructions](../repo-setup/).

1. Build Your Pipeline. Configuring your CI pipeline using CUE, Starlark, JSON or YAML greatly simplifies pipeline configuration and increases its abilities. The simplest way to do this is to prepare a `Dispatchfile`. For a reference on creating a `Dispatchfile`, see the [pipeline configuration reference](../pipeline-configuration/).

1. Configure Continuous Deployment (CD). Dispatch lets you automaticallly detect changes to how the application should be deployed or automatically resolve deployment issues. To configure continuous deployment for your project, follow the [deployment instructions](../deployment/).



