---
layout: layout.pug
navigationTitle: Getting Started
title: Getting Started with DC/OS Package Registry
menuWeight: 1
excerpt: Learn How to Install and Setup a Simple DC/OS Package Registry
beta: true
enterprise: true
---

Install or Upgrade DC/OS Enterprise
The DC/OS Package Registry is included with DC/OS Enterprise 1.12. Please following these instructions for installing or upgrading to DC/OS Enterprise 1.12.
Remove the Universe Repository (optional)
If the DC/OS cluster doesn't have network access to the Universe Repository or if you are not interested in all of the DC/OS Packages in that repository, use the following command to remove it.

dcos package repo remove Universe
Installing DC/OS Package Registry
Enable the Read-Only Bootstrap Package Registry
DC/OS Enterprise is pre-configured to run a read-only Package Registry which contains two DC/OS Packages. The DC/OS Enterprise CLI and the DC/OS Package Registry. To enable this repository with the DC/OS Package Manager (Cosmos), we must add it to the list to repository.

dcos package repo add "Bootstrap Registry" https://registry.component.thisdcos.directory/repo
Create a Service Account for the Package Registry
DC/OS Package registry needs a service account to be able to run in DC/OS Enterprise. Use the following command to create a service account with the minimum permission.

# Install the Enterprise DC/OS CLI
dcos package install dcos-enterprise-cli --yes

# Create private and public key for the service account
dcos security org service-accounts keypair private-key.pem public-key.pem

# Create a service account
dcos security org service-accounts create -p public-key.pem -d "dcos_registry service account" registry-account

# Store private key in the secret store
dcos security secrets create-sa-secret --strict private-key.pem registry-account registry-private-key

# Give full permission to the service account
dcos security org users grant registry-account dcos:adminrouter:ops:ca:rw full


Note: The secret information associated with the service account is stored in a path called "registry-private-key" in the DC/OS Secret store. Please change "registry-private-key" to your prefered path.

Note: These instructions create two sensity files "private-key.pem" and "public-key.pem" on the local file system please make sure to save this file in a secure place or delete them. They are not needed after uploading to the DC/OS Secret store.
Configure and Install DC/OS Package Registry
# Provide location in the secret store for the service account secrets
echo '{"registry":{"service-account-secret-path":"registry-private-key"}}' > registry-options.json

# Install Package Registry
dcos package install package-registry --options=registry-options.json --yes


Note: The default configuration for the DC/OS Package Registry stores DC/OS Packages on the local filesystem. This configuration doesn't scale horizontally nor is it highly available. Please see S3 Storage Option section.

Note: The default configuration assumes that the secrets for the service account for the DC/OS Package Registry are stored in "registry-private-key" in the DC/OS Secret Store. If that is not the case please replace "registry-private-key" path with the correct path.
Enable the DC/OS Package Registry with the DC/OS Package Manager (Cosmos)
# Add Package Registry to DC/OS Package Manager (Cosmos)
dcos package repo add --index=0 Registry https://registry.marathon.l4lb.thisdcos.directory/repo

Note: This assumes that the DC/OS Package Registry was installed using "registry" (the default) as the service name. If that is not the case, update the url accordingly (replacing the “registry” with the actual service name).
