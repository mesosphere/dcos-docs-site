---
layout: layout.pug
navigationTitle:  dcos nifi state property
title: dcos nifi state property
menuWeight: 3
excerpt: Display the content of a specified property
featureMaturity:
enterprise: false
model: ../../../../data.yml
render: mustache
---

# Description
The `dcos nifi state property` command displays the content of a specified property.


# Usage

```bash
dcos nifi state property <name> [flags]
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
