---
layout: layout.pug
navigationTitle: 限制
excerpt: 已知和已测试限制
title: 限制
menuWeight: 135
featureMaturity:
---


# 已知限制

* Mesosphere 不提供对 Spark 应用开发的支持，比如写一个 Python 应用，以处理来自
 Kafka 的数据；或者写 Scala 代码，以处理来自 HDFS 的数据。

* Spark 作业在 Docker 容器中运行。第一次在节点上运行 Spark 作业时，
 因为 `docker pull`，可能需要比预期更长的时间。

* DC/OS Apache Spark 仅支持从 DC/OS 集群中运行 Spark shell。参见 [Spark Shell 部分](/cn/services/spark/2.3.1-2.2.1-2/spark-shell/) 了解更多信息。对于交互式分析，我们推荐 Zeppelin，其支持可视化效果和动态依赖关系管理。

* 启用 Spark SSL/TLS 时，如果您使用
 `spark.mesos.[driver|executor].secret.envkeys`指定基于环境的密钥，由于密钥实施方式，keystore 和信任存储密钥也将显示为
 基于环境的密钥。您可以忽略这些额外的环境变量。

* 有权访问 Spark (Dispatcher) 服务实例的任何人均可访问其可用的所有密钥。不要
 授予用户访问  Spark Dispatcher 实例的权限，除非他们还被允许访问
 Spark Dispatcher 实例可用的所有密钥。

* 使用 Kerberos 和 HDFS 时，Spark Driver 会生成委派令牌，并将其
 通过 RPC 分发给执行程序。驱动程序对执行程序的身份认证使用 [共享密钥] (https://spark.apache.org/docs/latest/security.html#spark-security)完成。没有身份认证，执行程序容器也可能在驱动程序上注册并获取授权令牌。要确保委派令牌分配安全，使用 `--executor-auth-secret` 选项。

* Spark 在 Docker 容器中运行所有组件。Docker 镜像包含完整的 Linux 用户空间，其具有
 自己的 `/etc/users` 文件，因此用户 `nobody` 可以在
 容器内部有一个区别于主机系统的不同的 UID。尽管按惯例，在许多系统上，用户 `nobody` 有 UID 65534，
 但并不总是如此。由于 Mesos 不执行 Linux 用户命名空间之间的 UID 映射，这种情况下，指定
 `nobody` 服务用户会导致当容器用户尝试打开或执行由具有不同 UID 的用户拥有的文件系统资源时出现故障，
 阻止服务启动。如果集群中的主机
 中 `nobody` 的 UID 不是 65534，您需要维护默认用户（`root`) 以成功运行 DC/OS Spark
 。


# DC/OS Spark 限制测试结果
Mesosphere 通过在以下硬件上运行一个 CPU 绑定 Monte Carlo 应用程序，在 DC/OS 上规模测试 Spark。

## 集群特性
- 总共 2560 个核
- 40 m4.16xlarge EC2 实例

### 每个节点单个执行程序：
- 40 个执行程序
- 每个执行程序：64 核，2GB 内存
- CPU 利用率超过 90%，大部分时间用于任务计算

### 每个节点多个执行程序：
在较小的、1024-核、16 节点（m4.16xlarge）集群上，测试以下变化：

 执行程序 | 启动所有执行程序的时间 | 每节点执行程序
 --------- | --------------------------- | -----------------
 82 | 7 秒 | 16
 400 | 17 秒 | 64
 820 | 28 秒 | 64


在所有测试中，该应用程序成功完成。
