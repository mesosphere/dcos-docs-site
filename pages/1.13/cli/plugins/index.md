---
layout: layout.pug
navigationTitle:  CLI Plugins
title: CLI Plugins
menuWeight: 5
excerpt: How to extend the command line interface

enterprise: false
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->

Plugins extend the functionality of the CLI for cluster specific actions.

Plugins are cluster-specific, when switching between different clusters the CLI will automatically use the proper set of plugins installed for that cluster.


# Core CLI Plugin

Commands that are specific to a DC/OS version are packaged into a plugin called `dcos-core-cli`.
The CLI automatically installs the core plugin during [dcos cluster setup](/1.13/cli/command-reference/dcos-cluster/dcos-cluster-setup/).

The subcommands included in this plugin are:

| Command | Description |
|---------|-------------|
| [dcos job](/1.13/cli/command-reference/dcos-job/)    | Deploy and manage jobs in DC/OS.  |
| [dcos marathon](/1.13/cli/command-reference/dcos-marathon/)  |  Deploy and manage applications to DC/OS.  |
| [dcos node](/1.13/cli/command-reference/dcos-node/)   |  Administer and manage DC/OS cluster nodes.  |
| [dcos package](/1.13/cli/command-reference/dcos-package/) | Install and manage DC/OS software packages. |
| [dcos service](/1.13/cli/command-reference/dcos-service/)  |  Manage DC/OS services.  |
| [dcos task](/1.13/cli/command-reference/dcos-task/)  |  Manage DC/OS tasks.  |

# Enterprise CLI Plugin

Commands that are specific to a DC/OS EE version are packaged into a plugin called `dcos-enterprise-cli`.

The CLI automatically installs this plugin during [dcos cluster setup](/1.13/cli/command-reference/dcos-cluster/dcos-cluster-setup/) when it detects a DC/OS EE cluster.

The subcommands included in this plugin are:

| Command | Description |
|---------|-------------|
| [dcos backup](/1.13/cli/command-reference/dcos-backup/)    | Access DC/OS backup functionality.  |
| [dcos license](/1.13/cli/command-reference/dcos-license/)  |  Manage your DC/OS licenses.  |
| [dcos security](/1.13/cli/command-reference/dcos-security/)   |  DC/OS security related commands. |


# Installing plugins

Users can install plugins using the [dcos plugin add](/1.13/cli/command-reference/dcos-plugin/dcos-plugin-add/) command. You can find plugin URLs by browsing the https://downloads.dcos.io/cli/index.html webpage.

Plugins can also be installed through the [dcos package](/1.13/cli/command-reference/dcos-package/) command in the core CLI.

# Updating Core and Enterprise plugins

The simplest way to update the Core and Enterprise plugins is to re-run the [dcos cluster setup](/1.13/cli/command-reference/dcos-cluster/dcos-cluster-setup/) command.

Another way is to update them through Cosmos :

```bash
dcos package install <dcos-core-cli|dcos-enterprise-cli>
```

Alternatively, you can find new versions of these plugins by browsing the https://downloads.dcos.io/cli/index.html webpage, and run the [dcos plugin add](/1.13/cli/command-reference/dcos-plugin/dcos-plugin-add/) command with the `--update` command-line option.
