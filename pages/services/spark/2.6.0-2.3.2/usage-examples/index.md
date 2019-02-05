---
layout: layout.pug
navigationTitle: Usage Examples
excerpt: Using DC/OS Apache Spark
title: Usage Examples
menuWeight: 10
featureMaturity:
render: mustache
model: /services/spark/data.yml
---
This section describes a basic and advanced example of how to use DC/OS {{ model.techName }}.

# Basic

1. Perform a default installation by following the instructions in the [Install and Customize](/services/spark/2.6.0-2.3.2/install/) section.

1. Run a {{ model.techShortName }} job:

        dcos spark run --submit-args="--class org.apache.spark.examples.SparkPi https://downloads.mesosphere.com/spark/assets/spark-examples_2.11-2.3.2.jar 30"

1. Run a Python {{ model.techShortName }} job:

        dcos spark run --submit-args="https://downloads.mesosphere.com/spark/examples/pi.py 30"

1. Run an R {{ model.techShortName }} job:

        dcos spark run --submit-args="https://downloads.mesosphere.com/spark/examples/dataframe.R"

1. View the status of your job using the Spark cluster dispatcher or use the Mesos UI to see job logs.

# Advanced

Run a {{ model.techShortName }} Streaming job with Kafka.

Examples of {{ model.techShortName }} Streaming applications that connect to a secure Kafka cluster can be found at [spark-build](https://github.com/mesosphere/spark-build/blob/2.6.0-2.3.2/tests/jobs/scala/src/main/scala/KafkaJobs.scala). As mentioned in the [Kerberos](/services/spark/2.6.0-2.3.2/kerberos/) section, {{ model.techShortName }} requires a JAAS file, the `krb5.conf`, and the keytab.

An example of a JAAS file is:

        KafkaClient {
            com.sun.security.auth.module.Krb5LoginModule required
            useKeyTab=true
            storeKey=true
            keyTab="/mnt/mesos/sandbox/kafka-client.keytab"
            useTicketCache=false
            serviceName="kafka"
            principal="client@LOCAL";
        };

The corresponding `dcos spark` command would be:

        dcos spark run --submit-args="\
        --conf spark.mesos.containerizer=mesos \  # required for secrets
        --conf spark.mesos.uris=<URI_of_jaas.conf> \
        --conf spark.mesos.driver.secret.names=spark/__dcos_base64___keytab \  # base64 encoding of binary secrets required in DC/OS 1.10 or lower
        --conf spark.mesos.driver.secret.filenames=kafka-client.keytab \
        --conf spark.mesos.executor.secret.names=spark/__dcos_base64___keytab \
        --conf spark.mesos.executor.secret.filenames=kafka-client.keytab \
        --conf spark.mesos.task.labels=DCOS_SPACE:/spark \
        --conf spark.scheduler.minRegisteredResourcesRatio=1.0 \
        --conf spark.executorEnv.KRB5_CONFIG_BASE64=W2xpYmRlZmF1bHRzXQpkZWZhdWx0X3JlYWxtID0gTE9DQUwKCltyZWFsbXNdCiAgTE9DQUwgPSB7CiAgICBrZGMgPSBrZGMubWFyYXRob24uYXV0b2lwLmRjb3MudGhpc2Rjb3MuZGlyZWN0b3J5OjI1MDAKICB9Cg== \
        --conf spark.mesos.driverEnv.KRB5_CONFIG_BASE64=W2xpYmRlZmF1bHRzXQpkZWZhdWx0X3JlYWxtID0gTE9DQUwKCltyZWFsbXNdCiAgTE9DQUwgPSB7CiAgICBrZGMgPSBrZGMubWFyYXRob24uYXV0b2lwLmRjb3MudGhpc2Rjb3MuZGlyZWN0b3J5OjI1MDAKICB9Cg== \
        --class MyAppClass <URL_of_jar> [application args]"

<p class="message--note"><strong>NOTE: </strong>There are additional walkthroughs available in the <code>docs/walkthroughs/</code> directory of Mesosphere's <a href="https://github.com/mesosphere/spark-build/"><code>spark-build</code></a>.</p>
