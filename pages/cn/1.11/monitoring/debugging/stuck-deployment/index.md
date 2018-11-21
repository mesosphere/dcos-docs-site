---
layout: layout.pug
navigationTitle: 部署卡住
title: 部署卡住
menuWeight: 30
excerpt: 了解邀约匹配和失败的部署

enterprise: false
---


# 邀约匹配如何起作用

由于 Mesos 资源邀约无法匹配来自服务或 Pod [Marathon 应用定义] 的资源请求，DC/OS 服务或 Pod 可能无法部署(/1.11/deploying-services/creating-services/)。

以下是对邀约匹配过程的概述。

1. 您通过 DC/OS CLI (`dcos marathon app add <my-service>.json`) 或 DC/OS Web 界面，将一个服务或 Pod 定义发布到 Marathon。应用定义指定资源要求、布局约束以及要启动的实例数。

1. Marathon 将新服务或 Pod 添加到启动队列。

1. Mesos 每 5 秒钟（默认值）按每个代理发送一个邀约。

1. 对于每个资源邀约，Marathon 检查启动队列中是否有其要求均匹配邀约的服务或 Pod。如果 Marathon 发现存在其要求匹配邀约的服务或 Pod，Marathon 将启动该服务。

1. 如果匹配的邀约不符合服务或 Pod 的要求和约束，Marathon 将无法启动该服务或 Pod。

  <table class=“table” bgcolor=#7d58ff>
  <tr> 
    <td align=justify style=color:white><strong>注意：</strong>必须在单个主机上提供所需的全部资源。</td> 
  </tr> 
  </table>

# 为什么服务或 Pod 被卡住

您的服务或 Pod 可能无法部署的原因有很多。可能的情况包括：

- Marathon 没有获得为启动应用程序所需的资源邀约。
 使用 [CLI](/cn/1.11/monitoring/debugging/cli-debugging/) 调试子命令或 [DC/OS Web 界面中的调试页面](/cn/1.11/monitoring/debugging/gui-debugging/) 来解决来自 Mesos 的不匹配或未接受的资源邀约。您也可以 [查阅服务和任务日志](/cn/1.11/monitoring/logging/)。

- 服务的健康状况检查失败。如果服务执行健康状况检查，则在通过健康状况检查前，部署不会完成。您可以从 [DC/OS Web 界面] 查看执行 Marathon 健康检查的服务的健康状况(/1.11/monitoring/debugging/gui-debugging/)。要通过 Marathon 健康检查了解有关服务健康状况的更多信息，请从 DC/OS CLI 运行 `dcos marathon app list --json`。

- `docker pull` 出现故障。
 如果应用程序在 Docker 镜像中运行，Mesos 代理节点将首先需要拉取 Docker 镜像。如果出现故障，应用程序可能会陷入“正在部署”状态。Mesos 代理节点日志 (`<dcos-url>/mesos/#/agents/`) 将包含此信息。您将在日志中看到类似以下内容的错误。

  ```
  6b50d4f5-05d6-4b99-bb63-115d5acd2aca-0000 failed to start: Failed to run 'docker -H unix:///var/run/docker.sock pull /mybadimage/fakeimage:latest': exited with status 1; stderr='Error parsing reference: "/mybadimage/fakeimage:latest" is not a valid repository/tag
  ```

- 您的应用或应用组定义配置不当。
 DC/OS Web 界面对 Marathon 应用和 Pod 定义执行一些验证。
