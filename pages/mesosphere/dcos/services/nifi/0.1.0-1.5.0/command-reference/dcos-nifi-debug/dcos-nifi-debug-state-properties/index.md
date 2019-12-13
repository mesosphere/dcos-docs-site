---
layout: layout.pug
navigationTitle:  dcos nifi debug state properties
title: dcos nifi debug state properties
menuWeight: 6
excerpt: List names of all custom properties.
featureMaturity:
enterprise: false
model: ../../../../data.yml
render: mustache
---

# Description
The `dcos nifi debug state properties` command lists names of all custom properties.


# Usage

```bash
dcos nifi debug state properties [flags]
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
