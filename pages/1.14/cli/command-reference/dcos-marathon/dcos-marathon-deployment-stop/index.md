---
layout: layout.pug
navigationTitle:  dcos marathon deployment stop
title: dcos marathon deployment stop
menuWeight: 16
excerpt: Cancelling in-progress application deployment
enterprise: false
render: mustache
model: /1.14/data.yml
---


# Description

The `dcos marathon deployment stop` command allows you to cancel the in-progress deployment of an application.

# Usage

```bash
dcos marathon deployment stop <deployment-id>
```

# Options

| Name |  Description |
|---------|-------------|
| `-h`, `--help` | Display info about usage of this command. |

## Positional arguments

| Name |  Description |
|---------|-------------|
| `<deployment-id>`   |   The deployment ID. You can view a list of the deployment IDs with the `dcos marathon deployment list` command. |




# Example

In the following example, we will first run `dcos marathon deployment list` to obtain the deployment ID, then run `dcos marathon deployment stop` with the `deployment-id` to stop deployment. The system does not provide any confirmation output, so we run `dcos marathon deployment list` again to confirm that the deployment has stopped.

```bash
dcos marathon deployment list
APP                   POD  ACTION  PROGRESS  ID
/confluent-zookeeper  -    scale     1/2     09db9c92-5662-4613-bff1-d20c3c876466
dcos marathon deployment stop 09db9c92-5662-4613-bff1-d20c3c876466
dcos marathon deployment list
There are no deployments
```

# Parent command

| Command | Description |
|---------|-------------|
| [dcos marathon](/mesosphere/dcos/1.14/cli/command-reference/dcos-marathon/) | Deploy and manage applications to DC/OS. |
