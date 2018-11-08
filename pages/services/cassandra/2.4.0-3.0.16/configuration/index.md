---
layout: layout.pug
navigationTitle: Configuring 
excerpt: Installation options, configuration regions, node settings, etc.
title: Configuring Cassandra
menuWeight: 42
model: /services/cassandra/data.yml
render: mustache
---


#include /services/include/configuration-install-with-options.tmpl
#include /services/include/configuration-create-json-file.tmpl
#include /services/include/configuration-service-settings.tmpl
#include /services/include/configuration-regions.tmpl


## {{ model.techShortName }} Node Settings

Adjust the following settings to customize the amount of resources allocated to each node. DC/OS {{ model.techName }}'s [system requirements](http://{{ model.packageName }}.apache.org/doc/latest/operating/hardware.html) must be taken into consideration when adjusting these values. Reducing these values below those requirements may result in adverse performance and/or failures while using the service.

Each of the following settings can be customized under the **node** configuration section.

### Node Count

Customize the `Node Count` setting (default 3) under the **node** configuration section. Consult the {{ model.techName }} documentation for minimum node count requirements.

*   **In DC/OS CLI options.json**: `count`: integer (default: `3`)
*   **DC/OS web interface**: `NODES`: `integer`

### CPU

You can customize the amount of CPU allocated to each node. A value of 1.0 is equivalent to one full dedicated CPU core on a machine, although all cores are made available via time slicing. Change this value by editing the **cpus** value under the **node** configuration section. Setting this too low will result in throttled tasks.

Please note that each {{ model.techShortName }} node will use an additonal 1.0 CPU for sidecar services such as backup and nodetool. When provisioning 3 CPUS for each {{ model.techShortName }} node, the actual usage will be 4 CPUS, and this should be taken into account when configuring {{ model.techShortName }} to maximize resource utilization on an agent.

*   **In DC/OS CLI options.json**: `cpus`: number (default: `0.5`)
*   **DC/OS web interface**: `CASSANDRA_CPUS`: `number`

### Memory

You can customize the amount of RAM allocated to each node. Change this value by editing the **mem** value (in MB) under the **node** configuration section. Setting this too low will result in out of memory errors. The `heap.size` setting must also be less than this value to prevent out of memory errors, which can result when the Java Virtual Machine attempts to allocate more memory than is available to the {{ model.techShortName }} process.

*   **In DC/OS CLI options.json**: `mem`: integer (default: `10240`)
*   **DC/OS web interface**: `CASSANDRA_MEMORY_MB`: `integer`

### JMX Port

You can customize the port that {{ model.techName }} listens on for JMX requests, such as those issued by `nodetool`.

*   **In DC/OS CLI options.json**: `jmx_port`: integer (default: `7199`)
*   **DC/OS web interface**: `TASKCFG_ALL_JMX_PORT`: `integer`

### Storage Port

You can customize the port that {{ model.techName }} listens on for inter-node communication.

*   **In DC/OS CLI options.json**: `storage_port`: integer (default: `7000`)
*   **DC/OS web interface**: `TASKCFG_ALL_CASSANDRA_STORAGE_PORT`: `integer`

### SSL Storage Port

You can customize the port that {{ model.techName }} listens on for inter-node communication over SSL.

*   **In DC/OS CLI options.json**: `ssl_storage_port`: integer (default: `7001`)
*   **DC/OS web interface**: `TASKCFG_ALL_CASSANDRA_SSL_STORAGE_PORT`: `integer`

### Native Transport Port

You can customize the port that {{ model.techName }} listens on for CQL queries.

*   **In DC/OS CLI options.json**: `native_transport_port`: integer (default: `9042`)
*   **DC/OS web interface**: `TASKCFG_ALL_CASSANDRA_NATIVE_TRANSPORT_PORT`: `integer`

### RPC Port

You can customize the port that {{ model.techName }} listens on for Thrift RPC requests.

*   **In DC/OS CLI options.json**: `rpc_port`: integer (default: `9160`)
*   **DC/OS web interface**: `TASKCFG_ALL_CASSANDRA_RPC_PORT`: `integer`

### Disks

#### Volume Type

The service supports two volume types:
 - `ROOT` volumes are an isolated directory on the root volume, sharing IO/spindles with the rest of the host system.
 - `MOUNT` volumes are a dedicated device or partition on a separate volume, with dedicated IO/spindles.

