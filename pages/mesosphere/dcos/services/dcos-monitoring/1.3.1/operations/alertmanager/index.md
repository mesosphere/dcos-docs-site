---
layout: layout.pug
navigationTitle: Configuring Alertmanager
title: Configuring Alertmanager
menuWeight: 50
excerpt: Configuring Alertmanager
render: mustache
model: ../../data.yml
---

Alerting is supported in the {{ model.techName }} service via [Prometheus Alertmanager](https://prometheus.io/docs/alerting/alertmanager/).
The Alertmanager bundled with the {{ model.techName }} service is off by default.
The service is automatically configured for Prometheus to talk to Alertmanager once it is configured and turned on.

To run Alertmanager, you must configure it to pull the Alertmanager configuration from a Git repository.
The following section explains how to run Alertmanager.
See the [alert rules documentation](../prometheus/alert-rules/) for instructions on how to configure the service to load the rules for Prometheus.
