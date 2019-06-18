---
layout: layout.pug
navigationTitle:  dcos nifi pod restart
title: dcos nifi pod restart
menuWeight: 4
excerpt: Restart a given pod without moving it to a new agent.
featureMaturity:
enterprise: false
model: ../../../../data.yml
render: mustache
---

# Description
The `dcos nifi pod restart` command restarts a given pod without moving it to a new agent.


# Usage

```bash
dcos nifi pod restart <pod> [flags]
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
