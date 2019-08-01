---
layout: layout.pug
navigationTitle:  dcos nifi state refresh_cache
title: dcos nifi state refresh_cache
menuWeight: 4
excerpt: Refresh the state cache, used for debugging
featureMaturity:
enterprise: false
model: ../../../../data.yml
render: mustache
---

# Description
The `dcos nifi state refresh_cache` command refreshes the state cache, used for debugging.


# Usage

```bash
dcos nifi state refresh_cache [flags]
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
| [dcos nifi state](../) | Displays state related informations of the NiFi service. |
