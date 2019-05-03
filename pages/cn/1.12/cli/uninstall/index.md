---
layout: layout.pug
navigationTitle: 卸载 CLI
title: 卸载 CLI
menuWeight: 4
excerpt: 卸载 DC/OS 命令行界面
enterprise: false
---

您可以使用这些命令为操作系统卸载 CLI。

- [Unix、Linux 和 macOS](#unixlinuxosx)
- [Windows](#windows)

## <a name="unixlinuxosx"></a>Unix、Linux 和 macOS

1. 删除隐藏的 `.dcos` 目录。这将删除 DC/OS CLI 连接的配置文件。

    ```bash
    rm -rf ~/.dcos
    ```

1. 删除 `dcos` 可执行文件。默认情况下，该文件位于 `/usr/local/bin/dcos`。

    ```bash
    rm -rf /usr/local/bin/dcos
    ```

## <a name="windows"></a>Windows

1. 删除隐藏的 `.dcos` 目录。这将删除 DC/OS CLI 连接的配置文件。
1. 删除 `dcos` 可执行文件。
