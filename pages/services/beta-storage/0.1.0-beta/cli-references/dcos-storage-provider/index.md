---
layout: layout.pug
navigationTitle: dcos storage provider
title: dcos storage provider
menuWeight: 20
excerpt:
---

This command is used to manage volume providers.

A volume provider manages storage capacity offered by a CSI plugin to the DC/OS cluster through a DC/OS Storage Plugin.
A DC/OS Storage Plugin consists of a CSI plugin along with some glue that integrates it into DC/OS.
A volume provider that specifies its plugin as `lvm` is referred to as an "lvm" volume provider.

There are two kinds of volume provider:

1. Local volume provider - A local volume provider manages storage capacity that is tied to a specific Mesos agent, such as a LVM2 volume group managed by an "lvm" volume provider.
2. External volume provider - An external volume provider manages storage capacity that is not tied to any specific Mesos agent, such as a volume provider, which uses the Amazon EBS API to remotely operate on any Mesos agent in the cluster.

There can be several volume providers for the same type of CSI plugin.
For example: The LVM2 CSI plugin manages a single LVM2 volume group (VG), but there can be more than one LVM2 volume group on an agent, so each LVM2 volume group will be configured as a separate volume provider.

# `create`

This sub-command creates a volume provider.

You can configure a volume provider by passing a JSON document to this command.
The JSON configuration is read from `<path>` or from `STDIN` if no `<path>` is specified.

The provider configuration consists of multiple fields: `name`, `description`, and `spec`.

The `name` field uniquely identifies the volume provider.
It is a string of upto 128 characters.
The name must consist of the characters from `[A-Za-z0-9\-]`, and must start with a letter.
It must be unique throughout the cluster.
This field is required.

The `description` field allows you to specify a human-readable description for the volume provider to add some extra context.
This is a string of upto 512 characters.
This field is optional.

The `spec` field is itself a nested structure containing the fields such as: `plugin`, `node`, `plugin-configuration` and `labels`.
When you later configure volume profiles, you can select which volume providers to use by filtering on the fields in their 'spec'.
This field is required.

The `spec.plugin` field specifies the name of a DC/OS storage plugin (e.g., "lvm").
You can refer to the [volume plugins documentation](../../volume-plugins/) for more details.
This field is required.

The `spec.node` field specifies the Mesos agent ID of a specific agent to which a local volume provider is bound.
This field is required for local volume providers and must be omitted for external volume providers.

The `spec.plugin-configuration` field is plugin specific and you should consult the specific [volume plugins documentation](../../volume-plugins/) for the supported configuration.
This field is required.

Example `plugin-configuration` for an "lvm" volume provider:

```json
{
    "name": "lvm-ssds",
    "description": "LVM2 volume group backed by SSDs.",
    "spec": {
        "plugin": "lvm",
        "node": "c67efa5d-34fa-4bc5-8b21-2a5e0bd52385-S1",
        "plugin-configuration": {
            "devices": ["xdvb"]
        },
        "labels": { ... }
    }
}
```

The `spec.labels` section allows you to label the volume provider.
Labels are not interpreted by DC/OS and it is up to the user to ensure that they are meaningful.
Labels consist of key-value pairs.
The keys must be strings of 128 characters or fewer.
The values must be strings of 128 characters or fewer.
At maximum 64 labels can be defined although some plugins might further limit the number and format of labels.
This field is optional.

An example for labels:

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

## Usage

```bash
$ dcos storage provider create [<path>] [flags]
```

## Flags

```bash
-h, --help          help for create
```

## Arguments

```bash
<path>    A URL or local path to the volume provider configuration JSON. If
          this is omitted the volume provider configuration JSON is read
          from STDIN.
```

## Examples

Create an LVM2 volume group called `volume-group-1` from configuration in a local file called `provider.json`:

```bash
$ cat provider.json
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
$ dcos storage provider create provider.json
```

Create a LVM2 volume group called `volume-group-1` from configuration passed on `STDIN`:

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

# `list`

List existing volume providers.

## Usage

```bash
dcos storage provider list [<providers>] [flags]
```

## Flags

```bash
-h, --help            help for list
    --json            Display the list of volume providers in json format.
    --node string     Only show local volume providers on node.
    --plugin string   Only show providers of the specified plugin.
```

## Arguments

```bash
<providers> A space-separated list of providers. This argument is optional.
            If it is not provided all providers will be listed.
```

## Examples

List all volume providers.

```bash
$ dcos storage provider list
PLUGIN  NAME            NODE
lvm     volume-group-1  c67efa5d-34fa-4bc5-8b21-2a5e0bd52385-S1
```

List all volume providers in JSON mode.

```bash
$ dcos storage provider list --json
{
    "providers": [
        {
            "name": "volume-group-1",
            "spec": {
                "plugin": "lvm",
                "node": "c67efa5d-34fa-4bc5-8b21-2a5e0bd52385-S1",
                "plugin-configuration": {
                    "devices": [
                        "xvdb"
                    ]
                },
                "labels": {
                    "rotational": "false"
                }
            },
            "status": {
                "state": "ONLINE",
                "nodes": [
                    "c67efa5d-34fa-4bc5-8b21-2a5e0bd52385-S1"
                ],
                "last-changed": "0001-01-01T00:00:00Z",
                "last-updated": "0001-01-01T00:00:00Z"
            }
        }
    ]
}
```
