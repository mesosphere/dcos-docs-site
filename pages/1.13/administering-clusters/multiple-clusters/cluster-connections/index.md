---
layout: layout.pug
navigationTitle:  Cluster Connections
title: Cluster Connections
menuWeight: 3
excerpt: Connecting to multiple DC/OS clusters 
---

You connect to multiple DC/OS clusters using [dcos cluster](/1.13/cli/command-reference/dcos-cluster/) commands.

The  `dcos cluster` command has subcommands to set up connections to and attach to clusters, and rename and remove clusters.

## Setting up a connection to a cluster

Setting up a connection to a cluster stores connection configuration in the file `<home-directory>/.dcos/clusters/<cluster_id>/dcos.toml`, attaches to the cluster, and authenticates to DC/OS. Attaching to a cluster sets it as the active cluster.

To set up a connection to a cluster, run the `dcos cluster setup` command, replacing `<dcos-url>` with the cluster URL:

```bash
dcos cluster setup <dcos-url>
```

## Attaching to a cluster

To attach to a connected cluster, run the `dcos cluster attach` command, replacing `<name>` with the cluster name:

```bash
dcos cluster attach <connected-cluster-name>
```

## Viewing connected clusters

To view all connected clusters, run the `dcos cluster list` command. The command lists the cluster name, cluster ID, status, DC/OS version (if the cluster is reachable), and the URL of the master node. The attached cluster has an asterisk (`*`) by its cluster name.

Status can have the following values:

- AVAILABLE : the cluster was set up locally and is reachable
- UNAVAILABLE : the cluster was set up locally and is unreachable
- UNCONFIGURED : the cluster was not set up locally (i.e., the cluster is [linked](/1.13/administering-clusters/multiple-clusters/cluster-links/) to the currently attached cluster).

In this example, the cluster named `dcosdev` is attached:

```bash
  NAME                   CLUSTER ID                 STATUS       VERSION                     URL
dcosprod     5f7fb957-6daf-446e-8689-0b5b476b2d39  UNAVAILABLE   1.12.0    https://dcosclus-eosy.us-west-2.elb.amazonaws.com
dcosdev*     cf96739f-f800-42ea-95d7-d60acc689194  AVAILABLE     1.12.0    https://dcosclus-5m65.us-west-2.elb.amazonaws.com
```

To view only the attached cluster, run the `dcos cluster list --attached` command.

## Renaming a cluster

You can rename a connected cluster with the `dcos cluster rename <name> <new-name>` command. For example, to rename your cluster from `dcosdev` to `dcoslive`:

```bash
dcos cluster rename dcosdev dcoslive
```

<p class="message--note"><strong>NOTE: </strong>This renames the cluster only locally. The actual cluster name on the server is not changed.</p>


## Removing a cluster

You can remove a connected cluster with the `dcos cluster remove <name>` command. For example, to remove the cluster `dcosdev`:

```bash
dcos cluster remove dcosdev
```

If you remove the attached cluster, dcos commands to perform operations such as installing packages on the cluster will fail until you attach another connected cluster.
