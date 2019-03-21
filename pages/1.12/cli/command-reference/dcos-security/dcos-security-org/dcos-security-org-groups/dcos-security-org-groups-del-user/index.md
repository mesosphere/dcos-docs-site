---
layout: layout.pug
navigationTitle:  dcos security org groups del_user
title: dcos security org groups del_user
menuWeight: 135
excerpt: Deleting a user from a group
enterprise: true
---
# Description

The `dcos security org groups del_user` command allows you to delete a user from a group.

# Options

| Name |  Description |
|---------|-------------|
|  `-h`, `--help` |  Show this message and exit.|
| `UID` | User ID. (Required)|
| `GID` | Group ID. (Required)|


# Usage

```
Usage: dcos security org groups del_user [OPTIONS] GID UID

  Remove user identified by UID from group GID.

Options:
  -h, --help  Show this message and exit.
```