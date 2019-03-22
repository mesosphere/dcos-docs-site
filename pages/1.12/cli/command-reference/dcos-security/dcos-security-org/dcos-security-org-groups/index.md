---
layout: layout.pug
navigationTitle:  dcos security org groups
title: dcos security org groups
menuWeight: 120
excerpt: Managing groups and group membership
enterprise: true
---
# Description

The `dcos security org groups` command allows you to manage user groups and group membership.

# Options

| Name |  Description |
|---------|-------------|
|  `-h`, `--help` |  Show this message and exit.|


# Commands

| Name |  Description |
|---------|-------------|
| `add_user`  |  Add user identified by UID to group GID.|
|  `create`  |  Create a group.|
|  `del_user` | Remove user identified by UID from group GID.|
|  `delete`  |  Remove a group.|
|  `grant`  |   Grant the group with the given GID permission to enact a given ACTION on the resource with the given RID.       `--description <text>`  The description of the ACL with the given RID. If an ACL exists with the given RID then the description will not be overwritten. Default: "Created with the DC/OS Enterprise CLI".|
|  `members` |  List members of a group.|
|  `revoke`  |  Revoke permission for the group with the given GID to enact a given ACTION on the resource with the given RID.|
|  `show`  |    Print basic information about a group or groups.|


# Usage 

```
Usage: dcos security org groups [OPTIONS] COMMAND [ARGS]...

  Groups and group membership manipulation.

Options:
  -h, --help  Show this message and exit.

Commands:
  add_user  Add user identified by UID to group GID.
  create    Create a group.
  del_user  Remove user identified by UID from group GID.
  delete    Remove a group.
  grant     Grant the group with the given GID permission...
  members   List members of a group.
  revoke    Revoke permission for the group with the...
  show      Print basic information about a group or...
```

