---
layout: layout.pug
navigationTitle: 运维
excerpt: 管理 HDFS 运行
title: 运维
menuWeight: 30
model: /cn/services/hdfs/data.yml
render: mustache
---

#include /cn/services/include/operations.tmpl

## 连接客户端

应用程序与 HDFS 的接口方式与其与任何 POSIX 文件系统的方式一样。但是，将充当 HDFS 部署的客户端节点的应用程序需要 `hdfs-site.xml` 和 `core-site.xml` 文件提供与集群通信所必需的配置信息。

从 DC/OS CLI 执行以下命令，检索客户端应用程序可用于连接到 HDFS 实例的 `hdfs-site.xml` 文件。

```bash
$ dcos {{ model.packageName }} --name=<service-name> endpoints hdfs-site.xml
...
$ dcos {{ model.packageName }} --name=<service-name> endpoints core-site.xml
...
```
