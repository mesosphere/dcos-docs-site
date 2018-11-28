---
layout: layout.pug
navigationTitle: 更新 CLI
title: 更新 CLI
menuWeight: 3
excerpt: 更新命令行界面

enterprise: false
---


您可以将 DC/OS CLI 更新为最新版本或降级到旧版本。

# <a name="upgrade"></a>升级 CLI

**注意：** 如果您从 PyPI 下载 CLI 或从 DC/OS UI 版本 1.7 或更早版本下载，您必须完全[卸载](/cn/1.11/cli/uninstall/) CLI。您无法升级。

您可以将现有 DC/OS CLI 安装升级到最新版本。

1. 删除当前 CLI 二进制文件。例如，如果您安装到 `/usr/local/bin/`：

    ```bash
    rm -rf /usr/local/bin/dcos
    ```

1. 将 DC/OS CLI 二进制文件 (`dcos`）下载到本地目录（例如， `/usr/local/bin/`）。使用所需升级版本更新命令 (`<version>`):

    ```bash
    curl https://downloads.dcos.io/binaries/cli/darwin/x86-64/dcos-<dcos-version>/dcos
    ```

 **注意：** CLI 必须安装在 DC/OS 集群外部的系统上。

1. 使 CLI 二进制文件可执行。

    ```bash
    chmod +x dcos
    ```

 **注意：** 如果系统无法找到可执行文件，您可能需要重新打开命令提示符或手动将安装目录添加到 PATH 环境变量中。

1. 将 CLI 指向 DC/OS 管理节点。在本示例中， `http://example.com` 是管理节点 IP 地址。

    ```bash
    dcos cluster setup http://example.com
    ```

 遵循 DC/OS CLI 中的说明。有关安全的更多信息，请参阅[文档](/cn/1.11/security/)。您的 CLI 现在应可通过您集群的身份认证！输入 `dcos` 即可开始。

    ```bash
    dcos
    Command line utility for the Mesosphere Datacenter Operating
    System (DC/OS). The Mesosphere DC/OS is a distributed operating
    system built around Apache Mesos. This utility provides tools
    for easy management of a DC/OS installation.

    Available DC/OS commands:

       auth           	Authenticate to DC/OS cluster
       config         	Manage the DC/OS configuration file
       help           	Display help information about DC/OS
       marathon       	Deploy and manage applications to DC/OS
       node           	Administer and manage DC/OS cluster nodes
       package        	Install and manage DC/OS software packages
       service        	Manage DC/OS services
       task           	Manage DC/OS tasks

    Get detailed command description with 'dcos <command> --help'.
    ```

# <a name="downgrade"></a>降级 CLI

您可以将现有 DC/OS CLI 安装降级到旧版本。

1. 删除当前 CLI 二进制文件：

    ```bash
    rm path/to/binary/dcos
    ```

1. 从要安装新 DC/OS CLI 二进制文件的目录中，输入此命令以用指定的降级版本 (`<version>`) 更新 DC/OS CLI：

    ```bash
    curl https://downloads.dcos.io/binaries/cli/darwin/x86-64/<version>/dcos
    ```
