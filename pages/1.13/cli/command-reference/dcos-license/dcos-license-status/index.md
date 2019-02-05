---
layout: layout.pug
navigationTitle:  dcos license status
title: dcos license status
menuWeight: 4
excerpt: Reviewing the cluster license status

enterprise: true
---

# Description
The `dcos license status` command displays the cluster license status.

# Usage

```bash
dcos license status  [--terms] [--breaches]
```

# Options

| Name, shorthand |  Description |
|---------|-------------|
| `--terms`   |   Displays the terms of contract. |
| `--breaches`   |   Displays the number of breaches. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos license](/1.13/cli/command-reference/dcos-license/) | Manage DC/OS cluster licenses. |

# Examples
For examples, see [Licenses](/1.13/administering-clusters/licenses/).
