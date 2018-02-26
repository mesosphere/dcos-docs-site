---
layout: layout.pug
navigationTitle: CLI References
title: CLI References
menuWeight: 30
excerpt:
---

# CLI References

This is a reference for all CLI commands available in the DSS package that manage devices, volumes, volume profiles and volume providers.

You must configure a volume provider and a volume profile before creating a volume. 
A volume provider manages storage capacity offered by a CSI plugin to the DC/OS cluster through a DC/OS Storage plugin. A DC/OS Storage plugin consists of a CSI plugin along with some code that integrates it into DC/OS. A volume provider that specifies its plugin as ‘lvm’ is referred to as a ‘lvm’ volume provider.

A volume profile represents volume configurations based on volume provider, volume parameters, and/or labels. For example, if you want to differentiate between HDDs and SSDs for different purposes you can create a “fast” volume profile that identifies your SSDs and a “slow” volume profile that identifies your HDDs. If your framework, say Cassandra, distinguishes between “cache” and “archive” storage you can then configure it to map your “fast” volume profile to Cassandra’s “cache” storage and your “slow” volume profile to Cassandra’s “archive” storage.

Once you have configured a volume provider (eg., an LVM2 volume group) and a volume profile (eg., “all-ssds”) you use the `dcos storage volume ...` subcommand to create and manage volumes.

