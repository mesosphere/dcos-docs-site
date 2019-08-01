---
layout: layout.pug
navigationTitle:  dcos nifi debug state property
title: dcos nifi debug state property
menuWeight: 7
excerpt: Display the content of a specified property.
featureMaturity:
enterprise: false
model: ../../../../data.yml
render: mustache
---

# Description
The `dcos nifi debug state property` command displays the content of a specified property.


# Usage

```bash
dcos nifi debug state property <name> [flags]
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
