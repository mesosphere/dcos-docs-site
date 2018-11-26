---
layout: layout.pug
navigationTitle: 使用 Splunk 进行日志管理
title: 使用 Splunk 进行日志管理
menuWeight: 3
excerpt: 使用 Splunk 服务器管理系统和应用程序日志

enterprise: false
---

# 概述
您可以将系统和应用程序日志从 config.yaml 集群传输到现有 Splunk 服务器。本文档介绍如何配置 Splunk 通用转发器以将每个节点的输出发送到 Splunk 装置。本文档未介绍如何设置和配置 Splunk 服务器。

这些说明是基于 CentOS，可能极大地不同于与其他 Linux 系统分配。

<table class=“table” bgcolor=#7d58ff>
<tr> 
  <td align=justify style=color:white><strong>重要信息：</strong>代理节点 Splunk 转发器配置要求任务将日志写入 `stdout` 和 `stderr`。某些 DC/OS 服务（包括 Cassandra 和 Kafka）不会将日志写入 `stdout` 和 `stderr`。如果要记录这些服务，您必须自定义代理节点 Splunk 转发器配置。</td> 
</tr> 
</table>

**前提条件**

* 现有 Splunk 装置可以消化数据用于索引
* 所有 DC/OS 节点必须能够通过 HTTP 或 HTTPS 连接到 Splunk 索引器
* 开放文件的 `ulimit` 必须设置为 `unlimited`，供具有 Root 访问权限的用户使用。

## 第 1 步：所有节点

对于 DC/OS 集群中的所有节点：

1. 安装 Splunk 的 [通用转发器][2]。
2. 确保转发器具有将数据发送给索引器所需的凭据。
3. 启动转发器。

## 第 2 步：管理节点

对于 DC/OS 集群中的每个管理节点：

1. 创建一个脚本 `$SPLUNK_HOME/bin/scripts/journald-master.sh`，其含有来自 `journald` Mesos 管理节点的日志。此脚本可配合 DC/OS 和 DC/OS Enterprise 使用。不适用的日志条目将被忽略。

 #!/bin/sh

 exec journalctl --since=now -f \
 -u dcos-diagnostics.service \
 -u dcos-diagnostics.socket \
 -u dcos-adminrouter-reload.service \
 -u dcos-adminrouter-reload.timer \
 -u dcos-adminrouter.service \
 -u dcos-bouncer.service \
 -u dcos-ca.service \
 -u dcos-cfn-signal.service \
 -u dcos-cosmos.service \
 -u dcos-download.service \
 -u dcos-epmd.service \
 -u dcos-exhibitor.service \
 -u dcos-gen-resolvconf.service \
 -u dcos-gen-resolvconf.timer \
 -u dcos-history.service \
 -u dcos-link-env.service \
 -u dcos-logrotate-master.timer \
 -u dcos-marathon.service \
 -u dcos-mesos-dns.service \
 -u dcos-mesos-master.service \
 -u dcos-metronome.service \
 -u dcos-minuteman.service \
 -u dcos-navstar.service \
 -u dcos-networking_api.service \
 -u dcos-secrets.service \
 -u dcos-setup.service \
 -u dcos-signal.service \
 -u dcos-signal.timer \
 -u dcos-spartan-watchdog.service \
 -u dcos-spartan-watchdog.timer \
 -u dcos-spartan.service \
 -u dcos-vault.service \
 -u dcos-logrotate-master.service

2. 使脚本可执行：

 chmod +x "$SPLUNK_HOME/bin/scripts/journald-master.sh" 

3. 将脚本添加为转发器的输入：

 "$SPLUNK_HOME/bin/splunk" add exec \
 -source "$SPLUNK_HOME/bin/scripts/journald-master.sh" \
 -interval 0

## 步骤 3：代理节点

对于 DC/OS 集群中的每个代理节点：

1. 创建一个脚本 `$SPLUNK_HOME/bin/scripts/journald-agent.sh`，其含有来自 `journald` Mesos 代理节点的日志。此脚本可配合 DC/OS 和 DC/OS Enterprise 使用。不适用的日志条目将被忽略。

 #!/bin/sh

 journalctl --since="now" -f \
 -u dcos-diagnostics.service \
 -u dcos-logrotate-agent.timer \
 -u dcos-diagnostics.socket \
 -u dcos-mesos-slave.service \
 -u dcos-adminrouter-agent.service \
 -u dcos-minuteman.service \
 -u dcos-adminrouter-reload.service \
 -u dcos-navstar.service \
 -u dcos-adminrouter-reload.timer \
 -u dcos-rexray.service \
 -u dcos-cfn-signal.service \
 -u dcos-setup.service \
 -u dcos-download.service \
 -u dcos-signal.timer \
 -u dcos-epmd.service \
 -u dcos-spartan-watchdog.service \
 -u dcos-gen-resolvconf.service \
 -u dcos-spartan-watchdog.timer \
 -u dcos-gen-resolvconf.timer \
 -u dcos-spartan.service \
 -u dcos-link-env.service \
 -u dcos-vol-discovery-priv-agent.service \
 -u dcos-logrotate-agent.service

2. 使脚本可执行：

 chmod +x "$SPLUNK_HOME/bin/scripts/journald-agent.sh" 

3. 将脚本添加为转发器的输入：

 "$SPLUNK_HOME/bin/splunk" add exec \
 -source "$SPLUNK_HOME/bin/scripts/journald-agent.sh" \
 -interval 0

4. 将任务日志添加为转发器的输入：

 "$SPLUNK_HOME/bin/splunk" add monitor '/var/lib/mesos/slave' \
 -whitelist '/stdout$|/stderr$' 




# 后续步骤

有关如何使用 Splunk 筛选日志的详细信息，请参阅 [使用 Splunk 筛选日志][3]。

 [2]: http://www.splunk.com/en_us/download/universal-forwarder.html
 [3]: ../filter-splunk/
