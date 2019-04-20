---
layout: layout.pug
navigationTitle:  dcos edgelb pool artifact
title: dcos edgelb pool artifact
menuWeight: 50
excerpt:

enterprise: false
---

# Description
Artifacts available for an Edge-LB pool.

# Usage

```bash
dcos edgelb [<flags>] pool artifact [<flags>] <name> [<artifact> [<artifactFile>]]
```

# Positional arguments

| Name, shorthand | Description |
|---------|-------------|
| `<name>`   | Pool name. |
| `[<artifact>]`   |  Artifact name to view. |
| `[<artifactFile>]`   |  Artifact file to store. |


# Options

| Name, shorthand | Description |
|---------|--------------|
| `--help, h`   | Print usage. |
| `--verbose`   | Enable additional logging of requests and responses. |
| `--force-insecure`   | Allow unverified TLS certificates when querying service. |
| `--custom-auth-token=DCOS_AUTH_TOKEN`   | Specify a custom auth token to use when querying a service. |
| `--custom-dcos-url=DCOS_URI/DCOS_URL`   | Specify a custom cluster URL to use when querying a service. |
| `--custom-cert-path=DCOS_CA_PATH/DCOS_CERT_PATH`   | Specify a custom TLS CA certificate file to use when querying a service. |
| `--name="<name>"`   | Name of the service instance to query. |
| `--raw`   | Show unparsed artifact. |
| `--delete`   | Delete artifact. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos edgelb](/services/edge-lb/0.1/cli-reference/)  |  Manage Edge-LB. |

# Examples

See the [Edge-LB Usage](/services/edge-lb/0.1/usage/).
