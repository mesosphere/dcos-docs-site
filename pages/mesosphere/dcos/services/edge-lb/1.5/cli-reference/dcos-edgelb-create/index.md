---
layout: layout.pug
navigationTitle:  dcos edgelb create
title: dcos edgelb create
menuWeight: 5
excerpt: Create a single pool given a definition file written in JSON or YAML
enterprise: true
---

# Description
The `dcos edgelb create` command creates a single pool from a definition file written in JSON or YAML.

# Usage

```bash
dcos edgelb create [<flags>] <pool-file>
```

# Options

| Name, shorthand | Description |
|---------|-------------|
| `--help, h`   | Display usage. |
| `--verbose`   | Enable additional logging of requests and responses. |
| `--name="<name>"`   | Name of the service instance to query. |
| `--json`  | Show unparsed JSON response. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos edgelb](../../cli-reference/) |  Manage Edge-LB. |

# Examples

See the [Edge-LB Usage](../../usage/).
