---
layout: layout.pug
title: 本地安装 
navigationTitle: 本地安装 
menuWeight: 15
excerpt: 在生产就绪群集上安装 DC/OS
---

DC/OS 通过使用动态生成的配置文件安装到您的环境。此文件通过使用在配置过程中设置的特定参数生成。此安装文件包含 Bash 安装脚本和 Docker 容器，其中载有部署自定义 DC/OS 构建所需的所有要素。Docker 容器包含 DC/OS 的所有元素，因此可用于离线安装。

DC/OS 安装过程需要将 DC/OS 安装到一组节点，并在一个节点上运行 DC/OS 安装。对于任何基础架构（包括本地、公共云或专用云）上的完全正常运行的群集，请遵循本地安装说明。本地安装方法之前被称为自定义安装。

# 访问 DC/OS 配置文件

- 若要安装 DC/OS Enterprise 版本，请联系销售代表或 <sales@mesosphere.io>。您可以使用 [登录凭据](https://support.mesosphere.com/s/downloads) 从 [支持网站](https://support.mesosphere.com/s/login/) 访问 DC/OS Enterprise 配置文件。[enterprise type="inline" size="small" /]

- 可在 [此处](https://downloads.dcos.io/dcos/stable/dcos_generate_config.sh)下载最新、稳定、开源的 DC/OS 生成配置文件，或在 [开源项目网站] 文件(https://dcos.io/releases/) 中查找旧版文件。[oss type="inline" size="small" /]
