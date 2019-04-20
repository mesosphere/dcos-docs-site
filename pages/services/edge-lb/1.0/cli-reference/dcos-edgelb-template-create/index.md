---
layout: layout.pug
navigationTitle:  dcos edgelb template create
title: dcos edgelb template create
menuWeight: 45
excerpt: Create a custom config template for a pool of load-balancers

enterprise: false
---

# Description
The `dcos edgelb template create` command creates a custom config template for a pool of load-balancers.

The rendered `haproxy.cfg` for a pool is generated using a template named `haproxy.cfg.ctmpl`. It is possible for advanced users to modify and upload a custom version of this template.

# Usage

```bash
dcos edgelb template create <pool-name> <template-file>
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

# Parent command

| Command | Description |
|---------|-------------|
| [dcos edgelb](/services/edge-lb/1.0/cli-reference/) |  Manage Edge-LB. |

# Examples

See the [Edge-LB Usage](/services/edge-lb/1.0/usage/).
