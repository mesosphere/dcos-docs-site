---
layout: layout.pug
navigationTitle:  dcos edgelb update
title: dcos edgelb update
menuWeight: 65
excerpt: Upload a new pool config file

enterprise: false
---

# Description
The `dcos edgelb update` command uploads a new pool configuration file to the Edge-LB `apiserver`, updating the running pool of load balancers.

# Usage

```bash
dcos edgelb update [<flags>] <pool-file>
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
| [dcos edgelb](/services/edge-lb/1.1/cli-reference/) |  Manage Edge-LB. |

# Examples

See the [Edge-LB Usage](/services/edge-lb/1.1/usage/).
