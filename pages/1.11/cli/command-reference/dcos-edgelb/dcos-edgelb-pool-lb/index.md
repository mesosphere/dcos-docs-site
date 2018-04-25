---
layout: layout.pug
navigationTitle:  dcos edgelb pool lb
title: dcos edgelb pool lb
menuWeight: 7
excerpt: How to display pool load balancer instance information

enterprise: true
---

# Description
The dcos edgelb pool lb command will list pool LB instance information.

# Usage

```bash
dcos edgelb [<flags>] pool lb [<flags>] <name> [<lb>]
```

# Positional arguments

| Name, shorthand | Default | Description |
|---------|-------------|-------------|
| `<name>`   |             |  Pool name. |
| `[<lb>]`   |             | Name of load balancer instance. |


# Options

| Name, shorthand | Default | Description |
|---------|-------------|-------------|
| `--help, h`   |             |  Print usage. |
| `--verbose`   |             |  Enable additional logging of requests and responses. |
| `--force-insecure`   |             |  Allow unverified TLS certificates when querying service. |
| `--custom-auth-token=DCOS_AUTH_TOKEN`   |             |  Specify a custom auth token to use when querying a service. |
| `--custom-dcos-url=DCOS_URI/DCOS_URL`   |             |  Specify a custom cluster URL to use when querying a service. |
| `--custom-cert-path=DCOS_CA_PATH/DCOS_CERT_PATH`   |             |  Specify a custom TLS CA certificate file to use when querying a service. |
| `--name="<name>"`   |             |  Name of the service instance to query. |
| `--namespace="dcos-edgelb/<name>"`   |             |  Namespace of the task. |
| `--ip-only`   |             |  Only print the IP addresses. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos edgelb](/1.11/cli/command-reference/dcos-edgelb/) |  Manage Edge-LB. |

# Examples

See the [Edge-LB Quick Start Guide](/1.11/networking/edge-lb/quickstart/).
