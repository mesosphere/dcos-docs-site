---
layout: layout.pug
navigationTitle: 使用 ELK 筛选日志
title: 使用 ELK 筛选日志
menuWeight: 2
excerpt: 筛选特定任务的日志输出

enterprise: false
---


DC/OS 任务日志的文件系统路径包含代理 ID、框架 ID 和执行器 ID 等信息。您可以使用此信息来筛选特定任务、应用程序或代理的日志输出。

**前提条件**

* [聚合 DC/OS 日志的 Elasticsearch 安装][1]

# <a name="configuration"></a>安装、配置并启动 Logstash

1. 安装 [Logstash][7]。

1. 在自定义模式目录中，创建以下 `dcos` 模式文件，位置为 `$PATTERNS_DIR`：

    ```
    PATHELEM [^/]+
    TASKPATH ^/var/lib/mesos/slave/slaves/%{PATHELEM:agent}/frameworks/%{PATHELEM:framework}/executors/%{PATHELEM:executor}/runs/%{PATHELEM:run}
    ```

2. 更新 Logstash 实例的配置文件以包括下列 `grok` 筛选器，此处 `$PATTERNS_DIR` 将以您的自定义模式目录替代：

    ```
    filter {
        grok {
            patterns_dir => "$PATTERNS_DIR"
            match => { "file" => "%{TASKPATH}" }
        }
    }
    ```

3. 启动 Logstash。

 Logstash 将提取 `agent`、`framework`、`executor` 和 `run` 字段。这些字段显示在所有 Mesos 任务日志事件的元数据中。Elasticsearch 查询也会显示这些字段的结果。


# <a name="usage"></a>使用示例

在下面的屏幕截图中，我们使用由 [logz.io][2] 托管的 Kibana，但您的 Kibana 界面看起来与此相似。

1. 将 `framework:*` 输入“搜索”字段。这将显示 `framework` 字段已定义的所有事件：

 ![Logstash 示例](/cn/1.11/img/logstash-framework-exists.png)

 图 1. Logstash 事件

1. 点击其中一个事件旁边的披露三角形可查看详细信息。这将显示从任务日志文件路径提取的所有字段：

 ![Logstash 示例2](/cn/1.11/img/logstash-fields.png)

 图 2. 事件详情

1. 搜索所有提到上述屏幕截图中所示事件框架 ID 的事件，但不要包含选中的 `framework` 字段。这将仅显示非任务结果：

 ![Logstash 框架搜索](/cn/1.11/img/logstash-framework-search.png)

 图 3. 搜索结果

# <a name="templates"></a>模板示例

以下是一些查询模板示例。使用集群中的实际值替换模板参数 `$executor1`、`$framework2`，以及任何其他内容。

<table class=“table” bgcolor=#858585>
<tr> 
  <td align=justify style=color:white><strong>提醒：</strong>请勿更改这些示例中的引号，否则查询将不起作用。如果您创建自定义查询，请注意布局引号。</td> 
</tr> 
</table>

* 与特定执行器相关的日志 `$executor1`，包括从该执行器运行的任务的日志：

 "$executor1" 

* 与特定执行器有关的非任务日志 `$executor1`：

 "$executor1" 且非 executor:$executor1

* 框架的日志（包括任务日志）`$framework1`，如果 `$executor1` 和 `$executor2` 是该框架的执行器：

 "$framework1" 或 "$executor1" 或 "$executor2" 

* 框架的非任务日志`$framework1`，如果 `$executor1` 和 `$executor2` 是该框架的执行器：

 ("$framework1" 或 "$executor1" 或 "$executor2") 且非 (framework:$framework1 或 executor:$executor1 或 executor:$executor2)

* 特定代理主机上 `$agent_host1` 框架的日志 `$framework1`：

 host:$agent_host1 且 ("$framework1" 或 "$executor1" 或 "$executor2")

* 带主机 `$agent_host1` 的特定代理 `$agent1` 上框架 `$framework1` 的非任务日志：

 host:$agent_host1 和 ("$framework1" 或 "$executor1" 或 "$executor2") 且非 agent:$agent

[1]: ../elk/
[2]: http://logz.io
[7]: https://www.elastic.co/guide/en/logstash/current/installing-logstash.html
