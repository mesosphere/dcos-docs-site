---
layout: layout.pug
navigationTitle:  Managing
title: Managing
menuWeight: 80
excerpt: Managing your DC/OS Prometheus configuration
featureMaturity:
enterprise: false
---

# Updating Configuration

You can make changes to the service after it has been launched. Configuration management is handled by the scheduler process, which in turn handles Prometheus deployment itself.

After making a change, the scheduler will be restarted, and it will automatically deploy any detected changes to the service, one node at a time. For example, a given change will first be applied to `prometheus-0`, then `prometheus-1`, and so on.

Nodes are configured with a "Readiness check" to ensure that the underlying service appears to be in a healthy state before continuing with applying a given change to the next node in the sequence.


The instructions below describe how to update the configuration for a running DC/OS service.

### Enterprise DC/OS 1.10

Enterprise DC/OS 1.10 introduces a convenient command line option that allows for easier updates to a service's configuration, as well as allowing users to inspect the status of an update, to pause and resume updates, and to restart or complete steps if necessary.

#### Prerequisites

+ Enterprise DC/OS 1.10 or newer.
+ Service with 1.5.0 version.
+ [The DC/OS CLI](https://docs.mesosphere.com/latest/cli/install/) installed and available.
+ The service's subcommand available and installed on your local machine.
  + You can install just the subcommand CLI by running `dcos package install --cli --yes prometheus`.
  + If you are running an older version of the subcommand CLI that doesn't have the `update` command, uninstall and reinstall your CLI.
    ```shell
    dcos package uninstall --cli prometheus
    dcos package install --cli prometheus
    ```

#### Updating configuration  

To Update configuration for a running dcos service , 

1.Go to docs UI -> on right corner -> click on edit

2. Once you click on edit , you will have all the options like node count , cpu , memory options available for editing.

3. Once you are done with editing re-run the service , it will restart all the nodes and will fetch the updated configuration.

**Note:** Volume requirements (type and/or size) cannot be changed after initial deployment.

## Replacing a node :

This operation will move a node to a new agent and will discard the persistent volumes at the prior system to be rebuilt at the new system. Perform this operation if a given system is about to be offlined or has already been offlined.

**Note:** Nodes are not moved automatically. You must perform the following steps manually to move nodes to new systems. You can automate node replacement according to your own preferences.

1. Run `dcos prometheus pod replace prometheus-<NUM>`, e.g. `prometheus-2` to halt the current instance with id `<NUM>` (if still running) and launch a new instance on a different agent.

For example, let's say `prometheus-2`'s host system has died and `prometheus-2` needs to be moved.

1. NOW THAT THE NODE HAS BEEN DECOMMISSIONED, (IF NEEDED BY YOUR SERVICE) start `prometheus-2` at a new location in the cluster.
    ```shell
    dcos prometheus pod replace prometheus-2
    ```

## Advanced update actions

The following sections describe advanced commands that be used to interact with an update in progress.

### Monitoring the update

Once the Scheduler has been restarted, it will begin a new deployment plan as individual pods are restarted with the new configuration.

You can query the status of the update as follows:

```shell
dcos prometheus update status
```

If the Scheduler is still restarting, DC/OS will not be able to route to it and this command will return an error message. Wait a short while and try again. You can also go to the Services tab of the DC/OS GUI to check the status of the restart.

### Pause

To pause an ongoing update, issue a pause command:

```shell
dcos prometheus update pause
```

You will receive an error message if the plan has already completed or has been paused. Once completed, the plan will enter the `WAITING` state.

### Resume

If a plan is in a `WAITING` state, as a result of being paused or reaching a breakpoint that requires manual operator verification, you can use the `resume` command to continue the plan:

```shell
dcos prometheus update resume
```

You will receive an error message if you attempt to `resume` a plan that is already in progress or has already completed.

### Force Complete

In order to manually "complete" a step (such that the Scheduler stops attempting to launch a task), you can issue a `force-complete` command. This will instruct to Scheduler to mark a specific step within a phase as complete. You need to specify both the phase and the step, for example:

```shell
dcos prometheus update force-complete service-phase service-0:[node]
```

### Force Restart

Similar to force complete, you can also force a restart. This can either be done for an entire plan, a phase, or just for a specific step.

To restart the entire plan:
```shell
dcos prometheus update force-restart
```

Or for all steps in a single phase:
```shell
dcos prometheus update force-restart service-phase
```

Or for a specific step within a specific phase:
```shell
dcos prometheus update force-restart service-phase service-0:[node]
```

