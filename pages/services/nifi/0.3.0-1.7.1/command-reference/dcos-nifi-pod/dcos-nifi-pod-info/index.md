---
layout: layout.pug
navigationTitle:  dcos nifi pod info
title: dcos nifi pod info
menuWeight: 3
excerpt: Display the full state information for tasks in a pod.
featureMaturity:
enterprise: false
model: ../../../../data.yml
render: mustache
---

# Description
The `dcos nifi pod info` command displays the full state information for tasks in a pod.


# Usage

```bash
dcos nifi pod info <pod> [flags]
```

# Options

| Name |  Description |
|---------|-------------|
| `-h, --help`   |  Show context-sensitive help. |
| `-v, --verbose`   |  Enable extra logging of requests/responses |
| `--name="nifi"`   |  Name of the service instance to query |



# Parent command

| Command | Description |
|---------|-------------|
| [dcos nifi pod](../) | Displays pod related informations and allows pod operations of the NiFi service. |
