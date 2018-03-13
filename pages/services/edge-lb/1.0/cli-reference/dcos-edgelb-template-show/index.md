---
layout: layout.pug
navigationTitle:  dcos edgelb template show
title: dcos edgelb template show
menuWeight: 110
excerpt:

enterprise: false
---

# Description
Shows the load-balancer config template for an individual pool. If pool-name is omitted, the default template is shown.

# Usage

```bash
dcos edgelb template show [<pool-name>]
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

# Parent command

| Command | Description |
|---------|-------------|
| [dcos edgelb](/services/edge-lb/1.0/cli-reference) |  Manage Edge-LB. |

# Examples

See the [Edge-LB Usage](/services/edge-lb/1.0/usage).
