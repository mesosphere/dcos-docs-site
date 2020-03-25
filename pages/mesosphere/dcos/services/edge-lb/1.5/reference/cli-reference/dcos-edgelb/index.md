---
layout: layout.pug
navigationTitle: dcos edge-lb
title: dcos edge-lb
menuWeight: 3
excerpt: Reference for the dcos edge-lb command
enterprise: true
---

Use this command to return information about a specified Edge-LB service instance or as the **parent command** to performing Edge-LB administrative and pool configuration operations from the command-line.

## Usage

```bash
dcos edgelb [options] <command> [<args>]
```

## Options
The following general purpose options can be added to most `dcos edgelb` commands.

| Name, shorthand  | Description |
|------------------|-------------|
| `--help, -h`     | Display usage information. |
| `--verbose, -v`  | Enable additional logging of requests and responses. |
| `--name="<name>"`   | Specify the name of the Edge-LB service instance to query. |

## Permissions
Depending on the operation you want to perform, the Edge-LB service account or user account that manages Edge-LB pools might need specific permissions. For operations that require read access to an Edge-LB pool, the service or user account must have the following permission:

```
dcos:adminrouter:service:edgelb:/pools/<pool-name>
```
