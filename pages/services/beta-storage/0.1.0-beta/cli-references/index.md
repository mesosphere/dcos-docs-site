---
layout: layout.pug
navigationTitle: CLI References
title: CLI References
menuWeight: 60
excerpt:
---

This section is a reference for all CLI commands available in the DSS package that manage devices, volumes, volume profiles and volume providers.

You must configure a volume provider and a volume profile before creating a volume.
A volume provider manages storage capacity offered by a CSI plugin to the DC/OS cluster through a DC/OS Storage plugin.
A DC/OS Storage plugin consists of a CSI plugin along with some code that integrates it into DC/OS.
A volume provider that specifies its plugin as "lvm" is referred to as an "lvm" volume provider.

A volume profile represents volume configurations based on volume provider, volume parameters, and/or labels.
For example, if you want to differentiate between HDDs and SSDs for different purposes, you can create a `fast` volume profile that identifies your SSDs and a `slow` volume profile that identifies your HDDs.
If your framework is Cassandra, then it distinguishes between "cache" and "archive" storage.
You can then configure it to map your `fast` volume profile to Cassandra’s "cache" storage and your `slow` volume profile to Cassandra's "archive" storage.

Once you have configured a volume provider (e.g., an LVM2 volume group) and a volume profile (e.g., `all-ssds`) you use the `dcos storage volume ...` sub-command to create and manage volumes.

| Command                                           | Description              |
|---------------------------------------------------|--------------------------|
| [dcos storage device](./dcos-storage-device/)     | Manage physical devices. |
| [dcos storage provider](./dcos-storage-provider/) | Manage volume providers. |
| [dcos storage profile](./dcos-storage-profile/)   | Manage volume profiles.  |
| [dcos storage volume](./dcos-storage-volume/)     | Manage volumes.          |
