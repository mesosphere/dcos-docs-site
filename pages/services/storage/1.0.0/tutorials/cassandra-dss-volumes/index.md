---
layout: layout.pug
origin: github.com/mesosphere/dcos-storage/docs/tutorials/cassandra-dss-volumes/index.md
navigationTitle: Deploy Cassandra with DSS volumes
title: Deploy Cassandra with DSS volumes
menuWeight: 50
excerpt: Step by step walkthrough of using DC/OS Storage Service to provide volumes to a Cassandra service.
enterprise: true
---

# Deploy Cassandra with DSS volumes

This tutorial will show how to deploy Cassandra using volumes created by DSS on
a DC/OS Enterprise cluster created with the Universal Installer.

## Prerequisites

- Terraform.
- DC/OS CLI.

## Getting started

1. Use the [DC/OS Universal Installer](/latest/installing/evaluation/) to deploy a cluster with at least 3 private agent nodes and an [extra volume on each of these nodes](../../install/provision-extra-volumes). Each volume needs to be larger than 10GB.

    ```hcl
    module "dcos" {
        source  = "dcos-terraform/dcos/aws"
        version = "~> 0.1.0"

        # ...

        num_private_agents = "3"
        dcos_variant = "ee"
        dcos_security = "permissive"

        private_agents_extra_volumes = [
            {
            type = "gp2"
            device_name = "/dev/xvdi"
            }
        ]
    }
    ```

1. Get the node ID of 3 agent nodes.

    ```bash
    dcos node list
    ```
    ```
        HOSTNAME          IP         PUBLIC IP(S)                     ID                          TYPE         REGION       ZONE
    172.16.1.181   172.16.1.181   3.89.142.10     46d008de-a6f7-4628-bb9e-31855b553737-S3  agent (public)   us-east-1  us-east-1a
    172.16.1.201   172.16.1.201   18.234.186.9    46d008de-a6f7-4628-bb9e-31855b553737-S2  agent            us-east-1  us-east-1a
    172.16.18.149  172.16.18.149  18.234.65.75    46d008de-a6f7-4628-bb9e-31855b553737-S1  agent            us-east-1  us-east-1b
    172.16.34.203  172.16.34.203  54.86.126.235   46d008de-a6f7-4628-bb9e-31855b553737-S0  agent            us-east-1  us-east-1c
    master.mesos.  172.16.12.234  52.206.129.215  46d008de-a6f7-4628-bb9e-31855b553737     master (leader)  us-east-1  us-east-1a
    ```

1. Install the DC/OS Storage Service

    This assumes that the DSS `.dcos` package has already been added to the [package registry](../../install/package-registry-based).

    ```bash
    dcos package install storage
    ```

1. Create the `devices` and `lvm` volume providers on 3 agent nodes.

    ```bash
    cat <<EOF | dcos storage provider create
    {
        "name": "devices-S0",
        "description": "Devices provider",
        "spec": {
            "plugin": {
                "name": "devices",
                "config-version": "latest"
            },
            "node": "46d008de-a6f7-4628-bb9e-31855b553737-S0",
            "plugin-configuration": {}
        }
    }
    EOF
    cat <<EOF | dcos storage provider create
    {
        "name": "devices-S1",
        "description": "Devices provider",
        "spec": {
            "plugin": {
                "name": "devices",
                "config-version": "latest"
            },
            "node": "46d008de-a6f7-4628-bb9e-31855b553737-S1",
            "plugin-configuration": {}
        }
    }
    EOF
    cat <<EOF | dcos storage provider create
    {
        "name": "devices-S2",
        "description": "Devices provider",
        "spec": {
            "plugin": {
                "name": "devices",
                "config-version": "latest"
            },
            "node": "46d008de-a6f7-4628-bb9e-31855b553737-S2",
            "plugin-configuration": {}
        }
    }
    EOF
    ```

    Because we added the extra volume as device `xvdi` on each agent, we
    create `lvm` volume providers using this device.

    ```bash
    cat <<EOF | dcos storage provider create
    {
        "name": "volume-group-S0",
        "description": "The primary volume group",
        "spec": {
            "plugin": {
                "name": "lvm",
                "config-version": "latest"
            },
            "node": "46d008de-a6f7-4628-bb9e-31855b553737-S0",
            "plugin-configuration": {
                "devices": ["xvdi"]
            },
            "labels": {"rotational": "false"}
        }
    }
    EOF
    cat <<EOF | dcos storage provider create
    {
        "name": "volume-group-S1",
        "description": "The primary volume group",
        "spec": {
            "plugin": {
                "name": "lvm",
                "config-version": "latest"
            },
            "node": "46d008de-a6f7-4628-bb9e-31855b553737-S1",
            "plugin-configuration": {
                "devices": ["xvdi"]
            },
            "labels": {"rotational": "false"}
        }
    }
    EOF
    cat <<EOF | dcos storage provider create
    {
        "name": "volume-group-S2",
        "description": "The primary volume group",
        "spec": {
            "plugin": {
                "name": "lvm",
                "config-version": "latest"
            },
            "node": "46d008de-a6f7-4628-bb9e-31855b553737-S2",
            "plugin-configuration": {
                "devices": ["xvdi"]
            },
            "labels": {"rotational": "false"}
        }
    }
    EOF
    ```

    If the creation is successful, you can view the newly created volume providers using the `list` command.

    ```bash
    dcos storage provider list
    ```
    ```
    PLUGIN   NAME             NODE                                     STATE
    devices  devices-S0       46d008de-a6f7-4628-bb9e-31855b553737-S0  ONLINE
    devices  devices-S1       46d008de-a6f7-4628-bb9e-31855b553737-S1  ONLINE
    devices  devices-S2       46d008de-a6f7-4628-bb9e-31855b553737-S2  ONLINE
    lvm      volume-group-S0  46d008de-a6f7-4628-bb9e-31855b553737-S0  ONLINE
    lvm      volume-group-S1  46d008de-a6f7-4628-bb9e-31855b553737-S1  ONLINE
    lvm      volume-group-S2  46d008de-a6f7-4628-bb9e-31855b553737-S2  ONLINE
    ```

