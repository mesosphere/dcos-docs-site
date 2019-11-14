---
layout: layout.pug
navigationTitle: Configuration
excerpt: Configuring DSE
title: Configuration
menuWeight: 20
model: /mesosphere/dcos/services/dse/data.yml
render: mustache
---


#include /mesosphere/dcos/services/include/configuration-install-with-options.tmpl

## {{ model.techMidName }} {{ model.techOpsName }}
The DC/OS {{ model.techMidName }} {{ model.techOpsName }} can be installed from the `{{ model.opsPackageName }}` package. It is managed identically to `{{ model.serviceName }}`. This guide primarily covers `{{ model.serviceName }}` for conciseness. See the later sections of the guide for any configuration specifics of DC/OS {{ model.techMidName }} {{ model.techOpsName }}.

#include /mesosphere/dcos/services/include/configuration-service-settings.tmpl

## Best Practices

- Use Mesosphere Enterprise DC/OS's placement rules to map your {{ model.techShortName }} cluster nodes or DC to different availability zones to achieve high resiliency.
- Set up a routine backup service using {{ model.techOpsName }} to back up your business critical data on a regular basis. The data can be stored on the {{ model.techShortName }} nodes themselves, or on AWS S3 buckets, depending on your IT policy or business needs.
- Set up a routine repair service using {{ model.techOpsName }} to ensure that all data on a replica is consistent within your {{ model.techShortName }} clusters.


## Node Settings
The following settings may be adjusted to customize the amount of resources allocated to each {{ model.techShortName }} Node. {{ model.techMidName }}'s minimum system requirements must be taken into consideration when adjusting these values. Reducing these values may result in adverse performance and possibly even task failures.

Each of the following settings may be customized under the **dsenode** configuration section.

### Node Count
Customize the `Node Count` setting (default 3). Consult the {{ model.techShortName }} documentation for minimum node requirements.

### CPU
The amount of CPU allocated to each {{ model.techShortName }} Node may be customized. A value of `1.0` equates to one full CPU core on a machine. This value may be customized by editing the `cpus` value under the **dsenode** configuration section.

### Memory
The amount of RAM allocated to each {{ model.techShortName }} Node may be customized. This value may be customized by editing the `mem` value (in MB) under the **dsenode** configuration section.

If the allocated memory is customized, you must also update the `heap` value under that section as well. As a rule of thumb we recommend that `heap` be set to half of `mem`. For example, for a `mem` value of `32000`, `heap` should be `16000`. If you do not do this, you may see restarted `dse-#-node` tasks due to memory errors.

### Ports
Each port exposed by {{ model.techShortName }} components may be customized via the service configuration. If you wish to install multiple instances of {{ model.techShortName }} and have them colocate on the same machines, you must ensure that **no** ports are common between those instances. You only need to customize ports if you require multiple instances sharing a single machine. This customization is optional otherwise.

Each component's ports may be customized in the following configuration sections:
- {{ model.techShortName }} Nodes (as a group): `Node placement constraint` under **dsenode**.
- {{ model.techOpsName }} (if built-in instance is enabled): `{{ model.techOpsName }} placement constraint` under {{ model.techOpsName }}.

<p class="message--note"><strong>NOTE: </strong>In a multi-DC environment, all {{ model.techName }} DCs within a {{ model.techShortName }} Cluster <strong>must</strong> share the same port configuration. Co-location of {{ model.techShortName }} nodes within the same {{ model.techShortName }} Cluster is not supported.</p>

### Storage Volumes
The {{ model.techShortName }} DC/OS service supports two volume types:
- `ROOT` volumes are effectively an isolated directory on the root volume, sharing IO/spindles with the rest of the host system.
- `MOUNT` volumes are a dedicated device or partition on a separate volume, with dedicated IO/spindles.

