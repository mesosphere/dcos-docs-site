---
layout: layout.pug
navigationTitle: Upgrades
title: Upgrades
menuWeight: 35
excerpt:
---

# Manually upgrade the DSS package to v0.2.0 from v0.1.0

* [Uninstall](../uninstall/) the currently installed DSS package and package repository.
* Remove volume, volume providers, and related assets from Zookeeper.
* Remove DSS-created volumes and volume providers from all agents in the cluster.
* [Install](../install/) the latest release of DSS.
