---
layout: layout.pug
navigationTitle:  dcos edgelb endpoints
title: dcos edgelb endpoints
menuWeight: 15
excerpt: List all endpoints for a pool

enterprise: false
---

# Description
The `dcos edgelb endpoints` command returns a list of all endpoints for a pool. The internal ip address and ports for a pool can be found with this command.


# Usage

```bash
dcos edgelb endpoints [<flags>] <pool-name>
```

# Options

| Name, shorthand | Description |
|---------|-------------|
| `--help, h`   | Display usage. |
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
| [dcos edgelb](/services/edge-lb/1.1/cli-reference) |  Manage Edge-LB. |

# Examples

See the [Edge-LB Usage](/services/edge-lb/1.1/usage).
