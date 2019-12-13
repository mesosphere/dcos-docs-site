---
layout: layout.pug
navigationTitle:  Updating the GUI
title: Updating the GUI
menuWeight: 90
excerpt: DCOS GUI Update Service 
enterprise: true
render: mustache
model: /mesosphere/dcos/2.0/data.yml
---

The DC/OS GUI Update Service updates the current version of the DC/OS GUI using new versions published to the {{ model.packageRepo }}. This service allows you to update your GUI without having to update your version of DC/OS.

The DC/OS GUI Update Service is a component that runs on all DC/OS master nodes.

# Usage

You can update  the current version of the DC/OS GUI by making a POST request to the update endpoint `/dcos-ui-update-service/api/v1/update/<version>/` The provided version resides on one of the {{ model.packageRepo }} repositories available to the cluster. You can find the available package versions by requesting the Cosmos API `/package/list-versions/` endpoint for the `dcos-ui` package. 

# Latency

When processing an update request, the master that receives the API call will download the package, extract its contents and start serving the new version. If the cluster has multiple masters, then the DC/OS GUI update will be eventually consistent. 

After the update API request is successfully processed there is a lag between the completion of the API call and completion of the update by all masters. Because of this latency, the DC/OS GUI may be unavailable until every master has completed its update, and each master is serving the new DC/OS GUI version. The same is true when the DC/OS GUI version is reset to the default version.

## Resources

[swagger api='/mesosphere/dcos/2.0/api/endpoints.yaml']
