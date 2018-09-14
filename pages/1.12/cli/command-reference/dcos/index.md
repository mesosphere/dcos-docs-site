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

*Table 1 - Options*

| Name | Description |
|---------|-------------|-------------|
| `--debug`   |  Enable debug mode. |
| `--help, h`   |  Display usage. |
| `--log-level=<log-level>`  | Set the logging level. This setting does not affect the output sent to `stdout`.  |
|  `--version, v`  |  Display version information.  |
| `<log-level>` | The severity levels are shown in Table 2. |

*Table 2 - `log-level` severity levels*

| Name |  Description |
|---------|-------------|
| debug | Displays all messages.|
|info | Displays informational, warning, error, and critical messages.|
| warning | Displays warning, error, and critical messages. |
| error | Displays error and critical messages. |
| critical | Displays only critical messages to `stderr`. |
