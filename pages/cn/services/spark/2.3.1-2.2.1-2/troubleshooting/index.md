---
layout: layout.pug
navigationTitle: 故障排除
excerpt: 诊断 Spark 
title: 故障排除
menuWeight: 125
model: /cn/services/spark/data.yml
render: mustache
---

# 调度器

* Mesos 集群调度器负责排队、跟踪和监督驱动程序。如果
 调度器未从 Mesos 收到您预期的资源，或如果驱动程序提交
 失败，则可能出现潜在问题。要调试此类问题，请访问 Mesos UI：`http://<dcos-url>/mesos/`，并导航至调度器的沙盒
 。

* {{ model.techShortName }} 具有用于检测主机 IP 的内部机制。我们默认使用此方法，但有时此方法会失败，返回如下错误：

    ```
    ERROR SparkUncaughtExceptionHandler: Uncaught exception in thread Thread[main,5,main]
        java.net.UnknownHostException: ip-172-31-4-148: ip-172-31-4-148: Name or service not known
            at java.net.InetAddress.getLocalHost(InetAddress.java:1505)
            at org.apache.spark.util.Utils$.findLocalInetAddress(Utils.scala:891)
            at org.apache.spark.util.Utils$.org$apache$spark$util$Utils$$localIpAddress$lzycompute(Utils.scala:884)
            at org.apache.spark.util.Utils$.org$apache$spark$util$Utils$$localIpAddress(Utils.scala:884)
            at org.apache.spark.util.Utils$$anonfun$localHostName$1.apply(Utils.scala:941)
            at org.apache.spark.util.Utils$$anonfun$localHostName$1.apply(Utils.scala:941)
            at scala.Option.getOrElse(Option.scala:121)
            at org.apache.spark.util.Utils$.localHostName(Utils.scala:941)
            at org.apache.spark.deploy.mesos.MesosClusterDispatcherArguments.<init>(MesosClusterDispatcherArguments.scala:27)
            at org.apache.spark.deploy.mesos.MesosClusterDispatcher$.main(MesosClusterDispatcher.scala:103)
            at org.apache.spark.deploy.mesos.MesosClusterDispatcher.main(MesosClusterDispatcher.scala)
        Caused by: java.net.UnknownHostException: ip-172-31-4-148: Name or service not known
            at java.net.Inet6AddressImpl.lookupAllHostAddr(Native Method)
            at java.net.InetAddress$2.lookupAllHostAddr(InetAddress.java:928)
            at java.net.InetAddress.getAddressesFromNameService(InetAddress.java:1323)
            at java.net.InetAddress.getLocalHost(InetAddress.java:1500)
            ... 10 more
    18/01/25 17:42:57 INFO ShutdownHookManager: Shutdown hook called
    ```

 在此情况下，在调度器配置中启用 `service.use_bootstrap_for_IP_detect` 选项：通过 UI
 编辑任务或在 `options.json` 中设置为 `true`，然后重新启动服务。这将导致 DC/OS 特定
 `bootstrap` 实用程序检测到该 IP，这可能允许初始化 Spark 服务完成。

# 作业

* DC/OS {{ model.Name }} 作业通过调度器提交，其显示 {{ model.techShortName }} 属性和作业状态。从此处开始，验证工作是否按您的预期进行配置。

* 调度器进一步提供了在历史记录服务器中的作业条目链接，其显示 {{ model.techShortName }} 工作 UI。
 此 UI 显示作业链接。导航至该链接，调试时间安排和性能问题。

* 作业自己会在沙盒中记录输出，您可以通过 Mesos UI 访问。{{ model.techShortName }} 日志将发送至 `stderr`，而您在作业中写入的任何输出将被发送至 `stdout`。

* 要在作业中禁用 Mesosphere `bootstrap` 实用程序进行主机 IP 检测，添加
 `spark.mesos.driverEnv.SKIP_BOOTSTRAP_IP_DETECT=true` 到您的作业配置中。

# CLI

{{ model.techShortName }} CLI 与调度器集成，以便它们始终使用相同版本 {{ model.techShortName }}，这样某些
默认值可以保持。要使用通信调试问题，运行作业时加上 `--verbose` 标记。

# HDFS Kerberos

要在 {{ model.techShortName }} 作业中调试认证，启用 Java 安全调试输出：
```
 dcos spark run --submit-args="--conf sun.security.krb5.debug=true.." 
```
