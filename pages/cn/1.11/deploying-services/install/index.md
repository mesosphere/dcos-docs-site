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

使用可选 `--options` 标记指定您在 [高级配置] 中创建的自定义 JSON 文件的名称(/1.11/deploying-services/config-universe-service/)。

例如，您将使用以下命令按照默认参数安装 Chronos。

```bash
dcos package install chronos
```

## 使用 Web 界面安装服务

在 DC/OS Web 界面，可以在 **服务** 或 **目录** 选项卡中安装服务。“目录”选项卡显示软件包 [存储库] 中所有可用的 DC/OS 服务(/1.11/administering-clusters/repo/)。“服务”选项卡为本地 DC/OS Marathon 实例提供了完整的功能界面。


### 目录选项卡

1. 导航至 DC/OS Web 界面中的 [**目录**](/cn/1.11/gui/catalog/) 选项卡。

 ![universe](/cn/1.11/img/ui-dashboard-catalog.png)

 图 1. Universe 目录

2. 单击软件包。
 1. 单击 **查看并运行**。
 2. 可选择单击 [**编辑**](/cn/1.11/deploying-services/config-universe-service/)，自定义参数，然后单击 **查看并运行**。
 3. 单击 **运行服务**。

### 服务选项卡

1. 导航至 DC/OS Web 界面中的 [**服务**](/cn/1.11/gui/services/) 选项卡。
1. 单击 **运行服务**，并指定您的 Marathon 应用定义。

 ![service tab](/cn/1.11/img/run-a-service.png)

 图 2. 服务画面

## 验证安装

### CLI

```bash
dcos package list
```

### Web 界面

转到 **服务** 选项卡，确认服务正在运行。如需详细信息，请参阅 Web 界面 [文档](/cn/1.11/gui/services/)。

![Services](/cn/1.11/img/tweeter-services6.png)

图 3. 服务正在运行

目录的 **社区** 部分中的某些服务将不会显示在 DC/OS 服务列表中。如需这些服务，请检查 Marathon Web 界面中服务的 Marathon 应用程序，以验证该服务的运行状况。
