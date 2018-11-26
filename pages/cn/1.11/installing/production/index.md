---
layout: layout.pug
title: 生产 
navigationTitle: 生产 
menuWeight: 15
excerpt: 在生产就绪集群上安装 DC/OS
---

DC/OS 通过使用动态生成的配置文件安装到您的环境。此文件通过使用在配置过程中设置的特定参数生成。此安装文件包含 Bash 安装脚本和 Docker 容器，其中载有部署自定义 DC/OS 构建所需的所有要素。Docker 容器包含 DC/OS 的所有元素，因此可用于离线安装。

DC/OS 安装过程需要一组节点将 DC/OS 安装到单个节点上，以便从中运行 DC/OS 安装。对于任何基础架构上的完全运行正常的集群（包括本地、公共云或专用云），请遵循生产安装说明。生产安装方法之前称为自定义安装。

# 访问 DC/OS 配置文件

- 若要安装 DC/OS Enterprise，请联系销售代表或 <sales@mesosphere.io>可以访问 [此处](https://support.mesosphere.com/hc/en-us/articles/213198586-Mesosphere-Enterprise-DC-OS-Downloads) 的 DC/OS 配置文件。[enterprise type="inline" size="small" /]

- 可在 [此处](https://downloads.dcos.io/dcos/stable/dcos_generate_config.sh)下载最新、稳定、开源的 DC/OS 生成配置文件，或在 [开源项目网站] (https://dcos.io/releases/) 中查找旧版文件。[oss type="inline" size="small" /]
