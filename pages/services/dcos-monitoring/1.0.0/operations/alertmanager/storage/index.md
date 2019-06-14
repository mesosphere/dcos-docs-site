---
layout: layout.pug
navigationTitle: Alertmanager Storage
title: Alertmanager Storage
menuWeight: 20
excerpt: Alertmanager Storage
render: mustache
model: ../../../data.yml
---

# Configuring Alertmanager Storage

## DSS Volume

You can configure Alertmanager to use a dedicated volume provided by the [DC/OS Storage Service](https://docs.mesosphere.com/services/beta-storage/0.5.3-beta/) (DSS).

At least one volume must be available for Alertmanager to use.
For more information on creating volumes, see the [DC/OS Storage Service](https://docs.mesosphere.com/services/beta-storage/0.5.3-beta/cli-references/dcos-storage-volume/dcos-storage-volume-create) documentation.

When configuring Alertmanager, select `MOUNT` for its volume `type`, choose the minimum `size` for the volume in MB, and enter the `profile` for the volume.
For more information on volume profiles, see the [DC/OS Storage Service](https://docs.mesosphere.com/services/beta-storage/0.5.3-beta/cli-references/dcos-storage-profile/) documentation.

The following configuration will deploy Alertmanager to a volume with a profile of `fast` that is 512 MB or larger.
If there is no such volume available, Alertmanager will fail to deploy.

```json
{
  "alertmanager": {
    "data_volume": {
      "type": "MOUNT",
      "size": 512,
      "profile": "fast"
    }
  }
}
```

![Alertmanager DSS GUI example](../../../img/alertmanager-dss-gui.png)
