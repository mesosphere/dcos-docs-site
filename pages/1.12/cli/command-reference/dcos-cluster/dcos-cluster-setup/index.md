---
layout: layout.pug
navigationTitle:  dcos cluster setup
title: dcos cluster setup
menuWeight: 6
excerpt: Configuring a connection to a DC/OS cluster
enterprise: false
---

# Description
The `dcos cluster setup` command will configure the connection to a DC/OS cluster, authenticate to DC/OS, and attach to the cluster.

# Usage

```bash
dcos cluster setup <dcos_url> [--insecure | --no-check | --ca-certs=<ca-certs>] [--provider=<provider_id>] [--username=<username>] [--password=<password> | --password-file=<password_file> | --password-env=<password_env> | --private-key=<key_path>]
```

# Options


| Name | Description |
|---------|-------------|-------------|
|  `--ca-certs=<ca-certs>` |   [enterprise type="inline" size="small" /] The path to a file with trusted CAs to verify requests against |
|  `--insecure` |   Allow requests to bypass TLS certificate verification. This is insecure.|
|  `--no-check` |   [enterprise type="inline" size="small" /] Do not check the CA certificate downloaded from the cluster. This is insecure. Applies to Enterprise DC/OS only.|
|  `--password-file=<password_file>`  | Specify the path to a file that contains the password. Trailing whitespaces in the file are ignored.|
| `--password-env=<password_env>` | Specify an environment variable name that contains the password.|
|  `--password=<password>`  | Specify password on the command line (insecure).  |
|  `--private-key=<key_path>`  | The path to a file that contains the private key.  |
|  `--provider=<provider_id>`  |  [enterprise type="inline" size="small" /] Specify the authentication provider to use for login.  |
|  `--username=<username>`  |  The username for logging in |
|  `--name=<name>`  |  Specify a custom name for the cluster. |
|  `--no-plugin`  |  Do not auto-install `dcos-core-cli` and `dcos-enterprise-cli` plugins. |

## TLS options

If you do not specify one of the SSL options `--insecure`, `--no-check`, or `--ca-certs`, the CA certificate is downloaded from the cluster and a `sha256` fingerprint of the certificate is presented for verification.

# Positional arguments

| Name | Description |
|---------|-------------|
| `<dcos-url>`   | A URL or IP address to an accessible master node |

# Environment variables

## <a name="dcos-username"></a> `DCOS_USERNAME`

Specify the username for login. When set, the `--username` flag takes precedence over this environment variable.

## <a name="dcos-username"></a> `DCOS_PASSWORD`

Specify the password for login. When set, the password flags take precedence over this environment variable.

# Parent command

| Command | Description |
|---------|-------------|
| [dcos cluster](/1.12/cli/command-reference/dcos-cluster/) | Manage DC/OS clusters. |

# Examples
For examples, see [Cluster Connections](/1.12/administering-clusters/multiple-clusters/cluster-connections/).
