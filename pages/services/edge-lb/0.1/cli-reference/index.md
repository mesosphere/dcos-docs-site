---
layout: layout.pug
navigationTitle:  CLI Reference
title: CLI Reference
menuWeight: 70
excerpt:

enterprise: false
---

This is a reference for all CLI commands available in the Edge-LB package.

# Description
THE Edge-LB CLI subcommands allow you to configure and manage your Edge-LB load balancer(s) from the DC/OS CLI.

# Usage

```bash
dcos edgelb [<flags>] [OPTIONS] [<args> ...]
```

# Options

| Name, shorthand       | Description |
|----------|-------------|
| `--help, h`   | Print usage. |
| `--verbose`   | Enable additional logging of requests and responses. |
| `--force-insecure`   | Allow unverified TLS certificates when querying service. |
| `--custom-auth-token=DCOS_AUTH_TOKEN`   | Specify a custom auth token to use when querying a service. |
| `--custom-dcos-url=DCOS_URI/DCOS_URL`   | Specify a custom cluster URL to use when querying a service. |
| `--custom-cert-path=DCOS_CA_PATH/DCOS_CERT_PATH`   | Specify a custom TLS CA certificate file to use when querying a service. |
| `--name="<name>"`   | Name of the service instance to query. |

# Child commands

| Command | Description |
|---------|-------------|
|[dcos edgelb config](/services/edge-lb/latest/cli-reference/dcos-edgelb-config/)  | View or update the Edge-LB configuration. |
|[dcos edgelb ping](/services/edge-lb/latest/cli-reference/dcos-edgelb-ping/)  | Test the readiness of the Edge-LB API server. |
|[dcos edgelb pool config](/services/edge-lb/latest/cli-reference/dcos-edgelb-pool-config/)  | View or update the config for an Edge-LB pool. |
|[dcos edgelb pool delete](/services/edge-lb/latest/cli-reference/dcos-edgelb-pool-delete/)  | Delete and uninstall an Edge-LB pool or artifact. |
|[dcos edgelb pool lb](/services/edge-lb/latest/cli-reference/dcos-edgelb-pool-lb/)  | Pool LB instance information. |
|[dcos edgelb pool list](/services/edge-lb/latest/cli-reference/dcos-edgelb-pool-list/)  | List pool names. |
|[dcos edgelb pool artifact](/services/edge-lb/latest/cli-reference/dcos-edgelb-pool-artifact/)  | Artifacts available for an Edge-LB pool. |
