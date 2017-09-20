---
layout: layout.pug
title: dcos edgelb
menuWeight: 1
excerpt:
featureMaturity:
enterprise: true
navigationTitle:  dcos edgelb
---

# Description
This command manages [Edge-LB](/docs/1.10/networking/edge-lb/).

# Usage

```bash
dcos edgelb [<flags>] [OPTIONS] [<args> ...]
```

# Options

| Name, shorthand | Default | Description |
navigationTitle:  dcos edgelb
|---------|-------------|-------------|
| `--help, h`   |             |  Print usage. |
| `--verbose`   |             |  Enable additional logging of requests and responses. |
| `--force-insecure`   |             |  Allow unverified TLS certificates when querying service. |
| `--custom-auth-token=DCOS_AUTH_TOKEN`   |             |  Specify a custom auth token to use when querying a service. |
| `--custom-dcos-url=DCOS_URI/DCOS_URL`   |             |  Specify a custom cluster URL to use when querying a service. |
| `--custom-cert-path=DCOS_CA_PATH/DCOS_CERT_PATH`   |             |  Specify a custom TLS CA certificate file to use when querying a service. |
| `--name="<name>"`   |             |  Name of the service instance to query. |

# Child commands

| Command | Description |
navigationTitle:  dcos edgelb
|---------|-------------|
|[dcos edgelb config](/docs/1.10/cli/command-reference/dcos-edgelb/dcos-edgelb-config/) | View or update the Edge-LB configuration. |
|[dcos edgelb ping](/docs/1.10/cli/command-reference/dcos-edgelb/dcos-edgelb-ping/) | Test the readiness of the Edge-LB API server. |
|[dcos edgelb pool config](/docs/1.10/cli/command-reference/dcos-edgelb/dcos-edgelb-pool-config/) | View or update the config for an Edge-LB pool. |
|[dcos edgelb pool delete](/docs/1.10/cli/command-reference/dcos-edgelb/dcos-edgelb-pool-delete/) | Delete and uninstall an Edge-LB pool or artifact. |
|[dcos edgelb pool lb](/docs/1.10/cli/command-reference/dcos-edgelb/dcos-edgelb-pool-lb/) | Pool LB instance information. |
|[dcos edgelb pool list](/docs/1.10/cli/command-reference/dcos-edgelb/dcos-edgelb-pool-list/) | List pool names. |
|[dcos edgelb pool artifact](/docs/1.10/cli/command-reference/dcos-edgelb/dcos-edgelb-pool-artifact/) | Artifacts available for an Edge-LB pool. |
