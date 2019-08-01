---
layout: layout.pug
navigationTitle: 包注册表
title: 包注册表
menuWeight: 1001
excerpt: 了解包注册表及其限制
enterprise: true
---

DC/OS 包注册表是 DC/OS 打包、分发、存储和交付 DC/OS 包的服务。DC/OS 包是一个独立的文件，包含运行 DC/OS 服务所需的一切功能。这包括 DC/OS 服务所需的元数据信息、配置信息、一般资源和 Docker 镜像。

# 启用的操作

此服务支持您通过将本地的 DC/OS 包存储到群集来运行 DC/OS 服务。这让您可以执行以下操作：

- 运行完全气隙群集
- 使用内网延迟和带宽部署 DC/OS 服务
- 单独管理 DC/OS 包，可以添加新软件包并逐步升级单个服务


# 限制

- 初次部署后无法更改存储后端
- 具有单个 DC/OS 包注册表的多个 DC/OS 群集
- 本地存储的度量标准（S3 度量标准不在此范围）。例如，尚未在低磁盘空间实现告警。

<p class="message--note"><strong>注意：</strong>DC/OS 1.12.1 及更高版本支持包注册表 v0.2.1。</p>
