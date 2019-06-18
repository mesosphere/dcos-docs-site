---
layout: layout.pug
navigationTitle:  dcos nifi plan resume
title: dcos nifi plan resume
menuWeight: 6
excerpt: Resume the plan, or a specific phase in that plan with the provided phase name (or UUID).
featureMaturity:
enterprise: false
model: ../../../../data.yml
render: mustache
---

# Description
The `dcos nifi plan resume` command resumes the plan, or a specific phase in that plan with the provided phase name (or UUID).


# Usage

```bash
dcos nifi plan resume <plan> <phase> [flags]
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
