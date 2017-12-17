---
layout: layout.pug
navigationTitle:  Installing and Customizing
title: Installing and Customizing
menuWeight: 20
excerpt:
featureMaturity:
enterprise: false
---

## Installation with Default Settings
The service comes with reasonable defaults for trying it out, but which should not be used in production. See note below.

Each DSE Node has:
-  CPUs: 2.5
-  Memory: 8.5 GB
-  Ports: [see here](https://docs.datastax.com/en/latest-dse/datastax_enterprise/sec/configFirewallPorts.html)

The Opscenter Node has:
-  CPUs: 2
-  Memory: 4 GB
-  Ports: [see here](https://docs.datastax.com/en/latest-opscenter/opsc/reference/opscLcmPorts.html)

From the CLI, DSE may be installed with a default configuration as follows:
```
$ dcos package install dse
```

From the DC/OS Dashboard website, DSE may be installed with a default configuration as follows:
1. Visit http://yourcluster.com/ to view the DC/OS Dashboard.
1. Navigate to `Universe` => `Packages` and find the `dse` package.
1. Click `Install`, then in the pop up dialog click `Install` again to use default settings.

### NOTE: DSE should not be deployed to production with the default settings. In production, the DSE Nodes should be operated with 32 GB of memory and 16 GB of heap.

## Installation with Custom Settings
You may customize settings at initial install. See below for an explanation of some of those settings and how they may be used.

From the CLI, DSE may be installed with a custom configuration as follows:
```
$ dcos package install dse --options=your-options.json
```
For more information about building the options.json file, see the [DC/OS Documentation](/1.10/deploying-services/config-universe-service/).

From the DC/OS Dashboard website, DSE may be installed with a custom configuration as follows:
1. Visit http://yourcluster.com/ to view the DC/OS Dashboard.
1. Navigate to `Universe` => `Packages` and find the `dse` package.
1. Click `Install`, then in the pop up dialog click `Advanced` to see the customization dialog.
1. Make your changes to the default configuration in the customization dialog, then click `Review`.
1. Examine the configuration summary for any needed changes. Click `Back` to make changes, or `Install` to confirm the settings and install the service.

## Service Settings
### Service Name
Each instance of DSE must have a different service name. You can configure the service name in the **service** section of the install dialog. The default service name (used in many examples here) is `dse`.

### DSE Cluster and Datacenter
You may customize both the Cluster name and Datacenter name for a given service instance. Their defaults are `cluster_cassandra` and `dc_cassandra`, respectively. These may both be configured under the **cluster** configuration section.

### Selecting DSE Components
DSE Search, Analytics, and Graph are enabled by default, but you can disable any or all of them by modifying the default configuration.

Go to the **dsenode** configuration section. Enable/disable the following options as desired (all enabled by default):
- `Enable DSE Search`
- `Enable DSE Analytics`
- `Enable DSE Graph`

## Node Settings
The following settings may be adjusted to customize the amount of resources allocated to each DSE Node. Datastax's minimum system requirements must be taken into consideration when adjusting these values. Reducing these values may result in adverse performance and possibly even task failures.

Each of the following settings may be customized under the **dsenode** configuration section.

### Node Count
Customize the `Node Count` setting (default 3). Consult the DSE docs for minimum node requirements.

### CPU
The amount of CPU allocated to each DSE Node may be customized. A value of `1.0` equates to one full CPU core on a machine. This value may be customized by editing the **cpus** value under the **dsenode** configuration section.

### Memory
The amount of RAM allocated to each DSE Node may be customized. This value may be customized by editing the **mem** value (in MB) under the **dsenode** configuration section.

If the allocated memory is customized, you must also update the **heap** value under that section as well. As a rule of thumb we recommend that **heap** be set to half of **mem**. For example, for a **mem** value of `32000`, **heap** should be `16000`. If you do not do this, you may see restarted `dse-#-node` tasks due to memory errors.

### Ports
Each port exposed by DSE components may be customized via the service configuratiton. If you wish to install multiple instances of DSE and have them colocate on the same machines, you must ensure that **no** ports are common between those instances. Customizing ports is only needed if you require multiple instances sharing a single machine. This customization is optional otherwise.

Each component's ports may be customized in the following configuration sections:
- DSE Nodes (as a group): `Node placement constraint` under **dsenode**.
- OpsCenter (if built-in instance is enabled): `OpsCenter placement constraint` under **opscenter**.
- Studio (if enabled): `Studio placement constraint` under **studio**.

Note that in a multi-DC environment, all DSE DCs within a DSE Cluster **must** share the same port configuration. As such, co-location of DSE nodes within the same DSE Cluster is not supported.

### Storage Volumes
The DSE DC/OS service supports two volume types:
- `ROOT` volumes are effectively an isolated _directory_ on the root volume, sharing IO/spindles with the rest of the host system.
- `MOUNT` volumes are a dedicated device or partition on a separate volume, with dedicated IO/spindles.

`MOUNT` volumes require [additional configuration on each DC/OS agent system](https://dcos.io/docs/1.8/administration/storage/mount-disk-resources/), so the service currently uses `ROOT` volumes by default. To ensure reliable and consistent performance in a production environment, you must configure **two MOUNT volumes** on the machines which will run DSE in your cluster, and then configure the following as `MOUNT` volumes under **dsenode**:
- Persistent data volume type = `MOUNT`
- Persistent Solr volume type (if `DSE Search` is enabled) = `MOUNT`
Using `ROOT` volumes for these is not supported in production.

### Placement Constraints
Placement constraints allow you to customize where a DSE instance is deployed in the DC/OS cluster. Placement constraints may be configured separately for each of the node types in the following locations:

  - DSE Nodes (as a group): `Node placement constraint` under **dsenode**.
  - OpsCenter (if built-in instance is enabled): `OpsCenter placement constraint` under **opscenter**.
  - Studio (if enabled): `Studio placement constraint` under **studio**.

Placement constraints support all [Marathon operators (reference)](http://mesosphere.github.io/marathon/docs/constraints.html) with this syntax: `field:OPERATOR[:parameter]`. For example, if the reference lists `[["hostname", "UNIQUE"]]`, you should  use `hostname:UNIQUE`.

A common task is to specify a list of whitelisted systems to deploy to. To achieve this, use the following syntax for the placement constraint:
```
hostname:LIKE:10.0.0.159|10.0.1.202|10.0.3.3
```

You must include spare capacity in this list so that if one of the whitelisted systems goes down, there is still enough room to repair your service without that system.

For an example of updating placement constraints, see [Managing](#managing) below.

### dse.yaml and cassandra.yaml settings
Nearly all settings for `dse.yaml` and `cassandra.yaml` are exposed as configuration options, allowing them to be deployed and updated automatically by the service.

- `dse.yaml` options are listed under the **dse** section
- `cassandra.yaml` options are listed under the **cassandra** section

For more information on each setting, view Datastax's documentation for [dse.yaml](https://docs.datastax.com/en/latest-dse/datastax_enterprise/config/configDseYaml.html) and [cassandra.yaml](https://docs.datastax.com/en/cassandra/3.0/cassandra/configuration/configCassandra_yaml.html).

## Use an external OpsCenter
The DSE DC/OS service may be configured to either launch its own OpsCenter dashboard (default), or to point to an external OpsCenter instance.

Follow these steps to configure an external in the **opscenter** section of the installation screen.

1. Uncheck the `Enable Built-in Datastax OpsCenter` option
1. Populate the `External OpsCenter Host` option with the hostname of your external OpsCenter instance.

If the external instance is being run by another instance of DC/OS DSE Service, this field can be populated as `opscenter-0-node.<service-name>.mesos`. For example `opscenter-0-node.dse-1.mesos` if the service running OpsCenter is named `dse-1`.

## Installation with DSE Multi-Datacenter
Each DSE Datacenter must be configured with the seed nodes of the other DSE Datacenters. For example, let's deploy three Datacenters (as separate DC/OS services in DC/OS terms), named `dse-1`, `dse-2`, and `dse-3`, and then link them all together. Here is an example timeline from start to finish:

**NOTE** These instructions are an example and should be vetted by Datastax for the correct ordering of operations (when to add seed nodes, etc.).

1. Add a DSE service from the DC/OS Universe. Deploy `dse-1` with the following customizations:
    - In **service**, set `Service Name` = `dse-1`
    - In **cluster**, set `DSE Datacenter` = `dc_cassandra_1`
1. Wait for `dse-1` to finish deploying before continuing with the other DCs.
1. Add a second DSE service from the DC/OS Universe. Deploy `dse-2` with the following customizations:
    - In **service**, set:
        - `Service Name` = `dse-2`
    - In **cluster**, set:
        - `DSE Datacenter` = `dc_cassandra_2`
        - `External Seed Nodes` = `dse-0-node.dse-1.mesos,dse-1-node.dse-1.mesos` (point `dse-2` to `dse-1`'s seeds)
    - In **opscenter**, set:
        - `Built-in Datastax OpsCenter` disabled
        - `External OpsCenter` = `opscenter-0-node.dse-1.mesos` (point `dse-2` to `dse-1`'s OpsCenter)
1. Add a third DSE service from the DC/OS Universe. Deploy `dse-3` with the following customizations:
    - In **service**, set:
        - `Service Name` = `dse-3`
    - In **cluster**, set:
        - `DSE Datacenter` = `dc_cassandra_3`
        - `External Seed Nodes` = `dse-0-node.dse-1.mesos,dse-1-node.dse-1.mesos` (point `dse-3` to `dse-1`'s seeds)
    - In **opscenter**, set:
        - `Built-in Datastax OpsCenter` disabled
        - `External OpsCenter` = `opscenter-0-node.dse-1.mesos` (point `dse-3` to `dse-1`'s OpsCenter)
1. Wait for `dse-2` and `dse-3` to finish deploying. Then, update the seed nodes across all the instances:
    1. Go to the service view of `dse-1` in the DC/OS UI. Click the menu in the upper right and then choose **Edit**. Go to the **Environment** tab and set `DSE_EXTERNAL_SEEDS` = `dse-0-node.dse-2.mesos,dse-1-node.dse-2.mesos,dse-0-node.dse-3.mesos,dse-1-node.dse-3.mesos` (point `dse-1` to `dse-2` and `dse-3`).
    1. Wait for the seed update to roll out across `dse-1` nodes.
    1. Go to the service view of `dse-2` in the DC/OS UI. Click the menu in the upper right and then choose **Edit**. Go to the **Environment** tab and update `DSE_EXTERNAL_SEEDS` = `dse-0-node.dse-1.mesos,dse-1-node.dse-1.mesos,dse-0-node.dse-3.mesos,dse-1-node.dse-3.mesos` (point `dse-2` to `dse-1` and `dse-3`).
    1. Wait for the seed update to roll out across `dse-2` nodes.
    1. Go to the service view of `dse-3` in the DC/OS UI. Click the menu in the upper right and then choose **Edit**. Go to the **Environment** tab and update `DSE_EXTERNAL_SEEDS` = `dse-0-node.dse-2.mesos,dse-2-node.dse-1.mesos,dse-0-node.dse-3.mesos,dse-1-node.dse-3.mesos` (point `dse-3` to `dse-1` and `dse-2`).
    1. Wait for the seed update to roll out across `dse-3` nodes.
1. Now, each of the three DCs has seed nodes configured for the other DCs. Because we used `.mesos` hostnames, which automatically update to follow the tasks, we won't need to reconfigure seeds if they're moved between systems in the DC/OS cluster.
