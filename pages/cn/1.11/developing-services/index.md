---
layout: layout.pug
title: 开发 DC/OS 服务
menuWeight: 160
excerpt: 开发您自己的 DC/OS 组件

enterprise: false
---


本部分介绍了开发人员专用的 DC/OS 组件，解释了在 DC/OS 上打包并提供自己的服务所需的条件。

Mesosphere 数据中心操作系统 (DC/OS) 可提供为数据中心编排和管理的最佳用户体验。您如果是 Apache Mesos 开发人员，就会熟悉框架的开发。DC/OS 扩展了 Apache Mesos，其中包括用于运行状况检查和监控的 Web 界面，一个命令行，一段服务包描述和一个列举软件包目录的 [存储库](/cn/1.11/administering-clusters/repo/)。

# <a name="universe"></a>软件包存储库

DC/OS Universe 包含 DC/OS 上可安装的所有服务。如需更多有关 DC/OS Universe 的信息，请参阅 [GiThub Universe 存储库](https://github.com/mesosphere/universe)。

所有软件包服务均需符合 Mesosphere 定义的特定标准。如需有关提交 DC/OS 服务的详细信息，请参阅 [Universe 入门指南](https://github.com/mesosphere/universe/blob/version-3.x/docs/tutorial/GetStarted.md)。

#DC/OS 服务结构

Universe repo 中的每个 DC/OS 服务均由 JSON 配置文件组成。这些文件将用来创建安装在 DC/OS 上的软件包。

| 文件名 | 描述 | 是否必填 |
|------------------------|----------------------------------------------------------------------------------------------------------|----------|
|  `config.json` | 指定支持的配置属性，表示为 JSON-schema。| 否 |
|  `marathon.json.mustache` | 指定一个 mustache 模板，用于创建能够运行服务的 Marathon 应用定义。| 否 |
|  `package.json` | 指定软件包的高级元数据。| 是 |
|  `resource.json` | 指定所有需要的外部托管资源（例如 Docker 镜像、HTTP 对象和图像）。| 否 |

如需更多信息，请参阅 [Universe 入门指南](https://github.com/mesosphere/universe/blob/version-3.x/docs/tutorial/GetStarted.md)。
