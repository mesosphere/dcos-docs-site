---
layout: layout.pug
navigationTitle:  转换代理节点类型
title: 转换代理节点类型
menuWeight: 7
excerpt: 将代理节点转换为公共或私有代理节点。
enterprise: false
render: mustache
model: /mesosphere/dcos/1.13/data.yml
---

您可以将代理节点转换为现有 DC/OS 群集的公共或私有节点。

在安装过程中，代理节点被指定为 [公共](/mesosphere/dcos/1.13/overview/concepts/#public-agent-node) 或 [私有](/mesosphere/dcos/1.13/overview/concepts/#private-agent-node)节点。默认情况下，它们在 [GUI][1] 或 [CLI][2] 安装中被指定为 `private`。

### 先决条件：
这些步骤必须在配置为 DC/OS 节点的机器上执行。在此转换过程中将终止在节点上运行的任何任务。

1. 使用[自定义](/mesosphere/dcos/1.13/installing/evaluation/)安装方法安装 DC/OS。
2. 至少部署一个[管理](/mesosphere/dcos/1.13/overview/concepts/#master)和一个[专用](/mesosphere/dcos/1.13/overview/concepts/#private-agent-node)代理节点。
* 从您的[安装](/mesosphere/dcos/1.13/installing/evaluation/#backup)中获取存档 DC/OS 安装程序文件 (`dcos-install.tar`)。
* 安装 CLI JSON 处理器 [jq](https://github.com/stedolan/jq/wiki/Installation)。
* 安装并配置 SSH。需要访问 DC/OS 群集中的节点。

### 确定节点类型
您可以通过从 DC/OS CLI 运行此命令来确定节点类型。

- 运行此命令以确定群集中有多少个私有代理。`0`的结果表示没有私人代理。

    ```bash
    dcos node --json | jq --raw-output '.[] | select(.reserved_resources.slave_public == null) | .id' | wc -l
    ```

- 运行此命令以确定群集中有多少个公共代理。`0`的结果表示没有公共代理。

    ```bash
    dcos node --json | jq --raw-output '.[] | select(.reserved_resources.slave_public != null) | .id' | wc -l
    ```

### 卸载 DC/OS 私有代理软件

1. 卸载代理节点上的 DC/OS。

    ```bash
    sudo /opt/mesosphere/bin/dcos-shell
    sudo -i pkgpanda uninstall
    sudo systemctl stop dcos-mesos-slave
    sudo systemctl disable dcos-mesos-slave
    ```

1. 删除代理节点上的旧目录结构。

    ```bash
    sudo rm -rf /etc/mesosphere /opt/mesosphere /var/lib/mesos /var/lib/dcos
    ```

1. 重新启动机器。

    ```bash
    sudo reboot
    ```

### 安装 DC/OS 并转换代理节点

1. 复制存档的 DC/OS 安装程序文件（`dcos-install.tar`）到正在被转换的节点上。此存档在 GUI 或 CLI [安装](/mesosphere/dcos/1.13/installing/evaluation/)方法期间创建。

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

 [1]: /mesosphere/dcos/1.13/installing/evaluation/
 [2]: /mesosphere/dcos/1.13/installing/evaluation/
