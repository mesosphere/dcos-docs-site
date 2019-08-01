---
layout: layout.pug
navigationTitle:  dcos marathon deployment watch
title: dcos marathon deployment watch
menuWeight: 16
excerpt: Monitoring application deployments
render: mustache
model: /mesosphere/dcos/1.14/data.yml
enterprise: false
---


# Description

The `dcos marathon deployment watch` command allows you to monitor deployments.

# Usage

```bash
dcos marathon deployment watch [--max-count=<max-count>] [--interval=<interval>] <deployment-id>
```

# Options

| Name | Description |
|---------|-------------|
| `--interval=<interval>`   |  Number of seconds to wait between actions. |
| `--max-count=<max-count>`   |   Maximum number of entries to fetch and return. |
| `-h`, `--help` | Display info about usage of this command. |


## Positional arguments

| Name |  Description |
|---------|-------------|
| `<deployment-id>`   | The deployment ID. You can view a list of the deployment IDs with the `dcos marathon deployment list` command.|


# Example

The `dcos marathon deployment watch` command does not return a confirmation message, so run `dcos marathon deployment list` to see the status of your deployment.

```
$ dcos marathon deployment watch confluent-zookeeper
~$ dcos marathon deployment list
APP                   POD  ACTION   PROGRESS  ID
/confluent-zookeeper  -    restart    0/1     ec0f4f22-ed8c-4bc1-ad55-5854603e257a
```

# Parent command

| Command | Description |
|---------|-------------|
| [dcos marathon](/mesosphere/dcos/1.14/cli/command-reference/dcos-marathon/) | Deploy and manage applications to DC/OS. |
