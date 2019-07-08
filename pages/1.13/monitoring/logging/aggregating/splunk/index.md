---
layout: layout.pug
navigationTitle:  Log Management with Splunk
title: Log Management with Splunk
menuWeight: 3
excerpt: Managing system and application logs with a Splunk server
render: mustache
model: /1.13/data.yml
enterprise: false
---

# Overview
You can pipe system and application logs from a DC/OS cluster to your existing Splunk server. This document describes how to configure Fluent Bit to send output from each node to a Splunk installation. This document does not explain how to set up and configure a Splunk server.

These instructions are based on CoreOS and might differ substantially from other Linux distributions.

**Prerequisites**

*   An existing Splunk installation that can ingest data for indexing
*   All DC/OS nodes must be able to connect to your Splunk `indexer via HTTP or HTTPS
*   A location on each DC/OS node for your custom Fluent Bit config. This tutorial will use `/etc/fluent-bit/`.

## Step 1: Master nodes

For each master node in your DC/OS cluster, create a file `/etc/fluent-bit/fluent-bit.conf` that includes the default master Fluent Bit config and adds your configuration for the Splunk output plugin. For more information on configuring Fluent Bit to send logs to Splunk, see the [Fluent Bit documentation](https://docs.fluentbit.io/manual/output/splunk).

```
@INCLUDE /opt/mesosphere/etc/fluent-bit/master.conf
[OUTPUT]
    Name splunk
    Match *
    Host <Splunk server host>
    Port <Splunk server port>
    Splunk_Token <Splunk HTTP event collector token>
```

## Step 2: Agent nodes

For each agent node in your DC/OS cluster, create a file `/etc/fluent-bit/fluent-bit.conf` that includes the default agent Fluent Bit config and adds your configuration for the Splunk output plugin. For more information on configuring Fluent Bit to send logs to Splunk, see the [Fluent Bit documentation](https://docs.fluentbit.io/manual/output/splunk).

```
@INCLUDE /opt/mesosphere/etc/fluent-bit/agent.conf
[OUTPUT]
    Name splunk
    Match *
    Host <Splunk server host>
    Port <Splunk server port>
    Splunk_Token <Splunk HTTP event collector token>
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

# What's next

For details on how to filter your logs with Splunk, see [Filtering logs with Splunk][3].

 [2]: http://www.splunk.com/en_us/download/universal-forwarder.html
 [3]: ../filter-splunk/
