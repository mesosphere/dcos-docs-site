---
layout: layout.pug
navigationTitle: Confluent
title: Confluent
excerpt: Confluent Platform Operator
menuWeight: 30
category: Workload
image: img/confluent.png
---
# Confluent Platform

Confluent Platform is a streaming platform that enables you to organize and manage data from many different sources with one reliable, high performance system.

## Quick Start

### Prerequisites

A `Konvoy cluster` with at least `7 worker nodes` is required to install the `Confluent operator and all platform services`.

We start by downloading the `Confluent helm bundle`.

```bash
curl https://platform-ops-bin.s3-us-west-1.amazonaws.com/operator/confluent-operator-20190726-v0.65.0.tar.gz | tar -xz
cd helm
```

We first need to edit a few things in the `providers/aws.yaml` helm values file.

* For `zone` configure the same that you use in the `Konvoy cluster.yaml`.

  ```yaml
  region: us-west-2
  kubernetes:
    deployment:
      ## If kubernetes is deployed in multi zone mode then specify availability-zones as appropriate
      ## If kubernetes is deployed in single availability zone then specify appropriate values
      zones:
        - us-west-2c
  ```

* For `kafka` enable `metricsReporter`.

  ```yaml
  kafka:
    name: kafka
    replicas: 3
    ...
    metricReporter:
      enabled: true
  ```

#### Enable Load Balancing For External Access

There are a few more things that you have to edit in the `providers/aws.yaml` helm values file in case you want access to the Confluent platform services from outside the Konvoy cluster.

Here we show how to do that configuration for the `kafka cluster`, but it works analogues for the other platform services.

For `kafka` enable `loadBalancer`, and set the `domain` to one you own.

```yaml
kafka:
  name: kafka
  replicas: 3
  ...
  loadBalancer:
    enabled: true
    domain: "mydomain.com"
  ...
```

The assumption is that the `brokers` of the `kafka cluster` are available at the following external endpoints:

```bash
b0.mydomain.com
b1.mydomain.com
b2.mydomain.com
```

For this to be true you will have to create `CNAME DNS record's` with your DNS provider (for example, AWS Route 53, ...) once the cluster is up and running. More on this in a later step.

### Install the Operator

1. Install the operator.

    ```bash
    helm install -f ./providers/aws.yaml --name operator --namespace operator --set operator.enabled=true ./confluent-operator
    ```

1. Update the default service account with the `image pull secret`.

    ```bash
    kubectl -n operator patch serviceaccount default -p '{"imagePullSecrets": [{"name": "confluent-docker-registry" }]}'
    ```

### Install the Platform

In this section we show how to install an instance of the `Confluent platform`. The platform is made of many services.

* zookeeper
* kafka
* controlcenter
* schema registry
* connect
* replicator
* KSQL

You can start getting a first experience with just `zookeeper`, `kafka`, and `controlcenter`.

1. Install the `zookeeper` service.

    ```bash
    helm install -f ./providers/aws.yaml --name zookeeper --namespace operator --set zookeeper.enabled=true ./confluent-operator
    ```

1.  Install the `kafka` service.

    ```bash
    helm install -f ./providers/aws.yaml --name kafka --namespace operator --set kafka.enabled=true ./confluent-operator
    ```

1. Install the `controlcenter` service.

    ```bash
    helm install -f ./providers/aws.yaml --name controlcenter --namespace operator --set controlcenter.enabled=true ./confluent-operator
    ```

1. Install the `schemaregistry` service.

    ```bash
    helm install -f ./providers/aws.yaml --name schemaregistry --namespace operator --set schemaregistry.enabled=true ./confluent-operator
    ```

1. Install the `connect` service.

    ```bash
    helm install -f ./providers/aws.yaml --name connect --namespace operator --set connect.enabled=true ./confluent-operator
    ```

1. Install the `replicator` service.

    ```bash
    helm install -f ./providers/aws.yaml --name replicator --namespace operator --set replicator.enabled=true ./confluent-operator
    ```

1. Install the `KSQL` service.

    ```bash
    helm install -f ./providers/aws.yaml --name ksql --namespace operator --set ksql.enabled=true ./confluent-operator
    ```

### Access the Platform

#### Access to Control Center

We can use `port forwarding` to access the `controlcenter` service, the console of the platform.

```bash
kubectl port-forward service/controlcenter 9021:9021 -n operator
```

