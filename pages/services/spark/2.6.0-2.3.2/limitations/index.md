---
layout: layout.pug
navigationTitle:
excerpt: Limitations of DC/OS Apache Spark
title: Limitations
menuWeight: 135
featureMaturity:
render: mustache
model: /services/spark/data.yml
---

*   Mesosphere does not provide support for {{ model.techShortName }} app development, such as writing a Python app to process data from
    Kafka or writing Scala code to process data from HDFS.

*   {{ model.techShortName }} jobs run in Docker containers. The first time you run a {{ model.techShortName }} job on a node, it might take longer than you
    expect because of the `docker pull`.

*   DC/OS Apache {{ model.techShortName }} only supports running the {{ model.techShortName }} shell from within a DC/OS cluster. See the {{ model.techShortName }} Shell section
    for more information. For interactive analytics, we recommend Zeppelin, which supports visualizations and dynamic
    dependency management.

*   With {{ model.techShortName }} SSL/TLS enabled, if you specify environment-based secrets with
    `{{ model.serviceName }}.mesos.[driver|executor].secret.envkeys`, the keystore and truststore secrets will also show up as
    environment-based secrets, due to the way secrets are implemented. You can ignore these extra environment variables.

*   Anyone who has access to the {{ model.techShortName }} (Dispatcher) service instance has access to all secrets available to it. Do not
    grant users access to the {{ model.techShortName }} Dispatcher instance unless they are also permitted to access all secrets available
    to the {{ model.techShortName }} Dispatcher instance.

*   When using Kerberos and HDFS, the {{ model.techShortName }} Driver generates delegation tokens and distributes them to it's Executors
    via RPC.  Authentication of the Executors with the Driver is done with a [shared
    secret](https://docs.mesosphere.com/services/{{ model.serviceName }}/latest/security/#using-the-secret-store). Without authentication, it is possible
    for executor containers to register with the Driver and retrieve the delegation tokens. To secure delegation token
    distribution, use the `--executor-auth-secret` option.

*   CNI limitations:
  * Configuration of network plugin labels from DC/OS UI supported only in JSON editing mode.
  * Network plugin labels are not supported by Docker containerizer.
  * Currently, DC/OS Admin Router doesn't support virtual networks so DC/OS {{ model.techShortName }} endpoints
  will not be accessible from CLI and jobs need to be submitted from a routable network.
