---
layout: layout.pug
navigationTitle:  dcos nifi plan stop
title: dcos nifi plan stop
menuWeight: 4
excerpt: Stop the running plan with the provided name.
featureMaturity:
enterprise: false
model: ../../../../data.yml
render: mustache
---

# Description
The `dcos nifi plan stop` command Stops the running plan with the provided name.


# Usage

```bash
dcos nifi plan stop <plan> [flags]
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
