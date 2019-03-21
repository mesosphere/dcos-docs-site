---
layout: layout.pug
navigationTitle:  dcos security org groups members
title: dcos security org groups members
menuWeight: 145
excerpt: Listing members of a group
enterprise: true
---
# Description

The `dcos security org groups members` command will list all the members in a group.

# Options

| Name |  Description |
|---------|-------------|
|  `-h`, `--help` |  Show this message and exit.|
| `-j`, `--json` | Output data in JSON format. |
| `GID` | Group ID. (Required)|

# Usage

```
Usage: dcos security org groups members [OPTIONS] GID

  List members of a group.

Options:
  -j, --json  Output data in JSON format.
  -h, --help  Show this message and exit.
```