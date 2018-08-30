---
layout: layout.pug
navigationTitle: Getting Started with Package Registry
title: Getting Started with Package Registry
menuWeight: 1
excerpt: Start using DC/OS Package Registry now
beta: true
enterprise: true
---

# Preparing to Install

### Install or Upgrade to DC/OS Enterprise 1.12

The DC/OS Package Registry is included with DC/OS Enterprise 1.12.

<!-- this link could change-->

Please follow the [instructions for upgrading to DC/OS 1.12](http://docs.mesosphere.com/1.12/installing/production/upgrading/) first before continuing.

### Remove the Universe Repository (optional)

If the DC/OS cluster does not have network access to the Universe Repository, or if you are not interested in all of the DC/OS Packages in that repository, use the following command to remove it.

```bash
dcos package repo remove Universe
```

# Installing DC/OS Package Registry

### Enable the Read-Only Bootstrap Package Registry

DC/OS Enterprise is pre-configured to run a read-only Package Registry which contains two DC/OS Packages. The DC/OS Enterprise CLI and the DC/OS Package Registry. To enable this repository with the DC/OS Package Manager, we must add it to the list to repository.

```bash
dcos package repo add "Bootstrap Registry" https://registry.component.thisdcos.directory/repo
```

### Create a service account for the package registry

DC/OS Package registry needs a service account to be able to run in DC/OS Enterprise. Use the following procedure to create a service account with  minimum permissions.


#### 1. Install the DC/OS Enterprise CLI

```bash
dcos package install dcos-enterprise-cli --yes
```

#### 2. Create a private/public key pair for the service account

```bash
dcos security org service-accounts keypair private-key.pem public-key.pem
```

#### 3. Create the service account

```bash
dcos security org service-accounts create -p public-key.pem -d "dcos_registry service account" registry-account
```

#### 4. Store private key in the secret store

```bash
dcos security secrets create-sa-secret --strict private-key.pem registry-account registry-private-key
```

#### 5. Give full permission to the service account

```bash
dcos security org users grant registry-account dcos:adminrouter:ops:ca:rw full
```

NOTE: The secret information associated with the service account is stored in a path called "registry-private-key" in the DC/OS Secret store. Please change "registry-private-key" to your prefered path.

These instructions create two sensitive files on the local file system: "private-key.pem" and "public-key.pem". Please make sure to save these files in a secure place or delete them. They are not needed after being stored in the DC/OS Secret Store.

### Configure and Install DC/OS Package Registry

#### 1. Provide location in the secret store for the service account secrets

```bash
echo '{"registry":{"service-account-secret-path":"registry-private-key"}}' > registry-options.json
```

#### 2. Install Package Registry

```bash
dcos package install package-registry --options=registry-options.json --yes
```

Note: The default configuration for the DC/OS Package Registry stores DC/OS Packages on the local filesystem. This configuration doesn't scale horizontally nor is it highly available. Please see S3 Storage Option section.

Note: The default configuration assumes that the secrets for the service account for the DC/OS Package Registry are stored in "registry-private-key" in the DC/OS Secret Store. If that is not the case please replace "registry-private-key" path with the correct path.

### Enable the DC/OS Package Registry with the DC/OS Package Manager

To add Package Registry to DC/OS Package Manager use the following command:

```bash
dcos package repo add --index=0 Registry https://registry.marathon.l4lb.thisdcos.directory/repo
```

Note: This assumes that the DC/OS Package Registry was installed using "registry" (the default) as the service name. If that is not the case, update the url accordingly (replacing the “registry” with the actual service name).