`MOUNT` volumes require [additional configuration on each DC/OS agent system](/mesosphere/dcos/latest/storage/mount-disk-resources/), so the service currently uses `ROOT` volumes by default. To ensure reliable and consistent performance in a production environment, you must configure **two MOUNT volumes** on the machines which will run {{ model.techShortName }} in your cluster, and then configure the following as `MOUNT` volumes under **dsenode**:
- Persistent data volume type = `MOUNT`
- Persistent Solr volume type (if `{{ model.techShortName }} Search` is enabled) = `MOUNT`
Using `ROOT` volumes for these is not supported in production.

### Separate volume for commit log data
If you are using non-magnetic disks, then a good approach is to keep your commit log data files on the same volume as your {{ model.techShortName }} data. This is the default configuration.  If you need to keep commit log data on a separate volume, you can do so.  The service install provides options for enabling that feature and provisioning a separate mount point for commit log data.  Be aware that if you choose to use a separate volume, you will not be able to change it back later.

### Placement Constraints
Placement constraints allow you to customize where a {{ model.techShortName }} instance is deployed in the DC/OS cluster. Placement constraints may be configured separately for each of the node types in the following locations:

  - {{ model.techShortName }} Nodes (as a group): `Node placement constraint` under **dsenode**.
  - {{ model.techOpsName }} (if built-in instance is enabled): `{{ model.techOpsName }} placement constraint` under {{ model.techOpsName }}.

