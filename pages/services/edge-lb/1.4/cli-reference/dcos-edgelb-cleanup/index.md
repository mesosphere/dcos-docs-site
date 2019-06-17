---
layout: layout.pug
navigationTitle:  dcos edgelb cleanup
title: dcos edgelb cleanup
menuWeight: 5
excerpt: List and remove elements of the AWS Elastic Load Balancer (ELB) framework created by Edge-LB
enterprise: true
---

# Description
The `dcos edgelb cleanup` command lists and removes all Edge-LB pools in the case where Edge-LB pools or pool instances remain after Edge-LB has been uninstalled. This command also uninstalls the load balancer framework.

# Usage

```bash
dcos edgelb cleanup
```

# Options

| Name, shorthand | Description |
|---------|-------------|
| `--help, h`   | Display usage information. |
| `--verbose`   | Enable additional logging of requests and responses. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos edgelb](../../cli-reference/) |  Manage Edge-LB. |

# Examples
See the [Edge-LB Usage](../../usage/).
