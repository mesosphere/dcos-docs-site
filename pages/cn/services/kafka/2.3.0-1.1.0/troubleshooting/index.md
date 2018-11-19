---
layout: layout.pug
navigationTitle: 故障排除
excerpt: 诊断 Kafka
title: 故障排除
menuWeight: 70
model: /cn/services/kafka/data.yml
render: mustache
---

#include /cn/services/include/troubleshooting.tmpl

## 分区复制

在检测到任何复制不足的分区时，{{ model.techShortName }} 可能会变得不健康。此错误状况通常表示 broker 已出故障。使用 `dcos {{ model.packageName }} --name={{ model.serviceName }} topic under_replicated_partitions` 和 `dcos {{ model.packageName }} --name={{ model.serviceName }} topic describe <topic-name>` 命令来查找问题 broker 并确定需要哪些操作。

可能的修复操作包括 [重新启动受影响的 broker](#restart-a-node) 和 [破坏性替换受影响的 broker](#replacing-a-permanently-failed-node)。`replace` 操作具有破坏性，将会不可撤销地丢失与 broker 有关的所有数据。 `restart` 操作没有破坏性，并表示尝试重新启动 broker 进程。


## Broker 关闭

如果 {{ model.techShortName }} broker 无法在所配置的
`brokers.kill_grace_period`（终止宽限期）内完全关闭，则延长终止宽限期。
