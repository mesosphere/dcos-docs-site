---
layout: layout.pug
navigationTitle: Kafka 2.3.0-1.1.0
excerpt:
title: Kafka 2.3.0-1.1.0
menuWeight: 8
model: /cn/services/kafka/data.yml
render: mustache
---

<!-- Imported from https://github.com/mesosphere/dcos-commons.git:sdk-0.40 -->

DC/OS {{ model.techName }} 是一种自动化服务，可轻松部署和管理 Mesosphere DC/OS 上的 {{ model.techName }}，消除几乎所有与管理 {{ model.techShortName }} 集群相关联的复杂性。{{ model.techName }} 是一个分布式的高吞吐量发布-订阅消息系统，具有很强的保序性。{{ model.techShortName }} 集群具有高可用性、容错性和非常高的耐用性。如需有关 {{ model.techName }} 的更多信息，请参阅 {{ model.techName }} [文档](http://kafka.apache.org/documentation.html)。DC/OS {{ model.techShortName }} 允许您直接访问 {{ model.techShortName }} API，从而使现有生产者和消费者进行互操作。您可以快速配置和安装 DC/OS {{ model.techShortName }}。多个 {{ model.techShortName }} 集群可安装在 DC/OS 上，并单独受管理，所以您可以将 {{ model.techShortName }} 作为管理服务提供给您的组织。

## 优势

DC/OS {{ model.techShortName }} 提供的半管理服务具有以下优势：

* 易于安装
* 多个 {{ model.techShortName }} 集群
* broker 的弹性扩展
* 复制和正常关闭，实现高可用性
* {{ model.techShortName }} 集群和 broker 监控

## 特性

DC/OS {{ model.techShortName }} 提供以下功能：

* 单命令安装，以快速配置
* 用于多个 DC/OS 租户的多个集群
* 高可用性运行时配置和软件更新
* 提高数据持久性的存储卷，被称为 Mesos 动态预留和持久卷
* 与 syslog 兼容的记录服务相集成，用于诊断和故障排除
* 与 statsd 兼容的度量服务相集成，实现容量和性能监控

# 相关服务

* [DC/OS Spark](/services/spark/)
