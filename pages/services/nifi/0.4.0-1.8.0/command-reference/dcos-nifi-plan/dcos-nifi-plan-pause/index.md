---
layout: layout.pug
navigationTitle:  dcos nifi plan pause
title: dcos nifi plan pause
menuWeight: 5
excerpt: Pause the plan, or a specific phase in that plan with the provided phase name (or UUID).
featureMaturity:
enterprise: false
model: ../../../../data.yml
render: mustache
---

# Description
The `dcos nifi plan pause` command pauses the plan, or a specific phase in that plan with the provided phase name (or UUID).


# Usage

```bash
dcos nifi plan pause <plan> <phase> [flags]
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
