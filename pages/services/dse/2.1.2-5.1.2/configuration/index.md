---
layout: layout.pug
navigationTitle:
excerpt:
title: Configuration
menuWeight: 20
model: /services/dse/data.yml
render: mustache
---


#include /services/include/configuration-install-with-options.tmpl

## Datastax Opscenter
The DC/OS Datastax Opscenter can be installed from the `datastax-ops` package. It is managed identically to datastax-dse. This guide primarily covers `datastax-dse` for conciseness. See the later sections of the guide for any configuration specifics of Opscenter.

#include /services/include/configuration-service-settings.tmpl

## Best Practices

- Use Mesosphere Enterprise DC/OS's placement rules to map your DSE cluster nodes or DC to different availability zones to achieve high resiliency.
- Set up a routine backup service using OpsCenter to back up your business critical data on a regular basis. The data can be stored on the DSE nodes themselves, or on AWS S3 buckets, depending on your IT policy or business needs.
- Set up a routine repair service using OpsCenter to ensure that all data on a replica is consistent within your DSE clusters.



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

Note that in a multi-DC environment, all DSE DCs within a DSE Cluster **must** share the same port configuration. As such, co-location of DSE nodes within the same DSE Cluster is not supported.

### Storage Volumes
The DSE DC/OS service supports two volume types:
- `ROOT` volumes are effectively an isolated _directory_ on the root volume, sharing IO/spindles with the rest of the host system.
- `MOUNT` volumes are a dedicated device or partition on a separate volume, with dedicated IO/spindles.

`MOUNT` volumes require [additional configuration on each DC/OS agent system](/latest/storage/mount-disk-resources/), so the service currently uses `ROOT` volumes by default. To ensure reliable and consistent performance in a production environment, you must configure **two MOUNT volumes** on the machines which will run DSE in your cluster, and then configure the following as `MOUNT` volumes under **dsenode**:
- Persistent data volume type = `MOUNT`
- Persistent Solr volume type (if `DSE Search` is enabled) = `MOUNT`
Using `ROOT` volumes for these is not supported in production.

### Separate volume for commit log data
If you are using non-magnetic disks, then a good approach is to keep your commit log data files on the same volume as your dse data. This is the default configuration.  If for whatever reason you need to keep commit log data on a separate volume, you can do so.  The service install provides options for enabling that feature and provisioning a separate mount point for commit log data.  Just be warned that if you choose to use a separate volume, you will not be able to change it back later.

### Placement Constraints
Placement constraints allow you to customize where a DSE instance is deployed in the DC/OS cluster. Placement constraints may be configured separately for each of the node types in the following locations:

  - DSE Nodes (as a group): `Node placement constraint` under **dsenode**.
  - OpsCenter (if built-in instance is enabled): `OpsCenter placement constraint` under **opscenter**.

