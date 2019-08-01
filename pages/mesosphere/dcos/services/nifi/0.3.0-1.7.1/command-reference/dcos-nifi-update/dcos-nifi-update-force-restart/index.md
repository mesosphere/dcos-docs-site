---
layout: layout.pug
navigationTitle:  dcos nifi update force-restart
title: dcos nifi update force-restart
menuWeight: 3
excerpt: Restart update plan, or specific step in the provided phase
featureMaturity:
enterprise: false
model: ../../../../data.yml
render: mustache
---

# Description
The `dcos nifi update force-restart` command restarts update plan, or specific step in the provided phase.


# Usage

```bash
dcos nifi update force-restart <phase> <step> [flags]
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
| [dcos nifi update](../) | Displays update related informations and allows update operations of the NiFi service |
