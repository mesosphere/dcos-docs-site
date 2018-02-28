---
layout: layout.pug
navigationTitle: Volume Plugins
title: Volume Plugins
menuWeight: 35
excerpt:
---

# Volume Plugins

The Container Storage Interface (CSI) is an open specification developed by various container orchestrators through interaction with the open source community and storage vendors. Different CSI plugins expose CSI-compliant APIs on top of existing storage solutions such as those provided by storage vendors (e.g., Amazon EBS) and technologies like LVM2. 

In order, to provide a smooth configuration experience with DC/OS every CSI plugin you want to use, requires a small bit of plugin-specific config code to be loaded by the DSS. This code combined with the CSI plugin itself, is called a Volume Plugin. In future, we hope to bundle a generic one with the DSS so any CSI plugin can be used.

All volume providers share some common configuration options. However, the plugin-configuration section of a volume provider’s configuration is specific to the volume provider’s plugin. Every volume plugin will have its own set of options that may be configured in the plugin-configuration subsection of the volume provider’s configuration. In the next section we list the configuration options for the various volume plugins. For now this list consists of the LVM plugin, only.

## LVM

The LVM volume plugin integrates the <a href ="https://github.com/mesosphere/csilvm">LVM2 CSI plugin </a> with DC/OS. When you create a new volume provider you can specify the ‘plugin’ field as ‘lvm’ in order to create a volume provider whose storage is backed by LVM2. Such a volume provider is called a ‘lvm’ volume provider.

As LVM2 runs on a single machine the “node” configuration item of the volume provider MUST be set the the Mesos agent ID of the server on which the volume provider should be created on. This means that lvm volume providers are local volume providers.

The LVM plugin admits a single configuration option in the plugin-configuration section of a volume provider’s configuration:

*devices*
An array of device names relative to the Linux /dev directory. These devices must be present on the node that the provider is configured on. They must not contain a leading slash.

An example for volume provider configuration:

1. The *spec.plugin* field is set to ‘lvm’.
2. The *node* field is set to the ID of the Mesos agent running on the server.
3. The *plugin-configuration* field specifies the plugin-specific configuration given in this section. In this case the devices field declares that the */dev/xvdb* and */dev/xvdc* devices on the server corresponding to *node* should form part of a LVM2 volume group called ‘volume-group-1’.


```json
{
    "name": "volume-group-1",
    "description": "SSD for database access",
    "spec": {
        "plugin": "lvm",
        "node": "2aada917-0ba0-4041-bb1e-4f16a57cd1a0-S0",
        "plugin-configuration": {
            "devices": ["xvdb", "xvdc"]
        }
        "labels": {"rotational": "false"}
    }
}
```
