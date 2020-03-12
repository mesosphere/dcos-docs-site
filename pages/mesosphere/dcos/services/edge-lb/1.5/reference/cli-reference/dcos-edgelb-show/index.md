---
layout: layout.pug
navigationTitle: dcos edge-lb show
title: dcos edge-lb show
menuWeight: 54
excerpt: Reference for the dcos edge-lb show command
enterprise: true
---

Use this command to show the pool definition for a given pool name. If you don't specify a pool name, the command returns information for all pool configurations.

You can also use this command to convert YAML files to their equivalent JSON format. If you have configuration files previously written using YAML, you should use this command to convert the configuration settings to their equivalent JSON format.

## Usage
***%%% is the sample command missing the [ < flags > ] component?***

```bash
dcos edgelb show <pool-name> [options]
```

## Options
| Name, shorthand | Description |
|-----------------|-------------|
| `--help, -h`   | Display usage information. |
| `--verbose, -v`   | Enable additional logging of requests and responses. |
| `--name="<name>"`   | Specify the name of the service instance to query. |
| `--reference` | Display the configuration reference. |
| `--convert-to-json=<pool-file>` | Converts local YAML file to JSON. |
| `--json` | Show unparsed JSON response. |

<!--### Permissions-->

## Examples
To display the pool definition information for the ping-lb Edge-LB pool, use the command:

```bash
dcos edgelb show ping-lb
```

The command returns information similar to the following:

```bash
Summary:
  NAME         ping-lb
  APIVERSION   V2
  COUNT        5
  ROLE         slave_public
  CONSTRAINTS  hostname:UNIQUE
  STATSPORT    0

Frontends:
  NAME                    PORT   PROTOCOL
  frontend_0.0.0.0_15001  15001  HTTP

Backends:
  FRONTEND                NAME          PROTOCOL  BALANCE
  frontend_0.0.0.0_15001  ping-backend  HTTP      roundrobin

Marathon Services:
  BACKEND       TYPE     SERVICE  CONTAINER  PORT       CHECK
  ping-backend  AUTO_IP  /ping               pong-port  enabled

Mesos Services:
  BACKEND  TYPE  FRAMEWORK  TASK  PORT  CHECK
```

To convert a YAML configuration file to JSON and output the results to standard output (`stdout`), use the command:

```bash
dcos edgelb show --convert-to-json=/path/to/yaml
```
