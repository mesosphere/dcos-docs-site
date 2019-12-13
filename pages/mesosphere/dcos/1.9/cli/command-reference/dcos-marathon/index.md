---
layout: layout.pug
navigationTitle:  dcos marathon
title: dcos marathon
menuWeight: 5
excerpt:

enterprise: false
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->


# Description
Deploy and manage applications to DC/OS.

# Usage

```bash
dcos marathon
```

# Options

| Name, shorthand | Default | Description |
|---------|-------------|-------------|
| `--config-schema`   |             |  Show the configuration schema for the Marathon subcommand. |
| `--help, h`   |             |  Print usage. |
| `--info`   |             |  Print a short description of this subcommand. |
| `--version, v`   |             | Print version information. |

# Child commands

| Command | Description |
|---------|-------------|
| [dcos marathon about](/mesosphere/dcos/1.9/cli/command-reference/dcos-marathon/dcos-marathon-about/)   | Print `info.json` for DC/OS Marathon. | 
| [dcos marathon app add](/mesosphere/dcos/1.9/cli/command-reference/dcos-marathon/dcos-marathon-app-add/)   |  Add an application. | 
| [dcos marathon app kill](/mesosphere/dcos/1.9/cli/command-reference/dcos-marathon/dcos-marathon-app-kill/)   | Kill a running application instance.  | 
| [dcos marathon app list](/mesosphere/dcos/1.9/cli/command-reference/dcos-marathon/dcos-marathon-app-list/)   | List the installed applications.  | 
| [dcos marathon app remove](/mesosphere/dcos/1.9/cli/command-reference/dcos-marathon/dcos-marathon-app-remove/)   |  Remove an application. | 
| [dcos marathon app restart](/mesosphere/dcos/1.9/cli/command-reference/dcos-marathon/dcos-marathon-app-restart/)   | Restart an application.  | 
| [dcos marathon app show](/mesosphere/dcos/1.9/cli/command-reference/dcos-marathon/dcos-marathon-app-show/)   | Show the `marathon.json` for an  application.  | 
| [dcos marathon app start](/mesosphere/dcos/1.9/cli/command-reference/dcos-marathon/dcos-marathon-app-start/)   | Start an application.  | 
| [dcos marathon app stop](/mesosphere/dcos/1.9/cli/command-reference/dcos-marathon/dcos-marathon-app-stop/)   | Stop an application.  | 
| [dcos marathon app update](/mesosphere/dcos/1.9/cli/command-reference/dcos-marathon/dcos-marathon-app-update/)   | Update an application.  | 
| [dcos marathon app version list](/mesosphere/dcos/1.9/cli/command-reference/dcos-marathon/dcos-marathon-app-version-list/)   | List the version history of an application.  | 
| [dcos marathon debug details](/mesosphere/dcos/1.9/cli/command-reference/dcos-marathon/dcos-marathon-debug-details/) | View debugging information for Marathon application deployments that are waiting.  | 
| [dcos marathon debug list](/mesosphere/dcos/1.9/cli/command-reference/dcos-marathon/dcos-marathon-debug-list/)   | List the current queue of Marathon application deployments that are waiting.  | 
| [dcos marathon debug summary](/mesosphere/dcos/1.9/cli/command-reference/dcos-marathon/dcos-marathon-debug-summary/)   | List the current queue and debugging information of Marathon application deployments that are waiting.  | 
| [dcos marathon deployment list](/mesosphere/dcos/1.9/cli/command-reference/dcos-marathon/dcos-marathon-deployment-list/) | Print a list of currently deployed applications. | 
| [dcos marathon deployment rollback](/mesosphere/dcos/1.9/cli/command-reference/dcos-marathon/dcos-marathon-deployment-rollback/) | Remove a deployed application. | 
| [dcos marathon deployment stop](/mesosphere/dcos/1.9/cli/command-reference/dcos-marathon/dcos-marathon-deployment-stop/) | Cancel the in-progress deployment of an application. | 
| [dcos marathon deployment watch](/mesosphere/dcos/1.9/cli/command-reference/dcos-marathon/dcos-marathon-deployment-stop/) | Monitor deployments. | 
| [dcos marathon group add](/mesosphere/dcos/1.9/cli/command-reference/dcos-marathon/dcos-marathon-group-add/) | Add a group. | 
| [dcos marathon group list](/mesosphere/dcos/1.9/cli/command-reference/dcos-marathon/dcos-marathon-group-list/) | Print the list of groups. | 
| [dcos marathon group scale](/mesosphere/dcos/1.9/cli/command-reference/dcos-marathon/dcos-marathon-group-scale/) | Scale a group. | 
| [dcos marathon group show](/mesosphere/dcos/1.9/cli/command-reference/dcos-marathon/dcos-marathon-group-scale/) | Print a detailed list of groups. | 
| [dcos marathon group remove](/mesosphere/dcos/1.9/cli/command-reference/dcos-marathon/dcos-marathon-group-remove/) | Remove a group. | 
| [dcos marathon group update](/mesosphere/dcos/1.9/cli/command-reference/dcos-marathon/dcos-marathon-group-update/) | Update a group. | 
| [dcos marathon pod add](/mesosphere/dcos/1.9/cli/command-reference/dcos-marathon/dcos-marathon-pod-add/) | Add a pod. | 
| [dcos marathon pod kill](/mesosphere/dcos/1.9/cli/command-reference/dcos-marathon/dcos-marathon-pod-kill/) | Kill one or more running pod instances. | 
| [dcos marathon pod list](/mesosphere/dcos/1.9/cli/command-reference/dcos-marathon/dcos-marathon-pod-list/) | List the deployed pods. | 
| [dcos marathon pod list](/mesosphere/dcos/1.9/cli/command-reference/dcos-marathon/dcos-marathon-pod-list/) | List the deployed pods. | 
| [dcos marathon pod remove](/mesosphere/dcos/1.9/cli/command-reference/dcos-marathon/dcos-marathon-pod-remove/) | Remove a pod. | 
| [dcos marathon pod show](/mesosphere/dcos/1.9/cli/command-reference/dcos-marathon/dcos-marathon-pod-show/) | Display detailed information for a specific pod. | 
| [dcos marathon pod udpate](/mesosphere/dcos/1.9/cli/command-reference/dcos-marathon/dcos-marathon-pod-update/) | Update a pod. | 
| [dcos marathon task list](/mesosphere/dcos/1.9/cli/command-reference/dcos-marathon/dcos-marathon-task-list/) | List all tasks. | 
| [dcos marathon task stop](/mesosphere/dcos/1.9/cli/command-reference/dcos-marathon/dcos-marathon-task-stop/) | Stop a task. | 
| [dcos marathon task show](/mesosphere/dcos/1.9/cli/command-reference/dcos-marathon/dcos-marathon-task-show/) | List a specific task. | 

