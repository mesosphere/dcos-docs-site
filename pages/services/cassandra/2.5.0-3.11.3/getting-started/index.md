---
layout: layout.pug
navigationTitle: Getting Started
excerpt: Getting started with Cassandra
title: Getting Started
menuWeight: 20
model: /mesosphere/dcos/services/cassandra/data.yml
render: mustache
---

Getting started with a test instance of the DC/OS {{ model.techName }} service is straightforward.

## Prerequisites

- Depending on your security mode in Enterprise DC/OS, you may need to [provision a service account](/mesosphere/dcos/services/{{ model.serviceName }}/2.5.0-3.11.3/security/#provisioning-a-service-account) before installing. Only someone with `superuser` permission can create the service account.
	- `strict` [security mode](/mesosphere/dcos/latest/security/ent/#security-modes) requires a service account.
	- `permissive` security mode a service account is optional.
	- `disabled` security mode does not require a service account.
- Your cluster must have at least {{ model.install.minNodeCount }} private nodes.
{{ model.install.customRequirements }}

The default DC/OS Apache {{ model.techShortName }} installation provides reasonable defaults for trying out the service, but may not be sufficient for production use. You may require different configurations depending on the context of the deployment.

## Installation from the DC/OS CLI

To start a basic test cluster, run the following command on the DC/OS CLI. Enterprise DC/OS users must follow additional instructions. [More information about installing DC/OS Apache {{ model.techShortName }} on Enterprise DC/OS](/mesosphere/dcos/1.11/security/ent/service-auth/custom-service-auth/).

```shell
dcos package install {{ model.serviceName }}
```
You can specify a custom configuration in an `options.json` file and pass it to `dcos package install` using the `--options` parameter.

```
$ dcos package install {{ model.serviceName }} --options=<options>.json
```

It is recommended that this custom configuration is stored in source control.

For more information about building the `options.json` file, see the [DC/OS documentation](/mesosphere/dcos/1.11/deploying-services/config-universe-service/) for service configuration access.

## Installation from the DC/OS Web Interface

You can [install DC/OS Apache {{ model.techShortName }} from the DC/OS web interface](/mesosphere/dcos/1.11/deploying-services/install/). If you install DC/OS Apache {{ model.techShortName }} from the web interface, you must install the DC/OS Apache {{ model.techShortName }} CLI subcommands separately. From the DC/OS CLI, enter:
```bash
dcos package install {{ model.serviceName }} --cli
```
Choose `ADVANCED INSTALLATION` to perform a custom installation.

## Integration with DC/OS access controls

In Enterprise DC/OS 1.10 and above, you can integrate your SDK-based service with DC/OS ACLs to grant users and groups access to only certain services. You do this by installing your service into a folder, and then restricting access to some number of folders. Folders also allow you to namespace services. For instance, `staging/{{ model.serviceName }}` and `production/{{ model.serviceName }}`.

Steps:

1. In the DC/OS GUI, create a group, then add a user to the group. Or, just create a user. Click **Organization** > **Groups** > **+** or **Organization** > **Users** > **+**. If you create a group, you must also create a user and add them to the group.
1. Give the user permissions for the folder where you will install your service. In this example, we are creating a user called `developer`, who will have access to the `/testing` folder.
   Select the group or user you created. Select **ADD PERMISSION** and then toggle to **INSERT PERMISSION STRING**. Add each of the following permissions to your user or group, and then click **ADD PERMISSIONS**.

   ```
   dcos:adminrouter:service:marathon full
   dcos:service:marathon:marathon:services:/testing full
   dcos:adminrouter:ops:mesos full
   dcos:adminrouter:ops:slave full
   ```
1. Install your service into a folder called `test`. Go to **Catalog**, then search for **{{ model.serviceName }}**.
1. Click **CONFIGURE** and change the service name to `/testing/{{ model.serviceName }}`, then deploy.

   The slashes in your service name are interpreted as folders. You are deploying {{ model.techShortName }} in the `/testing` folder. Any user with access to the `/testing` folder will have access to the service.

<p class="message--note"><strong>NOTE: </strong>Services cannot be renamed. Because the location of the service is specified in the name, you cannot move services between folders. DC/OS 1.9 and earlier does not accept slashes in service names. You may be able to create the service, but you will encounter unexpected problems.</p>

### Interacting with your foldered service

- Interact with your foldered service via the DC/OS CLI with this flag: `--name=/path/to/myservice`.
- To interact with your foldered service over the web directly, use `http://<dcos-url>/service/path/to/myservice`. E.g., `http://<dcos-url>/service/testing/{{ model.serviceName }}/v1/endpoints`.

# Multi-datacenter Deployment

To replicate data across data centers, Apache {{ model.techShortName }} requires that you configure each cluster with the addresses of the seed nodes from every remote cluster. Here's what starting a multi-data-center Apache {{ model.techShortName }} deployment would look like, running inside of a single DC/OS cluster.

## Launch two {{ model.techShortName }} clusters

Launch the first cluster with the default configuration:

```shell
dcos package install {{ model.serviceName }}
```

Create an `options.json` file for the second cluster that specifies a different service name and data center name:

```json
{
  "service": {
    "name": "{{ model.serviceName }}2",
    "data_center": "dc2"
  }
}
```

Launch the second cluster with these custom options:
```
dcos package install {{ model.serviceName }} --options=<options>.json
```

## Get the seed node IP addresses

<p class="message--note"><strong>NOTE: </strong>If your {{ model.techShortName }} clusters are not on the same network, you must set up a proxying layer to route traffic.</p>

Get the list of seed node addresses for the first cluster:

```shell
dcos {{ model.serviceName }} endpoints node
```

Alternatively, you can get this information from the scheduler HTTP API:

```json
DCOS_AUTH_TOKEN=$(dcos config show core.dcos_acs_token)
DCOS_URL=$(dcos config show core.dcos_url)
curl -H "authorization:token=$DCOS_AUTH_TOKEN" $DCOS_URL/service/{{ model.serviceName }}/v1/endpoints/node
```

Your output will resemble:

```
{
  "address": [
    "10.0.1.236:9042",
    "10.0.0.119:9042"
  ],
  "dns": [
    "node-0-server.{{ model.serviceName }}.autoip.dcos.thisdcos.directory:9042",
    "node-1-server.{{ model.serviceName }}.autoip.dcos.thisdcos.directory:9042"
  ],
  "vip": "node.{{ model.serviceName }}.l4lb.thisdcos.directory:9042"
}
```

Note the IP addresses in the `address` field.

Run the same command for your second {{ model.techShortName }} cluster and note the IP addresses in the `address` field:

```
dcos {{ model.serviceName }} endpoints node --name={{ model.serviceName }}2
```

## Update configuration for both clusters

Create an `options.json` file with the IP addresses of the first cluster (`{{ model.serviceName }}`):

```json
{
  "service": {
    "remote_seeds": "10.0.1.236,10.0.0.119"
  }
}
{
  {}
}
```

Update the configuration of the second cluster:

```
dcos {{ model.serviceName }} update start --options=options.json --name={{ model.serviceName }}2
```

Perform the same operation on the first cluster, adding the IP addresses of the second cluster's seed nodes to the `service.remote_seeds` field. Then, update the first cluster's configuration: `dcos {{ model.serviceName }} update start --options=options.json`.

Both schedulers will restart after the configuration update, and each cluster will communicate with the seed nodes from the other cluster to establish a multi-data-center topology. Repeat this process for each new cluster you add.

You can monitor the progress of the update:

```shell
dcos {{ model.serviceName }} --name={{ model.serviceName }} update status
```

Your output will resemble:

```shell
deploy (IN_PROGRESS)
└─ node-deploy (IN_PROGRESS)
   ├─ node-0:[server] (COMPLETE)
   ├─ node-1:[server] (COMPLETE)
   └─ node-2:[server] (PREPARED)
```

