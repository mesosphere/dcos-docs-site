---
layout: layout.pug
navigationTitle:  dcos edgelb template show
title: dcos edgelb template show
menuWeight: 55
excerpt: Display load-balancer config template for a pool

enterprise: false
---


# Description
The `dcos edgelb template show` command shows the load-balancer config template for an individual pool. If pool-name is omitted, the default template is shown.

The rendered `haproxy.cfg` for a pool is generated using a template named `haproxy.cfg.ctmpl`. It is possible for advanced users to modify and upload a custom version of this template.

# Usage

```bash
dcos edgelb template show [<pool-name>]
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
