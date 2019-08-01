---
layout: layout.pug
navigationTitle:  dcos marathon deployment rollback
title: dcos marathon deployment rollback
menuWeight: 15
excerpt: Removing a deployed application
enterprise: false
render: mustache
model: /1.14/data.yml
---

# Description

The `dcos marathon deployment rollback` command allows you to remove a deployed application.

# Usage

```bash
dcos marathon deployment rollback <deployment-id>
```

# Options

| Name |  Description |
|---------|-------------|
| `-h`, `--help` | Display info about usage of this command. |

## Positional arguments

| Name |  Description |
|---------|-------------|
| `<deployment-id>`   |  The deployment ID. You can view a list of the application IDs with the `dcos marathon deployment list` command. |



# Example

In the following example, we first run `dcos marathon deployment list` to obtain an app ID, then use that to run `dcos marathon deployment rollback` with the `app-id`. The output will list the `deployment-id` and will roll back the app. To verify that the app has been rolled back, use `dcos marathon deployment list` again.

```json
~$ dcos marathon deployment list
APP          POD  ACTION  PROGRESS  ID
/kubernetes  -    scale     1/2     e913f8a4-530c-438c-9f6e-709af1730c84
~$ dcos marathon deployment rollback e913f8a4-530c-438c-9f6e-709af1730c84
{
  "deploymentId": "88169044-d612-4890-8625-5a81da255c76",
  "version": "2019-03-18T20:11:19.737Z"
}
~$ dcos marathon deployment list
There are no deployments
```

# Parent command

| Command | Description |
|---------|-------------|
| [dcos marathon](/mesosphere/dcos/1.14/cli/command-reference/dcos-marathon/) | Deploy and manage applications to DC/OS. |
