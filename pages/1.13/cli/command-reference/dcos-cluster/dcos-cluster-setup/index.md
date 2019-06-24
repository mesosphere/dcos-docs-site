---
layout: layout.pug
navigationTitle:  dcos cluster setup
title: dcos cluster setup
menuWeight: 6
excerpt: Configuring the CLI to communicate with a cluster
enterprise: false
render: mustache
model: /data.yml
---

# Description
The `dcos cluster setup` command will configure the connection to a DC/OS cluster, authenticate to DC/OS, and attach to the cluster.

It will also automatically install the [Core and Enterprise CLI plugins](/1.13/cli/plugins/).

# Usage

```bash
  dcos cluster setup <url> [flags]
```

# Options

| Name | Description |
|---------|-------------|
| `--ca-certs string`   |     Specify the path to a file with trusted CAs to verify requests against.
| `-h`, `--help`     |  Displays help for this command. |
| `--insecure`       |        Allow requests to bypass TLS certificate verification (insecure).
| `--name string`     |       Specify a custom name for the cluster.
| `--no-check`        |       Do not check CA certficate downloaded from cluster (insecure). Applies to Enterprise DC/OS only. [enterprise type="inline" size="small" /]
| `--password string`   |     Specify the password on the command line (insecure).
| `--password-file string`  | Specify the path to a file that contains the password.
| `--private-key string`   |  Specify the path to a file that contains the service account private key.
| `--provider string`     |   Specify the login provider to use.
| `--username string`      |  Specify the username for login.


## TLS options

If you do not specify one of the SSL options `--insecure`, `--no-check`, or `--ca-certs`, the CA certificate is downloaded from the cluster and a `sha256` fingerprint of the certificate is presented for verification.

## Positional arguments

| Name | Description |
|---------|-------------|
| `<url>`   | A URL or IP address to an accessible master node |


# Examples
For examples, see [Cluster Connections](/1.13/administering-clusters/multiple-clusters/cluster-connections/).

# Parent command

| Command | Description |
|---------|-------------|
| [dcos cluster](/1.13/cli/command-reference/dcos-cluster/) | Manage DC/OS clusters. |
