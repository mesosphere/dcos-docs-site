---
layout: layout.pug
navigationTitle:  dcos
title: dcos
menuWeight: 0
excerpt: Managing DC/OS environment variables

enterprise: false
---

# Description

The `dcos` command helps you manage DC/OS environment variables.

# Usage

``` bash
dcos [options] [<command>] [<args>...]
```

# Options

| Name | Description |
|---------|-------------|-------------|
| `--help, h`   |  Display usage. |
|  `--vv`, `v`  |  Output verbosity (verbose or very verbose)  |
| `--version` | Display version information. |
| `--log-level=<log-level>`  | Set the logging level. This setting does not affect the output sent to `stdout`.  See below for severity levels. |


# Log level severity

| Name |  Description |
|---------|-------------|
| `debug` | Displays all messages.|
|`info` | Displays informational, warning, error, and critical messages.|
| `warning` | Displays warning, error, and critical messages. |
| `error` | Displays error and critical messages. |
| `critical` | Displays only critical messages to `stderr`. |
