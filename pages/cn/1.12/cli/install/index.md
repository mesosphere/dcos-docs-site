---
layout: layout.pug
navigationTitle:  Installing the CLI
title: Installing the CLI
menuWeight: 1
excerpt: 安装 DC/OS 命令行界面

enterprise: false
---
这些说明将向您展示如何在群集上安装核心 DC/OS CLI 命令。
有关安装 DC/OS Enterprise CLI 命令的说明，请参阅 [DC/OS Enterprise CLI 部分](/cn/1.12/cli/enterprise-cli/)。

安装 DC/OS CLI 的建议方法是从 DC/OS GUI 获取预先格式好的命令集，然后在终端中运行这些命令。有关详细信息，请参阅操作系统的先决条件和说明：

- [在 Linux 上安装](#linux)
- [在 macOS 上安装](#macos)
- [在 Windows 上安装](#windows)

<a name="linux"></a>

# 在 Linux 上安装

## 先决条件
- 您必须有一台 **单独的计算机**，它不在您可以安装 CLI 的 DC/OS 群集中。
- 您必须具有从托管 CLI 的外部系统访问 DC/OS 群集的网络访问权限。
- 您必须能够在托管 CLI 的外部系统打开命令行 shell 终端。
- 您必须能够在托管 CLI 的系统中运行 `cURL` 程序。`curl` 命令在大多数 Linux 分发中都是默认安装的。
- 您不得使用 `noexec` 安装 `/tmp` 目录，除非您已设置除了`/tmp` 目录以外的 `TMPDIR` 环境变量。使用安装 `noexec` 选项安装 `/tmp` 目录可能会阻止 CLI 操作。

## 从 GUI 中将 CLI 安装到 Linux 上

1. 在 DC/OS GUI 的右上角，单击群集名称右侧的向下箭头。

    ![打开群集弹出窗口](/1.12/img/open-cluster-popup.png)

    图 1. 打开群集弹出菜单

1. 选择 **安装 CLI**。

    ![CLI 安装 UI](/1.12/img/install-cli.png)

    图 2. 选择安装 CLI

1. 将适合您操作系统的代码片段复制并粘贴到您的终端，然后按返回键。

    ![CLI 复制/粘贴](/1.12/img/CLI-Installation-GUI_Popup_Linux-1.12.png)

    图 3. 代码片段窗口

1. 显示 DC/OS 信息画面后，运行命令 `dcos cluster list` 确认已建立与群集的连接。

## 手动安装 DC/OS CLI

强烈建议您从要连接的群集的 GUI 中复制并粘贴安装命令。以下是 CLI 的逐步安装说明。

1. 如果您还没有 CLI 的工作目录，请创建一个。首选位置是 `/usr/local/bin`，所有说明都将引用此路径。

    ```bash
    [ -d usr/local/bin ] || sudo mkdir -p /usr/local/bin
    ```

1. 通过运行以下命令并用操作系统类型（`darwin`、`linux`、`windows`）和具有您想用的版本的 `<dcos-version>`（例如 1.12）替换`<target-os-type>` ，将 DC/OS CLI 二进制文件下载到本地目录 。

    ```bash
    curl https://downloads.dcos.io/binaries/cli/<target-os-type>/x86-64/dcos-<dcos-version>/dcos -o dcos
    ```

    例如，DC/OS 1.12 上的 Linux 用户的 CLI 下载是这样的：

    ```bash
    curl https://downloads.dcos.io/binaries/cli/linux/x86-64/dcos-1.12/dcos -o dcos
    ```

1. 将 CLI 二进制文件移动到本地 bin 目录。

    ```bash
    sudo mv dcos /usr/local/bin
    ```

1. 使 CLI 二进制文件可执行。

    ```bash
    chmod +x /usr/local/bin/dcos
    ```

1. 设置从 CLI 到 DC/OS 群集的连接。在本示例中， `http://example.com` 是管理节点 URL。

    ```bash
    dcos cluster setup http://example.com
    ```

 遵循 DC/OS CLI 中的说明。有关安全的更多信息，请参阅[安全](/cn/1.12/security/)。

 您的 CLI 现在应通过您的群集进行身份认证！输入 `dcos` 即可开始。可在 [此处](/cn/1.12/cli/command-reference/dcos-cluster/) 了解有关管理群集连接的更多信息。

<a name="macos"></a>

# 在 macOS 上安装

## 先决条件
- 您必须有一台单独的，不在您可以安装 CLI 的 DC/OS 群集中的计算机。
 * MacOS X Yosemite (10.10) 或更高版本。
 * 运行 Haswell CPU（2014）或更高版本的机型。
- 您必须具有从托管 CLI 的外部系统访问 DC/OS 群集的网络访问权限。
- 您必须能够在托管 CLI 的外部系统打开命令行环境（例如，终端）。
- 您必须能够在托管 CLI 的系统中运行 `cURL` 程序。如果您没有 `cURL`，请按照 [在 Mac OSX 上安装 CURL](http：//macappstore.org/curl/) 的说明执行安装。
- 您不得使用 `noexec` 安装 `/tmp` 目录，除非您已设置除了`/tmp` 目录以外的 `TMPDIR` 环境变量。使用安装 `noexec` 选项安装 `/tmp` 目录可能会阻止 CLI 操作。

## 从 GUI 中将 CLI 安装到 macOS 上

1. 在 DC/OS GUI 的右上角，单击群集名称右侧的向下箭头。

    ![打开群集弹出窗口](/1.12/img/open-cluster-popup.png)

    图 1. 打开群集弹出菜单

1. 选择 **安装 CLI**。

    ![CLI install GUI](/1.12/img/install-cli.png)

    图 2. 选择安装 CLI

1. 将适合您操作系统的代码片段复制并粘贴到您的终端。

    ![CLI 复制/粘贴](/1.12/img/CLI-Installation-GUI_Popup_OSX-1.12.png)

    图 3. 代码片段窗口

1. 显示 `dcos` 信息屏幕后，运行命令 `dcos cluster list` 以验证是否已建立与群集的连接。

## 手动在 macOS 上安装 CLI

1. 通过运行以下命令并将 `<target-os-type>` 替换为操作系统类型 （`darwin`、`linux`、`windows`）和具有您想用的版本的 `<dcos-version>`（例如 1.12），将 DC/OS CLI 二进制文件 `dcos` 下载到本地目录：

    ```bash
    curl https://downloads.dcos.io/binaries/cli/<target-os-type>/x86-64/dcos-<dcos-version>/dcos -o dcos
    ```

    例如，DC/OS 1.12 上的 Mac 用户的 CLI 下载是这样的：

    ```bash
    curl https://downloads.dcos.io/binaries/cli/darwin/x86-64/dcos-1.12/dcos -o dcos
    ```

1. 使 CLI 二进制可执行文件。

    ```bash
    chmod +x dcos
    ```

1. 设置从 CLI 到 DC/OS 群集的连接。在本示例中， `http://example.com` 是管理节点 URL。

    ```bash
    dcos cluster setup http://example.com
    ```
    如果系统无法找到可执行文件，您可能需要重新打开命令提示符或手动将安装目录添加到 PATH 环境变量中。</p>

    遵循 DC/OS CLI 中的说明。有关安全的更多信息，请参阅[文档](/cn/1.12/security/)。

    您的 CLI 现在应已通过您的群集进行身份认证！
    
1. 键入 `dcos` 查看使用信息并开始操作。

<a name="windows"></a>

# 在 Windows 上安装

## 先决条件
- 您必须有一台单独的不在您可以安装 CLI 的 DC/OS 群集中的计算机。
 - Windows 10 系统 64 位或更高版本。
- 您必须具有从托管 CLI 的外部系统访问 DC/OS 群集的网络访问权限。
- 您必须能够在托管 CLI 的外部系统打开命令行环境（例如，Windows PowerShell 或 `cmd.exe` 程序）。Windows PowerShell 默认安装在 Windows 7 及更高版本上。
- 在开始安装之前，必须禁用任何安全或防病毒软件。
- 您不得使用 `noexec` 安装 `/tmp` 目录，除非您已设置除了`/tmp` 目录以外的 `TMPDIR` 环境变量。使用安装 `noexec` 选项安装 `/tmp` 目录可能会阻止 CLI 操作。

## 从 GUI 中将 CLI 安装到 Windows 上

1. 在 DC/OS GUI 的右上角，单击群集名称右侧的向下箭头。

    ![打开群集弹出窗口](/1.12/img/open-cluster-popup.png)

    图 1. 打开群集弹出菜单

1. 选择 **安装 CLI**。

    ![CLI 安装 UI](/1.12/img/install-cli.png)

    图 2. 选择安装 CLI

1. 按照对话框中列出的命令操作。

    ![CLI 复制/粘贴](/1.12/img/CLI-Installation-GUI_Popup_Windows-1.12.png)

    图 3. 代码片段窗口

1. 显示 `dcos` 信息屏幕后，运行命令 `dcos cluster list` 以验证是否已建立与群集的连接。

## 手动在 Windows 上安装 CLI

1. 使用管理员凭据打开命令行环境。

1. 通过运行以下命令并将 `<target-os-type>` 替换为操作系统类型 （`darwin`、`linux`、`windows`）和具有您想用的版本的 `<dcos-version>`（例如 1.12），将 DC/OS CLI 二进制文件 `dcos` 下载到本地目录：

    ```bash
    curl https://downloads.dcos.io/binaries/cli/<target-os-type>/x86-64/dcos-<dcos-version>/dcos -o dcos
    ```

    例如，DC/OS 1.12 上的 Windows 用户的 CLI 下载是这样的：

    ```bash
    curl https://downloads.dcos.io/binaries/cli/windows/x86-64/dcos-1.12/dcos -o dcos
    ```

1. 如果尚未打开文件下载的目录，请转到该目录。

    ```bash
    cd path/to/download/directory
    ```

1. 设置从 CLI 到 DC/OS 群集的连接。在本示例中， `http://example.com` 是管理节点 URL。

    ```bash
    dcos cluster setup http://example.com
    ```

 <p class="message--note"><strong>注意：</strong>如果系统无法找到可执行文件，您可能需要重新打开命令提示符或手动将安装目录添加到 PATH 环境变量中。</p>

 遵循 DC/OS CLI 中的说明。有关安全的更多信息，请参阅[文档](/cn/1.12/security/)。

 您的 CLI 现在应通过您的群集进行身份认证！输入 `dcos` 即可开始。

