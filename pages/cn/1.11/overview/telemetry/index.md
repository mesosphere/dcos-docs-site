---
layout: layout.pug
navigationTitle: 遥测
title: 遥测
menuWeight: 7
excerpt: 了解遥测报告组件
enterprise: false
---


为持续改善 DC/OS 体验，包含了一个将匿名使用数据报告给 Mesosphere 的遥测组件。此数据用于监控核心 DC/OS 组件、安装、用户界面的可靠性，并了解哪些特性最受欢迎。

- [核心遥测](#core)
- [用户界面遥测](#user-interface)

# <a name="core"></a>核心遥测
[DC/OS 信号](/cn/1.11/overview/architecture/components/#dcos-signal) 组件查询首要管理节点上的诊断服务 `/system/health/v1/report` 端点，并将此数据发送给 [区块](https://segment.com/docs/)，Mesosphere 然后用它来跟踪使用率度量标准和客户支持。

DC/OS 信号报告的信息来自多个组件：DC/OS 诊断、Apache Mesos 和 DC/OS 包管理器 (Cosmos)。

对于每个类别都收集此数据：

<table class="table">
<tr>
<th>类型</th>
<th>描述</th>
</tr>
<tr><td>anonymousId</td>
<td>这是在启动时为每个集群创建的匿名 ID。此 ID 在您的集群中持续存在。例如：
<pre>
"anonymousId": "70b28f00-e38f-41b2-a723-aab344f535b9
</pre></td></tr>
<tr><td>clusterId</td>
<td>这是在启动时为每个集群创建的 <code>anonymousID</code> 值。此 ID 在您的集群中持续存在。例如：
<pre>
"clusterId": "70b28f00-e38f-41b2-a723-aab344f535b9" 
</pre>
</td></tr>
<tr><td>customerKey (DC/OS Enterprise)</td>
<td>这是 DC/OS  Enterprise 客户密钥。客户密钥通过电子邮件发送给获授权支持联系人。例如：
<pre>
"customerKey": "ab1c23de-45f6-7g8h-9012-i345j6k7lm8n", 
</pre>
</td></tr>
<tr><td>事件</td>
<td>这是在区块中出现的类别。可能的值为 <code>package_list</code>（包管理器）、<code>health</code>（诊断）和 <code>mesos_track</code> (Mesos)。例如：
<pre>
"event": "package_list" 
</pre>
</td>
</tr>
<tr><td>environmentVersion</td>
<td>这是 DC/OS 的版本。例如，如果您使用的是 DC/OS 1.11：
<pre>
"environmentVersion": "1.11", 
</pre></td></tr>
<tr><td>提供者</td>
<td>这是 DC/OS 运行所在的平台。可能的值为 <code>aws</code>、<code>on-prem</code> 和 <code>azure</code>。例如，如果您是在 AWS 上运行：
<pre>
"provider": "aws", 
</pre></td></tr>
<tr><td>来源</td>
<td>这是表示集群的硬编码设置。例如：
<pre>
"source": "cluster", 
</pre></td></tr>
<tr><td>变量</td>
<td>这表示集群是 DC/OS 还是 DC/OS Enterprise。例如，如果您使用的是 DC/OS Open Source：
<pre>
"variant": "open" 
</pre>
</td></tr>
</table>


## 诊断

此信息从 [DC/OS 诊断] (/1.11/overview/architecture/components/#dcos-diagnostics) 组件收集。对于每一个 `systemd` 单元收集以下信息，其中 `<UNIT_NAME>` 是组件名：

```
"health-unit-dcos-<UNIT_NAME>-total": 3, "health-unit-dcos-<UNIT_NAME>-unhealthy": 0,
```

## Mesos
此信息从 [Apache Mesos] (/1.11/overview/architecture/components/#apache-mesos) 组件收集。

<table class="table">
<tr>
<th>类型</th>
<th>描述</th>
</tr>
<tr><td>agents_active</td><td>活跃代理的数量。例如：<pre>"agents_active": 2, </pre></td></tr>
<tr><td>agents_connected</td><td>已连接代理的数量。例如：<pre>"agents_connected": 2, </pre></td></tr>
<tr><td>cpu_total</td><td>可用 CPU 的数量。例如：<pre>"cpu_total": 8, </pre></td></tr>
<tr><td>cpu_used</td><td>已分配 CPU 的数量。例如：<pre>"cpu_used": 0, </pre></td></tr>
<tr><td>disk_total</td><td>按 MB 计的可用磁盘空间。例如：<pre>"disk_total": 71154, </pre></td></tr>
<tr><td>disk_used</td><td>按 MB 计的已分配磁盘空间。例如：<pre>"disk_used": 0, </pre></td></tr>
<tr><td>framework_count</td><td>已安装 DC/OS 服务的数量。例如：<pre>"framework_count": 2, </pre></td></tr>
<tr><td>框架</td><td>安装了哪些 DC/OS 服务。例如：
<pre>
"frameworks": [
                {
 "name": "marathon" 
                },
                {
 "name": "metronome" 
                }
            ],
</pre></td></tr>
<tr><td>mem_total</td><td>按 MB 计的可用内存。例如：<pre>"mem_total": 28036, </pre></td></tr>
<tr><td>mem_used</td><td>按 MB 计的已分配内存。例如：<pre>"mem_used": 0, </pre></td></tr>
<tr><td>task_count</td><td>任务数。例如：<pre>"task_count": 0, </pre></td></tr>
</tr>
</table>


## 软件包管理器
此信息从 [DC/OS 包管理器 (Cosmos) ](/cn/1.11/overview/architecture/components/#dcos-package-manager) 组件收集。

<table class="table">
<tr>
<th>类型</th>
<th>描述</th>
</tr>
<tr>
<td>package_list</td>
<td>安装了哪些包。例如，如果您有 Kafka 和 Spark：
<pre>"package_list": [
{
"name": "kafka" 
},
{
"name": "spark" 
}
],
</pre></td>
</tr>
</table>

以下是获得的 JSON 遥测报告的示例：

```json
{
    "cosmos": {
        "properties": {
            "clusterId": "70b28f00-e38f-41b2-a723-aab344f535b9",
            "customerKey": "",
            "environmentVersion": "1.8",
            “package_list”: [
            {
            “name”: “kafka”
            },
            {
            “name”: “spark”
            }
            ],
            "provider": "aws",
            "source": "cluster",
            "variant": "open"
        },
        "anonymousId": "70b28f00-e38f-41b2-a723-aab344f535b9",
        "event": "package_list"
    },
    "diagnostics": {
        "properties": {
            "clusterId": "70b28f00-e38f-41b2-a723-aab344f535b9",
            "customerKey": "",
            "environmentVersion": "1.8",
            "health-unit-dcos-diagnostics-service-total": 3,
            "health-unit-dcos-diagnostics-service-unhealthy": 0,
            "health-unit-dcos-diagnostics-socket-total": 2,
            "health-unit-dcos-diagnostics-socket-unhealthy": 0,
            "health-unit-dcos-adminrouter-agent-service-total": 2,
            "health-unit-dcos-adminrouter-agent-service-unhealthy": 0,
            "health-unit-dcos-adminrouter-reload-service-total": 3,
            "health-unit-dcos-adminrouter-reload-service-unhealthy": 0,
            "health-unit-dcos-adminrouter-reload-timer-total": 3,
            "health-unit-dcos-adminrouter-reload-timer-unhealthy": 0,
            "health-unit-dcos-adminrouter-service-total": 1,
            "health-unit-dcos-adminrouter-service-unhealthy": 0,
            "health-unit-dcos-cosmos-service-total": 1,
            "health-unit-dcos-cosmos-service-unhealthy": 0,
            "health-unit-dcos-epmd-service-total": 3,
            "health-unit-dcos-epmd-service-unhealthy": 0,
            "health-unit-dcos-exhibitor-service-total": 1,
            "health-unit-dcos-exhibitor-service-unhealthy": 0,
            "health-unit-dcos-gen-resolvconf-service-total": 3,
            "health-unit-dcos-gen-resolvconf-service-unhealthy": 0,
            "health-unit-dcos-gen-resolvconf-timer-total": 3,
            "health-unit-dcos-gen-resolvconf-timer-unhealthy": 0,
            "health-unit-dcos-history-service-total": 1,
            "health-unit-dcos-history-service-unhealthy": 0,
            "health-unit-dcos-logrotate-agent-service-total": 2,
            "health-unit-dcos-logrotate-agent-service-unhealthy": 0,
            "health-unit-dcos-logrotate-agent-timer-total": 2,
            "health-unit-dcos-logrotate-agent-timer-unhealthy": 0,
            "health-unit-dcos-logrotate-master-service-total": 1,
            "health-unit-dcos-logrotate-master-service-unhealthy": 0,
            "health-unit-dcos-logrotate-master-timer-total": 1,
            "health-unit-dcos-logrotate-master-timer-unhealthy": 0,
            "health-unit-dcos-marathon-service-total": 1,
            "health-unit-dcos-marathon-service-unhealthy": 0,
            "health-unit-dcos-mesos-dns-service-total": 1,
            "health-unit-dcos-mesos-dns-service-unhealthy": 0,
            "health-unit-dcos-mesos-master-service-total": 1,
            "health-unit-dcos-mesos-master-service-unhealthy": 0,
            "health-unit-dcos-mesos-slave-public-service-total": 1,
            "health-unit-dcos-mesos-slave-public-service-unhealthy": 0,
            "health-unit-dcos-mesos-slave-service-total": 1,
            "health-unit-dcos-mesos-slave-service-unhealthy": 0,
            "health-unit-dcos-metronome-service-total": 1,
            "health-unit-dcos-metronome-service-unhealthy": 0,
            "health-unit-dcos-navstar-service-total": 3,
            "health-unit-dcos-navstar-service-unhealthy": 0,
            "health-unit-dcos-oauth-service-total": 1,
            "health-unit-dcos-oauth-service-unhealthy": 0,
            "health-unit-dcos-pkgpanda-api-service-total": 3,
            "health-unit-dcos-pkgpanda-api-service-unhealthy": 0,
            "health-unit-dcos-pkgpanda-api-socket-total": 3,
            "health-unit-dcos-pkgpanda-api-socket-unhealthy": 0,
            "health-unit-dcos-rexray-service-total": 2,
            "health-unit-dcos-rexray-service-unhealthy": 0,
            "health-unit-dcos-signal-service-total": 1,
            "health-unit-dcos-signal-service-unhealthy": 0,
            "health-unit-dcos-signal-timer-total": 3,
            "health-unit-dcos-signal-timer-unhealthy": 0,
            "health-unit-dcos-spartan-service-total": 3,
            "health-unit-dcos-spartan-service-unhealthy": 0,
            "health-unit-dcos-spartan-watchdog-service-total": 3,
            "health-unit-dcos-spartan-watchdog-service-unhealthy": 0,
            "health-unit-dcos-spartan-watchdog-timer-total": 3,
            "health-unit-dcos-spartan-watchdog-timer-unhealthy": 0,
            "health-unit-dcos-vol-discovery-priv-agent-service-total": 1,
            "health-unit-dcos-vol-discovery-priv-agent-service-unhealthy": 0,
            "health-unit-dcos-vol-discovery-pub-agent-service-total": 1,
            "health-unit-dcos-vol-discovery-pub-agent-service-unhealthy": 0,
            "provider": "aws",
            "source": "cluster",
            "variant": "open"
        },
        "anonymousId": "70b28f00-e38f-41b2-a723-aab344f535b9",
        "event": "health"
    },
    "mesos": {
        "properties": {
            "agents_active": 2,
            "agents_connected": 2,
            "clusterId": "70b28f00-e38f-41b2-a723-aab344f535b9",
            "cpu_total": 8,
            "cpu_used": 0,
            "customerKey": "",
            "disk_total": 71154,
            "disk_used": 0,
            "environmentVersion": "1.8",
            "framework_count": 2,
            "frameworks": [
                {
                    "name": "marathon"
                },
                {
                    "name": "metronome"
                }
            ],
            "mem_total": 28036,
            "mem_used": 0,
            "provider": "aws",
            "source": "cluster",
            "task_count": 0,
            "variant": "open"
        },
        "anonymousId": "70b28f00-e38f-41b2-a723-aab344f535b9",
        "event": "mesos_track"
    }
}
```


# <a name="user-interface"></a>用户界面遥测

DC/OS UI 向 [区块] 发送两种通知(https://segment.com/docs/)，Mesosphere 然后用它来跟踪使用度量标准和客户支持：

- 登录信息
- 在浏览 UI 时查看的页面

## 选择退出


您也可选择退出遥测功能。如需更多信息，请参阅 [文档](/cn/1.11/installing/production/deploying-dcos/opt-out/)。
