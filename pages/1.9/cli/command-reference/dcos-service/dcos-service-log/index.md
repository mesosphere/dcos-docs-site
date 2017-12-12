---
layout: layout.pug
navigationTitle:  dcos service log
title: dcos service log
menuWeight: 0
excerpt:

enterprise: false
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->


# Description
Print the service logs.

**Important:** To view the native DC/OS Marathon logs by using the `dcos service log marathon` command, you must be on the same network or connected by VPN to your cluster. For more information, see [Accessing native DC/OS Marathon logs](/1.9/monitoring/logging/quickstart/).

# Usage

```bash
dcos service log <file> <service> [OPTION]
```

# Options

| Name, shorthand | Default | Description |
|---------|-------------|-------------|
| `--follow`   |             |  Dynamically update the log. |
| `--lines=N`   |     10      |  Print the last N lines. |
| `--ssh-config-file=<path>`   |           | The path to the SSH config file. This is used to access the Marathon logs. |

# Positional arguments

| Name, shorthand | Default | Description |
|---------|-------------|-------------|
| `<file>`   |             |  The service log filename for the Mesos sandbox. The default is stdout. |
| `<service>`   |           | The DC/OS service name. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos service](/1.9/cli/command-reference/dcos-service/)   | Manage DC/OS services. | 
