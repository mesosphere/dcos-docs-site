---
layout: layout.pug
navigationTitle:  dcos edgelb ping
title: dcos edgelb ping
menuWeight: 30
excerpt: Test the readiness of the Edge-LB API server

enterprise: false
---

# Description
The dcos edgelb ping command lets you test the readiness of the Edge-LB API server. A successful result is the string `pong`. This command will return an HTTP error if the API is not yet available.

# Usage

```bash
dcos edgelb ping
```

# Options

| Name, shorthand | Description |
|---------|-------------|
| `--help, h`   | Display usage. |
| `--verbose`   | Enable additional logging of requests and responses. |
| `--name="<name>"`   | Name of the service instance to query. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos edgelb](/services/edge-lb/1.1/cli-reference/) |  Manage Edge-LB. |

# Examples

See the [Edge-LB Usage](/services/edge-lb/1.1/usage/).
