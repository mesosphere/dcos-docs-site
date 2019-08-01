---
layout: layout.pug
navigationTitle:  dcos nifi plan start
title: dcos nifi plan start
menuWeight: 3
excerpt: Start the plan with the provided name and any optional plan arguments.
featureMaturity:
enterprise: false
model: ../../../../data.yml
render: mustache
---

# Description
The `dcos nifi plan start` command starts the plan with the provided name and any optional plan arguments.


# Usage

```bash
dcos nifi plan start <plan> [flags]
```

# Options

| Name |  Description |
|---------|-------------|
| `-h, --help`   |  Show context-sensitive help. |
| `-v, --verbose`   |  Enable extra logging of requests/responses |
| `--name="nifi"`   |  Name of the service instance to query |
| `-p, --params=PARAMS`   |  Envvar definition in VAR=value form; can be repeated for multiple variables |



# Parent command

| Command | Description |
|---------|-------------|
| [dcos nifi plan](../) | Displays plan related informations and allows plan operations of the NiFi service. |
