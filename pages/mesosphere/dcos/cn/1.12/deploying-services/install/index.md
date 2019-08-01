---
layout: layout.pug
navigationTitle: 安装服务
title: 安装服务
menuWeight: 0
excerpt: 使用 CLI 或 Web 界面安装和验证服务

enterprise: false
---

## 使用 CLI 安装服务

随后就会显示使用 CLI 安装服务的一般语法。

```bash
dcos package install [--options=<config-file-name>.json] <servicename>
```

使用可选 `--options` 标记指定您在 [高级配置](/mesosphere/dcos/cn/1.12/deploying-services/config-universe-service/) 中创建的自定义 JSON 文件的名称。

例如，您将使用以下命令安装具有默认参数的 Chronos。

```bash
dcos package install chronos
```

## 使用 Web 界面安装服务

在 DC/OS Web 界面，可以在 **服务** 或 **目录** 选项卡中安装服务。“目录”选项卡显示包 [存储库](/mesosphere/dcos/cn/1.12/administering-clusters/repo/) 中所有可用的 DC/OS 服务。“服务”选项卡为本地 DC/OS Marathon 实例提供了完整的功能界面。


### 目录选项卡

1. 导航至 DC/OS 中的 [**目录**](/mesosphere/dcos/cn/1.12/gui/catalog/) 选项卡。

    ![universe](/mesosphere/dcos/1.12/img/GUI-Catalog-Main_View-1_12.png)

    图 1. Universe 目录

1. 单击包。
    1. 单击 **审查并运行**。
    2. 可选择单击 [**编辑**](/mesosphere/dcos/cn/1.12/deploying-services/config-universe-service/)，自定义参数，然后单击 **查看并运行**。
    3. 单击 **运行服务**。

### Services 选项卡

1. 导航至 DC/OS Web 界面中的 [**服务**](/mesosphere/dcos/cn/1.12/gui/services/) 选项卡。
1. 单击 **运行服务**，并指定您的 Marathon 应用定义。

    ![service tab](/mesosphere/dcos/1.12/img/GUI-Services-No_Services_Running-1_12.png)

    图 2. 服务画面

## 验证安装

### CLI

```bash
dcos package list
```

### Web 界面

转到 **服务** 选项卡，确认服务正在运行。如需详细信息，请参阅 Web 界面 [文档](/mesosphere/dcos/cn/1.12/gui/services/)。

![Services](/mesosphere/dcos/1.12/img/GUI-Services-Running_Services_View-1_12.png)

图 3. 服务正在运行

目录的 **社区** 部分中的某些服务将不会显示在 DC/OS 服务列表中。如需这些服务，请检查 Marathon Web 界面中服务的 Marathon 应用程序，以验证该服务的运行着且运行良好。
