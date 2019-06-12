---
layout: layout.pug
navigationTitle:  dcos nifi debug state framework_id
title: dcos nifi debug state framework_id
menuWeight: 5
excerpt: Display the Mesos framework ID.
featureMaturity:
enterprise: false
model: ../../../../data.yml
render: mustache
---

# Description
The `dcos nifi debug state framework_id` command displays the Mesos framework ID.


# Usage

```bash
dcos nifi debug state framework_id [flags]
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
| [dcos nifi debug](../) | Displays debugging related informations and allows debugging for the NiFi service. |
