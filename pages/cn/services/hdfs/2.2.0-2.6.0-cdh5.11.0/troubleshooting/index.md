---
layout: layout.pug
navigationTitle: 故障排除
excerpt: 诊断 HDFS 问题
title: 故障排除
menuWeight: 70
model: /cn/services/hdfs/data.yml
render: mustache
---



#include /cn/services/include/troubleshooting.tmpl

# 故障排除已替换的日志节点

以下部分介绍如何执行日志节点的 `replace`。本指南使用日志节点 0 
指示不健康的日志节点，因为它是被替换的日志节点。

## 替换命令

通过以下方式替换日志节点：
```bash
$ dcos {{ model.packageName }} --name={{ model.serviceName }} pod replace journal-0
```

## 检测到在`replace` 之后的不健康的日志节点

替换后的日志节点启动并运行后，您应该在 `stderr` 日志中看到以下内容：
```
org.apache.hadoop.hdfs.qjournal.protocol.JournalNotFormattedException: Journal Storage Directory
```

这表示此日志节点不健康。

## 确定健康的日志节点

从未替换的日志节点，确认日志节点是健康的：
 - 检查 `stderr` 日志并检查是否存在错误。
 - 在 `journal-data/hdfs/current` 中，检查以下方面：
 - 连续 `edits_xxxxx-edits_xxxxx` 个文件，每个时间戳差别约 2 分钟。
 - 一个 `edits_inprogess_` 文件在过去 2 分钟内修改。

确定后，记录哪个日志节点是健康的。

## 修复不健康的日志节点

1. 通过以下方式将 SSH 置入不健康日志节点的沙盒
```bash
$ dcos task exec -it journal-0 /bin/bash
```

2. 在此沙盒中，创建目录 `journal-data/hdfs/current`：
```bash
$ mkdir -p journal-data/hdfs/current
```

3. 从之前确定的健康日志节点中，复制 `VERSION` 文件的内容到 `journal-data/hdfs/current/VERSION`。

4. 在不健康的日志节点上，创建与健康日志节点上的 `VERSION` 文件具有相同路径的文件：
`journal-data/hdfs/current/VERSION`. 将复制的内容粘贴到此文件中。

5. 通过以下方式重新启动不健康的日志节点：
```bash
$ dcos {{ model.packageName }} --name={{ model.serviceName }} pod restart journal-0
```

6. 重新启动的日志节点启动并运行后，通过检查 `stderr` 日志确认节点已经是健康状态。您应该看到：
```bash
INFO namenode.FileJournalManager: Finalizing edits file
```
