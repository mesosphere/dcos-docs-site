---
layout: layout.pug
navigationTitle: 安装
title: 安装
menuWeight: 25
excerpt: 安装 DC/OS 包注册表
enterprise: true
---

# 安装 DC/OS 包注册表 CLI

DC/OS 包注册表已随 CLI 一起安装，但如果需要再次安装，请使用以下命令：

```bash
dcos package install package-registry --cli
```

## 下载包

有关 DC/OS 包注册表支持的 DC/OS 包的列表，请参阅 [被支持包的正式列表](https://downloads.mesosphere.com/universe/packages/packages.html)。

**示例**：下载 Jenkins 的一个版本：

```bash
wget https://downloads.mesosphere.com/universe/packages/jenkins/3.5.2-2.107.2/jenkins-3.5.2-2.107.2.dcos
```

### 添加包

使用`dcos registry add`命令将 DC/OS 软件包添加到 DC/OS 软件包注册表中。

**示例**：要将 Jenkins 版本添加到注册表中，请输入：

```bash
dcos registry add --dcos-file jenkins-3.5.2-2.107.2.dcos
```

### 描述并列出包

使用`dcos registry describe`命令描述 DC/OS 包。

**示例**：要描述 Jenkins DC/OS 版本的包，请输入：

```bash
dcos registry describe --package-name jenkins --package-version 3.5.2-2.107.2
```

列出添加的所有包：

```bash
dcos package search
```

### 删除包

使用 `dcos registry remove` 命令删除添加的 DC/OS 包。

**示例**：要删除 Jenkins DC/OS 版本的包，请输入：

```bash
dcos registry remove --package-name jenkins --package-version 3.5.2-2.107.2
```

<p class="message--warning"><strong>警告：</strong>在部署服务时删除包可能会导致服务停止工作。</p>

### 从 DC/OS 包中安装 DC/OS 服务

可以使用 CLI 或 GUI 从添加到 DC/OS 包注册表的软件包中安装 DC/OS 服务。

**示例**：要使用 CLI 安装 Jenkins 版本，请输入：

```bash
dcos package install jenkins
```
