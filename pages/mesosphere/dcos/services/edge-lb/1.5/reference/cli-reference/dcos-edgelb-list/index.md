---
layout: layout.pug
navigationTitle: dcos edge-lb list
title: dcos edge-lb list
menuWeight: 27
excerpt: Reference for the dcos edge-lb list command
enterprise: true
---

Use this command to return a list of pool configuration names and a summary of all configured pools.

## Usage
```bash
dcos edgelb list [options]
```

## Options
| Name, shorthand | Description |
|-----------------|-------------|
| `--help, -h`   | Display usage information. |
| `--verbose, -v`   | Enable additional logging of requests and responses. |
| `--name="<name>"`   | Specify the name of the service instance to query. |
| `--json` | Show unparsed JSON response. |

## Permissions
To list Edge-LB pool information, the Edge-LB service account or user account must have the following permission:

```
dcos:adminrouter:service:edgelb:/config full
```

## Examples
To list basic information about the Edge-LB pools currently deployed, you would use the command:

```bash
dcos edgelb list
```

The command returns information similar to the following:

```bash
  NAME      APIVERSION  COUNT  ROLE          PORTS
  ping-lb   V2          5      slave_public
  multi-lb  V2          1      slave_public
```

To list detailed Edge-LB pool configuration information for the `sanfrancisco05` Edge-LB pool instance, use the command:

```bash
dcos edgelb list --name sanfrancisco05 --verbose
```
