---
layout: layout.pug
navigationTitle: dcos storage profile
title: dcos storage profile
menuWeight: 30
excerpt:
---

This command manages volume profiles.

A volume profile represents volumes based on volume provider or volume parameters and labels.
For example, if you want to differentiate between HDDs and SSDs for different purposes, you can create a `fast` volume profile that identifies your SSDs and a `slow` volume profile that identifies your HDDs.
If your framework, say Cassandra, distinguishes between "cache" and "archive" storage you can then configure it to map your `fast` volume profile to Cassandra's "cache" storage and your `slow` volume profile to Cassandra's "archive" storage.

# `create`

Because agents and volumes can come and go in a distributed system it may be difficult to ensure a change or delete operation has completed successfully.
For this reason profiles cannot be changed once they have been created (i.e., they are immutable) and they also cannot be removed.

Instead of removing a volume profile, you can deactivate a volume profile.
No new volumes can be associated with a volume profile that has been deactivated.

The volume profile configuration must be a JSON document and supports the following fields: `name`, `description`, `provider-selector` and `volume-configuration`.

The `name` field uniquely identifies the volume profile throughout the DC/OS cluster.
It is a string of up to 128 characters.
The name must consist of the characters from `[A-Za-z0-9\-]`, and must start with a letter.
This field is required.

The `description` field allows you specify a human-readable description for the volume profile to add some extra context.
This is a string of up to 512 characters.
This field is optional.

The `spec` field is itself a nested structure.
It contains the `provider-selector`, `volume-configuration` and one of either the `block` or `mount` fields.

The `spec.provider-selector` field is itself a nested structure that selects which volume providers volumes of this volume profile can be allocated from.
The `provider-selector` field has the following fields: `plugin` and `matches`.
This field is required.

The `spec.provider-selector.plugin` field selects a single plugin and only volume providers from that plugin can be used to create volumes that fit this volume profile.
This field is required.

The `spec.provider-selector.matches` field further restricts the volume providers which can be used to create volume that fit this volume profile.
This field consists of key-value pairs that must match those configured in the `spec` field of the volume provider.
If a volume provider does not specify one of the key-value pairs given in the `matches` field it cannot be used to create volumes that fit this volume profile.
If the `spec` field of a volume provider specifies all the key-value pairs listed in the `matches` field, as well as some additional key-value pairs, it matches the volume profile and can be used to create volumes that fit it.
This field is optional.

The `spec.volume-configuration` field provides parameters that override the plugin defaults when volumes of this volume profile are created.
The available parameters are plugin-specific and are described on the documentation page for the specific plugin.
See the corresponding plugin documentation for more details.
This field is optional.

Exactly one of `spec.block` or `spec.mount must be specified.

If the `spec.block` field is specified volumes created using the profile will present as raw linux block devices to your application and will not be automatically formatted.
The `spec.block` field accepts an empty `{}` as value as it does not currently support any type of configuration.

If the `spec.mount` field is specified volumes created using the profile will be formatted with a filesystem and will present as a mounted filesystem to your application.
The `spec.mount` field value is a nested object with a single, optional field called `filesystem`.
If `spec.mount.filesystem` is specified volumes will be formatted with the specified filesystem.
If it is not specified volumes will be formatted with the default filesystem.
The examples illustrate all three possibilities.

**Note:** block volume is currently not supported.

## Usage

```bash
$ dcos storage profile create [<path>] [flags]
```

## Flags

```bash
-h, --help          help for create
```

## Arguments

```bash
<path>    A URL or local path to the volume profile configuration JSON. If
          this is omitted the volume profile configuration JSON is read
          from STDIN.
```

## Examples

Create a volume profile called `logs` from the configuration in profile.json to create volumes formatted with the default filesystem:

```bash
$ cat profile.json
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
$ dcos storage profile create profile.json
```

Create a volume profile called `safe` for LVM2 volumes from configuration passed on `STDIN` to create volumes formatted with the `xfs` filesystem:

```bash
$ cat <<EOF | dcos storage profile create
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

Create a volume profile called `old` for LVM2 volumes from configuration passed on `STDIN` to create unformatted volumes that will present as linux block devices to your application:

```bash
$ cat <<EOF | dcos storage profile create
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

# `list`

This sub-command lists volume profiles.

## Usage

```bash
$ dcos storage profile list [flags]
```

## Flags

```bash
-h, --help   help for list
    --json   Display the list of volume profiles in json format.
```

## Examples

List all profiles:

```bash
$ dcos storage profile list
TYPE  NAME  STATUS
lvm   fast  ACTIVE
lvm   logs  ACTIVE
```

List all profiles in JSON format:

```bash
$ dcos storage profile list --json
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
