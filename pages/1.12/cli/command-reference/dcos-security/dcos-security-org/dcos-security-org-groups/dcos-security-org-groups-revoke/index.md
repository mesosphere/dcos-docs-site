---
layout: layout.pug
navigationTitle:  dcos security org groups revoke
title: dcos security org groups revoke
menuWeight: 155
excerpt: Revoke permission for a group to act on a resource
enterprise: true
---
# Description

The `dcos security org groups revoke` command will let you revoke permission for a group to act on a designated resource. 

# Options

| Name |  Description |
|---------|-------------|
|  `-h`, `--help` |  Show this message and exit.|
| `GID` | Group ID. (Required)|
| `RID` | Resource ID. (Required)|


# Usage

```
Usage: security org groups revoke [OPTIONS] GID RID ACTION

  Revoke permission for the group with the given GID to enact a given ACTION
  on the resource with the given RID.

Options:
  -h, --help  Show this message and exit.
```
