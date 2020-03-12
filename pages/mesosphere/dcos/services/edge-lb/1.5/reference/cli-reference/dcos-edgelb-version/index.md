---
layout: layout.pug
navigationTitle: dcos edge-lb version
title: dcos edge-lb version
menuWeight: 75
excerpt: Reference for the dcos edge-lb version command
enterprise: true
---

Use this command to display the current Edge-LB version you have installed.

## Usage
```bash
dcos edgelb [options] version
```

## Options
| Name, shorthand | Description |
|-----------------|-------------|
| `--help, -h`    | Display usage information. |
| `--verbose, -v`   | Enable additional logging of requests and responses. |
| `--name="<name>"`   | Specify the name of the service instance to query. |

<!-- ### Permissions -->

## Examples
To display version information for the Edge-LB API server and pool with an Edge-LB service instance named `edgelb-eu`, use the command:

```bash
dcos edgelb --name="edgelb-eu" version
```

The command returns information similar to the following:

```bash
client = v1.4.0
server = v1.4.0
```
