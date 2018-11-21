---
layout: layout.pug
navigationTitle: 管理软件包资源库
title: 管理软件包资源库
menuWeight: 50
excerpt: 学习使用 Web 界面或 CLI 管理您的软件包资源库。
enterprise: false
---

<!-- The source repo for this topic is https://github.com/dcos/dcos-docs -->

DC/OS 预配置了 [Mesosphere Universe](https://github.com/mesosphere/universe) 软件包资源库作为 DC/OS 包的提供程序，但也可添加其他软件包资源库。

您可以使用 Web 界面或 CLI 来：

* [列出资源库](#listing)
* [搜索软件包](#finding-packages)
* [添加资源库](#adding)
* [删除资源库](#removing)

**注意：** 在使用 CLI 之前，您需要 [安装它](/cn/1.11/cli/install/)。

## <a name="listing"></a>列出资源库

要查看当前安装的软件包资源库，输入此 CLI 命令：

```bash
dcos package repo list
Universe: https://universe.mesosphere.com/repo
```

## <a name="finding-packages"></a>搜索软件包

要搜索软件包，运行此 CLI 命令：

```bash
dcos package search [--json <query>]
```

例如，此命令搜索大数据包：

```bash
dcos package search "big data"
NAME   VERSION        SELECTED  FRAMEWORK  DESCRIPTION                                                                       
spark  1.0.9-2.1.0-1  True      False      Spark is a fast and general cluster computing system for Big Data.  Documenta...
```

## <a name="adding"></a>添加资源库

要添加资源库，运行此命令：

```bash
dcos package repo add <repo-name> <repo-url>
```

例如，此命令添加一个名为 `your-repo` 并带有 URL `https://universe.yourcompany.com/repo`的资源库：

```bash
dcos package repo add your-repo https://universe.yourcompany.com/repo
```

有关如何构建和运行您自己的 Universe 资源库的完整说明，请参阅 [Universe Server 文档](https://github.com/mesosphere/universe#universe-server)

## <a name="removing"></a>删除资源库

要删除资源库，运行此命令：

```bash
dcos package repo remove <repo-name>
```

例如，此命令删除名为 `your-repo`的资源库：

```bash
dcos package repo remove your-repo
```
