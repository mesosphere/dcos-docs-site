---
layout: layout.pug
navigationTitle: Tutorials
title: Tutorials
menuWeight: 50
excerpt: Step by step walkthrough of using DC/OS Storage Service to discover devices and provision a storage profile, local volume provider, and local volume.
enterprise: true
---

The tutorials in this section cover a use case for using DSS to manage local disks using the LVM Plugin bundled with DC/OS Enterprise.

# Manage local disks using LVM

## Prerequisites

- DSS and its CLI are [installed](../install/).
- At least one DC/OS agent node.
- Some unused RAW devices available on the agent node.

## Get started

1. Get the node ID of the agent.

```bash
$ dcos node
   HOSTNAME        IP                         ID                    TYPE                 REGION          ZONE
  10.0.0.138   10.0.0.138  ca626e4a-e3cb-4613-b7dd-618cfc19bee1-S0  agent            aws/us-west-2  aws/us-west-2c
  10.0.1.21    10.0.1.21   ca626e4a-e3cb-4613-b7dd-618cfc19bee1-S1  agent            aws/us-west-2  aws/us-west-2c
master.mesos.  10.0.5.247    ca626e4a-e3cb-4613-b7dd-618cfc19bee1   master (leader)  aws/us-west-2  aws/us-west-2c
```

2. List the devices on the node.
**Note:** All devices will be listed, regardless of whether they are already in use or not.

```bash
$ dcos storage device list --node=ca626e4a-e3cb-4613-b7dd-618cfc19bee1-S0
NODE                                     NAME   STATUS  ROTATIONAL  TYPE   FSTYPE  MOUNTPOINT
ca626e4a-e3cb-4613-b7dd-618cfc19bee1-S0  usr    ONLINE  false       crypt  ext4    /usr
ca626e4a-e3cb-4613-b7dd-618cfc19bee1-S0  xvda   ONLINE  false       disk   -       -
ca626e4a-e3cb-4613-b7dd-618cfc19bee1-S0  xvda1  ONLINE  false       part   vfat    /boot
ca626e4a-e3cb-4613-b7dd-618cfc19bee1-S0  xvda2  ONLINE  false       part   -       -
ca626e4a-e3cb-4613-b7dd-618cfc19bee1-S0  xvda3  ONLINE  false       part   ext4    -
ca626e4a-e3cb-4613-b7dd-618cfc19bee1-S0  xvda4  ONLINE  false       part   -       -
ca626e4a-e3cb-4613-b7dd-618cfc19bee1-S0  xvda6  ONLINE  false       part   ext4    /usr/share/oem
ca626e4a-e3cb-4613-b7dd-618cfc19bee1-S0  xvda7  ONLINE  false       part   -       -
ca626e4a-e3cb-4613-b7dd-618cfc19bee1-S0  xvda9  ONLINE  false       part   ext4    /
```

3. Let's assume that device `xvda4` and device `xvda7` are unused.
Create an LVM volume provider using both devices.

```bash
$ cat > volume-group-1.json <<EOF
{
    "name": "volume-group-1",
    "description": "The primary volume group",
    "spec": {
        "plugin": "lvm",
        "node": "ca626e4a-e3cb-4613-b7dd-618cfc19bee1-S0",
        "plugin-configuration": {
            "devices": ["xvda4", "xvda7"]
        },
        "labels": {"rotational": "false"}
    }
}
EOF
$ dcos storage provider create volume-group-1.json
```

If the creation is successful, you can view the newly created volume provider using the `list` command.

```bash
$ dcos storage provider list
PLUGIN  NAME            NODE                                     STATE
lvm     volume-group-1  ca626e4a-e3cb-4613-b7dd-618cfc19bee1-S0  ONLINE
```

4. Create a volume profile `fast` for mount volumes that will match the created LVM volume provider.
Volumes that have profile `fast` will have `xfs` filesystem, as specified in the profile definition.

```bash
$ cat > fast.json <<EOF
{
    "name": "fast",
    "description": "Fast SSD disks",
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
$ dcos storage profile create fast.json
```

If the creation is successful, you can view the newly created profile using the `list` command.

```bash
$ dcos storage profile list
TYPE  NAME  STATUS
lvm   fast  ACTIVE
```

5. Create a 50M volume named `my-volume-1` of profile `fast`.

```bash
$ dcos storage volume create my-volume-1 50M fast
```

If the creation is successful, you can view the newly created volume using the `list` command.

```bash
$ dcos storage volume list
NODE                                     NAME         SIZE  STATUS
ca626e4a-e3cb-4613-b7dd-618cfc19bee1-S0  my-volume-1  50M   ONLINE
```

6. Launch a Marathon app requesting a 50M persistent volume with profile `fast`.
Marathon will match the created volume, and the app will be in `Running` status.

```bash
$ cat > app1.json <<EOF
{
  "cmd": "echo $(date) >> data/foo && cat data/foo && sleep 5000",
  "container": {
    "docker": {
      "image": "alpine"
    },
    "type": "MESOS",
    "volumes": [
      {
        "containerPath": "data",
        "mode": "RW",
        "persistent": {
          "size": 50,
          "profileName": "fast",
          "type": "mount"
        }
      }
    ]
  },
  "cpus": 0.1,
  "id": "/app-persistent-stable-good-profile",
  "instances": 1,
  "mem": 128,
  "residency": {
    "taskLostBehavior": "WAIT_FOREVER",
    "relaunchEscalationTimeoutSeconds": 3600
  },
  "unreachableStrategy": "disabled",
  "upgradeStrategy": {
    "maximumOverCapacity": 0,
    "minimumHealthCapacity": 0
  }
}
EOF
$ dcos marathon app add app1.json
Created deployment 443c18b5-3248-4f65-a0d5-347f355cd50a
```

