---
layout: layout.pug
navigationTitle: dcos storage device
title: dcos storage device
menuWeight: 10
excerpt:
---

This command manages physical devices.

There are typically storage devices that present as Linux devices on agents in the cluster.
The devices on a node can be assembled into volume providers that expose their storage capacity to the rest of the cluster.
For example, some SSDs `xvdb` and `xvde` on node `2aada917-0ba0-4041-bb1e-4f16a57cd1a0-S0` can be assembled into a LVM2 volume group on that node creating a new volume provider and specifying the `plugin` as `lvm` and listing `xvdb` and `xvde` as the devices.

# `list`

This sub-command lists physical devices.

**Note:** All devices will be listed, regardless of whether they are already in use or not.

## Usage

```bash
$ dcos storage device list [<devices>] [flags]
```

## Flags

```bash
-h, --help          help for list
    --json          Display the list of devices in json format.
    --node string   Only list devices on node.
```

## Examples:

List all devices in the cluster.

```bash
$ dcos storage device list
NODE                                     NAME   STATUS
2aada917-0ba0-4041-bb1e-4f16a57cd1a0-S0  xvda   ONLINE
2aada917-0ba0-4041-bb1e-4f16a57cd1a0-S0  xvda1  ONLINE
2aada917-0ba0-4041-bb1e-4f16a57cd1a0-S0  xvdb   ONLINE
2aada917-0ba0-4041-bb1e-4f16a57cd1a0-S0  xvde   ONLINE
```

```bash
$ dcos storage device list --json
{
    "devices": [
        {
            "Name": "xvda",
            "Status": {
                "State": "ONLINE",
                "Node": "2aada917-0ba0-4041-bb1e-4f16a57cd1a0-S0",
                "LastChanged": "0001-01-01T00:00:00Z",
                "LastUpdated": "0001-01-01T00:00:00Z"
            }
        },
        {
            "Name": "xvda1",
            "Status": {
                "State": "ONLINE",
                "Node": "2aada917-0ba0-4041-bb1e-4f16a57cd1a0-S0",
                "LastChanged": "0001-01-01T00:00:00Z",
                "LastUpdated": "0001-01-01T00:00:00Z"
            }
        },
        {
            "Name": "xvdb",
            "Status": {
                "State": "ONLINE",
                "Node": "2aada917-0ba0-4041-bb1e-4f16a57cd1a0-S0",
                "LastChanged": "0001-01-01T00:00:00Z",
                "LastUpdated": "0001-01-01T00:00:00Z"
            }
        },
        {
            "Name": "xvde",
            "Status": {
                "State": "ONLINE",
                "Node": "2aada917-0ba0-4041-bb1e-4f16a57cd1a0-S0",
                "LastChanged": "0001-01-01T00:00:00Z",
                "LastUpdated": "0001-01-01T00:00:00Z"
            }
        }
    ]
}
```

List all devices on a given node.

```bash
$ dcos node
   HOSTNAME         IP                         ID                    TYPE               REGION      ZONE
 10.10.0.167   10.10.0.167  2aada917-0ba0-4041-bb1e-4f16a57cd1a0-S0  agent            us-west-2  us-west-2b
master.mesos.  10.10.0.138    2aada917-0ba0-4041-bb1e-4f16a57cd1a0   master (leader)  us-west-2  us-west-2b
```

```bash
$ dcos storage device list --node 2aada917-0ba0-4041-bb1e-4f16a57cd1a0-S0
NODE                                     NAME   STATUS
2aada917-0ba0-4041-bb1e-4f16a57cd1a0-S0  xvda   ONLINE
2aada917-0ba0-4041-bb1e-4f16a57cd1a0-S0  xvda1  ONLINE
2aada917-0ba0-4041-bb1e-4f16a57cd1a0-S0  xvdb   ONLINE
2aada917-0ba0-4041-bb1e-4f16a57cd1a0-S0  xvde   ONLINE
```
