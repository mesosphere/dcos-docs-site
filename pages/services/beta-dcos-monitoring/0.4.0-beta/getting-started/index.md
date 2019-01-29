---
layout: layout.pug
navigationTitle: Getting Started
title: Getting Started
menuWeight: 10
excerpt: Get up and running quickly with the service
render: mustache
model: ../data.yml
---

#include /services/include/beta-software-warning.tmpl

In this section, you will download and install the {{ model.techName }} service.

# Prerequisites

- DC/OS Enterprise 1.12 or later.
- [DC/OS CLI](/latest/cli/install/) is installed.
- You are logged in as a superuser.

## Install package registry

Please follow these [instructions](https://docs.mesosphere.com/1.12/administering-clusters/repo/package-registry/quickstart/) to install the package registry.

# Install {{ model.techName }} service

## Download the package

Download the `.dcos` package of the {{ model.techName }} service from the [Mesosphere support site](https://support.mesosphere.com/s/downloads).

## Install the service

Install the service with the `dcos registry add` command.
Assume that the downloaded package is called `{{ model.packageName }}.dcos` in the current working directory.

```bash
dcos registry add --dcos-file {{ model.packageName }}.dcos
dcos package install {{ model.packageName }} --package-version=<VERSION>
```

Among other things, this will also install the package CLI.

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

# Running {{ model.techName }} service on DC/OS clusters securely

The {{ model.techName }} service may be run on DC/OS clusters in either permissive or strict mode.
DC/OS access controls must be used to restrict access to the {{ model.techName }} service when running on [strict mode](https://docs.mesosphere.com/latest/security/ent/#security-modes) clusters.
Configure the {{ model.techName }} service to authenticate itself using a certificate and to only grant permissions needed by the service.

## Create a service account

The following CLI commands create a service account named `{{ model.packageName }}-principal` and store its private certificate in a secret named `{{ model.packageName }}/service-private-key`:

```bash
dcos security org service-accounts keypair {{ model.packageName }}-private-key.pem {{ model.packageName }}-public-key.pem
dcos security org service-accounts create -p {{ model.packageName }}-public-key.pem -d "{{ model.packageName }} service account" {{ model.packageName }}-principal
dcos security secrets create-sa-secret --strict {{ model.packageName }}-private-key.pem {{ model.packageName }}-principal {{ model.packageName }}/service-private-key
```

## Add service permissions

Grant `{{ model.packageName }}-principal` the permissions required to run the {{ model.techName }} service:

```bash
dcos security org users grant {{ model.packageName }}-principal dcos:adminrouter:ops:ca:rw full
dcos security org users grant {{ model.packageName }}-principal dcos:adminrouter:ops:ca:ro full
dcos security org users grant {{ model.packageName }}-principal dcos:mesos:agent:framework:role:slave_public read
dcos security org users grant {{ model.packageName }}-principal dcos:mesos:master:framework:role:{{ model.packageName }}-role create
dcos security org users grant {{ model.packageName }}-principal dcos:mesos:master:framework:role:slave_public read
dcos security org users grant {{ model.packageName }}-principal dcos:mesos:master:framework:role:slave_public/{{ model.packageName }}-role read
dcos security org users grant {{ model.packageName }}-principal dcos:mesos:master:framework:role:slave_public/{{ model.packageName }}-role create
dcos security org users grant {{ model.packageName }}-principal dcos:mesos:master:reservation:principal:{{ model.packageName }}-principal delete
dcos security org users grant {{ model.packageName }}-principal dcos:mesos:master:reservation:role:{{ model.packageName }}-role create
dcos security org users grant {{ model.packageName }}-principal dcos:mesos:master:reservation:role:slave_public/{{ model.packageName }}-role create
dcos security org users grant {{ model.packageName }}-principal dcos:mesos:master:task:user:nobody create
dcos security org users grant {{ model.packageName }}-principal dcos:mesos:master:volume:principal:{{ model.packageName }}-principal delete
dcos security org users grant {{ model.packageName }}-principal dcos:mesos:master:volume:role:{{ model.packageName }}-role create
dcos security org users grant {{ model.packageName }}-principal dcos:mesos:master:volume:role:slave_public/{{ model.packageName }}-role create
dcos security org users grant {{ model.packageName }}-principal dcos:secrets:default:/{{ model.packageName }}/\* full
dcos security org users grant {{ model.packageName }}-principal dcos:secrets:list:default:/{{ model.packageName }} read
```

## Install with custom options

You must identify for the {{ model.techName }} service which service account and certificate it should use for authentication.
Do so by installing the service with a custom configuration that sets the `service_account` field to the principal name and sets the `service_account_secret` field to the secret where the service certificate is stored.

Create a custom options file (`options.json`):

```json
{
  "service": {
    "service_account": "{{ model.packageName }}-principal",
    "service_account_secret": "{{ model.packageName }}/service-private-key"
  }
}
```

Then, install the service with custom options:

```bash
dcos package install {{ model.packageName }} --options=options.json
```
