---
layout: layout.pug
navigationTitle:  CLI
title: CLI
menuWeight: 50
excerpt: Understanding the command line interface utility in DC/OS

enterprise: false
---

The DC/OS command line interface (DC/OS CLI) utility allows you to manage cluster nodes, install and manage packages, inspect the cluster state, and manage services and tasks.

DC/OS 1.12 requires the DC/OS CLI >= 0.7. To install it, [follow the instructions](/1.12/cli/install).

To list available commands, run `dcos` with no parameters:

```bash
$ dcos

Usage:
  dcos [command]

Commands:
  auth
      Authenticate to DC/OS cluster
  cluster
      Manage your DC/OS clusters
  config
      Manage the DC/OS configuration file
  help
      Help about any command
  plugin
      Manage CLI plugins

Options:
  --version
      Print version information
  -v, -vv
      Output verbosity (verbose or very verbose)
  -h, --help
      Show usage help

Use "dcos [command] --help" for more information about a command.
```

<a name="setupcluster"></a>
# Setting up a cluster

In order to interact with your cluster, you first need to set up the CLI.

To display the DC/OS CLI version, run:

```bash
dcos --version
```

<a name="configuration-files"></a>
# DC/OS CLI versions and configuration files

DC/OS CLI 0.4.x and 0.5.x use a different structure for the location of configuration files.

DC/OS CLI 0.4.x has a single configuration file, which by default is stored in `~/.dcos/dcos.toml`. In DC/OS CLI 0.4.x you can optionally change the location of the configuration file using the [`DCOS_CONFIG`](#dcos-config) environment variable.

DC/OS CLI 0.5.x has a configuration file for each connected cluster, which by default is stored in `~/.dcos/clusters/<cluster_id>/dcos.toml`. In DC/OS CLI 0.5.x you can optionally change the base portion (`~/.dcos`) of the configuration directory using the [`DCOS_DIR`](#dcos-cdir) environment variable.

**Note:**

- If you update to the DC/OS CLI 0.5.x and run any CLI command, it will trigger conversion from the old to the new configuration structure.
- After you call `dcos cluster setup`, (or after conversion has occurred), if you attempt to update the cluster configuration using a `dcos config set` command, the command displays a warning message saying the command is deprecated and the cluster configuration state may now be corrupted.

# Environment variables

The DC/OS CLI supports the following environment variables, which can be set dynamically.

<a name="dcos-cluster"></a>
#### `DCOS_CLUSTER` (DC/OS CLI 0.5.x and higher only)

The [attached](/1.12/cli/command-reference/dcos-cluster/dcos-cluster-attach/) cluster. To set the attached cluster, set the variable with the command:

```bash
dcos cluster setup <cluster-url>
```

After following the login flow, your CLI is now ready to interact with your cluster. You will notice that it now has additional commands such as `marathon`, `node`, `package` etc. These commands come from the [plugins](/1.12/cli/plugins), dcos-core-cli and, if applicable, dcos-enterprise-cli, which is automatically installed as part of the setup command.

<a name="dcos-config"></a>
#### `DCOS_CONFIG` (DC/OS CLI 0.4.x only)

The path to a DC/OS configuration file. If you put the DC/OS configuration file in `/home/jdoe/config/dcos.toml`, set the variable with the command:

```bash
export DCOS_CONFIG=/home/jdoe/config/dcos.toml
```

If you have the `DCOS_CONFIG` environment variable configured:

- After conversion to the [new configuration structure](#configuration-files), `DCOS_CONFIG` is no longer honored.
- Before you call `dcos cluster setup`, you can change the configuration pointed to by `DCOS_CONFIG` using `dcos config set`. This command displays a warning message saying the command is deprecated and recommends using `dcos cluster setup`.

# Listing your clusters

The DC/OS CLI can work with multiple clusters, the latest configured cluster should now appear with the following command:

<a name="dcos-dir"></a>
#### `DCOS_DIR` (DC/OS CLI 0.5.x and later only)

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
$ dcos cluster list
        NAME               ID                        STATUS     VERSION      URL
  *   cluster 26f72c2f-8d03-47d7-b95f-972b1fd3dea2  AVAILABLE    1.12  <cluster-url>
```

*Note*: The * indicates that the CLI is currently attached to the cluster name. If you run the setup command again with another cluster, you will see a new item in the list.

# <a name="airgapped"></a> Airgapped Clusters

For airgapped customers, the automatic installation of the dcos-core-cli and dcos-enterprise-cli plugins will likely fail because of the airgap
so the 0.7 CLI will have the core plugin for DC/OS 1.12 included to ensure that customers running the CLI from within an airgap will be able to use the CLI after setup.
However, the dcos-enterprise-cli plugin, dcos-core-cli for other versions of DC/OS, and other CLI subcommands are not included and must be downloaded
and brought to the computer using the CLI then installed using `dcos plugin add`.

See the [CLI plugin documentation](/1.12/cli/plugins/) for more details.

*Note*: This will also apply to user accounts that don't have the `dcos:adminrouter:package` permission which would prevent them from accessing Cosmos to get
the dcos-core-cli and dcos-enterprise-cli package descriptions.

<a name="dcos-log-level"></a>

#### `DCOS_LOG_LEVEL`

Prints log messages to `stderr` at or above the level indicated. This is equivalent to the `--log-level` command-line option. The severity levels are:

- **debug** Prints all messages to `stderr`, including informational, warning, error, and critical.
- **info** Prints informational, warning, error, and critical messages to `stderr`.
- **warning** Prints warning, error, and critical messages to `stderr`.
- **error** Prints error and critical messages to `stderr`.
- **critical** Prints only critical messages to `stderr`.

For example, to set the log level to warning:

```bash
export DCOS_LOG_LEVEL=warning
```

<a name="dcos-debug"></a>
#### `DCOS_DEBUG`

Indicates whether to print additional debug messages to `stdout`. By default this is set to `false`. For example:

```bash
export DCOS_DEBUG=true
```