---
layout: layout.pug
navigationTitle:  CLI Reference
title: CLI Reference
menuWeight: 70
excerpt: Reference for all CLI commands in the Edge-LB package

enterprise: false
---

# Description
The Edge-LB CLI subcommands allow you to configure and manage your Edge-LB load balancer(s) from the DC/OS CLI.

# Usage

```bash
dcos edgelb [<flags>] [OPTIONS] [<args> ...]
```

# Options

| Name, shorthand       | Description |
|----------|-------------|
| `--help, h`   | Display usage. |
| `--verbose`   | Enable additional logging of requests and responses. |
| `--force-insecure`   | Allow unverified TLS certificates when querying service. |
| `--custom-auth-token=DCOS_AUTH_TOKEN`   | Specify a custom auth token to use when querying a service. |
| `--custom-dcos-url=DCOS_URI/DCOS_URL`   | Specify a custom cluster URL to use when querying a service. |
| `--custom-cert-path=DCOS_CA_PATH/DCOS_CERT_PATH`   | Specify a custom TLS CA certificate file to use when querying a service. |
| `--name="<name>"`   | Name of the service instance to query. |
