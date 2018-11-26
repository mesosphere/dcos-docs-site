---
layout: layout.pug
navigationTitle: 使用 Splunk 筛选日志
title: 使用 Splunk 筛选日志
menuWeight: 4
excerpt: 使用 Splunk 筛选日志的系统路径

enterprise: false
---


DC/OS 任务日志的文件系统路径包含代理 ID、框架 ID 和执行器 ID 等信息。您可以使用此信息来筛选特定任务、应用程序或代理的日志输出。

**前提条件**

* [聚合 DC/OS 日志的 Splunk 安装][1]

# <a name="configuration"></a>配置

您可以通过使用 Splunk [Web 界面][2] 或编辑 [props.conf 文件][3] 来配置 Splunk。

## <a name="splunkui"></a>Splunk Web 界面

1. 导航至**设置** -> **字段** -> **字段提取** -> **新**。
2. 使用以下信息填写表格：

 * 目标应用：`search`
 * 名称：`dcos_task`（或提取的任何有意义的唯一性名称）
 * 适用于名为 `/var/lib/mesos/slave/...` 的 `source`
 * 类型：`Inline`
 * 提取/转换：

 /var/lib/mesos/slave/slaves/(? <agent>[^/]+)/frameworks/(? <framework>[^/]+)/executors/(? <executor>[^/]+)/runs/(? <run>[^/]+)/.* in source

3. 点击**保存**。

4. 在**字段提取**视图中，找到刚创建的提取内容并适当地设置权限。`agent`、`framework`、`executor` 和 `run` 字段现在应该可用于搜索查询，显示在与 Mesos 任务日志事件相关的字段中。

## <a name="propsconf"></a>props.conf

1. 添加以下条目至 `props.conf`（请参阅 [Splunk 文档][4] 了解详情）：

 [source::/var/lib/mesos/slave/...]
 EXTRACT = /var/lib/mesos/slave/slaves/(? <agent>[^/]+)/frameworks/(? <framework>[^/]+)/executors/(? <executor>[^/]+)/runs/(? <run>[^/]+)/.* in source

2. 在 Splunk Web 界面运行以下搜索，以确保更改内容生效：

 extract reload=true

`agent`、`framework`、`executor` 和 `run` 字段现在应该可用于搜索查询，显示在与 Mesos 任务日志事件相关的字段中。

# <a name="usage"></a>使用示例

1. 在 Splunk Web 界面，将 `framework=*` 输入“搜索”字段。这将显示 `framework` 字段已定义的所有事件：

 ![Splunk 框架已存在](/cn/1.11/img/splunk-framework-exists.png)

 图 1. Splunk 事件屏幕

1. 点击其中一个事件旁边的披露三角形可查看详细信息。这将显示从任务日志文件路径提取的所有字段：

 ![Splunk 字段](/cn/1.11/img/splunk-fields.png)

 图 2. 任务日志文件路径中的字段

1. 搜索所有提到上述屏幕截图中所示事件框架 ID 的事件，但不要包含选中的 `framework` 字段。这将仅显示非任务结果：

 ![Splunk 框架搜索](/cn/1.11/img/splunk-framework-search.png)

 图 3. 搜索结果

# <a name="templates"></a>模板示例

以下是用于使用 Splunk 聚合 DC/OS 日志的查询模板示例。使用集群中的实际值替换模板参数 `$executor1`、`$framework2`，以及任何其他内容。

<table class=“table” bgcolor=#858585>
<tr> 
  <td align=justify style=color:white><strong>提醒：</strong>请勿更改这些示例中的引号，否则查询将不起作用。如果您创建自定义查询，请注意布局引号。</td> 
</tr> 
</table>

* 与特定执行器相关的日志 `$executor1`，包括从该执行器运行的任务的日志：

 "$executor1" 

* 与特定执行器有关的非任务日志 `$executor1`：

 "$executor1" 且非 executor=$executor1

* 框架的日志（包括任务日志）`$framework1`，如果 `$executor1` 和 `$executor2` 是该框架的执行器：

 "$framework1" 或 "$executor1" 或 "$executor2" 

* 框架的非任务日志`$framework1`，如果 `$executor1` 和 `$executor2` 是该框架的执行器：

 ("$framework1" 或 "$executor1" OR "$executor2") 且非 (framework=$framework1 或 executor=$executor1 或 executor=$executor2)

* 特定代理主机上 `$agent_host1` 框架的日志 `$framework1`：

 host=$agent_host1 且 ("$framework1" 或 "$executor1" 或 "$executor2")

* 带主机 `$agent_host1` 的特定代理 `$agent1` 上框架 `$framework1` 的非任务日志：

 host=$agent_host1 且 ("$framework1" 或 "$executor1" 或 "$executor2") 且非 agent=$agent

 [1]: ../splunk/
 [2]: #splunkui
 [3]: #propsconf
 [4]: http://docs.splunk.com/Documentation/Splunk/latest/admin/Propsconf
