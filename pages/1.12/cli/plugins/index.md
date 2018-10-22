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
In version 0.7, the CLI has the 1.12 Core plugin included which it will automatically install for any cluster that it's attached to.

The subcommands included in this plugin are:

| Command | Description |
|---------|-------------|
| [dcos job](/1.12/cli/command-reference/dcos-job/)    | Deploy and manage jobs in DC/OS.  |
| [dcos marathon](/1.12/cli/command-reference/dcos-marathon/)  |  Deploy and manage applications to DC/OS.  |
| [dcos node](/1.12/cli/command-reference/dcos-node/)   |  Administer and manage DC/OS cluster nodes.  |
| [dcos package](/1.12/cli/command-reference/dcos-package/) | Install and manage DC/OS software packages. |
| [dcos service](/1.12/cli/command-reference/dcos-service/)  |  Manage DC/OS services.  |
| [dcos task](/1.12/cli/command-reference/dcos-task/)  |  Manage DC/OS tasks.  |

# Enterprise CLI Plugin

Commands that are specific to a DC/OS EE version are packaged into a plugin called `dcos-enterprise-cli`.

The subcommands included in this plugin are:

| Command | Description |
|---------|-------------|
| [dcos backup](/1.12/cli/command-reference/dcos-backup/)    | Access DC/OS backup functionality.  |
| [dcos license](/1.12/cli/command-reference/dcos-license/)  |  Manage your DC/OS licenses.  |
| [dcos security](/1.12/cli/command-reference/dcos-security/)   |  DC/OS security related commands. |

# Updating Core and Enterprise plugins

When the new versions are released, you must run the following command to update the Core and Enterprise plugins:

```bash
dcos package install <dcos-core-cli|dcos-enterprise-cli>
```


# Installing plugins

Users can install plugins using the [dcos plugin add](/1.12/cli/command-reference/dcos-plugin/dcos-plugin-add/) command.

# Distributing plugins

Plugins can also be installed through the [dcos package](/1.12/cli/command-reference/dcos-package/) command in the core CLI.
