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
1.  Perform a default installation by following the instructions in the [Install and Customize](/services/spark/2.4.0-2.2.1-3/install/) section.

1.  Run a {{ model.techShortName }} job:

        dcos {{ model.packageName }} run --submit-args="--class org.apache.{{ model.packageName }}.examples.SparkPi https://downloads.mesosphere.com/{{ model.packageName }}/assets/{{ model.packageName }}-examples_2.11-2.0.1.jar 30"

1.  Run a Python {{ model.techShortName }} job:

        dcos {{ model.packageName }} run --submit-args="https://downloads.mesosphere.com/{{ model.packageName }}/examples/pi.py 30"

1.  Run an R {{ model.techShortName }} job:

        dcos {{ model.packageName }} run --submit-args="https://downloads.mesosphere.com/{{ model.packageName }}/examples/dataframe.R"

1.  Visit the {{ model.techShortName }} cluster dispatcher at `http://<dcos-url>/service/{{ model.packageName }}/` to view the status of your job. Also visit the Mesos UI at `http://<dcos-url>/mesos/` to see job logs.

# Advanced

Run a {{ model.techShortName }} Streaming job with Kafka.

Examples of {{ model.techShortName }} Streaming applications that connect to a secure Kafka cluster can be found at [{{ model.packageName }}-build](https://github.com/mesosphere/{{ model.packageName }}-build/blob/beta-2.1.1-2.2.0-2/tests/jobs/scala/src/main/scala/KafkaJobs.scala). As mentioned in the [Kerberos](/services/spark/2.4.0-2.2.1-3/kerberos/) section, {{ model.techShortName }} requires a JAAS file, the `krb5.conf`, and the keytab. 

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
    
The corresponding `dcos {{ model.packageName }}` command would be: 

        dcos {{ model.packageName }} run --submit-args="\
        --conf {{ model.packageName }}.mesos.containerizer=mesos \  # required for secrets
        --conf {{ model.packageName }}.mesos.uris=<URI_of_jaas.conf> \
        --conf {{ model.packageName }}.mesos.driver.secret.names={{ model.packageName }}/__dcos_base64___keytab \  # base64 encoding of binary secrets required in DC/OS 1.10 or lower
        --conf {{ model.packageName }}.mesos.driver.secret.filenames=kafka-client.keytab \
        --conf {{ model.packageName }}.mesos.executor.secret.names={{ model.packageName }}/__dcos_base64___keytab \
        --conf {{ model.packageName }}.mesos.executor.secret.filenames=kafka-client.keytab \
        --conf {{ model.packageName }}.mesos.task.labels=DCOS_SPACE:/{{ model.packageName }} \ 
        --conf {{ model.packageName }}.scheduler.minRegisteredResourcesRatio=1.0 \
        --conf {{ model.packageName }}.executorEnv.KRB5_CONFIG_BASE64=W2xpYmRlZmF1bHRzXQpkZWZhdWx0X3JlYWxtID0gTE9DQUwKCltyZWFsbXNdCiAgTE9DQUwgPSB7CiAgICBrZGMgPSBrZGMubWFyYXRob24uYXV0b2lwLmRjb3MudGhpc2Rjb3MuZGlyZWN0b3J5OjI1MDAKICB9Cg== \
        --conf {{ model.packageName }}.mesos.driverEnv.KRB5_CONFIG_BASE64=W2xpYmRlZmF1bHRzXQpkZWZhdWx0X3JlYWxtID0gTE9DQUwKCltyZWFsbXNdCiAgTE9DQUwgPSB7CiAgICBrZGMgPSBrZGMubWFyYXRob24uYXV0b2lwLmRjb3MudGhpc2Rjb3MuZGlyZWN0b3J5OjI1MDAKICB9Cg== \
        --class MyAppClass <URL_of_jar> [application args]"



<p class="message--note"><strong>NOTE: </strong>There are additional walkthroughs available in the <code>docs/walkthroughs/</code> directory of Mesosphere's <code>{{ model.packageName }}-build</code> <a href="https://github.com/mesosphere/spark-build/docs/walkthroughs/">repo</a>).</p>
