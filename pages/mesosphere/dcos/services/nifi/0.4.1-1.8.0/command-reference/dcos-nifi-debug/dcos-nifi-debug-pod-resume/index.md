---
layout: layout.pug
navigationTitle:  dcos nifi debug pod resume
title: dcos nifi debug pod resume
menuWeight: 10
excerpt: Resume a pod’s normal execution following a pause command.
featureMaturity:
enterprise: false
model: ../../../../data.yml
render: mustache
---

# Description
The `dcos nifi debug pod resume` command resumes a pod’s normal execution following a pause command.


# Usage

```bash
dcos nifi debug pod resume <pod> [flags]
```

# Options

| Name |  Description |
|---------|-------------|
| `-h, --help`   |  Show context-sensitive help. |
| `-v, --verbose`   |  Enable extra logging of requests/responses |
| `-t, --tasks=TASKS`   |  List of specific tasks to be resumed, otherwise the entire pod |



# Parent command

| Command | Description |
|---------|-------------|
| [dcos nifi debug](../) | Displays debugging related informations and allows debugging for the NiFi service. |
