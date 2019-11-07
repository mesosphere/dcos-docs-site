---
layout: layout.pug
navigationTitle: 创建群集
title: 创建群集
menuWeight: 1
excerpt: 让我们通过创建群集开始您的 DC/OS 之旅（第 1 部分）
渲染：胡须
模型：/mesosphere/dcos/1.13/data.yml
---
本教程演示使用最常见的默认配置选项创建小型 DC/OS 群集以及验证对群集的访问的基本步骤。您必须成功完成本教程中的步骤，然后才能执行任何其他管理任务或探索其他功能。

完成本教程后，您将拥有包含以下内容的单个 DC/OS 群集：
- 一个 [管理节点](../../../overview/architecture/node-types/#master-nodes)。
- 两个 [专用代理节点](../../../overview/architecture/node-types/#agent-nodes)。
- 一个 [公共代理节点](../../../overview/architecture/node-types/#agent-nodes)。

完成本教程大约需要 20 分钟。

如果您需要有关硬件或软件系统要求的更多信息，或需要帮助执行任何步骤，请参阅 [设置说明](../../../installing/)。

# 开始之前
要开始学习本教程：
- 您必须使用支持的操作系统访问物理计算机或虚拟机镜像。

- 您必须拥有计划安装 DC/OS 的本地操作系统或云提供程序实例的具有管理权限的帐户。

- 您必须安装 [Docker](https://www.docker.com/get-started) 的支持版本。

在开始本教程之前，您还应验证您是否具备完成教程任务所需的以下技能和信息。

### 知识
- 基本了解群集相关概念、软件容器、分布式工作负载处理和应用程序部署。

- 基本熟悉 Linux 系统管理以及如何使用常用命令行程序来处理文件和目录，例如 `ls`、`mkdir` 和 `rm` 命令。

    您还应该知道如何显示使用信息和特定于命令的 `man` 页面。

### 技能
- 基本的文本编辑技能和使用配置文件、JSON 格式化文件和文本编辑器的经验，例如 `vim` 或 `nano`。

- 使用终端 shell 和安全外壳 (SSH) 连接访问远程服务器和工作站的经验。

    您必须能够使用客户端应用程序(如，iTerm、Konsole、gnome-终端、或 PuTTY)启动 SSH 会话。

# 学习目的
为了简化操作，本教程将通过创建具有单个管理节点的群集对您进行指导。但是，要运行生产工作负载，您应该有多个管理节点。

完成本教程，您将学习到：
- 如何下载安装包并创建用于分发安装文件的 bootstrap 节点。
- 如何分发安装包并将计算机指定为管理节点。
- 如何分发安装包并配置专用和公共代理节点。
- 如何打开 DC/OS 基于 Web 的管理控制台，并使用它在 Web 浏览器中查看有关您群集的基本信息。
- 如何安装 DC/OS 命令行界面并使用它来查看您的群集。

# 预览您将做的事情
您需要执行以下关键任务以创建新的 DC/OS 群集：
- 准备[bootstrap 节点](/mesosphere/dcos/1.13/installing/production/system-requirements/#bootstrap)。
- 配置 DC/OS [管理节点](/mesosphere/dcos/1.13/installing/production/system-requirements/#master-nodes)。
- 配置 DC/OS [专用代理节点](/mesosphere/dcos/1.13/installing/production/system-requirements/#agent-nodes)。
- 配置 DC/OS [公共代理节点](/mesosphere/dcos/1.13/installing/production/system-requirements/#agent-nodes)。

# 准备 bootstrap 节点
1. 确定一台充当新群集的 **bootstrap 节点** 的计算机。

    [bootstrap 节点](/mesosphere/dcos/1.13/installing/production/system-requirements/#bootstrap) 计算机为 DC/OS 群集配置和分发文件提供一个集中位置。bootstrap 节点：
    - 必须能够使用 SSH 通过网络连接到所有群集节点。
    - 可以在安装完成后进行备份并关闭。
    - 不应包含在 DC/OS 群集中。

1. 使用管理凭据登录到 bootstrap 节点。

1. 通过运行类似以下命令，检查 Docker 系统进程 (`dockerd`) 是否可用：

    ```bash
    docker info
    ```

    如果 Docker 守护程序进程不可用，此命令将返回错误。

1. 下载 [DC/OS Open Source](https://downloads.dcos.io/dcos/stable/1.13.2/dcos_generate_config.sh) 或 [DC/OS Enterprise](http://downloads.mesosphere.com/dcos-enterprise/stable/1.13.2/dcos_generate_config.ee.sh) 工件到 bootstrap 节点。

1. 通过运行类似以下命令，从下载的文件中提取内容：

    ```bash
    /bin/sh dcos_generate_config.ee.sh
    ```

1. 更改为 DC/OS 配置目录，并验证您是否拥有 `config.yaml` 文件：

    ```bash
    cd genconf && ls -al
    ```

    最初，`config.yaml` 文件仅包含可用作设置 DC/OS 配置选项的框架的几行内容。

## 准备群集配置文件
1. 在文本编辑器中打开 `config.yaml` 文件以自定义本教程的设置。

    例如，使用类似于以下内容的设置修改文件：

    ```bash
    bootstrap_url: http://10.0.0.100
    cluster_name: 'Mesosphere DC/OS Tutorial'
    exhibitor_storage_backend: static
    master_discovery: static
    master_list:
    - 10.0.0.50
    resolvers:
    - 169.254.169.253
    - 127.0.0.1
    security: permissive
    ```

    您可以使用 `config.yaml` 文件设置更多基本和高级的配置选项。有关可用设置和最常用设置示例的信息，请参阅 [高级配置参考](/mesosphere/dcos/1.13/installing/production/advanced-configuration/configuration-reference/) 和 [示例](/mesosphere/dcos/1.13/installing/production/deploying-dcos/configuration/examples/)。

1. 保存配置设置。

1. 将所需的脚本或文件添加到 `genconf` 目录。

    除了 `config.yaml` 文件，您应该在 `genconf` 目录中提供以下文件：
    - [ip-detect](/mesosphere/dcos/1.13/installing/production/deploying-dcos/installation/#ip-detect-script) - 所有 DC/OS 群集都需要此脚本。
    - [license.txt](/mesosphere/dcos/1.13/installing/production/deploying-dcos/installation/#license) - DC/OS 企业群集需要此文件。
    - [fault-domain-detect](/mesosphere/dcos/1.13/installing/production/deploying-dcos/installation/#fault-domain) - DC/OS 企业群集需要此脚本。

## 创建分发中心
1. 运行 DC/OS 安装脚本
以在 `./genconf/serve/` 目录中为您的群集
生成自定义构建文件。

    ```bash
    sudo bash dcos_generate_config.ee.sh
    ```

1. 通过在 bootstrap 节点上运行以下命令，准备 Web 服务器 NGINX Docker 容器以共享分发的自定义构建文件：

    ```bash
    sudo docker run -d -p 80:80 -v $PWD/genconf/serve:/usr/share/nginx/html:ro nginx
    ```

# 创建管理节点
1. 在 bootstrap 节点上打开终端 shell，然后启动安全外壳 (SSH) 会话以连接到管理节点。

    ```bash
    ssh <master-ip>
    ```

1. 为 DC/OS 管理节点文件创建新目录并导航到该目录。

    ```bash
    mkdir /tmp/dcos && cd /tmp/dcos
    ```

1. 从 NGINX Docker 容器下载 DC/OS 安装脚本，将 `bootstrap-ip` 和 `port` 替换为您在 `config.yaml` 文件中为 `bootstrap_url` 指定的设置：

    ```bash
    curl -O http://<bootstrap-ip>:<your_port>/dcos_install.sh
    ```

1. 运行以下命令，在管理节点上安装 DC/OS。

    ```bash
    sudo bash dcos_install.sh master
    ```

在生产环境中，您将重复这些步骤以创建两个或四个其他管理节点。

# 配置专用代理节点
1. 在 bootstrap 节点上打开终端 shell，然后启动安全外壳 (SSH) 会话以连接到第一个专用代理节点。

    ```bash
    ssh <agent-ip>
    ```

1. 为 DC/OS 代理文件创建新目录并导航到该目录。

    ```bash
    mkdir /tmp/dcos && cd /tmp/dcos
    ```

1. 从 NGINX Docker 容器下载 DC/OS 安装脚本，将 `bootstrap-ip` 和 `port` 替换为您在 `config.yaml` 文件中为 `bootstrap_url` 指定的设置：

    ```bash
    curl -O http://<bootstrap-ip>:<your_port>/dcos_install.sh
    ```

1. 运行以下命令以安装 DC/OS 并将此节点指定为 **专用代理** 节点。

    ```bash
    sudo bash dcos_install.sh slave
    ```
1. 重复这些步骤以创建第二个专用代理节点。

在生产环境中，您将自动执行这些步骤，以便根据需要创建尽可能多的专用代理节点。


# 配置公共代理节点
1. 在 bootstrap 节点上打开终端 shell，然后启动安全外壳 (SSH) 会话以连接到公共代理节点。

    ```bash
    ssh <agent-ip>
    ```

1. 为 DC/OS 代理文件创建新目录并导航到该目录。

    ```bash
    mkdir /tmp/dcos && cd /tmp/dcos
    ```

1. 从 NGINX Docker 容器下载 DC/OS 安装脚本，将 `bootstrap-ip` 和 `port` 替换为您在 `config.yaml` 文件中为 `bootstrap_url` 指定的设置：

    ```bash
    curl -O http://<bootstrap-ip>:<your_port>/dcos_install.sh
    ```

1. 运行以下命令以安装 DC/OS 并将此节点指定为 **公共代理** 节点。

    ```bash
    sudo bash dcos_install.sh slave_public
    ```

# 验证您的群集是否已准备就绪
1. 打开 web 浏览器并导航至管理节点 IP 地址，以访问 DC/OS 基于 web 的管理控制台。

    例如，如果管理节点 IP 地址为 192.168.47.1，则在浏览器地址栏中输入 http://192.168.47.1 作为 URL。

1. 键入您的管理用户名和密码，然后单击 **登录**。

    ![登录到管理控制台](/mesosphere/dcos/1.13/img/tutorial-sample-login.png)

    如果连接成功，则显示 DC/OS 仪表板。

    ![管理控制台中的 DC/OS 仪表板](/mesosphere/dcos/1.13/img/tutorial-sample-dashboard.png)

祝贺您！您已成功创建第一个 DC/OS 群集。现在，您可以开始在后续教程中使用此群集来探索可以做的事情。

# 后续步骤
现在您已经运行了一个小群集，您可以安装 DC/OS 命令行界面 (CLI) 并开始探索管理和操作任务。
- [安装命令行界面](../cli/)
- [从包资源库安装第一个服务](../first-package/)
- [部署您的第一个示例应用程序]](../first-app)

# 相关主题
本教程主要介绍使用简单的配置文件和几个手动输入的命令交互式准备和安装 DC/OS 群集。

### 有关安装选项的更多信息
您还可以使用其他几种方法来安装 DC/OS 群集。例如，如果您正从公共云提供程序（如，AWS、Azure 或 Google 云端平台）在公共云上安装 DC/OS，则还有其他安装选项。有关其他安装选项的信息，请参阅以下主题：
- [使用 Universal 安装工具在 AWS 上的 DC/OS](/mesosphere/dcos/1.13/installing/evaluation/aws/)
- [使用 Universal 安装工具在 Azure 上的 DC/OS](/mesosphere/dcos/1.13/installing/evaluation/azure/)
- [使用 Universal 安装工具在 GCP 上的 DC/OS](/mesosphere/dcos/1.13/installing/evaluation/gcp/)
- [其他安装方法](/mesosphere/dcos/1.13/installing/evaluation/community-supported-methods/)

### 有关群集架构和组件的更多信息
如需了解 DC/OS 平台以及构成平台架构层的组件，请参阅 [架构概述](../../../overview/architecture/)。

如果您想了解有关 DC/OS 架构和关键组件的更多信息，请参阅以下主题：

- [平台生态系统概述](../../../overview/architecture/components/)
- [Mesos 群集管理和编排](../../../overview/architecture/components/#cluster-management)。
- [Marathon 框架和应用定义](../../../overview/architecture/components/#container-orchestration)。
- [Metronome 作业管理和调度](../../../overview/architecture/components/#dcos-jobs)。