Using `MOUNT` volumes requires [additional configuration on each DC/OS agent system](/1.11/storage/mount-disk-resources/), so the service currently uses `ROOT` volumes by default. To ensure reliable and consistent performance in a production environment, you should configure `MOUNT` volumes on the machines that will run the service in your cluster, and then configure the following as `MOUNT` volumes:

To configure the disk type:
*   **In DC/OS CLI options.json**: `disk_type`: string (default: `ROOT`)
*   **DC/OS web interface**: `CASSANDRA_DISK_TYPE`: `string`

#### Disk Scheduler

It is [recommended](http://docs.datastax.com/en/landing_page/doc/landing_page/recommendedSettings.html#recommendedSettings__optimizing-ssds) that you pre-configure your storage hosts to use the deadline IO scheduler in production environments.

## Rack-Aware Placement

{{ model.techShortName }}'s "rack"-based fault domain support is automatically enabled when specifying a placement constraint that uses the `@zone` key. For example, you could spread {{ model.techShortName }} nodes across a minimum of three different zones/racks by specifying the constraint `[["@zone", "GROUP_BY", "3"]]`. When a placement constraint specifying `@zone` is used, {{ model.techShortName }} nodes will be automatically configured with `rack`s that match the names of the zones. If no placement constraint referencing `@zone` is configured, all nodes will be configured with a default rack of `rack1`.

## {{ model.techName }} Configuration

{{ model.techName }}'s configuration is configurable via the `{{ model.packageName }}` section of the service schema. Consult the service schema for a complete listing of available configuration.

## Multi-datacenter deployment

To replicate data across data centers, {{ model.techName }} requires that you configure each cluster with the addresses of the seed nodes from every remote cluster. Here's what starting a multi-data-center {{ model.techName }} deployment would look like, running inside of a single DC/OS cluster:

### Launch two {{ model.techShortName }} clusters

1. Launch the first cluster with the default configuration:

```shell
dcos package install {{ model.packageName }}
```

2. Create an `options.json` file for the second cluster that specifies a different service name and data center name:

```json
{
  "service": {
    "name": "{{ model.serviceName }}2",
    "data_center": "dc2"
  }
}
```

3. Launch the second cluster with these custom options:
```
dcos package install {{ model.packageName }} --options=<options.json>
```

### Get the seed node IP addresses

<p class="message--note"><strong>NOTE: </strong>If your {{ model.techShortName }} clusters are not on the same network, you must set up a proxying layer to route traffic.</p>

1. Get the list of seed node addresses for the first cluster:

```shell
dcos {{ model.packageName }} --name={{ model.serviceName }} endpoints node
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

Note the IPs in the `address` field.

2. Run the same command for your second {{ model.techShortName }} cluster and note the IPs in the `address` field:

```
dcos {{ model.packageName }} --name={{ model.serviceName }}2 endpoints node
```

### Update configuration for both clusters

1. Create an `options2.json` file with the IP addresses of the first cluster (`{{ model.serviceName }}`):

```json
{
  "service": {
    "remote_seeds": "10.0.1.236:9042,10.0.0.119:9042"
  }
}
```

2. Update the configuration of the second cluster:

```
dcos {{ model.packageName }} --name={{ model.serviceName}}2 update start --options=options2.json
```

Perform the same operation on the first cluster, creating an `options.json` which contains the IP addresses of the second cluster (`{{ model.serviceName }}2`)'s seed nodes in the `service.remote_seeds` field. Then, update the first cluster's configuration: `dcos {{ model.packageName }} --name={{ model.serviceName }} update start --options=options.json`.

Both schedulers will restart after each receives the configuration update, and each cluster will communicate with the seed nodes from the other cluster to establish a multi-data-center topology. Repeat this process for each new cluster you add.

You can monitor the progress of the update for the first cluster:

```shell
dcos {{ model.packageName }} --name={{ model.serviceName }} update status
```

Or for the second cluster:

```shell
dcos {{ model.packageName }} --name={{ model.serviceName }}2 update status
```

Your output will resemble:

```shell
deploy (IN_PROGRESS)
└─ node-deploy (IN_PROGRESS)
   ├─ node-0:[server] (COMPLETE)
   ├─ node-1:[server] (COMPLETE)
   └─ node-2:[server] (PREPARED)
```

### Test your multi-datacenter configuration

Be sure to test your deployment using a {{ model.techShortName }} client.
