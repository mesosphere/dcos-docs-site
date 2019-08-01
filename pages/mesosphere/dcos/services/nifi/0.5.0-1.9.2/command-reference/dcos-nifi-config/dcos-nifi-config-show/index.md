---
layout: layout.pug
navigationTitle:  dcos nifi config show
title: dcos nifi config show
menuWeight: 2
excerpt: Display a specified configuration.
featureMaturity:
enterprise: false
model: ../../../../data.yml
render: mustache
---

# Description
The `dcos nifi config show` command displays a specified configuration.


# Usage

```bash
dcos nifi config show <config_id> [flags]
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
| [dcos nifi config](../) | Displays configuration related informations of the NiFi service. |
