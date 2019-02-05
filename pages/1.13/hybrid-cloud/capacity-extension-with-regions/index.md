---
layout: layout.pug
navigationTitle:  Capacity Extensions with Regions
title: Capacity Extensions with Regions
menuWeight: 10
excerpt: Using local and remote regions
enterprise: false
---


# Local and remote regions

- The **local region** is the region running the Mesos master nodes.
- A **remote region** contains only Mesos agent nodes. There is usually high latency between a remote region and the local region.


## Installation

### Considerations

- Consider the future needs of the services in your cluster. You must define regions and zones at install time, though you can add or remove nodes from regions and zones after installation. If you need to update fault domain detect script, you must re-install DC/OS.

- Mesos master nodes must be in the same region to avoid the latency between them to be very high. They should be spread across zones for fault tolerance.

- You must have less than 100ms latency between regions.

### Installation steps

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

    <p class="message--important"><strong>IMPORTANT: </strong>This script will not work if you use proxies in your environment. If you use a proxy, modifications will be required.</p>

1. Add this script to the `genconf` folder of your bootstrap node. [More information](/1.12/installing/production/deploying-dcos/installation/#create-a-fault-domain-detection-script).

1. [Install DC/OS](/1.12/installing/production/deploying-dcos/installation/#create-a-fault-domain-detection-script).

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

Alternatively, click the **Nodes** tab in the DC/OS GUI. The Nodes table will display the region and zone columns for each agent.

# Use

User-created Marathon services and pods support both zone and region awareness. The following beta versions of DC/OS data services support zone awareness: Cassandra, Elastic, HDFS, Kafka, and Spark. Consult the individual service documentation for more information about configuring zone awareness for DC/OS data services. 


## Marathon services and pods

In your Marathon service or pod definition, you can use [placement constraints](/1.12/deploying-services/marathon-constraints/) to:

- Specify a region and zone for your service or pod, so that all instances will be scheduled only in that region and zone.

- Specify a region without a specific zone, so that all instances of a given service or pod will be scheduled in that region (but not necessarily in the same zone).

## Placement constraint guidelines

- If no region is specified in your service or pod definition, instances are only scheduled for the local region because of high latency between the local and remote region. No instances will ever be scheduled for an agent outside of the local region unless you explicitly specify that they should be launched in a remote region.

- If you specify a region without a specific zone, instances are scheduled on any agent in the given region.

- If you specify both region and zone, instances are scheduled on any agent in the given region and zone, and not in any other region or zone.

- If you specify a hostname `UNIQUE` constraint, that constraint is also honored in remote regions.

## Examples

A Mesos cluster that spans 3 regions: `aws-us-east1`, `aws-us-east2`, and `local`. Each region has zones `a`,`b`,`c`,`d`.

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

### Balanced Placement for a Single Region

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

- All the instances will be launched in the `aws-us-east1` region and evenly divided between `aws-us-east1`‘s zones `a`,`b`,`c`,`d`.

### Increase Cluster Capacity

To increase capacity, [add new agents](/1.12/administering-clusters/add-a-node/) to a remote region or regions of your cluster, and then update your services to launch instances in that region or those regions appropriately.

<p class="message--note"><strong>NOTE: </strong>You cannot configure your service to run in more than one region.</p>
