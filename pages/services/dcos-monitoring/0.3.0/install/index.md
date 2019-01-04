---
layout: layout.pug
navigationTitle: Install
title: Install
menuWeight: 10
excerpt: Instructions for installing the DC/OS Monitoring service.
---

# Prerequisites

- DC/OS Enterprise 1.12 or above.
- [DC/OS CLI](/latest/cli/install/) is installed.
- You are logged in as a superuser.

## Install package registry

Please follow these [instructions](https://docs.mesosphere.com/1.12/administering-clusters/repo/package-registry/quickstart/) to install the package registry.

# Install DC/OS Monitoring service

## Download the package

Download the `.dcos` package of the DC/OS Monitoring Service from the [Mesosphere support site](https://support.mesosphere.com/s/downloads).

## Install the service

Install the service with the `dcos registry add` command.
Assume that the downloaded package is called `dcos-monitoring.dcos` in the current working directory.

```bash
dcos registry add --dcos-file dcos-monitoring.dcos
dcos package install dcos-monitoring --package-version=<VERSION>
```

## Verify service deployment

To monitor the deployment of your service, install the package cli (see command above) and run the command:

```bash
dcos dcos-monitoring plan show deploy
```

# Integration with DC/OS access controls

The DC/OS Monitoring service may be run on DC/OS clusters in either permissive or strict mode.
DC/OS access controls must be used to restrict access to the DC/OS Monitoring service when running on [strict mode](https://docs.mesosphere.com/latest/security/ent/#security-modes) clusters.
Configure the DC/OS Monitoring service to authenticate itself using a certificate and to only grant permissions needed by the service.

## Create a service account

The following CLI commands create a service account named `dcos-monitoring-principal` and store its private certificate in a secret named `dcos-monitoring/service-private-key`:

```bash
dcos security org service-accounts keypair dcos-monitoring-private-key.pem dcos-monitoring-public-key.pem
dcos security org service-accounts create -p dcos-monitoring-public-key.pem -d "DC/OS Monitoring service account" dcos-monitoring-principal
dcos security secrets create-sa-secret --strict dcos-monitoring-private-key.pem dcos-monitoring-principal dcos-monitoring/service-private-key
```

## Add service permissions

Grant `dcos-monitoring-principal` the permissions required to run the DC/OS Monitoring service:

```bash
dcos security org users grant dcos-monitoring-principal dcos:adminrouter:ops:ca:rw full
dcos security org users grant dcos-monitoring-principal dcos:adminrouter:ops:ca:ro full
dcos security org users grant dcos-monitoring-principal dcos:mesos:agent:framework:role:slave_public read
dcos security org users grant dcos-monitoring-principal dcos:mesos:master:framework:role:dcos-monitoring-role create
dcos security org users grant dcos-monitoring-principal dcos:mesos:master:framework:role:slave_public read
dcos security org users grant dcos-monitoring-principal dcos:mesos:master:framework:role:slave_public/dcos-monitoring-role read
dcos security org users grant dcos-monitoring-principal dcos:mesos:master:framework:role:slave_public/dcos-monitoring-role create
dcos security org users grant dcos-monitoring-principal dcos:mesos:master:reservation:principal:dcos-monitoring-principal delete
dcos security org users grant dcos-monitoring-principal dcos:mesos:master:reservation:role:dcos-monitoring-role create
dcos security org users grant dcos-monitoring-principal dcos:mesos:master:reservation:role:slave_public/dcos-monitoring-role create
dcos security org users grant dcos-monitoring-principal dcos:mesos:master:task:user:nobody create
dcos security org users grant dcos-monitoring-principal dcos:mesos:master:volume:principal:dcos-monitoring-principal delete
dcos security org users grant dcos-monitoring-principal dcos:mesos:master:volume:role:dcos-monitoring-role create
dcos security org users grant dcos-monitoring-principal dcos:mesos:master:volume:role:slave_public/dcos-monitoring-role create
dcos security org users grant dcos-monitoring-principal dcos:secrets:default:/dcos-monitoring/\* full
dcos security org users grant dcos-monitoring-principal dcos:secrets:list:default:/dcos-monitoring read
```

## Install with custom options

You must identify for the DC/OS Monitoring service which service account and certificate it should use for authentication.
Do so by installing the service with a custom configuration that sets the `service_account` field to the principal name and sets the `service_account_secret` field to the secret where the service certificate is stored.

Create a custom options file (`options.json`):

```json
{
  "service": {
    "service_account": "dcos-monitoring-principal",
    "service_account_secret": "dcos-monitoring/service-private-key"
  }
}
```

Then, install the service with custom options:

```bash
dcos package install dcos-monitoring --options=options.json
```
