---
layout: layout.pug
navigationTitle:  dcos edgelb pool list
title: dcos edgelb pool list
menuWeight: 8
excerpt: Listing pool names

enterprise: true
---


# Description
The `dcos edgelb pool list` command allows you to list the names of all pools.

# Usage

```bash
dcos edgelb pool list [OPTIONS]
```

# Options

| Name, shorthand | Description |
|---------|-------------|
| `--help, h`   |  Print usage. |
| `--verbose`   |  Enable additional logging of requests and responses. |
| `--force-insecure`   |   Allow unverified TLS certificates when querying service. |
| `--custom-auth-token=DCOS_AUTH_TOKEN`   | Specify a custom auth token to use when querying a service. |
| `--custom-dcos-url=DCOS_URI/DCOS_URL`   |   Specify a custom cluster URL to use when querying a service. |
| `--custom-cert-path=DCOS_CA_PATH/DCOS_CERT_PATH`   |  Specify a custom TLS CA certificate file to use when querying a service. |
| `--name="<name>"`   |  Name of the service instance to query. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos edgelb](/1.11/cli/command-reference/dcos-edgelb/) |  Manage Edge-LB. |

# Examples

See the [Edge-LB Quick Start Guide](/services/edge-lb/1.0/).
