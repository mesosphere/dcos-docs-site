---
layout: layout.pug
navigationTitle:  Log Management with ELK
title: Log Management with ELK
menuWeight: 1
excerpt: Managing system and application logs from cluster nodes
render: mustache
model: /1.13/data.yml
enterprise: false
---



You can pipe system and application logs from the nodes in a DC/OS cluster to an Elasticsearch server.


# What this document does and does not cover

This document describes how to send Fluent Bit output from each node to a centralized Elasticsearch instance. This document describes how to directly stream from Fluent Bit into Elasticsearch. Logstash is not used in this architecture. If you are interested in filtering, parsing and understanding the logs with an intermediate Logstash stage, see the Logstash [documentation][4] and the example in [Filtering logs with ELK][2].

This document does not explain how to set up and configure an Elasticsearch server. This document does not describe how to set up secure TLS communication between the Fluent Bit instances and Elasticsearch. For details on how to achieve this, see the [Fluent Bit][1] and [Elasticsearch][3] documentation.

**Prerequisites**

*   An existing Elasticsearch installation that can ingest data for indexing
*   All DC/OS nodes must be able to connect to your Elasticsearch server on the port used for communication between Elasticsearch and Fluent Bit (9200 by default)
*   A location on each DC/OS node for your custom Fluent Bit config. This tutorial will use `/etc/fluent-bit/`.

## Step 1: Master nodes

For each master node in your DC/OS cluster, create a file `/etc/fluent-bit/fluent-bit.conf` that includes the default master Fluent Bit config and adds your configuration for the Elasticsearch output plugin. For more information on configuring Fluent Bit to send logs to Elasticsearch, see the [Fluent Bit documentation][1].

```
@INCLUDE /opt/mesosphere/etc/fluent-bit/master.conf
[OUTPUT]
     Name es
     Match *
     Host <Elasticsearch host>
     Port <Elasticsearch port>
```

## Step 2: Agent nodes

For each agent node in your DC/OS cluster, create a file `/etc/fluent-bit/fluent-bit.conf` that includes the default master Fluent Bit config and adds your configuration for the Elasticsearch output plugin. For more information on configuring Fluent Bit to send logs to Elasticsearch, see the [Fluent Bit documentation][1].

```
@INCLUDE /opt/mesosphere/etc/fluent-bit/agent.conf
[OUTPUT]
     Name es
     Match *
     Host <Elasticsearch host>
     Port <Elasticsearch port>
```

## Step 3: All nodes

For all nodes in your DC/OS cluster:

1.  Create a file `/etc/fluent-bit/fluent-bit.env` that sets the `FLUENT_BIT_CONFIG_FILE` environment variable to the location of your Fluent Bit config:

```
FLUENT_BIT_CONFIG_FILE=/etc/fluent-bit/fluent-bit.conf
```

2.  Create a directory `/etc/systemd/system/dcos-fluent-bit.service.d`:

```
$ sudo mkdir -p /etc/systemd/system/dcos-fluent-bit.service.d
```

3.  Create a file `/etc/systemd/system/dcos-fluent-bit.service.d/override.conf` that applies your custom config to Fluent Bit:

```
[Service]
EnvironmentFile=/etc/fluent-bit/fluent-bit.env
```

4.  Reload systemd to update `dcos-fluent-bit.service`, and restart it:

```
$ sudo systemctl daemon-reload
$ sudo systemctl restart dcos-fluent-bit.service
```

# What's Next

For details on how to filter your logs with ELK, see [Filtering DC/OS logs with ELK][2].

 [1]: https://docs.fluentbit.io/manual/output/elasticsearch
 [2]: ../filter-elk/
 [3]: https://www.elastic.co/guide/en/elasticsearch/reference/5.0/index.html
 [4]: https://www.elastic.co/guide/en/logstash/current/index.html
