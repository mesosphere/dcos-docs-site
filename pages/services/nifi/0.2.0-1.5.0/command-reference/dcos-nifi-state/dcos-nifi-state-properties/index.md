---
layout: layout.pug
navigationTitle:  dcos nifi state properties
title: dcos nifi state properties
menuWeight: 2
excerpt: List names of all custom properties
featureMaturity:
enterprise: false
model: ../../../../data.yml
render: mustache
---

# Description
The `dcos nifi state properties` command diplays list names of all custom properties.


# Usage

```bash
dcos nifi state properties [flags]
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
| [dcos nifi state](../) | Displays state related informations of the NiFi service. |
