---
layout: layout.pug
navigationTitle:  dcos edgelb show
title: dcos edgelb show
menuWeight: 35
excerpt: Show the pool definition for a specific pool name

enterprise: false
---

# Description
The `dcos edgelb show` command shows the pool definition for a given pool name. If pool-name is omitted, all pool configurations are shown.

# Usage

```bash
dcos edgelb show [<flags>] [<pool-name>]
```

# Options

| Name, shorthand | Description |
|---------|-------------|
| `--help, h`   | Display usage. |
| `--verbose`   | Enable additional logging of requests and responses. |
| `--name="<name>"`   | Name of the service instance to query. |
| `--reference` | Display the configuration reference. |
| `--convert-to-json=<pool-file>` | Converts local YAML file to JSON. |
| `--json` | Show unparsed JSON response. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos edgelb](/services/edge-lb/1.1/cli-reference/) |  Manage Edge-LB. |

# Examples

See the [Edge-LB Usage](/services/edge-lb/1.1/usage/).
