---
layout: layout.pug
navigationTitle:  dcos service log
title: dcos service log
menuWeight: 1
excerpt: Displaying the service logs
render: mustache
model: /1.14/data.yml
enterprise: false
---

# Description

The `dcos service log` command displays the service logs.

<p class="message--important"><strong>IMPORTANT: </strong> To view the native DC/OS Marathon logs using the <code>dcos service log marathon</code> command, you must be on the same network or connected by VPN to your cluster. For more information, see <a href="/1.14/monitoring/logging/quickstart/">Accessing native DC/OS Marathon logs.</p>

# Usage

```bash
dcos service log [--follow --lines=N --ssh-config-file=<path> --user=<user>] <service> [<file>]
```

# Options

| Name | Default | Description |
|---------|-------------|-------------|
| `--follow`   |             |  Print data as the log file grows. |
| `--lines=N`   |     10      |  Displays the last N lines. |
| `--ssh-config-file=<path>`   |           | The path to the SSH config file. This is used to access the Marathon logs. |
| `--user=<user>` | User ID. |

## Positional arguments

| Name |  Description |
|---------|-------------|
| `<file>`   |   The service log filename for the Mesos sandbox. The default is `stdout`. |
| `<service>`   |  The DC/OS service name. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos service](/mesosphere/dcos/1.14/cli/command-reference/dcos-service/)   | Manage DC/OS services. |
