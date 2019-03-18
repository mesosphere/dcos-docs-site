---
layout: layout.pug
navigationTitle:  dcos service log
title: dcos service log
menuWeight: 0
excerpt: Displaying the service logs

enterprise: false
---

# Description

The `dcos service log` command displays the service logs.

<table class=“table” bgcolor=#858585>
  <tr> 
    <td align=justify style=color:white><strong>Important:</strong> To view the native DC/OS Marathon logs by using the <code>dcos service log marathon</code> command, you must be on the same network or connected by VPN to your cluster. For more information, see <a href="/1.12/monitoring/logging/quickstart/">Accessing native DC/OS Marathon logs</a>.</td>
  </tr>
</table>

# Usage

```bash
dcos service log <file> <service> [OPTION]
```

# Options

| Name, shorthand | Default | Description |
|---------|-------------|-------------|
| `--follow`   |             |  Dynamically update the log. |
| `--lines=N`   |     10      |  Displays the last N lines. |
| `--ssh-config-file=<path>`   |           | The path to the SSH config file. This is used to access the Marathon logs. |

# Positional arguments

| Name, shorthand |  Description |
|---------|-------------|
| `<file>`   |   The service log filename for the Mesos sandbox. The default is `stdout`. |
| `<service>`   |  The DC/OS service name. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos service](/1.13/cli/command-reference/dcos-service/)   | Manage DC/OS services. |
