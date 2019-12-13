---
layout: layout.pug
navigationTitle:  dcos nifi debug config list
title: dcos nifi debug config list
menuWeight: 1
excerpt: List IDs of all available configurations.
featureMaturity:
enterprise: false
model: ../../../../data.yml
render: mustache
---

# Description
The `dcos nifi debug config list` command lists IDs of all available configurations.


# Usage

```bash
dcos nifi debug config list [flags]
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
| [dcos nifi debug](../) | Displays debugging related informations and allows debugging for the NiFi service. |
