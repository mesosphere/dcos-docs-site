---
layout: layout.pug
navigationTitle:  CLI
title: CLI
menuWeight: 50
excerpt: Understanding the command line interface utility in DC/OS

enterprise: false
---

<!-- The source repo for this topic is https://github.com/dcos/dcos-docs -->


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

# <a name="setupcluster"></a> Setting up a cluster

In order to interact with your cluster, you first need to set up the CLI.

```bash
$ dcos cluster setup <cluster-url>
```

After following the login flow, your CLI is now ready to interact with your cluster. You will notice that it now has additional commands such as `marathon`, `node`, `package` etc. These commands come from the [plugins](/1.12/cli/plugins), dcos-core-cli and, if applicable, dcos-enterprise-cli, which is automatically installed as part of the setup command.

# Listing your clusters

The DC/OS CLI can work with multiple clusters, the latest configured cluster should now appear with the following command:

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
