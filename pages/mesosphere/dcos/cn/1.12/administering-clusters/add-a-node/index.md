---
layout: layout.pug
navigationTitle: 添加代理节点
title: 添加代理节点
menuWeight: 800
excerpt: 向现有 DC/OS 群集添加代理节点
enterprise: false
---

在安装过程中，代理节点被指定为 [公共](/mesosphere/dcos/latest/overview/concepts/#public-agent-node) 或 [私用](/mesosphere/dcos/latest/overview/concepts/#private-agent-node)节点。默认情况下，它们在 GUI 或 CLI [安装](/mesosphere/dcos/latest/installing/evaluation/) 中被指定为私用节点。

## 前提条件：

* DC/OS 使用 [自定义](/mesosphere/dcos/latest/installing/production/deploying-dcos/installation/) 安装方法安装。
* 来自您的[安装](/mesosphere/dcos/latest/installing/evaluation/)的存档 DC/OS 安装程序文件（`dcos-install.tar`）。
* 满足 [系统要求](/mesosphere/dcos/latest/installing/production/system-requirements/) 的可用代理节点。
* CLI JSON 处理器 [jq](https://github.com/stedolan/jq/wiki/Installation)。
* 已安装和配置 SSH。这是访问 DC/OS 群集中的节点所需的。

## 安装 DC/OS 代理节点
复制存档的 DC/OS 安装程序文件（`dcos-install.tar`）到代理节点。此存档在 GUI 或 CLI [安装](/mesosphere/dcos/latest/installing/evaluation/#backup)期间创建。

1. 将文件复制到代理节点。例如，您可以使用安全拷贝 (scp) 来复制 `dcos-install.tar` 到您的主目录：

    ```bash
    scp ~/dcos-install.tar $username@$node-ip:~/dcos-install.tar
    ```

2. SSH 至机器：

    ```bash
    ssh $USER@$AGENT
    ```

1. 为安装程序文件创建目录：

    ```bash
    sudo mkdir -p /opt/dcos_install_tmp
    ```

1. 解开 `dcos-install.tar` 文件包：

    ```bash
    sudo tar xf dcos-install.tar -C /opt/dcos_install_tmp
    ```

1. 运行此命令以在代理节点上安装 DC/OS。您必须将代理节点指定为公共或私有节点。

 私有代理节点：

    ```bash
    sudo bash /opt/dcos_install_tmp/dcos_install.sh slave
    ```

 公共代理节点：

    ```bash
    sudo bash /opt/dcos_install_tmp/dcos_install.sh slave_public
    ```

## 验证节点类型

您可以通过从 DC/OS CLI 运行这些命令来验证节点类型。


- 运行此命令以计算私用代理数量。

    ```bash
    dcos node --json | jq --raw-output '.[] | select(.reserved_resources.slave_public == null) | .id' | wc -l
     ```
 
- 运行此命令以计算公共代理数量。

    ```bash
    dcos node --json | jq --raw-output '.[] | select(.reserved_resources.slave_public != null) | .id' | wc -l
     ```
 
 
