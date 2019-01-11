---
layout: layout.pug
navigationTitle: DNS
title: DC/OS 域名服务
menuWeight: 20
excerpt: 了解 DC/OS 域名服务发现

enterprise: false
---


DC/OS 提供基于 DNS 的分布式容错性服务发现机制。

DNS 由 DC/OS 中的两个不同组件 [mesos-dns](/cn/1.11/networking/DNS/mesos-dns/) 和 [dcos-dns](/cn/1.11/networking/DNS/dcos-dns/) 提供。这些组件支持两个顶级域 (TLD) 名，即 `.mesos` 和 `.directory`。请阅读 [建议](#Recommendation) 部分，更好地了解这两个 TLD 的使用。

每个 TLD 均由多个区域组成。每个 DC/OS 服务从这些不同区域获取多个 FQDN 条目。通过 Marathon 在 DC/OS 上启动的每个服务都以下列形式获得 FQDN，即 `<service-name>.mesos`. Moreover, **all** running services launched on DC/OS get an FQDN based upon the service that launched it, in the form `<service-name>.<group-name>.<framework-name>.mesos`。

<a name="Example1"></a>

假设以下 UCR 容器在 DC/OS 上启动：
```json
{
  "id": "/mygroup/myapp",
  "instances": 1,
  "container": {
    "type": "MESOS",
    "docker": {
      "image": "nginx"
    },
    "portMappings": [
      {
        "containerPort": 80,
        "labels": {
          "VIP_0": "/mygroup/myapp:80"
        },
        "name": "http"
      }
    ]
  },
  "cpus": 0.1,
  "mem": 32,
  "networks": [
    {
      "name": "dcos",
      "mode": "container"
    }
  ],
}
```
示例 1：在 DC/OS 上启动的 UCR 容器

不同的区域以及与这些区域有关的 FQDN 如下所述，连同服务从特定区域使用 FQDN 访问时接收的网络连接类型。

### myapp.mygroup.marathon.mesos
此 FQDN 由 `mesos-dns` 展示为 A 记录。请阅读 [建议](#Recommendation) 部分，了解使用此 FQDN 和从 `*.directory` TLD 使用 FQDN 之间的区别。此 FQDN 映射到的实际 IP 地址将取决于容器正在使用的网络模式。对于 `host` 和 `bridge` 模式网络，此 FQDN 将解析到启动容器的代理 IP 地址；对于 `container` 模式网络，它将解析到容器的 IP 地址。在 [示例 1](#Example1) 中，FQDN 将解析到容器的 IP 地址，因为它正在使用 `container` 网络模式。

### myapp-mygroup.marathon.containerip.dcos.thisdcos.directory
此 FQDN 由 `dcos-dns` 展示为 A 记录。对于 `container` 和 `bridge` 模式网络，此 FQDN 将解析到容器的代理 IP 地址；对于 `host` 模式网络，它将解析到启动容器的代理 IP 地址。在当前示例中，`framework-name` 为 `marathon`。FQDN 将解析到容器的 IP 地址，因为它正在使用 `container` 网络模式。

### myapp-mygroup.marathon.agentip.dcos.thisdcos.directory
此 FQDN 由 `dcos-dns` 展示为 A 记录。此 FQDN 将始终解析到运行容器的代理 IP，无论网络模式如何。

### myapp-mygroup.marathon.autoip.dcos.thisdcos.directory
此 FQDN 由 `dcos-dns` 展示为 A 记录。顾名思议，`autoip` FQDN 可以解析到最有可能到达容器的 IP 地址。例如，如果容器可通过代理 IP 到达，正如在主机和网桥模式网络中一样，`autoip` FQDN 将解析到代理 IP。同样，在容器模式网络中，它将解析到容器的 IP 地址。

### mygroupmyapp.marathon.l4lb.thisdcos.directory
如果某个服务明确定义 `VIP` 标签作为其应用定义的一部分，它将获得 FQDN `<group-name><service-name>.<framework-name>.l4lb.thisdcos.directory`

在上面的示例 1 中，标签类似于：
```
"labels": {
    "VIP_0": "/mygroup/myapp:80"
}
```

此 FQDN 由 `dcos-dns` 展示为 A 记录。它主要用于第 4 层负载均衡。它解析到 `dcos-l4lb` 在 `11.x.x.x` 范围内分配的虚拟 IP，然后映射到与此服务对应的所有实例。

# SRV 记录

有关 Mesos DNS SRV 记录的完整描述，请参阅 [SRV 记录](/cn/1.11/networking/DNS/mesos-dns/service-naming/#srv-records)。

- 对于由名为 `myservice` 的服务启动的名为 `mytask` 的任务，Mesos-DNS 生成一个 SRV 记录 `_mytask._protocol.myservice.mesos`，其中 `protocol` 为 `udp` 或 `tcp`。

- 有关 Mesos-DNS 中命名任务和服务的更多信息，请参阅 [任务和服务命名约定](/cn/1.11/networking/DNS/mesos-dns/service-naming/#task-and-service-naming-conventions)。

### myapp.mygroup./_tcp.marathon.mesos:
如果某个服务在应用定义中明确为其端口分配名称，则它会获得 FQDN `_<service-name>.<group-name>._<protocol>.<framework-name>.mesos`。

此 FQDN 由 `mesos-dns` 展示为 SRV 记录。

#用于除Marathon 以外其他框架的 FQDN
[示例 1](#Example1) 使用 Marathon，这是 DC/OS 中的默认框架。但还有其他框架也可以在 DC/OS 之上运行，如 Kafka、Cassandra、Spark 等。DC/OS 中的 DNS 基础架构也为这些框架启动的服务生成上面所述的 FQDN。唯一的区别就是名称 `marathon` 被该框架的名称替换，以建立 FQDN。例如，由框架启动的服务 `kafka` 具有 FQDN，例如：

* `<taskname>.kafka.l4lb.thisdcos.directory`
* `<taskname>.kafka.containerip.dcos.thisdcos.directory`
* `<taskname>.kafka.agentip.dcos.thisdcos.directory`
* `<taskname>.kafka.autoip.dcos.thisdcos.directory`
* `<taskname>.kafka.mesos`

# <a name="Recommendation"></a>建议
`.mesos` TLD 先于 `.directory` TLD，主要是为了向先前的版本兼容。虽然在 DC/OS 上启动的任何服务都将在 `.mesos` TLD 和 `.directory` TLD 中获取 FQDN，但建议使用 `.directory` TLD 来访问服务，因为在设计上，`dcos-dns` 比 `mesos-dns` 的反应性和容错性要好。也就是说，`mesos-dns` 确实提供 RESTful 界面用于访问其记录，使得 `.mesos` TLD 可通过 HTTP 接口而不只是通过 DNS 来获取。

