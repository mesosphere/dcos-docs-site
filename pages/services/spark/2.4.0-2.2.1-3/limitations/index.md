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

*   {{ model.techShortName }} runs all of its components in Docker containers. Since the Docker image contains a full Linux userspace with
    its own `/etc/users` file, it is possible for the user `nobody` to have a different UID inside the
    container than on the host system. Although user `nobody` has UID 65534 by convention on many systems, this is not
    always the case. As Mesos does not perform UID mapping between Linux user namespaces, specifying a service user of
    `nobody` in this case will cause access failures when the container user attempts to open or execute a filesystem
    resource owned by a user with a different UID, preventing the service from launching. If the hosts in your cluster
    have a UID for `nobody` other than 65534, you will need to maintain the default user (`root`) to run DC/OS {{ model.techShortName }}
    successfully.

*   {{ model.techShortName }} does not support CNI at this time. If {{ model.techShortName }} Drivers and       Executors are deployed on CNI Networks, Shuffle Operations will fail.
