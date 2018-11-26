---
layout: layout.pug
title: 安装
menuWeight: 30
excerpt: 安装 Enterprise 和开源版本 DC/OS
---

# DC/OS 安装

DC/OS 的安装涉及配置基础架构，并在物理或虚拟机集群上安装软件。

DC/OS 安装方法如下：

- **本地安装：** 此方法由新用户或开发人员用于构建服务或修改 DC/OS。Vagrant 安装工具提供一种快速免费的方式，在单台机器上部署虚拟集群。

- **云安装和本地安装：** 这些方法仅用于概念试用和概念验证 (Poc)。要在 Azure、AWS、GCE、Digital Ocean 或 Packet 上测试或演示 DC/OS，请遵循 [云安装说明](#cloud-install)。

- **生产安装：** 此方法用于任何基础架构上的完全功能集群。

# 安装方法概述
本节提供安装方法的概述。根据您的要求使用以下安装方法。

## 开发 
可以使用 [本地安装方法] 运行集群(/1.11/installing/development/)。此方法适合新用户或开发人员用于服务或修改 DC/OS。Vagrant 安装工具提供一种快速免费的方式，在单台机器上部署虚拟集群。
 

## 评估 
可以使用以下安装方法 [评估](/cn/1.11/installing/evaluation/) 安装过程：

### <a name="cloud-install"></a>云安装 
这种安装方法用于快速演示和验证概念。DC/OS CloudFormation 模板仅供参考，不推荐用于生产用途。

以下任何方法均可用于安装 DC/OS：
- [在 Amazon Web Services (AWS) 上提供 DC/OS](/cn/1.11/installing/evaluation/cloud-installation/aws/) ：使用 AWS CloudFormation 上的 DC/OS 模板为 Amazon Web Services (AWS) 创建 DC/OS 集群。
- [在 Azure 上提供 DC/OS](/cn/1.11/installing/evaluation/cloud-installation/azure/)：使用 Azure 资源管理器模板在 Azure 上安装 DC/OS 集群。
- [在 DigitalOcean 上提供 DC/OS](/cn/1.11/installing/evaluation/cloud-installation/digitalocean/)：使用配置为在 DigitalOcean 上运行 Mesosphere DC/OS 的 Terraform 模板，在 DigitalOcean 上安装您的 DC/OS 集群。
- [在 Google 云端平台 (GCE) 上提供 DC/OS](/cn/1.11/installing/evaluation/cloud-installation/gce/)：使用安装脚本在 Google 计算引擎 (GCE) 上安装 DC/OS 集群。此安装方法不支持升级。
- [在 Packet 裸机上提供 DC/OS](/cn/1.11/installing/evaluation/cloud-installation/packet/)：裸机环境是计算机系统或网络，其中的虚拟机直接安装在硬件上，而不是安装在主机操作系统 (OS) 内。使用配置为在 Packet 上运行 Mesosphere DC/OS 的 Terraform 模板在 Packet 裸机上安装 DC/OS 集群。
 
 **注意：** 安装可以就地升级的生产就绪的 DC/OS 的推荐方法是使用 [生产安装] (/1.11/installing/production/) 方法。

### 本地安装
[本地安装](/cn/1.11/installing/evaluation/on-premise-installation/) 方法在 [DC/OS labs 存储库] (https://github.com/dcos-labs)作了说明。各种类型的本地安装方法包括：
- [使用 Ansible](https://github.com/dcos-labs/ansible-dcos/blob/master/docs/INSTALL_ONPREM.md)
- [使用 Chef](https://github.com/dcos-labs/dcos-chef)
- [使用  Puppet](https://github.com/dcos-labs/dcos-puppet)


## <a name="production-install"></a>生产
[生产安装](/cn/1.11/installing/production/) 方法用于安装可升级的生产就绪的 DC/OS。这种方法之前被称为自定义安装。它涉及打包 DC/OS 分发并手动连接到每个节点，以运行 DC/OS 安装命令。若要与现有系统集成，或者您没有集群的 SSH 访问权限，则推荐使用这种方法。
