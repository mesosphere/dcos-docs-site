---
layout: layout.pug
navigationTitle:  dcos edgelb ping
title: dcos edgelb ping
menuWeight: 30
excerpt: Test the readiness of the Edge-LB API server
enterprise: true
---

# Description
The `dcos edgelb ping` command lets you test the readiness of the Edge-LB API server. A successful result is the string `pong`. This command will return an HTTP error if the API is not yet available.

# Usage

```bash
dcos edgelb ping [options]
```

# Options

| Name, shorthand | Description |
|-----------------|-------------|
| `--help, -h`   | Display usage information. |
| `--verbose, -v`   | Enable additional logging of requests and responses. |
| `--name="<name>"`   | Name of the service instance to query. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos edgelb](../../cli-reference/) |  Manage Edge-LB. |

# Examples
To test the connection to the Edge-LB API server, run the following command:

```bash
dcos edgelb ping
```

If the connection is successful, the command returns the following:

```bash
pong
```