---
layout: layout.pug
navigationTitle: Updating the GUI
title: Updating the GUI
menuWeight: 90
excerpt: DCOS GUI Update Service 
enterprise: true
render: mustache
model: /mesosphere/dcos/2.0/data.yml
---

The DC/OS GUI Update Service updates the current version of the DC/OS GUI using new versions published to the {{ model.packageRepo }}. This service allows you to update your GUI without needing to update DC/OS itself.

The DC/OS GUI Update Service is a component that runs on all DC/OS master nodes. When you update the DC/OS GUI on one master node, the other master nodes are automatically updated.

# Prerequisites
Before you can update the GUI you must ensure the new GUI's DC/OS package is available to the cluster. You can do that by ensuring the [DC/OS Catalog (Universe)](/mesosphere/dcos/2.0/gui/catalog/) is configured and accessible:

![ui-package-repos](/mesosphere/dcos/2.0/img/ui-package-repos.png)

Alternatively, air gapped clusters without access to the DC/OS Catalog can use [Package Registry](/mesosphere/dcos/2.0/administering-clusters/package-registry/). Download the latest dcos-ui package matching your version of DC/OS from [the Catalog package list](https://downloads.mesosphere.com/universe/packages/packages.html) and upload it to the cluster's Package Registry before continuing.


# Updating the GUI via the GUI

To update the DC/OS GUI, log into the GUI as a user with superuser privileges. Navigate to "Settings" then "UI Settings". Note your currently installed version. The GUI will search for the new package and show if an update is available:

![gui-update-available](/mesosphere/dcos/2.0/img/ui-update-available.png)

Select `Start Update` and wait a few minutes until a notice is shown indicating the new GUI is available:

![ui-update-reload](/mesosphere/dcos/2.0/img/ui-update-reload.png)

Select `Reload` and verify the GUI now reports the new version as its installed version.


# Updating the GUI via the API 

You can update the current version of the DC/OS GUI by making a POST request to the update endpoint `/dcos-ui-update-service/api/v1/update/<version>/` The provided version resides on one of the {{ model.packageRepo }} repositories available to the cluster. You can find the available package versions by requesting the Cosmos API `/package/list-versions/` endpoint for the `dcos-ui` package. 

[swagger api='/mesosphere/dcos/2.0/api/endpoints.yaml']


# Latency

When processing an update request, the master that receives the API call will download the package, extract its contents and start serving the new version. If the cluster has multiple masters, then the DC/OS GUI update will be eventually consistent. 

After the update API request is successfully processed there is a lag between the completion of the API call and completion of the update by all masters. Because of this latency, the DC/OS GUI may be unavailable until every master has completed its update, and each master is serving the new DC/OS GUI version. The same is true when the DC/OS GUI version is reset to the default version.

