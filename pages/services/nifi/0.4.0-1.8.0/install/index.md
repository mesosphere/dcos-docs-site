---
layout: layout.pug
navigationTitle:  Installing and Customizing
title: Installing and Customizing
menuWeight: 20
excerpt: Installing DC/OS NiFi from the web interface or the CLI
featureMaturity:
enterprise: false
model: ../../data.yml
render: mustache
---

 DC/OS {{model.techName }} is available in the Universe and can be installed by using either the web interface or the DC/OS CLI.

The default DC/OS {{model.techName }} service installation provides reasonable defaults for trying out the service, but that may not be sufficient for production use. You may require different configurations depending on the context of the deployment.

## Prerequisites

- If you are using Enterprise DC/OS, you may [need to provision a service account](/latest/security/ent/service-auth/custom-service-auth/) before installing DC/OS {{model.techName }} Service. Only someone with `superuser` permission can create the service account.
  - `strict` [security mode](/latest/security/ent/service-auth/custom-service-auth/) requires a service account.
  - In `permissive` security mode a service account is optional.
  - `disabled` security mode does not require a service account.
- Your cluster must have {{ model.install.nodeCount }} nodes.

### Installation Limitations

The minimum memory requirement for DC/OS {{ model.techName }} installation is {{ model.install.minMemory }}. DC/OS {{model.techName }} installation will take time since the DC/OS {{model.techName }} application is approximately 1.10GB. The approximate installation time required would be around 20~25 minutes for a two node cluster.


<p class="message--note"><strong>NOTE: </strong>A complete guide to Configuring DC/OS Access for Nifi can be found [here](../security/serviceaccountdetail.md).

# Installing from the DC/OS CLI

To start a basic test cluster of DC/OS {{model.techName }}, run the following command on the DC/OS CLI. Enterprise DC/OS users must follow additional instructions.

   ```shell
   dcos package install {{ model.packageName }}
   ```

This command creates a new instance with the default name `{{ model.packageName }}`. Two instances cannot share the same name, so installing additional instances beyond the default instance requires customizing the name at install time for each additional instance. However, the application can be installed using the same name in case of foldered installation, wherein we can install the same application in different folders.

All `dcos {{ model.packageName }}` CLI commands have a `--name`  argument allowing the user to specify which instance to query. If you do not specify a service name, the CLI assumes a default value matching the package name, for example, `{{ model.packageName }}`. The default value for `--name` can be customized via the DC/OS CLI configuration:

   ```shell
   dcos {{ model.packageName }} --name={{ model.packageName }} <cmd>
   ```

You can specify a custom configuration in an `options.json` file and pass it to `dcos package install` using the `--options` parameter.

   ```shell
   dcos package install {{ model.packageName }} --options=options.json
   ```

