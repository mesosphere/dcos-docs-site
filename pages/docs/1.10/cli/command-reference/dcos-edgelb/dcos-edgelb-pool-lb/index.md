---
layout: layout.pug
title: dcos edgelb pool lb
menuWeight: 7
excerpt: ""
featureMaturity: ""
enterprise: 'yes'
navigationTitle:  dcos edgelb pool lb
---

# Description
Pool LB instance information.

# Usage

```bash
dcos edgelb [<flags>] pool lb [<flags>] <name> [<lb>]
```

# Positional arguments

| Name, shorthand | Default | Description |
navigationTitle:  dcos edgelb pool lb
|---------|-------------|-------------|
| `<name>`   |             |  Pool name. |
| `[<lb>]`   |             | Name of load balancer instance. |


# Options

| Name, shorthand | Default | Description |
navigationTitle:  dcos edgelb pool lb
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
navigationTitle:  dcos edgelb pool lb
|---------|-------------|
| [dcos edgelb](/docs/1.10/cli/command-reference/dcos-edgelb/) |  Manage Edge-LB. |

# Examples

See the [Edge-LB Quick Start Guide](/docs/1.10/networking/edge-lb/quickstart/).
