---
layout: layout.pug
navigationTitle:  dcos edgelb template update
title: dcos edgelb template update
menuWeight: 60
excerpt: Update a custom config template for a pool of load balancers

enterprise: false
---


# Description
The `dcos edgelb template update` command updates a custom config template for a pool of load-balancers.

The rendered `haproxy.cfg` for a pool is generated using a template named `haproxy.cfg.ctmpl`. It is possible for advanced users to modify and upload a custom version of this template.

# Usage

```bash
dcos edgelb template update <pool-name> <template-file>
```

# Options

| Name, shorthand | Description |
|---------|-------------|
| `--help, h`   | Display usage. |
| `--verbose`   | Enable additional logging of requests and responses. |
| `--name="<name>"`   | Name of the service instance to query. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos edgelb](/services/edge-lb/1.2/cli-reference/) |  Manage Edge-LB. |

# Examples

See the [Edge-LB Usage](/services/edge-lb/1.2/usage/).
