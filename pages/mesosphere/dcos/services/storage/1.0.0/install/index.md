---
layout: layout.pug
origin: github.com/mesosphere/dcos-storage/docs/install/index.md
navigationTitle: Install
title: Install
menuWeight: 30
excerpt: Instructions for installing the DC/OS Storage Service on a DC/OS cluster
enterprise: true
---

The cluster administrator must install the DC/OS Storage Service via the [package registry](./package-registry-based/).

# Integration with DC/OS access controls

The DC/OS Storage Service may be run on DC/OS clusters in either permissive or strict mode.
A DC/OS Storage Service *service account* must be configured for all security modes.
DC/OS access controls are used to restrict access to the DC/OS Storage Service when running on strict mode clusters.
For strict mode clusters it is also necessary to configure the DC/OS Storage Service to enforce authorization and grant the additional permissions needed by the service.

## Create a service account

The following CLI commands create a service account named `storage-principal` and stores its private certificate in a secret named `storage/storage-private-key`:

```bash
dcos security org service-accounts keypair storage-private-key.pem storage-public-key.pem
dcos security org service-accounts create -p storage-public-key.pem -d "DSS service account" storage-principal
dcos security secrets create-sa-secret --strict storage-private-key.pem storage-principal storage/storage-private-key
```

## Add service permissions

Grant the `storage-principal` the permissions required to run the DC/OS Storage Service:

```bash
dcos security org users grant storage-principal dcos:adminrouter:ops:slave full
```

### Additional permissions for strict mode clusters

```bash
dcos security org users grant storage-principal dcos:secrets:default:/storage/\* full
dcos security org users grant storage-principal dcos:secrets:list:default:/storage read
dcos security org users grant storage-principal dcos:adminrouter:ops:ca:rw full
dcos security org users grant storage-principal dcos:adminrouter:ops:ca:ro full

dcos security org users grant storage-principal dcos:mesos:master:framework:principal:storage-principal full
dcos security org users grant storage-principal dcos:mesos:master:framework:role full
dcos security org users grant storage-principal dcos:mesos:master:reservation delete
dcos security org users grant storage-principal dcos:mesos:master:reservation:role full
dcos security org users grant storage-principal dcos:mesos:master:block_disk:role full
dcos security org users grant storage-principal dcos:mesos:master:mount_disk:role full
dcos security org users grant storage-principal dcos:mesos:master:raw_disk:role full
dcos security org users grant storage-principal dcos:mesos:agent:endpoint:path:/api/v1 full
dcos security org users grant storage-principal dcos:mesos:agent:resource_provider_config full
dcos security org users grant storage-principal dcos:mesos:agent:resource_provider read
```

## Install with custom options

The DC/OS Storage Service has to know which service account and certificate it should use for authentication.
This is done by installing the service with a custom configuration that sets the `principal` field to the principal name and the `secret-name` field to the secret where the service certificate is stored.

```bash
cat storage.json
```
```
{
  "service": {
    "principal": "storage-principal",
    "secret-name": "storage/storage-private-key"
  }
}
```
```bash
dcos package install storage --package-version=<VERSION> --options=storage.json
```

### Options for strict mode clusters

Authorization must be enforced when installing the DC/OS Storage Service in a strict mode cluster.
In the following example the `enforce-authorization` option has been enabled, in addition to the other required options.

```bash
cat storage.json
```
```
{
  "service": {
    "enforce-authorization": true,
    "principal": "storage-principal",
    "secret-name": "storage/storage-private-key"
  }
}
```
```bash
dcos package install storage --package-version=<VERSION> --options=storage.json
```
