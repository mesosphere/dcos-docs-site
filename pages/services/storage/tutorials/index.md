---
layout: layout.pug
navigationTitle: Tutorials
title: Tutorials
menuWeight: 25
excerpt:
---

# Tutorials

The tutorials in this section, covers a use case for using DSS to manage local disks using the LVM Plugin bundled with DC/OS Enterprise.

## Manage local disks using LVM

Prerequisites
- DSS and it's CLI are installed. You can follow the instructions <a href="https://docs.google.com/document/d/1MZ7ARRAs_lmXo94h28-wCPqsqA9xDwMPSLgN7_5n84w/edit#heading=h.fdp2lkmww0z8">here</a>.
- At least one DC/OS agent node.
- Some unused RAW devices available on the agent node.

1. Get the node id of the agent.
```bash
$ dcos node
```
```json
   HOSTNAME         IP                         ID                    TYPE               REGION      ZONE
 10.10.0.167   10.10.0.167  2aada917-0ba0-4041-bb1e-4f16a57cd1a0-S0  agent            us-west-2  us-west-2b
master.mesos.  10.10.0.138    2aada917-0ba0-4041-bb1e-4f16a57cd1a0   master (leader)  us-west-2  us-west-2b 
```
2. List the devices on the node. Note, that all devices will be listed, regardless of whether they are already in use or not.
```bash
$ dcos storage device list --node 2aada917-0ba0-4041-bb1e-4f16a57cd1a0-S0
```
```json
NODE                                     NAME   STATUS
2aada917-0ba0-4041-bb1e-4f16a57cd1a0-S0  xvdf   ONLINE
2aada917-0ba0-4041-bb1e-4f16a57cd1a0-S0  xvdg   ONLINE
2aada917-0ba0-4041-bb1e-4f16a57cd1a0-S0  xvdh   ONLINE
2aada917-0ba0-4041-bb1e-4f16a57cd1a0-S0  xvda   ONLINE
2aada917-0ba0-4041-bb1e-4f16a57cd1a0-S0  xvda1  ONLINE
2aada917-0ba0-4041-bb1e-4f16a57cd1a0-S0  xvdb   ONLINE
2aada917-0ba0-4041-bb1e-4f16a57cd1a0-S0  xvde   ONLINE
```

3. Let’s assume that device “xvdb” is unused. Create an LVM volume provider using the device “xvdb”.
```bash
$ cat <<EOF | dcos storage provider create
```
```json 
{
    "name": "volume-group-1",
    "description": "the primary volume group",
    "spec": {
        "plugin": "lvm",
        "node": "2aada917-0ba0-4041-bb1e-4f16a57cd1a0-S0",
        "plugin-configuration": {
            "devices": ["xvdb"]
        },
        "labels": {"rotational": "false"}
    }
}
EOF
 $
 ```

4. Create a volume profile “logs” for mount volumes that will match the created LVM volume provider. The profile will use the default filesystem provided by the volume provider.
```bash 
$ cat <<EOF | dcos storage profile create
```
```json
{
    "name": "logs",
    "description": "spun down drives for log archives",
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
$
```
5. Create a 1G volume named “my-volume-1” of profile “logs”.
```bash
$ dcos storage volume create my-volume-1 1G logs
$
```
6. Launch a Marathon app requesting a 1G persistent volume with profile “logs”. Marathon will match the created volume, and the app will be in “Running” status.
```bash
$ cat <<EOF | dcos marathon app add /dev/stdin
```
```json
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
          "profileName": "logs",
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

7. Launch another Marathon app requesting a 10G persistent volume with profile “logs”. Since, there are not enough disk resources with profile “logs”, the app will be in deploying state.
```bash
$ cat <<EOF | dcos marathon app add /dev/stdin
```
```json
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
          "profileName": "logs",
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
8. Create a 10G volume named “my-volume-2” of profile “logs”. Once, the volume is created, the above Marathon app will change to “Running” state.
```bash
$ dcos storage volume create my-volume-2 10G logs
$
```


