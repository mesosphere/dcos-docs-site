---
layout: layout.pug
navigationTitle: Getting Started
title: Getting Started
menuWeight: 10
excerpt: Download and install Beta DC/OS Monitoring Service
render: mustache
model: ../data.yml
---

#include /services/include/beta-software-warning.tmpl

In this section, you will download and install the {{ model.techName }} service.
By default, Prometheus and Grafana are run with the default configuration options.
Alert Manager is off by default and must be configured by the user in order to be run.

# Prerequisites

- DC/OS Enterprise 1.12 or later.
- [DC/OS CLI](/latest/cli/install/) is installed.
- You are logged in as a superuser.

# Install {{ model.techName }} service

## Download the package

The {{ model.techName }} package is installable via the [catalog](https://docs.mesosphere.com/1.12/gui/catalog/).

## Install the service

Use the following command to install the service.

```bash
dcos package install {{ model.packageName }} --package-version=<VERSION>
```

<p class="message--note"><strong>NOTE: </strong>The command `dcos package install` will install the package CLI and the service.</p>

## Verify service deployment

After installing the package CLI, you can monitor the deployment of your service. Run the command:

```bash
dcos {{ model.packageName }} plan show deploy
```

# Access Grafana dashboards

Assuming the service name is `{{ model.serviceName }}` (default), you should be able to access the Grafana dashboards using the following URL:

```bash
https://<CLUSTER_URL>/service/{{ model.serviceName }}/grafana/
```

See more details in [Accessing the Grafana UI](operations/grafana/ui/).