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

1. Follow the steps at [Export DC/OS Metrics to Prometheus](https://docs.mesosphere.com/latest/metrics/prometheus/) to set up Prometheus and Grafana on your DC/OS cluster.

2. Open Grafana and add the Prometheus data source.

3. Create a new dashboard by importing the [HiveMQ-Prometheus.json](/services/hivemq/1.0.0-4.0.2/assets/HiveMQ-Prometheus.json) file.

4. Choose your Prometheus data source

5. Open the dashboard

6. (optional) select the {{ model.techName }} deployment you want to monitor using the `service_name` variable

# <a name="sidecar-plans"></a>Sidecar plans

The DC/OS {{ model.techName }} service also provides several sidecar plans, which allow you to modify the configuration of cluster nodes at runtime.

<p class="message--warning"><strong>These plans will apply changes to all currently deployed nodes. Newly created nodes will not receive these changes. You can however re-execute the plans with the same parameters after adding nodes if required.</strong>


<p class="message--note"><strong>If any of these plans fail, you should stop their execution. See <a href="/services/hivemq/1.0.0-4.0.2/operations/#stop">Operations</a>.</strong>

## Add license

Sometimes it is necessary to add a new or refreshed license file to your deployment. For this purpose, you can use the `add-license` plan.

This plan requires the parameters `LICENSE` and `LICENSE_NAME` to be defined, where `LICENSE` is your base64 encoded license file and `LICENSE_NAME` is the name of the license file which will be created.

```bash
$ dcos {{ model.serviceName }} --name=<service_name> plan start add-license -p LICENSE=$(cat license.lic | base64) -p LICENSE_NAME=new_license
```

{{ model.techName }} will automatically detect the new license file and enable it if it is valid.

## Extension management

### Add extension

To install an extension, you can use the `add-extension` plan. This plan requires a single parameter `URL` which requires a path to a `.zip` compressed extension folder.

For example, to manually install the File RBAC Extension on each current cluster node, run:

```bash
$ dcos {{ model.serviceName }} --name=<service_name> plan start add-extension -p URL=https://www.hivemq.com/releases/extensions/hivemq-file-rbac-extension-4.0.0.zip
```

### Add or update extension configuration

To configure an extension, you can update or add configuration files using the `add-config`

For example, to manually configure the File RBAC Extension `credentials.xml` on each currently active cluster node, run:

```bash
$ dcos {{ model.serviceName }} --name=<service_name> plan start add-config -p PATH=file-rbac-extension/credentials.xml -p FILE_CONTENT=$(cat local-file.xml | base64)
```

### Enable / disable extension

Extensions can be enabled or disabled at any cluster nodes' runtime as well. To do so, you can use the `enable-extension` or `disable-extension` plans. Both plans require the parameter `EXTENSION` parameter which corresponds to the extension's folder name, e.g.

```bash
$ dcos {{ model.serviceName }} --name=<service_name> plan start disable-extension -p EXTENSION=file-rbac-extension
```

<p class="message--warning"><strong>This plan will fail execution if the extension specified does not exist.</strong>
