---
layout: layout.pug
navigationTitle:  dcos edgelb pool status
title: dcos edgelb pool status
menuWeight: 70
excerpt:

enterprise: false
---

# Description
Edge-LB pool status information.

# Usage

```bash
dcos edgelb [<flags>] pool status [<flags>] <name>
```

# Positional arguments

| Name, shorthand | Description |
|---------|-------------|
| `<name>`   | Pool name. |


# Options

| Name, shorthand | Description |
|---------|-------------|
| `--help, h`   | Print usage. |
| `--verbose`   | Enable additional logging of requests and responses. |
| `--force-insecure`   | Allow unverified TLS certificates when querying service. |
| `--custom-auth-token=DCOS_AUTH_TOKEN`   | Custom auth token to use when querying a service. |
| `--custom-dcos-url=DCOS_URI/DCOS_URL`   | Custom cluster URL to use when querying a service. |
| `--custom-cert-path=DCOS_CA_PATH/DCOS_CERT_PATH`   | Custom TLS CA certificate file to use when querying a service. |
| `--name="<name>"`   | Name of the service instance to query. |
| `--namespace="dcos-edgelb/pools"`   |             |  Namespace of the task. |
| `--ip-only`   | Only print the IP addresses. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos edgelb](/services/edge-lb/0.1/cli-reference/)  |  Manage Edge-LB. |

# Examples

See the [Edge-LB Usage](/services/edge-lb/0.1/usage/).
