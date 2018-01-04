---
layout: layout.pug
navigationTitle:  dcos storage device
title: dcos storage device
menuWeight: 0
enterprise: true
beta: true
---


A _storage device_ represents a Linux device on and agent node. Storage devices can be assembled into [volume providers](/1.11/cli/command-reference/dcos-storage/dcos-storage-provider) that expose their storage capacity to the rest of the cluster. For example, some SSDs "/dev/sdb" and "/dev/sdc" on node 10.10.0.3 can be assembled into a LVM2 volume group on that node creating a new volume provider and specifying the `plugin` as "lvm" and listing "/dev/sdb" and "/dev/sdc" as the devices.

```bash
dcos storage device --help
dcos storage device [<command> [options] | --help]
Manage physical devices.


Commands:
dcos storage device list [[options] | --help]
    List devices
dcos storage device show <device> [[options] | --help]
    Show device details

Options:
  -h, --help  Display this help text.
```

- List devices then create an ‘lvm’ volume provider using those devices.

  ```bash
  dcos storage device list
  NODE        DEVICE   ROTATIONAL  VOLUME    PROVIDER  NODE
  10.10.0.2  /dev/sdb  false       -         -         -
  10.10.0.2  /dev/sdc  false       -         -         -
  10.10.0.3  /dev/sdb  true        -         -         -
  ```

- Create an "ssds" volume provider on node "10.10.0.2", where "/dev/sdb" and "/dev/sdc" are both SSDs.

  1. Create provider.

      ```bash
      cat <<EOF | dcos storage provider create
      {
        "name": "ssds",
        "spec": {
          "plugin": "lvm",
          "node": "10.10.0.2",
          "plugin-configuration": {
            "devices": ["/dev/sdb", "/dev/sdc"]
          },
          "labels": {"rotational": "false"}
        }
      }
      EOF
      ```

  1. List devices.

      ```bash
      dcos storage device list
      NODE        DEVICE  TYPE  PROVIDER
      10.10.0.2  /dev/sdb  SSD  ssds
      10.10.0.2  /dev/sdc  SSD  ssds
      10.10.0.3  /dev/sdb  HDD  -
      
      dcos storage device list --json
      ```
      
      ```json
      {
        "devices": [
          {
          "node": "10.10.0.2",
          "device": "/dev/sdb",
          "status": "ok",
          "attributes": {
            "model number": "THNSN51T02DU7 NVMe TOSHIBA 1024GB",
            "serial number": "86GS10BNT3NT",
            "firmware version": "57DA4103",
          },
          "provider": {
            "name": "ssds",
            "spec": {
              "plugin": "lvm",
              "node": "10.10.0.2",
              "plugin-configuration": {
                "devices": ["/dev/sdb", "/dev/sdc"]
              },
              "labels": {"rotational": "false"}
            }
          },
        },
          {
            "node": "10.10.0.2",
            "device": "/dev/sdc",
            "status": "ok",
            "attributes": {
              "model number": "THNSN51T02DU7 NVMe TOSHIBA 1024GB",
              "serial number": "86GS10BNT3NT",
              "firmware version": "57DA4103",
            },
            "provider": {
              "name": "ssds",
              "spec": {
                "plugin": "lvm",
                "node": "10.10.0.2",
                "plugin-configuration": {
                  "devices": ["/dev/sdb", "/dev/sdc"]
                },
                "labels": {"rotational": "false"}
              }
            }
          },
          {
            "node": "10.10.0.3",
            "device": "/dev/sdb",
            "status": "failed",
            "attributes": {
              "model number": "THNSN51T02DU7 NVMe TOSHIBA 1024GB",
              "serial number": "86GS10BNT3NT",
              "firmware version": "57DA4103",
            }
          }      
        ]
      }
      ```

# dcos storage device list

```bash
dcos storage device list --help
dcos storage device list [[options] | --help]
List physical devices.
Options:
  -h, --help  Display this help text
  --json    Display the list of devices in JSON format
  --node    Only list devices on node.
```

## Example

List devices then create an "lvm" volume provider using those devices.

1. List devices

    ```bash
    dcos storage device list
    NODE       DEVICE    ROTATIONAL  PROVIDER
    10.10.0.2  /dev/sdb  false        -
    10.10.0.2  /dev/sdc  false        -
    10.10.0.3  /dev/sdb  true         -
    ```

1. Create a "ssds" volume provider on node 10.10.0.2, where know "/dev/sdb" and "/dev/sdc" are both SSDs.

    ```bash
    cat <<EOF | dcos storage provider create
    {
      "name": "ssds",
      "spec": {
        "plugin": "lvm",
        "node": "10.10.0.2",
        "plugin-configuration": {
          "devices": ["/dev/sdb", "/dev/sdc"]
        },
        "labels": {"rotational": "false"}
      }
    }
    EOF
    ```

