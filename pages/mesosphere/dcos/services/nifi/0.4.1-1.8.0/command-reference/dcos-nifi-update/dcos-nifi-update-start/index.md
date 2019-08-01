---
layout: layout.pug
navigationTitle:  dcos nifi update start
title: dcos nifi update start
menuWeight: 1
excerpt: Launches an update operation
featureMaturity:
enterprise: false
model: ../../../../data.yml
render: mustache
---

# Description
The `dcos nifi update start` command launches an update operation.


# Usage

```bash
dcos nifi update start [flags]
```

# Options

| Name |  Description |
|---------|-------------|
| `-h, --help`   |  Show context-sensitive help. |
| `-v, --verbose`   |  Enable extra logging of requests/responses |
| `--name="nifi"`   |  Name of the service instance to query |
| `--options=OPTIONS`   |  Path to a JSON file that contains customized package installation options |
| `--package-version=PACKAGE-VERSION`   |  he desired package version |
| `--replace"`   |  Replace the existing configuration in whole. Otherwise, the existing configuration and options are merged. |



# Parent command

| Command | Description |
|---------|-------------|
| [dcos nifi update](../) | Displays update related informations and allows update operations of the NiFi service |
