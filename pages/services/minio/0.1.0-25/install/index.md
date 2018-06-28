---
layout: layout.pug
navigationTitle:  Installing and Customizing
title: Installing and Customizing
menuWeight: 20
excerpt: Installing DC/OS Minio from the web interface or the CLI
featureMaturity:
enterprise: false
---

 DCOS Minio is available in the Universe and can be installed by using either the web interface or the DC/OS CLI.

The default DC/OS Minio Service installation provides reasonable defaults for trying out the service, but that may not be sufficient for production use. You may require different configurations depending on the context of the deployment.

## Prerequisites
   
- If you are using Enterprise DC/OS, you may [need to provision a service account](https://docs.mesosphere.com/1.10/security/ent/service-auth/custom-service-auth/) before installing DC/OS Prometheus Service. Only someone with `superuser` permission can create the service account.
  - `strict` [security mode](https://docs.mesosphere.com/1.10/security/ent/service-auth/custom-service-auth/) requires a service account.
  - In `permissive` security mode a service account is optional.
  - `disabled` security mode does not require a service account.
- For Standalone Minio:
    Your cluster must have 1 private nodes.
- For Distributed Minio:
    Your Cluster must have at least 4 private nodes.    
    
# Installing from the DC/OS CLI

To start a basic test cluster of Minio, run the following command on the DC/OS CLI. Enterprise DC/OS users must follow additional instructions.

   ```shell
   dcos package install minio 
   ```
   
This command creates a new instance with the default name minio. 

All dcos minio CLI commands have a --name  argument allowing the user to specify which instance to query. If you do not specify a service name, the CLI assumes a default value matching the package name, i.e. minio. The default value for --name can be customized via the DC/OS CLI configuration:

   ```shell
   dcos minio --name=minio <cmd>
   ```

You can specify a custom configuration in an `options.json` file and pass it to `dcos package install` using the `--options` parameter.

   ```shell
   dcos package install minio --options=options.json
   ```

For more information on building the `options.json` file, see [DC/OS documentation](https://docs.mesosphere.com/latest/usage/managing-services/config-universe-service/) for service configuration access.
