---
layout: layout.pug
navigationTitle: 服务命名
title: 服务命名
menuWeight: 0
excerpt: 了解 Mesos-DNS 服务命名约定

enterprise: false
---

<!-- The source repo for this topic is https://github.com/dcos/dcos-docs-site -->


Mesos-DNS 为在 DC/OS 上运行的 Mesos 任务定义 DNS 顶级域 `.mesos`。通过在此 Mesos 域中查找 A 记录以及可选地查找 SRV 记录，可以发现任务和服务。

- [A 记录](#a-records)
- [SRV 记录](#srv-records)
- [其他记录](#other-records)
- [任务和服务命名约定](#naming-conventions)
- [发现服务 DNS 名称](#dns-naming)

# <a name="a-records"></a>A 记录

A 记录将主机名与一个 IP 地址关联。当 DC/OS 服务启动一个任务时，Mesos-DNS 以可提供以下任一主机名的格式 `<task>.<service>.mesos` 为主机名生成 A 记录：

* 正在运行此任务的 [代理节点][1] 的 IP 地址
* 此任务的网络容器的 IP 地址（由 Mesos containerizer工具提供）

例如，其他 DC/OS 任务可以发现名为 `search` 的任务的 IP 地址，此任务由 `marathon` 启动以查找 `search.marathon.mesos`：

 dig search.marathon.mesos

 ; <<>> DiG 9.8.4-rpz2+rl005.12-P1 <<>> search.marathon.mesos
 ;; global options: +cmd
 ;; Got answer:
 ;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 24471
 ;; flags: qr aa rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 1, ADDITIONAL: 0

 ;; QUESTION SECTION:
 ;search.marathon.mesos. IN A

 ;; ANSWER SECTION:
 search.marathon.mesos. 60 IN A 10.9.87.94

如果启动任务的 Mesos containerizer 工具为任务 `search.marathon.mesos` 提供了容器 IP `10.0.4.1`，则查找结果为：

 dig search.marathon.mesos

 ; <<>> DiG 9.8.4-rpz2+rl005.12-P1 <<>> search.marathon.mesos
 ;; global options: +cmd
 ;; Got answer:
 ;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 24471
 ;; flags: qr aa rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 1, ADDITIONAL: 0

 ;; QUESTION SECTION:
 ;search.marathon.mesos. IN A

 ;; ANSWER SECTION:
 search.marathon.mesos. 60 IN A 10.0.4.1

除 `<task>.<service>.mesos` syntax shown above, Mesos-DNS also generates A records that contain the IP addresses of the agent nodes that are running the task: `<task>.<service>.slave.mesos` 。

例如，查询 `search.marathon.slave.mesos` 的 A 记录显示在 `marathon` 服务上运行 `search` 应用程序的一个或多个实例的每个代理节点的 IP 地址。

# <a name="srv-records"></a>SRV 记录

SRV 记录指定服务的主机名和端口。

对于由名为 `myservice` 的服务启动的名为 `mytask` 的任务，Mesos-DNS 生成一个 SRV 记录 `_mytask._protocol.myservice.mesos`，其中 `protocol` 为 `udp` 或 `tcp`。例如，其他 Mesos 任务可以发现名为 `search` 的任务，此任务由 `marathon` 启动以查询 `_search._tcp.marathon.mesos`：

 dig _search._tcp.marathon.mesos SRV

 ; DiG 9.8.4-rpz2+rl005.12-P1 &lt;&lt;&gt;&gt; _search._tcp.marathon.mesos SRV
 ;; global options: +cmd
 ;; Got answer:
 ;; -&gt;&gt;HEADER&lt;&lt;- opcode: QUERY, status: NOERROR, id: 33793
 ;; flags: qr aa rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 0

 ;; QUESTION SECTION:
 ;_search._tcp.marathon.mesos. IN SRV

 ;; ANSWER SECTION:
 _search._tcp.marathon.mesos. 60 IN SRV 0 0 31302 10.254.132.41. 

Mesos-DNS 支持使用任务的 DiscoveryInfo 来生成 SRV 记录。在 DC/OS 集群上，代理节点提供端口的方式与 CPU 和内存等其他资源的相同。如果 DiscoveryInfo 不可用，Mesos-DNS 将使用为任务分配的端口。

下表显示了对 SRV 生成适用的规则：

<table class="table">

<thead>

<tr>

<th>服务</th>

<th>已知的容器 IP</th>

<th>提供的 DiscoveryInfo</th>

<th>目标主机</th>

<th>目标端口</th>

<th>A 记录目标 IP</th>

</tr>

</thead>

<tbody>

<tr>

<td>_mytask._protocol.myservice.mesos</td>

<td>否</td>

<td>否</td>

<td>mytask.myservice.slave.mesos</td>

<td>主机端口</td>

<td>代理 IP</td>

</tr>

<tr>

<td>_mytask._protocol.myservice.mesos</td>

<td>是</td>

<td>否</td>

<td>mytask.myservice.slave.mesos</td>

<td>主机端口</td>

<td>代理 IP</td>

</tr>

<tr>

<td>_mytask._protocol.myservice.mesos</td>

<td>否</td>

<td>是</td>

<td>mytask.myservice.mesos</td>

<td>DiscoveryInfo 端口</td>

<td>代理 IP</td>

</tr>

<tr>

<td>_mytask._protocol.myservice.mesos</td>

<td>是</td>

<td>是</td>

<td>mytask.myservice.mesos</td>

<td>DiscoveryInfo 端口</td>

<td>容器 IP</td>

</tr>

<tr>

<td>mytask.protocol.myservice.slave.mesos</td>

<td>不适用</td>

<td>不适用</td>

<td>mytask.myservice.slave.mesos</td>

<td>主机端口</td>

<td>代理 IP</td>

</tr>

</tbody>

</table>

表 1. SRV 生成规则

# <a name="other-records"></a>其他记录

Mesos-DNS 生成一些特殊记录：

* 对于首要管理节点：A 记录 (`leader.mesos`) 和 SRV 记录 (`_leader._tcp.mesos` 和 `_leader._udp.mesos`)
* 对于所有服务调度器：A 记录 (`myservice.mesos`) 和 SRV 记录 (`_myservice._tcp.myservice.mesos`)
* 对于每个已知的 DC/OS 管理节点：A 记录 (`master.mesos`)
* 对于每个已知的 DC/OS 代理节点：A 记录 (`slave.mesos`) 和 SRV 记录 (`_slave._tcp.mesos`)

<table class=“table” bgcolor=#858585>
<tr> 
  <td align=justify style=color:white><strong>重要信息：</strong>要查询首要管理节点，应始终查询"leader.mesos"，而不是"master.mesos"。如需更多信息，请参阅 <a href="/1.11/networking/DNS/mesos-dns/troubleshooting/#leader">此 FAQ 条目</a>。</td> 
</tr> 
</table>

选者新管理节点和更新 Mesos-DNS 中的首要节点/管理节点记录之间存在延迟。Mesos-DNS 还支持 Mesos 域的 SOA 和 NS 记录请求。对 Mesos 域中其他类型记录的 DNS 请求将返回 `NXDOMAIN`。Mesos-DNS 不支持反向查找所需的 PTR 记录。Mesos-DNS 还会为自己生成 A 记录，列出了 Mesos-DNS 将答复查找请求的所有 IP 地址。这些 A 记录的主机名是 `ns1.mesos`。

# <a name="naming-conventions"></a>任务和服务命名约定

Mesos-DNS 遵循关于名称格式的 [RFC 1123][3]。用于构建 A 记录主机名和用于构建 SRV 记录的服务名的所有字段必须为 63 个字符或更短，可以包含字母 (A-Z)、数字 (0-9) 和破折号 (-)。名称不分大小写。如果任务名不符合这些限制，Mesos-DNS 将把名称缩短到 24 个字符，删除所有无效字符并以破折号 (-) 替换句点 (.)。对于 Mesos DNS 名称，执行 [RFC 952][4] 是可选的。

请注意，服务名和任务名的规则存在差异。对于服务名，允许使用句点 (.)，但所有其他规则适用。例如，由服务 `marathon.prod` 启动的名为 `apiserver.myservice` 的任务将具有与 `apiserver-myservice.marathon.prod.mesos` 名称关联的 A 记录以及与名称 `_apiserver-myservice._tcp.marathon.prod.mesos` 关联的 SRV 记录。

有些服务注册的默认名称让人难以理解。例如，旧版本的 Marathon 可以注册使用 `marathon-0.7.5` 等名称，但这会产生诸如 `search.marathon-0.7.5.mesos` 的 Mesos-DNS 主机名。您可以通过启动自定义名称的服务来避免此问题。例如，以 `--framework_name marathon` 启动 Marathon 将该服务注册为 `marathon`。

如果您是使用 Marathon 群组，则 Mesos-DNS 主机名是根据应用程序 ID 创建的。例如，如果您有一个名为 `nginx-router` 的应用程序且它在一个应用 ID 为 `/mesosphere-tutorial/nginx-router` 的 `mesosphere-tutorial` 组中，则 DNS 名称将为 `nginx-router-mesosphere-.marathon.mesos`。请注意，Mesos-DNS 将主机名缩短为 24 个字符，将破折号替换为介于 `mesosphere-tutorial` 和 `nginx-router` 的斜杠。

如果某个服务启动多个名称相同的任务，DNS 查找将返回多个记录，每个任务一个。Mesos-DNS 随机改变记录的顺序，以在这些任务之间提供根本的负载均衡。

**警示：** 如果不同服务启动具有相同主机名的任务，则可能会出现名称冲突。如果不同服务启动具有相同 Mesos-DNS 主机名的任务，或者如果 Mesos-DNS 缩短了应用 ID 以创建相同的 Mesos-DNS 主机名，则应用程序会与错误的代理节点通信，并且不可预测地失败。

# <a name="dns-naming"></a>发现服务的 DNS 名称

您可以获得在 DC/OS 集群节点上运行的应用程序的综合列表。

**先决条件：** [DC/OS 和 DC/OS CLI](/cn/1.11/installing/) 已安装。

1. SSH 到您的节点。例如，使用以下命令对管理节点执行 [SSH]：

    ```bash
    dcos node ssh --leader --master-proxy
    ```

 如需更多信息，请参阅 SSH [文档](/cn/1.11/administering-clusters/sshcluster/)。

2. 从管理节点运行此命令以查看节点详情：

    ```bash
    curl -H "Authorization: token=<auth-token>" http://<master-ip>/mesos_dns/v1/enumerate
    ```

 此例中，安装了 Kafka 和 Chronos：

    ```bash
       curl -H "Authorization: token=<auth-token>" http://<master-ip>/mesos_dns/v1/enumerate
         {
           "frameworks": [
            {
             "tasks": null,
             "name": "chronos"
            },
            {
             "tasks": null,
             "name": "kafka"
            },
            {
             "tasks": [
              {
               "name": "kafka",
               "id": "kafka.443d5d63-f527-11e5-81a5-2a8c0aaf83b5",
               "records": [
                {
                 "name": "kafka.marathon.mesos.",
                 "host": "10.0.2.162",
                 "rtype": "A"
                },
                {
                 "name": "kafka-7fdws-s0.marathon.mesos.",
                 "host": "10.0.2.162",
                 "rtype": "A"
                },
                {
                 "name": "kafka.marathon.slave.mesos.",
                 "host": "10.0.2.162",
                 "rtype": "A"
                },
                {
                 "name": "kafka-7fdws-s0.marathon.slave.mesos.",
                 "host": "10.0.2.162",
                 "rtype": "A"
                },
                {
                 "name": "_kafka._tcp.marathon.slave.mesos.",
                 "host": "kafka-7fdws-s0.marathon.slave.mesos.:14799",
                 "rtype": "SRV"
                },
                {
                 "name": "_kafka._udp.marathon.slave.mesos.",
                 "host": "kafka-7fdws-s0.marathon.slave.mesos.:14799",
                 "rtype": "SRV"
                },
                {
                 "name": "_kafka._tcp.marathon.mesos.",
                 "host": "kafka-7fdws-s0.marathon.mesos.:14799",
                 "rtype": "SRV"
                }
               ]
              },
              {
               "name": "chronos",
               "id": "chronos.40a4f462-f527-11e5-81a5-2a8c0aaf83b5",
               "records": [
                {
                 "name": "chronos.marathon.mesos.",
                 "host": "10.0.2.162",
                 "rtype": "A"
                },
                {
                 "name": "chronos-4dj75-s0.marathon.mesos.",
                 "host": "10.0.2.162",
                 "rtype": "A"
                },
                {
                 "name": "chronos.marathon.slave.mesos.",
                 "host": "10.0.2.162",
                 "rtype": "A"
                },
                {
                 "name": "chronos-4dj75-s0.marathon.slave.mesos.",
                 "host": "10.0.2.162",
                 "rtype": "A"
                },
                {
                 "name": "_chronos._tcp.marathon.slave.mesos.",
                 "host": "chronos-4dj75-s0.marathon.slave.mesos.:9106",
                 "rtype": "SRV"
                },
                {
                 "name": "_chronos._udp.marathon.slave.mesos.",
                 "host": "chronos-4dj75-s0.marathon.slave.mesos.:9106",
                 "rtype": "SRV"
                },
                {
                 "name": "_chronos._tcp.marathon.mesos.",
                 "host": "chronos-4dj75-s0.marathon.mesos.:9106",
                 "rtype": "SRV"
                }
               ]
              }
             ],
             "name": "marathon"
            }
           ]
    ```





 [1]: /1.11/overview/concepts/
 [2]: ../troubleshooting/#leader
 [3]: https://tools.ietf.org/html/rfc1123
 [4]: https://tools.ietf.org/html/rfc952
