---
layout: layout.pug
navigationTitle:  dcos marathon app list
title: dcos marathon app list
menuWeight: 3
excerpt: Displaying all installed applications
enterprise: false
render: mustache
model: /1.14/data.yml
---


# Description

The `dcos marathon app list` will display a list of the installed applications.

# Usage

```bash
dcos marathon app list [--json|--quiet]
```

# Options

| Name |  Description |
|---------|-------------|
| `--help`   |  Show this message and exit. |
| `--json`   |   Displays JSON-formatted data. |
| `-q`, `--quiet` | Display IDs only for list. |




# Example

```bash
dcos marathon app list
ID             MEM   CPUS  TASKS  HEALTH  DEPLOYMENT  WAITING  CONTAINER  CMD
/datastax-dse  1024   1     1/1    1/1       ---      False       N/A     export...
/kafka         1024   1     1/1    1/1       ---      False       N/A     export...
/spark         1024   1     0/1    0/0      scale     False      DOCKER   /sbin/init.sh
```

# Parent command

| Command | Description |
|---------|-------------|
| [dcos marathon](/mesosphere/dcos/1.14/cli/command-reference/dcos-marathon/) | Deploy and manage applications to DC/OS. |