1. Create a volume profile `cassandra` for mount volumes that will match the created `lvm` volume providers.
Volumes that have profile `cassandra` will be formatted with the `xfs` filesystem, as specified in the profile definition.

    ```bash
    cat <<EOF | dcos storage profile create
    {
        "name": "cassandra",
        "description": "Cassandra disks",
        "spec": {
            "provider-selector": {
                "plugin": "lvm",
                "matches": {
                    "labels": {
                        "rotational": "false"
                    }
                }
            },
            "mount": {
                "filesystem": "xfs"
            }
        }
    }
    EOF
    ```

    If the creation is successful, you can view the newly created profile using the `list` command.

    ```bash
    dcos storage profile list
    ```
    ```
    TYPE  NAME       STATUS
    lvm   cassandra  ACTIVE
    ```

1. Create three 10240M volumes of profile `cassandra`, 1 per agent.

    ```bash
    dcos storage volume create --name cassandra-volume-S0 --capacity 10240M --profile cassandra --node 46d008de-a6f7-4628-bb9e-31855b553737-S0
    dcos storage volume create --name cassandra-volume-S1 --capacity 10240M --profile cassandra --node 46d008de-a6f7-4628-bb9e-31855b553737-S1
    dcos storage volume create --name cassandra-volume-S2 --capacity 10240M --profile cassandra --node 46d008de-a6f7-4628-bb9e-31855b553737-S2
    ```

    If the creation is successful, you can view the newly created volumes using the `list` command.

    ```bash
    dcos storage volume list
    ```
    ```
    NODE                                     NAME                 SIZE    STATUS
    46d008de-a6f7-4628-bb9e-31855b553737-S0  cassandra-volume-S0  10240M  ONLINE
    46d008de-a6f7-4628-bb9e-31855b553737-S1  cassandra-volume-S1  10240M  ONLINE
    46d008de-a6f7-4628-bb9e-31855b553737-S2  cassandra-volume-S2  10240M  ONLINE
    ```

1. Install Cassandra from the DC/OS Universe.

    Cassandra is configured to look for `MOUNT` volumes of profile `cassandra`.

    ```bash
    cat > cassandra-options.json <<EOF
    {
        "nodes": {
            "volume_profile": "cassandra",
            "disk_type": "MOUNT"
        }
    }
    EOF
    dcos package install cassandra --options=cassandra-options.json
    ```

    Once the Cassandra service is installed, it will start its tasks. After a while,
    its deployment should be completed.

    ```bash
    dcos cassandra update status
    ```
    ```
    deploy (serial strategy) (COMPLETE)
    └─ node-deploy (serial strategy) (COMPLETE)
    ├─ node-0:[server] (COMPLETE)
    ├─ node-0:[init_system_keyspaces] (COMPLETE)
    ├─ node-1:[server] (COMPLETE)
    └─ node-2:[server] (COMPLETE)
    ```
