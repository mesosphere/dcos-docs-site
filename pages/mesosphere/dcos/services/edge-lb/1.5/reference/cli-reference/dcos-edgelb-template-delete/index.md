---
layout: layout.pug
navigationTitle: dcos edge-lb template delete
title: dcos edge-lb template delete
menuWeight: 63
excerpt: Reference for the dcos edge-lb template delete command
enterprise: true
---

Use this command to revert a custom configuration template to its default value.

The rendered `haproxy.cfg` for a pool is generated using a template named `haproxy.cfg.ctmpl`. It is possible for advanced users to modify and upload a custom version of this template.

## Usage
```bash
dcos edgelb template delete <pool-name> [options]
```

## Options
| Name, shorthand | Description |
|-----------------|-------------|
| `--help, -h`    | Display usage information. |
| `--verbose, -v` | Enable additional logging of requests and responses. |
| `--name="<name>"` | Specify the name of the service instance to query. |

<!-- ### Permissions -->

<!-- ### Examples -->
