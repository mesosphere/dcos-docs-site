---
layout: layout.pug
navigationTitle:  部署
excerpt: 部署多个 Marathon 应用程序
title: 部署
render: mustache
model: /mesosphere/dcos/1.13/data.yml
menuWeight: 5
---

DC/OS 中应用程序或组定义的每个更改都是作为 Marathon 部署执行的。[部署](/mesosphere/dcos/1.13/deploying-services/marathon-api/) 是一组操作，包括：

- 启动
- 停止
- 升级
- 扩展

部署成功完成之前，Marathon 部署处于活动状态。您可以同时部署多个应用程序，但如果它已经是活动部署，则无法部署相同的应用程序。同一应用程序的多个部署请求将被拒绝。

# 依赖关系

如果应用程序没有依赖关系，则可以按任何顺序部署它们而不受限制。如果存在依赖关系，则按特定顺序执行部署操作。

在此示例中，应用程序 `app` 依赖于应用程序 `db`。

![依赖关系图](/mesosphere/dcos/1.13/img/dependency.png)

图 1 - 部署图

以下是部署顺序：

- 启动：如果将 `db` 和 `app` 添加到系统，则首先启动 `db`，然后启动应用程序。
- 停止：如果从系统中删除 `db` 和 `app`，首先删除 `app`，然后删除 `db`。
- 升级：参见[滚动升级](#rolling)。
- 扩展：如果扩展 `db` 和 `app`，首先扩展 `db`，然后扩展 `app`。

# <a name="rolling"></a>滚动升级

滚动升级的目标是使用新版本启动一组进程，并使用旧版本停止一组进程。有很多方法可以做到这一点。默认情况下，DC/OS 服务部署使用滚动升级方法。升级行为由应用程序中设置的运行状况和准备就绪检查控制。

- **运行状况检查**在每个应用程序中指定，并根据任务运行。如果任务的运行状况检查失败，DC/OS 将替换该任务。如需更多信息，请参阅 [文档](/mesosphere/dcos/1.13/deploying-services/creating-services/health-checks/)。
- **准备就绪检查**是临时监控器，等待您的应用程序准备就绪。准备就绪检查对缓存预热、JIT 预热或迁移非常有用。如果准备就绪检查失败，DC/OS 将等待其成功，然后再继续部署。

您可以使用 `minimumHealthCapacity` 参数来定义某个版本的应用程序在更新过程中必须始终具有的最小健康实例数。此参数在每个应用程序中单独定义。minimumHealthCapacity 是一个百分比，当应用于实例计数时，它定义某个版本的应用程序在更新过程中必须始终具有的健康实例数。
