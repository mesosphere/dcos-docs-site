---
layout: layout.pug
navigationTitle:  安装服务
title: 安装服务
menuWeight: 0
excerpt: 使用 CLI 或 UI 安装和验证服务
render: mustache
model: /mesosphere/dcos/2.0/data.yml
enterprise: false
---

## 使用 CLI 安装服务

使用 CLI 安装服务的一般语法是：

```bash
dcos package install [--options=<config-file-name>.json] <servicename>
```

使用可选 `--options` 标记指定您在 [高级配置](/mesosphere/dcos/cn/2.0/deploying-services/config-universe-service/) 中创建的自定义 JSON 文件的名称。

例如，使用以下命令安装具有默认参数的 Chronos。

```bash
dcos package install chronos
```

## 使用 UI 安装服务

在 DC/OS UI 中，您可以从 **服务** 或 **{{ model.packageRepo }}** 选项卡安装服务。{{ model.packageRepo }} 选项卡显示包 [资源库](/mesosphere/dcos/cn/2.0/administering-clusters/package-registry/) 中所有可用的 DC/OS 服务。“服务”选项卡为本地 DC/OS Marathon 实例提供了完整的功能界面。


### {{ model.packageRepo }} 选项卡

1. 导航到 DC/OS UI 中的 [**{{ model.packageRepo }}**](/mesosphere/dcos/cn/2.0/gui/catalog/) 选项卡。

    ![{{ model.packageRepo }}](/mesosphere/dcos/2.0/img/GUI-Catalog-Main_View-1_12.png)

    图 1.{{ model.packageRepo }} 

2. 单击包。
    1. 单击 **审查并运行**。
    2. 可选择单击 [**编辑**](/mesosphere/dcos/cn/2.0/deploying-services/config-universe-service/)，自定义参数，然后单击 **查看并运行**。
    3. 单击 **运行服务**。

### Services 选项卡

1. 导航到 DC/OS UI 中的 [**服务**](/mesosphere/dcos/cn/2.0/gui/services/) 选项卡。
1. 单击 **运行服务**，并指定您的 Marathon 应用定义。

    ![service tab](/mesosphere/dcos/2.0/img/GUI-Services-No_Services_Running-1_12.png)

    图 2. 服务画面

## 验证安装

###  CLI

```bash
dcos package list
```

### UI

转到 **服务** 选项卡，确认服务正在运行。如需更多信息，请参阅 UI [文档](/mesosphere/dcos/cn/2.0/gui/services/)。

![Services](/mesosphere/dcos/2.0/img/GUI-Services-Running_Services_View-1_12.png)

图 3. 服务正在运行

{{ model.packageRepo }} 的 **社区** 部分的某些服务将不会显示在 DC/OS 服务列表中。如需这些服务，请检查 Marathon UI 中服务的 Marathon 应用程序，以验证该服务是否在运行且健康。
