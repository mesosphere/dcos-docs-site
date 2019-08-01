---
layout: layout.pug
navigationTitle:  dcos help
title: dcos help
menuWeight: 7
excerpt: 显示 DC/OS CLI 帮助信息
dcos helpenterprise: false
---

# 说明
`dcos help` 命令为应用程序中的任何命令提供帮助。如果未使用命令运行，输出默认为 `dcos --help`。

键入 `dcos help [path to command]` 了解详细信息。

# 使用

```bash
  dcos help [command] [flags]
```
# 选项


| 名称 | 说明 |
|---------|-------------|
|  `--help, h` | 显示使用情况。|



# 示例

## 显示不含自变量的 `dcos help` 命令的输出信息

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

## 显示 `dcos config` 命令的帮助

`dcos help config` 命令与 [`dcos config --help`](/mesosphere/dcos/cn/1.12/cli/command-reference/dcos-config/)一样。

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
