---
layout: layout.pug
navigationTitle:  Configuring the CLI
title: Configuring the CLI
menuWeight: 2
excerpt: Configuring the command line interface

enterprise: false
---

You can access DC/OS CLI configuration with the [dcos cluster](/1.13/cli/command-reference/dcos-cluster/) and [dcos config](/1.13/cli/command-reference/dcos-config/) command groups.

# Environment variables

The DC/OS CLI supports the following environment variables, which can be set dynamically.

<a name="dcos-cluster"></a>
#### `DCOS_CLUSTER`

To set the [attached cluster](/1.13/cli/command-reference/dcos-cluster/dcos-cluster-attach/), set the variable with the command:

```bash
export DCOS_CLUSTER=<cluster_name>
```

* pip version 7.1.0 or greater.
* The `http_proxy` and `https_proxy` environment variables are defined to use `pip`.

<a name="dcos-dir"></a>
#### `DCOS_DIR`

The path to a DC/OS configuration directory. If you want the DC/OS configuration directory to be `/home/jdoe/config`, set the variable with the command:

```bash
export DCOS_DIR=/home/jdoe/config
```

1. Optionally set `DCOS_DIR` and run `dcos cluster setup` command.

```bash
export DCOS_DIR=<path/to/config_dir> # optional, default when not set is ~/.dcos
dcos cluster setup <url>
```

* Define `no_proxy` for domains that you do not want to use the proxy for:

   This setting generates and updates per cluster configuration under `$DCOS_DIR/clusters/<cluster_id>`. Generates a newly setup cluster [as seen here](/1.13/cli/index#setupcluster).

<a name="dcos-ssl-verify"></a>
#### `DCOS_SSL_VERIFY`
Indicates whether to verify SSL certificates or set the path to the SSL certificates. You must set this variable manually. Setting this environment variable is equivalent to setting the `dcos config set core.ssl_verify` option in the DC/OS configuration [file](#configuration-files). For example, to indicate that you want to set the path to SSL certificates:

```bash
export DCOS_SSL_VERIFY=false
```

<a name="dcos-verbosity"></a>
#### `DCOS_VERBOSITY`
Prints log messages to stderr at or above the level indicated. `DCOS_VERBOSITY=1` is equivalent to the `-v` command-line option. `DCOS_VERBOSITY=2` is equivalent to the `-vv` command-line option.
