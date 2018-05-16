---
layout: layout.pug
navigationTitle:
title: Upgrade
menuWeight: 120
excerpt: Understanding Apache ZooKeeper upgrades and rollbacks
featureMaturity:
enterprise: false
---

<!-- https://github.com/mesosphere/dcos-zookeeper/ -->


# Overview
We support upgrade/rollback between adjacent versions only. Concretely, to upgrade from version 2 to version 4, you must upgrade from 2 -> 3, then from 3 -> 4.
