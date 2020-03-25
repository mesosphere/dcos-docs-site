---
layout: layout.pug
navigationTitle: Getting Started
excerpt: Getting started with Hive Metastore
title: Getting Started
menuWeight: 20
model: /mesosphere/dcos/services/hive-metastore/data.yml
render: mustache
---

Getting started with a test instance of the DC/OS {{ model.techName }} service is straightforward.

## Prerequisites

- Depending on your security mode in Enterprise DC/OS, you may need to [provision a service account](/mesosphere/dcos/services/{{ model.serviceName }}/1.2.0-3.0.0/security/#provisioning-a-service-account) before you install {{ model.techName }}. You will be able to create the service account only if you have `superuser` permission.
	- `strict` [security mode](/mesosphere/dcos/latest/security/ent/#security-modes) requires a service account.
	- `permissive` security mode: a service account is optional.
	- `disabled` security mode does not require a service account.
- Your cluster must have at least {{ model.install.minNodeCount }} private nodes.
{{ model.install.customRequirements }}

<p class="message--note"><strong>NOTE: </strong>The default DC/OS {{ model.techShortName }} installation provides reasonable defaults for trying out the service, but may not be sufficient for production use. You may require different configurations depending on the context of the deployment.</p>


## Installation from the DC/OS CLI

To start a basic test cluster, run the following command on the DC/OS CLI. Enterprise DC/OS users must follow additional instructions. More information about installing DC/OS {{ model.techShortName }} on Enterprise DC/OS is available in the [Authenticating DC/OS Services](/mesosphere/dcos/2.0/security/ent/service-auth/custom-service-auth/) documentation. 

```shell
dcos package install {{ model.serviceName }}
```
You can specify a custom configuration in an `options.json` file and pass it to `dcos package install` using the `--options` parameter.

```json
dcos package install {{ model.serviceName }} --options=<options>.json
```

It is recommended that this custom configuration is stored in source control.

For more information about building the `options.json` file, see  [Configuring Services](/mesosphere/dcos/2.0/deploying-services/config-universe-service/).

## Installation from the DC/OS UI

You can [install DC/OS Apache {{ model.techShortName }} from the DC/OS UI](/mesosphere/dcos/2.0/deploying-services/install/). If you install DC/OS {{ model.techShortName }} from the web interface, you must install the DC/OS {{ model.techShortName }} CLI subcommands separately. From the DC/OS CLI, enter the following command:
```bash
dcos package install {{ model.serviceName }} --cli
```
Choose `ADVANCED INSTALLATION` to perform a custom installation.

## Integration with DC/OS access controls

In Enterprise DC/OS 1.10 and later, you can integrate your SDK-based service with DC/OS ACLs to restrict users and groups  to certain services. You will install your service into a folder, and then restrict access to some number of folders. Folders also allow you to assign namespaces to services; for example, `staging/{{ model.serviceName }}` and `production/{{ model.serviceName }}`.

Use the following steps to integrate with DC/OS access controls:

1. In the DC/OS UI, you must create a group and then add a user to the group or create an user. Click **Organization** > **Groups** > **+** or **Organization** > **Users** > **+**. If you create a group, you must also create a user and add them to the group.
1. Give the user permissions for the folder where you will install your service. In this example, we are creating a user called `developer`, who will have access to the `/testing` folder.
   Select the group or user you created. Select **ADD PERMISSION** and then toggle to **INSERT PERMISSION STRING**. Add each of the following permissions to your user or group and then click **ADD PERMISSIONS**.

   ```
   dcos:adminrouter:service:marathon full
   dcos:service:marathon:marathon:services:/testing full
   dcos:adminrouter:ops:mesos full
   dcos:adminrouter:ops:slave full
   ```
1. Install your service into a folder called `test`. Go to **Catalog**, then search for **{{ model.serviceName }}**.
1. Click **CONFIGURE** and change the service name to `/testing/{{ model.serviceName }}`, then deploy.

   The slashes in your service name are interpreted as folders. You are deploying {{ model.techShortName }} in the `/testing` folder. Any user with access to the `/testing` folder will have access to the service.

<p class="message--note"><strong>NOTE: </strong>Services cannot be renamed because the location of the service is specified in the name and you cannot move services between folders. DC/OS 1.9 does not accept slashes in service names. You may be able to create the service, but you will encounter unexpected problems.</p>

### Interacting with your foldered service

- Interact with your foldered service via the DC/OS CLI with this flag: `--name=/path/to/myservice`.
- To interact with your foldered service over the web directly, use `http://<dcos-url>/service/path/to/myservice`. For example, `http://<dcos-url>/service/testing/{{ model.serviceName }}/v1/endpoints`.

