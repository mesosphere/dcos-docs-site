---
layout: layout.pug
navigationTitle:  Configuring the CLI
title: Configuring the CLI
menuWeight: 2
excerpt: How to configure the command line interface

enterprise: false
---


You can access DC/OS CLI configuration with the [dcos cluster](/1.12/cli/command-reference/dcos-cluster/) and [dcos config](/1.12/cli/command-reference/dcos-config/) command groups.


# Configuring HTTP proxy

If you use a proxy server to connect to the internet, you can configure the CLI to use your proxy server.

**Prerequisites**

*   pip version 7.1.0 or greater.
*   The `http_proxy` and `https_proxy` environment variables are defined to use pip.

To configure a proxy for the CLI:

*   From the CLI terminal, define the environment variables `http_proxy` and `https_proxy`:

        export http_proxy=’http://<user>:<pass>@<proxy_host>:<http_proxy_port>’
        export https_proxy=’https://<user>:<pass>@<proxy_host>:<https_proxy_port>’


*   Define `no_proxy` for domains that you don’t want to use the proxy for:

        export no_proxy=".mesos,.thisdcos.directory,.dcos.directory,.zk,127.0.0.1,localhost,foo.bar.com,.baz.com”

# Environment variables

The DC/OS CLI supports the following environment variables, which can be set dynamically.

<a name="dcos-cluster"></a>
#### `DCOS_CLUSTER` (DC/OS CLI 0.5.x and higher only)

The [attached](/1.10/cli/command-reference/dcos-cluster/dcos-cluster-attach/) cluster. To set the attached cluster, set the variable with the command:

```bash
export DCOS_CLUSTER=<cluster_name>
```

<a name="dcos-config"></a>
#### `DCOS_CONFIG` (DC/OS CLI 0.4.x only)

The path to a DC/OS configuration file. If you put the DC/OS configuration file in `/home/jdoe/config/dcos.toml`, set the variable with the command:

```bash
export DCOS_CONFIG=/home/jdoe/config/dcos.toml
```

If you have the `DCOS_CONFIG` environment variable configured:

- After conversion to the [new configuration structure](#configuration-files), `DCOS_CONFIG` is no longer honored.
- Before you call `dcos cluster setup`, you can change the configuration pointed to by `DCOS_CONFIG` using `dcos config set`. This command prints a warning message saying the command is deprecated and recommends using `dcos cluster setup`.


<a name="dcos-dir"></a>
#### `DCOS_DIR` (DC/OS CLI 0.5.x and higher only)

The path to a DC/OS configuration directory. If you want the DC/OS configuration directory to be `/home/jdoe/config`, set the variable with the command:

```bash
export DCOS_DIR=/home/jdoe/config
```

1. Optionally set `DCOS_DIR` and run `dcos cluster setup` command.

    ```
    export DCOS_DIR=<path/to/config_dir> (optional, default when not set is ~/.dcos)
    dcos cluster setup <url>
    ```

   This setting generates and updates per cluster configuration under `$DCOS_DIR/clusters/<cluster_id>`. Sets newly set up cluster as the attached one.


<a name="dcos-ssl-verify"></a>
#### `DCOS_SSL_VERIFY`
Indicates whether to verify SSL certificates or set the path to the SSL certificates. You must set this variable manually. Setting this environment variable is equivalent to setting the `dcos config set core.ssl_verify` option in the DC/OS configuration [file](#configuration-files). For example, to indicate that you want to set the path to SSL certificates:

```bash
export DCOS_SSL_VERIFY=false
```

<a name="dcos-verbosity"></a>
#### `DCOS_VERBOSITY`
Prints log messages to stderr at or above the level indicated. This is equivalent to the `--log-level` command-line option.

<a name="dcos-debug"></a>
#### `DCOS_DEBUG`
Indicates whether to print additional debug messages to `stdout`. By default this is set to `false`. For example:

```bash
export DCOS_DEBUG=true
```
