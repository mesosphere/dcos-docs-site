---
layout: layout.pug
navigationTitle:  dcos security org users
title: dcos security org users
menuWeight: 185
excerpt: Managing users
enterprise: true
---

# Description

The `dcos security org users` command lets you manage your user permissions.

# Options
 
| Name |  Description |
|---------|-------------|
|  `-h`, `--help` |  Show this message and exit.|
| `UID` | User ID. (Required)|


# Commands 

| Name |  Description |
|---------|-------------|
| `-create` | Create a new user.  |
| `delete` |  Delete user identified by UID.  |
| `grant` |  Grant the user with the given UID permission.  |
| `revoke` |  Revoke permission for the user with the given...|
| `show` |  Print information about a user or users  |

# Usage

```
Usage: dcos security org users [OPTIONS] COMMAND [ARGS]...

  Users manipulation.

Options:
  -h, --help  Show this message and exit.

Commands:
  create  Create a new user.
  delete  Delete user identified by UID.
  grant   Grant the user with the given UID permission...
  revoke  Revoke permission for the user with the given...
  show    Print information about a user or users.
```
