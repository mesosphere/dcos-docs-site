---
layout: layout.pug
navigationTitle:  dcos nifi update status
title: dcos nifi update status
menuWeight: 7
excerpt: View status of a running update
featureMaturity:
enterprise: false
model: ../../../../data.yml
render: mustache
---

# Description
The `dcos nifi update status` command displays status of a running update.


# Usage

```bash
dcos nifi update status [flags]
```

# Options

| Name |  Description |
|---------|-------------|
| `-h, --help`   |  Show context-sensitive help. |
| `-v, --verbose`   |  Enable extra logging of requests/responses |
| `--name="nifi"`   |  Name of the service instance to query |
| `--json`   |  Show raw JSON response instead of user-friendly tree |


# Parent command

| Command | Description |
|---------|-------------|
| [dcos nifi update](../) | Displays update related informations and allows update operations of the NiFi service |
