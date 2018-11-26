---
layout: layout.pug
navigationTitle: 使用 ELK 进行日志管理
title: 使用 ELK 进行日志管理
menuWeight: 1
excerpt: 从集群节点管理系统和应用程序日志

enterprise: false
---



您可以将 DC/OS 集群中节点的系统和应用程序日志传输到 Elasticsearch 服务器。这些说明是基于 CentOS 7，可能极大地不同于与其他 Linux 系统分配。


# 本文档涵盖和不涵盖的内容

本文档介绍了如何将 Filebeat 输出从每个节点发送到集中式 Elasticsearch 实例。本文档介绍如何从 Filebeat 直接传输到 Elasticsearch。此架构中没有使用 Logstash。如果您有兴趣筛选、解析和了解处于中间 Logstash 阶段的日志，请参阅 Logstash [文档][8] 以及 [使用 ELK 筛选日志][3] 中的示例。

本文档未介绍如何设置和配置 Elasticsearch 服务器。本文档未介绍如何在 Filebeat 实例和 Elasticsearch 之间建立安全的 TLS 通信。有关如何实现此操作的详细信息，请参阅 [Filebeat][2] 和 [Elasticsearch][5] 文档。

**前提条件**

* 现有 Elasticsearch 装置可以消化数据用于索引
* 所有 DC/OS 节点都必须能够连接到用于在 Elasticsearch 和 Filebeat 之间通信的端口上的 Elasticsearch 服务器（默认情况下为 9200）

## <a name="all"></a>步骤 1：安装 Filebeat

对于 DC/OS 集群中的所有节点：

1. 安装 Elastic 的 [Filebeat][2]。

    ```bash
    curl -L -O https://artifacts.elastic.co/downloads/beats/filebeat/filebeat-5.0.0-x86_64.rpm
    sudo rpm -vi filebeat-5.0.0-x86_64.rpm
    ```

1. 创建 `/var/log/dcos` 目录：

    ```bash
    sudo mkdir -p /var/log/dcos
    ```
1. 将默认的 Filebeat 配置文件移到备份副本：

    ```bash
    sudo mv /etc/filebeat/filebeat.yml /etc/filebeat/filebeat.yml.BAK
    ```

1. 填充新的 `filebeat.yml` 配置文件，包括文件的附加输入条目 `/var/log/dcos/dcos.log`。附加日志文件将用于在后续步骤中捕获 DC/OS 日志。记住用下面的变量 `$ELK_HOSTNAME` 和 `$ELK_PORT` 替代 Elasticsearch 正在侦听的主机和端口的实际值。

    ```bash
    filebeat.prospectors:
    - input_type: log
      paths:
        - /var/lib/mesos/slave/slaves/*/frameworks/*/executors/*/runs/latest/stdout*
        - /var/lib/mesos/slave/slaves/*/frameworks/*/executors/*/runs/latest/stderr*
        - /var/log/mesos/*.log
        - /var/log/dcos/dcos.log
    exclude_files: ["stdout.logrotate.state", "stdout.logrotate.conf", "stderr.logrotate.state", "stderr.logrotate.conf"]
    tail_files: true
    output.elasticsearch:
      hosts: ["$ELK_HOSTNAME:$ELK_PORT"]
    ```

<table class=“table” bgcolor=#7d58ff>
<tr> 
  <td align=justify style=color:white><strong>重要信息：</strong>代理节点 Filebeat 配置要求任务将日志写入 `stdout` 和 `stderr`。某些 DC/OS 服务（包括 Cassandra 和 Kafka）不会将日志写入 `stdout` 和 `stderr`。如果要记录这些服务，您必须自定义代理节点 Filebeat 配置。</td> 
</tr> 
</table>

## <a name="all-2"></a>步骤 2：为分析日志设置服务

对于 DC/OS 集群中的所有节点：

1. 创建脚本 `/etc/systemd/system/dcos-journalctl-filebeat.service`，该脚本可解析 DC/OS 管理节点 `journalctl` 日志的输出并将其输送到 `/var/log/dcos/dcos.log`。

 此脚本可配合 DC/OS 和 Enterprise DC/OS 使用。不适用的日志条目将被忽略。

    ```bash
    sudo tee /etc/systemd/system/dcos-journalctl-filebeat.service<<-EOF
    [Unit]
    Description=DCOS journalctl parser to filebeat
    Wants=filebeat.service
    After=filebeat.service

    [Service]
    Restart=always
    RestartSec=5
    ExecStart=/bin/sh -c '/bin/journalctl  --since="5 minutes ago" --no-tail --follow --unit="dcos*.service" >> /var/log/dcos/dcos.log 2>&1'

    [Install]
    WantedBy=multi-user.target
    EOF
    ```

## <a name="all-3"></a>步骤 3：启动并启用 Filebeat

1. 对于所有节点，启动并启用在上面创建的 Filebeat 日志解析服务：

    ```bash
    sudo chmod 0755 /etc/systemd/system/dcos-journalctl-filebeat.service
    sudo systemctl daemon-reload
    sudo systemctl start dcos-journalctl-filebeat.service
    sudo systemctl enable dcos-journalctl-filebeat.service
    sudo systemctl start filebeat
    sudo systemctl enable filebeat
    ```


### <a name="all"></a>ELK 节点注释

ELK 堆栈将接收、存储、搜索和显示有关以上为集群中所有节点配置的 Filebeat 实例所解析的日志的信息。

本文档介绍如何从 Filebeat 直接传输到 Elasticsearch。此架构中没有使用 Logstash。如果您有兴趣筛选、剖析和了解处于中间 Logstash 阶段的日志，请参阅 Logstash [文档][8]。

您必须修改默认参数值才能让 Elasticsearch 准备好接收信息。例如，编辑 Elasticsearch 配置文件（通常为 `/etc/elasticsearch/elasticsearch.yml`）：

```bash
network.host = [IP address from the interface in your ElasticSearch node connecting to the Filebeat instances]
```

文件中的其他参数超出本文档的范围。有关详细信息，请查看 Elasticsearch [文档][5]。


## <a name="all-4"></a>步骤 4：配置日志轮换

应在所有节点上配置日志轮换，以防止文件 `/var/log/dcos/dcos.log` 无限制地增大和装满磁盘空间。
`logrotate` 配置应包含 `copytruncate`，因为 `journalctl` 管道保持打开状态，即使在轮换后仍然指向同一个文件。
使用 `copytruncate` 时，复制文件和将其截断之间的窗口很小，因此某些记录数据可能丢失 - 应该平衡装满磁盘和丢失某些日志之间的利弊。

例如，`logrotate` 配置应当是这样的：

```
/var/log/dcos/dcos.log {    
  size 100M
  copytruncate
  rotate 5
  compress
  compresscmd /bin/xz
}
```

# 后续步骤

有关如何使用 ELK 筛选日志的详细信息，请参阅 [使用 ELK 筛选 DC/OS 日志][3]。

 [2]: https://www.elastic.co/guide/en/beats/filebeat/current/filebeat-getting-started.html
 [3]: ../filter-elk/
 [4]: https://www.elastic.co/guide/en/elastic-stack/current/index.html
 [5]: https://www.elastic.co/guide/en/elasticsearch/reference/5.0/index.html
 [6]: https://www.elastic.co/guide/en/kibana/current/install.html
 [7]: https://www.elastic.co/guide/en/logstash/current/installing-logstash.html
 [8]: https://www.elastic.co/guide/en/logstash/current/index.html
