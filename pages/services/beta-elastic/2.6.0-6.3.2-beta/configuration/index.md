---
layout: layout.pug
navigationTitle:
excerpt:
title: Configuration
menuWeight: 20
model: /services/elastic/data.yml
render: mustache
---

#include /services/include/configuration-install-with-options.tmpl
#include /services/include/configuration-service-settings.tmpl
#include /services/include/configuration-regions.tmpl

## Configuration Guidelines

- Service name: This needs to be unique for each instance of the service that is running. It is also used as your cluster name.
- Service user: This must be a non-root user that already exists on each agent. The default user is `nobody`.
- X-Pack is installed by default and comes with a 30-day trial license.
- Health check credentials: If you have X-Pack Security enabled, the health check will use the credentials specified in the configuration for authorization. We recommend you create a specific Elastic user/password for this with minimal capabilities rather than using the default superuser `elastic`.
- Plugins: You can specify other plugins via a comma-separated list of plugin names (e.g., “analysis-icu”) or plugin URIs.
- CPU/RAM/Disk/Heap: These will be specific to your DC/OS cluster and your Elasticsearch use cases. Please refer to Elastic’s guidelines for configuration.
- Node counts: At least one data node is required for the cluster to operate at all. You do not need to use a coordinator node. Learn about Elasticsearch node types [here](https://www.elastic.co/guide/en/elasticsearch/reference/current/modules-node.html). There is no maximum for node counts.
- Master transport port: You can pick whichever port works for your DC/OS cluster. The default is 9300. If you want multiple master nodes from different clusters on the same host, specify different master HTTP and transport ports for each cluster. If you want to ensure a particular distribution of nodes of one task type (e.g., master nodes spread across multiple racks, data nodes on one class of machines), specify this via the Marathon placement constraint.
- Serial vs Parallel deployment. By default, the DC/OS Elastic Service tells DC/OS to install everything in parallel. You can change this to serial in order to have each node installed one at a time.
- Serial vs Parallel update. By default, the DC/OS Elastic Service tells DC/OS to update everything serially. You can change this to parallel in order to have each node updated at the same time. This is required, for instance, when you turn X-Pack Security on or off.
- Custom YAML can be appended to `elasticsearch.yml` on each node

### Immutable settings (at cluster creation time via Elastic package UI or JSON options file via CLI)

These setting cannot be changed after installation:

- Service name (aka cluster name). Can be hyphenated, but not underscored
- Master transport port
- Disk sizes/types

### Modifiable settings

- Plugins
- CPU
- Memory
- JVM Heap (do not exceed ½ available node RAM)
- Node count (up, not down)
- Health check credentials
- X-Pack Security enabled/disabled
- Deployment/Upgrade strategy (serial/parallel). Note that serial deployment does not yet wait for the cluster to reach green before proceeding to the next node. This is a known limitation.
- Custom `elasticsearch.yml`

Any other modifiable settings are covered by the various Elasticsearch APIs (cluster settings, index settings, templates, aliases, scripts). It is possible that some of the more common cluster settings will get exposed in future versions of the Elastic DC/OS Service.

## X-Pack Security

[X-Pack](https://www.elastic.co/guide/en/elasticsearch/reference/6.3/setup-xpack.html) is an Elastic Stack extension that provides security, alerting, monitoring, reporting, machine learning, and many other capabilities. By default, when you install Elasticsearch, X-Pack is installed.

You must set the update strategy to `parallel` when you toggle X-Pack Security in order to force a full cluster restart. Afterwards, you should set the update strategy back to `serial` for future updates.

You can toggle this setting at any time. This gives you the option of launching an Elastic cluster without X-Pack Security and then later enabling it. Or, you can run a cluster with X-Pack Security enabled and, if at the end of the 30-day trial period you don't wish to purchase a license, you can disable it without losing access to your data.

### License Expiration

If you let your license expire, remember these two important points:

1. Your data is still there.
1. All data operations (read and write) continue to work.

[Graph](https://www.elastic.co/guide/en/x-pack/current/graph-getting-started.html), [Machine Learning](https://www.elastic.co/guide/en/x-pack/current/ml-getting-started.html), [Alerting and Notification](https://www.elastic.co/guide/en/x-pack/current/watcher-getting-started.html), [Monitoring](https://www.elastic.co/guide/en/x-pack/current/monitoring-getting-started.html), and [Security](https://www.elastic.co/guide/en/x-pack/current/security-getting-started.html) all operate with reduced functionality when the license expires.

Click [here](https://www.elastic.co/guide/en/x-pack/current/license-expiration.html) to learn more about how X-Pack license expiration is handled.

## Topology

Each task in the cluster performs one and only one of the following roles: master, data, ingest, coordinator.

The default placement strategy specifies that no two nodes of any type are distributed to the same agent. You can specify further [Marathon placement constraints](http://mesosphere.github.io/marathon/docs/constraints.html) for each node type. For example, you can specify that ingest nodes are deployed on a rack with high-CPU servers.

![agent](/services/elastic/2.2.0-5.6.5/img/private-nodes-by-agent.png)
![vip](/services/elastic/2.2.0-5.6.5/img/private-node-by-vip.png)

No matter how big or small the cluster is, there will always be exactly 3 master-only nodes with `minimum_master_nodes = 2`.

### Default Topology (with minimum resources to run on 3 agents)

- 3 master-only nodes
- 2 data-only nodes
- 1 coordinator-only node
- 0 ingest-only node

The master/data/ingest/coordinator nodes are set up to only perform their one role. That is, master nodes do not store data, and ingest nodes do not store cluster state.

### Minimal Topology

You can set up a minimal development/staging cluster without ingest nodes, or coordinator nodes. You’ll still get 3 master nodes placed on 3 separate hosts. If you don’t care about replication, you can even use just 1 data node.

Note that the default monitoring behavior is to try to write to an ingest node every few seconds. Without an ingest node, you will see frequent warnings in your master node error logs. While they can be ignored, you can turn them off by disabling X-Pack monitoring in your cluster, like this:

```bash
curl -XPUT -u elastic:changeme master.<service-dns>.l4lb.thisdcos.directory:9200/_cluster/settings -d '{
    "persistent" : {
        "xpack.monitoring.collection.interval" : -1
    }
}'
```



## Custom Elasticsearch YAML

Many Elasticsearch options are exposed via the package configuration in `config.json`, but there may be times when you need to add something custom to the `elasticsearch.yml` file. For instance, if you have written a custom plugin that requires special configuration, you must specify this block of YAML for the Elastic service to use.

Add your custom YAML when installing or updating the Elastic service. In the DC/OS UI, click **Configure**. In the left navigation bar, click `elasticsearch` and find the field for specifying custom elasticsearch YAML. You must base64 encode your block of YAML and enter this string into the field.

You can do this base64 encoding as part of your automated workflow, or you can do it manually with an [online converter](https://www.base64encode.org).

**Note:** You must only specify configuration options that are not already exposed in `config.json`.


## Kibana

[Kibana](https://www.elastic.co/products/kibana) lets you visualize your Elasticsearch data and navigate the Elastic Stack. You can install Kibana like any other DC/OS package via the **Catalog** tab of the DC/OS UI or the DC/OS CLI with:

```bash
dcos package install kibana
```

This will install Kibana using the default name "kibana". The service name can be configured via the `service.name` option. Check the configuration guidelines below for more details.
```bash
dcos package install kibana --options=kibana.json
```

### Accessing the Kibana UI

#### Make sure that Kibana is up and running

Services usually take a moment to finish being installed and ready to use. We can check if our Kibana service is ready with the following command:

```bash
dcos marathon app show kibana | jq -r '.tasksHealthy'
```

If it outputs a `1` it means Kibana is up and running. A `0` means that it is still probably being installed.

Another good indication that Kibana is ready is when the following line appears in the in the `stdout` log for the Kibana task.
```
{"type":"log","@timestamp":"2016-12-08T22:37:46Z","tags":["listening","info"],"pid":12263,"message":"Server running at http://0.0.0.0:5601"}
```

#### Kibana without X-Pack Security enabled

If Kibana was installed without X-Pack Security enabled you should be able to access it through the default DC/OS UI Service link (`https://<cluster-url>/service/<kibana-service-name>`).

#### Kibana with X-Pack Security enabled

Otherwise, due to a currently known [limitation](/services/elastic/2.5.0-6.3.2/limitations#kibana-configured-with-x-pack-security-enabled) you won't be able to access it through the default DC/OS UI Service link.

In this case you'll have to [expose Kibana using EdgeLB](/services/elastic/2.5.0-6.3.2/how-to-guides#expose-kibana-using-edgelb).

### Configuration Guidelines

- Service name (`service.name`): This needs to be unique for each instance of the service that is running. The default is `kibana`.
- Service user (`service.user`): This must be a non-root user that already exists on each agent. The default user is `nobody`.
- If you have X-Pack Security enabled in Elastic (`elasticsearch.xpack_security_enabled: true`), you must also have it enabled in Kibana (`kibana.elasticsearch_xpack_security_enabled: true`).
- Elasticsearch credentials (`kibana.user` and `kibana.password`): If you have X-Pack Security enabled, Kibana will use these credentials for authorized requests to Elasticsearch. The default user is `kibana`, and the password must be configured through the service options.
- Elasticsearch URL: This is a required configuration parameter. The default value `http://coordinator.<elastic-service-name>.l4lb.thisdcos.directory:9200` corresponds to the named VIP that exists when the Elastic package is launched with its own default configuration.

### Configuring Kibana

You can customize the Kibana installation in a variety of ways by specifying a JSON options file. For example, here is a sample JSON options file that:

1. Sets the service name to `another-kibana`
2. Sets the password for Kibana requests to an Elasticsearch cluster configured with authentication
3. Configures Kibana to [communicate with Elasticsearch via TLS](https://www.elastic.co/guide/en/kibana/current/configuring-tls.html)
4. Turns on X-Pack Security, so that Kibana works against an Elasticsearch configured with the same

`another_kibana.json`
```json
{
    "service": {
        "name": "another-kibana"
    },
    "kibana": {
        "password": "0cb46ab2d7790f30ceb32bd3d43fff35",
        "elasticsearch_tls": true,
        "elasticsearch_url": "https://coordinator.elastic.l4lb.thisdcos.directory:9200",
        "elasticsearch_xpack_security_enabled": true
    }
}
```

The command below installs Kibana using a JSON options file:

```bash
dcos package install kibana --options=another_kibana.json
```

To see a list of all possible options run the following command to show the configuration [schema](http://json-schema.org/learn/getting-started-step-by-step.html):

```bash
dcos package describe kibana |  jq -r '.package.config'
```
