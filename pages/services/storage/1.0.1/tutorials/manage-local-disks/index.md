---
layout: layout.pug
origin: github.com/mesosphere/dcos-storage/docs/tutorials/manage-local-disks/index.md
navigationTitle: Manage local disks using LVM
title: Manage local disks using LVM
menuWeight: 50
excerpt: Step by step walkthrough of using DC/OS Storage Service to discover devices and provision a storage profile, local volume provider, and local volume.
enterprise: true
---

The tutorials in this section cover a use case for using DSS to manage local
disks using the [CSI plugin for LVM](https://github.com/mesosphere/csilvm).
LVM2 is bundled with DC/OS Enterprise.

# Manage local disks using LVM

## Prerequisites

- DSS and its CLI are [installed](../../install/).
- At least one DC/OS agent node.
- Some unused RAW devices available on the agent node.

## Getting started

1.  Get the node ID of the agent.

    ```bash
    dcos node
    ```
    ```
    HOSTNAME        IP                         ID                    TYPE                 REGION          ZONE
    10.0.0.138   10.0.0.138  ca626e4a-e3cb-4613-b7dd-618cfc19bee1-S0  agent            aws/us-west-2  aws/us-west-2c
    10.0.1.21    10.0.1.21   ca626e4a-e3cb-4613-b7dd-618cfc19bee1-S1  agent            aws/us-west-2  aws/us-west-2c
    master.mesos.  10.0.5.247    ca626e4a-e3cb-4613-b7dd-618cfc19bee1   master (leader)  aws/us-west-2  aws/us-west-2c
    ```

    For this tutorial we will use the agent with Mesos agent ID `ca626e4a-e3cb-4613-b7dd-618cfc19bee1-S0` corresponding to private IP `10.0.1.21`.

1.  Create the Devices volume provider on the node.

    ```bash
    cat > devices-provider.json <<EOF
    {
        "name": "devices-provider-S0",
        "description": "Expose devices on a node",
        "spec": {
            "plugin": {
                "name": "devices",
                "config-version": "latest"
            },
            "node": "ca626e4a-e3cb-4613-b7dd-618cfc19bee1-S0",
            "plugin-configuration": {
                "blacklist": "loop[0-9]"
            }
        }
    }
    EOF
    dcos storage provider create devices-provider.json
    ```

    If the creation is successful, you can view the newly created volume provider using the `list` command.

    ```bash
    dcos storage provider list
    ```
    ```
    PLUGIN   NAME                 NODE                                     STATE
    devices  devices-provider-S0  ca626e4a-e3cb-4613-b7dd-618cfc19bee1-S0  ONLINE
    ```

1.  List the devices on the node.

    <p class="message--note"><strong>NOTE: </strong> All devices that are not blacklisted will be listed, regardless of whether they are already in use or not.</p>

    ```bash
    dcos storage device list --node=ca626e4a-e3cb-4613-b7dd-618cfc19bee1-S0
    ```
    ```
    NODE                                     NAME   STATUS  ROTATIONAL  TYPE
    ca626e4a-e3cb-4613-b7dd-618cfc19bee1-S0  usr    ONLINE  false       crypt
    ca626e4a-e3cb-4613-b7dd-618cfc19bee1-S0  xvda   ONLINE  false       disk
    ca626e4a-e3cb-4613-b7dd-618cfc19bee1-S0  xvda1  ONLINE  false       part
    ca626e4a-e3cb-4613-b7dd-618cfc19bee1-S0  xvda2  ONLINE  false       part
    ca626e4a-e3cb-4613-b7dd-618cfc19bee1-S0  xvda3  ONLINE  false       part
    ca626e4a-e3cb-4613-b7dd-618cfc19bee1-S0  xvda4  ONLINE  false       part
    ca626e4a-e3cb-4613-b7dd-618cfc19bee1-S0  xvda6  ONLINE  false       part
    ca626e4a-e3cb-4613-b7dd-618cfc19bee1-S0  xvda7  ONLINE  false       part
    ca626e4a-e3cb-4613-b7dd-618cfc19bee1-S0  xvda9  ONLINE  false       part
    ```

1.  Let's assume that device `xvda4` and device `xvda7` are unused.
    Create an `lvm` volume provider using both devices.

    ```bash
    cat > volume-group-1.json <<EOF
    {
        "name": "volume-group-1",
        "description": "The primary volume group",
        "spec": {
            "plugin": {
                "name": "lvm",
                "config-version": "latest"
            },
            "node": "ca626e4a-e3cb-4613-b7dd-618cfc19bee1-S0",
            "plugin-configuration": {
                "devices": ["xvda4", "xvda7"]
            },
            "labels": {"rotational": "false"}
        }
    }
    EOF
    dcos storage provider create volume-group-1.json
    ```

    If the creation is successful, you can view the newly created volume provider using the `list` command.

    ```bash
    dcos storage provider list
    ```
    ```
    PLUGIN   NAME                 NODE                                     STATE
    devices  devices-provider-S0  ca626e4a-e3cb-4613-b7dd-618cfc19bee1-S0  ONLINE
    lvm      volume-group-1       ca626e4a-e3cb-4613-b7dd-618cfc19bee1-S0  ONLINE
    ```

    The logs for all `lvm` volume providers on a node may be viewed using the [DC/OS CLI](../../latest/cli/command-reference/dcos-node/dcos-node-log/):

    ```bash
    dcos node log --mesos-id=ca626e4a-e3cb-4613-b7dd-618cfc19bee1-S0 --filter=CSI_PLUGIN:csilvm --filter=STREAM:STDERR
    ```
    ```
    2018-05-22 23:39:15:           {
    2018-05-22 23:39:15:               "vg": [
    2018-05-22 23:39:15:                   {"vg_free":"1132462080"}
    2018-05-22 23:39:15:               ]
    2018-05-22 23:39:15:           }
    2018-05-22 23:39:15:       ]
    2018-05-22 23:39:15:   }
    2018-05-22 23:39:15: [volume-group-1]2018/05/22 23:39:15 lvm.go:666: stderr:
    2018-05-22 23:39:15: [volume-group-1]2018/05/22 23:39:15 server.go:690: BytesFree: 1132462080
    2018-05-22 23:39:15: [volume-group-1]2018/05/22 23:39:15 logging.go:30: Served /csi.v0.Controller/GetCapacity: resp=available_capacity:1132462080
    ```

1.  Create a volume profile `fast` for mount volumes that will match the created
    `lvm` volume provider. We want volumes that have profile `fast` to be
    formatted with the `xfs` filesystem. The filesystem is specified in the
    `spec.mount.filesystem` field in the profile configuration, as shown below:

    ```bash
    cat > fast.json <<EOF
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
            "mount": {
                "filesystem": "xfs"
            }
        }
    }
    EOF
    dcos storage profile create fast.json
    ```

    Once the volume is created you can view the new profile using the `list`
    command.

    ```bash
    dcos storage profile list
    ```
    ```
    TYPE  NAME  STATUS
    lvm   fast  ACTIVE
    ```

## Launch a Marathon application that uses a local volume

1.  Create a 50MiB volume named `my-volume-1` of profile `fast`.

    ```bash
    dcos storage volume create --name my-volume-1 --capacity 50M --profile fast
    ```

    If the creation is successful, you can view the new volume using the `list` command.

    ```bash
    dcos storage volume list
    ```
    ```
    NODE                                     NAME         SIZE  STATUS
    ca626e4a-e3cb-4613-b7dd-618cfc19bee1-S0  my-volume-1  50M   ONLINE
    ```

1.  Launch a Marathon app that specifies a 50MiB persistent volume with profile
    `fast`. Marathon will use the `container.volumes` section of our application
    configuration to find our new volume: size is 50MiB and `profileName` is
    `fast`. Additionally, setting `type` to `mount` tells Marathon that we would
    like the volume to be pre-formatted with a filesystem and appear as a
    mountpoint to our application, setting `mode` to `RW` means the volume can
    be read to and written from by our application, and setting `containerPath`
    to `data` means that our volume will be mounted at `./data`. If we create
    this application we will see that it shortly transitions to `Running`
    status.

    ```bash
    cat > app1.json <<EOF
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
              "size": 50,
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
    dcos marathon app add app1.json
    ```
    ```
    Created deployment 443c18b5-3248-4f65-a0d5-347f355cd50a
    ```

1.  Launch another Marathon app requesting a 100MiB persistent volume with
    profile `fast`.  Since there is no such volume available, the app will be
    created but its status will remain in `Deploying` state.

    ```bash
    cat > app2.json <<EOF
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
              "size": 100,
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
    dcos marathon app add app2.json
    ```
    ```
    Created deployment dd879d0c-d574-4565-a126-d06bc0f29110
    ```

1.  Create a 100MiB volume named `my-volume-2` of profile `fast`. Once the
    volume is created, the above Marathon app will change to `Running` state.

    ```bash
    dcos storage volume create --name my-volume-2 --capacity 100M --profile fast
    ```

1.  Assume that the first Marathon app `/app-persistent-stable-good-profile` is
    no longer needed. Remove the marathon app using the following command.

    ```bash
    dcos marathon app remove /app-persistent-stable-good-profile
    ```

1.  Assume that the volume `my-volume-1` is no longer needed. The operator can
    delete the volume using the following command.

    ```bash
    dcos storage volume my-volume-1
    ```

    The operator can validate that the volume has been removed using the `list`
    command. The volume is no longer present.

    ```bash
    dcos storage volume list
    ```
    ```
    NODE                                     NAME         SIZE  STATUS
    ca626e4a-e3cb-4613-b7dd-618cfc19bee1-S0  my-volume-2  100M  ONLINE
    ```

1.  If a volume is still in-use, it cannot be removed. For instance, trying to
    remove volume `my-volume-2` which is currently used by
    `/app-persistent-stable-good-profile-2` will result in a timeout.

    ```bash
    dcos storage volume remove --name my-volume-2
    ```
    ```
    Error: The operation has timed out. The last reported status was: Collecting appropriate disk offers
    ...
    ```

    The current status of the volume will become `REMOVING`.

    ```bash
    dcos storage volume list
    ```
    ```
    NODE                                     NAME         SIZE  STATUS
    ca626e4a-e3cb-4613-b7dd-618cfc19bee1-S0  my-volume-2  100M  REMOVING
    ```

1.  Once we remove the Marathon app that is using `my-volume-2`, i.e., the one
    with ID `/app-persistent-stable-good-profile-2`, the volume will be
    automatically removed.

    ```bash
    dcos marathon app remove /app-persistent-stable-good-profile-2
    ```

    Since the volume `my-volume-2` is no longer used by any app, it will be
    removed shortly. You can validate that by using the `list` command and
    confirming that the volume is no longer listed.

    ```bash
    dcos storage volume list
    ```
    ```
    NODE                                     NAME         SIZE  STATUS
    ```

1.  A volume provider can be removed once all volumes from that provider are
    removed.

    ```bash
    dcos storage provider remove --name volume-group-1
    dcos storage provider list
    ```
    ```
    PLUGIN  NAME  NODE  STATE
    ```

## Modifying the devices underlying a `lvm` volume provider

If the list of physical devices (PVs) that comprise a `lvm` volume provider
changes, you need to modify the volume provider's configuration accordingly.

In the [Getting Started](#getting-started) section we created the
`volume-group-1` volume provider. We used the following provider
configuration:

```bash
cat > volume-group-1.json <<EOF
{
    "name": "volume-group-1",
    "description": "The primary volume group",
    "spec": {
        "plugin": {
            "name": "lvm",
            "config-version": "latest"
        },
        "node": "ca626e4a-e3cb-4613-b7dd-618cfc19bee1-S0",
        "plugin-configuration": {
            "devices": ["xvda4", "xvda7"]
        },
        "labels": {"rotational": "false"}
    }
}
EOF
```

After we've created several volumes, we realize that we need to add additional
storage to the provider. We do that by expanding the underlying LVM volume
group by adding an additional PV.

1.  First we SSH to the node on which our `volume-group-1` volume provider is
    created. From the volume provider configuration we see that the `spec.node`
    field is set to `ca626e4a-e3cb-4613-b7dd-618cfc19bee1-S0`. On the machine
    where the DC/OS CLI is installed and configured, presumably your local
    workstation, execute the following command to SSH into the node. The command
    below assumes that you want to log in as the `centos` user. If you are
    running on CoreOS, this might be `--user=core` instead.

    ```bash
    dcos node ssh --master-proxy --mesos-id=ca626e4a-e3cb-4613-b7dd-618cfc19bee1-S0 --user=centos
    ```

1.  Escalate to `root` user and activate the DC/OS environment. This command
    sets various environment variables such as PATH and `LD_LIBRARY_PATH` and
    simplifies operation of DC/OS from the shell. We need to perform commands as
    the `root` user since we will be modifying LVM physical volumes (PVs) and
    volume groups (VGs).

    ```bash
    sudo /opt/mesosphere/bin/dcos-shell
    ```

1.  List PVs. We're looking for xvda4 and xvda7.

    ```bash
    pvs
    ```
    ```
    PV          VG                      Fmt  Attr PSize   PFree
    /dev/xvda4  g3i08qQP6NXirbYZpqVNGJx lvm2 a--   <3.00g  <3.00g
    /dev/xvda7  g3i08qQP6NXirbYZpqVNGJx lvm2 a--   <3.00g  <3.00g
    ```

    We can see that the two PVs form the volume group (VG) called
    `g3i08qQP6NXirbYZpqVNGJx`. This is the DSS-internal low-level name of the
    LVM volume group (VG) that corresponds to our `volume-group-1` volume
    provider.

1.  Next, we add an additional device to this volume group. We'll add `xvda9` to
    the volume group.

1.  First, we turn the `/dev/xvda9` device into a LVM physical volume (PV)
    using the `pvcreate` command-line utility.

    ```bash
    pvcreate /dev/xvda9
    ```

1.  Next, we add the new `xvda9` physical volume to the `g3i08qQP6NXirbYZpqVNGJx` volume group.

    ```bash
    vgextend g3i08qQP6NXirbYZpqVNGJx /dev/xvda9
    ```

    <p class="message--warning"><strong>WARNING: </strong>the following steps will result in any existing data on `xvda9` being corrupted / destroyed.</p>

1.  We check that the volume group now includes the new device.

    ```bash
    pvs
    ```
    ```
    PV          VG                      Fmt  Attr PSize   PFree
    /dev/xvda4  g3i08qQP6NXirbYZpqVNGJx lvm2 a--   <3.00g  <3.00g
    /dev/xvda7  g3i08qQP6NXirbYZpqVNGJx lvm2 a--   <3.00g  <3.00g
    /dev/xvda9  g3i08qQP6NXirbYZpqVNGJx lvm2 a--   <3.00g  <3.00g
    ```

    The list of pvs now shows that `xvda9` forms part of the
    `g3i08qQP6NXirbYZpqVNGJx` volume group.

1.  Now that the underlying volume group has been extended with a third device,
    we need to inform DSS about that. This is done by modifying the
    `volume-group-1` volume provider. From wherever the CLI is installed, e.g.,
    where the "Getting Started" steps were executed, execute the following
    command:

    ```bash
    cat > volume-group-1.json.2 <<EOF
    {
        "name": "volume-group-1",
        "spec": {
            "plugin-configuration": {
                "devices": ["xvda4", "xvda7", "xvda9"]
            }
        }
    }
    EOF
    dcos storage provider modify volume-group-1.json.2
    ```

The `volume-group-1` volume provider configuration now correctly matches the
three LVM physical volumes that form part of its LVM volume group.


## Upgrading providers to a new version

When you create a new provider the `spec.plugin.name` field specifies the name
of the plugin configuration to use and the `spec.plugin.config-version` field
specifies which version of that plugin configuration to use.

When DSS first starts, it registers default plugin configurations for both the
`devices` and the `lvm` CSI plugins. However, when you upgrade DSS it does not
automatically register its default plugin configurations again, otherwise it
would overwrite any changes you made since first installing DSS. To register
the new default plugin configurations you need to execute the following
commands.

1.  Register the default `lvm` plugin configuration as the latest version.

    ```bash
    dcos storage plugin-configuration generate --name=lvm | \
        dcos storage plugin-configuration update
    ```

1.  Register the default `devices` plugin configuration as the latest version.

    ```bash
    dcos storage plugin-configuration generate --name=devices | \
        dcos storage plugin-configuration update
    ```

These commands use the `dcos storage plugin-configuration generate` command to
print the default plugin configuration that is baked into DSS, then passes the
output to `dcos storage plugin-configuration update`, which stores a new
version of the plugin configuration.

It is also possible to update plugin configurations manually by generating the
default plugin configuration, modifying it by hand, then passing the result to
`dcos storage plugin-configuration update` again. The following example
illustrates this workflow.

1.  Print the default `lvm` plugin configuration that ships with the installed
    version of DSS.

    ```bash
    dcos storage plugin-configuration generate --name=lvm
    ```
    ```
    {
        "name": "lvm",
        "description": "Default configuration for the lvm plugin shipped with DSS",
        "spec": {
            "csi-template": {
                "services": [
                    "CONTROLLER_SERVICE",
                    "NODE_SERVICE"
                ],
                "command": {
                    "value": "{{.Cmdline | json }}",
                    "shell": true,
                    "environment": {
                        "CONTAINER_LOGGER_DESTINATION_TYPE": "journald+logrotate",
                        "CONTAINER_LOGGER_EXTRA_LABELS": "{\"CSI_PLUGIN\":\"csilvm\"}",
                        "LD_LIBRARY_PATH": "/opt/mesosphere/lib",
                        "PATH": "/opt/mesosphere/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
                    },
                    "uris": [
                        {
                            "value": "https://s3.amazonaws.com/dcos-storage-artifacts/dss/build/tag/snapshot-20190417162545-f8266ecb/universe/csilvm",
                            "cache": true,
                            "executable": true,
                            "extract": true
                        }
                    ]
                },
                "resources": [
                    {
                        "name": "cpus",
                        "value": 0.1
                    },
                    {
                        "name": "mem",
                        "value": 128
                    },
                    {
                        "name": "disk",
                        "value": 10
                    }
                ]
            }
        }
    }
    ```

1.  We can see that by default every `lvm` volume provider is backed by a single
    [CSILVM plugin](https://github.com/mesosphere/csilvm) instance. We see that
    every instance is allocated some resources: 128MiB of memory, 0.1 CPUs, and
    10MiB of disk space.

    Imagine that after installing the plugin we find that we would like to
    increase the CPU resources available to the CSI plugin instance from 0.1 CPU
    to 2.0 CPUs. We do that by updating the `lvm` plugin configuration and then
    modifying our `lvm` volume providers to use the latest `lvm` plugin
    configuration version.

    First, we store the default `lvm` plugin configuration to a file so we can
    edit it.

    ```bash
    dcos storage plugin-configuration generate --name=lvm > lvm-plugin-configuration.json
    ```

1.  Next, we edit the plugin configuration in the
    `lvm-plugin-configuration.json` file as follows (where we have used ellipses
    '...' to indicate that sections from the default plugin configuration should
    be used without modification):

    ```bash
    cat lvm-plugin-configuration.json
    ```
    ```
    {
        "name": "lvm",
        "description": "Increased memory configuration for the lvm plugin.",
        "spec": {
            "csi-template": {
                ...
                "resources": [
                    ...
                    {
                        "name": "cpu",
                        "value": 2
                    },
                    ...
                ]
            }
        }
    }
    ```

1.  We update the `lvm` plugin configuration using the modified file:

    ```bash
    dcos storage plugin-configuration update lvm-plugin-configuration.json
    ```
    ```
    {
        "config-version": 2
    }
    ```

1.  We are now ready to modify the `volume-group-1` volume provider to use the
    updated `lvm` plugin configuration. We do that by modifying its
    `spec.plugin.config-version`. We have the option of either setting the
    provider's `config-version` field to the `config-version` of our updated
    plugin configuration (i.e., `2` as is shown in the output of the `update`
    command issued in the previous step) or we can set it to `"latest"`. Since
    we are sure we want to upgrade the provider to the latest plugin
    configuration we use `"latest"`.

    ```bash
    cat > volume-group-1.json.2 <<EOF
    {
        "name": "volume-group-1",
        "spec": {
            "plugin": {
                "config-version": "latest"
            }
        }
    }
    EOF
    dcos storage provider modify volume-group-1.json.2
    ```

    Here we tell DSS to modify the `volume-group-1` provider so it uses the
    latest version of the `lvm` plugin configuration.

The `provider modify` command restarts the [CSILVM
plugin](https://github.com/mesosphere/csilvm) instance, this time with 2 CPUs
instead of 0.1 CPU.

## Uninstalling

The storage service can be uninstalled at any time.  Uninstalling it will not
affect the volume providers, profiles and volumes that are currently being
used.

See the [uninstall](../../uninstall/) section.

The storage service can be re-installed later.

```bash
dcos package install storage
```
```
By Deploying, you agree to the Terms and Conditions https://mesosphere.com/catalog-terms-conditions/#community-services

DC/OS Storage Service only works on DC/OS Enterprise.

Continue installing? [yes/no] yes
Installing Marathon app for package [storage] version [v1.0.0]
Installing CLI subcommand for package [storage] version [v1.0.0]
New command available: dcos storage
```

It will automatically recover the previous state.

```bash
dcos storage profile list
```
```
TYPE  NAME  STATUS
lvm   fast  ACTIVE
```
