---
layout: layout.pug
navigationTitle:  dcos edgelb pool config
title: dcos edgelb pool config
menuWeight: 5
excerpt: Viewing and updating the configuration of an Edge-LB pool

enterprise: true
---


# Description
The `dcos edgelb pool config` command allows you to view or update the config for an Edge-LB pool.

# Usage

```bash
dcos edgelb pool config <name> [<file>] [OPTIONS]
```

# Positional arguments

| Name, shorthand | Description |
|---------|-------------|-------------|
| `<name>`   |  Pool name. |
| `[<file>]`   |   JSON file that contains Edge-LB configuration.  |

# Options

| Name, shorthand |  Description |
|---------|------------|
| `--help, h`   |  Display usage. |
| `--verbose`   |  Enable additional logging of requests and responses. |
| `--force-insecure`   |  Allow unverified TLS certificates when querying service. |
| `--custom-auth-token=DCOS_AUTH_TOKEN`   |   Specify a custom auth token to use when querying a service. |
| `--custom-dcos-url=DCOS_URI/DCOS_URL`   |  Specify a custom cluster URL to use when querying a service. |
| `--custom-cert-path=DCOS_CA_PATH/DCOS_CERT_PATH`   |   Specify a custom TLS CA certificate file to use when querying a service. |
| `--name="<name>"`   |  Name of the service instance to query. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos edgelb](/1.11/cli/command-reference/dcos-edgelb/) |  Manage Edge-LB. |

# Examples

See the [Edge-LB Quick Start Guide](/services/edge-lb/1.0/).
