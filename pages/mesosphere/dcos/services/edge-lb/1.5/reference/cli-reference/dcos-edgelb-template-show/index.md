---
layout: layout.pug
navigationTitle: dcos edge-lb template show
title: dcos edge-lb template show
menuWeight: 66
excerpt: Reference for the dcos edge-lb template show command
enterprise: true
---

Use this command to show the load balancer configuration template for an individual pool. If you don't specify a pool name, the command returns information for the default template.

The rendered `haproxy.cfg` for a pool is generated using a template named `haproxy.cfg.ctmpl`. Advanced users can modify and upload a custom version of this template.

## Usage
```bash
dcos edgelb template show <pool-name> [options]
```

## Options
| Name, shorthand | Description |
|-----------------|-------------|
| `--help, -h`    | Display usage information. |
| `--verbose, -v`   | Enable additional logging of requests and responses. |
| `--name="<name>"`   | Specify the name of the service instance to query. |

<!-- ### Permissions -->

<!-- ### Examples -->
