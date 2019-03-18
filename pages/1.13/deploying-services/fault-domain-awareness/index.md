---
layout: layout.pug
navigationTitle: Fault Domain Awareness and Capacity Extension
title: Fault Domain Awareness and Capacity Extension
menuWeight: 3
excerpt: Understanding fault domains

enterprise: false
---


A fault domain is a section of a network, for example, a rack in a datacenter or an entire datacenter, that is vulnerable to damage if a critical device or system fails. All instances within a fault domain share similar failure and latency characteristics. Instances in the same fault domain are all affected by failure events within the domain. Placing instances in more than one fault domain reduces the risk that a failure will affect all instances.

DC/OS now supports fault domain awareness. Use fault domain awareness to make your services highly available and to allow for increased capacity when needed. DC/OS currently supports Mesos' 2-level hierarchical fault domains: zone and region.

# Zone fault domains
Zone fault domains offer a moderate degree of fault isolation because they share the same region. However, network latency between zones in the same region is moderately low (typically < 10ms). For on-premise deployments, a zone would be a physical data center rack. For public cloud deployments, a zone would be the "availability zone" concept provided by most cloud providers. If your goal is high availability, and/or your services are latency-sensitive, place your instances in a one region and balance them across zones.

# Region fault domains

Region fault domains offer the most fault isolation, though inter-region network latency is high. For on-premise deployments, a region might be a data center. For public cloud deployments, most cloud providers expose a "region" concept. You can deploy your instances in a specific region based on the available capacity. 

## Local and remote regions

- The **local region** is the region running the Mesos master nodes.
- A **remote region** contains only Mesos agent nodes. There is usually high latency between a remote region and the local region.

# Installation

Consider the future needs of the services in your cluster. You must define regions and zones at install time, though you can add or remove nodes from regions and zones after installation. If you need to update fault domain detect script, you must re-install DC/OS. 

Mesos master nodes must be in the same region because otherwise the latency between them will be too high. They should, however, be spread across zones for fault tolerance.

You must have less than 100ms latency between regions.

## Installation steps

1. Create a fault domain detect script to run on each node to detect the node's fault domain (Enterprise only). During installation, the output of this script is passed to Mesos.

    We recommend the format for the script output be:

    ```json
    {
        "fault_domain": {
            "region": {
                "name": "<region-name>"
            },
            "zone": {
                "name": "<zone-name>"
            }
        }
    }
    ```

    We provide [fault domain detect scripts for AWS and Azure nodes](https://github.com/dcos/dcos/tree/master/gen/fault-domain-detect). For a cluster that has aws nodes and azure nodes you would combine the two into one script. You can use these as a model for creating a fault domain detect script for an on premises cluster.

    <p class="message--important"> <strong>IMPORTANT:</strong> This script will not work if you use proxies in your environment. If you use a proxy, modifications will be required.</p>

2. Add this script to the `genconf` folder of your bootstrap node. [More information](/1.13/installing/production/deploying-dcos/installation/#create-a-fault-domain-detection-script).

1. [Install DC/OS](/1.13/installing/production/deploying-dcos/installation/).

1. Test your installation.

   From the DC/OS CLI, enter `dcos node`. You should see output similar to the following, where the region and zone of each node is listed:

   ```bash
   HOSTNAME        IP                         ID                    TYPE               REGION      ZONE
  	10.0.3.188   10.0.3.188  a2ea1578-22ee-430e-aeb8-82ee1b74d88a-S1  agent            us-east-1  us-east-1a
  	10.0.7.224   10.0.7.224  a2ea1578-22ee-430e-aeb8-82ee1b74d88a-S0  agent            us-east-1  us-east-1b
	master.mesos.  10.0.5.41                     N/A                    master              N/A         N/A
	master.mesos.  10.0.6.95                     N/A                    master           us-east-1  us-east-1b
	master.mesos.  10.0.7.111    a2ea1578-22ee-430e-aeb8-82ee1b74d88a   master (leader)  us-east-1  us-east-1c
	```

Alternatively, click the **Nodes** tab in the DC/OS GUI. The Nodes table will show region and zone columns for each agent.

# Use

User-created Marathon services and pods support both zone and region awareness. The following beta versions of DC/OS data services support zone awareness: Cassandra, Elastic, HDFS, Kafka, and Spark. Consult the individual service documentation for more information about configuring zone awareness for DC/OS data services. <!-- todo: link to appropriate pages when the betas are released -->

## Marathon services and pods

In your Marathon service or pod definition, you can use [placement constraints](/1.13/deploying-services/marathon-constraints/) to:

- Specify a region and zone for your service or pod, so that all instances will be scheduled only in that region and zone.

- Specify a region without a specific zone, so that all instances of a given service or pod will be scheduled in that region (but not necessarily in the same zone).

## Placement constraint guidelines

- If no region is specified in your service or pod definition, instances are only scheduled for the local region because of high latency between the local and remote region. No instances will ever be scheduled for an agent outside of the local region unless you explicitly specify that they should be launched in a remote region.

- If you specify a region without a specific zone, instances are scheduled on any agent in the given region.

- If you specify both region and zone, instances are scheduled on any agent in the given region and zone, and not in any other region or zone.

- If you specify a hostname `UNIQUE` constraint, that constraint is also honored in remote regions.

## Examples

Suppose you have a Mesos cluster that spans 3 regions: `aws-us-east1`, `aws-us-east2`, and `local`. Each region has zones `a`,`b`,`c`,`d`.

### Specify only a remote region

```json
{
  "instances": 5,
  "constraints": [
    ["@region", "IS", "aws-us-east1"]
  ]
}
```

- No instance will launch in the local region.
- All of the 5 instances will be launched in the `aws-us-east1` region.

### Balanced placement for a single region

```json
{
   ...
  "instances": 6,
  "constraints": [
    ["@region", "IS", "aws-us-east1"],
    ["@zone", "GROUP_BY", "4"]
  ]
}
```

- Instances will all be launched in the `aws-us-east1` region and evenly divided between `aws-us-east1`‘s zones `a`,`b`,`c`,`d`.

### Increase Cluster Capacity

To increase capacity, [add new agents](/1.13/administering-clusters/add-a-node/) to a remote region or regions of your cluster, and then update your services to launch instances in that region or those regions appropriately.

<p class="message--important"><strong>IMPORTANT: </strong>You cannot configure your service to run in more than one region.</p>
