---
layout: layout.pug
navigationTitle:  Configuring the CLI
title: Configuring the CLI
menuWeight: 2
excerpt: Configuring the command line interface
enterprise: false
render: mustache
model: /mesosphere/dcos/2.0/data.yml
---

You can access DC/OS CLI configuration with the [dcos cluster](/mesosphere/dcos/2.0/cli/command-reference/dcos-cluster/) and [dcos config](/mesosphere/dcos/2.0/cli/command-reference/dcos-config/) command groups.

# Environment variables

The DC/OS CLI supports the following environment variables, which can be set dynamically.

<a name="dcos-cluster"></a>

#### `DCOS_CLUSTER`

To set the [attached cluster](/mesosphere/dcos/2.0/cli/command-reference/dcos-cluster/dcos-cluster-attach/), set the variable with the command:

```bash
export DCOS_CLUSTER=<cluster_name>
```

<a name="dcos-dir"></a>

#### `DCOS_DIR`

The path to a DC/OS configuration directory. If you want the DC/OS configuration directory to be `/home/jdoe/config`, set the variable with the command:

```bash
export DCOS_DIR=/home/jdoe/config
```

The next time you can run the `dcos cluster setup command`, the cluster configuration will be created under `/home/jdoe/clusters/<cluster_id>/` instead of the default `~/.dcos/clusters/<cluster_id>/`.

<a name="dcos-ssl-verify"></a>

#### `DCOS_SSL_VERIFY`

Indicates whether to verify SSL certificates or set the path to the SSL certificates. You must set this variable manually. Setting this environment variable is equivalent to setting the `dcos config set core.ssl_verify` option in the DC/OS configuration [file](#configuration-files). For example, to indicate that you want to set the path to SSL certificates:

```bash
export DCOS_SSL_VERIFY=false
```

<a name="dcos-verbosity"></a>

#### `DCOS_VERBOSITY`

Prints log messages to stderr at or above the level indicated. `DCOS_VERBOSITY=1` is equivalent to the `-v` command-line option. `DCOS_VERBOSITY=2` is equivalent to the `-vv` command-line option.
