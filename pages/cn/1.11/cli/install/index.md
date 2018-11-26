---
layout: layout.pug
navigationTitle: 安装 CLI
title: 安装 CLI
menuWeight: 1
excerpt: 安装 DC/OS 命令行界面

enterprise: false
---

建议从 DC/OS Web 界面安装 DC/OS CLI。或者，您可以使用以下说明手动安装 CLI。

# 从 Web 界面安装 CLI

1. 在 DC/OS Web 界面的左上角，单击集群名称右侧的向下箭头。

![打开集群弹出窗口](/cn/1.11/img/open-cluster-popup.png)

图 1. 打开集群弹出菜单

1. 选择 **安装 CLI**。

![CLI 安装 UI](/cn/1.11/img/install-cli.png)

图 2. 选择安装 CLI

1. 将适合您操作系统的代码片段复制并粘贴到您的终端。

![CLI 复制/粘贴](/cn/1.11/img/install-cli-terminal.png)

图 3. 代码片段窗口

# <a name="manual"></a>手动安装 CLI

* [在 Linux 上安装 DC/OS CLI](#linux)
* [在 macOS 上安装 DC/OS CLI](#osx)
* [在 Windows 上安装 DC/OS CLI](#windows)

## <a name="linux"></a>在 Linux 上安装

## 先决条件

* 您可以在其上安装 CLI 的 DC/OS 集群外部系统。
* 从外部系统到 DC/OS 集群的网络访问。
* 命令行环境，如终端。
* `cURL`：默认安装在大多数 Linux 发行版本中。

### 安装 DC/OS CLI

1. 将 DC/OS CLI 二进制文件 (`dcos`）下载到本地目录（例如， `/usr/local/bin/`）。

    ```bash
    curl -O https://downloads.dcos.io/binaries/cli/linux/x86-64/dcos-1.11/dcos
    ```

    <table class=“table” bgcolor=#858585>
    <tr> 
    <td align=justify style=color:white><strong>重要信息：</strong>CLI 必须安装在 DC/OS 集群外部的系统上。</td> 
    </tr> 
    </table>

1. 将 CLI 二进制文件移动到本地 bin 目录。

    ```bash
    sudo mv dcos /usr/local/bin
    ```

1. 使 CLI 二进制文件可执行。

    ```bash
    chmod +x /usr/local/bin/dcos
    ```

1. 设置从 CLI 到 DC/OS 集群的连接。在本示例中， `http://example.com` 是管理节点 URL。

    ```bash
    dcos cluster setup http://example.com
    ```

 遵循 DC/OS CLI 中的说明。有关安全的更多信息，请参阅[安全](/cn/1.11/security/)。

 您的 CLI 现在应通过您的集群进行身份认证！输入 `dcos` 即可开始。

## <a name="osx"></a>在 macOS 上安装

## 先决条件

* 您可以在其上安装 CLI 的 DC/OS 集群外部系统。
* 从外部系统到 DC/OS 集群的网络访问。
* 命令行环境，如终端。
* `cURL`：如果您没有 `cURL`，请遵循 [Install curl on Mac OSX] 中的说明(http://macappstore.org/curl/)。

### 安装 DC/OS CLI

1. 将 DC/OS CLI 二进制文件 (`dcos`）下载到本地目录（例如， `/usr/local/bin/`）。

    ```bash
    curl -O https://downloads.dcos.io/binaries/cli/darwin/x86-64/dcos-1.11/dcos
    ```

    <table class=“table” bgcolor=#858585>
    <tr> 
    <td align=justify style=color:white><strong>重要信息：</strong>CLI 必须安装在 DC/OS 集群外部的系统上。</td> 
    </tr> 
    </table>

1. 使 CLI 二进制文件可执行。

    ```bash
    chmod +x dcos
    ```

1. 设置从 CLI 到 DC/OS 集群的连接。在本示例中， `http://example.com` 是管理节点 URL。

    ```bash
    dcos cluster setup http://example.com
    ```
 **注意：** 如果系统无法找到可执行文件，您可能需要重新打开命令提示符或手动将安装目录添加到 PATH 环境变量中。

 遵循 DC/OS CLI 中的说明。有关安全的更多信息，请参阅[文档](/cn/1.11/security/)。

 您的 CLI 现在应通过您的集群进行身份认证！输入 `dcos` 即可开始。

## <a name="windows"></a>在 Windows 上安装

## 先决条件

* 您将在其上安装 CLI 的 DC/OS 集群外部系统
* 从外部系统到 DC/OS 集群的网络访问。
* 命令行环境，如默认安装在 Windows 7 及更高版本上的Windows Powershell。
* 在开始安装之前，禁用任何安全或防病毒软件。


1. 作为管理员运行命令行环境。

1. 将 DC/OS CLI 可执行文件下载到本地目录 ([dcos.exe](https://downloads.dcos.io/binaries/cli/windows/x86-64/dcos-1.11/dcos.exe)）。

1. 设置从 CLI 到 DC/OS 集群的连接。在本示例中， `http://example.com` 是管理节点 URL。

    ```powershell
    dcos cluster setup http://example.com
    ```

 遵循 DC/OS CLI 中的说明。有关安全的更多信息，请参阅[文档](/cn/1.11/security/)。

 您的 CLI 现在应可通过您集群的身份认证了！输入 `dcos` 即可开始。
