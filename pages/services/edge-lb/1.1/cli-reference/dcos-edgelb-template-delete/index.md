---
layout: layout.pug
navigationTitle:  dcos edgelb template delete
title: dcos edgelb template delete
menuWeight: 50
excerpt: Revert a custom config template to defaults

enterprise: false
---

# Description
The `dcos edgelb template delete` command reverts a custom config template to the default value.

The rendered `haproxy.cfg` for a pool is generated using a template named `haproxy.cfg.ctmpl`. It is possible for advanced users to modify and upload a custom version of this template.

# Usage

```bash
dcos edgelb template delete <pool-name>
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
| [dcos edgelb](/services/edge-lb/1.1/cli-reference/) |  Manage Edge-LB. |

# Examples

See the [Edge-LB Usage](/services/edge-lb/1.1/usage/).