<!-- This link is broken: For more information on building the `options.json` file, see [DC/OS documentation](https://docs.mesosphere.com/latest/usage/managing-services/config-universe-service/) for service configuration access. -->

# Installing from the DC/OS Web Interface

You can install DC/OS {{model.techName }} from the DC/OS web interface by selecting the app from the Catalog and then clicking on **Deploy**.

If you install DC/OS {{model.techName }} from the DC/OS web interface, the
`dcos {{ model.packageName }}` CLI commands are not automatically installed to your workstation. They may be manually installed using the DC/OS CLI:


   ```shell
   dcos package install {{ model.packageName }} --cli
   ```

# Customizing your installation

## Installing multiple instances

By default, the DC/OS {{model.techName }} service is installed with a service name of `{{ model.packageName }}`. You may specify a different name using a custom service configuration as follows:

   ```shell
   {
       "service": {
           "name": "{{ model.packageName }}-other"
       }
   }
   ```

When the above JSON configuration is passed to the `package install {{ model.packageName }}` command via the `--options` argument, the new service will use the name specified in that JSON configuration:

   ```shell
   dcos package install {{ model.packageName }} --options={{ model.packageName }}-other.json
   ```

Multiple instances of DC/OS {{model.techName }} may be installed into your DC/OS cluster by customizing the name of each instance. For example, you might have one instance of DC/OS {{model.techName }} named `{{ model.packageName }}-staging` and another named `{{ model.packageName }}-prod`, each with its own custom  configuration.

After specifying a custom name for your instance, it can be reached using `dcos {{ model.packageName }}` CLI commands or directly over HTTP as described below.
<p class="message--important"><strong>IMPORTANT: </strong>The service name cannot be changed after initial install. Changing the service name would require installing a new instance of the service against the new name, then copying over any data as necessary to the new instance.</p>

## Installing into folders

In DC/OS 1.10 and later, services may be installed into folders by specifying a slash-delimited service name. For example:

   ```shell
   {
       "service": {
           "name": "/foldered/path/to/{{ model.packageName }}"
       }
   }
   ```
The above example will install the service under a path of `foldered => path => to => {{ model.packageName }}`. It can then be reached using `dcos {{ model.packageName }}` CLI commands or directly over HTTP as described below.

<p class="message--important"><strong>IMPORTANT: </strong>The service folder location cannot be changed after initial install. Changing the service location would require installing a new instance of the service against the new location, then copying over any data as necessary to the new instance.</p>

## Addressing named instances

After you’ve installed the service under a custom name or under a folder, it may be accessed from all `dcos {{ model.packageName }}` CLI commands using the `--name` argument. By default, the `--name` value defaults to the name of the package, or {{ model.packageName }}.

For example, if you had an instance named `{{ model.packageName }}-dev`, the following command would invoke a `pod list` command against it:

   ```shell
   dcos {{ model.packageName }} --name={{ model.packageName }}-dev pod list
   ```
The same query over HTTP would be:

   ```shell
   curl -H "Authorization:token=$auth_token" <dcos_url>/service/{{ model.packageName }}-dev/v1/pod
   ```
Likewise, if you had an instance in a folder like `/foldered/path/to/{{ model.packageName }}`, the following command would invoke a `pod list` command against it:

   ```shell
   dcos {{ model.packageName }} --name=/foldered/path/to/{{ model.packageName }} pod list
   ```

Similarly, it could be queried directly over HTTP as follows:

   ```shell
   curl -H "Authorization:token=$auth_token" <dcos_url>/service/foldered/path/to/{{ model.packageName }}-dev/v1/pod
   ```
<p class="message--note"><strong>NOTE: </strong>You may add a -v (verbose) argument to any dcos {{ model.packageName }} command to see the underlying HTTP queries that are being made. This can be a useful tool to see where the CLI is getting its information. In practice, dcos {{ model.packageName }} commands are a thin wrapper around an HTTP interface provided by the DC/OS {{model.techName }} service itself.</p>

## Virtual Networks

DC/OS {{model.techName }} supports deployment on virtual networks on DC/OS, allowing each container (task) to have its own IP address and not use port resources on the agent machines. This can be specified by passing the following configuration during installation:

   ```shell
   {
       "service": {
           "virtual_network_enabled": true
       }
   }
   ```
<p class="message--note"><strong>NOTE: </strong> Once the service is deployed on a virtual network, it cannot be updated to use the host network.</p>


## Minimal Installation

For development purposes, you may wish to install DC/OS {{model.techName }} on a local DC/OS cluster. For this, you can use `dcos-docker` or `dcos-vagrant`.
To start a minimal cluster with a single node, create a JSON options file named `sample-{{ model.packageName }}-minimal.json`:

   ```shell
   {
       "node": {
       "count": 1,
       "mem": 512,
       "cpu": 0.5
       }
   }
   ```
The command below creates a cluster using `sample-{{ model.packageName }}-minimal.json`:


   ```shell
   dcos package install {{ model.packageName }} --options=sample-{{ model.packageName }}-minimal.json
   ```
## Example custom installation

Customize the defaults by creating a JSON file. Then, pass it to `dcos package install` using the `--options` parameter.

Sample JSON options file named `sample-{{ model.packageName }}-custom.json`:

   ```shell
   {
   "node": {
       "count": 1,
       "cpus": 1
       },
   "service": {
       "name": "test/integration/{{ model.packageName }}",
       "security": {
           "kerberos": {
               "enabled": true
           },
           "tls_ssl": {
               "enable": true
           }
       },
       "service_account": "dcos{{ model.packageName }}",
       "service_account_secret": "dcos{{ model.packageName }}secret",
       "virtual_network_enabled": true
       "cn_dn_node_identity": "testintegration{{ model.packageName }}"
       }
   }
   ```
The following command creates a cluster using `sample-{{ model.packageName }}.json`:
   ```shell
   dcos package install {{ model.packageName }} --options=sample-{{ model.packageName }}-custom.json
   ```
Store your custom configuration in source control.

Alternatively, you can perform a custom installation from the DC/OS web interface. Choose ADVANCED INSTALLATION at install time.

## Integration with DC/OS access controls

In Enterprise DC/OS 1.10 and later, you can integrate your SDK-based service with DC/OS ACLs to grant users and groups access to only certain services. You do this by installing your service into a folder, and then restricting access to some number of folders. Folders also allow you to namespace services, for instance, `staging/{{ model.packageName }}` and `production/{{ model.packageName }}`.

**Steps**:

1. In the DC/OS GUI, create a group, then add a user to the group. Or, just create a user. Click **Organization > Groups > +** or **Organization > Users > +**. If you create a group, you must also create a user and add them to the group.

1. Give the user permissions for the folder where you will install your service. In this example, we are creating a user called `developer`, who will have access to the `/testing` folder.

1. Select the group or user you created. Select ADD PERMISSION and then toggle to INSERT PERMISSION STRING. Add each of the following permissions to your user or group, and then click ADD PERMISSIONS.

   ```shell
   dcos:adminrouter:service:marathon full
   dcos:service:marathon:marathon:services:/testing full
   dcos:adminrouter:ops:mesos full
   dcos:adminrouter:ops:slave full
   ```
1. Install your service into a folder called `test`. Go to the Catalog, then search for `{{ model.packageName }}`.

1. Click CONFIGURE and change the service name to `/testing/{{ model.packageName }}`, then deploy. The slashes in your service name are interpreted as folders. You are deploying `{{ model.packageName }}` in the `/testing` folder. Any user with access to the `/testing` folder will have access to the service.

<p class="message--note"><strong>NOTE: </strong> Services cannot be renamed. Because the location of the service is specified in the name, you cannot move services between folders. DC/OS 1.9 and earlier versions do not accept slashes in service names. You may be able to create the service, but you will encounter unexpected problems.</p>

## Interacting with your foldered service

CLI: 

Interact with your foldered service via the DC/OS CLI with this flag: `--name=/path/to/myservice`.

HTTP: 

To interact with your foldered service over the web directly, use `http://<dcos-url>/service/path/to/myservice`. 

   For example:
   
   ```
   http://<dcos-url>/service/testing/{{ model.packageName }}/v1/endpoints
   ```

## Placement Constraints

Placement constraints allow you to customize where a service is deployed in the DC/OS cluster. Depending on the service, some or all components may be configurable using Marathon operators (reference). For example, [["`hostname`", "`UNIQUE`"]] ensures that at most one pod instance is deployed per agent.

A common task is to specify a list of whitelisted systems to deploy to. To achieve this, use the following syntax for the placement constraint:
   ```shell
   [["hostname", "LIKE", "10.0.0.159|10.0.1.202|10.0.3.3"]]
   ```
<p class="message--important"><strong>IMPORTANT: </strong>You must include spare capacity in this list, so that if one of the whitelisted systems goes down, there is still enough room to repair your service (via <tt>pod replace</tt>) without requiring that system.</p>

**Example**

In order to define placement constraints as part of an install or update of a service they should be provided as a JSON encoded string. For example, you can define a placement constraint in an options file as follows:

   ```shell
   cat options.json
   {
       "hello": {
       "placement": "[[\"hostname\", \"UNIQUE\"]]"
       }
   }
   ```
This file can be referenced to install a `{{ model.packageName }}` service.

   ```shell
   dcos package install hello-world --options=options.json
   ```
Likewise, this file can be referenced to update a `{{ model.packageName }}` service.

   ```shell
   dcos {{ model.packageName }} update start --options=options.json
   ```

## Secured Installation
  Please refer to the [Security Guide](../security/index.md) for secured installation of DC/OS {{model.techName }}.
