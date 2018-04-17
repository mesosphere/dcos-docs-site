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
| [dcos marathon about](/1.10/cli/command-reference/dcos-marathon/dcos-marathon-about/)   | Print `info.json` for DC/OS Marathon. | 
| [dcos marathon app add](/1.10/cli/command-reference/dcos-marathon/dcos-marathon-app-add/)   |  Add an application. | 
| [dcos marathon app kill](/1.10/cli/command-reference/dcos-marathon/dcos-marathon-app-kill/)   | Kill a running application instance.  | 
| [dcos marathon app list](/1.10/cli/command-reference/dcos-marathon/dcos-marathon-app-list/)   | List the installed applications.  | 
| [dcos marathon app remove](/1.10/cli/command-reference/dcos-marathon/dcos-marathon-app-remove/)   |  Remove an application. | 
| [dcos marathon app restart](/1.10/cli/command-reference/dcos-marathon/dcos-marathon-app-restart/)   | Restart an application.  | 
| [dcos marathon app show](/1.10/cli/command-reference/dcos-marathon/dcos-marathon-app-show/)   | Show the `marathon.json` for an  application.  | 
| [dcos marathon app start](/1.10/cli/command-reference/dcos-marathon/dcos-marathon-app-start/)   | Start an application.  | 
| [dcos marathon app stop](/1.10/cli/command-reference/dcos-marathon/dcos-marathon-app-stop/)   | Stop an application.  | 
| [dcos marathon app update](/1.10/cli/command-reference/dcos-marathon/dcos-marathon-app-update/)   | Update an application.  | 
| [dcos marathon app version list](/1.10/cli/command-reference/dcos-marathon/dcos-marathon-app-version-list/)   | List the version history of an application.  | 
| [dcos marathon debug details](/1.10/cli/command-reference/dcos-marathon/dcos-marathon-debug-details/) | View debugging information for Marathon application deployments that are waiting.  | 
| [dcos marathon debug list](/1.10/cli/command-reference/dcos-marathon/dcos-marathon-debug-list/)   | List the current queue of Marathon application deployments that are waiting.  | 
| [dcos marathon debug summary](/1.10/cli/command-reference/dcos-marathon/dcos-marathon-debug-summary/)   | List the current queue and debugging information of Marathon application deployments that are waiting.  | 
| [dcos marathon deployment list](/1.10/cli/command-reference/dcos-marathon/dcos-marathon-deployment-list/) | Print a list of currently deployed applications. | 
| [dcos marathon deployment rollback](/1.10/cli/command-reference/dcos-marathon/dcos-marathon-deployment-rollback/) | Remove a deployed application. | 
| [dcos marathon deployment stop](/1.10/cli/command-reference/dcos-marathon/dcos-marathon-deployment-stop/) | Cancel the in-progress deployment of an application. | 
| [dcos marathon deployment watch](/1.10/cli/command-reference/dcos-marathon/dcos-marathon-deployment-stop/) | Monitor deployments. | 
| [dcos marathon group add](/1.10/cli/command-reference/dcos-marathon/dcos-marathon-group-add/) | Add a group. | 
| [dcos marathon group list](/1.10/cli/command-reference/dcos-marathon/dcos-marathon-group-list/) | Print the list of groups. | 
| [dcos marathon group scale](/1.10/cli/command-reference/dcos-marathon/dcos-marathon-group-scale/) | Scale a group. | 
| [dcos marathon group show](/1.10/cli/command-reference/dcos-marathon/dcos-marathon-group-scale/) | Print a detailed list of groups. | 
| [dcos marathon group remove](/1.10/cli/command-reference/dcos-marathon/dcos-marathon-group-remove/) | Remove a group. | 
| [dcos marathon group update](/1.10/cli/command-reference/dcos-marathon/dcos-marathon-group-update/) | Update a group. | 
| [dcos marathon pod add](/1.10/cli/command-reference/dcos-marathon/dcos-marathon-pod-add/) | Add a pod. | 
| [dcos marathon pod kill](/1.10/cli/command-reference/dcos-marathon/dcos-marathon-pod-kill/) | Kill one or more running pod instances. | 
| [dcos marathon pod list](/1.10/cli/command-reference/dcos-marathon/dcos-marathon-pod-list/) | List the deployed pods. | 
| [dcos marathon pod list](/1.10/cli/command-reference/dcos-marathon/dcos-marathon-pod-list/) | List the deployed pods. | 
| [dcos marathon pod remove](/1.10/cli/command-reference/dcos-marathon/dcos-marathon-pod-remove/) | Remove a pod. | 
| [dcos marathon pod show](/1.10/cli/command-reference/dcos-marathon/dcos-marathon-pod-show/) | Display detailed information for a specific pod. | 
| [dcos marathon pod udpate](/1.10/cli/command-reference/dcos-marathon/dcos-marathon-pod-update/) | Update a pod. | 
| [dcos marathon task list](/1.10/cli/command-reference/dcos-marathon/dcos-marathon-task-list/) | List all tasks. | 
| [dcos marathon task stop](/1.10/cli/command-reference/dcos-marathon/dcos-marathon-task-stop/) | Stop a task. | 
| [dcos marathon task show](/1.10/cli/command-reference/dcos-marathon/dcos-marathon-task-show/) | List a specific task. | 

