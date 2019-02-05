---
layout: layout.pug
navigationTitle:  Replace a master node
title: Replace a master node
menuWeight: 800
excerpt: Replacing a master node in an existing DC/OS cluster

enterprise: true
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-docs-site -->


You can replace a master node in an existing DC/OS cluster. Only one master should be replaced at a time.

## Remove the existing master

To begin, shut down the master node you want to replace.

## Add the new master

The procedure for adding the new master node to replace the one taken offline in the previous step is quite simple.

### `master_discovery: static`

If you have configured static master discovery in your `config.yaml` (for example, `master_discovery: static`), then the new server must have the same internal IP address as the old server. Once you have verified that the new server has the same internal IP address as the old server, and the old server is completely unreachable from the cluster, you can proceed to install the new master as you would normally.

### `master_discovery: master_http_loadbalancer`

If you have configured dynamic master discovery in your config.yaml (for example, `master_discovery: master_http_loadbalancer`), then  install the new master as you would normally.

## Confirm that the new master is healthy

To confirm that the new master has joined the cluster successfully, you must validate that the procedure was successful before proceeding. The procedure is identical to the verification performed following a master node upgrade.

The exact steps are listed under 'Validate the upgrade' in the [Upgrading a master](/1.13/installing/production/upgrading/#dcos-masters) section in the [Upgrading documentation](/1.13/installing/production/upgrading/).
