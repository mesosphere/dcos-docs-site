---
layout: layout.pug
navigationTitle:  Spark 1.1.1-2.2.0
title: Spark 1.1.1-2.2.0
menuWeight: -1
excerpt: Welcome to the documentation for DC/OS Apache Spark. 
featureMaturity:
enterprise: false
---

<!-- This source repo for this topic is https://github.com/mesosphere/spark-build -->


Welcome to the documentation for DC/OS Apache Spark.

Apache Spark is a fast and general-purpose cluster computing system for big data. It provides high-level APIs in Scala, Java, Python, and R, and an optimized engine that supports general computation graphs for data analysis. It also supports a rich set of higher-level tools including Spark SQL for SQL and DataFrames, MLlib for machine learning, GraphX for graph processing, and Spark Streaming for stream processing. For more information, see the [Apache Spark documentation][1].

DC/OS Apache Spark consists of [Apache Spark with a few custom commits][17] along with [DC/OS-specific packaging][18].

DC/OS Apache Spark includes:

*   [Mesos Cluster Dispatcher][2]
*   [Spark History Server][3]
*   DC/OS Apache Spark CLI
*   Interactive Spark shell

# Benefits

*   Utilization: DC/OS Apache Spark leverages Mesos to run Spark on the same cluster as other DC/OS services
*   Improved efficiency
*   Simple Management
*   Multi-team support
*   Interactive analytics through notebooks
*   UI integration
*   Security

# Features

*   Multiversion support
*   Run multiple Spark dispatchers
*   Run against multiple HDFS clusters
*   Backports of scheduling improvements
*   Simple installation of all Spark components, including the dispatcher and the history server
*   Integration of the dispatcher and history server
*   Zeppelin integration
*   Kerberos and SSL support

# Related Services

*   [HDFS][4]
*   [Kafka][5]
*   [Zeppelin][6]

 [1]: http://spark.apache.org/documentation.html
 [2]: http://spark.apache.org/docs/latest/running-on-mesos.html#cluster-mode
 [3]: http://spark.apache.org/docs/latest/monitoring.html#viewing-after-the-fact
 [4]: /services/hdfs/
 [5]: /services/kafka/
 [6]: https://zeppelin.incubator.apache.org/
 [17]: https://github.com/mesosphere/spark
 [18]: https://github.com/mesosphere/spark-build
