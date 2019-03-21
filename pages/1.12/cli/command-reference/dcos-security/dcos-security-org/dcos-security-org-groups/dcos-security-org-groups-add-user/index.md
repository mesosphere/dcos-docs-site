---
layout: layout.pug
navigationTitle:  dcos security org groups add_user
title: dcos security org groups add_user
menuWeight: 125
excerpt: Adding a user to a group
enterprise: true
---
# Description

The `dcos security org groups add_user` command allows you to add users to a specified user group.

# Options

| Name |  Description |
|---------|-------------|
|  `-h`, `--help` |  Show this message and exit.|
| `GID` | Group ID. (Required)|
| `UID` | User ID. (Required)|


# Usage

```
Usage: dcos security org groups add_user [OPTIONS] GID UID

  Add user identified by UID to group GID.

Options:
  -h, --help  Show this message and exit.
```