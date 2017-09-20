---
layout: layout.pug
title: Service Management with Marathon
menuWeight: 15
excerpt:
featureMaturity:
enterprise: false
navigationTitle:  Service Management with Marathon
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->


DC/OS uses Marathon to manage processes and services and is the "init system" for DC/OS. Marathon starts and monitors your applications and services, automatically healing failures.

A native Marathon instance is installed as a part of DC/OS installation. After DC/OS has started, you can manage the native Marathon instance through the **Services** tab of the DC/OS web interface or from the DC/OS CLI with the `dcos marathon` command.
