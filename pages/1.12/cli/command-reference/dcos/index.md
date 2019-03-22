---
layout: layout.pug
navigationTitle:  dcos
title: dcos
menuWeight: 0
excerpt: Managing your DC/OS installation

enterprise: false
---

# Description

The Mesosphere DC/OS is a distributed operating system built around Apache Mesos. This utility provides tools for easy management of a DC/OS installation. 

The `dcos` command helps you manage your DC/OS installation.

# Usage

``` bash
dcos [options] [<command>] [<args>...]
```

# Options

| Name | Description |
|---------|-------------|-------------|
| `--help, h`   |  Display usage. |
|  `--debug`  |  Enable debug mode. |
| `--version` | Display version information. |
| `--log-level=<log-level>`  | Set the logging level. This setting does not affect the output sent to `stdout`.  See below for severity levels. |


## Log level severity

| Name |  Description |
|---------|-------------|
| `debug` | Displays all messages.|
|`info` | Displays informational, warning, error, and critical messages.|
| `warning` | Displays warning, error, and critical messages. |
| `error` | Displays error and critical messages. |
| `critical` | Displays only critical messages to `stderr`. |

# Environment Variables

| Name |  Description |
|---------|-------------|
| `DCOS_CONFIG` | Set the path to the DC/OS configuration file. By default, this variable is set to `$DCOS_DIR/dcos.toml`. |
| `DCOS_DEBUG` | Indicates whether to print additional debug messages to `stdout`. By default this is set to false. |
| `DCOS_DIR`   |  Set the data directory for DC/OS configuration. By default, this variable is set to `~/.dcos`.
| `DCOS_LOG_LEVEL` | Prints log messages to `stderr` at or above the level indicated. This is equivalent to the `--log-level` command-line option. |
