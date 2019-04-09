---
layout: layout.pug
navigationTitle: Volume Plugins
title: Volume Plugins
menuWeight: 35
excerpt: Learn how the DC/OS Storage Service integrates with CSI plugins in order to support multiple storage provisioning back-ends
enterprise: true
beta: true
---
#include /services/include/beta-software-warning.tmpl

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
When you create a new volume provider you can specify the `plugin` field as `devices` in order to create a volume provider that will expose RAW block devices from a node.

The `node` configuration item of the volume provider **must** be set to the Mesos agent ID of the server on which the volume provider should be created. This means that `devices` volume providers are local volume providers.

The Devices plugin admits a single configuration option in the plugin-configuration section of a volume provider's configuration:

## `blacklist`

Device blacklist glob for device names that the plugin should not advertise. Please refer to this [link](https://github.com/gobwas/glob) for syntax.

The device name should be relative to the Linux `/dev` directory. It must not contain a leading slash.

## Example

1. The `spec.plugin` field is set to `devices`.
1. The `node` field is set to the ID of the Mesos agent running on the server.
3. The `plugin-configuration` field specifies the plugin-specific configuration given in this section.
In this case the `blacklist` field declares that all loopback devices should not be advertised.

```json
{
    "name": "devices-provider",
    "description": "Expose devices on a node",
    "spec": {
        "plugin": "devices",
        "node": "2aada917-0ba0-4041-bb1e-4f16a57cd1a0-S0",
        "plugin-configuration": {
            "blacklist": "loop[0-9]"
        }
    }
}
```

# LVM

The LVM volume plugin integrates the [LVM2 CSI plugin with DC/OS](https://github.com/mesosphere/csilvm).
When you create a new volume provider you can specify the `plugin` field as `lvm` in order to create a volume provider whose storage is backed by LVM2. Such a volume provider is called an "lvm" volume provider.

As LVM2 runs on a single machine, the `node` configuration item of the volume provider **must** be set to the Mesos agent ID of the server on which the volume provider should be created on. This means that "lvm" volume providers are local volume providers.

## Provider configuration

The LVM plugin admits a single configuration option in the `plugin-configuration` section of a volume provider's configuration:

### `devices`

An array of device names relative to the Linux `/dev` directory. These devices **must** be present on the node that the provider is configured on. They must not contain a leading slash.

### Example

1. The `spec.plugin` field is set to `lvm`.
2. The `node` field is set to the ID of the Mesos agent running on the server.
3. The `plugin-configuration` field specifies the plugin-specific configuration given in this section.
In this case the devices field declares that the `/dev/xvdb` and `/dev/xvdc` devices on the server corresponding to `node` should form part of a LVM2 volume group called `volume-group-1`.

```json
{
    "name": "volume-group-1",
    "description": "SSD for database access",
    "spec": {
        "plugin": "lvm",
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
