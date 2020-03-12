---
layout: layout.pug
navigationTitle: dcos edge-lb status
title: dcos edge-lb status
menuWeight: 57
excerpt: Reference for the dcos edge-lb status command
enterprise: true
---

Use this command to return a list of the load balancer task information associated with a pool. For example, you can run this command to return the agent IP address and task ID for a specified Edge-LB pool.

## Usage

```bash
dcos edgelb status <pool-name> [options]
```

## Options

| Name, shorthand | Description |
|-----------------|-------------|
| `--help, -h`   | Display usage information. |
| `--verbose, -v`   | Enable additional logging of requests and responses. |
| `--name="<name>"`   | Specify the name of the service instance to query. |
| `--task-ids` | Display only the task identifiers. |
| `--json` | Show unparsed JSON response. |

<!-- ### Permissions -->

<!-- ### Examples -->
