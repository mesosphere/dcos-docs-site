---
layout: layout.pug
navigationTitle: 运行 Spark 作业
excerpt: 运行 Spark 作业
title: 运行 Spark 作业
menuWeight: 80
featureMaturity:
model: /cn/services/spark/data.yml
render: mustache
---
1. 在提交工作前，上传工件，例如上传 `jar` 文件到集群可见的位置（例如，HTTP、S3 或 HDFS）。[了解更多][13]。

1. 运行作业。
 在 `jar` url 之前包含所有配置标记，在 `jar` url 之后包含 {{ model.techShortName }} 作业的自变量。通常遵循模板 `dcos spark run --submit-args=" <flags> URL [args]` where `<flags>` 可以是这样的事情 `--conf spark.cores.max=16` 和 `--class my.aprk.app`, `URL` 是应用程序的位置, 和 `[args]` 是应用程序的任何自变量。
    ```    
    dcos spark run --submit-args=--class MySampleClass http://external.website/mysparkapp.jar" 

    dcos spark run --submit-args="--py-files mydependency.py http://external.website/mysparkapp.py" 

    dcos spark run --submit-args="http://external.website/mysparkapp.R" 
    ```
    如果您的作业成功运行，您将收到一条含有工作提交 ID 的消息：
    ```
    Run job succeeded. Submission id: driver-20160126183319-0001
    ```
1. 要查看 {{ model.techShortName }} 调度程序进度，导航到 {{ model.techShortName }} 调度程序：`http://<dcos-url>/service/spark/`。

1. 要查看作业的日志，可通过 Mesos UI： `http://<dcos-url>/mesos/`. Or `dcos task log --follow <submission_id>`

# 设置 {{ model.techShortName }} 属性

{{ model.techShortName }} 作业设置通过配置 [Spark 属性][14] 来控制。

## 提交

所有属性均通过 `--submit-args` 选项提交给 `dcos spark run`：有一些独特的 DC/OS 选项不在 {{ model.techShortName }} 提交中（例如 `--keytab-secret-path`）。查看 `dcos spark run --help` 以获取所有这些选项的列表。由 {{ model.techShortName }} 支持的所有 `--conf` 属性可通过命令行在 `--submit-args` 字符串中传递。
```
 dcos spark run --submit-args="--conf spark.executor.memory=4g --supervise --class MySampleClass http://external.website/mysparkapp.jar 30`
```

## 设置自动配置默认值

要使用配置文件设置 {{ model.techShortName }}属性，创建一个
`spark-defaults.conf` 文件并设置环境变量
`SPARK_CONF_DIR` 到包含的目录。[了解更多][15]。

## 使用属性文件

要在不混乱命令行的情况下重复使用 {{ model.techShortName }}属性，CLI 支持传递路径给包含 {{ model.techShortName }} 属性的本地文件。此文件是空白分隔的属性和值。

例如，

```text
spark.mesos.containerizer   mesos
spark.executors.cores       4
spark.eventLog.enabled      true
spark.eventLog.dir          hdfs:///history
```
将设置 containerizer 为 `mesos`，执行程序核心为 `4` 并启用历史服务器。此文件在本地解析，因此不可用于您的驱动程序应用程序。


## 密钥

Enterprise DC/OS 提供了一个密钥存储库，用于访问敏感数据，如数据库密码、
私钥和 API 令牌。DC/OS 管理密钥数据的安全运输、访问控制和
授权，以及安全存储密钥内容。密钥可能以文件和/或以环境变量的形式
暴露给驱动程序和执行程序。要配置作业访问密钥，请参阅
[使用密钥存储库](/cn/services/spark/2.3.1-2.2.1-2/security/#using-the-secret-store) 和
[使用 Mesos 密钥](/cn/services/spark/2.3.1-2.2.1-2/security/#using-mesos-secrets) 部分。

# DC/OS 覆盖网络

要在[DC/OS 覆盖网络][16] 中提交 {{ model.techShortName }} 作业：
```
 dcos spark run --submit-args="--conf spark.mesos.containerizer=mesos --conf spark.mesos.network.name=dcos --class MySampleClass http://external.website/mysparkapp.jar" 
```

请注意，DC/OS 覆盖支持需要 [UCR][17]，而不是默认 Docker Containerizer，所以必须设置 `--conf spark.mesos.containerizer=mesos`。

# 驱动程序故障切换超时

`--conf spark.mesos.driver.failoverTimeout` 选项指定 
管理节点在临时断开连接之后将等待驱动程序重新连接的时间量（以秒为单位），
超过此时间，则会通过杀死其所有执行程序 
将驱动程序框架拆毁。默认值为零，意味着无超时：如果 
驱动程序断开连接，管理节点立即拆毁框架。

要提交一个非零故障切换超时的工作：
```
 dcos spark run --submit-args="--conf spark.mesos.driver.failoverTimeout=60 --class MySampleClass http://external.website/mysparkapp.jar" 
```

<p class="message--note"><strong>注意：</strong> 如果您在作业完成之前将其杀死，框架将继续作为 Mesos 中的 <code>inactive</code> 框架存留，存续时间等于故障切换超时时间。在超时之前，您可以通过点击
<a href="http://mesos.apache.org/documentation/latest/endpoints/master/teardown/">Mesos 拆毁端点</a> 手动将框架拆毁。</p>

# 版本

DC/OS {{ model.techName }} Docker 镜像包含 OpenJDK 8 和 Python 2.7.6。

DC/OS {{ model.techName }} 分布 1.X 采用 Scala 2.10 编译。DC/OS Apache Spark 分布 2.X 采用 Scala 2.11 编译。Scala 各个小版本之间并非二进制兼容，因此，您的 Spark 作业必须采用与您的 DC/OS {{ model.techName }}版本相同的 Scala 版本编译 。

默认 DC/OS {{ model.techName }} 分布针对 Hadoop 2.6 库编译。然而，您可以按照“安装”页面中[自定义 Spark 分布](http://localhost:3000/services/spark/2.3.1-2.2.1-2/install/#customize-spark-distribution)部分中的说明选择不同的版本。


[13]: http://spark.apache.org/docs/latest/submitting-applications.html
[14]: http://spark.apache.org/docs/latest/configuration.html#spark-properties
[15]: http://spark.apache.org/docs/latest/configuration.html#overriding-configuration-directory
[16]: https://dcos.io/docs/overview/design/overlay/
[17]: https://dcos.io/docs/1.9/deploying-services/containerizers/ucr/
[18]: http://mesos.apache.org/documentation/latest/endpoints/master/teardown/

