---
layout: layout.pug
navigationTitle: dcos edge-lb template create
title: dcos edge-lb template create
menuWeight: 60
excerpt: Reference for the dcos edge-lb template create command
enterprise: true
---

Use this command to create a custom configuration template for a pool of load balancers.

The rendered `haproxy.cfg` for a pool is generated using a template named `haproxy.cfg.ctmpl`. Advanced users can modify and upload a custom version of this template.

## Usage
```bash
dcos edgelb template create <pool-name> <template-file> [options]
```

## Options
| Name, shorthand | Description |
|-----------------|-------------|
| `--help, -h`   | Display usage information. |
| `--verbose, -v`   | Enable additional logging of requests and responses. |
| `--name="<name>"`   | Specify the name of the service instance to query. |
| `--json` | Show unparsed JSON response. |

<!-- ### Permissions -->

## Examples
For an example that illustrates creating a customized template, see [Customizing Edge-LB templates](../../tutorials/customizing-templates).
