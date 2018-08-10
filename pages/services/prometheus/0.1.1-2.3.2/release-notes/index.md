---
layout: layout.pug
navigationTitle:  Release Notes
title: Release Notes
menuWeight: 130
excerpt: Release Notes for version 0.1.1-2.3.2
featureMaturity:
enterprise: false
---

Release notes for Prometheus.

# Version 0.1.1-2.3.2

## Bug Fixes

- Fixed jq usage bug that surfaced on CentOS

# Version 0.1.0-2.3.2

This is the first release of DC/OS Prometheus framework.

* Prometheus v2.3.2, AlertManager v0.15.1, PushGateway v0.5.2
* The framework provides options to provide the Prometheus, AlertManager and Rules configuration.
* The default `prometheus` config scrapes DC/OS master, agents in the cluster and does Prometheus Self Monitoring.
