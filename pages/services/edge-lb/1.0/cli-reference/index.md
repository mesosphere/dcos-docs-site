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
The Edge-LB CLI subcommands allow you to configure and manage your Edge-LB load balancer(s) from the DC/OS CLI.

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

| Command                                                                                               | Description                                                                                                  |
|-------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------|
| [dcos edgelb ping](/services/edge-lb/1.0/cli-reference/dcos-edgelb-ping/)                       | Test the readiness of the Edge-LB API server.                                                                |
| [dcos edgelb version](/services/edge-lb/1.0/cli-reference/dcos-edgelb-version/)                 | Output the Edge-LB version.                                                                                  |
| [dcos edgelb create](/services/edge-lb/1.0/cli-reference/dcos-edgelb-create/)                   | Creates a single pool given a definition file written in JSON or YAML.                                       |
| [dcos edgelb update](/services/edge-lb/1.0/cli-reference/dcos-edgelb-update/)                   | Uploads a new pool configuration file to the Edge-LB apiserver, updating the running pool of load balancers. |
| [dcos edgelb delete](/services/edge-lb/1.0/cli-reference/dcos-edgelb-delete/)                   | Deletes and uninstalls an existing pool.                                                                     |
| [dcos edgelb list](/services/edge-lb/1.0/cli-reference/dcos-edgelb-list/)                       | List the names and summary of all configured pools.                                                          |
| [dcos edgelb show](/services/edge-lb/1.0/cli-reference/dcos-edgelb-show/)                       | Shows the pool definition for a given pool name.                                                             |
| [dcos edgelb endpoints](/services/edge-lb/1.0/cli-reference/dcos-edgelb-endpoints/)             | List of all endpoints for the pool.                                                                          |
| [dcos edgelb lb-config](/services/edge-lb/1.0/cli-reference/dcos-edgelb-lb-config/)             | Shows the running load-balancer config associated with the pool.                                             |
| [dcos edgelb status](/services/edge-lb/1.0/cli-reference/dcos-edgelb-status/)                   | List of load-balancer task information associated with the pool.                                             |
| [dcos edgelb template create](/services/edge-lb/1.0/cli-reference/dcos-edgelb-template-create/) | Creates a custom config template for a pool of load-balancers.                                               |
| [dcos edgelb template update](/services/edge-lb/1.0/cli-reference/dcos-edgelb-template-update/) | Updates a custom config template for a pool of load-balancers.                                               |
| [dcos edgelb template delete](/services/edge-lb/1.0/cli-reference/dcos-edgelb-template-delete/) | Reverts a custom config template to the default value.                                                       |
| [dcos edgelb template show](/services/edge-lb/1.0/cli-reference/dcos-edgelb-template-show/)     | Shows the load-balancer config template for an individual pool.                                              |
|                                                                                                       |                                                                                                              |
