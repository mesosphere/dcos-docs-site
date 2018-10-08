---
layout: layout.pug
navigationTitle:  dcos
title: dcos
menuWeight: 0
excerpt: Managing DC/OS environment variables
enterprise: false
---

# Description
The `dcos` command allows you to manage DC/OS environment variables.

# Usage

``` bash
dcos [options] [<command>] [<args>...]
```

# Options

Table 1. Options

| Name | Description |
|---------|-------------|-------------|
| `--debug`   |  Enable debug mode. |
| `--help, h`   |  Display usage. |
| `--log-level=<log-level>`  | Set the logging level. This setting does not affect the output sent to `stdout`.  |
|  `--version, v`  |  Display version information.  |
| `<log-level>` | The severity levels are shown in Table 2. |

Table 2. `log-level` severity levels

| Name |  Description |
|---------|-------------|
| debug | Display all messages.|
| info | Display informational, warning, error, and critical messages.|
| warning | Display warning, error, and critical messages. |
| error | Display error and critical messages. |
| critical | Display only critical messages to `stderr`. |
