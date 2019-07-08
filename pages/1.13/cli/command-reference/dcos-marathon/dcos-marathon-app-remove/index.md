---
layout: layout.pug
navigationTitle:  dcos marathon app remove
title: dcos marathon app remove
menuWeight: 4
excerpt: Removing an application
enterprise: false
render: mustache
model: /1.13/data.yml
---


# Description

The `dcos marathon app remove` command allows you to remove an application.

# Usage

```bash
dcos marathon app remove [--force] <app-id>
```

# Options

| Name |  Description |
|---------|-------------|
| `--help`   |  Show this message and exit. |
| `--force`   |  Disable checks in Marathon during updates. |

## Positional arguments

| Name |  Description |
|---------|-------------|
| `<app-id>`   |  The application ID.  You can view a list of the application IDs with the `dcos marathon app list` command. |




# Example

Note in the following examples that no output is displayed after a successful `remove` operation. To verify that the `remove` operation was successful, run `dcos marathon app list`.


```bash
$ dcos marathon app list
ID             MEM   CPUS  TASKS  HEALTH  DEPLOYMENT  WAITING  CONTAINER  CMD
/datastax-dse  1024   1     1/1    1/1       ---      False       N/A     export...
/spark         1024   1     1/1    1/1       ---      False      DOCKER   /sbin/init.sh
~$ dcos marathon app remove datastax-dse
~$ dcos marathon app list
ID      MEM   CPUS  TASKS  HEALTH  DEPLOYMENT  WAITING  CONTAINER  CMD
/spark  1024   1     1/1    1/1       ---      False      DOCKER   /sbin/init.sh
```

You can also use the `--force` option to disable Marathon checks:

```bash
~$ dcos marathon app list
ID           MEM   CPUS  TASKS  HEALTH  DEPLOYMENT  WAITING  CONTAINER  CMD
/cassandra   1024   1     1/1    1/1       ---      False       N/A     export...
/kafka       1024   1     0/0    0/0       ---      False       N/A     export...
/kubernetes  1024   1     0/1    0/0      scale     True        N/A     export...
/spark       1024   1     1/1    1/1       ---      False      DOCKER   /sbin/init.sh
~$ dcos marathon app remove --force kafka
~$ dcos marathon app list
ID           MEM   CPUS  TASKS  HEALTH  DEPLOYMENT  WAITING  CONTAINER  CMD
/cassandra   1024   1     1/1    1/1       ---      False       N/A     export...
/kubernetes  1024   1     0/1    0/0      scale     True        N/A     export...
/spark       1024   1     1/1    1/1       ---      False      DOCKER   /sbin/init.sh
```

# Parent command

| Command | Description |
|---------|-------------|
| [dcos marathon](/1.13/cli/command-reference/dcos-marathon/) | Deploy and manage applications to DC/OS. |
