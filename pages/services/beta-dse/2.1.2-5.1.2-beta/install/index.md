---
layout: layout.pug
navigationTitle: 
title: Installing and Customizing
menuWeight: 20
excerpt:

---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-commons -->


## Installation with Default Settings
The service comes with reasonable defaults for trying it out, but which should not be used in production. See note below.

Each DSE Node has:
- 2.5 CPUs
- 2500 MB mem
- Ports: [see here](https://docs.datastax.com/en/latest-dse/datastax_enterprise/sec/configFirewallPorts.html)

The OpsCenter Node has:
- 1 instance
- 2 CPUs
- 6000 MB mem
- 1 10240 MB disk
- Ports: [see here](https://docs.datastax.com/en/latest-opscenter/opsc/reference/opscLcmPorts.html)

From the CLI, DSE may be installed with a default configuration as follows:
```
$ dcos package install datastax-dse
$ dcos package install datastax-ops
```

From the DC/OS Dashboard website, DSE may be installed with a default configuration as follows:
1. Visit http://yourcluster.com/ to view the DC/OS Dashboard.
1. Navigate to `Catalog` and find the `datastax-dse` package.
1. Click `Deploy` to use default settings.
1. To use the built-in OpsCenter, repeat steps 2 and 3, but substitute `datastax-ops` for `datastax-dse`.

### NOTE: DSE should not be deployed to production with the default settings. In production, the DSE nodes should be operated with 32 GB of memory and 16 GB of heap.

## Installation with Custom Settings
You may customize settings at initial install. See below for an explanation of some of those settings and how they may be used.

From the CLI, DSE may be installed with a custom configuration as follows:
```
$ dcos package install datastax-dse --options=your-dse-options.json
```
OpsCenter can be installed with a custom configuration the same way:
```
$ dcos package install datastax-ops --options=your-datastax-ops-options.json
```
For more information about building the options.json file, see the [DC/OS Documentation](https://docs.autoip.dcos.thisdcos.directoryphere.com/latest/usage/managing-services/config-universe-service/).

From the DC/OS Dashboard website, DSE may be installed with a custom configuration as follows:
1. Visit http://yourcluster.com/ to view the DC/OS Dashboard.
1. Navigate to `Universe` => `Packages` and find the `datastax-dse` package.
1. Click `Install`, then in the pop up dialog click `Advanced` to see the customization dialog.
1. Make your changes to the default configuration in the customization dialog, then click `Review`.
1. Examine the configuration summary for any needed changes. Click `Back` to make changes, or `Install` to confirm the settings and install the service.
1. If using built-in OpsCenter, repeat the above steps, but substitute `datastax-ops` for `datastax-dse`.

<!-- THIS BLOCK DUPLICATES THE OPERATIONS GUIDE -->

## Integration with DC/OS access controls

In Enterprise DC/OS 1.10 and above, you can integrate your SDK-based service with DC/OS ACLs to grant users and groups access to only certain services. You do this by installing your service into a folder, and then restricting access to some number of folders. Folders also allow you to namespace services. For instance, `staging/dse` and `production/dse`.

Steps:

1. In the DC/OS GUI, create a group, then add a user to the group. Or, just create a user. Click **Organization** > **Groups** > **+** or **Organization** > **Users** > **+**. If you create a group, you must also create a user and add them to the group.
1. Give the user permissions for the folder where you will install your service. In this example, we are creating a user called `developer`, who will have access to the `/testing` folder.
   Select the group or user you created. Select **ADD PERMISSION** and then toggle to **INSERT PERMISSION STRING**. Add each of the following permissions to your user or group, and then click **ADD PERMISSIONS**.

   ```
   dcos:adminrouter:service:marathon full				
   dcos:service:marathon:marathon:services:/testing full
   dcos:adminrouter:ops:mesos full
   dcos:adminrouter:ops:slave full
   ```
1. Install your service into a folder called `test`. Go to **Catalog**, then search for **datastax-dse**.
1. Click **CONFIGURE** and change the service name to `/testing/dse`, then deploy.

   The slashes in your service name are interpreted as folders. You are deploying Kafka in the `/testing` folder. Any user with access to the `/testing` folder will have access to the service.

**Important:**
- Services cannot be renamed. Because the location of the service is specified in the name, you cannot move services between folders.
- DC/OS 1.9 and earlier does not accept slashes in service names. You may be able to create the service, but you will encounter unexpected problems.

### Interacting with your foldered service

- Interact with your foldered service via the DC/OS CLI with this flag: `--name=/path/to/myservice`.
- To interact with your foldered service over the web directly, use `http://<dcos-url>/service/path/to/myservice`. E.g., `http://<dcos-url>/service/testing/kafka/v1/endpoints`.

<!-- END DUPLICATE BLOCK -->

## Zones

Placement constraints can be applied to zones by referring to the `@zone` key. For example, one could spread pods across a minimum of 3 different zones by specifying the constraint `[["@zone", "GROUP_BY", "3"]]`.
 
<!--
When the region awareness feature is enabled (currently in beta), the `@region` key can also be referenced for defining placement constraints. Any placement constraints that do not reference the `@region` key are constrained to the local region.
-->
### Example

Suppose we have a Mesos cluster with zones `a`,`b`,`c`.

## Balanced Placement for a Single Region

```
{
   ...
  "count": 6,
  "placement_constraint": "[[\"@zone\", \"GROUP_BY\", \"3\"]]",
  ...
}
```

- Instances will all be evenly divided between zones `a`,`b`,`c`.

## Service Settings
### Service Name
Each instance of DSE must have a different service name. You can configure the service name in the **service** section of the install dialog. The default service name (used in many examples here) is `datastax-dse`.

### DSE Cluster and Datacenter
You may customize both the Cluster name and Datacenter name for a given service instance. Their defaults are `cluster_datastax` and `dc_datastax`, respectively. These may both be configured under the **cluster** configuration section.

### Selecting DSE Components
DSE Search, Analytics, and Graph are enabled by default, but you can disable any or all of them by modifying the default configuration.

Go to the **cluster** configuration section. Enable/disable the following options as desired (all enabled by default):
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

Note that in a multi-DC environment, all DSE DCs within a DSE Cluster **must** share the same port configuration. As such, co-location of DSE nodes within the same DSE Cluster is not supported.

### Storage Volumes
The DSE DC/OS service supports two volume types:
- `ROOT` volumes are effectively an isolated _directory_ on the root volume, sharing IO/spindles with the rest of the host system.
- `MOUNT` volumes are a dedicated device or partition on a separate volume, with dedicated IO/spindles.

`MOUNT` volumes require [additional configuration on each DC/OS agent system](https://dcos.io/docs/1.8/administration/storage/mount-disk-resources/), so the service currently uses `ROOT` volumes by default. To ensure reliable and consistent performance in a production environment, you must configure **two MOUNT volumes** on the machines which will run DSE in your cluster, and then configure the following as `MOUNT` volumes under **dsenode**:
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

For an example of updating placement constraints, see [Managing](#managing) below.

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