After you run the command, open your browser to [http://localhost:9091](http://localhost:9091). Log in with the username and password that you find in the controlcenter section of the `provider/aws.yaml` file. The default is `admin/Developer1`.

#### Internal Access To Kafka

Next validate that we can interact with the `kafka cluster` itself.

Exec into one of the kafka pods.

```bash
kubectl -n operator exec -it kafka-0 bash
```

Create a `kafka.properties` file with the following content. The username and password you find under `sasl.plain` in the `providers/aws.yaml` file.

```bash
cat << EOF > kafka.properties
sasl.mechanism=PLAIN
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username=test password=test123;
bootstrap.servers=kafka:9071
security.protocol=SASL_PLAINTEXT
EOF
```

As a first check, query the cluster status.

```bash
kafka-broker-api-versions --command-config kafka.properties --bootstrap-server kafka:9071
```

Next we create a topic named `ravi`.

```bash
kafka-topics --create --zookeeper zookeeper:2181/kafka-operator --replication-factor 3 --partitions 1 --topic ravi
```

Let's `produce` some events for the topic.

```bash
seq 10000 | kafka-console-producer --topic ravi --broker-list kafka:9071 --producer.config kafka.properties
```

And then `consume` them.

```bash
kafka-console-consumer --from-beginning --topic ravi --bootstrap-server kafka:9071 --consumer.config kafka.properties
```

#### External Access to Kafka

This step assumes that you enabled `external load balancer` access for `kafka` as described earlier.

Once the `kafka cluster` is up and running you should see the following `Services` with their `external IP's`. Note the IP's will be different in your case.

```bash
kubectl get services -n operator

NAME                         TYPE           CLUSTER-IP    EXTERNAL-IP                                                               PORT(S)                                        AGE
...
kafka-0-lb                   LoadBalancer   10.0.27.180   ab6c807cf45d34b2d8bc82e06c267ad9-601100096.us-west-2.elb.amazonaws.com    9092:31232/TCP                                 21m
kafka-1-lb                   LoadBalancer   10.0.27.139   a368d00ce18a04d59aea7b7d3bbd579a-561986806.us-west-2.elb.amazonaws.com    9092:31076/TCP                                 21m
kafka-2-lb                   LoadBalancer   10.0.58.175   a4396d1859ecd4b7ca8334c002d69243-499801305.us-west-2.elb.amazonaws.com    9092:32187/TCP                                 21m
kafka-bootstrap-lb           LoadBalancer   10.0.52.87    a46558d70ca424fcdbc008e29e7d48a8-1982953157.us-west-2.elb.amazonaws.com   9092:31129/TCP                                 21m
...
```

Use your respective `external IPs` to create the following `CNAME DNS records` with your DNS provider (e.g. AWS Route 53, ...).

```ba
b0.mydomain.com      -->   ab6c807cf45d34b2d8bc82e06c267ad9-601100096.us-west-2.elb.amazonaws.com
b1.mydomain.com      -->   a368d00ce18a04d59aea7b7d3bbd579a-561986806.us-west-2.elb.amazonaws.com
b2.mydomain.com      -->   a46558d70ca424fcdbc008e29e7d48a8-1982953157.us-west-2.elb.amazonaws.com
kafka.mydomain.com   -->   a46558d70ca424fcdbc008e29e7d48a8-1982953157.us-west-2.elb.amazonaws.com
```

Next use `control center` to create a `new topic named ravi`.

In the following use `kafkacat` to `produce` and `consume` from the new topic. On `Mac OS X` kafkacat can be installed using `brew`. You can run `kafkacat` from one command line in sequence. First use `kafkacat -P ...` to produce a few messages and then use `kafkacat -C ...` to consume them.

```bash
kafkacat -P -t ravi -b kafka.mydomain.com:9092 -X security.protocol=SASL_PLAINTEXT -X sasl.mechanisms=PLAIN -X sasl.username=test -X sasl.password=test123
```

```bash
kafkacat -C -t ravi -b kafka.mydomain.com:9092 -X security.protocol=SASL_PLAINTEXT -X sasl.mechanisms=PLAIN -X sasl.username=test -X sasl.password=test123
```

### Delete The Platform

```bash
helm delete --purge ksql
helm delete --purge replicator
helm delete --purge connect
helm delete --purge schemaregistry
helm delete --purge controlcenter
helm delete --purge kafka
helm delete --purge zookeeper
helm delete --purge operator
```


## Information

### Documentation

* [confluent operator and platform install](https://docs.confluent.io/current/installation/operator/co-deployment.html)
* [confluent operator](https://docs.confluent.io/current/installation/operator/index.html)
* [confluent platform](https://docs.confluent.io/current/index.html)

#### Release Notes

* [Confluent platform release notes](https://docs.confluent.io/current/release-notes.html)

#### Licensing

* [Confluent license agreement](https://www.confluent.io/software-evaluation-license/)

#### Maintenance & Support

* [Confluent support](https://www.confluent.io/confluent-cloud/support/)
