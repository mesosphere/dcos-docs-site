---
layout: layout.pug
navigationTitle: 使用 Jenkins 部署 Marathon 应用程序
title: 使用 Jenkins 部署 Marathon 应用程序
menuWeight: 4
excerpt: 教程 - 使用 Jenkins for DC/OS 在 Marathon 上部署应用程序

enterprise: false
---


<table class="table" bgcolor="#FAFAFA"> <tr> <td style="border-left: thin solid; border-top: thin solid; border-bottom: thin solid;border-right: thin solid;"><b>重要信息：</b>Mesosphere 不支持本教程、相关脚本或命令，它们不提供任何形式的保证。本教程的目的是为了演示功能，可能不适合在生产环境中使用。在您的环境中使用类似的解决方案之前，您必须进行调整、验证和测试。</td> </tr> </table>

本教程介绍如何使用 Jenkins for DC/OS 在 [Marathon][1] 上部署应用程序。本教程将指导您创建新的 Jenkins 作业，在源代码更改时发布 Docker 容器，并根据项目的 `marathon.json` 文件中包含的[应用定义][3] 将这些更改部署到 Marathon。


**先决条件：**
本教程假设您拥有有效的 Jenkins 安装和许可，可以在 Marathon 上启动应用程序。Jenkins for DC/OS 必须按照 [Jenkins 快速入门](/services/jenkins/quickstart/)页面上的说明进行安装。

# 示例项目

本教程使用的项目取自 [cd-demo][4] 存储库，并在 Docker 容器内运行 Jekyll 网站。本教程所需的文件是 `Dockerfile`、`conf/cd-demo-appn.json` 和 `site` 目录。将这些项目复制到新项目，然后推送到您选择的主机上的新 Git 存储库。本教程使用 [Docker Hub][6] 存储创建的镜像，并需要帐户信息来执行此任务。

## 访问 Jenkins for DC/OS

可通过 [DC/OS Web 界面](/cn/1.11/gui/)中的仪表盘或服务导航菜单访问 Jenkins for DC/OS。

单击“Jenkins”服务，然后单击“Open Service”访问 Jenkins Web 界面。

![dcos-velocity-jenkins-ui.png](/cn/1.11/img/dcos-velocity-jenkins-ui.png)

图 1. Jenkins Web 界面

## 添加 Docker Hub 凭据

Jenkins 在其凭据库内存储帐户凭据，这允许作业以安全方式使用凭据。在 Jenkins 主页面中，从左侧菜单中单击 **Credentials**。从那里选择 **System**（也可从左侧菜单中选择），最后选择主查看区域中显示的全局凭据（不受限制）链接。左侧菜单现在应具有 **Add Credentials** 选项。

单击 **Add Credentials**，为 Docker Hub 创建新凭据。**Kind** 下拉菜单中应选择“Username with password”选项。填写其余信息以匹配您的 Docker Hub 帐户。

![dcos-velocity-jenkins-creds-new.png](/cn/1.11/img/dcos-velocity-jenkins-creds-new.png)

图 2. 添加 Jenkins 凭据

# 作业

我们将创建一个新的 Jenkins 作业，其与 Docker Hub 一起执行多项操作，然后更新或创建 Marathon 应用程序。

创建一个新的 **Freestyle** 作业，其名称仅包含小写字母和连字符。此名称将稍后在 Docker 镜像名称中使用，并可能作为 Marathon 应用程序 ID 使用。

![dcos-jenkins-new-freestyle.png](/cn/1.11/img/dcos-jenkins-new-freestyle.png)

图 3. Freestyle 项目

## SCM/Git

在以上**示例项目**部分中，使用新创建的 Git 存储库填写 Git 存储库 URL。Jenkins 必须可以访问它，且可能需要向 Jenkins 实例添加凭据。

![dcos-jenkins-repourl.png](/cn/1.11/img/dcos-jenkins-repourl.png)

图 4. 源代码管理凭据

## 构建触发器

选择 **Poll SCM** 构建触发器，其时间表为：`*/5 * * * *`。这将每五分钟检查一次 Git 存储库是否有更改。

