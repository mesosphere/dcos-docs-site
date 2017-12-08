---
layout: layout.pug
navigationTitle:  Known Issues
title: Known Issues
menuWeight: 100
excerpt:
featureMaturity:
enterprise: false
---

<!-- This source repo for this topic is https://github.com/mesosphere/dse-private -->


- OpsCenter pod requires a single restart after initial deployment of your DSE package service by running the following command:
  ```
  $dcos dse --name=<service name>  pods restart opscenter-0
  ```
