---
layout: layout.pug
navigationTitle:  dcos edgelb delete
title: dcos edgelb delete
menuWeight: 10
excerpt: Delete and uninstall an existing pool

enterprise: false
---

# Description
The `dcos edgelb delete` command deletes a pool and uninstalls the deployed load balancers.


# Usage

```bash
dcos edgelb delete <pool-name>
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
