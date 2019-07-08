---
layout: layout.pug
navigationTitle:  dcos security org users grant
title: dcos security org users grant
menuWeight: 205
excerpt: Grant user permissions
render: mustache
model: /1.14/data.yml
enterprise: true
---

# Description

The `dcos security org users grant` command lets you grant a user identified by a specific UID permissin to perform a specified action on an identified resource.

# Options
 
| Name |  Description |
|---------|-------------|
|  `-h`, `--help` |  Show this message and exit.|
| `--description <text>` | The description of the ACL with the given RID. If an ACL exists with the given RID then the description will not be overwritten. Default: "Created with the security CLI".|
| `UID` | User ID. (Required)|
| `RID` | Resource ID. (Required) |

# Usage

```
Usage: dcos security org users grant [OPTIONS] UID RID ACTION

  Grant the user with the given UID permission to enact a given ACTION on the
  resource with the given RID.

Options:
  --description TEXT  The description of the ACL with the given RID. If an ACL
                      exists with the given RID then the description will not be
                      overwritten. Default: "Created with the security CLI".
  -h, --help          Show this message and exit.
```
