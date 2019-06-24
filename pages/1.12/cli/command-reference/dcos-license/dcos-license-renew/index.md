---
layout: layout.pug
navigationTitle:  dcos license renew
title: dcos license renew
menuWeight: 3
excerpt: Renewing a cluster license

enterprise: true
---

# Description
The `dcos license renew` command associates a new DC/OS license with the cluster and makes it active. This command uses the license at the given `PATH`. Running the `dcos license renew` command doesn't require a restart of any running services or affect any current payload.

# Usage

```bash
dcos license renew [OPTIONS] PATH
```

# Options

| Name |  Description |
|---------|-------------|
| `--help`   |  Show this message and exit. |

## Positional arguments

| Name |  Description |
|---------|-------------|
| `PATH`  | Specify the path to the file containing the license you want to renew. |

# Examples
For examples, see [Licenses](/1.12/administering-clusters/licenses/).

# Parent command

| Command | Description |
|---------|-------------|
| [dcos license](../../dcos-license/) | Manage DC/OS cluster licenses. |
