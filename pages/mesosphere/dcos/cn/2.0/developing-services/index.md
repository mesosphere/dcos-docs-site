---
layout: layout.pug
title: 开发 DC/OS 服务
menuWeight: 160
excerpt: 开发您自己的 DC/OS 组件
render: mustache
model: /mesosphere/dcos/2.0/data.yml
enterprise: false
---


本部分介绍了开发人员专用的 DC/OS 组件，解释了在 DC/OS 上打包并提供自己的服务所需的条件。

Mesosphere 分布式云操作系统 (DC/OS) 可为数据中心编排和管理最佳用户体验。您如果是 Apache Mesos 开发人员，就会熟悉框架的开发。DC/OS 扩展了 Apache Mesos，其中包括用于运行状况检查和监控的 Web 界面，一个命令行，一段服务包描述和一个列举包目录的 [存储库](/mesosphere/dcos/2.0/administering-clusters/package-registry/)。

# <a name="universe"></a>包存储库

DC/OS {{ model.packageRepo }} 包含 DC/OS 上可安装的所有服务。有关 DC/OS {{ model.packageRepo }} 的更多信息，请参阅 [GitHub {{ model.packageRepo }} 资源库](https://github.com/mesosphere/universe)。我们的一般建议是在为 {{ model.packageRepo }}创建包的整个过程中使用 DC/OS CLI 而不是 DC/OS Web 界面。

所有包服务均需符合 Mesosphere 定义的特定标准。如需有关提交 DC/OS 服务的更多信息，请参阅 [{{ model.packageRepo }}] 入门指南](https://github.com/mesosphere/universe/blob/version-3.x/docs/tutorial/GetStarted.md)。

#DC/OS 服务结构

{{ model.packageRepo }} repo 中的每个 DC/OS 服务均由 JSON 配置文件组成。这些文件将创建安装在 DC/OS 上的包。

| 文件名               | 描述                                                                                              |是否必填 |
|------------------------|----------------------------------------------------------------------------------------------------------|----------|
|  `config.json` | 指定支持的配置属性，表示为 JSON-schema。| 否       |
| `marathon.json.mustache` | 指定一个 Mustache 模板，用于创建能够运行服务的 Marathon 应用程序定义。| 否       |
|  `package.json` | 指定包的高级元数据。| 是      |
|  `resource.json` | 指定所有需要的外部托管资源（例如 Docker 镜像、HTTP 对象和图像）。| 否       |

如需了解更多信息，请参阅{{ model.packageRepo }} 入门指南](https://github.com/mesosphere/universe/blob/version-3.x/docs/tutorial/GetStarted.md)。
