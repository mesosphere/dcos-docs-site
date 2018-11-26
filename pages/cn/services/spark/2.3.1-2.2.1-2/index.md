---
layout: layout.pug
title: Spark 2.3.1-2.2.1-2
navigationTitle: Spark 2.3.1-2.2.1-2
menuWeight: 0
excerpt: Apache Spark 是一种用于大数据的快速通用集群计算系统。
featureMaturity:
model: /cn/services/spark/data.yml
render: mustache
---

欢迎使用 DC/OS {{ model.techName }} 服务文档。有关新特性和更新特性的详细信息，请参阅 [发布说明](/services/spark/2.3.1-2.2.1-2/release-notes/)。


{{ model.techName }} 是一种用于大数据的快速通用集群计算系统。它提供 Scala、Java、Python 和 R 的高级 API，以及支持数据分析一般计算图形的优化引擎。它还支持丰富的高级工具，包括用于 SQL 和 DatAframes 的 Spark SQL、用于机器学习的 MLlib、用于图形处理的 GraphX 和用于流处理的 Spark Streaming。有关详细信息，请参阅 [Apache Spark 文档][1]。

DC/OS {{ model.techName }} 包括 [{{ model.techName }}和几个自定义提交][17] 和 [DC/OS 特定包装][18]。

DC/OS {{ model.techName }} 包括：

* [Mesos 集群调度器][2]
* [Spark History Server][3]
* DC/OS {{ model.techName }} CLI
* 交互式 {{ model.techShortName }} shell

# 优势

* 利用率：DC/OS {{ model.techName }} 利用 Mesos 在与其他 DC/OS 服务相同的集群上运行 Spark
* 提高效率
* 简单管理
* 多团队支持
* 通过笔记本电脑进行交互式分析
* UI 集成
* 安全，包括基于文件和环境的密钥

# 特征

* 多版本支持
* 运行多个 {{ model.techShortName }} 调度器
* 针对多个 HDFS 集群运行
* 计划排程改进的后端端口
* 简单安装所有 {{ model.techShortName }} 组件，包括调度器和历史服务器
* 调度器和历史服务器的集成
* Zeppelin 集成
* Kerberos 和 SSL 支持

# 相关服务

* [HDFS][4]
* [Kafka][5]
* [Zeppelin][6]

 [1]:http://spark.apache.org/documentation.html
 [2]:http://spark.apache.org/docs/latest/run-on-mesos.html#cluster-mode
 [3]: http://spark.apache.org/docs/latest/monitoring.html#viewing-after-the-fact
 [4]:https://docs.mesosphere.com/services/hdfs/
 [5]:https://docs.mesosphere.com/services/kafka/
 [6]:https://zeppelin.incubator.apache.org/
 [17]:https://github.com/mesosphere/spark
 [18]:https://github.com/mesosphere/spark-build
