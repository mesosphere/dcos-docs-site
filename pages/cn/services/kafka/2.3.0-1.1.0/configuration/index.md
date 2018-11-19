---
layout: layout.pug
navigationTitle: 配置
excerpt: 配置 Kafka 和 ZooKeeper
title: 配置
menuWeight: 20
model: /cn/services/kafka/data.yml
render: mustache
---

#include /cn/services/include/configuration-install-with-options.tmpl
#include /cn/services/include/configuration-service-settings.tmpl
#include /cn/services/include/configuration-regions.tmpl

## 配置 ZooKeeper 连接

{{ model.techName }} 需要运行 ZooKeeper ensemble 来执行其自身的内部会计。默认情况下，DC/OS {{ model.techName }} 服务使用位于 `master.mesos:2181/dcos-service-` 的 DC/OS 集群中 Mesos 管理节点上提供的 ZooKeeper ensemble。<servicename>在安装期间，您可以配置备用的 ZooKeeper，以便 {{ model.techName }} 进行使用。这可以让您增加 {{ model.techName }} 的容量并移除 DC/OS 系统 ZooKeeper ensemble 参与运行。

配置备用的 Zookeeper 实例：

1. 创建名为 `options.json` 的文件以及以下内容。

**注意：** 如果您正在使用 [DC/OS Apache ZooKeeper 服务](/services/{{ model.kafka.zookeeperPackageName }})，则使用由 `dcos {{ model.kafka.zookeeperPackageName }} endpoints clientport` 命令提供的 DNS 地址，作为 `kafka_zookeeper_uri` 的值。

这是一个示例 `options.json`，指向名为 `{{ model.kafka.zookeeperServiceName }}` 的 `{{ model.kafka.zookeeperPackageName }}` 实例：

```json
{
  "kafka": {
    "kafka_zookeeper_uri": "zookeeper-0-server.{{ model.kafka.zookeeperServiceName }}.autoip.dcos.thisdcos.directory:1140,zookeeper-1-server.{{ model.kafka.zookeeperServiceName }}.autoip.dcos.thisdcos.directory:1140,zookeeper-2-server.{{ model.kafka.zookeeperServiceName }}.autoip.dcos.thisdcos.directory:1140"
  }
}
```

1. 通过您创建的选项文件来安装 {{ model.techName }} 。

```bash
$ dcos package install {{ model.packageName }} --options="options.json"
```

您也可以从 DC/OS CLI 更新已经运行的 {{ model.techName }} 的实例，以防您需要在其他地方迁移 ZooKeeper 数据。

**注意：** 执行此配置更改之前，您必须先将当前 ZooKeeper ensemble 中的数据复制到新的 ZooKeeper ensemble。在迁移过程中，新位置的数据必须与上一个位置相同。

```bash
$ dcos {{ model.packageName }} --name={{ model.serviceName }} update start --options=options.json
```

## 延长终止宽限期

执行请求的重新启动或更换运行中的 broker 时，{{ model.techShortName }} 服务在终止进程之前将等待 `30` 秒钟（默认），让 broker 退出。此宽限期可通过 `brokers.kill_grace_period` 进行定制。在本示例中，我们将使用 DC/OS CLI 将宽限期延迟增加到 `60` 秒。此示例假设 {{ model.techShortName }} 服务实例命名为 `{{ model.serviceName }}`。

在配置更新期间，每个 {{ model.techShortName }} broker 任务已重启。在任务重新启动的关闭期间，之前 `brokers.kill_grace_period` 的配置值有效。关闭后，每个 broker 任务都会使用新的有效配置值启动。通过观察其日志来监控 {{ model.techShortName }} broker 完全关闭所需的时间。

### 将 Broker 替换为 Grace

如果 broker 在替换前关闭，则必须尊重宽限期。尽管 broker 必须尊重宽限期（即使它将失去持久状态）这种方式并不理想，但是在 SDK 的未来版本中，这种行为将会得到改进。如果不是正常关闭，那么 broker 替换通常需要在启动时进行复杂且耗时的调解活动，因此，在大多数情况下，对终止宽限期的尊重仍具有价值。我们建议设置仅足以允许正常关闭的终止宽限期。监控 {{ model.techShortName }} broker 日志中的 broker 完全关闭时间，从而使此值与流过 {{ model.techShortName }} 服务的数据规模进行协调。
