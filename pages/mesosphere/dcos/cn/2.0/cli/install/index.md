---
layout: layout.pug
navigationTitle:  安装 CLI
title: 安装 CLI
menuWeight: 1
excerpt: 安装 DC/OS 命令行界面
enterprise: false
render: mustache
model: /mesosphere/dcos/2.0/data.yml
---

安装 DC/OS&trade; CLI 的建议方法是从 DC/OS UI 获取预先格式化的命令集，然后在终端运行这些命令。有关详细信息，请参阅操作系统的先决条件和说明：

- [在 Linux&reg; 上安装](#linux)
- [在 macOS&reg; 上安装](#macos)
- [在 Windows&reg; 上安装](#windows)

# 先决条件

## 常见先决条件
- 您必须有一台 **单独的计算机**，它不在您可以安装 CLI 的 DC/OS 群集中。
- 您必须具有从托管 CLI 的外部系统访问 DC/OS 群集的网络访问权限。
- 您必须能够在托管 CLI 的外部系统打开命令行 shell 终端。
- 您不得使用 `noexec` 安装 `/tmp` 目录，除非您已设置除了`TMPDIR` 目录以外的 `/tmp` 环境变量。使用安装 `/tmp` 选项安装 `noexec` 目录可能会阻止 CLI 操作。

# Linux 的先决条件
- 您必须能够在托管 CLI 的系统中运行 `cURL` 程序。`curl` 命令在大多数 Linux 分发中都是默认安装的。
- 如果您使用 Fedora 30 或更高版本，则必须安装 `libcrypt` 库。您可以通过运行  来安装库。`sudo dnf install libxcrypt-compat`.


# macOS 的先决条件
- 您必须运行 macOS 10.10 Yosemite（已弃用）或更高版本。下一版本的 DC/OS CLI 将需要 MacOS 10.11 EL Capitan 或更高版本。
- 运行 Haswell CPU（2014）或更高版本的机型。
- 您必须能够在托管 CLI 的系统中运行 `cURL` 程序。如果您没有 `cURL`，请按照 [在 macOS 上安装 cURL](http://macappstore.org/curl/) 的说明执行安装。

# Windows 的先决条件
- Windows 10 系统 64 位或更高版本。
- 在开始安装之前，必须禁用任何安全或防病毒软件。

# 使用 UI 安装 CLI

1. 在 DC/OS UI 的右上角，单击群集名称右侧的向下箭头。

    ![打开群集弹出窗口](/mesosphere/dcos/cn/2.0/img/open-cluster-popup.png)

    图 1. 打开群集弹出菜单

1. 选择 **安装 CLI**。

    ![CLI 安装 UI](/mesosphere/dcos/cn/2.0/img/install-cli.png)

    图 2. 选择安装 CLI

1. 将适合您操作系统的代码片段复制并粘贴到您的终端，然后按返回键。

1. 显示 dcos 信息屏幕后，运行命令 `dcos cluster list` 以验证是否已建立与群集的连接。

<a name="linux"></a>

# 在 Linux 上手动安装 DC/OS CLI

强烈建议您从要连接的群集的 UI 中复制并粘贴安装命令。以下是 CLI 的逐步安装说明。

1. 如果您还没有 CLI 的工作目录，请创建一个。首选位置是 `/usr/local/bin`，所有说明都将引用此路径。

    ```bash
    [ -d usr/local/bin ] || sudo mkdir -p /usr/local/bin
    ```

1. 通过运行以下命令，将 DC/OS CLI 二进制文件下载到本地目录：

    ```bash
    curl https://downloads.dcos.io/cli/releases/binaries/dcos/linux/x86-64/latest/dcos -o dcos
    ```

1. 将 CLI 二进制文件移动到本地 bin 目录。

    ```bash
    sudo mv dcos /usr/local/bin
    ```

1. 使 CLI 二进制文件可执行。

    ```bash
    chmod +x /usr/local/bin/dcos
    ```

1. 设置从 CLI 到 DC/OS 群集的连接。在本示例中， `http://example.com` 是主节点 URL。

    ```bash
    dcos cluster setup http://example.com
    ```

    遵循 DC/OS CLI 中的说明。有关安全的更多信息，请参阅[安全](/mesosphere/dcos/cn/2.0/security/).

    您的 CLI 现在应通过您的群集进行身份认证！输入 `dcos` 即可开始。可在 [此处] 了解有关管理群集连接的更多信息。(/mesosphere/dcos/cn/2.0/cli/command-reference/dcos-cluster/).

<a name="macos"></a>

# 在 macOS 上手动安装 DC/OS CLI

**如果已安装 [Homebrew]`brew install dcos-cli`，则可以用简单的 (https://brew.sh) 替换本教程的前两个步骤。**

1. 通过运行以下命令，将 DC/OS CLI 二进制文件下载到本地目录：

    ```bash
    curl https://downloads.dcos.io/cli/releases/binaries/dcos/darwin/x86-64/latest/dcos -o dcos
    ```

1. 使 CLI 二进制文件可执行。

    ```bash
    chmod +x dcos
    ```

1. 设置从 CLI 到 DC/OS 群集的连接。在本示例中， `http://example.com` 是主节点 URL。

    ```bash
    dcos cluster setup http://example.com
    ```
    如果系统无法找到可执行文件，您可能需要重新打开命令提示符或手动将安装目录添加到 PATH 环境变量中。</p>

    遵循 DC/OS CLI 中的说明。有关安全的更多信息，请参阅[文档](/mesosphere/dcos/cn/2.0/security/).

    您的 CLI 现在应通过您的群集进行身份认证！

1. 键入 `dcos` 查看使用信息并开始操作。

<a name="windows"></a>

# 在 Windows 上手动安装 DC/OS CLI

1. 使用管理员凭据打开命令行环境。

1. 通过运行以下命令，将 DC/OS CLI 二进制文件下载到本地目录：

    ```bash
    curl https://downloads.dcos.io/cli/releases/binaries/dcos/windows/x86-64/latest/dcos.exe -o dcos
    ```

1. 如果尚未打开下载文件的目录，请转到该目录。

    ```bash
    cd path/to/download/directory
    ```

1. 设置从 CLI 到 DC/OS 群集的连接。在本示例中， `http://example.com` 是主节点 URL。

    ```bash
    dcos cluster setup http://example.com
    ```

    <p class="message--note"><strong>注意：</strong>如果系统无法找到可执行文件，您可能需要重新打开命令提示符或手动将安装目录添加到 PATH 环境变量中。</p>

    遵循 DC/OS CLI 中的说明。有关安全的更多信息，请参阅[文档](/mesosphere/dcos/cn/2.0/security/).

    您的 CLI 现在应通过您的群集进行身份认证！输入 `dcos` 即可开始。

