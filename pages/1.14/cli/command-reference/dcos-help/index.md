---
layout: layout.pug
navigationTitle: dcos help
title: dcos help
menuWeight: 7
excerpt: Displaying DC/OS CLI help information
enterprise: false
render: mustache
model: /1.14/data.yml
---

# Description
The `dcos help` command provides help for any command in the application. If it is run with no command, the output defaults to `dcos --help`.

Type `dcos help [path to command]` for full details.

# Usage

```bash
  dcos help [command] [flags]
```
# Options


| Name |  Description |
|---------|-------------|
| `--help, h`   |   Display usage. |



# Examples

## Display output of `dcos help` command without arguments

```
dcos help
Usage:
  dcos [command]

Commands:
  auth
      Authenticate to DC/OS cluster
  backup
      Access DC/OS backup functionality
  cluster
      Manage your DC/OS clusters
  config
      Manage the DC/OS configuration file
  help
      Help about any command
  job
      Deploy and manage jobs in DC/OS
  license
      Manage your DC/OS licenses
  marathon
      Deploy and manage applications to DC/OS
  node
      View DC/OS node information
  package
      Install and manage DC/OS software packages
  plugin
      Manage CLI plugins
  security
      DC/OS security related commands
  service
      Manage DC/OS services
  task
      Manage DC/OS tasks

Options:
  --version
      Print version information
  -v, -vv
      Output verbosity (verbose or very verbose)
  -h, --help
      Show usage help

Use "dcos [command] --help" for more information about a command.
```

## Display help for `dcos config` command

The `dcos help config` command is the same as [`dcos config --help`](/1.14/cli/command-reference/dcos-config/).

```bash
dcos help config
Manage the DC/OS configuration file

Usage:
  dcos config [command]

Commands:
  set
      Add or set a property in the configuration file used for the current cluster
  show
      Print the configuration file related to the current cluster
  unset
      Remove a property from the configuration file used for the current cluster

Options:
  -h, --help   help for config

Use "dcos config [command] --help" for more information about a command.
```
