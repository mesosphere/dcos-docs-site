---
layout: layout.pug
navigationTitle:  dcos nifi debug pod pause
title: dcos nifi debug pod pause
menuWeight: 9
excerpt: Pause a pod’s tasks for debugging.
featureMaturity:
enterprise: false
model: ../../../../data.yml
render: mustache
---

# Description
The `dcos nifi debug pod pause` command pauses a pod’s tasks for debugging.


# Usage

```bash
dcos nifi debug pod pause <pod> [flags]
```

# Options

| Name |  Description |
|---------|-------------|
| `-h, --help`   |  Show context-sensitive help. |
| `-v, --verbose`   |  Enable extra logging of requests/responses |
| `--name="nifi"`   |  Name of the service instance to query |
| `-t, --tasks=TASKS`   |  List of specific tasks to be paused, otherwise the entire pod |



# Parent command

| Command | Description |
|---------|-------------|
| [dcos nifi debug](../) | Displays debugging related informations and allows debugging for the NiFi service. |
