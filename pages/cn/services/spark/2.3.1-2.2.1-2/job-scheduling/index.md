---
layout: layout.pug
navigationTitle: 作业计划
excerpt: 作业计划选项的概述
title: 作业计划
menuWeight: 110
featureMaturity:
model: /cn/services/spark/data.yml
render: mustache
---

本文档简单概述了 Apache Spark 文档（见 [此处][1]
和 [此处][2]）中详细描述的材料。

# 模式

Mesos 上的 Spark 支持两种操作模式：粗粒度模式和细粒度模式。粗粒度模式
提供较低的延迟，而细粒度模式提供更高的利用率。更多信息参见 [此处][2]。

<a name="spark-coarse"></a>
## 粗粒度模式

称其为“粗粒度”模式是因为每个 Spark 执行程序都由单个 Mesos 任务表示。因此，
在整个生命周期内，执行程序的大小恒定。

* **执行程序内存**：`spark.executor.memory`
* **执行程序 CPU**：`spark.executor.cores`，或供应中的所有核心。
* **执行程序数量**：`spark.cores.max`// `spark.executor.cores`。执行程序数量会一直增加，直到达到
 `spark.cores.max`。执行程序在作业期间存活。
* **每代理的执行程序**：多个

**注意：** 我们强烈建议您 [设置 `spark.cores.max`](#set-spark-cores-max)。如果您没有设置，您的 Spark 作业可能会消耗集群中的所有可用资源，导致其他同等作业不适应。

# 驱动程序和执行程序的配额

为驱动程序设置 [Mesos 配额](http://mesos.apache.org/documentation/latest/quota/) 可防止 Dispatcher 消耗过多资源并协助行为排队。若要控制驱动程序并发数，
Spark 服务将同时运行。我们强烈建议为驱动程序设置配额。配额将既可
保证 Spark Dispatcher 拥有可启动驱动程序的资源，又能限制因为驱动程序而对
集群产生的整体影响。可选择为要使用的驱动程序设置配额，以确保驱动程序不会因为其他框架影响而出现
资源不足，以及确保它们不会消耗太多集群（请参阅粗粒度
模式）。

## 为驱动程序设置配额

为驱动程序设置配额允许集群管理员确保只有给定数量的驱动程序在同时运行。随着其他驱动程序的提交，它们将由 Spark Dispatcher 进行排队。以下是为驱动程序设置配额的建议步骤：

1. 保守设置配额，记住这将影响可同时运行的作业数量。
1. 决定为运行中的驱动程序分配多少集群资源。这些资源将仅用于
 Spark 驱动程序，这意味着现在我们可以大致决定我们希望一次运行多少个并发作业。随着其他作业的提交，它们将被排队并使用先进先出的语义运行。
1. 对于最可预测的行为，执行统一驱动程序资源要求以及 Dispatcher 特定的配额大小
 。如果每个驱动程序消耗 1.0 CPU，希望同时运行最多五个 Spark 作业，则应创建具有 5 个 CPU 的配额：
        
示例：

SSH 到 Mesos 管理节点并设置角色的配额（ 在本示例中`dispatcher`）：

```bash
$ cat dispatcher-quota.json
{
 "role": "dispatcher",
 "guarantee": [
   {
     "name": "cpus",
     "type": "SCALAR",
     "scalar": { "value": 5.0 }
   },
   {
     "name": "mem",
     "type": "SCALAR",
     "scalar": { "value": 5120.0 }
   }
 ]
}
$ curl -d @dispatcher-quota.json -X POST http://<master>:5050/quota
```

4. 使用以下选项安装 Spark 服务（最小）：

```bash
$ cat options.json
{
    "service": {
        "role": "dispatcher"
    }
}
$ dcos package install spark --options=options.json
```

## 为执行程序设置配额
        
建议为 Spark 作业执行程序分配配额。为 Spark 执行程序分配配额，可以：
- 保证 Spark 作业将收到所需数量的资源。
- 还可以保证即使是错误配置的 Spark 作业（例如，带有未设置`spark.cores.max`的驱动程序）也不会消费太多资源，从而影响集群中的其他租户。

为执行程序分配配额的缺点是配额资源不能被其他框架使用
集群中设置 ingress 的示例和重要信息。

可以按照为 Spark 调度程序进行分配的相同方式为 Spark 执行程序分配配额。假设我们想同时运行 100 个执行程序，每个有 1.0  CPU 和 4096 MB 内存，我们应该执行以下操作：

```bash
$ cat executor-quota.json
{
  "role": "executor",
  "guarantee": [
    {
      "name": "cpus",
      "type": "SCALAR",
      "scalar": { "value": 100.0 }
    },
    {
      "name": "mem",
      "type": "SCALAR",
      "scalar": { "value": 409600.0 }
    }
  ]
}
$ curl -d @executor-quota.json -X POST http://<master>:5050/quota

```

提交 Spark 作业时，它们必须指明已为其设置配额的角色，才能使用此配额的资源。

示例：

```bash
$ dcos spark run --verbose --name=spark --submit-args="\
--driver-cores=1 \
--driver-memory=1024M \
--conf spark.cores.max=8 \
--conf spark.mesos.role=executor \
--class org.apache.spark.examples.SparkPi \
http://downloads.mesosphere.com/spark/assets/spark-examples_2.11-2.0.1.jar 3000"

```

### 流式和长时间运行的 Spark 作业的特殊注意事项

为了防止单个长时间运行或流式 Spark 作业消耗整个配额，该 Spark 作业的最大 CPU 应大致设置为配额资源的一个“作业值”。这可确保 Spark 作业获得足够的资源来完成进度，而设置最大 CPU 可确保其不会引起其他 Spark 作业出现资源不足；也可以可预测地提供抑制语义。

## 严格模式使用配额时的权限 

严格模式集群（参见 [安全模式](https://docs.mesosphere.com/1.10/security/ent/#security-modes)) 需要额外权限才能使用配额。遵循[安装中的说明](https://github.com/mesosphere/spark-build/blob/master/docs/install.md) 并为
您打算使用的角色添加其他权限，详见如下说明。按照以上示例，将进行如下设置：

1. 首先，为调度程序角色设置配额（`dispatcher`）

    ```bash
    $ cat dispatcher-quota.json
    {
     "role": "dispatcher",
     "guarantee": [
       {
         "name": "cpus",
         "type": "SCALAR",
         "scalar": { "value": 5.0 }
       },
       {
         "name": "mem",
         "type": "SCALAR",
         "scalar": { "value": 5120.0 }
       }
     ]
    }
    ```

 下载 CA 证书 `dcos-ca.crt` 到您的本地机器（通过 'https://<dcos_url>/ca/dcos-ca.crt` 端点）。

    
  ```bash
  curl -X POST --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/mesos/quota -d @dispatcher-quota.json -H 'Content-Type: application/json'
  ```

 然后从您的本地机器**中设置配额**。


2. 也可以为执行程序设置配额，同样如上所述：

    ```bash
    $ cat executor-quota.json
    {
      "role": "executor",
      "guarantee": [
        {
          "name": "cpus",
          "type": "SCALAR",
          "scalar": { "value": 100.0 }
        },
        {
          "name": "mem",
          "type": "SCALAR",
          "scalar": { "value": 409600.0 }
        }
      ]
    }
    ```

 然后从您的本地机器设置配额，同样假设您已经拥有本地 `dcos-ca.crt` ：

  ```bash
  curl -X POST --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/mesos/quota -d @executor-quota.json -H 'Content-Type: application/json'
  ```

3. 使用这些最小配置安装 Spark：

  ```bash
  { 
      "service": {
              "service_account": "spark-principal",
              "role": "dispatcher",
              "user": "root",
              "service_account_secret": "spark/spark-secret"
      }
  }
  ```

4. 现在，您已经准备好使用您设置的 principal 以及角色运行 Spark 作业：

    ```bash
    dcos spark run --verbose --submit-args=" \
    --conf spark.mesos.principal=spark-principal \
    --conf spark.mesos.role=executor \
    --conf spark.mesos.containerizer=mesos \
    --class org.apache.spark.examples.SparkPi http://downloads.mesosphere.com/spark/assets/spark-examples_2.11-2.0.1.jar 100"
    ```

<a name="set-spark-cores-max"></a>
## 设置 `spark.cores.max`

为了改善 Spark 作业执行可靠性，设置任何给定作业所消耗的最大核心数。这可防止
任何特定 Spark 作业在集群中消耗过多资源。强烈建议提交的每个 Spark 作业时限制其可消耗的最大核心 (CPU) 数量。这对于
长时间运行和流式 Spark 作业尤其重要。

```bash
$ dcos spark run --verbose --name=spark --submit-args="\
--driver-cores=1 \
--driver-memory=1024M \
--conf spark.cores.max=8 \ #<< Very important!
--class org.apache.spark.examples.SparkPi \
http://downloads.mesosphere.com/spark/assets/spark-examples_2.11-2.0.1.jar 3000"
```

在运行多个并发 Spark 作业时，考虑在之间设置 `spark.cores.max` 
`<total_executor_quota>/<max_concurrent_jobs>` and `<total_executor_quota>`，具体根据您的作业负载特性
和目标而定。

# 细粒度模式

<p class="message--note"><strong>备注: </strong> 细粒度模式已弃用，不具有粗粒度模式的所有特征。</p>

在“细粒度”模式下，每个 Spark 任务由单个 Mesos 任务表示。当 Spark 任务完成时，
由其 Mesos 任务所代表的资源被放弃。细粒度模式能够支持更细粒度资源分配，但以任务启动延迟为代价。

* **执行程序内存**：`spark.executor.memory`
* **执行程序 CPU**：随着任务开始和终止，增加和减少
* **执行程序数量**：随着任务开始和终止，增加和减少
* **每代理的执行程序**：最多一个

# 属性

以下是最常见的 Spark on Mesos 排程属性描述。有关完整列表，请参阅[Spark 
配置页][1] 和 [Spark on Mesos 配置页][2]。



<table class="table">
<tr>
<th>属性</th>
<th>默认</th>
<th>描述</th>
</tr>
	
<tr>
<td><code>spark.mesos.coarse</code></td>
<td>True</td>
<td>如上所述。</td>
</tr>

<tr>
<td><code>spark.executor.memory</code>`</td>
<td>1 Gb</td>
<td>执行程序内存分配。</td>
</tr>

<tr>
<td><code>spark.executor.cores</code></td>
<td>供应中的所有可用核心</td>
<td>仅限粗粒度模式。DC/OS Apache Spark >= 1.6.1. 执行程序 CPU 分配。</td>
</tr>

<tr>
<td><code>spark.cores.max</code></td>
<td>无限制</td>
<td>要分配的最大核心数。</td>
</tr>
</table>


[1]: http://spark.apache.org/docs/latest/configuration.html
[2]: http://spark.apache.org/docs/latest/running-on-mesos.html
