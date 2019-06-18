---
layout: layout.pug
navigationTitle:  dcos nifi plan status
title: dcos nifi plan status
menuWeight: 2
excerpt: Display the status of the plan with the provided plan name.
featureMaturity:
enterprise: false
model: ../../../../data.yml
render: mustache
---

# Description
The `dcos nifi plan status` command displays the status of the plan with the provided plan name.


# Usage

```bash
dcos nifi plan status <plan> [flags]
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
| [dcos nifi plan](../) | Displays plan related informations and allows plan operations of the NiFi service. |
