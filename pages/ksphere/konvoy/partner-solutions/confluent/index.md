---
layout: layout.pug
navigationTitle: Confluent
title: Confluent
excerpt: Confluent Platform Operator
menuWeight: 30
category: Workload
image: img/confluent.png
---

Confluent Platform is a streaming platform that enables you to organize and manage data from many different sources with one reliable, high performance system.

## quick start

### prerequisites

A `Konvoy cluster` with at least `7 worker nodes` is required to install the `Confluent operator and all platform services`.

We start with downloading the `Confluent helm bundle`.

```sh
curl https://platform-ops-bin.s3-us-west-1.amazonaws.com/operator/confluent-operator-20190726-v0.65.0.tar.gz | tar -xz
cd helm
```

We first need to edit a few things in the `providers/aws.yaml` helm values file.

For `zone` configure the same that you use in the `Konvoy cluster.yaml`.

```yaml
region: us-west-2
kubernetes:
   deployment:
     ## If kubernetes is deployed in multi zone mode then specify availability-zones as appropriate
     ## If kubernetes is deployed in single availability zone then specify appropriate values
     zones:
      - us-west-2c
```

For `kafka` enable `metricsReporter`.

```yaml
kafka:
  name: kafka
  replicas: 3
  ...
  metricReporter:
    enabled: true
```

### install the operator

Install the operator.

```sh
helm install -f ./providers/aws.yaml --name operator --namespace operator --set operator.enabled=true ./confluent-operator
```

Update the default service account with the `image pull secret`.

```sh
kubectl -n operator patch serviceaccount default -p '{"imagePullSecrets": [{"name": "confluent-docker-registry" }]}'
```

### install the platform

In this section we show how to install an instance of the `Confluent platform`. The platform is made of many services.

* zookeeper
* kafka
* controlcenter
* schema registry
* connect
* replicator
* KSQL

You can start getting a first experience with just `zookeeper`, `kafka`, and `controlcenter`.

Install the `zookeeper` service.

```sh
helm install -f ./providers/aws.yaml --name zookeeper --namespace operator --set zookeeper.enabled=true ./confluent-operator
```

Install the `kafka` service.

```sh
helm install -f ./providers/aws.yaml --name kafka --namespace operator --set kafka.enabled=true ./confluent-operator
```

Install the `controlcenter` service.

```sh
helm install -f ./providers/aws.yaml --name controlcenter --namespace operator --set controlcenter.enabled=true ./confluent-operator
```

Install the `schemaregistry` service.

```sh
helm install -f ./providers/aws.yaml --name schemaregistry --namespace operator --set schemaregistry.enabled=true ./confluent-operator
```

Install the `connect` service.

```sh
helm install -f ./providers/aws.yaml --name connect --namespace operator --set connect.enabled=true ./confluent-operator
```

Install the `replicator` service.

```sh
helm install -f ./providers/aws.yaml --name replicator --namespace operator --set replicator.enabled=true ./confluent-operator
```

Install the `KSQL` service.

```sh
helm install -f ./providers/aws.yaml --name ksql --namespace operator --set ksql.enabled=true ./confluent-operator
```

### access the platform

We can use `port forwarding` to access the `controlcenter` service, the console of the platform.

```sh
kubectl port-forward service/controlcenter 9021:9021 -n operator
```

Once you run the command open your browser on [http://localhost:9091]). Login with the username and password that you find in the controlcenter section of the `provider/aws.yaml` file, default is `admin/Developer1`.

Next validate that we can interact with the `kafka cluster` itself.

Exec into one of the kafka pods.

```sh
kubectl -n operator exec -it kafka-0 bash
```

Create a `kafka.properties` file with the following content. The username and password you find under `sasl.plain` in the `providers/aws.yaml` file.

```sh
cat << EOF > kafka.properties
sasl.mechanism=PLAIN
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username=test password=test123;
bootstrap.servers=kafka:9071
security.protocol=SASL_PLAINTEXT
EOF
```

As a first check query the cluster status.

```sh
kafka-broker-api-versions --command-config kafka.properties --bootstrap-server kafka:9071
```

Next we create a topic named `ravi`.

```sh
kafka-topics --create --zookeeper zookeeper:2181/kafka-operator --replication-factor 3 --partitions 1 --topic ravi
```

Lets `produce` some events for the topic.

```sh
seq 10000 | kafka-console-producer --topic ravi --broker-list kafka:9071 --producer.config kafka.properties
```

And then `consume` them.

```sh
kafka-console-consumer --from-beginning --topic ravi --bootstrap-server kafka:9071 --consumer.config kafka.properties
```

### delete the platform

```
helm delete --purge ksql
helm delete --purge replicator
helm delete --purge connect
helm delete --purge schemaregistry
helm delete --purge controlcenter
helm delete --purge kafka
helm delete --purge zookeeper
helm delete --purge operator
```


## information

### documentation

* [confluent operator](https://docs.confluent.io/current/installation/operator/index.html)
* [confluent operator and platform install](https://docs.confluent.io/current/installation/operator/co-deployment.html)
* [confluent platform](https://docs.confluent.io/current/index.html)

#### release notes

* [confluent platform release notes](https://docs.confluent.io/current/release-notes.html)

#### license

* [confluent license agreement](https://www.confluent.io/software-evaluation-license/)

#### maintenance & support

* [confluent support](https://www.confluent.io/confluent-cloud/support/)
