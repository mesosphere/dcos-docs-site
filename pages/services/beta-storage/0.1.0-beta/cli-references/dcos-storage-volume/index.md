---
layout: layout.pug
navigationTitle: dcos storage volume
title: dcos storage volume
menuWeight: 40
excerpt:
---

This command manages volumes.

A volume consists of storage capacity conforming to a volume profile and allocated by a volume provider.
It is made available to your application or framework.

There are two kinds of volume:
1. A block volume - This presents as a raw device file to your Mesos tasks.
2. A mount volume - This presents as a mounted filesystem visible to your Mesos tasks.

**Note:** A block volume, which does not have a filesystem, is currently not supported.

# `create`

This sub-command creates a volume.

A volume consists of storage capacity conforming to a volume profile and allocated by a volume provider.
It is made available to your application or framework.
A volume presents as a mounted filesystem visible to your Mesos tasks.

Volumes are created by instructing a volume provider to provision storage capacity according to options described in the specified volume profile along with the specified `<size>`.
In the case of mount volumes, a volume profile also specifies the mount options and filesystem type of the volume being created.

For example, if you have a profile called `fast`, which is configured to represent SSDs only then creating a volume with volume profile `fast` will ensure that your volume will be allocated from SSD-backed storage.

## Usage

```bash
$ dcos storage volume create [<name> <size> <profile>] [flags]
```

## Flags

```bash
-h, --help              help for create
```

## Arguments

```bash
<name>     The name of the volume being created. The name must be unique
           throughout the DC/OS cluster. It is a string of up to 128
           characters. The name must consist of characters from
           [A-Za-z0-9\-], and must start with a letter.
<size>     The size of the volume. The value ends in M, G or T to indicate
           MiB, GiB and TiB respectively.The name of the volume profile.
<profile>  The name of the volume profile to use for this volume.
```

## Examples

Create a 10G volume named `my-volume-1` with profile `fast`:

```bash
$ dcos storage volume create my-volume-1 10G fast
```

# `list`

This sub-command lists volumes.

## Usage

```bash
$ dcos storage volume list [flags]
```

## Flags

```bash
-h, --help   help for list
    --json   Display the list of volumes in json format.
```

## Examples

List all volumes.

```bash
$ dcos storage volume list
NODE                                     NAME         SIZE    STATUS
c67efa5d-34fa-4bc5-8b21-2a5e0bd52385-S1  my-volume-1  1024M   ONLINE
c67efa5d-34fa-4bc5-8b21-2a5e0bd52385-S1  my-volume-2  10240M  ONLINE
```

List all volumes in JSON format.

```bash
$ dcos storage volume list --json
{
    "volumes": [
        {
            "name": "my-volume-1",
            "capacity-mb": 1024,
            "profile": "fast",
            "status": {
                "state": "ONLINE",
                "node": "c67efa5d-34fa-4bc5-8b21-2a5e0bd52385-S1",
                "last-changed": "0001-01-01T00:00:00Z",
                "last-updated": "0001-01-01T00:00:00Z"
            }
        },
        {
            "name": "my-volume-2",
            "capacity-mb": 10240,
            "profile": "fast",
            "status": {
                "state": "ONLINE",
                "node": "c67efa5d-34fa-4bc5-8b21-2a5e0bd52385-S1",
                "last-changed": "0001-01-01T00:00:00Z",
                "last-updated": "0001-01-01T00:00:00Z"
            }
        }
    ]
}
```
