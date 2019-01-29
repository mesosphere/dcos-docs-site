---
layout: layout.pug
navigationTitle:  dcos edgelb ping
title: dcos edgelb ping
menuWeight: 3
excerpt: Testing the readiness of the Edge-LB API server

enterprise: true
---


# Description
The `dcos edgelb ping` command allows you to test the readiness of the Edge-LB API server.

# Usage

```bash
dcos edgelb ping [OPTIONS]
```

# Options

| Name, shorthand |  Description |
|---------|-------------|
| `--help, h`   |   Display usage. |
| `--verbose`   |  Enable additional logging of requests and responses. |
| `--force-insecure`   |  Allow unverified TLS certificates when querying service. |
| `--custom-auth-token=DCOS_AUTH_TOKEN`   |  Specify a custom auth token to use when querying a service. |
| `--custom-dcos-url=DCOS_URI/DCOS_URL`   | Specify a custom cluster URL to use when querying a service. |
| `--custom-cert-path=DCOS_CA_PATH/DCOS_CERT_PATH`   |  Specify a custom TLS CA certificate file to use when querying a service. |
| `--name="<name>"`   |   Name of the service instance to query. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos edgelb](/1.11/cli/command-reference/dcos-edgelb/) |  Manage Edge-LB. |
