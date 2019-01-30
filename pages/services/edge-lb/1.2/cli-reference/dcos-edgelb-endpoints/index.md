---
layout: layout.pug
navigationTitle:  dcos edgelb endpoints
title: dcos edgelb endpoints
menuWeight: 15
excerpt: List all endpoints for a pool

enterprise: false
---

# Description
The `dcos edgelb endpoints` command returns a list of all endpoints for a pool. The internal IP address and ports for a pool can be found with this command.


# Usage

```bash
dcos edgelb endpoints [<flags>] <pool-name>
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
| [dcos edgelb](/services/edge-lb/1.2/cli-reference/) |  Manage Edge-LB. |

# Examples

See the [Edge-LB Usage](/services/edge-lb/1.2/usage/).
