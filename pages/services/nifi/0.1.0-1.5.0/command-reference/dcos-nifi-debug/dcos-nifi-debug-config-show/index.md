---
layout: layout.pug
navigationTitle:  dcos nifi debug config show
title: dcos nifi debug config show
menuWeight: 2
excerpt: Display a specified configuration.
featureMaturity:
enterprise: false
model: ../../../../data.yml
render: mustache
---

# Description
The `dcos nifi debug config show` command displays a specified configuration.


# Usage

```bash
dcos nifi debug config show <config_id> [flags]
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
