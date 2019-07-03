---
layout: layout.pug
origin: github.com/mesosphere/dcos-storage/docs/volume-plugins/index.md
navigationTitle: Volume Plugins
title: Volume Plugins
menuWeight: 35
excerpt: Learn how the DC/OS Storage Service integrates with CSI plugins in order to support multiple storage provisioning back-ends
enterprise: true
---

The Container Storage Interface (CSI) is an open specification developed by multiple container orchestrators through interaction with the open source community and storage vendors.
Different CSI plugins expose CSI-compliant APIs on top of existing storage solutions, such as those provided by storage vendors (such as Amazon EBS), and technologies like LVM2.

Currently, DSS incorporates some amount of plugin-specific code in order to achieve a seamless user experience with CSI-backed storage on DC/OS.
This code, combined with the CSI plugin itself, is called a **Volume Plugin**.
The long term vision is that DSS will not require such plugin-specific code, and will natively integrate with any CSI plugin without additional coding effort.

All volume providers share some common configuration options.
However, the plugin-configuration section of a volume provider's configuration is specific to the volume provider's plugin.
Every volume plugin will have its own set of options that may be configured in the plugin-configuration subsection of the volume provider's configuration.
In the next section we list the configuration options for the various volume plugins.
For now this list consists of the LVM plugin, only.

# Devices

