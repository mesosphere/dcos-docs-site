---
layout: layout.pug
navigationTitle:  dcos edgelb config
title: dcos edgelb config
menuWeight: 2
excerpt: Viewing and updating your Edge-LB configuration

enterprise: true
---

# Description
The `dcos edgelb config` command allows you to view or update your Edge-LB configuration.

# Usage

```bash
dcos edgelb config <file> [OPTIONS]
```

# Positional arguments

| Name, shorthand | Description |
|---------|-------------|
| `<file>`   | JSON file containing the Edge-LB configuration. |


# Options

| Name, shorthand | Description |
|---------|-------------|
| `--help, h`   |   Display usage. |
| `--verbose`   |  Enable additional logging of requests and responses. |
| `--force-insecure`   |  Allow unverified TLS certificates when querying service. |
| `--custom-auth-token=DCOS_AUTH_TOKEN`   | Custom `auth` token to use when querying a service. |
| `--custom-dcos-url=DCOS_URI/DCOS_URL`   | Custom cluster URL to use when querying a service. |
| `--custom-cert-path=DCOS_CA_PATH/DCOS_CERT_PATH`   |Custom TLS CA certificate file to use when querying a service. |
| `--name="<name>"`   |  Name of the service instance to query. |
| `--reference`  |  Display the configuration reference. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos edgelb](/1.11/cli/command-reference/dcos-edgelb/) |  Manage Edge-LB. |
