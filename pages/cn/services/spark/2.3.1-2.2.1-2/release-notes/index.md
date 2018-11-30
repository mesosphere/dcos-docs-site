---
layout: layout.pug
navigationTitle: 版本注释
title: 版本注释
menuWeight: 145
excerpt: Spark 和 Spark 历史版本 2.3.1-2.2.1-2
featureMaturity:
model: /cn/services/spark/data.yml
render: mustache
---




## Spark 和 Spark 历史版本 2.3.1-2.2.1-2

### 更新
- 更新了 libmesos 版本的重要缺陷修复，[MESOS-8171](https://issues.apache.org/jira/browse/MESOS-8171)

### 文档
- 添加了一个 [页面](/cn/services/spark/2.3.1-2.2.1-2/limitations/)，记录 DC/OS 上 Spark 规模测试结果。


## 版本 2.3.0-2.2.1-2

### 新特性
- 在驱动程序中添加了密钥支持，因此可以向执行程序传播密钥。(SPARK-22131)
- 添加了 Kerberos 票证续订。(SPARK-21842)
- 将 Mesos 沙盒 URI 添加到 Dispatcher UI。(SPARK-13041)
- 增加对驱动程序的支持<->Executor TLS 和基于文件的密钥。
- 增加对驱动程序的支持<->Executor SASL（RPC 端点身份认证和加密）采用基于文件的密钥实现。
- 添加 --executor-auth-secret 作为驱动程序的快捷方式<->执行程序 Spark SASL（RPC 端点身份认证和加密）配置。
- 添加 CLI 命令以生成随机密钥。
- 已启用 MLLib 本机 BLAS。
- 添加配置以在 UCR 上部署 Dispatcher （默认为 Docker）。
- 不需要将 krb5.conf 设置为 base64 编码的二进制大对象，用户现在可以直接在 options.json 中指定 service.security.kerberos.kdc.[port|hostname] 和 service.security.kerberos.realm。base64 编码的二进制大对象的行为保持不变，并将覆盖新配置。

### 历史服务器
- 添加了 Kerberos 支持以与 Kerberized HDFS 集成。有关配置说明，请参阅文档。
- 使用户可配置，默认为 root。

### 更新
- 将 JRE 版本更新为 8u152 JCE。
- 将默认用户更改为 root。（断开变化）

### 漏洞修复
- 首次委派令牌续订时间不是更新时间的 75%。(SPARK-22583)
- 采用检查点修复监督模式。(SPARK-22145)
- 添加了对较旧的 SPARK_MESOS_KRB5_CONF_BASE64 环境变量的支持。
- spark CLI 具有“快捷方式”命令行自变量，并被转化为下游的  spark.config=setting 配置（如 spark.executor.memory）。修复了用户直接设置配置并用快捷方式自变量的默认值将其覆盖的漏洞。

### 断开更改
- 在 Dispatcher 和 History Server 中将默认用户更改为 root。
- 要在 options.json 中配置 Kerberos，新属性 service.security.kerberos.enabled 必须设置为 true。这对 Dispatcher 和 History Server 都适用 。
- 从 options.json 中删除 security.ssl 属性。新的 Go-based CLI 不再需要这些属性。
- 从 CLI 中删除  --dcos-space 选项。密钥访问由 Spark Dispatcher 服务名称决定。请参阅 Spark Security doc 页面，了解有关在何处放置密钥的更多信息。



## 版本 2.1.0-2.2.0-1

### 改进
- 更改镜像以作为用户 `nobody` 运行，而不是默认的 `root`。(https://github.com/mesosphere/spark-build/pull/189)

### 漏洞修复
- 配置以允许自定义 Dispatcher docker 镜像。(https://github.com/mesosphere/spark-build/pull/179)
- 以提交自变量中的多个空格中断 CLI。(https://github.com/mesosphere/spark-build/pull/193)

### 文档
- 更新了 hdfs doc 页面中的 HDFS 端点。
- 添加了检查点说明。(https://github.com/mesosphere/spark-build/pull/181)
- 更新了自定义 docker 镜像支持策略。(https://github.com/mesosphere/spark-build/pull/200)

## 版本 2.2.0-2.2.0-2-beta

### 改进
* 在驱动程序中添加了密钥支持。(SPARK-22131)
* 添加了 Kerberos 票证更新。(SPARK-21842)
* 将 Mesos 沙盒 URI 添加到 Dispatcher UI。(SPARK-13041)
* 将 JRE 版本更新为 8u152 JCE。
* 增加对驱动程序的支持<->Executor TLS 和基于文件的密钥。
* 增加对驱动程序的支持<->Executor SASL（RPC 端点身份认证和加密）采用基于文件的密钥实现。
* 添加 CLI 命令以生成随机密钥。
* 已启用 MLLib 本机 BLAS。
* 添加配置以在 UCR 上部署 Dispatcher（默认为 Docker）。

### 漏洞修复
* 第一个委派令牌续订时间不是更新时间的 75%。(SPARK-22583)
* 采用检查点修复 `supervise` 模式。(SPARK-22145)
* 增加对更老的 `SPARK_MESOS_KRB5_CONF_BASE64` 环境变量的支持。

### 测试
* 添加了读取/写入到 Kerberized HDFS 的集成测试。
* 添加了读取/写入到 Kerberized Kafka 的集成测试。
* 增加对检查点和监督的集成测试。

### 文档
* 更新 DC/OS 命名。
* 在包安装后备注中更新了文档链接。
* 更新了 Kerberos 文档。
* 记录使用 Kerberized Kafka 运行 Spark 流式作业。
* 记录某些 OSes `nobody` 限制。


## 版本 2.1.0-2.2.0-1

### 改进
- 更改镜像以作为用户 `nobody` 运行，而不是默认的 `root`。(https://github.com/mesosphere/spark-build/pull/189)

### 漏洞修复
- 配置以允许自定义 Dispatcher docker 镜像。(https://github.com/mesosphere/spark-build/pull/179)
- 以提交自变量中的多个空格中断 CLI。(https://github.com/mesosphere/spark-build/pull/193)

### 文档
- 更新了 hdfs doc 页面中的 HDFS 端点。
- 添加了检查点说明。(https://github.com/mesosphere/spark-build/pull/181)
- 更新了自定义 docker 镜像支持策略。(https://github.com/mesosphere/spark-build/pull/200)

## 版本 2.0.1-2.2.0-1

### 改进
- 暴露 isR 和 isPython spark 运行自变量

### 漏洞修复
- 允许应用程序自变量具有不带有等号的参数
- 修复 Universe 包装说明中的文档链接

## 版本 2.0.0-2.2.0-1

### 改进
- Kerberos 支持更改，以使用来自 `spark-core` 的通用代码，而不是自定义实施。
- 添加了基于文件和环境的密钥支持。
- 集群模式下从 DC/OS Spark CLI 进行 Kerberos 密钥选项卡/TGT 登录（使用基于文件的密钥）。
- 添加了 CNI 网络标签支持。
- CLI 不需要在客户机上存在 spark-submit。

### 漏洞修复
- 在设定了`--supervise` 标记时，驱动程序成功重新启动。
- CLI 可在 1.9 和 1.10 DC/OS 集群上使用。

### 断开更改
- 设置 `spark.app_id` 已删除（例如 `dcos config set spark.app_id） <dispatcher_app_id>`)。要使用给定的
调度程序提交作业，使用“dcos spark”--name <dispatcher_app_id>`.
- 现在`principal` 是 `service_account` ，`secret` 是 `service_account_secret`。

## 版本 1.1.1-2.2.0

### 改进
* 升级至 Spark 2.2.0
* Spark 驱动程序现在支持可配置 failover_timeout。此配置未设置时，默认值为 0。
[SPARK-21456](https://issues.apache.org/jira/browse/SPARK-21456)。

### 断开更改

* Spark CLI 不再支持 -Dspark 自变量。

## 版本 1.0.9-2.1.0-1

- 历史服务器已从“spark”包中删除，并将其放入专用“spark-history”包中。
