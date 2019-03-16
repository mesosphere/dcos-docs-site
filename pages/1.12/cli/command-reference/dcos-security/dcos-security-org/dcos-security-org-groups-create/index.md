---
layout: layout.pug
navigationTitle:  dcos security org groups create
title: dcos security org groups create
menuWeight: 130
excerpt: Creating a user group
enterprise: true
---
# Description
The `dcos security org groups create` command allows you to create a new group.

# Options

| Name |  Description |
|---------|-------------|
| `d`, `--description <text>` | Description of group.|
|  `-h`, `--help` |  Show this message and exit.|
| `GID` | Group ID. (Required)|

```
Usage: dcos security org groups create [OPTIONS] GID

  Create a group.

Options:
  -d, --description TEXT
  -h, --help              Show this message and exit.
```