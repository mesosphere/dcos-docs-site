---
layout: layout.pug
navigationTitle: Configuration
excerpt: Configuration options for DC/OS HiveMQ service
title: Configuration
menuWeight: 20
model: /services/hivemq/data.yml
render: mustache
---

<!--TODO: managing describes the default, serial roll-out strategy for updates -->

#include /services/include/managing.tmpl
#include /services/include/configuration-install-with-options.tmpl
#include /services/include/configuration-service-settings.tmpl
#include /services/include/configuration-regions.tmpl

# Monitoring configuration

## Setting up a monitoring dashboard (Grafana)

<p class="message--note"><strong>You can also use the alternative guide for Datadog, however we will not provide explicit directions for how to integrate HiveMQ application metrics with Datadog.</strong>

1. Follow the steps at [Export DC/OS Metrics to Prometheus](https://docs.mesosphere.com/latest/metrics/prometheus/) to set up Prometheus and Grafana on your DCOS cluster.

2. Open Grafana and add the Prometheus data source.

3. Create a new dashboard by importing the [HiveMQ-Prometheus.json](/services/hivemq/1.0.0-4.0.2/assets/HiveMQ-Prometheus.json) file.

4. Choose your Prometheus data source

5. Open the dashboard


# <a name="sidecar-plans"></a>Sidecar plans

The DC/OS { model.techName } service also provides several sidecar plans, which allow you to modify the configuration of cluster nodes at runtime.

<p class="message--warning"><strong>These plans will apply changes to all currently deployed nodes. Newly created nodes will not receive these changes.</strong>

<!-- TODO: add remaining sidecars

```bash
$ dcos {{ model.tech }} --name=<service_name> plan start <plan_name> -p <plan_parameters>
```

-->

## Add license

Sometimes it is necessary to add a new or refreshed license file to your deployment. For this purpose, you can use the `add-license` plan.

This plan requires the parameters `LICENSE` and `LICENSE_NAME` to be defined, where `LICENSE` is your base64 encoded license file and `LICENSE_NAME` is the name of the license file which will be created.

```bash
$ dcos {{ model.techName }} --name=<service_name> plan start add-license -p LICENSE=<base64 encoded license> -p LICENSE_NAME=new_licens
```

## Add extension

