---
layout: layout.pug
navigationTitle: 部署作业
title: 部署作业
menuWeight: 120
excerpt: 在不安装单独服务的情况下创建作业
beta: true
enterprise: false
---

您可以在 DC/OS 中创建计划作业，而不安装单独的服务。在 DC/OS Web 界面、DC/OS CLI 中或通过 API 创建和管理作业。

**注意：** DC/OS 的作业功能由 [DC/OS Jobs (Metronome)](https://github.com/dcos/metronome) 组件提供，该组件是预安装 DC/OS 的开源 Mesos 框架。您有时可能会在日志中看到这个作业功能被称为“Metronome”，并且服务端点是 `service/metronome`。

## 功能

您可以将作业创建为创建作业时包含的单个命令，也可以指向 Docker 镜像。

创建作业时，您可以指定：

* 作业将消耗的 CPU 量。
* 作业将消耗的内存大小。
* 作业将占用的磁盘空间。
* cron 格式的作业时间表。您还可以设置时区和开始时间。
* 要附加到作业的任意数量的标签。
* 您作业的权限。
* 您的作业所属的组。
