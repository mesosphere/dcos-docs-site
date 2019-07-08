---
layout: layout.pug
navigationTitle:  dcos security org users revoke
title: dcos security org users revoke
menuWeight: 205
excerpt: Revoking user permissions
render: mustache
model: /1.14/data.yml
enterprise: true
---

# Description

The `security org users revoke` command will revoke a designated user's permission to perform a given action on a designated resource.

# Options
 
| Name |  Description |
|---------|-------------|
|  `-h`, `--help` |  Show this message and exit.|
| `UID` | User ID. (Required)|
| `RID` | Resource ID. (Required) |
| `ACTION` | Designated action.|

# Usage

```
Usage: security org users revoke [OPTIONS] UID RID ACTION

  Revoke permission for the user with the given UID to enact a given ACTION on
  the resource with the given RID.

Options:
  -h, --help  Show this message and exit.
```
