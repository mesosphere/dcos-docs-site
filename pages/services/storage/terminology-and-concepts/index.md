---
layout: layout.pug
navigationTitle:  Release Notes for 1.10.5
title: Release Notes for 1.10.5
menuWeight: 0
excerpt:
---

# [Terminology and Concepts](#Terminology-and-Concepts)

## [Device](#Device)
## [CSI Spec](#CSI-Spec)
## [CSI Plugin](#CSI-Plugin)
## [Storage Local Resource Provider (SLRP)](#Storage-Local-Resource-Provider(SLRP))
## [Storage External Resource Provider (SERP)](#Storage-External-Resource-Provider(SERP)
## [Volume Provider](#Volume-Provider)
## [Volume Plugin](#Volume-Plugin)
## [Volume Profile](#Volume-Profile)
## [Volume](#Volume)

# Terminology and Concepts

We use the following terminology throughout the documentation.

## Device 

A Linux block <a href="https://en.wikipedia.org/wiki/Device_file/">device file</a> presenting storage capacity on an agent.

## CSI Spec
The <a href="https://github.com/container-storage-interface/spec/blob/master/spec.md/">Container Storage Interface</a> is an open standard developed by the community to standardize the API between container orchestrators (Mesos, Kubernetes, Cloud Foundry, Docker, etc.) and storage vendors (EBS, Dell ScaleIO, Ceph, Portworx, etc.).

Currently, DC/OS supports CSI spec v0.1.

## CSI Plugin

A gRPC endpoint that implements the CSI Services specified in the CSI spec. See more details about CSI terminology <a href="https://github.com/container-storage-interface/spec/blob/master/spec.md#terminology/">here</a>.

## Storage Local Resource Provider (SLRP)

A Mesos component that drives a single CSI plugin that manages storage resources that exist on a single agent. It presents these storage resources (both raw capacity and in the form of volumes) to Mesos and translates operations on those resources to CSI RPCs which it executes against the CSI plugin. Examples of such CSI plugins are those for LVM2, Raw GPT, other direct-attached storage. Learn more details about SLRP in this <a href ="http://mesos.apache.org/documentation/latest/csi/#storage-local-resource-provider/">Mesos documentation</a>.

## Storage External Resource Provider (SERP)

A Mesos component that drives a single CSI plugin that manages storage resources bound to the cluster as a whole, not tied to to a single agent. It presents these storage resources (both raw capacity and in the form of volumes) to Mesos and translates operations on those resources to CSI RPCs which it executes against the CSI plugin. Examples of such CSI plugins are those for Amazon EBS, NFS, other storage that can be automatically reattached to different agents.

## Volume Provider

A storage object from which a volume can be provisioned. Practically, a volume provider is associated with a single instance of a CSI plugin. Each volume provider hooks into Mesos through a single instance of a Storage Local Resource Provider (SLRP) or Storage External Resource Provider (SERP). There can be many instances of a given kind of volume provider. For example, “lvm volume group” is a kind of volume provider but there can be multiple LVM2 volume groups where each volume group is configured as a separate volume provider.

Example volume providers, multiple of which can appear on the same cluster or agent: 
LVM2 Volume Group (via the LVM2 CSI plugin), 
NFS mount (via some NFS CSI plugin),
ScaleIO <Protection Domain, Storage Pool> (via some ScaleIO CSI plugin)
Amazon EBS: ebs-1, ebs-2, etc.

## Volume Plugin

The software installable component associated with a volume provider. It is typically installed on the agent nodes, e.g., the LVM plugin. Plugins have easily recognizable names such as “lvm” or “ebs”.

## Volume Profile

A set of parameters that can be used to configure a volume. Volume profiles are used to classify volumes according to Dan’s use cases, for example Dan could group all his SSDs into a “fast” profile while grouping HDDs into a “slow” volume profile. Volume profiles are immutable and therefore cannot contain references to specific devices, nodes or other ephemeral identifiers. The CLI subcommand is called ‘profile’ instead of ‘volume profile’ for the sake of brevity.

## Volume

A chunk of storage capacity allocated from a volume provider. This term is inherited from the <a href="https://github.com/container-storage-interface/spec/blob/v0.1.0/spec.md/">CSI Specification</a>. A volume maps to the concept of a Mesos Volume, although not all Mesos Volumes correspond to CSI volumes (eg., Mesos Container Volume, Mesos Persistent Volume).




---
layout: layout.pug
navigationTitle:  Release Notes for 1.10.5
title: Release Notes for 1.10.5
menuWeight: 0
excerpt:
---

# Architecture

![Storage support in DC/OS](/1.11/img/five-maturity-states.png)(IMAGE)

