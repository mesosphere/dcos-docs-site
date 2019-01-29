---
layout: layout.pug
navigationTitle:  dcos edgelb lb-config
title: dcos edgelb lb-config
menuWeight: 20
excerpt: Display the running load-balancer config associated with a pool

enterprise: false
---

# Description
The `dcos edgelb lb-config` command shows the running load-balancer config associated with the pool. You can view the active load balancer configuration for all load balancers in a pool.


# Usage

```bash
dcos edgelb lb-config [<flags>] <pool-name>
```

# Options

| Name, shorthand | Description |
|---------|-------------|
| `--help, h`   | Display usage. |
| `--verbose`   | Enable additional logging of requests and responses. |
| `--name="<name>"`   | Name of the service instance to query. |
| `--raw` | Show unparsed load-balancer config. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos edgelb](/services/edge-lb/1.1/cli-reference/) |  Manage Edge-LB. |

# Examples

See the [Edge-LB Usage](/services/edge-lb/1.1/usage/).
