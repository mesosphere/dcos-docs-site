---
layout: layout.pug
navigationTitle:  dcos security org groups show
title: dcos security org groups show
menuWeight: 159
excerpt: Viewing information about a group
enterprise: true
---


# Options

| Name |  Description |
|---------|-------------|
|  `-h`, `--help` |  Show this message and exit.|
| `-j`, `--json` | Output data in JSON format. |
| `GID` | Group ID. (Required)|
| `RID` | Resource ID. (Required)|
| `description <text>` | The description of the ACL with the given RID. If an ACL exists with the given RID then the description will not be overwritten. Default: "Created with the security CLI". |

# Usage

```
dcos security org groups grant [OPTIONS] GID RID ACTION

    Grant the group with the given GID permission to enact a given ACTION on the
    resource with the given RID.

Options:
    --description TEXT
        The description of the ACL with the given RID. If an ACL
        exists with the given RID then the description will not be
        overwritten. Default: "Created with the security CLI".
    -h, --help
        Show this message and exit.
```