The Devices volume plugin integrates the [Devices CSI Plugin with DC/OS](https://github.com/mesosphere/csidevices).
When you create a new volume provider you can specify the `plugin.name` field as `devices` in order to create a volume provider that will expose RAW block devices from a node.

The `node` configuration item of the volume provider **must** be set to the Mesos agent ID of the server on which the volume provider should be created. This means that `devices` volume providers are local volume providers.

The Devices plugin admits a single configuration option in the `plugin-configuration` section of a volume provider's configuration:

## `blacklist`

Device blacklist glob for device names that the plugin should not advertise. Please refer to this [link](https://github.com/gobwas/glob) for syntax.

The device name should be relative to the Linux `/dev` directory. It must not contain a leading slash.

### Example blacklists

1. `xvdb`: blacklist a single device.
1. `xvd[ac]`: blacklist two devices whose names share a prefix.
1. `xvd[a-c]`: blacklist a range of contiguous devices.
1. `{xvda,xvdb,loop0}`: blacklist two devices `/dev/xvda`, `/dev/xvdb` as well as the `/dev/loop0` device.
1. `loop[0-9]*`: blacklist all devices whose names start with `loop` followed by one or more digits. This blacklists all `loop` devices.
1. `{sd[a-b],xvd[a-z]}`: blacklist two contiguous ranges of devices.
1. `{sda,xvd[a-z]}`: blacklist an individual device as well as a contiguous range of devices.
1. `{sda,xvd[a-z],*-csilv*}`: blacklist an individual device as well as a contiguous range of devices.
1. `*-csilv*`: blacklist LVM volumes created by DSS

## `blacklist-exactly`

By default, the descendants of blacklisted devices are also considered
blacklisted. For example, if `xvdb` is blacklisted, then its child partitions
`xvdb1` and `xvdb2` are also considered blacklisted.

This behaviour can be disabled by setting `"blacklist-exactly": true` when
configuring a devices provider. If it is set to `true`, the child partitions
`xvdb1` and `xvdb2` will be displayed even if the `xvdb` device is blacklisted.

Valid values are `true` and `false`. This option defaults to `false`.

## Examples

### Create a devices provider with blacklisted loop devices

1. The `spec.plugin.name` field is set to `devices`.
1. The `node` field is set to the ID of the Mesos agent running on the server.
1. The `plugin-configuration` field specifies the plugin-specific configuration given in this section.
In this case the `blacklist` field declares that all loopback devices should not be advertised.

```json
{
    "name": "devices-provider",
    "description": "Expose devices on a node",
    "spec": {
        "plugin": {
            "name": "devices",
            "config-version": "latest"
        },
        "node": "2aada917-0ba0-4041-bb1e-4f16a57cd1a0-S0",
        "plugin-configuration": {
            "blacklist": "loop[0-9]"
        }
    }
}
```

Create the devices provider by passing the JSON to the `dcos storage provider create` command:

```bash
cat <<EOF | dcos storage provider create
{
    "name": "devices-provider",
    "description": "Expose devices on a node",
    "spec": {
        "plugin": {
            "name": "devices",
            "config-version": "latest"
        },
        "node": "2aada917-0ba0-4041-bb1e-4f16a57cd1a0-S0",
        "plugin-configuration": {
            "blacklist": "loop[0-9]"
        }
    }
}
EOF
```

### Change the blacklist of an existing devices provider

<p class="message--warning"><strong>WARNING:</strong> Be careful when modifying the blacklist of an existing devices provider. Be sure that the new blacklist does not match a device that is currently in use by any LVM providers.</p>

1. The `spec.plugin.name` field is set to `devices`.
1. The `node` field is set to the ID of the Mesos agent running on the server.
1. The `plugin-configuration` field specifies the plugin-specific configuration given in this section.
In this case the `blacklist` field declares that the `xvda` and `xvdb` devices should not be advertised.

```json
{
    "name": "devices-provider",
    "description": "Expose devices on a node",
    "spec": {
        "plugin": {
            "name": "devices",
            "config-version": "latest"
        },
        "node": "2aada917-0ba0-4041-bb1e-4f16a57cd1a0-S0",
        "plugin-configuration": {
            "blacklist": "{xvda,xvdb}"
        }
    }
}
```

Create the devices provider by passing the JSON to the `dcos storage provider create` command:

```bash
cat <<EOF | dcos storage provider create
{
    "name": "devices-provider",
    "description": "Expose devices on a node",
    "spec": {
        "plugin": {
            "name": "devices",
            "config-version": "latest"
        },
        "node": "2aada917-0ba0-4041-bb1e-4f16a57cd1a0-S0",
        "plugin-configuration": {
            "blacklist": "{xvda,xvdb}"
        }
    }
}
EOF
```

Now, we want to modify the provider's blacklist so `xvdb` will be advertised. We use the `dcos storage provider modify` command to modify the provider.

```bash
cat <<EOF | dcos storage provider modify
{
    "name": "devices-provider",
    "spec": {
        "plugin-configuration": {
            "blacklist": "xvda"
        }
    }
}
EOF
```

# LVM

The LVM volume plugin integrates the [LVM CSI plugin with DC/OS](https://github.com/mesosphere/csilvm).
When you create a new volume provider you can specify the `plugin.name` field as `lvm` in order to create a volume provider whose storage is backed by LVM. Such a volume provider is called an `lvm` volume provider.

As LVM2 runs on a single machine, the `node` configuration item of the volume provider **must** be set to the Mesos agent ID of the server on which the volume provider should be created on. This means that `lvm` volume providers are local volume providers.

## Provider configuration

The LVM plugin admits a single configuration option in the `plugin-configuration` section of a volume provider's configuration:

### `devices`

An array of device names relative to the Linux `/dev` directory. These devices **must** be present on the node that the provider is configured on. They must not contain a leading slash.

### Example

1. The `spec.plugin.name` field is set to `lvm`.
2. The `node` field is set to the ID of the Mesos agent running on the server.
3. The `plugin-configuration` field specifies the plugin-specific configuration given in this section.
In this case the devices field declares that the `/dev/xvdb` and `/dev/xvdc` devices on the server corresponding to `node` should form part of a LVM2 volume group called `volume-group-1`.

```json
{
    "name": "volume-group-1",
    "description": "SSD for database access",
    "spec": {
        "plugin": {
            "name": "lvm",
            "config-version": "latest"
        },
        "node": "2aada917-0ba0-4041-bb1e-4f16a57cd1a0-S0",
        "plugin-configuration": {
            "devices": ["xvdb", "xvdc"]
        },
        "labels": {"rotational": "false"}
    }
}
```

## Volume configuration

This plugin supports two configuration items that can be specified in the `volume-configuration` section of a volume profile. In each case, the value must be a string. All volumes that are created with that volume profile will share the `volume-configuration`.

### `type`

Maps to the `--type=` option passed to `lvcreate`. You can set this parameter to `linear` or `raid1`. The default value is `linear`.

See `man lvmraid` for more information on `--type`.

### `mirrors`

Maps to the `--mirrors=` option passed to `lvcreate`. This configuration items can only be specified if `type` is set to `raid1`. If specified, this value must be an integer larger than zero (specified as a string). The default value is 1.

See `man lvmraid` for more information on `--mirrors`.

### Example Volume Profile

1. The `spec.provider-selector.plugin` field is set to `lvm`.
2. The `spec.volume-configuration` field specifies the plugin-specific configuration given in this section.

```json
{
    "name": "safe",
    "description": "RAID-1 volumes.",
    "spec": {
        "provider-selector": {
            "plugin": "lvm"
        },
        "mount": {"filesystem": "xfs"},
        "volume-configuration": {
            "type": "raid1",
            "mirrors": "2"
        }
    }
}
```
