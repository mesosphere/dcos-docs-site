---
layout: layout.pug
navigationTitle: 教程
title: 教程
menuWeight: 140
excerpt: DC/OS 入门 

enterprise: false
---

这一系列教程将教您如何使用 DC/OS 在生产环境中运行和操作服务。

- [DC/OS 101](/cn/1.11/tutorials/dcos-101/) - 本教程包含为分布式环境开发和编排应用程序的基本方法。为了提供实践经验，您将在教程的每个步骤中在实际集群上开发和部署多个应用程序（包括有状态的、容器化和非容器化的）。
- [创建和运行服务](/cn/1.11/tutorials/create-service/) - 本教程介绍如何使用 DC/OS Web 界面和 CLI 创建和部署简单的单命令服务和容器化服务。

- [在 DC/OS 上运行有状态服务](/cn/1.11/tutorials/stateful-services/) - 本教程向您展示如何在 DC/OS 上安装和运行有状态服务。
- [使用 Marathon 自动扩展](/cn/1.11/tutorials/autoscaling/) - 这三个教程将引导您完成基于 CPU 和内存、每秒请求或队列长度而自动扩展 Marathon 服务的流程。
- [部署负载均衡数据管线](/cn/1.11/tutorials/iot_pipeline/)向您展示如何在 15 分钟内在 DC/OS 上构建负载均衡数据管线。
- [使用 Jenkins 部署 Marathon 应用程序](/cn/1.11/tutorials/deploy-on-marathon/) -本教程介绍如何使用 Jenkins for DC/OS 在 Marathon 上部署应用程序。它将指导您创建新的 Jenkins 作业，在源代码更改时发布 Docker 容器，并根据项目的 `marathon.json` 文件中包含的应用定义将这些更改部署到 Marathon。
- [标记任务和作业](/cn/1.11/tutorials/task-labels/) - 本教程说明如何使用 DC/OS Web 界面和 Marathon HTTP API 定义标签，以及如何根据标签值条件查询与正在运行的应用程序和作业有关的信息。
- [调试 DC/OS 上的应用程序](/cn/1.11/tutorials/dcos-debug/) - 本教程系列提供在 DC/OS 上部署期间和之后调试应用程序的自上而下的简介。
