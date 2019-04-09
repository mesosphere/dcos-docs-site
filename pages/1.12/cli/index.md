---
layout: layout.pug
navigationTitle:  CLI
title: CLI
menuWeight: 50
excerpt: Understanding the command line interface utility in DC/OS

enterprise: false
---

The DC/OS command line interface (DC/OS CLI) utility allows you to manage cluster nodes, install and manage packages, inspect the cluster state, and manage services and tasks.

DC/OS 1.12 requires DC/OS CLI >= 0.7. To install it, [follow the instructions](/1.12/cli/install/).

To list available commands, run `dcos` with no parameters:

```bash
$ dcos

Command line utility for the Mesosphere Datacenter Operating
System (DC/OS). The Mesosphere DC/OS is a distributed operating
system built around Apache Mesos. This utility provides tools
for easy management of a DC/OS installation.

Available DC/OS commands:

	auth           	Authenticate to DC/OS cluster
	cluster        	Manage your DC/OS clusters
	config         	Manage the DC/OS configuration file
	help           	Display help information about DC/OS
	job            	Deploy and manage jobs in DC/OS
	marathon       	Deploy and manage applications to DC/OS
	node           	View DC/OS node information
	package        	Install and manage DC/OS software packages
	service        	Manage DC/OS services
	task           	Manage DC/OS tasks

Get detailed command description with 'dcos <command> --help'.
```
Table 1 - Commands

| Name | Description |
|---------|-------------|
|`auth` | Authenticate to DC/OS cluster |
| `cluster` | Manage your DC/OS clusters|
| `config` | Manage the DC/OS configuration file |
| `help` | Help about any command | 
| `job` | Deploy and manage jobs in DC/OS|
| `marathon` | Deploy and manage applications to DC/OS |
| `node` | View DC/OS node information |
| `package` | Install and manage DC/OS software packages |
| `plugin` | Manage CLI plugins |
| `service` | Manage DC/OS services |
| `task` | Manage DC/OS tasks |

Table 2 - Options

| Name | Description |
|---------|-------------|
| `--version` | Print version information |
| `-v`, `-vv` | Output verbosity (verbose or very verbose) |
| `-h`, `--help` | Show usage help.  Use "dcos [command] --help" for more information about a command. |


More information is available in the following expanded descriptions:

