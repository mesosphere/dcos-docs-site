---
layout: layout.pug
navigationTitle:  Managing
title: Managing
menuWeight: 80
excerpt: Managing your DC/OS Minio Service configuration
featureMaturity:
enterprise: false
---


# Updating Configuration

You can make changes to the DC/OS Minio Service after it has been launched. Configuration management is handled by the Scheduler process, which in turn handles Minio deployment itself.

After you make a change, the scheduler will be restarted, and it will automatically deploy any detected changes to the service, one node at a time. For example, a given change will first be applied to `minio-0`, then `minio-1`, and so on.

Nodes are configured with a "Readiness check" to ensure that the underlying service appears to be in a healthy state before continuing with applying a given change to the next node in the sequence.

Some changes, such as decreasing the number of nodes or changing volume requirements, are not supported after initial deployment. See [Limitations](../limitations/index.md).

The instructions below describe how to update the configuration for a running DC/OS Minio Service.

### Enterprise DC/OS 1.10

Enterprise DC/OS 1.10 introduces a convenient command line option that allows for easier updates to a service's configuration, as well as allowing users to inspect the status of an update, to pause and resume updates, and to restart or complete steps if necessary.

#### Prerequisites

+ Enterprise DC/OS 1.10 or later.
+ Service with 1.5.0 version.
+ [The DC/OS CLI](https://docs.mesosphere.com/latest/cli/install/) installed and available.
+ The service's subcommand available and installed on your local machine.
  + You can install just the subcommand CLI by running `dcos package install --cli --yes minio`.
  + If you are running an earlier version of the subcommand CLI that does not have the `update` command, uninstall it and reinstall your CLI, using these commands:

    ```shell
    dcos package uninstall --cli minio
    dcos package install --cli minio
     ```