7. Launch another Marathon app requesting a 100M persistent volume with profile `fast`.
Since there are not enough disk resources with profile `fast`, the app will be in deploying state.

```bash
$ cat > app2.json <<EOF
{
  "cmd": "echo $(date) >> data/foo && cat data/foo && sleep 5000",
  "container": {
    "docker": {
      "image": "alpine"
    },
    "type": "MESOS",
    "volumes": [
      {
        "containerPath": "data",
        "mode": "RW",
        "persistent": {
          "size": 100,
          "profileName": "fast",
          "type": "mount"
        }
      }
    ]
  },
  "cpus": 0.1,
  "id": "/app-persistent-stable-good-profile-2",
  "instances": 1,
  "mem": 128,
  "residency": {
    "taskLostBehavior": "WAIT_FOREVER",
    "relaunchEscalationTimeoutSeconds": 3600
  },
  "unreachableStrategy": "disabled",
  "upgradeStrategy": {
    "maximumOverCapacity": 0,
    "minimumHealthCapacity": 0
  }
}
EOF
$ dcos marathon app add app2.json
Created deployment dd879d0c-d574-4565-a126-d06bc0f29110
```

8. Create a 100M volume named `my-volume-2` of profile `fast`.
Once the volume is created, the above Marathon app will change to `Running` state.

```bash
$ dcos storage volume create my-volume-2 100M fast
```

9. Assume that the first Marathon app `/app-persistent-stable-good-profile` is no longer needed.
Remove the marathon app using the following command.

```bash
$ dcos marathon app remove /app-persistent-stable-good-profile
```

10. Assume that the volume `my-volume-1` is no longer needed.
The operator can delete the volume using the following command.

```bash
$ dcos storage volume my-volume-1
```

The operator can validate that the volume has been removed using the `list` command.

```bash
$ dcos storage volume list
NODE                                     NAME         SIZE  STATUS
ca626e4a-e3cb-4613-b7dd-618cfc19bee1-S0  my-volume-1  50M   REMOVED
ca626e4a-e3cb-4613-b7dd-618cfc19bee1-S0  my-volume-2  100M  ONLINE
```

11. If a volume is still in-use, it cannot be removed.
For instance, trying to remove volume `my-volume-2` which is currently used by `/app-persistent-stable-good-profile-2` will result in a timeout.

```bash
$ dcos storage volume remove my-volume-2
Error: Gateway Timeout (504): <html>
...
```

The current status of the volume will become `REMOVING`.

```bash
$ dcos storage volume list
NODE                                     NAME         SIZE  STATUS
ca626e4a-e3cb-4613-b7dd-618cfc19bee1-S0  my-volume-2  100M  REMOVING
ca626e4a-e3cb-4613-b7dd-618cfc19bee1-S0  my-volume-1  50M   REMOVED
```

12. Assume that the Marathon app `/app-persistent-stable-good-profile-2` becomes no longer needed as well.
The operator can remove the marathon using the following command.

```bash
$ dcos marathon app remove /app-persistent-stable-good-profile-2
```

Since the volume `my-volume-2` is no longer used by any app, it will become `REMOVED` shortly.
One can validate that by using the `list` command.

```bash
$ dcos storage volume list
NODE                                     NAME         SIZE  STATUS
ca626e4a-e3cb-4613-b7dd-618cfc19bee1-S0  my-volume-1  50M   REMOVED
ca626e4a-e3cb-4613-b7dd-618cfc19bee1-S0  my-volume-2  100M  REMOVED
```

13. A volume provider can be removed if all volumes from that provider are removed.

```bash
$ dcos storage provider remove volume-group-1
$ dcos storage provider list
PLUGIN  NAME  NODE  STATE
```

14. The storage service can be uninstalled at any time.
Uninstalling it will not affect the volume providers, profiles and volumes that are currently being used.

```bash
$ dcos package uninstall beta-storage
WARNING: This action cannot be undone. This will uninstall [beta-storage] and delete all of its persistent data (logs, configurations, database artifacts, everything).
Please type the name of the service to confirm: beta-storage
Uninstalled package [beta-storage] version [v0.2.0-rc3]
```

The storage service can be re-installed later.

```bash
$ dcos package install beta-storage
By Deploying, you agree to the Terms and Conditions https://mesosphere.com/catalog-terms-conditions/#community-services

DC/OS Storage Service only works on DC/OS Enterprise.

DC/OS Storage Service is currently in beta:
(1) There may be bugs, incomplete features, incorrect documentation, or other discrepancies.
(2) Currently, it cannot be used in a strict mode cluster.

Continue installing? [yes/no] yes
Installing Marathon app for package [beta-storage] version [v0.2.0-rc3]
Installing CLI subcommand for package [beta-storage] version [v0.2.0-rc3]
New command available: dcos storage
```

It'll automatically recover the previous state.

```bash
$ dcos storage profile list
TYPE  NAME  STATUS
lvm   fast  ACTIVE
```
