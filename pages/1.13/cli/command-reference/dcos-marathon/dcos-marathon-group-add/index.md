---
layout: layout.pug
navigationTitle:  dcos marathon group add
title: dcos marathon group add
menuWeight: 17
excerpt: Adding a Marathon group

enterprise: false
---


# Description
The `dcos marathon group add` command allows you to add a Marathon group.

# Usage

```bash
dcos marathon group add <group-resource> [OPTION]
```

# Options

None.

# Positional arguments

| Name, shorthand |  Description |
|---------|-------------|
| `<group-resource>`   | Path to a file or HTTP(S) URL that contains the group's JSON definition. If omitted, the definition is read from `stdin`. For a detailed description see the [documentation](/1.13/deploying-services/marathon-api/). |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos marathon](/1.13/cli/command-reference/dcos-marathon/) | Deploy and manage applications to DC/OS. |

