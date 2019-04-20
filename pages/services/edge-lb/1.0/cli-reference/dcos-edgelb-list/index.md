---
layout: layout.pug
navigationTitle:  dcos edgelb list
title: dcos edgelb list
menuWeight: 25
excerpt: List the names and a summary of all configured pools

enterprise: false
---

# Description
The `dcos edgelb list` command returns a list of the names and a summary of all configured pools.

# Usage

```bash
dcos edgelb list [<flags>]
```

# Options

| Name, shorthand | Description |
|---------|-------------|
| `--help, h`   | Print usage. |
| `--verbose`   | Enable additional logging of requests and responses. |
| `--force-insecure`   | Allow unverified TLS certificates when querying service. |
| `--custom-auth-token=DCOS_AUTH_TOKEN`   | Specify a custom auth token to use when querying a service. |
| `--custom-dcos-url=DCOS_URI/DCOS_URL`   | Specify a custom cluster URL to use when querying a service. |
| `--custom-cert-path=DCOS_CA_PATH/DCOS_CERT_PATH`   | Specify a custom TLS CA certificate file to use when querying a service. |
| `--name="<name>"`   | Name of the service instance to query. |
| `--json` | Show unparsed JSON response. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos edgelb](/services/edge-lb/1.0/cli-reference/) |  Manage Edge-LB. |

# Examples

See the [Edge-LB Usage](/services/edge-lb/1.0/usage/).
