---
layout: layout.pug
navigationTitle:  dcos edgelb template create
title: dcos edgelb template create
menuWeight: 45
excerpt: Create a custom config template for a pool of load-balancers

enterprise: false
---

# Description
The `dcos edgelb template create` command creates a custom config template for a pool of load-balancers.

The rendered `haproxy.cfg` for a pool is generated using a template named `haproxy.cfg.ctmpl`. It is possible for advanced users to modify and upload a custom version of this template.

# Usage

```bash
dcos edgelb template create <pool-name> <template-file>
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
