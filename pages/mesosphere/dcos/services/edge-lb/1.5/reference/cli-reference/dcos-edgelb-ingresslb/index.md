---
layout: layout.pug
navigationTitle: dcos edge-lb ingress-lb
title: dcos edge-lb ingress-lb
menuWeight: 21
excerpt: Reference for the dcos edge-lb ingress-lb command
enterprise: true
---

Use this command to return a list of all inbound (ingress) endpoints for a specified load balancing pool.

## Usage
```bash
dcos edgelb ingresslb <pool-name> [options]
```

## Options
| Name, shorthand   | Description |
|-------------------|-------------|
| `--help, -h`      | Display usage information. |
| `--verbose, -v`   | Enable additional logging of requests and responses. |
| `--name="<name>"` | Specify the name of the service instance to query. |
| `--json`          | Show unparsed JSON response. |

<!--### Permissions -->

## Examples
To list the load balancing ingress endpoints for the Edge-LB pool named `paris-prod-lb`, you would use the command:

```bash
dcos edgelb ingresslb paris-prod-lb
```
<!--
The command returns information similar to the following:

```bash
  NAME      APIVERSION  COUNT  ROLE          PORTS
  ping-lb   V2          5      slave_public
  multi-lb  V2          1      slave_public
```
-->