Placement constraints support all [Marathon operators (reference)](http://mesosphere.github.io/marathon/docs/constraints.html) with this syntax: `field:OPERATOR[:parameter]`. For example, if the reference lists `[["hostname", "UNIQUE"]]`, you should  use `hostname:UNIQUE`.

A common task is to specify a list of whitelisted systems to deploy to. To achieve this, use the following syntax for the placement constraint:
```
hostname:LIKE:10.0.0.159|10.0.1.202|10.0.3.3
```

You must include spare capacity in this list so that if one of the whitelisted systems goes down, there is still enough room to repair your service without that system.

## Rack-Aware Placement

DSE's "rack"-based fault domain support may be enabled by specifying a placement constraint that uses the `@zone` key. For example, one could spread DSE nodes across a minimum of three different zones/racks by specifying the constraint `@zone:GROUP_BY:3`. When a placement constraint specifying `@zone` is used, DSE nodes will be automatically configured with `rack`s that match the names of the zones. If no placement constraint referencing `@zone` is configured, all nodes will be configured with a default rack of `rack1`.


### dse.yaml and cassandra.yaml settings
Nearly all settings for `dse.yaml` and `cassandra.yaml` are exposed as configuration options, allowing them to be deployed and updated automatically by the service.

- `dse.yaml` options are listed under the **dse** section
- `cassandra.yaml` options are listed under the **cassandra** section

For more information on each setting, view Datastax's documentation for [dse.yaml](https://docs.datastax.com/en/latest-dse/datastax_enterprise/config/configDseYaml.html) and [cassandra.yaml](https://docs.datastax.com/en/cassandra/3.0/cassandra/configuration/configCassandra_yaml.html).

## Use Built-In or External OpsCenter
DSE DC/OS provides the **datastax-ops** package, which you can install to get a default OpsCenter dashboard.  If you prefer to use an external OpsCenter instance, you can configure the **dse** service to point to an externally managed OpsCenter.

Follow these steps to configure **dse** to use an external **opscenter** (in the OpsCenter section of the **dse** installation screen).

1. Check the **ENABLE DATASTAX OPSCENTER** checkbox.
1. Set the **OPSCENTER HOST NAME** field to the hostname of your external OpsCenter instance.

If you choose to run an instance of the **datastax-ops** package, this field can be populated as `opscenter-0-node.<service-name>.autoip.dcos.thisdcos.directory`. For example `opscenter-0-node.datastax-ops-1.autoip.dcos.thisdcos.directory` if the **datastax-ops** service is named `datastax-ops-1`

## Installation with DSE Multi-Datacenter
Each DSE Datacenter must be configured with the seed nodes of the other DSE Datacenters. For example, let's deploy three Datacenters (as separate DC/OS services in DC/OS terms), named `datastax-dse-1`, `datastax-dse-2`, and `datastax-dse-3`, and then link them all together. Here is an example timeline from start to finish:

**Note:** These instructions are an example and should be vetted by Datastax for the correct ordering of operations (when to add seed nodes, etc.).

### DC/OS 1.10 and later

Follow these instructions for DC/OS 1.10 and later. If you are using DC/OS 1.9 or earlier, follow [these instructions](#1.9-and-earlier).

1. Add a DSE service from the DC/OS Universe. Deploy `datastax-dse-1` with the following customizations:
    - In **service**, set `Service Name` = `datastax-dse-1`
    - In **cluster**, set `DSE Datacenter` = `dc_datastax_1`
1. Wait for `datastax-dse-1` to finish deploying before continuing with the other DCs.
1. Add a second DSE service from the DC/OS Universe. Deploy `datastax-dse-2` with the following customizations:
    - In **service**, set:
        - `Service Name` = `datastax-dse-2`
    - In **cluster**, set:
        - `DSE Datacenter` = `dc_datastax_2`
        - `External Seed Nodes` = `dse-0-node.datastax-dse-1.autoip.dcos.thisdcos.directory,dse-1-node.datastax-dse-1.autoip.dcos.thisdcos.directory` (point `datastax-dse-2` to `datastax-dse-1`'s seeds)
    - In **opscenter**, set:
        - `OPSCENTER HOSTNAME` = `opscenter-0-node.datastax-dse-1.autoip.dcos.thisdcos.directory` (point `datastax-dse-2` to `datastax-dse-1`'s OpsCenter)
1. Add a third DSE service from the DC/OS Universe. Deploy `datastax-dse-3` with the following customizations:
    - In **service**, set:
        - `Service Name` = `datastax-dse-3`
    - In **cluster**, set:
        - `DSE Datacenter` = `dc_datastax_3`
        - `External Seed Nodes` = `dse-0-node.datastax-dse-1.autoip.dcos.thisdcos.directory,dse-1-node.datastax-dse-1.autoip.dcos.thisdcos.directory` (point `datastax-dse-3` to `datastax-dse-1`'s seeds)
    - In **opscenter**, set:
        - `OPSCENTER HOSTNAME` = `opscenter-0-node.datastax-dse-1.autoip.dcos.thisdcos.directory` (point `datastax-dse-3` to `datastax-dse-1`'s OpsCenter)
1. Wait for `datastax-dse-2` and `datastax-dse-3` to finish deploying. Then, update the seed nodes across all the instances:
    1. Create a local file called `dse-1-options.json`. Paste the following into the file.

       ```json
       {
         "cluster": {
           "external_seeds": "dse-0-node.datastax-dse-2.autoip.dcos.thisdcos.directory,dse-1-node.datastax-dse-2.autoip.dcos.thisdcos.directory,dse-0-node.datastax-dse-3.autoip.dcos.thisdcos.directory,dse-1-node.datastax-dse-3.autoip.dcos.thisdcos.directory"
         },
       }
       ```
       This points `datastax-dse-1` to `datastax-dse-2` and `datastax-dse-3`.

    1. From the DC/OS CLI, update the service to the new configuration.

       ```json
       dcos datastax-dse update start --options=dse-1-options.json
       ```

    1. Wait for the seed update to roll out across `datastax-dse-1` nodes.
    1. Perform the same operation for `datastax-dse-2` and `datastax-dse-3`.
       - For `datastax-dse-2`, set `cluster.external_seeds` to `dse-0-node.datastax-dse-1.autoip.dcos.thisdcos.directory,dse-1-node.datastax-dse-1.autoip.dcos.thisdcos.directory,dse-0-node.datastax-dse-3.autoip.dcos.thisdcos.directory,dse-1-node.datastax-dse-3.autoip.dcos.thisdcos.directory`.
       - For `datastax-dse-3`, set `cluster.external_seeds` to `dse-0-node.datastax-dse-2.autoip.dcos.thisdcos.directory,dse-2-node.datastax-dse-1.autoip.dcos.thisdcos.directory,dse-0-node.datastax-dse-3.autoip.dcos.thisdcos.directory,dse-1-node.datastax-dse-3.autoip.dcos.thisdcos.directory`.

1. Now, each of the three DCs has seed nodes configured for the other DCs. Because we used `.autoip.dcos.thisdcos.directory` hostnames, which automatically update to follow the tasks, we won't need to reconfigure seeds if they're moved between systems in the DC/OS cluster.

<a name="1.9-and-earlier"></a>

1. Add a DSE service from the DC/OS Universe. Deploy `datastax-dse-1` with the following customizations:
    - In **service**, set `Service Name` = `datastax-dse-1`
    - In **cluster**, set `DSE Datacenter` = `dc_datastax_1`
1. Wait for `datastax-dse-1` to finish deploying before continuing with the other DCs.
1. Add a second DSE service from the DC/OS Universe. Deploy `datastax-dse-2` with the following customizations:
    - In **service**, set:
        - `Service Name` = `datastax-dse-2`
    - In **cluster**, set:
        - `DSE Datacenter` = `dc_datastax_2`
        - `External Seed Nodes` = `dse-0-node.datastax-dse-1.autoip.dcos.thisdcos.directory,dse-1-node.datastax-dse-1.autoip.dcos.thisdcos.directory` (point `datastax-dse-2` to `datastax-dse-1`'s seeds)
    - In **opscenter**, set:
        - `OPSCENTER HOSTNAME` = `opscenter-0-node.datastax-dse-1.autoip.dcos.thisdcos.directory` (point `datastax-dse-2` to `datastax-dse-1`'s OpsCenter)
1. Add a third DSE service from the DC/OS Universe. Deploy `datastax-dse-3` with the following customizations:
    - In **service**, set:
        - `Service Name` = `datastax-dse-3`
    - In **cluster**, set:
        - `DSE Datacenter` = `dc_datastax_3`
        - `External Seed Nodes` = `dse-0-node.datastax-dse-1.autoip.dcos.thisdcos.directory,dse-1-node.datastax-dse-1.autoip.dcos.thisdcos.directory` (point `datastax-dse-3` to `datastax-dse-1`'s seeds)
    - In **opscenter**, set:
        - `OPSCENTER HOSTNAME` = `opscenter-0-node.datastax-dse-1.autoip.dcos.thisdcos.directory` (point `datastax-dse-3` to `datastax-dse-1`'s OpsCenter)
1. Wait for `datastax-dse-2` and `datastax-dse-3` to finish deploying. Then, update the seed nodes across all the instances:
    1. Go to the service view of `datastax-dse-1` in the DC/OS UI. Click the menu in the upper right and then choose **Edit**. Go to the **Environment** tab and set `DSE_EXTERNAL_SEEDS` = `dse-0-node.datastax-dse-2.autoip.dcos.thisdcos.directory,dse-1-node.datastax-dse-2.autoip.dcos.thisdcos.directory,dse-0-node.datastax-dse-3.autoip.dcos.thisdcos.directory,dse-1-node.datastax-dse-3.autoip.dcos.thisdcos.directory` (point `datastax-dse-1` to `datastax-dse-2` and `datastax-dse-3`).
    1. Wait for the seed update to roll out across `datastax-dse-1` nodes.
    1. Go to the service view of `datastax-dse-2` in the DC/OS UI. Click the menu in the upper right and then choose **Edit**. Go to the **Environment** tab and update `DSE_EXTERNAL_SEEDS` = `dse-0-node.datastax-dse-1.autoip.dcos.thisdcos.directory,dse-1-node.datastax-dse-1.autoip.dcos.thisdcos.directory,dse-0-node.datastax-dse-3.autoip.dcos.thisdcos.directory,dse-1-node.datastax-dse-3.autoip.dcos.thisdcos.directory` (point `datastax-dse-2` to `datastax-dse-1` and `datastax-dse-3`).
    1. Wait for the seed update to roll out across `datastax-dse-2` nodes.
    1. Go to the service view of `datastax-dse-3` in the DC/OS UI. Click the menu in the upper right and then choose **Edit**. Go to the **Environment** tab and update `DSE_EXTERNAL_SEEDS` = `dse-0-node.datastax-dse-2.autoip.dcos.thisdcos.directory,dse-2-node.datastax-dse-1.autoip.dcos.thisdcos.directory,dse-0-node.datastax-dse-3.autoip.dcos.thisdcos.directory,dse-1-node.datastax-dse-3.autoip.dcos.thisdcos.directory` (point `datastax-dse-3` to `datastax-dse-1` and `datastax-dse-2`).
    1. Wait for the seed update to roll out across `datastax-dse-3` nodes.
1. Now, each of the three DCs has seed nodes configured for the other DCs. Because we used `.autoip.dcos.thisdcos.directory` hostnames, which automatically update to follow the tasks, we won't need to reconfigure seeds if they're moved between systems in the DC/OS cluster.
