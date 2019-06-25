---
layout: layout.pug
navigationTitle:  dcos nifi plan list
title: dcos nifi plan list
menuWeight: 1
excerpt: Show all plans for the NiFi service.
featureMaturity:
enterprise: false
model: ../../../../data.yml
render: mustache
---

# Description
The `dcos nifi plan list` command shows all plans for the NiFi service.


# Usage

```bash
dcos nifi plan list [flags]
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
| [dcos nifi plan](../) | Displays plan related informations and allows plan operations of the NiFi service. |
