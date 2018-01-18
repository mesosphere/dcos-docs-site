---
layout: layout.pug
navigationTitle:  dcos storage volume
title: dcos storage volume
menuWeight: 3
enterprise: true
beta: true
---

A _storage volume_ consists of storage capacity conforming to a [volume profile](/1.11/cli/command-reference/dcos-storage/dcos-storage-profile) and allocated by a [volume provider](/1.11/cli/command-reference/dcos-storage/dcos-storage-provider). It is made available to your application or framework. 

There are two kinds of volume: block and mount. A block volume presents as a raw device file to your Mesos tasks. A mount volume presents as a mounted filesystem visible to your Mesos tasks.


```bash
dcos storage volume --help
dcos storage volume [<command> [options] | --help]
Manage volumes.


Commands:
dcos storage volume create [<name> <size> <profile> [options] | --help]
    Create a volume.
dcos storage volume remove [<name> [options] | --help]
    Remove a volume and delete all contents.
dcos storage volume list [<plugin> [options] | --help]
    List volumes.
dcos storage volume show [<name> | --help]
    Show a specific volume with profile and volume provider details.
```

# dcos storage volume create

You create a volume by instructing a volume provider to provision storage capacity according to options described in the specified [volume profile](/1.11/cli/command-reference/dcos-storage/dcos-storage-profile) along with the specified `<size>`. In the case of mount volumes, a volume profile also specifies the mount options and filesystem type of the volume being created.

If you have a profile called "fast", that is configured to represent only SSDs, then creating a volume with volume profile "fast" will ensure that your volume will be allocated from SSD-backed storage. 

```bash
dcos storage volume create --help
dcos storage volume create [<name> <size> <profile> [options] | --help]
Create a volume.

Arguments:
  <name>    The name of the volume being created. The name must be
      unique throughout the DC/OS cluster.
      It is a string of up to 128 characters. The name 
      must consist of characters from ‘[A-Za-z0-9\-]’, and 
      must start with a letter.
  <size>    The size of the volume. The value ends in M or G to 
      indicate MiB and GiB respectively.
  <profile>  The name of the volume profile to use for this volume.

Options:
  -h, --help  Display this help text
  --provider  Allocate the volume from a volume provider with a
      specific name and matches the volume profile.
  --node  The node on which a volume must be provisioned. 
      This requires that the volume profile selects
      only local volume providers, one of which must be
      bound to the given node.
```

# Example

Create two similar volume providers, each on a different node. Then create a volume profile called "fast" that selects volume providers that provide non-rotational storage. Finally, create a SSD-backed volume without specifying a specific provider and another where the provider is specified:

1. Create a "ssds" volume provider on node 10.10.0.1, where "/dev/sdb" and "/dev/sdc" are both SSDs.

    ```bash
    cat <<EOF | dcos storage provider create
    {
      "name": "ssds",
      "spec": {
        "plugin": "lvm",
        "node": "10.10.0.1",
        "plugin-configuration": {
          "devices": ["/dev/sdb", "/dev/sdc"]
        },
        "labels": {"rotational": "false"}
      }
    }
    EOF
    ```
  
1. Create a volume provider called "ssds" on node 10.10.0.3, where "/dev/sde" is a SSD.

    ```bash
    cat <<EOF | dcos storage provider create
    {
      "name": "ssds",
      "spec": {
        "plugin": "lvm",
        "node": "10.10.0.3",
        "plugin-configuration": {
          "devices": ["/dev/sde"]
        },
        "labels": {"rotational": "false"}
      }
    }
    EOF
    ```
    
1. Create a volume profile called "fast" that selects volume providers that provide solid state storage capacity.

    ```bash
    cat <<EOF | dcos storage profile create 
    {
      "name": "fast",
      "spec": {
        "provider-selector": {
          "plugin": "lvm",
          "filter": {
            "labels": {"rotational": false}
          }
        }
      }
    }
    EOF
    ```

1. Create a SSD-backed volume. This volume can be created on the 10.10.0.1 agent or on the 10.10.0.3 agent.

    ```
    dcos storage volume create my-volume-1 10G fast
    ```

1. Create a SSD-backed volume. This volume may be created on by any "lvm" volume provider backed by non-rotational storage as long as it is bound to agent 10.10.0.1 agent.

    ```
    dcos storage volume create my-volume-1 10G fast --node=10.10.0.1
    ```

1. Create a volume backed by the "ssds" volume provider on agent 10.10.0.3.

    ```
    dcos storage volume create my-volume-1 10G fast \
      --provider=ssds --node=10.10.0.3
    ```

# dcos storage volume remove

```bash
dcos storage volume remove --help
dcos storage volume remove [<name> [options] | --help]
Remove a volume.
If the volume is in use an error is returned.

Arguments:
  <name>    The name of the volume being removed.


Options:
  -h, --help  Display this help text
```

##  Example

Create a SSD-backed volume from a "fast" volume profile that selects a "lvm" volume provider then remove it again:

1. Create a "ssds" volume provider on node 10.10.0.1, where "/dev/sdb" and "/dev/sdc" are both SSDs.

    ```bash
    cat <<EOF | dcos storage provider create
    {
      "name": "ssds",
      "spec": {
        "plugin": "lvm",
        "node": "10.10.0.1",
        "plugin-configuration": {
          "devices": ["/dev/sdb", "/dev/sdc"]
        },
        "labels": {"rotational": "false"}
      }
    }
    EOF
    ```
    
1. Create a volume profile called "fast" that selects volume providers that provide solid state storage capacity.

    ```bash
    cat <<EOF | dcos storage profile create 
    {
      "name": "fast",
      "spec": {
        "provider-selector": {
          "plugin": "lvm",
          "filter": {
            "labels": {"rotational": "false"}
          }
        }
      }
    }
    EOF
    ```

1. Create a SSD-backed volume without specifying a specific provider.

    ```bash
    dcos storage volume create my-volume-1 5G fast
    ```

1. Remove the volume again.

    ```bash
    dcos storage volume remove my-volume-1
    ```

# dcos storage volume list

```bash
dcos storage volume list --help
dcos storage volume list [[options] | --help]
List volumes.

Options:
  -h, --help  Display this help text
  --json    Display the list of volumes in JSON format.
  --node    Only list volumes created by local volume 
      providers on node.
```

## Example

Create two volumes.

1. Create a SSD-backed volume from a "fast" volume profile.

    ```bash
    dcos storage volume create my-volume-1 100G fast
    ```

1. Create an EBS volume from an "secure-ebs" volume profile.

    ```bash
    dcos storage volume create my-ebs-1 100G secure-ebs
    ```
    
1. List the volumes.

    ```bash
    dcos storage volume list
    NAME          PROFILE  PROVIDER       NODE       SIZE
    my-volume-1    fast    lvm/ssds       10.10.0.2  100G
    my-ebs-1      archive  ebs/secure-ebs  -         100G

    dcos storage volume list --json
    ```

    ```json
    {
      "volumes": [
        {
          "name": "my-volume-1",
          "size": "100G",
          "profile": {
            "name": "fast",
            "spec": {
              "provider-selector": {
                "plugin": "lvm",
                "filter": {
                  "labels": {"rotational": "false"}
                }
              }
            }
          },
          "provider":  {
            "name": "ssds",
            "spec": {
              "plugin": "lvm",
              "node": "10.10.0.1",
              "plugin-configuration": {
                "devices": ["/dev/sdb", "/dev/sdc"]
              },
              "labels": { "rotational": "false"}
            }
          },
          "status": "ok"
        },
        {
          "name": "my-ebs-1",
          "size": "100G",
          "profile": {
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
          },
          "provider": {
            "name": "secure-ebs",
            "description": "Amazon EBS volumes",
            "spec": {
              "plugin": "ebs",
              "plugin-configuration": {
                "availability-region": "us-west-1",
                "credentials": {
                  "access_key_id": "...",
                  "secret_access_key": "..."
                }
              },
              "secrets": {
                "dcos-aws-secret": "/aws/secret"
              }
            },
          "status": "ok"
        }
      ]
    }
    ```

# dcos storage volume show

```bash
dcos storage volume show --help
dcos storage volume show [<name> | --help]
Show the details of a specific volume along with its volume profile and volume provider.

Arguments:
  <name>    The name of the volume whose details to show.


Options:
  -h, --help  Display this help text
```

## Example

Create a SSD-backed volume from a "fast" volume profile satisfied by an "lvm" volume provider and then show the details of the created volume.

1. Create a "ssds" volume provider on node 10.10.0.1, where "/dev/sdb" and "/dev/sdc" are both SSDs.

    ```bash
    cat <<EOF | dcos storage provider create
    {
      "name": "ssds",
      "spec": {
        "plugin": "lvm",
        "node": "10.10.0.1",
        "plugin-configuration": {
          "devices": ["/dev/sdb", "/dev/sdc"]
        },
        "labels": {"rotational": "false"}
      },
      "status": "ok"
    }
    EOF
    ```
  
1. Create a volume profile called "fast" that selects volume providers that provide solid state storage capacity.

    ```bash
    cat <<EOF | dcos storage profile create 
    {
      "name": "fast",
      "spec": {
        "provider-selector": {
          "plugin": "lvm",
          "filter": {
            "labels": {"rotational": "false"}
          }
        }
      }
    }
    EOF
    ```

1. Create a SSD-backed volume without specifying a specific provider.

    ```bash
    dcos storage volume create my-volume-1 5G fast
    ```

1. Show the volume details.

    ```bash
    dcos storage volume show my-volume-1
    ```
    
    ```json
    {
      "name": "my-volume-1",
      "size": "5G",
      "profile": {
        "name": "fast",
        "spec": {
          "provider-selector": {
            "plugin": "lvm",
            "filter": {
              "labels": {"rotational": "false"}
            }
          }
        }
      },
      "provider": {
          "name": "ssds",
          "spec": {
            "plugin": "lvm",
            "node": "10.10.0.1",
            "plugin-configuration": {
              "devices": ["/dev/sdb", "/dev/sdc"]
            },
            "labels": {"rotational": "false"}
          }
        }
      }
    }
    ```