The above figure, shows the high level architecture of the storage support in DC/OS. One of the most important component in this architecture is the DC/OS storage service (DSS), a Service(UNDERLINE) that manages volumes, volume profiles, volume providers, and storage devices in the cluster. DSS serves as the brain of the storage support by collecting storage related information from various components in the cluster, keeping track of their states, and acting on user requests.

Volumes are modeled as Mesos Resources(UNDERLINE) (“disk” resources) so that all the resource management features (e.g., quota, fair sharing, weights) from Mesos apply to volumes. DSS itself is a Mesos Framework that registers with the Mesos master, and manages “disk” resources offered from Mesos.

Devices from each agent are reported to DSS as Mesos RAW disk resources(UNDERLINE). Those devices can be used to create LVM volume providers. Currently, there is a 1:1 mapping between volume providers and Mesos Storage Local Resource Providers (SLRP)(UNDERLINE). Creating a volume provider effectively means creating a SLRP. To create a volume provider, DSS will hit the Mesos agent operator API to create a SLRP.

Each SLRP is associated with a CSI Plugin(UNDERLINE) that is responsible for talking to the actual storage backend. Each CSI Plugin is a set of long running gRPC services, whose lifecycles are managed by the corresponding SLRP. More details can be found here(UNDERLINE) .

DSS is also responsible for creating volumes by converting(UNDERLINE) Mesos RAW disk resources(UNDERLINE) to either Mount or Block disk resources (UNDERLINE)(and deleting volumes by doing the reverse). Created Mount or Block disk resources will be offered to other frameworks in the cluster. Those frameworks can then use those disk resources the same way they would use other Mount or Block disk resources.

Cluster administrators (Dan) can use DC/OS CLI to interact with DC/OS storage service (DSS). A ‘storage’ command has been introduced. See more details in the CLI documentation(UNDERLINE).

---
layout: layout.pug
navigationTitle:  Release Notes for 1.10.5
title: Release Notes for 1.10.5
menuWeight: 0
excerpt:
---

# [Install](#Install)

## [Prerequisites](#Prerequisites)
## [Build the local universe and artifacts server](#Build-the-local-universe-and-artifacts-server)
## [Launch the local universe and artifacts server](#Launch-the-local-universe-and-artifacts-server)
## [Add the local universe](#Add-the-local-universe)
## [Install the DSS package](#Install-the-DSS-package)
## [Verify that the DSS is running](#Verify-that-the-DSS-is-running)

# [Install]

## Prerequisites

- DC/OS Enterprise 1.11 or above.
- Storage feature flag is turned on (`feature_dcos_storage_enabled: true` in config.yaml).
- DC/OS CLI (UNDERLINE) is installed and has been logged in as a superuser.

## Build the local universe and artifacts server

Extract DC/OS Storage Service (DSS) package tarball. Make sure to name the tarball `package.tgz` and DO NOT delete it after extraction.

$ tar zxvf package.tgz
$ cd package

Build the Docker image that will serve both the local universe as well as the artifacts used by DC/OS storage service. Specify the `DOCKER_IMAGE` environment variable accordingly so that the image can be pushed to docker hub or your local docker registry. DO NOT specify the tag of the Docker image because it will be generated by the build script according to the version of the DSS package.


$ DOCKER_IMAGE=jieyu/storage-artifacts universe/build.sh

The build script will generate some instructions for the next steps like the following. Notice that the `<SHA>` will be replaced with a real SHA1 value, reflecting the version of the DSS package. Please do not change that value when following the instructions.

==========
Next Steps
==========

1. Push the docker image 'jieyu/storage-artifacts:<SHA>'
:; docker push jieyu/storage-artifacts:<SHA>

2. Run the following marathon app in your cluster
:; dcos marathon app add /dev/stdin <<EOF
{
  "id": "/storage-artifacts/<SHA>",
  "instances": 1,
  "cpus": 0.25,
  "mem": 128,
  "container": {
    "type": "MESOS",
    "docker": {
      "image": "jieyu/storage-artifacts:<SHA>",
      "forcePullImage": true
    },
    "portMappings": [
      {
        "containerPort": 80,
        "labels": {
          "VIP_0": "/storage-artifacts/<SHA>:10000"
        },
        "protocol": "tcp"
      }
    ]
  },
  "networks": [
    {
      "mode": "container/bridge"
    }
  ]
}
EOF

3. Add the custom package repository
:; dcos package repo add storage-artifacts-<SHA> http://storage-artifacts<SHA>.marathon.l4lb.thisdcos.directory:10000/repo.json --index=0

