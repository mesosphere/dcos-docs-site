---
layout: layout.pug
navigationTitle: Getting Started with Package Registry
title: Getting Started with Package Registry
menuWeight: 1
excerpt: Start using DC/OS Package Registry
enterprise: true
---

# Preparing to Install a Package Registry

## Install or Upgrade to DC/OS Enterprise 1.12

The DC/OS Package Registry is included with DC/OS Enterprise 1.12. If needed, please follow the [instructions for upgrading to DC/OS 1.12](/1.13/installing/production/upgrading/) first before continuing.

## Remove the Universe Repository (optional)

If the DC/OS cluster does not have network access to the Universe Repository, or if you are not interested in any of the DC/OS Packages in that repository, use the following command to remove it:

```bash
dcos package repo remove Universe
```

# Installing DC/OS Package Registry

## Enable the Read-Only Bootstrap for Package Registry

DC/OS Enterprise is pre-configured to run a read-only Package Registry which contains two DC/OS Packages: the DC/OS Enterprise CLI and the DC/OS Package Registry. To enable this repository with the DC/OS Package Manager, you must add it to the list of repositories.

```bash
dcos package repo add "Bootstrap Registry" https://registry.component.thisdcos.directory/repo
```

## Create a service account for the Package Registry

DC/OS Package Registry needs a service account to be able to run in DC/OS Enterprise. Use the following procedure to create a service account with minimum permissions.

1. Install the DC/OS Enterprise CLI:

```bash
dcos package install dcos-enterprise-cli --yes
```

2. Create a private/public key pair for the service account:

```bash
dcos security org service-accounts keypair private-key.pem public-key.pem
```

3. Create the service account:

```bash
dcos security org service-accounts create -p public-key.pem -d "dcos_registry service account" registry-account
```

4. Store private key in the Secret Store:

```bash
dcos security secrets create-sa-secret --strict private-key.pem registry-account registry-private-key
```

5. Give full permission to the service account:

```bash
dcos security org users grant registry-account dcos:adminrouter:ops:ca:rw full
```

<p class="message--important"><strong>IMPORTANT: </strong>The secret information associated with the service account is stored in a path called  <code>registry-private-key</code>  in the DC/OS Secret store. If using a different filename, substitute that for  <code>registry-private-key</code>  here. </p>

<p class="message--warning"><strong>WARNING: </strong>These instructions create two sensitive files on the local file system: <code>private-key.pem</code> and <code>public-key.pem</code>. Please make sure to save these files in a secure place or delete them. They are not needed after being stored in the DC/OS Secret Store. </p>

## Configure and Install DC/OS Package Registry

1. Provide location in the Secret Store for the service account secrets:

```bash
echo '{"registry":{"service-account-secret-path":"registry-private-key"}}' > registry-options.json
```

2. Install Package Registry:

```bash
dcos package install package-registry --options=registry-options.json --yes
```

By default, DC/OS Package Registry stores DC/OS Packages on the local filesystem. However, this does not scale horizontally, neither is it highly available. Please see [S3 Storage option](/1.13/administering-clusters/repo/package-registry/operating/planning/#s3-storage-option) for a more flexible approach. Moreover, the default configuration assumes that the secrets for the service account for the DC/OS Package Registry are stored in `registry-private-key` in the DC/OS Secret Store. If that is not the case, please substitute the correct path and filename for `registry-private-key`.

## Enable the DC/OS Package Registry with the DC/OS Package Manager

To add the Package Registry to DC/OS Package Manager, use the following command:

```bash
dcos package repo add --index=0 Registry https://registry.marathon.l4lb.thisdcos.directory/repo
```

<p class="message--note"><strong>NOTE: </strong>This assumes that the DC/OS Package Registry was installed using <code>registry</code> (the default) as the service name. If this is not the case, please update the URL accordingly, (replacing <code>registry</code> with the actual service name).</p>
