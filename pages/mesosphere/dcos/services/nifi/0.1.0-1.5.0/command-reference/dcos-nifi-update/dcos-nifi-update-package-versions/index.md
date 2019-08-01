---
layout: layout.pug
navigationTitle:  dcos nifi update package-versions
title: dcos nifi update package-versions
menuWeight: 4
excerpt: View a list of available package versions to downgrade or upgrade to
featureMaturity:
enterprise: false
model: ../../../../data.yml
render: mustache
---

# Description
The `dcos nifi update package-versions` command displays a list of available package versions to downgrade or upgrade to.


# Usage

```bash
dcos nifi update package-versions [flags]
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
