---
layout: layout.pug
navigationTitle:  dcos marathon app stop
title: dcos marathon app stop
menuWeight: 8
excerpt: Stopping an application
render: mustache
model: /mesosphere/dcos/2.0/data.yml
enterprise: false
---


# Description

The `dcos marathon app stop` command allows you to stop an application.

# Usage

```bash
dcos marathon app stop [--force] <app-id>
```

# Options

| Name |  Description |
|---------|-------------|
| `-h`, `--help` | Display info about usage of this command. |
| `--force`   |  Disable checks in Marathon during updates. |

## Positional arguments

| Name |  Description |
|---------|-------------|
| `<app-id>`   |   The application ID.  You can view a list of the application IDs with the `dcos marathon app list` command. |



# Example

In the following example, we first run `dcos marathon app list` to get a list of currently deployed apps. After running the command `dcos marathon app stop <app-id>`, the system returns a deployment number. However, to confirm that the app has really been stopped, run `dcos marathon app list` again. This time you will see that the Kafka app shows zero tasks and zero health, indicating that it has stopped.

```bash
~$ dcos marathon app list
ID      MEM   CPUS  TASKS  HEALTH  DEPLOYMENT  WAITING  CONTAINER  CMD
/kafka  1024   1     1/1    1/1       ---      False       N/A     export...
/spark  1024   1     1/1    1/1       ---      False      DOCKER   /sbin/init.sh
~$ dcos marathon app stop kafka
Created deployment e2c02572-a673-41b9-ad67-cf1b7c042a91
~$ dcos marathon app list
ID      MEM   CPUS  TASKS  HEALTH  DEPLOYMENT  WAITING  CONTAINER  CMD
/kafka  1024   1     0/0    0/0       ---      False       N/A     export...
/spark  1024   1     1/1    1/1       ---      False      DOCKER   /sbin/init.sh
```

# Parent command

| Command | Description |
|---------|-------------|
| [dcos marathon](/mesosphere/dcos/2.0/cli/command-reference/dcos-marathon/) | Deploy and manage applications to DC/OS. |
