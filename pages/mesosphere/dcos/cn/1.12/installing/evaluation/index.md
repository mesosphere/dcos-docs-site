---
layout: layout.pug
navigationTitle: 云安装
title: 云安装
menuWeight: 10
excerpt: 使用 Mesosphere Universal 安装工具在云环境中安装 DC/OS 的指南
---

<strong>Mesosphere 通用安装工具是在以下云提供程序上调配、部署、安装和升级 DC/OS 的推荐工具。跳转至您选择的云提供程序的指南，开始操作：</strong>

#### [Amazon Web Services 上的 DC/OS](/mesosphere/dcos/cn/1.12/installing/evaluation/aws/)

#### [DC/OS Azure 资源管理器](/mesosphere/dcos/cn/1.12/installing/evaluation/azure/)

#### [Google Cloud Platform 上的 DC/OS](/mesosphere/dcos/cn/1.12/installing/evaluation/gcp/)

# 关于 Mesosphere Universal 安装工具

目前市场上已经出现许多不同的安装方法，在群集中的一组节点上管理 DC/OS 的生命周期。这些安装方法包括 AWS CloudFormation 模板、Azure ARM 模板、Ansible Playbooks、dcos-launch、dcos-gcp 和 terraform-dcos。在这些方法中，每一个方法旨在解决特定的使用案例，因此，在支持 DC/OS 的完整生命周期（调配、部署、安装、升级、停用）上有一些限制。例如，AWS CloudFormation 和 Azure ARM 模板解决方案在首次部署群集后都不支持 DC/OS 中的升级过程，而 Ansible 角色与基础架构无关，并且不涵盖计算机本身的配置。

Terraform 是一种开源基础架构自动化工具，使用模板来管理多个公共云提供商、服务提供商和本地解决方案的基础架构。Terraform 创建基础设施，配置资源，并管理代理之间的通信。此工具的目的是对管理和维护分布式系统的大部分手动工作进行自动化。Universal 安装工具构建于 Terraform 之上。

使用 Mesosphere Universal 安装工具的主要目标如下：
- 提供一种在计算机群集上调配、部署、安装、升级和停用 DC/OS 的统一体验。
- 创建一个模块化、可重复使用的脚本，以便在各种操作系统和云提供程序上轻松分离 DC/OS，便于就地安装、升级和修改。
- 消除在哪种给定场景中应使用哪种 DC/OS 安装方法的混淆。这个自动化工具有助于构建相应模块，可为群集生命周期中的每个阶段编制最佳实践，并将必要的模块挂接到现有基础架构中。

## 先决条件
为了使用 Terraform 模板在云提供程序上部署 DC/OS，下面是必备条件：

- 安装 Terraform，并拥有运行和调配资源所需的基础架构凭据和权限。
- 准备与您选择的云提供商对应的本地 SDK。示例：设置 `AWS-CLI` 并包括默认区域。
- 准备使用 SSH 代理或直接传递公钥，将您的 SSH 凭据输入到您通过 Terraform 启动的实例中。这有助于您轻松与群集互动。
- 熟悉您要运行 DC/OS 所在的环境（例如，哪个云提供商）的特征，并了解该环境的特点和限制。
- 对于每个支持的 Terraform 提供程序，了解您的帐户上存在的 API 限制。
- 对于每个支持的 Terraform 提供程序，了解存在的不同配额，用来限制不同区域中可用资源的数量。
- 维护您的 Terraform 状态，了解该状态是在本地还是在云（即 AWS S3、GCP 云存储、Azure 存储帐户）中保存。
- 当使用共享的 Terraform 状态时，建议选择支持状态锁定的后端（即 AWS S3、GCP 云存储、Azure 存储帐户或本地），这样可以确保正在执行另一操作时其他用户无法更改状态。


## Mesosphere 支持的安装方法
这些安装方法用于快速演示和概念证明以及生产用的群集。下列安装方法支持升级。

以下任何方法均可用于安装 DC/OS：
- [Amazon Web Services (AWS)](/mesosphere/dcos/cn/1.12/installing/evaluation/aws/)：通过使用 Mesosphere Universal 安装工具在 AWS 上安装 DC/OS。
- [Azure](/mesosphere/dcos/cn/1.12/installing/evaluation/azure/)：通过使用 Mesosphere Universal 安装工具在 Microsoft Azure 上安装 DC/OS。
- [Google Cloud Platform (GCP)](/mesosphere/dcos/cn/1.12/installing/evaluation/gcp/)：通过使用 Mesosphere Universal 安装工具在 Google Cloud Platform (GCP) 上安装 DC/OS。
- [任何云](/mesosphere/dcos/cn/1.12/installing/evaluation/dcos-ansible/)：将 Mesosphere 通用安装工具连接到现有的 Ansible 设置中，并使用 Mesosphere 提供的 Ansible 角色来管理 DC/OS 群集生命周期。

## 其他安装方法
这些安装方法由社区提供，未经 Mesosphere 测试。在使用以下安装时，升级 DC/OS 不是受支持的功能。

- [AWS 上的 Cloudformation](/mesosphere/dcos/cn/1.12/installing/evaluation/community-supported-methods/aws/) (AWS)：使用 AWS CloudFormation 上的 DC/OS 模板为 Amazon Web Services (AWS) 创建 DC/OS 群集。
- [Azure 资源管理器模板](/mesosphere/dcos/cn/1.12/installing/evaluation/community-supported-methods/azure/)：使用 Azure 资源管理器模板在 Azure 上安装 DC/OS 群集。
- [用于 DigitalOcean 的 Mesosphere Universal 安装工具](/mesosphere/dcos/cn/1.12/installing/evaluation/community-supported-methods/digitalocean/)：使用配置为在 DigitalOcean 上运行 Mesosphere DC/OS 的 Terraform 模板，在 DigitalOcean 上安装您的 DC/OS 群集。
- [用于 Packet（裸机）的 Mesosphere Universal 安装工具](/mesosphere/dcos/cn/1.12/installing/evaluation/community-supported-methods/packet/)：裸机环境是计算机系统或网络，其中的虚拟机直接安装在硬件上，而不是安装在主机操作系统 (OS) 内。使用配置为在 Packet 上运行 Mesosphere DC/OS 的 Terraform 模板在 Packet 裸机上安装 DC/OS 群集。

<p class="message--note"><strong>注意：</strong>联系<a href="https://groups.google.com/a/dcos.io/forum/#!forum/users">邮寄列表</a>或 <a href="http://chat.dcos.io/?_ga=2.226911897.58407594.1533244861-1110201164.1520633201">Slack 渠道</a>，获取社区支持。</p>
