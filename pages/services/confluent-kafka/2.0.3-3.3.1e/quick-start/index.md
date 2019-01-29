---
layout: layout.pug
navigationTitle:
title: Quick Start
menuWeight: 40
excerpt:
featureMaturity:
enterprise: false
---

<!-- This source repo for this topic is https://github.com/mesosphere/confluent -->


1. Install DC/OS on your cluster. See [the documentation](/latest/administration/installing/) for instructions.

1. If you are using open source DC/OS, install a Beta Confluent Kafka cluster with the following command from the DC/OS CLI. If you are using Enterprise DC/OS, you may need to follow additional instructions. See the Install and Customize section for more information.

   ```
   dcos package install confluent-kafka
   ```

   Alternatively, you can install Beta Confluent Kafka from [the DC/OS web interface](/latest/usage/webinterface/).

   Confluent Kafka will deploy with a default configuration. You can monitor deployment at the Services tab of the DC/OS web interface.

1. Create a new topic.

        dcos confluent-kafka topic create topic1


1. Find Zookeeper and broker endpoint information.

        dcos confluent-kafka endpoints zookeeper
        master.mesos:2181/dcos-service-kafka

        dcos confluent-kafka endpoints broker
        {
          "address": [
            "10.0.3.226:1000",
            "10.0.3.98:1000",
            "10.0.0.120:1000"
          ],
          "dns": [
            "kafka-2-broker.confluent-kafka.autoip.dcos.thisdcos.directory:1025",
            "kafka-0-broker.confluent-kafka.autoip.dcos.thisdcos.directory:1025",
            "kafka-1-broker.confluent-kafka.autoip.dcos.thisdcos.directory:1025"
          ],
          "vip": "broker.confluent-kafka.l4lb.thisdcos.directory:9092"
        }

1. Produce and consume data.

        dcos node ssh --master-proxy --leader

        core@ip-10-0-6-153 ~ docker run -it mesosphere/kafka-client

        root@7d0aed75e582:/bin# echo "Hello, World." | ./kafka-console-producer.sh --broker-list kafka-0-broker.kafka.autoip.dcos.thisdcos.directory:1000, kafka-1-broker.kafka.autoip.dcos.thisdcos.directory:1000, kafka-2-broker.kafka.autoip.dcos.thisdcos.directory:1000 --topic topic1

        root@7d0aed75e582:/bin# ./kafka-console-consumer.sh --zookeeper master.mesos:2181/dcos-service-kafka --topic topic1 --from-beginning
        Hello, World.


See also [Connecting clients][1].

 [1]: /services/kafka/2.0.4-1.0.0/connecting-clients/