<table class ="table">
  <tr>
    <th><strong>Commands</strong></th>
    <th><strong>Descriptions</strong></th>
  </tr>
  <tr>
    <td>[dcos storage device](#dcos-storage-device)</td>
    <td>Manage physical devices</td>
  </tr>
    <td>[dcos storage provider](#dcos-storage-provider)</td>
    <td>Manage volume providers</td>
  <tr>
    <td>[dcos storage profile](#dcos-storage-profile)</td>
    <td>Manage volume profiles</td>
  </tr>  
    <td>[dcos storage volume](#dcos-storage-volume)</td>
    <td>Manage volumes</td>
  </tr>     
</table>  


## <a name="dcos-storage-device"></a>dcos storage device
This command manages physical devices.

There are typically storage devices that present as Linux devices on agents in the cluster. The devices on a node can be assembled into volume providers that expose their storage capacity to the rest of the cluster. For example, some SSDs “xvdb” and “xvde” on node “2aada917-0ba0-4041-bb1e-4f16a57cd1a0-S0” can be assembled into a LVM2 volume group on that node creating a new volume provider and specifying the “plugin” as “lvm” and listing “xvdb” and “xvde” as the devices.

### list

This sub-command lists physical devices.

**Note:** All devices will be listed, regardless of whether they are already in use or not.

### Usage
```bash
$ dcos storage device list [<devices>] [flags]
```

### Flags
```json
-h, --help          help for list
    --json          Display the list of devices in json format.
    --node string   Only list devices on node.
```
### Examples:

List all devices in the cluster
```bash
$ dcos storage device list
```
```json
NODE                                     NAME   STATUS
2aada917-0ba0-4041-bb1e-4f16a57cd1a0-S0  xvda   ONLINE
2aada917-0ba0-4041-bb1e-4f16a57cd1a0-S0  xvda1  ONLINE
2aada917-0ba0-4041-bb1e-4f16a57cd1a0-S0  xvdb   ONLINE
2aada917-0ba0-4041-bb1e-4f16a57cd1a0-S0  xvde   ONLINE
```

```bash
$ dcos storage device list --json
```
```json
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


List all devices on a given node
```bash
$ dcos node
```
```json
   HOSTNAME         IP                         ID                    TYPE               REGION      ZONE
 10.10.0.167   10.10.0.167  2aada917-0ba0-4041-bb1e-4f16a57cd1a0-S0  agent            us-west-2  us-west-2b
master.mesos.  10.10.0.138    2aada917-0ba0-4041-bb1e-4f16a57cd1a0   master (leader)  us-west-2  us-west-2b
```

```bash
$ dcos storage device list --node 2aada917-0ba0-4041-bb1e-4f16a57cd1a0-S0
```
```json
NODE                                     NAME   STATUS
2aada917-0ba0-4041-bb1e-4f16a57cd1a0-S0  xvda   ONLINE
2aada917-0ba0-4041-bb1e-4f16a57cd1a0-S0  xvda1  ONLINE
2aada917-0ba0-4041-bb1e-4f16a57cd1a0-S0  xvdb   ONLINE
2aada917-0ba0-4041-bb1e-4f16a57cd1a0-S0  xvde   ONLINE
```

## <a name="dcos-storage-provider"></a>dcos storage provider
This command manage volume providers.

A volume provider manages storage capacity offered by a CSI plugin to the DC/OS cluster through a DC/OS Storage Plugin. A DC/OS Storage Plugin consists of a CSI plugin along with some glue that integrates it into DC/OS. A volume provider that specifies its plugin as 'lvm' is referred to as a 'lvm' volume provider.

There are two kinds of volume provider: local and external. A local volume provider manages storage capacity that is tied to a specific Mesos agent, such as a LVM2 volume group managed by a 'lvm' volume provider. An external volume provider manages storage capacity that is not tied to any specific Mesos Agent such as a volume provider which uses the Amazon EBS API to remotely operate on any Mesos agent in the cluster.

There can be several volume providers for the same type of CSI plugin. For example, the LVM2 CSI plugin manages a single LVM2 volume group (VG), but there can be more than one LVM2 volume group on an agent, so each LVM2 volume group will be configured as a separate volume provider.

### create

This sub-command creates a volume provider.

You configure a volume provider by passing a JSON document to this command. The JSON configuration is read from '<path>' or from STDIN if no '<path>' is specified.

The provider configuration consists of multiple fields: 'name', 'description' and 'spec'.

The 'name' field uniquely identifies the volume provider. It is a string of up to 128 characters. The name must consist of the characters from '[A-Za-z0-9\-]', and must start with a letter. It must be unique throughout the cluster. This field is required.

The 'description' item lets you specify a human-readable description for the volume provider to  add some extra context. This is a string of up to 512 characters. This field is optional.

The 'spec' field is itself a nested structure containing the following fields: 'plugin', 'node', 'plugin-configuration' and 'labels'. When you later configure volume profiles you can select which volume providers to use by filtering on the fields in their 'spec'. This field is required.

The 'spec.plugin' field specifies the name of a DC/OS storage plugin (eg., lvm). Please refer to the plugins documentation for more details. This field is required. 

The 'spec.node' field specifies the Mesos agent ID of a specific agent to which a local volume provider is bound. This field is required for local volume providers and must be omitted for external volume providers.

The 'spec.plugin-configuration' field is plugin specific and you should consult the specific plugin documentation for the supported configuration. This field is required.

Example 'plugin-configuration' for a 'lvm' volume provider:
```json
{
    "name": "lvm-ssds",
    "description": "LVM2 volume group backed by SSDs.",
    "spec": {
        "plugin": "lvm",
        "node": "2aada917-0ba0-4041-bb1e-4f16a57cd1a0-S0",
        "plugin-configuration": {
            "devices": ["xdvb"]
        },
        "labels": { ... }
    }
}
```
The 'spec.labels' section lets you label the volume provider. Labels are not interpreted by DC/OS and it is up to you to ensure that they are meaningful. Labels consist of key-value pairs. The keys must be strings of 128 characters or fewer. The values must be strings of 128 characters or fewer. At maximum 64 labels can be defined although some plugins might further limit the number and format of labels. This field is optional.

Example labels:
```json
{
    "name": "...",
    "description": "...",
    "spec": {
        "plugin": "...",
        "node": "...",
        "provider-configuration": { ... },
        "labels": {
            "rotational": "false",
            "manufacturer": "samsung",
            "nvme": "true",
            "raid": "1"
        }
    }
}
```
### Usage
```bash
$ dcos storage provider create [<path>] [flags]
```
### Flags
```json
-h, --help          help for create

Arguments

<path>    A URL or local path to the volume provider configuration JSON. If
          this is omitted the volume provider configuration JSON is read
          from STDIN.
```
###Examples:

Create an LVM2 volume group called 'volume-group-1' from configuration in a
local file called 'provider.json':
```bash 
$ cat provider.json
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
```
```bash
$ dcos storage provider create provider.json
```
Create a LVM2 volume group called 'volume-group-1' from configuration passed on stdin:
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
```

<a name="dcos-storage-profile"></a>dcos storage profile
This command manages volume profiles.

A volume profile represents volumes based on volume provider or volume parameters and labels. For example, if you want to differentiate between HDDs and SSDs for different purposes, you can create a "fast" volume profile that identifies your SSDs and a "slow" volume profile that identifies your HDDs. If your framework, say Cassandra, distinguishes between "cache" and "archive" storage you can then configure it to map your "fast" volume profile to Cassandra's "cache" storage and your "slow" volume profile to Cassandra's "archive" storage.

### create

Because agents and volumes can come and go in a distributed system it may be difficult to ensure a change or delete operation has completed successfully. For this reason profiles cannot be changed once they have been created (i.e., they are immutable) and they also cannot be removed.

Instead of removing a volume profile, you can deactivate a volume profile. No new volumes can be associated with a volume profile that has been deactivated.

The volume profile configuration must be a JSON document and supports the following fields: 'name', 'description', 'provider-selector' and 'volume-configuration'.

The 'name' field uniquely identifies the volume profile throughout the DC/OS cluster. It is a string of up to 128 characters. The name must consist of the characters from '[A-Za-z0-9\-]', and must start with a letter. This field is required.

The 'description' field lets you specify a human-readable description for the volume profile to add some extra context. This is a string of up to 512 characters. This field is optional.

The 'spec' field is itself a nested structure. It contains the 'provider-selector', 'volume-configuration' and one of either the 'block' or 'mount' fields.

The 'spec.provider-selector' field is itself a nested structure that selects which volume providers volumes of this volume profile can be allocated from. The 'provider-selector' field has the following fields: 'plugin' and 'matches'. This field is required.

The 'spec.provider-selector.plugin' field selects a single plugin and only volume providers from that plugin can be used to create volumes that fit this volume profile. This field is required.

The 'spec.provider-selector.matches' field further restricts the volume providers which can be used to create volume that fit this volume profile. This field consists of key-value pairs that must match those configured in the 'spec' field of the volume provider. If a volume provider does not specify one of the key-value pairs given in the 'matches' field it cannot be used to create volumes that fit this volume profile. If the 'spec' field of a volume provider specifies all the key-value pairs listed in the 'matches' field, as well as some additional key-value pairs, it matches the volume profile and can be used to create volumes that fit it. This field is optional.

The 'spec.volume-configuration' field provides parameters that override the plugin defaults when volumes of this volume profile are created. The available parameters are plugin-specific and are described on the documentation page for the specific plugin. See the corresponding plugin documentation for more details. This field is optional.

Exactly one of 'spec.block' or 'spec.mount' must be specified.

If the 'spec.block' field is specified volumes created using the profile will present as raw linux block devices to your application and will not be automatically formatted. The 'spec.block' field accepts an empty '{}' as value as it does not currently support any type of configuration.

If the 'spec.mount' field is specified volumes created using the profile will be formatted with a filesystem and will present as a mounted filesystem to your application. The 'spec.mount' field value is a nested object with a single, optional field called 'filesystem'. If 'spec.mount.filesystem' is specified volumes will be formatted with the specified filesystem. If it is not specified volumes will be formatted with the default filesystem. The examples illustrate all three possibilities.

NOTE: block volume is currently not supported.

### Usage
```bash
$ dcos storage profile create [<path>] [flags]
```
### Flags
```json
-h, --help          help for create
```
### Arguments

<path>    A URL or local path to the volume profile configuration JSON. If
          this is omitted the volume profile configuration JSON is read
          from STDIN.

### Examples

Create a volume profile called 'logs' from the configuration in profile.json to create volumes formatted with the default filesystem:

```bash
$ cat profile.json
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
                     "rotational": "true"
                }
            }
        },
        "mount": {}
    }
}
```
```bash
$ dcos storage profile create profile.json
```
Create a volume profile called 'safe' for LVM2 volumes from configuration passed on stdin to create volumes formatted with the 'xfs' filesystem:

```bash
$ cat <<EOF | dcos storage profile create
```
```json
{
    "name": "safe",
    "description": "Volumes backed by RAID-1 devices.",
    "spec": {
        "provider-selector": {
            "plugin": "lvm",
            "matches": {
                "labels": {"raid": "1"}
            }
        },
        "mount": {"filesystem": "xfs"}
    }
}
EOF
```
Create a volume profile called 'old' for LVM2 volumes from configuration passed on stdin to create unformatted volumes that will present as linux block devices to your application:

```bash
$ cat <<EOF | dcos storage profile create
```
```json
{
    "name": "old",
    "description": "Volumes on LVM2 VGs labelled as 'old'.",
    "spec": {
        "provider-selector": {
            "plugin": "lvm",
            "matches": {
                "labels": {"old": "true"}
            }
        },
        "block": {}
    }
}
EOF
```
### list

This sub-command lists volume profiles.

### Usage
```bash
$ dcos storage profile list [flags]
```
### Flags
```json
-h, --help   help for list
    --json   Display the list of volume profiles in json format.
```
### Examples

List all profiles:
```bash
$ dcos storage profile list
```
```json
TYPE  NAME  STATUS
lvm   fast  ACTIVE
lvm   logs  ACTIVE
```
List all profiles in JSON format:
```bash
$ dcos storage profile list --json
```
```json
{
    "profiles": [
        {
            "name": "logs",
            "description": "spun down drives for log archives",
            "spec": {
                "provider-selector": {
                    "plugin": "lvm",
                    "matches": {
                        "labels": {
                            "rotational": "true"
                        }
                    }
                },
                "mount": {}
            },
            "status": {
                "phase": "ACTIVE",
                "last-changed": "0001-01-01T00:00:00Z",
                "last-updated": "0001-01-01T00:00:00Z"
            }
        },
        {
            "name": "fast",
            "description": "fast storage",
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
            },
            "status": {
                "phase": "ACTIVE",
                "last-changed": "0001-01-01T00:00:00Z",
                "last-updated": "0001-01-01T00:00:00Z"
            }
        }
    ]
}
```


<a name="dcos-storage-volume"></a>dcos storage volume
This command manages volumes.

A volume consists of storage capacity conforming to a volume profile and allocated by a volume provider. It is made available to your application or framework. There are two kinds of volume: block and mount.

A block volume presents as a raw device file to your Mesos tasks. A mount volume presents as a mounted filesystem visible to your Mesos tasks.

**NOTE:** A block volume, which does not have a filesystem, is currently not supported.

### create

This sub-command creates a volume.

A volume consists of storage capacity conforming to a volume profile and allocated by a volume provider. It is made available to your application or framework. A volume presents as a mounted filesystem visible to your Mesos tasks.

Volumes are created by instructing a volume provider to provision storage capacity according to options described in the specified volume profile along with the specified <size>. In the case of mount volumes, a volume profile also specifies the mount options and filesystem type of the volume being created.

Say you have a profile called 'fast' which is configured to represent SSDs only then creating a volume with volume profile 'fast' will ensure that your volume will be allocated from SSD-backed storage.

### Usage
```bash
$ dcos storage volume create [<name> <size> <profile>] [flags]
```
### Flags
```json
-h, --help              help for create

Arguments

<name>     The name of the volume being created. The name must be unique
           throughout the DC/OS cluster. It is a string of up to 128
           characters. The name must consist of characters from
           [A-Za-z0-9\-], and must start with a letter.
<size>     The size of the volume. The value ends in M, G or T to indicate
           MiB, GiB and TiB respectively.The name of the volume profile.
<profile>  The name of the volume profile to use for this volume.
```
### Examples

Create a 10G volume named “my-volume-1” with profile “fast”:
```bash
$ dcos storage volume create my-volume-1 10G fast
```
### list

This sub-command lists volumes.

### Usage
```bash
$ dcos storage volume list [flags]
```
### Flags
```json
-h, --help   help for list
    --json   Display the list of volumes in json format.
```
### Examples

List all volumes:
```bash
$ dcos storage volume list
```
```json
NODE                                       NAME          SIZE  STATUS
2aada917-0ba0-4041-bb1e-4f16a57cd1a0-S0    my-volume-1   100G  ONLINE
2aada917-0ba0-4041-bb1e-4f16a57cd1a0-S0    my-archive-1  200G  ONLINE
```
List all volumes in JSON format:
```bash
$ dcos storage volume list --json
```
```json
{
    "volumes": [
        {
            "name": "my-volume-1",
            "capacity-mb": 100000,
            "profile": "fast",
            "status": {
                "state": "ONLINE",
                "node": "2aada917-0ba0-4041-bb1e-4f16a57cd1a0-S0",
                "last-changed": "0001-01-01T00:00:00Z",
                "last-updated": "0001-01-01T00:00:00Z"
            }
        },
        {
            "name": "my-archive-1",
            "capacity-mb": 200000,
            "profile": "archive",
            "status": {
                "state": "ONLINE",
                "node": "2aada917-0ba0-4041-bb1e-4f16a57cd1a0-S0",
                "last-changed": "0001-01-01T00:00:00Z",
                "last-updated": "0001-01-01T00:00:00Z"
            }
        }
    ]
}
```