4. Install the package
:; dcos package install storage --package-version=<VERSION>

Follow the instructions and push the docker image just built to a docker registry that is accessible in the cluster.

$ docker push jieyu/storage-artifacts:<SHA>

Launch the local universe and artifacts server

Once the docker image has been pushed to the docker registry successfully, use the marathon config to launch a Marathon app that will serve the local universe and the storage artifacts.

$ cat <<EOF | dcos marathon app add /dev/stdin
{
  "id": "/storage-artifacts/<SHA>",
  "instances": 1,
  "cpus": 0.25,
  "mem": 128,
  "container": {
    "type": "MESOS",
    "docker": {
      "image": "jieyu/storage-artifacts:<SHA>",
      "forcePullImage": true
    },
    "portMappings": [
      {
        "containerPort": 80,
        "labels": {
          "VIP_0": "/storage-artifacts/<SHA>:10000"
        },
        "protocol": "tcp"
      }
    ]
  },
  "networks": [
    {
      "mode": "container/bridge"
    }
  ]
}
EOF

Add the local universe

Wait for the Marathon app to be in “Running” state, and then add the local universe for the DSS package.

$ dcos package repo add storage-artifacts-<SHA> http://storage-artifacts<SHA>.marathon.l4lb.thisdcos.directory:10000/repo.json --index=0

Install the DSS package

Once the above step is successful, install the DSS package by using the following command. This command will install the DC/OS storage subcommand as well.

$ dcos package install storage --package-version=<VERSION>

Verify that the DSS is running

Run the following command and wait for the DSS to be ready.

$ dcos storage version

# Uninstall

## Uninstall the DSS package

You can simply uninstall the DSS using the following command:

$ dcos package uninstall storage

## Uninstall the local universe

Remove the corresponding local universe using the following command:

$ dcos package repo remove storage-artifacts-<SHA>

# Tutorials

The tutorials in this section cover a use case for using DSS to manage local disks using the LVM Plugin bundled with DC/OS Enterprise.

## Manage local disks using LVM

Prerequisites
- DSS and its CLI are installed. Please follow the instructions here.
- At least one DC/OS agent node.
- Some unused RAW devices available on the agent node.

<ol>
<li>Get the node id of the agent.

$ dcos node
   HOSTNAME         IP                         ID                    TYPE               REGION      ZONE
 10.10.0.167   10.10.0.167  2aada917-0ba0-4041-bb1e-4f16a57cd1a0-S0  agent            us-west-2  us-west-2b
master.mesos.  10.10.0.138    2aada917-0ba0-4041-bb1e-4f16a57cd1a0   master (leader)  us-west-2  us-west-2b 
</li>

<li>List the devices on the node. Note that all devices will be listed regardless of whether they are already in use or not.

$ dcos storage device list --node 2aada917-0ba0-4041-bb1e-4f16a57cd1a0-S0
NODE                                     NAME   STATUS
2aada917-0ba0-4041-bb1e-4f16a57cd1a0-S0  xvdf   ONLINE
2aada917-0ba0-4041-bb1e-4f16a57cd1a0-S0  xvdg   ONLINE
2aada917-0ba0-4041-bb1e-4f16a57cd1a0-S0  xvdh   ONLINE
2aada917-0ba0-4041-bb1e-4f16a57cd1a0-S0  xvda   ONLINE
2aada917-0ba0-4041-bb1e-4f16a57cd1a0-S0  xvda1  ONLINE
2aada917-0ba0-4041-bb1e-4f16a57cd1a0-S0  xvdb   ONLINE
2aada917-0ba0-4041-bb1e-4f16a57cd1a0-S0  xvde   ONLINE
</li>
<li>Let’s assume that device “xvdb” is unused. Create an LVM volume provider using the device “xvdb”.

$ cat <<EOF | dcos storage provider create
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
 $</li>

<li>Create a volume profile “logs” for mount volumes that will match the created LVM volume provider. The profile will use the default filesystem provided by the volume provider.

$ cat <<EOF | dcos storage profile create
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
$</li>
<li>Create a 1G volume named “my-volume-1” of profile “logs”.

$ dcos storage volume create my-volume-1 1G logs
$</li>

<li>Launch a Marathon app requesting a 1G persistent volume with profile “logs”. Marathon will match the created volume, and the app will be in “Running” status.

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

7. Launch another Marathon app requesting a 10G persistent volume with profile “logs”. Since there are not enough disk resources with profile “logs”, the app will be in deploying state.

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

8. Create a 10G volume named “my-volume-2” of profile “logs”. Once the volume is created, the Marathon app above should become “Running”.

$ dcos storage volume create my-volume-2 10G logs
$