Placement constraints support all [Marathon operators (reference)](http://mesosphere.github.io/marathon/docs/constraints.html) with this syntax: `field:OPERATOR[:parameter]`. For example, if the reference lists `[["hostname", "UNIQUE"]]`, you should  use `hostname:UNIQUE`.

A common task is to specify a list of whitelisted systems to deploy to. To achieve this, use the following syntax for the placement constraint:

```
hostname:LIKE:10.0.0.159|10.0.1.202|10.0.3.3
```

You must include spare capacity in this list so that if one of the whitelisted systems goes down, there is still enough room to repair your service without that system.

## Rack-Aware Placement

{{ model.techShortName }}'s "rack"-based fault domain support may be enabled by specifying a placement constraint that uses the `@zone` key. For example, you  could spread {{ model.techShortName }} nodes across a minimum of three different zones/racks by specifying the constraint `@zone:GROUP_BY:3`. When a placement constraint specifying `@zone` is used, {{ model.techShortName }} nodes will be automatically configured with `rack`s that match the names of the zones. If no placement constraint referencing `@zone` is configured, all nodes will be configured with a default rack of `rack1`.


### dse.yaml and cassandra.yaml settings
Nearly all settings for `dse.yaml` and `cassandra.yaml` are exposed as configuration options, allowing them to be deployed and updated automatically by the service.

- `dse.yaml` options are listed under the {{ model.techShortName }} section
- `cassandra.yaml` options are listed under the Cassandra section

For more information on each setting, view {{ model.techMidName }}'s documentation for [dse.yaml](https://docs.datastax.com/en/latest-dse/datastax_enterprise/config/configDseYaml.html) and [cassandra.yaml](https://docs.datastax.com/en/cassandra/3.0/cassandra/configuration/configCassandra_yaml.html).

## Use Built-In or External {{ model.techOpsName }}
{{ model.techShortName }} DC/OS provides the **{{ model.opsPackageName }}** package, which you can install to get a default {{ model.techOpsName }} dashboard.  If you prefer to use an external {{ model.techOpsName }} instance, you can configure the {{ model.techShortName }} service to point to an externally managed {{ model.techOpsName }}.

Follow these steps to configure {{ model.techShortName }} to use an external {{ model.techOpsName }} (in the {{ model.techOpsName }} section of the {{ model.techShortName }} installation screen).

1. Check the **ENABLE DATASTAX OPSCENTER** checkbox.
1. Set the **OPSCENTER HOST NAME** field to the hostname of your external {{ model.techOpsName }} instance.

If you choose to run an instance of the {{ model.opsPackageName }} package, this field can be populated as `opscenter-0-node.<service-name>.autoip.dcos.thisdcos.directory`. For example `opscenter-0-node.{{ model.opsPackageName }}-1.autoip.dcos.thisdcos.directory` if the {{ model.opsPackageName }} service is named `{{ model.opsPackageName }}-1`

## Installation with {{ model.techShortName }} Multi-Datacenter
Each {{ model.techShortName }} Datacenter must be configured with the seed nodes of the other {{ model.techShortName }} Datacenters. For example, let's deploy three Datacenters (as separate DC/OS services in DC/OS terms), named `{{ model.serviceName }}-1`, `{{ model.serviceName }}-2`, and `{{ model.serviceName }}-3`, and then link them all together. Here is an example timeline from start to finish:

<p class="message--note"><strong>NOTE: </strong>These instructions are an example and should be vetted by {{ model.techMidName }} for the correct ordering of operations (when to add seed nodes, etc.).</p>

<a name="1.10-and-later"></a>

### DC/OS 1.10 and later

Follow these instructions for DC/OS 1.10 and later. If you are using DC/OS 1.9 or earlier, follow [these instructions](#1.9-and-earlier).

1. Add a {{ model.techShortName }} service from the DC/OS Catalog. Deploy `{{ model.serviceName }}-1` with the following customizations:
    - In **service**, set `Service Name` = `{{ model.serviceName }}-1`
    - In **cluster**, set `{{ model.techShortName }} Datacenter` = `dc_datastax_1`
1. Wait for `{{ model.serviceName }}-1` to finish deploying before continuing with the other DCs.
1. Add a second {{ model.techShortName }} service from the DC/OS Catalog. Deploy `{{ model.serviceName }}-2` with the following customizations:
    - In **service**, set:
        - `Service Name` = `{{ model.serviceName }}-2`
    - In **cluster**, set:
        - `{{ model.techShortName }} Datacenter` = `dc_datastax_2`
        - `External Seed Nodes` = `dse-0-node.{{ model.serviceName }}-1.autoip.dcos.thisdcos.directory,dse-1-node.{{ model.serviceName }}-1.autoip.dcos.thisdcos.directory` (point `{{ model.serviceName }}-2` to `{{ model.serviceName }}-1`'s seeds)
    - In {{ model.techOpsName }}, set:
        - `OPSCENTER HOSTNAME` = `opscenter-0-node.{{ model.serviceName }}-1.autoip.dcos.thisdcos.directory` (point `{{ model.serviceName }}-2` to `{{ model.serviceName }}-1`'s OpsCenter)
1. Add a third {{ model.techShortName }} service from the DC/OS Catalog. Deploy `{{ model.serviceName }}-3` with the following customizations:
    - In **service**, set:
        - `Service Name` = `{{ model.serviceName }}-3`
    - In **cluster**, set:
        - `{{ model.techShortName }} Datacenter` = `dc_datastax_3`
        - `External Seed Nodes` = `dse-0-node.{{ model.serviceName }}-1.autoip.dcos.thisdcos.directory,dse-1-node.{{ model.serviceName }}-1.autoip.dcos.thisdcos.directory` (point `{{ model.serviceName }}-3` to `{{ model.serviceName }}-1`'s seeds)
    - In {{ model.techOpsName }}, set:
        - `OPSCENTER HOSTNAME` = `opscenter-0-node.{{ model.serviceName }}-1.autoip.dcos.thisdcos.directory` (point `{{ model.serviceName }}-3` to `{{ model.serviceName }}-1`'s OpsCenter)
1. Wait for `{{ model.serviceName }}-2` and `{{ model.serviceName }}-3` to finish deploying. Then, update the seed nodes across all the instances:
    1. Create a local file called `dse-1-options.json`. Paste the following into the file.

       ```json
       {
         "cluster": {
           "external_seeds": "dse-0-node.{{ model.serviceName }}-2.autoip.dcos.thisdcos.directory,dse-1-node.{{ model.serviceName }}-2.autoip.dcos.thisdcos.directory,dse-0-node.{{ model.serviceName }}-3.autoip.dcos.thisdcos.directory,dse-1-node.{{ model.serviceName }}-3.autoip.dcos.thisdcos.directory"
         },
       }
       ```
       This points `{{ model.serviceName }}-1` to `{{ model.serviceName }}-2` and `{{ model.serviceName }}-3`.

    1. From the DC/OS CLI, update the service to the new configuration.

       ```json
       dcos {{ model.serviceName }} update start --options=dse-1-options.json
       ```

    1. Wait for the seed update to roll out across `{{ model.serviceName }}-1` nodes.
    1. Perform the same operation for `{{ model.serviceName }}-2` and `{{ model.serviceName }}-3`.
       - For `{{ model.serviceName }}-2`, set `cluster.external_seeds` to `dse-0-node.{{ model.serviceName }}-1.autoip.dcos.thisdcos.directory,dse-1-node.{{ model.serviceName }}-1.autoip.dcos.thisdcos.directory,dse-0-node.{{ model.serviceName }}-3.autoip.dcos.thisdcos.directory,dse-1-node.{{ model.serviceName }}-3.autoip.dcos.thisdcos.directory`.
       - For `{{ model.serviceName }}-3`, set `cluster.external_seeds` to `dse-0-node.{{ model.serviceName }}-2.autoip.dcos.thisdcos.directory,dse-2-node.{{ model.serviceName }}-1.autoip.dcos.thisdcos.directory,dse-0-node.{{ model.serviceName }}-3.autoip.dcos.thisdcos.directory,dse-1-node.{{ model.serviceName }}-3.autoip.dcos.thisdcos.directory`.

1. Now, each of the three DCs has seed nodes configured for the other DCs. Because we used `.autoip.dcos.thisdcos.directory` hostnames, which automatically update to follow the tasks, we won't need to reconfigure seeds if they're moved between systems in the DC/OS cluster.

<a name="1.9-and-earlier"></a>

### DC/OS 1.9 and earlier

1. Add a {{ model.techShortName }} service from the DC/OS Catalog. Deploy `{{ model.serviceName }}-1` with the following customizations:
    - In **service**, set `Service Name` = `{{ model.serviceName }}-1`
    - In **cluster**, set `{{ model.techShortName }} Datacenter` = `dc_datastax_1`
1. Wait for `{{ model.serviceName }}-1` to finish deploying before continuing with the other DCs.
1. Add a second {{ model.techShortName }} service from the DC/OS Catalog. Deploy `{{ model.serviceName }}-2` with the following customizations:
    - In **service**, set:
        - `Service Name` = `{{ model.serviceName }}-2`
    - In **cluster**, set:
        - `{{ model.techShortName }} Datacenter` = `dc_datastax_2`
        - `External Seed Nodes` = `dse-0-node.{{ model.serviceName }}-1.autoip.dcos.thisdcos.directory,dse-1-node.{{ model.serviceName }}-1.autoip.dcos.thisdcos.directory` (point `{{ model.serviceName }}-2` to `{{ model.serviceName }}-1`'s seeds)
    - In {{ model.techOpsName }}, set:
        - `OPSCENTER HOSTNAME` = `opscenter-0-node.{{ model.serviceName }}-1.autoip.dcos.thisdcos.directory` (point `{{ model.serviceName }}-2` to `{{ model.serviceName }}-1`'s OpsCenter)
1. Add a third {{ model.techShortName }} service from the DC/OS Catalog. Deploy `{{ model.serviceName }}-3` with the following customizations:
    - In **service**, set:
        - `Service Name` = `{{ model.serviceName }}-3`
    - In **cluster**, set:
        - `{{ model.techShortName }} Datacenter` = `dc_datastax_3`
        - `External Seed Nodes` = `dse-0-node.{{ model.serviceName }}-1.autoip.dcos.thisdcos.directory,dse-1-node.{{ model.serviceName }}-1.autoip.dcos.thisdcos.directory` (point `{{ model.serviceName }}-3` to `{{ model.serviceName }}-1`'s seeds)
    - In {{ model.techOpsName }}, set:
        - `OPSCENTER HOSTNAME` = `opscenter-0-node.{{ model.serviceName }}-1.autoip.dcos.thisdcos.directory` (point `{{ model.serviceName }}-3` to `{{ model.serviceName }}-1`'s OpsCenter)
1. Wait for `{{ model.serviceName }}-2` and `{{ model.serviceName }}-3` to finish deploying. Then, update the seed nodes across all the instances:
    1. Go to the service view of `{{ model.serviceName }}-1` in the DC/OS UI. Click the menu in the upper right and then choose **Edit**. Go to the **Environment** tab and set `{{ model.techShortName }}_EXTERNAL_SEEDS` = `dse-0-node.{{ model.serviceName }}-2.autoip.dcos.thisdcos.directory,dse-1-node.{{ model.serviceName }}-2.autoip.dcos.thisdcos.directory,dse-0-node.{{ model.serviceName }}-3.autoip.dcos.thisdcos.directory,dse-1-node.{{ model.serviceName }}-3.autoip.dcos.thisdcos.directory` (point `{{ model.serviceName }}-1` to `{{ model.serviceName }}-2` and `{{ model.serviceName }}-3`).
    1. Wait for the seed update to roll out across `{{ model.serviceName }}-1` nodes.
    1. Go to the service view of `{{ model.serviceName }}-2` in the DC/OS UI. Click the menu in the upper right and then choose **Edit**. Go to the **Environment** tab and update `{{ model.techShortName }}_EXTERNAL_SEEDS` = `dse-0-node.{{ model.serviceName }}-1.autoip.dcos.thisdcos.directory,dse-1-node.{{ model.serviceName }}-1.autoip.dcos.thisdcos.directory,dse-0-node.{{ model.serviceName }}-3.autoip.dcos.thisdcos.directory,dse-1-node.{{ model.serviceName }}-3.autoip.dcos.thisdcos.directory` (point `{{ model.serviceName }}-2` to `{{ model.serviceName }}-1` and `{{ model.serviceName }}-3`).
    1. Wait for the seed update to roll out across `{{ model.serviceName }}-2` nodes.
    1. Go to the service view of `{{ model.serviceName }}-3` in the DC/OS UI. Click the menu in the upper right and then choose **Edit**. Go to the **Environment** tab and update `{{ model.techShortName }}_EXTERNAL_SEEDS` = `dse-0-node.{{ model.serviceName }}-2.autoip.dcos.thisdcos.directory,dse-2-node.{{ model.serviceName }}-1.autoip.dcos.thisdcos.directory,dse-0-node.{{ model.serviceName }}-3.autoip.dcos.thisdcos.directory,dse-1-node.{{ model.serviceName }}-3.autoip.dcos.thisdcos.directory` (point `{{ model.serviceName }}-3` to `{{ model.serviceName }}-1` and `{{ model.serviceName }}-2`).
    1. Wait for the seed update to roll out across `{{ model.serviceName }}-3` nodes.
1. Now, each of the three DCs has seed nodes configured for the other DCs. Because we used `.autoip.dcos.thisdcos.directory` hostnames, which automatically update to follow the tasks, we won't need to reconfigure seeds if they're moved between systems in the DC/OS cluster.

## Using Volume Profiles

Volume profiles are used to classify volumes. For example, users can group SSDs into a “fast” profile and group HDDs into a “slow” profile. 

<p class="message--note"><strong>NOTE: </strong>Volume profiles are immutable and therefore cannot contain references to specific devices, nodes or other ephemeral identifiers.</p> 

[DC/OS Storage Service (DSS)](/mesosphere/dcos/services/storage/latest/) is a service that manages volumes, volume profiles, volume providers, and storage devices in a DC/OS cluster.

If you want to deploy {{ model.techShortName }} with DSS, please follow our [tutorial for Cassandra](/mesosphere/dcos/services/storage/1.0.0/tutorials/cassandra-dss-volumes/) and use the same procedure to deploy {{ model.techShortName }}.

After the DC/OS cluster is running and volume profiles are created, you can deploy {{ model.techShortName }} with the volume profile.

<p class="message--note"><strong>NOTE: </strong>{{ model.techShortName }} will be configured to look for <code>MOUNT</code> volumes with the specified volume profile.</p> 

After the {{ model.techShortName }} service finishes deploying, its tasks will be running with the specified volume profiles.
