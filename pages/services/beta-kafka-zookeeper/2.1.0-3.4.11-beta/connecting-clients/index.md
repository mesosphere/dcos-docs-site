---
layout: layout.pug
navigationTitle:
title: Connecting Clients
menuWeight: 40
excerpt: Using service discovery to connect clients
featureMaturity:
enterprise: false
---

<!-- https://github.com/mesosphere/dcos-zookeeper/ -->


# Connecting Clients

One of the benefits of running containerized services is that they can be placed anywhere in the cluster. Because they can be deployed anywhere in the cluster, clients need a way to find the service. This is where service discovery comes in.

<a name="discovering-endpoints"></a>
## Discovering endpoints

Once the service is running, you may view information about its endpoints via either of the following methods:

- CLI:
  - List endpoint types: `dcos beta-kafka-zookeeper endpoints`
  - View endpoints for an endpoint type: `dcos beta-kafka-zookeeper endpoints <endpoint>`
- Web:
  - List endpoint types: `<dcos-url>/service/kafka-zookeeper/v1/endpoints`
  - View endpoints for an endpoint type: `<dcos-url>/service/kafka-zookeeper/v1/endpoints/<endpoint>`

ZooKeeper returns the following endpoint:

- `clientport`

To see node addresses for the `clientport` endpoints, run `dcos beta-kafka-zookeeper endpoints clientport`. A typical response resembles the following:

```json
{
  "address": [
    "10.0.0.49:1140",
    "10.0.2.253:1140",
    "10.0.1.27:1140"
  ],
  "dns": [
    "zookeeper-0-server.kafka-zookeeper.autoip.dcos.thisdcos.directory:1140",
    "zookeeper-1-server.kafka-zookeeper.autoip.dcos.thisdcos.directory:1140",
    "zookeeper-2-server.kafka-zookeeper.autoip.dcos.thisdcos.directory:1140"
  ]
}
```

In general, the `.thisdcos` endpoints will only work from within the same DC/OS cluster. From outside the cluster, you can either use the direct IPs (assuming you are on the same network as the private agents) or set up a proxy service that acts as a frontend to your DC/OS Apache ZooKeeper instance. For development and testing purposes, you can use [DC/OS Tunnel](/latest/administration/access-node/tunnel/) to access services from outside the cluster, but this option is not suitable for production use.

<a name="connecting-kafka-to-zookeeper"></a>
## Connecting Kafka to ZooKeeper

One important use for the DC/OS Apache ZooKeeper service is to have your DC/OS Apache Kafka service connect to it. This enables you to increase Kafka's capacity and removes the system ZooKeeper's involvment in the service.

Follow the "Alternate ZooKeeper" instructions in the [Kafka documentation](/service-docs/kafka/2.0.2-0.11.0/install/#alternate-zookeeper). To obtain the proper value for the `kafka_zookeeper_uri`, run:

`dcos beta-kafka-zookeeper endpoints clientport`

Then, set the `beta-kafka_zookeeper_uri` to the comma-delimited list of DNS addresses.

To create a DC/OS Apache Kafka cluster that connects to this already-running ZooKeeper instance, go to the DC/OS web interface and search for the Kafka service under the Catalog tab. Click "Configure" and under the "kafka" tab, paste the vip value above into the "Custom ZooKeeper Path" configuration option. After deployment, navigate back to the native ZooKeeper CLI commands and 'ls' to verify that the proper Kafka znodes have been created, and that your Kafka service is in fact connected to the custom ZooKeeper instance.

Alternatively, you can install from the DC/OS CLI with the following `options.json` file specified.

```json
{
    "kafka": {
      "kafka_zookeeper_uri": "zookeeper-0-server.kafka-zookeeper.autoip.dcos.thisdcos.directory:1140,zookeeper-1-server.kafka-zookeeper.autoip.dcos.thisdcos.directory:1140,zookeeper-2-server.kafka-zookeeper.autoip.dcos.thisdcos.directory:1140"
    }
}
```

Install Kafka with the options file.

```shell
dcos package install kafka --options="options.json"
```

You can also update an already-running Kafka instance from the DC/OS CLI, in case you need to migrate your ZooKeeper data elsewhere.

**Note:** The ZooKeeper ensemble you point to must have the same data as the previous ZooKeeper ensemble.

```shell
dcos kafka --name=/kafka update start --options=options.json
```
