---
layout: layout.pug
navigationTitle:  dcos edgelb show
title: dcos edgelb show
menuWeight: 35
excerpt: Show the pool definition for a specific pool name
enterprise: true
---

# Description
The `dcos edgelb show` command shows the pool definition for a given pool name. If pool-name is omitted, all pool configurations are shown.

# Usage

```bash
dcos edgelb show <pool-name> [options]
```

# Options

| Name, shorthand | Description |
|-----------------|-------------|
| `--help, -h`   | Display usage information. |
| `--verbose, -v`   | Enable additional logging of requests and responses. |
| `--name="<name>"`   | Specify the name of the service instance to query. |
| `--reference` | Display the configuration reference. |
| `--convert-to-json=<pool-file>` | Converts local YAML file to JSON. |
| `--json` | Show unparsed JSON response. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos edgelb](../../cli-reference/) |  Manage Edge-LB. |

# Examples
To display the pool definition information for the ping-lb Edge-LB pool, run the following command:

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