---
layout: layout.pug
navigationTitle:  dcos license renew
title: dcos license renew
menuWeight: 3
excerpt: Renewing a cluster license

enterprise: true
---

# Description
The `dcos license renew` command allows you to manage a cluster license. This command uses the license at the given `PATH`. Running the `dcos license renew` command doesn't require a restart of any running services or affect any current payload.

# Usage

```bash
dcos license renew [OPTIONS] PATH
```

# Positional arguments

| Name, shorthand |  Description |
|--------|-------------|
| `PATH` | Specify the path to a file containing the license. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos license](../../dcos-license/) | Manage DC/OS cluster licenses. |

# Examples
For examples, see [Licenses](/1.11/administering-clusters/licenses/).