1. List devices.
    ```bash
    dcos storage device list
    NODE        DEVICE  TYPE  PROVIDER
    10.10.0.2  /dev/sdb  SSD  ssds
    10.10.0.2  /dev/sdc  SSD  ssds
    10.10.0.3  /dev/sdb  HDD  -

    dcos storage device list --json
    ```

    ```json
    {
      "devices": [
        {
          "node": "10.10.0.2",
          "device": "/dev/sdb",
          "status": "ok",
          "attributes": {
            "model number": "THNSN51T02DU7 NVMe TOSHIBA 1024GB",
            "serial number": "86GS10BNT3NT",
            "firmware version": "57DA4103",
          },
          "provider": {
            "name": "ssds",
            "spec": {
              "plugin": "lvm",
              "node": "10.10.0.2",
              "plugin-configuration": {
                "devices": ["/dev/sdb", "/dev/sdc"]
              },
              "labels": {"rotational": "false"}
            }
          }
        },
        {
          "node": "10.10.0.2",
          "device": "/dev/sdc",
          "status": "ok",
          "attributes": {
            "model number": "THNSN51T02DU7 NVMe TOSHIBA 1024GB",
            "serial number": "86GS10BNT3NT",
            "firmware version": "57DA4103",
          },
          "provider": {
            "name": "ssds",
            "spec": {
              "plugin": "lvm",
              "node": "10.10.0.2",
              "plugin-configuration": {
                "devices": ["/dev/sdb", "/dev/sdc"]
              },
              "labels": {"rotational": "false"}
            }
          }
        },
        {
          "node": "10.10.0.3",
          "device": "/dev/sdb",
          "status": "failed",
          "attributes": {
            "model number": "THNSN51T02DU7 NVMe TOSHIBA 1024GB",
            "serial number": "86GS10BNT3NT",
            "firmware version": "57DA4103",
          }
        }      
      ]
    }
    ```

# dcos storage device show

```bash
dcos storage device show --help
dcos storage device show [<name> [options] | --help]
Show a specific physical device.

Arguments:
  <device>  The path of the device (eg., /dev/sdc)
Options:
  -h, --help  Display this help text.
  --node    Show device on node.
```

## Example

List devices then create an "lvm" volume provider using those devices then show them.

1. List devices.


    ```bash
    dcos storage device list
      NODE        DEVICE    ROTATIONAL  VOLUME    PROVIDER  NODE
      10.10.0.2  /dev/sdb   false       -         -         -
      10.10.0.2  /dev/sdc   false       -         -         -
      10.10.0.3  /dev/sdb   true        -         -         -
    ```

1. Create an "ssds" volume provider on node "10.10.0.2", where "/dev/sdb" and "/dev/sdc" are both SSDs.

    ```bash
    cat <<EOF | dcos storage provider create
    {
      "name": "ssds",
      "spec": {
        "plugin": "lvm",
        "node": "10.10.0.2",
        "plugin-configuration": {
          "devices": ["/dev/sdb", "/dev/sdc"]
        },
        "labels": {"rotational": "false"}
      }
    }
    EOF
    
    dcos storage device list
    NODE        DEVICE   TYPE  PROVIDER
    10.10.0.2  /dev/sdb  SSD  -  ssds
    10.10.0.2  /dev/sdc  SSD  -  ssds
    10.10.0.3  /dev/sdb  HDD  -  -
    
    dcos storage device show /dev/sdb --node=10.10.0.2
    ```
    
    ```json
    {
      "node": "10.10.0.2",
      "device": "/dev/sdb",
      "status": "ok",
      "attributes": {
        "model number": "THNSN51T02DU7 NVMe TOSHIBA 1024GB",
        "serial number": "86GS10BNT3NT",
        "firmware version": "57DA4103",
      },
      "provider": {
        "name": "ssds",
        "spec": {
          "plugin": "lvm",
          "node": "10.10.0.2",
          "plugin-configuration": {
            "devices": ["/dev/sdb", "/dev/sdc"]
          },
          "labels": {"rotational": "false"}
        }
      }
    }
    ```
    
    ```bash
    dcos storage device show /dev/sdb --node=10.10.0.3
    ```
    
    ```json
    {
      "node": "10.10.0.3",
      "device": "/dev/sdb",
      "status": "failed",
      "attributes": {
        "model number": "THNSN51T02DU7 NVMe TOSHIBA 1024GB",
        "serial number": "86GS10BNT3NT",
        "firmware version": "57DA4103",
      }
    }
    ```
