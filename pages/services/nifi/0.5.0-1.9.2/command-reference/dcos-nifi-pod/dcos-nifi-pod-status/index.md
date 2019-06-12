---
layout: layout.pug
navigationTitle:  dcos nifi pod status
title: dcos nifi pod status
menuWeight: 2
excerpt: Display the status for tasks in one pod or all pods.
featureMaturity:
enterprise: false
model: ../../../../data.yml
render: mustache
---

# Description
The `dcos nifi pod status` command displays the status for tasks in one pod or all pods.


# Usage

```bash
dcos nifi pod status <pod> [flags]
```

# Options

| Name |  Description |
|---------|-------------|
| `-h, --help`   |  Show context-sensitive help. |
| `-v, --verbose`   |  Enable extra logging of requests/responses |
| `--name="nifi"`   |  Name of the service instance to query |
| `--json`   |  Show raw JSON response instead of user-friendly tree |



# Parent command

| Command | Description |
|---------|-------------|
| [dcos nifi pod](../) | Displays pod related informations and allows pod operations of the NiFi service. |
