---
layout: layout.pug
navigationTitle: Configuring 
excerpt: Configuring Confluent Kafka
title: Configuring Confluent Kafka
menuWeight: 20
model: /services/confluent-kafka/data.yml
render: mustache
---

#include /services/include/configuration-install-with-options.tmpl
#include /services/include/configuration-service-settings.tmpl
#include /services/include/configuration-regions.tmpl

## Configuring the ZooKeeper Connection.

{{ model.techName }} requires a running ZooKeeper ensemble to perform its own internal accounting. By default, the DC/OS {{ model.techName }} Service uses the ZooKeeper ensemble made available on the Mesos masters of a DC/OS cluster at `master.mesos:2181/dcos-service-<servicename>`. At install time, you can configure an alternate ZooKeeper for {{ model.techName }} to use. This enables you to increase {{ model.techName }}'s capacity and removes the DC/OS System ZooKeeper ensemble's involvement in running it.

<p class="message--note"><strong>NOTE: </strong>If you are using the <a href="/services/confluent-zookeeper/">DC/OS Apache ZooKeeper service</a>, use the DNS addresses provided by the <tt>dcos confluent-zookeeper endpoints clientport</tt> command as the value of <tt>kafka_zookeeper_uri</tt>.</p>
To configure an alternate Zookeeper instance:

1. Create a file named `options.json` with the following contents. Here is an example `options.json` which points to a `confluent-zookeeper` instance named `confluent-zookeeper`:

    ```json
    {
      "kafka": {
        "kafka_zookeeper_uri": "zookeeper-0-server.{{ model.kafka.zookeeperServiceName }}.autoip.dcos.thisdcos.directory:1140,zookeeper-1-server.{{ model.kafka.zookeeperServiceName }}.autoip.dcos.thisdcos.directory:1140,zookeeper-2-server.{{ model.kafka.zookeeperServiceName }}.autoip.dcos.thisdcos.directory:1140"
      }
    }
    ```

1. Install {{ model.techName }} with the options file you created.

    ```bash
    $ dcos package install {{ model.packageName }} --options="options.json"
    ```

You can also update an already-running {{ model.techName }} instance from the DC/OS CLI, in case you need to migrate your ZooKeeper data elsewhere.

<p class="message--note"><strong>NOTE: </strong>Before performing this configuration change, you must first copy the data from your current ZooKeeper ensemble to the new ZooKeeper ensemble. The new location must have the same data as the previous location during the migration.</p>

```bash
$ dcos {{ model.packageName }} --name={{ model.serviceName }} update start --options=options.json
```

## Extend the Kill Grace Period

When performing a requested restart or replace of a running broker, the Kafka service will wait a default of `30` seconds for a broker to exit, before killing the process. This grace period may be customized via the `brokers.kill_grace_period` setting. In this example we will use the DC/OS CLI to increase the grace period delay to `60` seconds. This example assumes that the Kafka service instance is named `{{ model.serviceName }}`.

During the configuration update, each of the Kafka broker tasks are restarted. During the shutdown portion of the task restart, the previous configuration value for `brokers.kill_grace_period` is in effect. Following the shutdown, each broker task is launched with the new effective configuration value. Take care to monitor the amount of time Kafka brokers take to cleanly shut down by observing their logs.

### Replacing a Broker with Grace

The grace period must also be respected when a broker is shut down before replacement. While it is not ideal that a broker must respect the grace period even if it is going to lose persistent state, this behavior will be improved in future versions of the SDK. Broker replacement generally requires complex and time-consuming reconciliation activities at startup if there was not a graceful shutdown, so the respect of the grace kill period still provides value in most situations. We recommend setting the kill grace period only sufficiently long enough to allow graceful shutdown. Monitor the Kafka broker clean shutdown times in the broker logs to keep this value tuned to the scale of data flowing through the Kafka service.
