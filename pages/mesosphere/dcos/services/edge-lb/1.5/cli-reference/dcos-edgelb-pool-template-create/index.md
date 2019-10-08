---
layout: layout.pug
navigationTitle:  dcos edgelb pool-template create
title: dcos edgelb pool-template create
menuWeight: 45
excerpt: Create a self service auto pool template
enterprise: true
---

# Description
The `dcos edgelb pool-template create` command creates a self service auto pool template.

The configuration for a pool is generated using a template named `pool.json.ctmpl`. It is possible for advanced users to modify and upload a custom version of this template.

# Usage

```bash
dcos edgelb pool-template create <name>
```

# Options

| Name, shorthand | Description |
|---------|-------------|
| `--help, h`   | Display usage. |
| `--verbose`   | Enable additional logging of requests and responses. |
| `--name="<name>"`   | Name of the service instance to query. |
| `--json` | Show unparsed JSON response. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos edgelb](../../cli-reference/) |  Manage Edge-LB. |

# Examples

See the [Edge-LB Usage](../../usage/).
