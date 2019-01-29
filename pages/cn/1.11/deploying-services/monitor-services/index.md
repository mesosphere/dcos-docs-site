---
layout: layout.pug
navigationTitle: 监控服务
title: 监控服务
menuWeight: 3
excerpt: 在 CLI 和 Web 界面监控部署的 DC/OS 服务

enterprise: false
---


您可以在 CLI 和 Web 界面监控部署的 DC/OS 服务。

# 监控 Universe 服务

## CLI

在 DC/OS CLI 中输入 `dcos service` 命令。在本示例中，您可以看到安装的 DC/OS 服务 Chronos、HDFS 和 Kafka。

```bash
dcos service
NAME      HOST             ACTIVE  TASKS CPU   MEM     DISK   ID
chronos   <privatenode1>   True     0    0.0    0.0     0.0   <service-id1>
hdfs      <privatenode2>   True     1    0.35  1036.8   0.0   <service-id2>
kafka     <privatenode3>   True     0    0.0    0.0     0.0   <service-id3>
```

## Web 界面

查看监控 [文档](/cn/1.11/monitoring/)。

# 监控用户创建的服务

## CLI

在 DC/OS CLI 中输入 `dcos task` 命令。在本示例中，您可以看到安装的 DC/OS 服务 Chronos、HDFS、Kafka 和用户创建的服务 `suzanne-simple-service`。

```bash
dcos task
NAME                    HOST        USER  STATE  ID                                                           
cassandra               10.0.3.224  root    R    cassandra.36031a0f-feb4-11e6-b09b-3638c949fe6b               
node-0                  10.0.3.224  root    R    node-0__0b165525-13f2-485b-a5f8-e00a9fabffd9                 
suzanne-simple-service  10.0.3.224  root    R    suzanne-simple-service.47359150-feb4-11e6-b09b-3638c949fe6b
```

## Web 界面

查看监控 [文档](/cn/1.11/monitoring/)。
