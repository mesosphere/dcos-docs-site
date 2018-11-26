---
layout: layout.pug
navigationTitle: 使用 Containerizer
title: 使用 Containerizer
menuWeight: 40
excerpt: 使用具有 Docker Engine 和 Universal Container Runtime 的Containerizer

enterprise: false
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->


Containerizer 提供围绕特定容器运行时间的容器化和资源隔离的抽取整理。DC/OS containerizer 支持以下容器运行时间：

- [Universal Container Runtime](/cn/1.11/deploying-services/containerizers/ucr/)。
- [Docker Engine](/cn/1.11/deploying-services/containerizers/docker-containerizer/)。

Universal Container Runtime (UCR) 的优势如下：

* 删除您对 Docker Engine 的依赖性。如果 Docker Engine 没有响应，则重新启动引擎会导致主机上的所有容器停止。此外，Docker 必须安装在每个代理节点上，并且每次发布新版本的 Docker 时都必须在代理节点上升级 Docker。
* 更稳定，允许大规模部署。
* 提供 Docker Engine 中未提供的功能，例如，GPU 和 CNI 支持。
* 允许您利用 Mesos 和 DC/OS 中的持续创新，包括每个容器的 IP、严格的容器隔离等功能。有关更多信息，请参阅[功能矩阵](#container-runtime-features)。
* 支持自动或手动支持容器镜像垃圾收集。

言简意赅地说，使用 UCR 代替 Docker Engine：

- 减少服务停机时间
- 提高即时可升级性
- 增加集群稳定性

# Container Runtime 的功能

下表列举了每个受支持容器运行时间的可用功能、支持这些功能的产品以及可配置功能的位置。

## DC/OS 功能

| 功能 | UCR | Docker | 备注 |
| --------------------------------------- | ----------- | --------- | -------- |
| **命令** | 是 | 是 | |
| **容器镜像** | 是 | 是 | |
| **镜像垃圾收集** | 是 | 是 | |
| **Pod** | 是 | 否 | |
| **GPU** | 是 | 否 | |
| **URI** | 是 | 是 | |
| **Docker 选项** | 否 | 是 | |
| **强制拉取** | 是 | 是 | |
| **密钥** | 是 | 是 | 仅限 DC/OS Enterprise |
| **基于文件的密钥** | 是 | 否 | 仅限 DC/OS Enterprise |
| **使用 exec 进行调试** | 是 | 否 | 仅限 CLI |
| **所有安全模式** | 是 | 是 | 仅限 DC/OS Enterprise |

## 容器后端

| 功能 | UCR | Docker |
| --------------------------------------- | ----------- | --------- |
| **Overlayfs** | 是 | 是 |
| **Aufs** | 是 | 是 |
| **绑定** | 是 | 不适用 |

## 存储

| 功能 | UCR | Docker | 备注 |
| --------------------------------------- | ----------- | --------- | --------- |
| **本地持久卷** | 是 | 是 | |
| **主机卷** | 是 | 是 | 仅限 CLI |
| **外部卷** | 是 | 是 | |

## 服务端点

| 功能 | UCR | Docker |
| --------------------------------------- | ----------- | --------- |
| **指定端口** | 是 | 是 |
| **编号端口** | 是 | 是 |

## 网络

| 功能 | UCR | Docker | 备注 |
| --------------------------------------- | ----------- | --------- | --------- |
| **主机网络** | 是 | 是 | |
| **桥接网络** | 是 | 是 | |
| **CNI** | 是 | 不适用 | |
| **CNM** | 不适用 | 是 | Docker 1.11+ |
| **L4LB** | 是 | 是 | 需要定义的服务端点。TCP 运行状况检查与 L4LB 不兼容。 |

## 专用注册表

| 功能 | UCR | Docker |
| --------------------------------------- | ----------- | --------- |
| **基于令牌的容器验证** | 否 | 是 |
| **基于令牌的集群验证** | 是 | 是 |
| **基本容器验证** | 否 | 是 |
| **基本集群验证** | 是 | 是 |

## 运行状况检查

| 功能 | UCR | Docker |备注 |
| --------------------------------------- | ----------- | --------- | --------- |
| **TCP** | 是 | 是 | 仅限 CLI |
| **HTTP/HTTPS** | 是 | 是 | 仅限 CLI |
| **命令** | 是 | 是 | |
| **本地 TCP** | 是 | 是 | 仅限 CLI |
| **本地 HTTP/HTTPS** | 是 | 是 | |
