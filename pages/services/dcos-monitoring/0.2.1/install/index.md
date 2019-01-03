---
layout: layout.pug
navigationTitle: Install
title: Install
menuWeight: 10
excerpt: Instructions for installing the Beta DC/OS Monitoring service
model: /services/dcos-monitoring/data.yml
render: mustache

---

# Prerequisites

- DC/OS Enterprise 1.12 or later.
- [DC/OS CLI](/latest/cli/install/) is installed.
- You are logged in as a superuser.

## Install package registry

Please follow these [instructions](/1.12/administering-clusters/repo/package-registry/quickstart/) to install the package registry.

# Install {{ model.techName }} service

## Download the package

Download the `.dcos` package of the {{ model.techName }} service from the [Mesosphere support site](https://support.mesosphere.com/s/downloads).

<p class="message--note"><strong>NOTE: </strong>You must have a service account to log in and download software from this site.</p>

## Install the service

Install the service with the [`dcos registry add` command](/1.12/administering-clusters/repo/package-registry/operating/installing/#adding-packages). Assume that the downloaded package is called `{{ model.serviceName }}.dcos` in the current working directory.

```bash
dcos registry add --dcos-file {{ model.serviceName }}.dcos
dcos package install {{ model.serviceName }} --package-version=<VERSION>
```

## Verify service deployment

To monitor the deployment of your service, install the package cli (see command above) and run the command:

```bash
dcos {{ model.serviceName }} plan show deploy
```

# Integration with DC/OS access controls

The {{ model.techShortName }} service may be run on DC/OS clusters in either permissive or strict mode.
DC/OS access controls must be used to restrict access to the {{ model.techShortName }} service when deployed in [strict mode](https://docs.mesosphere.com/latest/security/ent/#security-modes) clusters.
Configure the {{ model.techShortName }} service to authenticate itself using a certificate and to only grant permissions needed by the service.

## Create a service account

The following CLI commands create a service account named `{{ model.serviceName }}-principal` and store its private certificate in a secret named `{{ model.serviceName }}/service-private-key`:

```bash
dcos security org service-accounts keypair {{ model.serviceName }}-private-key.pem {{ model.serviceName }}-public-key.pem
dcos security org service-accounts create -p {{ model.serviceName }}-public-key.pem -d "{{ model.techShortName }} service account" {{ model.serviceName }}-principal
dcos security secrets create-sa-secret --strict {{ model.serviceName }}-private-key.pem {{ model.serviceName }}-principal {{ model.serviceName }}/service-private-key
```

## Add service permissions

Grant `{{ model.serviceName }}-principal` the permissions required to run the {{ model.techShortName }} service:

```bash
dcos security org users grant {{ model.serviceName }}-principal dcos:adminrouter:ops:ca:rw full
dcos security org users grant {{ model.serviceName }}-principal dcos:adminrouter:ops:ca:ro full
dcos security org users grant {{ model.serviceName }}-principal dcos:mesos:agent:framework:role:slave_public read
dcos security org users grant {{ model.serviceName }}-principal dcos:mesos:master:framework:role:{{ model.serviceName }}-role create
dcos security org users grant {{ model.serviceName }}-principal dcos:mesos:master:framework:role:slave_public read
dcos security org users grant {{ model.serviceName }}-principal dcos:mesos:master:framework:role:slave_public/{{ model.serviceName }}-role read
dcos security org users grant {{ model.serviceName }}-principal dcos:mesos:master:framework:role:slave_public/{{ model.serviceName }}-role create
dcos security org users grant {{ model.serviceName }}-principal dcos:mesos:master:reservation:principal:{{ model.serviceName }}-principal delete
dcos security org users grant {{ model.serviceName }}-principal dcos:mesos:master:reservation:role:{{ model.serviceName }}-role create
dcos security org users grant {{ model.serviceName }}-principal dcos:mesos:master:reservation:role:slave_public/{{ model.serviceName }}-role create
dcos security org users grant {{ model.serviceName }}-principal dcos:mesos:master:task:user:nobody create
dcos security org users grant {{ model.serviceName }}-principal dcos:mesos:master:volume:principal:{{ model.serviceName }}-principal delete
dcos security org users grant {{ model.serviceName }}-principal dcos:mesos:master:volume:role:{{ model.serviceName }}-role create
dcos security org users grant {{ model.serviceName }}-principal dcos:mesos:master:volume:role:slave_public/{{ model.serviceName }}-role create
dcos security org users grant {{ model.serviceName }}-principal dcos:secrets:default:/{{ model.serviceName }}/\* full
dcos security org users grant {{ model.serviceName }}-principal dcos:secrets:list:default:/{{ model.serviceName }} read
```

## Install with custom options

You must identify for the {{ model.techShortName }} service which service account and certificate it should use for authentication. Do so by installing the service with a custom configuration that sets the `service_account` field to the principal name and sets the `service_account_secret` field to the secret where the service certificate is stored.


Create a custom options file (`options.json`):

```json
{
  "service": {
    "service_account": "{{ model.serviceName }}-principal",
    "service_account_secret": "{{ model.serviceName }}/service-private-key"
  }
}
```

Then, install the service with custom options:

```bash
dcos package install {{ model.serviceName }} --options=options.json
```
