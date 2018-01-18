---
layout: layout.pug
navigationTitle:  dcos storage profile
title: dcos storage profile
menuWeight: 1
enterprise: true
beta: true
---


A _volume profile_ represents volumes based on [volume provider](/1.11/cli/command-reference/dcos-storage/dcos-storage-provider) or volume parameters and labels. For example, if you want to differentiate between HDDs and SSDs, you can create a "fast" volume profile that identifies your SSDs and a "slow" volume profile that identifies your HDDs. If your framework, say Cassandra, distinguishes between "cache" and "archive" storage you can then configure it to map your "fast" volume profile to Cassandra’s "cache" storage and your "slow" volume profile to Cassandra’s "archive" storage.

Because agents and volumes can come and go in a distributed system it is generally impossible to ensure a change or delete operation has completed successfully. For this reason profiles cannot be changed once they have been created (i.e., they are immutable) and they cannot be removed. Instead of removing a volume profile, you can [deactivate](#dcos-storage-profile-deactivate) a volume profile. No new volumes or volume providers can be associated with a volume profile that has been deactivated. When a volume profile is first created it is _active_ by default. You reactivate a deactivated profile using the [activate](#dcos-storage-profile-activate) command.

```bash
dcos storage profile --help
dcos storage profile [<command> [options] | --help]
Manage volume profiles.


Commands:
  dcos storage profile create [<path> [options] | --help]
    Create a profile.
  dcos storage profile list [[options] | --help]
    List profiles.
  dcos storage profile show [<name> | --help]
    Show the details of a specific profile.
  dcos storage profile deactivate [<name> [options] | --help]
    Deactivate an active profile.
  dcos storage profile activate [<name> [options] | --help]
    Activate a profile that has been deactivated.
```

# dcos storage profile create

The volume profile configuration must be a JSON document and supports the following fields: `name`, `description`, `provider-selector`, and `volume-configuration`.

- The `name` field uniquely identifies the volume profile throughout the DC/OS cluster. It is a string of up to 128 characters. The name must consist of the characters from `[A-Za-z0-9\-]`, and must start with a letter. This field is required.
- The `description` item lets you specify a human-readable description for the volume profile to add some extra context. This is a string of up to 512 characters. This field is optional.
- The `spec` field is itself a nested structure. It contains the `provider-selector` and `volume-configuration` fields.
- The `spec.provider-selector` field is itself a nested structure that selects which volume providers volumes of this volume profile can be allocated from. The `provider-selector` field has the following fields: `plugin` and `matches`. This field is required.
- The `spec.provider-selector.plugin` field selects a single [plugin](/1.11/storage/plugins/) and only volume providers from that plugin can be used to create volumes that fit this volume profile. This field is required.
- The `spec.provider-selector.matches` field further restricts the volume providers that can be used to create volume that fit this volume profile. This field consists of key-value pairs that must match those configured in the `spec` field of the volume providers. If a volume provider does not specify one of the key-value pairs given in the `matches` field it cannot be used to create volumes that fit this volume profile. If the `spec` field of a volume provider specifies all the key-value pairs listed in the `matches` field, as well as some additional key-value pairs, it matches the volume profile and can be used to create volumes that fit it. This field is optional.
- The `spec.volume-configuration` field provides parameters that override the plugin defaults when volumes of this volume profile are created. The available parameters are plugin-specific and are described in the documentation for the specific plugin. This field is optional.

```bash
dcos storage profile create --help
dcos storage profile create [<path> [options] | --help]
Create a volume profile.

Arguments:
  <path>   A URL or local path to the volume profile configuration JSON. If this is omitted the 
      volume profile configuration JSON is read from stdin.

Options:
-h, --help        Display this help text.
```

# Examples

## Example 1 
Create a volume profile called "logs" from the configuration in `profile.json`.

```bash
cat profile.json
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
    }
  }
}
```

```bash
dcos storage profile create profile.json
```

## Example 2 
Create a volume profile called "safe" for LVM2 volumes from a configuration passed on stdin.

```bash
cat <<EOF | dcos storage profile create
{
  "name": "safe",
  "description": "Volumes backed by RAID-1 devices.",
  "spec": {
    "provider-selector": {
      "plugin": "lvm",
      "matches": {
        "plugin-configuration": {
          "parameters": {"metadatacopies": 3},
        },
        "labels": {"raid": "1"}
      }
    }
  }
}
EOF
```

## Example 3 

Create a volume provider called "secure-ebs" that provides Amazon EBS volumes. Then create a volume profile called "archive" to create volumes using that volume provider of type "Cold HDD (st1)".

1. Create the "secure-ebs" volume provider.

    ```bash
    cat <<EOF | dcos storage provider create
    {
      "name": "secure-ebs",
      "description": "Amazon EBS volumes in us-west-1.",
      "spec": {
        "plugin": "ebs",
        "plugin-configuration": {
          "availability-region": "us-west-1",
          "credentials": {
            "access_key_id": "AKIAIH3SLCHGZVR4Q",
            "secret_access_key": "dcos-aws-secret
          }
        },
        "secrets": {
          "dcos-aws-secret": "/aws/secret"
        }
      }
    }
    EOF
    ```

1. Create the "archive" profile.

    ```bash
    cat <<EOF | dcos storage profile create
    {
      "name": "archive",
      "description": "Cold (st1) EBS volumes.",
      "spec": {
        "provider-selector": {
          "plugin": "ebs"
        },
        "volume-configuration": {
          "volume-type: "st1"
        }
      }
    }
    EOF
    ```

## Example 4

Create a volume profile called "old" for LVM2 volumes from configuration passed on stdin.

```bash
cat <<EOF | dcos storage profile create
{
  "name": "old",
  "description": "Volumes on LVM2 VGs labelled as ‘old’.",
  "spec": {
    "provider-selector": {
      "plugin": "lvm",
      "matches": {
        "labels": {"old": "true"}
      }
    }
  }
}
EOF
```

# dcos storage profile list

```bash
dcos storage profile list --help
dcos storage profile list [[options] | --help]
List volume profiles.

Options:
-h, --help  Display this help text.
  --json    Display the list of volume profiles in json format
```

## Example

Create two volume profiles, then list them.

1. Create the "safe" profile.

    ```bash
    cat <<EOF | dcos storage profile create
    {
      "name": "safe",
      "description": "Volumes backed by RAID-1 devices.",
      "spec": {
        "provider-selector": {
          "plugin": "lvm",
          "matches": {
            "providerplugin-configuration": {
              "parameters": {"metadatacopies": 3},
            },
            "labels": {"raid": "1"}
          }
        }
      }
    }
    EOF
    ```

1. Create the "archive" profile.

    ```bash
    cat <<EOF | dcos storage profile create
    {
      "name": "archive",
      "description": "Cold (st1) EBS volumes.",
      "spec": {
        "provider-selector": {
          "plugin": "ebs"
        },
        "volume-configuration": {
          "volume-type": "st1"
        }
      }
    }
    EOF
    ```
1. Deactivate the "archive" volume profile.

    ```bash
    dcos storage profile deactivate archive
    ```

1. List the profiles.

    ```bash
    dcos storage profile list
    
      TYPE   NAME    ACTIVE
      lvm    safe     true
      ebs    archive  false
      
    dcos storage profile list --json
    ```
    
    ```json
      {
        "profiles": [
          {
            "name": "safe",
            "description": "Volumes backed by RAID-1 devices.",
            "spec": {
              "provider-selector": {
                "plugin": "lvm",
                "matches": {
                  "providerplugin-configuration": {
                    "parameters": {"metadatacopies": 3},
                  },
                  "labels": {"raid": "1"}
                }
              }
            }
          },
          {
            "name": "archive",
            "description": "Cold (st1) EBS volumes.",
            "spec": {
              "provider-selector": {
                "plugin": "ebs"
              },
              "volume-configuration": {
                "volume-type": "st1"
              }
            }
          }
        ]
      }
    ```
    
# dcos storage profile show

```bash
dcos storage profile show --help
dcos storage profile show [<name> | --help]
Show the details of a specific volume profile.

Arguments:
  <name>    The name of the profile to show
Options:
-h, --help  Display this help text.
```

## Example

Create a profile then show it.

1. Create the "safe" profile.

    ```bash
    cat <<EOF | dcos storage profile create
    {
      "name": "safe",
      "description": "Volumes backed by RAID-1 devices.",
      "spec": {
        "provider-selector": {
          "plugin": "lvm",
          "matches": {
            "providerplugin-configuration": {
              "parameters": {"metadatacopies": 3},
            },
            "labels": {"raid": "1"}
          }
        }
      }
    }
    EOF

    dcos storage profile show safe
    ```
    
    ```json
    {
      "name": "safe",
      "description": "Volumes backed by RAID-1 devices.",
      "spec": {
        "provider-selector": {
          "plugin": "lvm",
          "matches": {
            "providerplugin-configuration": {
              "parameters": {"metadatacopies": 3},
            },
            "labels": {"raid": "1"}
          }
        }
      }
    }
    ```

# dcos storage profile deactivate

```bash
dcos storage profile deactivate --help
dcos storage profile deactivate [<name> | --help]
Deactivate an active volume profile.

Arguments:
<name>    The name of the volume profile to deactivate.

Options:
-h, --help    Display this help text
```

## Example

Create a volume profile then deactivate it and try to create a volume of that profile.

1. Create the "safe" profile.

    ```bash
    cat <<EOF | dcos storage profile create
    {
      "name": "safe",
      "description": "Volumes backed by RAID-1 devices.",
      "spec": {
        "provider-selector": {
          "plugin": "lvm",
          "matches": {
            "providerplugin-configuration": {
              "parameters": {"metadatacopies": 3},
            },
            "labels": {"raid": "1"}
          }
        }
      }
    }
    EOF
    ```

1. Create a volume from volume profile "safe".

    ```bash
    dcos storage volume create my-volume-1 safe
    ```
    
1. Deactivate the "safe" volume profile.

    ```bash
    dcos storage profile deactivate safe
    ```

1. Try to create a new volume from volume profile "safe".

    ```bash
    dcos storage volume create my-volume-2 safe

    Error: profile is not active.
    ```

# dcos storage profile activate

```bash
dcos storage profile activate --help
dcos storage profile activate [<name> | --help]
Activate a profile that has been deactivated.

Arguments:
<name>    The name of the volume profile to reactivate.

Options:
-h, --help    Display this help text.
```

## Example 

Create a volume profile, deactivate it, activate it, and show that volumes can be created from it.

1. Create the "safe" profile.

    ```bash
    cat <<EOF | dcos storage profile create
    {
      "name": "safe",
      "description": "Volumes backed by RAID-1 devices.",
      "spec": {
        "provider-selector": {
          "plugin": "lvm",
          "matches": {
            "providerplugin-configuration": {
              "parameters": {"metadatacopies": 3},
            },
            "labels": {"raid": "1"}
          }
        }
      }
    }
    EOF
    ```

1. Create a volume from profile "safe".

    ```bash
    dcos storage volume create my-volume-1 safe
    ```

1. Deactivate the "safe" profile.

    ```bash
    dcos storage profile deactivate safe
    ```

1. Try to create a new volume from profile "safe".

    ```bash
    dcos storage volume create my-volume-2 safe
    Error: profile is not active.
    ```

1. Reactivate the "safe" profile.

    ```bash
    dcos storage volume activate safe
    ```

1. Try to create a new volume from profile "safe".

    ```bash
    dcos storage volume create my-volume-2 safe
    ```
