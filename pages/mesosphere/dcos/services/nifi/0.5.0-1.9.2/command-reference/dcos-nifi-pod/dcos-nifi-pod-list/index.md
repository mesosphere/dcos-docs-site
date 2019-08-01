---
layout: layout.pug
navigationTitle:  dcos nifi pod list
title: dcos nifi pod list
menuWeight: 1
excerpt: Display the list of known pod instances
featureMaturity:
enterprise: false
model: ../../../../data.yml
render: mustache
---

# Description
The `dcos nifi pod list` command displays the list of known pod instances.


# Usage

```bash
dcos nifi pod list [flags]
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
| [dcos nifi pod](../) | Displays pod related informations and allows pod operations of the NiFi service. |
