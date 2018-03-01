---
layout: layout.pug
navigationTitle: Tutorials
title: Tutorials
menuWeight: 50
excerpt:
---

The tutorials in this section, covers a use case for using DSS to manage local disks using the LVM Plugin bundled with DC/OS Enterprise.

# Manage local disks using LVM

## Prerequisites

- DSS and its CLI are [installed](../install/).
- At least one DC/OS agent node.
- Some unused RAW devices available on the agent node.

## Get started

1. Get the node ID of the agent.

```bash
$ dcos node
   HOSTNAME         IP                         ID                    TYPE               REGION      ZONE
  10.10.0.39    10.10.0.39  c67efa5d-34fa-4bc5-8b21-2a5e0bd52385-S1  agent            us-west-2  us-west-2c
  10.10.0.78    10.10.0.78  c67efa5d-34fa-4bc5-8b21-2a5e0bd52385-S0  agent            us-west-2  us-west-2c
master.mesos.  10.10.0.139    c67efa5d-34fa-4bc5-8b21-2a5e0bd52385   master (leader)  us-west-2  us-west-2c
```

2. List the devices on the node.
**Note:** All devices will be listed, regardless of whether they are already in use or not.

```bash
$ dcos storage device list --node c67efa5d-34fa-4bc5-8b21-2a5e0bd52385-S1
NODE                                     NAME   STATUS  ROTATIONAL  TYPE  FSTYPE  MOUNTPOINT
c67efa5d-34fa-4bc5-8b21-2a5e0bd52385-S1  xvda   ONLINE  false       disk  -       -
c67efa5d-34fa-4bc5-8b21-2a5e0bd52385-S1  xvda1  ONLINE  false       part  xfs     /
c67efa5d-34fa-4bc5-8b21-2a5e0bd52385-S1  xvdb   ONLINE  false       disk  ext4    -
c67efa5d-34fa-4bc5-8b21-2a5e0bd52385-S1  xvde   ONLINE  false       disk  xfs     /var/lib/mesos
c67efa5d-34fa-4bc5-8b21-2a5e0bd52385-S1  xvdf   ONLINE  false       disk  xfs     /var/lib/docker
c67efa5d-34fa-4bc5-8b21-2a5e0bd52385-S1  xvdg   ONLINE  false       disk  xfs     /dcos/volume0
c67efa5d-34fa-4bc5-8b21-2a5e0bd52385-S1  xvdh   ONLINE  false       disk  xfs     /var/log
```

3. Let's assume that device `xvdb` is unused.
Create an LVM volume provider using the device `xvdb`.

```bash
$ cat <<EOF | dcos storage provider create
{
    "name": "volume-group-1",
    "description": "the primary volume group",
    "spec": {
        "plugin": "lvm",
        "node": "c67efa5d-34fa-4bc5-8b21-2a5e0bd52385-S1",
        "plugin-configuration": {
            "devices": ["xvdb"]
        },
        "labels": {"rotational": "false"}
    }
}
EOF
```

4. Create a volume profile `fast` for mount volumes that will match the created LVM volume provider.
The profile will use the default filesystem provided by the volume provider.

```bash
$ cat <<EOF | dcos storage profile create
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
        "mount": {}
    }
}
EOF
```

5. Create a 1G volume named `my-volume-1` of profile `fast`.

```bash
$ dcos storage volume create my-volume-1 1G fast
```

6. Launch a Marathon app requesting a 1G persistent volume with profile `fast`.
Marathon will match the created volume, and the app will be in `Running` status.

```bash
$ cat <<EOF | dcos marathon app add /dev/stdin
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
          "size": 1024,
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
Created deployment 443c18b5-3248-4f65-a0d5-347f355cd50a</EOF
```

7. Launch another Marathon app requesting a 10G persistent volume with profile `fast`.
Since there are not enough disk resources with profile `fast` the app will be in deploying state.

```bash
$ cat <<EOF | dcos marathon app add /dev/stdin
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
          "size": 10240,
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
Created deployment dd879d0c-d574-4565-a126-d06bc0f29110
```

8. Create a 10G volume named `my-volume-2` of profile `fast`.
Once the volume is created, the above Marathon app will change to `Running` state.

```bash
$ dcos storage volume create my-volume-2 10G fast
```
