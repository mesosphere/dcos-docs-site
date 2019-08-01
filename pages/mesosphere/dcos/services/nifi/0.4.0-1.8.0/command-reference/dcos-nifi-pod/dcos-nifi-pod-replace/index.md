---
layout: layout.pug
navigationTitle:  dcos nifi pod replace
title: dcos nifi pod replace
menuWeight: 5
excerpt: Destroy a given pod and moves it to a new agent.
featureMaturity:
enterprise: false
model: ../../../../data.yml
render: mustache
---

# Description
The `dcos nifi pod replace` command destroys a given pod and moves it to a new agent.


# Usage

```bash
dcos nifi pod replace <pod> [flags]
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