- [Setting up a cluster](#setupcluster)
- [DC/OS CLI versions and configuration files](#configuration-files)


<a name="setupcluster"></a>
# Setting up a cluster

In order to interact with your cluster, you first need to set up the CLI.

To display the DC/OS CLI version, run:

```bash
dcos --version
```
You will get output similar to this:

```
$ dcos --version
dcoscli.version=0.6.1
dcos.version=N/A
dcos.commit=N/A
dcos.bootstrap-id=N/A
```

<a name="configuration-files"></a>

# DC/OS CLI versions and configuration files

DC/OS CLI 0.4.x and 0.5.x use a different structure for the location of configuration files.

DC/OS CLI 0.4.x has a single configuration file, which by default is stored in `~/.dcos/dcos.toml`. In DC/OS CLI 0.4.x you can optionally change the location of the configuration file using the [`DCOS_CONFIG`](#dcos-config) environment variable.

DC/OS CLI 0.5.x has a configuration file for each connected cluster, which by default is stored in `~/.dcos/clusters/<cluster_id>/dcos.toml`. In DC/OS CLI 0.5.x you can optionally change the base portion (`~/.dcos`) of the configuration directory using the [`DCOS_DIR`](#dcos-cdir) environment variable.

- If you update to the DC/OS CLI 0.5.x and run any CLI command, it will trigger conversion from the old to the new configuration structure.
- After you call `dcos cluster setup`, (or after conversion has occurred), if you attempt to update the cluster configuration using a `dcos config set` command, the command displays a warning message saying the command is deprecated and the cluster configuration state may now be corrupted.

# Environment variables

The DC/OS CLI supports the following environment variables, which can be set dynamically. The CLI version you are using will determine which command you should use.

- [`DCOS_CLUSTER`](#dcos-cluster) (DC/OS CLI 0.5.x and later only)
- [`DCOS_CONFIG`](#dcos-config) (DC/OS CLI 0.4.x only)

<a name="dcos-cluster"></a>

## `DCOS_CLUSTER` (DC/OS CLI 0.5.x and higher only)

The [attached](/1.12/cli/command-reference/dcos-cluster/dcos-cluster-attach/) cluster. To set the attached cluster, set the variable with the command:

```bash
dcos cluster setup <cluster-url>
```
Accept all the login and authentication questions: 
```bash
dcos cluster setup https://10.15.150.126 
SHA256 fingerprint of cluster certificate bundle:
FF:65:FE:B4:FF:B8:B6:30:C9:BE:D4:18:EE:03:31:8D:91:D2:A5:56:E8:3D:DF:06:02:E3:98:56:BA:58:07:21 [yes/no] yes
10.15.150.126's username: <username>
username@10.15.150.126's password: <password>
```
After following the login procedure, your CLI is now ready to interact with your cluster. 



### DC/OS Enterprise CLI

The [`dcos cluster setup`](1.12/cli/command-reference/dcos-cluster/dcos-cluster-setup/) command installs the [plugins](/1.12/cli/plugins/) and `dcos-core-cli`, but not `dcos-enterprise-cli`.  DC/OS Enterprise CLI must be installed separately. See [Installing the DC/OS Enterprise CLI](1.12/cli/enterprise-cli/#installing-the-dcos-enterprise-cli).

After you install DC/OS Enterprise CLI, you will see new commands added:

- `dcos backup`
- `dcos license`
- `dcos security`

```
dcos
Command line utility for the Mesosphere Datacenter Operating
System (DC/OS). The Mesosphere DC/OS is a distributed operating
system built around Apache Mesos. This utility provides tools
for easy management of a DC/OS installation.

Available DC/OS commands:

	auth           	Authenticate to DC/OS cluster
	backup         	Access DC/OS backup functionality
	cluster        	Manage your DC/OS clusters
	config         	Manage the DC/OS configuration file
	help           	Display help information about DC/OS
	job            	Deploy and manage jobs in DC/OS
	license        	Manage your DC/OS licenses
	marathon       	Deploy and manage applications to DC/OS
	node           	View DC/OS node information
	package        	Install and manage DC/OS software packages
	security       	DC/OS security related commands
	service        	Manage DC/OS services
	task           	Manage DC/OS tasks

Get detailed command description with 'dcos <command> --help'.
```
Table 3 - DC/OS Enterprise commands

| Name | Description |
|---------|-------------|
| `backup` | Create backups and restore from them   |
| `license` | Review the status of your license, audit your license, and get or renew a license  | 
| `security` | Manage your DC/OS certificate authority credentials  |


<a name="dcos-config"></a>

## `DCOS_CONFIG` (DC/OS CLI 0.4.x only)

This command displays the path to a DC/OS configuration file. If you put the DC/OS configuration file in `/home/jdoe/config/dcos.toml`, set the variable with the command:

```bash
export DCOS_CONFIG=/home/jdoe/config/dcos.toml
```

If you have the `DCOS_CONFIG` environment variable configured:

- After conversion to the [new configuration structure](#configuration-files), `DCOS_CONFIG` is no longer honored.
- Before you call `dcos cluster setup`, you can change the configuration pointed to by `DCOS_CONFIG` using `dcos config set`. This command displays a warning message saying the command is deprecated and recommends using `dcos cluster setup`.

# Listing your clusters

The DC/OS CLI can work with multiple clusters, using the following commands. 

- [`DCOS_DIR`](#dcos-dir)
- [`DCOS_SSL_VERIFY`](#dcos-ssl-verify)
- [`DCOS_LOG_LEVEL`](#dcos-ssl-verify)
- [`DCOS_LOG_LEVEL`](#dcos-log-level)
- [`DCOS_DEBUG`](#dcos-log-level) 


The following command displays the latest configured cluster:


<a name="dcos-dir"></a>

## `DCOS_DIR` (DC/OS CLI 0.5.x and later only)

If you want to set the DC/OS configuration directory to a specific path, such as  `/home/jdoe/config`, set the variable with the command:

```bash
export DCOS_DIR=/home/jdoe/config
```

Optionally set `DCOS_DIR` and run `dcos cluster setup` command.

```bash
export DCOS_DIR=<path/to/config_dir> (optional, default when not set is ~/.dcos)
dcos cluster setup <url>
```

This setting generates and updates per cluster configuration under `$DCOS_DIR/clusters/<cluster_id>`. It sets the newly set up cluster as the attached one.

<a name="dcos-ssl-verify"></a>

## `DCOS_SSL_VERIFY`
This command indicates whether to verify SSL certificates or set the path to the SSL certificates. You must set this variable manually. Setting this environment variable is equivalent to setting the `dcos config set core.ssl_verify` option in the DC/OS configuration [file](#configuration-files). For example, to indicate that you want to set the path to SSL certificates:

```bash
export DCOS_SSL_VERIFY=false
```

# Listing your clusters

The DC/OS CLI can work with multiple clusters. The following command displays the latest configured cluster:

```bash
$ dcos cluster list
        NAME               ID                        STATUS     VERSION      URL
  *   cluster 26f72c2f-8d03-47d7-b95f-972b1fd3dea2  AVAILABLE    1.12  <cluster-url>
```

<p class="message--note"><strong>NOTE: </strong>The * indicates that the CLI is currently attached to the cluster name. If you run the setup command again with another cluster, you will see a new item in the list.</p>

<a name="dcos-log-level"></a>

## `DCOS_LOG_LEVEL`

This command displays log messages to `stderr` at or above the level indicated. This is equivalent to the `--log-level` command-line option. The severity levels are:

- **`debug`**  - Prints all messages to `stderr`, including informational, warning, error, and critical.
- **`info`** - Prints informational, warning, error, and critical messages to `stderr`.
- **`warning`** - Prints warning, error, and critical messages to `stderr`.
- **`error`** - Prints error and critical messages to `stderr`.
- **`critical`** - Prints only critical messages to `stderr`.

For example, to set the log level to `warning`:

```bash
export DCOS_LOG_LEVEL=warning
```

<a name="dcos-debug"></a>

## `DCOS_DEBUG`

This command indicates whether to print additional debug messages to `stdout`. By default this is set to `false`. For example:

```bash
export DCOS_DEBUG=true
```
