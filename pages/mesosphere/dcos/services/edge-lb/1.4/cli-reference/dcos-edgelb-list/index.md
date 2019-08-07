---
layout: layout.pug
navigationTitle:  dcos edgelb list
title: dcos edgelb list
menuWeight: 25
excerpt: List the names and a summary of all configured pools
enterprise: true
---

# Description
The `dcos edgelb list` command returns a list of the names and a summary of all configured pools.

# Usage

```bash
dcos edgelb list [options]
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
To list basic information about the Edge-LB pools currently deployed, you would run the following command:

```bash
dcos edgelb list
```

The command returns information similar to the following:

```bash
  NAME      APIVERSION  COUNT  ROLE          PORTS
  ping-lb   V2          5      slave_public
  multi-lb  V2          1      slave_public
```