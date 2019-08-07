---
layout: layout.pug
navigationTitle:  dcos edgelb ingresslb
title: dcos edgelb ingresslb
menuWeight: 16
excerpt: List all inbound (ingress) endpoints for a specified pool
enterprise: true
---

# Description
The `dcos edgelb ingresslb` command returns a list of all inbound (ingress) endpoints for a load balancing pool.

# Usage

```bash
dcos edgelb ingresslb <pool-name> [options]
```

# Options

| Name, shorthand | Description |
|-----------------|-------------|
| `--help, -h`   | Display usage information. |
| `--verbose, -v`   | Enable additional logging of requests and responses. |
| `--name="<name>"`   | Specify the name of the service instance to query. |
| `--json` | Show unparsed JSON response. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos edgelb](../../cli-reference/) |  Manage Edge-LB. |

# Examples

To list the load balancing ingress endpoints for the Edge-LB pool named `paris-prod-lb`, you would run the following command:

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