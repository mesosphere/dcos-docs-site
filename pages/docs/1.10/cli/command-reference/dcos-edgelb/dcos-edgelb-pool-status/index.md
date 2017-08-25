---
layout: layout.pug
title: dcos edgelb pool status
menuWeight: 2
excerpt: ""
featureMaturity: ""
enterprise: 'yes'
navigationTitle:  dcos edgelb pool status
---


# Description
Edge-LB pool status information.

# Usage

```bash
dcos edgelb [<flags>] pool status [<flags>] <name>
```

# Positional arguments

| Name, shorthand | Default | Description |
navigationTitle:  dcos edgelb pool status
|---------|-------------|-------------|
| `<name>`   |             | Pool name. |


# Options

| Name, shorthand | Default | Description |
navigationTitle:  dcos edgelb pool status
|---------|-------------|-------------|
| `--help, h`   |             |  Print usage. |
| `--verbose`   |             |  Enable additional logging of requests and responses. |
| `--force-insecure`   |             |  Allow unverified TLS certificates when querying service. |
| `--custom-auth-token=DCOS_AUTH_TOKEN`   |             | Custom auth token to use when querying a service. |
| `--custom-dcos-url=DCOS_URI/DCOS_URL`   |             | Custom cluster URL to use when querying a service. |
| `--custom-cert-path=DCOS_CA_PATH/DCOS_CERT_PATH`   |             |  Custom TLS CA certificate file to use when querying a service. |
| `--name="<name>"`   |             |  Name of the service instance to query. |
| `--namespace="dcos-edgelb/pools"`   |             |  Namespace of the task. |
| `--ip-only`   |             |  Only print the IP addresses. |

# Parent command

| Command | Description |
navigationTitle:  dcos edgelb pool status
|---------|-------------|
| [dcos edgelb](/1.10/cli/command-reference/dcos-edgelb/) |  Manage Edge-LB. |

# Examples

See the [Edge-LB Quick Start Guide](/1.10/networking/edge-lb/quickstart/).
