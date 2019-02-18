---
layout: layout.pug
navigationTitle: CLI Reference
title: CLI Reference
menuWeight: 30
excerpt: CLI commands for DC/OS Kubernetes
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes-cluster -->

# Mesosphere Kubernetes Engine (MKE) CLI

A MKE CLI is provided as a way to interact with the cluster manager and allow complete control over the life-cycle of Kubernetes clusters running on DC/OS.

- [Commands](#commands)
  - [Manager Commands](#manager-commands)
    - [Manager Describe](#manager-describe)
    - [Manager Plans](#manager-plans)
    - [Manager Pod](#manager-pod)
    - [Manager Update](#manager-update)
    - [Manager Debug](#manager-debug)
  - [Cluster Commands](#cluster-commands)
    - [Cluster List](#cluster-list)
    - [Cluster Default](#cluster-default)
    - [Cluster Kubeconfig](#cluster-kubeconfig)
    - [Cluster Describe](#cluster-describe)
    - [Cluster Create](#cluster-create)
    - [Cluster Update](#cluster-update)
    - [Cluster Delete](#cluster-delete)
    - [Cluster Backup](#cluster-backup)
    - [Cluster Restore](#cluster-restore)
    - [Cluster Debug](#cluster-debug)


## Commands

The `kubernetes` CLI has two useful top level commands that each refer to the particular objects you can run actions against.

* manager - commands run against the cluster `manager`.
* cluster - commands run against a specific Kubernetes cluster.

For more details on available commands, run:

```shell
$ dcos kubernetes --help

usage: dcos kubernetes [<flags>] <command>


Flags:
  -h, --help     Show context-sensitive help.
  -v, --verbose  Enable extra logging of requests/responses
      --version  Show application version.
```

### Manager Commands

```shell
$ dcos kubernetes manager <subcommand> [<flags>]
```

#### Manager Describe

View the configuration for this service:

```shell
$ dcos kubernetes manager describe
```

####  Manager Plans

##### Plan List

Show all plans for this service:

```shell
$ dcos kubernetes manager plan list
```

##### Plan Status

Display the status of the plan with the provided plan name:

```shell
$ dcos kubernetes manager plan status [<flags>] <plan>
```

##### Plan Start

Start the plan with the provided name and any optional plan arguments:

```shell
$ dcos kubernetes manager plan start [<flags>] <plan>
```

##### Plan Stop

Stop the running plan with the provided name:

```shell
$ dcos kubernetes manager plan stop <plan>
```

Plan Stop differs from Plan Pause in the following ways:

- Pause can be issued for a specific phase or for all phases within a plan. Stop can only be issued for a plan.
- Pause updates the underlying Phase/Step state. Stop both ceases execution and of the plan and resets the plan to its initial pending state.

##### Plan Pause

Pause the plan, or a specific phase in that plan with the provided phase name (or UUID):

```shell
$ dcos kubernetes manager plan pause <plan> [<phase>]
```

##### Plan Resume

Resume the plan, or a specific phase in that plan with the provided phase name (or UUID):

```shell
$ dcos kubernetes manager plan resume <plan> [<phase>]
```

##### Plan Force-Restart

Restart the plan with the provided name, or a specific phase in the plan with the provided name, or a specific step in a phase of the plan with the provided step name.

```shell
$ dcos kubernetes manager plan force-restart <plan> [<phase> [<step>]]
```

##### Plan Force-Complete

Force complete a specific step in the provided phase. Example uses include the following: Abort a sidecar operation due to observed failure or known required manual preparation that was not performed.

```shell
$ dcos kubernetes manager plan force-complete <plan> <phase> <step>
```

#### Manager Pod

##### Pod List

Display the list of known pod instances:

```shell
$ dcos kubernetes manager pod list
```

##### Pod Status

Display the status for tasks in one pod or all pods:

```shell
$ dcos kubernetes manager pod status [<flags>] [<pod>]
```

##### Pod Info

Display the full state information for tasks in a pod:

```shell
$ dcos kubernetes manager pod info <pod>
```

##### Pod Restart

Restarts a given pod without moving it to a new agent:

```shell
$ dcos kubernetes manager pod restart <pod>
```

##### Pod Replace
Replace should be used **only** when the current instance of the pod should be completely destroyed. All persistent data (read: volumes) of the pod will be destroyed. Replace should be used when a DC/OS agent is being removed, is permanently down, or pod placement constraints need to be updated.
Destroys a given pod and moves it to a new agent:

```shell
$ dcos kubernetes manager pod replace <pod>
```

#### Manager Update

##### Update Start

Launches an update operation:

```shell
$ dcos kubernetes manager update start [<flags>]
```

##### Update Force-Complete

Force complete a specific step in the provided phase:

```shell
$ dcos kubernetes manager update force-complete <phase> <step>
```

##### Update Force-Restart

Restart update plan, or specific step in the provided phase:

```shell
$ dcos kubernetes manager update force-restart [<phase> [<step>]]
```

##### Update Package-Version

View a list of available package versions to downgrade or upgrade to:

```shell
$ dcos kubernetes manager update package-versions
```

##### Update Pause

Pause update plan:

```shell
$ dcos kubernetes manager update pause
```

##### Update Resume

Resume update plan:

```shell
$ dcos kubernetes manager update resume
```

##### Update Status

View status of a running update:

```shell
$ dcos kubernetes manager update status [<flags>]
```

#### Manager Debug

##### Debug Config

List IDs of all available configurations:

```shell
$ dcos kubernetes manager debug config list
```

Display a specified configuration:

```shell
$ dcos kubernetes manager debug config show <config_id>
```

Display the target configuration:

```shell
$ dcos kubernetes manager debug config target
```

List ID of the target configuration:

```shell
$ dcos kubernetes manager debug config target_id
```

##### Debug Pod

Pauses a pod's tasks for debugging:

```shell
$ dcos kubernetes manager debug pod pause [<flags>] <pod>
```

Resumes a pod's normal execution following a pause command:

```shell
$ dcos kubernetes manager debug pod resume [<flags>] <pod>
```

##### Debug State

Display the Mesos framework ID:

```shell
$ dcos kubernetes manager debug state framework_id
```

List names of all custom properties:

```shell
$ dcos kubernetes manager debug state properties
```

Display the content of a specified property:

```shell
$ dcos kubernetes manager debug state property <name>
```

Refresh the state cache, used for debugging:

```shell
$ dcos kubernetes manager debug state refresh_cache
```

### Cluster Commands

The cluster sub-command itself represents a list of actions that can be made against a cluster, existing or otherwise (such as the case of create).

```shell
$ dcos kubernetes cluster <sub-command> [<flags>]
```

#### Cluster List

Lists Kubernetes clusters:

```shell
$ dcos kubernetes cluster list
```

#### Cluster Kubeconfig

Generates a kubeconfig entry for a cluster:

```shell
$ dcos kubernetes cluster kubeconfig --apiserver-url=APISERVER-URL [<flags>]
```

#### Cluster Describe

View the configuration for a cluster:

```shell
$ dcos kubernetes cluster describe [<flags>]
```
#### Cluster Default

##### Default Show
Print the name of the default Kubernetes cluster:

```shell
$ dcos kubernetes cluster default show
```

##### Default Unset
Unset the default Kubernetes cluster:

```shell
$ dcos kubernetes cluster default unset
```

##### Default Set
Set the default Kubernetes cluster:

```shell
$ dcos kubernetes cluster default set <cluster_name>
```

#### Cluster Create

Create a cluster:

```shell
$ dcos kubernetes cluster create [<flags>]
```

#### Cluster Update

Update a cluster:

```shell
$ dcos kubernetes cluster update [<flags>]
```

#### Cluster Delete

Delete a cluster:

```shell
$ dcos kubernetes cluster delete [<flags>]
```


#### Cluster Backup

Create a backup of the state of a cluster:

```shell
$ dcos kubernetes cluster backup [<flags>]
```

#### Cluster Restore

Restore a backup of the state of a cluster:

```shell
$ dcos kubernetes cluster restore [<flags>]
```


#### Cluster Debug

##### Debug Config

List IDs of all available configurations:

```shell
dcos kubernetes cluster debug [<flags>] config list
```

Display a specified configuration:

```shell
dcos kubernetes cluster debug [<flags>] config show <config_id>
```

Display the target configuration:

```shell
dcos kubernetes cluster debug [<flags>] config target
```

List ID of the target configuration:

```shell
dcos kubernetes cluster debug [<flags>] config target_id
```

##### Debug Pod

Pauses a pod's tasks for debugging:

```shell
dcos kubernetes cluster debug pod pause [<flags>] <pod>
```

Resumes a pod's normal execution following a pause command:

```shell
dcos kubernetes cluster debug pod resume [<flags>] <pod>
```

Display the list of known pod instances:

```shell
dcos kubernetes cluster debug [<flags>] pod list
```

Display the status for tasks in one pod or all pods:

```shell
dcos kubernetes cluster debug pod status [<flags>] [<pod>]
```

Display the full state information for tasks in a pod:

```shell
dcos kubernetes cluster debug [<flags>] pod info <pod>
```

Restarts a given pod without moving it to a new agent:

```shell
dcos kubernetes cluster debug [<flags>] pod restart <pod>
```

Destroys a given pod and moves it to a new agent:

```shell
dcos kubernetes cluster debug [<flags>] pod replace <pod>
```

##### Debug State

Display the Mesos framework ID:

```shell
dcos kubernetes cluster debug [<flags>] state framework_id
```

List names of all custom properties:

```shell
dcos kubernetes cluster debug [<flags>] state properties
```

Display the content of a specified property:

```shell
dcos kubernetes cluster debug [<flags>] state property <name>
```

Refresh the state cache, used for debugging:

```shell
dcos kubernetes cluster debug [<flags>] state refresh_cache
```

##### Debug Plan

Show all plans for this service:

```shell
dcos kubernetes cluster debug [<flags>] plan list
```

Display the status of the plan with the provided plan name:

```shell
dcos kubernetes cluster debug plan status [<flags>] <plan>
```

Start the plan with the provided name and any optional plan arguments:

```shell
dcos kubernetes cluster debug plan start [<flags>] <plan>
```

Stop the running plan with the provided name:

```shell
dcos kubernetes cluster debug [<flags>] plan stop <plan>
```

Pause the plan, or a specific phase in that plan with the provided phase name (or UUID):

```shell
dcos kubernetes cluster debug [<flags>] plan pause <plan> [<phase>]
```

Resume the plan, or a specific phase in that plan with the provided phase name (or UUID):

```shell
dcos kubernetes cluster debug [<flags>] plan resume <plan> [<phase>]
```

Restart the plan with the provided name, or a specific phase in the plan with the provided name, or a specific step in a phase of the plan with the provided step name.

```shell
dcos kubernetes cluster debug [<flags>] plan force-restart <plan> [<phase> [<step>]]
```

Force complete a specific step in the provided phase. Example uses include the following: Abort a sidecar operation due to observed failure or known required manual preparation that was not performed.

```shell
dcos kubernetes cluster debug [<flags>] plan force-complete <plan> <phase> <step>
```

##### Debug Endpoints

View client endpoints for this DC/OS service:

```shell
dcos kubernetes cluster debug [<flags>] endpoints [<name>]
```
