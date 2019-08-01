---
layout: layout.pug
navigationTitle:  Updating the CLI
title: Updating the CLI
menuWeight: 3
excerpt: 更新命令行界面

enterprise: false
---

根据当前安装的 DC/OS CLI 版本，您可以选择将 CLI 更新为群集的最新版本或安装特定版本。另请注意，如果您从 PyPI 或 DC/OS UI 1.7 或更早版本下载 CLI，则必须完全<a href="/1.12/cli/uninstall/">卸载</a> CLI，然后安装新版本的软件进行升级。

# <a name="upgrade"></a>使用 Web 界面升级 CLI

安装 DC/OS CLI 的建议方法是从 DC/OS web 界面获取预先格式好的命令集，然后在终端中运行这些命令。如果当前安装的 CLI 版本可以升级到最新版本，请执行以下步骤以完成升级。

1. 在终端删除当前 CLI 二进制文件。例如，如果是安装到 `/usr/local/bin/`：

    ```bash
    rm -rf /usr/local/bin/dcos
    ```

1. 那就导航到 DC/OS Web 界面，单击右上角群集名称右侧的向下箭头。

    ![打开群集弹出窗口](/mesosphere/dcos/1.12/img/open-cluster-popup.png)

    图 1. 打开群集弹出菜单

1. 选择** 安装 CLI **以显示安装命令。

    ![CLI 安装 UI](/mesosphere/dcos/1.12/img/install-cli.png)

    图 2. 选择安装 CLI

1. 将适合您操作系统的代码片段复制并粘贴到您的终端，然后按返回键。这会自动下载、移动并运行群集的“设置”命令。要运行的最后一个命令 `dcos` 将显示 DCOS 命令概述。

    ![CLI 复制/粘贴](/mesosphere/dcos/1.12/img/CLI-Installation-GUI_Popup_Linux-1.12.png)

    图 3. 代码片段窗口

1. 列出群集进行验证：

    ```bash
    docs cluster list

                NAME                          ID                    STATUS    VERSION        URL           
    *  kjdskjd-ds-derr-1     0e2f90b-ded3-458b-8157-0365c8bd1ca4  AVAILABLE  1.12.0         http://example.com
       mr-clr-714024134      e71432a-8c60-48f0-bb14-ddf287775cdb  AVAILABLE  1.13-dev       http://example-1.com
    ```

# 手动升级/降级特定版本的 CLI

1. 在终端删除当前 CLI 二进制文件。例如，如果是安装到 `/usr/local/bin/`：

    ```bash
    rm -rf /usr/local/bin/dcos
    ```

1. 通过运行以下命令并将 `<target-os-type>` 替换为操作系统类型 （`darwin`、`linux`、`windows`）和具有您想用的版本的 `<dcos-version>`（例如 1.12），将 DC/OS CLI 二进制文件 `dcos` 下载到本地目录：

    ```bash
    curl https://downloads.dcos.io/binaries/cli/<target-os-type>/x86-64/dcos-<dcos-version>/dcos -o dcos
    ```

    例如，DC/OS 1.12 上的 Mac 用户的 CLI 下载是这样的：

    ```bash
    curl https://downloads.dcos.io/binaries/cli/darwin/x86-64/dcos-1.12/dcos -o dcos
    ```

1. 将 CLI 二进制文件移动到本地目录，应为 `/usr/local/bin`：

    ```bash
    sudo mv dcos /usr/local/bin
    ```

1. 使 CLI 二进制文件可执行：

    ```bash
    chmod +x /usr/local/bin/dcos
    ```

1. 列出群集进行验证：

    ```bash
    docs cluster list

                NAME                          ID                    STATUS    VERSION        URL           
    *  kjdskjd-ds-derr-1     0e2f90b-ded3-458b-8157-0365c8bd1ca4  AVAILABLE  1.12.0         http://example.com
       mr-clr-714024134      e71432a-8c60-48f0-bb14-ddf287775cdb  AVAILABLE  1.13-dev       http://example-1.com
    ```

如果系统无法找到可执行文件，您可能需要重新打开命令提示符或手动将安装目录添加到 PATH 环境变量中。

有关使用 DC/OS CLI 时配置选项的信息，请参阅 [配置命令行界面](/mesosphere/dcos/cn/1.12/cli/configure/)。有关使用 DC/OS CLI 时认证和授权的信息，请参阅相应的 [安全](/mesosphere/dcos/cn/1.12/security/) 部分。