# 构建步骤

Jenkins 作业执行以下操作：

1. 建立新的 Docker 镜像。
1. 将新镜像推至 Docker Hub。

这些步骤可以使用 **Docker Build and Publish** 插件通过单个构建步骤执行，这已经包含并可供使用。在 **Add build step** 下拉列表中选择 **Docker Build and Publish** 选项。

![dcos-velocity-jenkins-build-docker.png](/cn/1.11/img/dcos-velocity-jenkins-build-docker.png)

图 5. Docker “Add build step” 选项

填写以下字段：

* 用您的 Docker Hub 用户名填写 **存储库名称**，并以 `/${JOB_NAME}` 作为后缀 ("myusername/${JOB_NAME}")
* 以 `${GIT_COMMIT}` 填写**标签**
* 将**注册表凭据**，填写到以上创建的 Docker Hub 的凭据中

![dcos-velocity-jenkins-build-docker-config.png](/cn/1.11/img/dcos-velocity-jenkins-build-docker-config.png)

图 6. Docker 构建和发布屏幕

# Marathon 部署

通过从 **Add post-build action**下拉菜单中选择 **Marathon Deployment** 选项，添加 Marathon 部署构建后操作。

![dcos-jenkins-plugin-popup.png](/cn/1.11/img/dcos-jenkins-plugin-popup.png)

图 6. Marathon 部署菜单

填写以下字段：

* **Marathon URL**，可使用 URL `http://leader.mesos/service/marathon` 在 DC/OS 内对其进行访问  
* **应用定义**，具有与 marathon 应用程序文件 (`conf/cd-demo-app.json`) 相对的路径
*使用以上创建的镜像 (`myusername/${JOB_NAME}:${GIT_COMMIT}`) 选择 **Docker 镜像**

![dcos-velocity-marathon-config.png](/cn/1.11/img/dcos-velocity-marathon-config.png)

图 7. 构建后操作屏幕

## 如何运行

Marathon 部署构建后操作读取应用定义文件，默认情况下为 `marathon.json`，包含在项目的 Git 存储库中。这是 JSON 文件，必须包含有效的 [Marathon 应用定义][3]。

构建后操作中的可配置字段将覆盖文件中匹配字段的内容。例如，设置“应用程序 ID”将替换文件中的 `id` 字段。在以上配置中，“Docker 镜像”已配置，并将覆盖包含在 [docker 字段][5]中的 `image` 字段。

最终的 JSON 有效负载将发送到已配置的 Marathon 实例，并更新或创建应用程序。

# 保存

保存作业配置。

# 构建

单击 **Build Now**，然后构建作业。

![dcos-jenkins-build-now.png](/cn/1.11/img/dcos-jenkins-build-now.png)

图 8. 构建作业

# 部署

在 Jenkins 中成功运行后，应用程序将开始在 DC/OS 上的部署。您可以访问 DC/OS Web 界面来监控进度。

当 **Status** 已更改为 **Running**时，部署完成，您可访问网站了。

## 访问您的网站

访问公共 DC/OS 代理节点上的 `80` 以显示 Jekyll 网站。

![dcos-jekyll-site1.png](/cn/1.11/img/dcos-jekyll-site1.png)

图 9. Jekyll 演示

## 添加新帖子

`_posts` 目录中的内容生成 Jekyll 网站。对于此示例项目，该目录为 `site/_posts`。复制现有帖子并创建新帖子，其文件名中具有最新的日期。我添加了一篇名为“一个更新”的帖子。

将新帖子提交给 Git。在新的提交落在主分支上之后不久，Jenkins 将看到更改并重新部署到 Marathon。

![dcos-jekyll-updated.png](/cn/1.11/img/dcos-jekyll-updated.png)

 [1]:https://mesosphere.github.io/marathon/
 [3]:https://mesosphere.github.io/marathon/docs/application-basics.html
 [4]:https://github.com/mesosphere/cd-demo
 [5]:https://mesosphere.github.io/marathon/docs/native-docker.html
 [6]:https://hub.docker.com/
