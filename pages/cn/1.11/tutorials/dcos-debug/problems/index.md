---
layout: layout.pug
title: 问题
navigationTitle: 问题
excerpt: 教程 - 排除 DC/OS 部署问题
menuWeight: 1
---

<!-- I. Problems Section -->

<a name="problems"></a>

# 应用程序部署问题

可能需要对 DC/OS 进行故障排除的一些问题包括应用程序：

- 根本未部署
- 部署非常缓慢
- 部署但未正确启动（或运行不正常）
- 反复重新启动
- 无法在 DC/OS 集群内部（或外部）访问

DC/OS 包括 [多个不同组件](https://docs.mesosphere.com/1.11/overview/architecture/components/) - 最常见的是 [Apache Mesos](http://mesos.apache.org/) 和 [Marathon](https://mesosphere.github.io/marathon/)。由于任何这些组件都可能涉及您遇到的问题，因此甚至很难找到导致问题的组件。因此，本教程旨在涵盖若干类型的此类问题。

当然，除了应用程序相关故障外，还有其他几类可能影响您集群的问题；网络问题、DC/OS 安装问题和 DC/OS 内部配置问题都可能导致您的集群中出现问题。虽然这些超出了本教程的范围，但我们鼓励您通过我们的[社区渠道](https://dcos.io/community/)提供想法和反馈。
