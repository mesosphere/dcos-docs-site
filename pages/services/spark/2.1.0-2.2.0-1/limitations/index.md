---
layout: layout.pug
navigationTitle:  Limitations
title: Limitations
menuWeight: 130
excerpt:
featureMaturity:
enterprise: false
---

<!-- This source repo for this topic is https://github.com/mesosphere/spark-build -->


*   Mesosphere does not provide support for Spark app development, such as writing a Python app to process data from Kafka or writing Scala code to process data from HDFS.

*   Spark jobs run in Docker containers. The first time you run a Spark job on a node, it might take longer than you expect because of the `docker pull`.

*   DC/OS Apache Spark only supports running the Spark shell from within a DC/OS cluster. See the Spark Shell section for more information. For interactive analytics, we recommend Zeppelin, which supports visualizations and dynamic dependency management.

*   {{ model.techShortName }} does not support CNI at this time. If {{ model.techShortName }} Drivers and       Executors are deployed on CNI Networks, Shuffle Operations will fail.
