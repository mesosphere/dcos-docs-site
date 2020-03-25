---
layout: layout.pug
navigationTitle: dcos edge-lb ping
title: dcos edge-lb ping
menuWeight: 30
excerpt: Reference for the dcos edge-lb ping command
enterprise: true
---

Use this command to test the readiness of the Edge-LB API server. A successful result is the string `pong`. This command returns an HTTP error if the API is not yet available.

## Usage
```bash
dcos edgelb ping [options]
```

## Options
| Name, shorthand | Description |
|-----------------|-------------|
| `--help, -h`   | Display usage information. |
| `--verbose, -v`   | Enable additional logging of requests and responses. |
| `--name="<name>"`   | Specify the name of the service instance to query. |

## Permissions
To test Edge-LB connectivity by sending a `ping` request, the Edge-LB service account or user account must have the following permission:

```
dcos:adminrouter:service:edgelb:/ping full
```

## Examples
To test the connection to the Edge-LB API server, use the command:

```bash
dcos edgelb ping
```

If the connection is successful, the command returns the following:

```bash
pong
```
