---
layout: layout.pug
navigationTitle:  dcos edgelb
title: dcos edgelb
menuWeight: 5
excerpt: How to manage Edge-LB

enterprise: true
---

# Description
The dcos edgelb commands manage [Edge-LB](https://docs.mesosphere.com/services/edge-lb/).

# Usage

```bash
dcos edgelb [<flags>] [OPTIONS] [<args> ...]
```

# Options

| Name, shorthand | Default | Description |
|---------|-------------|-------------|
| `--help, h`   |             |  Print usage. |
| `--verbose`   |             |  Enable additional logging of requests and responses. |
| `--force-insecure`   |             |  Allow unverified TLS certificates when querying service. |
| `--custom-auth-token=DCOS_AUTH_TOKEN`   |             |  Specify a custom auth token to use when querying a service. |
| `--custom-dcos-url=DCOS_URI/DCOS_URL`   |             |  Specify a custom cluster URL to use when querying a service. |
| `--custom-cert-path=DCOS_CA_PATH/DCOS_CERT_PATH`   |             |  Specify a custom TLS CA certificate file to use when querying a service. |
| `--name="<name>"`   |             |  Name of the service instance to query. |
