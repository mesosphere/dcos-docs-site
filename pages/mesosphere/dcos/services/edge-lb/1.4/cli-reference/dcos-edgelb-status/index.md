---
layout: layout.pug
navigationTitle:  dcos edgelb status
title: dcos edgelb status
menuWeight: 40
excerpt: List load-balancer task information for a pool
enterprise: true
---

# Description
The `dcos edgelb status` command returns a list of load-balancer task information associated with a pool, such as agent IP address, task ID, etc.

# Usage

```bash
dcos edgelb status <pool-name> [options]
```

# Options

| Name, shorthand | Description |
|-----------------|-------------|
| `--help, -h`   | Display usage information. |
| `--verbose, -v`   | Enable additional logging of requests and responses. |
| `--name="<name>"`   | Specify the name of the service instance to query. |
| `--task-ids` | Display only the task identifiers. |
| `--json` | Show unparsed JSON response. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos edgelb](../../cli-reference/) |  Manage Edge-LB. |

# Examples

See the [Edge-LB Usage](../../usage/).
