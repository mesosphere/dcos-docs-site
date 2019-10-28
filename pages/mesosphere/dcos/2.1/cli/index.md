---
layout: layout.pug
navigationTitle:  CLI
title: CLI
menuWeight: 50
excerpt: Understanding the command line interface utility in DC/OS
enterprise: false
render: mustache
model: /mesosphere/dcos/2.0/data.yml
---

The DC/OS command line interface (DC/OS CLI) utility allows you to manage cluster nodes, install and manage packages, inspect the cluster state, and manage services and tasks.

DC/OS 2.0 requires the DC/OS CLI >= 0.8. To install it, [follow these instructions](/mesosphere/dcos/2.0/cli/install/).

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
    diagnostics
        Create and manage DC/OS diagnostics bundles
    help
        Help about any command
    job
        Deploy and manage jobs in DC/OS
    marathon
        Deploy and manage applications to DC/OS
    node
        View DC/OS node information
    package
        Install and manage DC/OS software packages
    plugin
        Manage CLI plugins
    quota
        Manage DC/OS quotas
    service
        Manage DC/OS services
    task
        Manage DC/OS tasks

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

```bash
dcos cluster setup <cluster-url>
```

After following the login procedure, your CLI is now ready to interact with your cluster. You will notice that it now has additional commands such as `marathon`, `node`, `package` etc. These commands come from the [plugins](/mesosphere/dcos/2.0/cli/plugins/), dcos-core-cli and, if applicable, dcos-enterprise-cli, which is automatically installed as part of the setup command.

To display the DC/OS CLI version, run:

```bash
dcos --version
```

# Listing your clusters

The DC/OS CLI can work with multiple clusters. The following command displays the latest configured cluster:

```bash
$ dcos cluster list
        NAME               ID                        STATUS     VERSION      URL
  *   cluster 26f72c2f-8d03-47d7-b95f-972b1fd3dea2  AVAILABLE    1.13  <cluster-url>
```

<p class="message--note"><strong>NOTE: </strong>The * indicates that the CLI is currently attached to the cluster name. If you run the setup command again with another cluster, you will see a new item in the list.</p>

<a name="configuration-files"></a>

# DC/OS CLI versions and configuration files

The DC/OS CLI has a configuration file for each connected cluster, which by default is stored in `~/.dcos/clusters/<cluster_id>/dcos.toml`. You can optionally change the base portion (`~/.dcos`) of the configuration directory using the [`DCOS_DIR`](#dcos-cdir) environment variable.
