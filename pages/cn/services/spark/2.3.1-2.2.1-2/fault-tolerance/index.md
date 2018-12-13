---
layout: layout.pug
navigationTitle: 容错
excerpt: 了解 DC/OS Apache Spark 上的容错
title: 容错
menuWeight: 100
featureMaturity:
model: /cn/services/spark/data.yml
render: mustache
---

主机、网络、JVM 或应用程序故障等故障可能影响三种类型 {{ model.techShortName }} 组件的行为：

- DC/OS {{ model.techName }} 服务
- 批次作业
- 流式作业

# DC/OS {{ model.techName }} 服务

DC/OS {{ model.techName }} 服务在 Marathon 中运行，包括 Mesos Cluster Dispatcher和 Spark History Server。Dispatcher 管理您通过 `dcos spark run` 提交的作业。作业数据在 Zookeeper 持久保存。Spark History Server 读取 HDFS 事件日志。如果服务消亡，Marathon 将重新启动服务，并且它将重新从这些高可用存储库加载数据。

# 批次作业

批次作业对执行程序故障具有弹性，但对驱动程序故障不具有弹性。如果您使用 `--supervise` 进行提交，Dispatcher 将重启驱动程序。

## 故障

故障有两种类型：

- 驱动程序
- 执行程序

### 驱动程序

当驱动程序出现故障时，执行程序被终止，且整个 Spark 应用程序失败。如果您使用 `--supervise` 提交作业，Dispatcher 将重新启动作业。

### 执行程序

批次作业对执行程序故障有弹性。出现故障时，缓存数据、随机文件和部分计算的 RDD 丢失。但是， {{ model.techShortName }} RDD 是容错的，{{ model.techShortName }} 将启动一个新的执行程序以重新计算这个来自原始数据源、缓存或随机文件的数据。重新计算数据产生性能成本，但执行程序故障不会导致作业失败。

# 流式作业

批次作业是分次运行的，通常可以在出现故障时重新启动，但流式作业通常需要不间断运行。应用程序必须在驱动程序出现故障时存活过来，且通常无数据丢失。为避免数据丢失，您必须在运行中启用 WAL。一个例外情况是，如果您是从 Kafka 消费，您可以使用 Direct Kafka API。

对于仅一次处理语义，您必须使用 Direct Kafka API。所有其他接收器提供至少一次语义。



## 作业特性

有一些变量会影响您作业的可靠性：

- [WAL][1]
- [接收器可靠性][2]
- [存储级别][3]

## 可靠性特性

作业的两个可靠性特性是数据丢失和处理语义。数据丢失发生在源发送数据，但作业无法处理此问题时。处理语义描述了作业处理所收到消息的次数。它可以是“至少一次”或“仅一次”

### 数据丢失

当交付的数据没有被处理时，{{ model.techShortName }}作业会丢失数据。以下是具有增加数据保存保证的配置列表：

- 不可靠接收器

不可靠的接收器不会确认其从源接收的数据。这意味着在执行程序故障时，接收器中的缓冲数据将丢失。

执行程序故障 => **数据丢失** 驱动程序故障 => **数据丢失**

- 可靠的接收器，未复制存储级别

这是一种不寻常的配置。默认情况下，{{ model.techShortName }} 流式接收器在复制的存储级别运行。但如果将存储级别降低为未复制级别，存储在接收器上但尚未处理的数据，则不会在出现执行程序故障之后存活下来。

 执行程序故障 => **数据丢失** 
 驱动程序故障 => **数据丢失**

- 可靠的接收器，复制存储级别

这是默认配置。存储在接收器中的数据被复制，因此可以在单个执行程序故障时存活下来。但是，驱动程序出现故障导致所有执行程序失败，因此导致数据丢失。

 （单个）执行程序故障 => **无数据丢失** 
 驱动程序故障 => **数据丢失**

- 可靠的接收器，WAL

启用 WAL 时，在接收器中存储的数据将写入高可用性存储中，如 S3 或 HDFS。这意味着应用甚至可以从驱动程序故障中恢复。

 执行程序故障 => **无数据丢失** 
 驱动程序故障 => **无数据丢失**

-  Direct Kafka Consumer，无检查点

自 {{ model.techShortName }} 1.3 起，Spark +Kafka 集成支持实验性 Direct Consumer，其不使用传统接收器。通过直接方法，RDD 直接从 Kafka 读取，而不是从接收器中的缓冲数据中读取。

但是，没有检查点的话，驱动程序重新启动意味着驱动程序将从最新的 Kafka 偏移开始读取，而不是从上次驱动程序停止的位置。

 执行程序故障 => **无数据丢失** 
 驱动程序故障 => **数据丢失**

-  Direct Kafka Consumer ，有检查点

启用检查点功能时，Kafka 偏移存储在可靠的存储库（如 HDFS 或 S3）中。这意味着应用程序可以确切地从其停止之处重新启动。

 执行程序故障 => **无数据丢失** 
 驱动程序故障 => **无数据丢失**

### 处理语义

处理语义应用于收到的消息得到处理的次数。借助 {{ model.techShortName }} 流式功能，这可以是“至少一次”或“仅一次”。

以下语义描述适用于 {{ model.techShortName }} 对数据的接收。要提供端到端的仅一次保证，您必须另外验证输出操作是否提供仅一次保证。更多信息参见 [此处][4]。

- 接收器

 **至少一次**

每个 {{ model.techShortName }} 流式消费者，除了以下描述的 Direct Kafka Consumer 外，都使用接收器。接收器在内存中缓冲数据块，然后根据作业的存储级别进行写入。写出数据后，它将向源发送一个确认应答，以便源知道不要重新发送。然而，如果此确认应答失败或节点在写出数据和发送应答之间失败，则会出现不一致性。{{ model.techShortName }} 认为数据已经收到，但源则相反。这会导致源重新发送数据，并处理两次。

- Direct Kafka Consumer

 **仅一次**

Direct Kafka Consumer 通过直接从 Kafka 读取数据并自行在检查点目录中存储偏移来避免上述问题。

 更多信息参见[此处][5]。


[1]: https://spark.apache.org/docs/1.6.0/streaming-programming-guide.html#requirements
[2]:https://spark.apache.org/docs/1.6.0/streaming-programming-guide.html#with-receiver-based-source
[3]:http://spark.apache.org/docs/latest/edit-guide.html#which-storage-level-to-choose
[4]:http://spark.apache.org/docs/latest/streaming-programming-guide.html#semantics-of-output-operation
[5]:https://databricks.com/blog/2015/03/30/improve-to-kafka-integration-of-spark-streaming.html
