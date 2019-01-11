---
layout: layout.pug
navigationTitle: Docker Engine
title: Docker Engine
menuWeight: 20
excerpt: 从 Docker 镜像启动 Docker 容器

enterprise: false
---


[Docker Engine](https://www.docker.com/products/docker-engine) 从 Docker 镜像启动 Docker 容器。如需要 Docker Engine 的[功能](/cn/1.11/deploying-services/containerizers/#container-runtime-features)，请使用 Docker Engine。否则，请考虑使用 [Universal Container Runtime（通用容器运行时间）](/cn/1.11/deploying-services/containerizers/ucr/)。

# 为容器装配 Docker Engine 

* 默认入口点是容器的启动命令。如果入口点接受参数，则可以在 Marathon 应用定义的 `args` 字段中指定它们。如果没有默认入口点，则必须在 `cmd` 字段中指定命令。为同一应用程序同时提供 `cmd` 和 `args` 则无效。
* 在 Docker Engine 中运行 Docker 镜像时，底层 Docker 日志文件不会被减短或轮换。这些文件可能会变得任意大（通常转到系统磁盘而不是存储磁盘）。这会导致磁盘空间有限的服务器耗尽磁盘空间。如果您正在使用 Docker Engine，Mesosphere 建议您禁用 Docker 日志记录。为此，请在应用定义的  `containers.docker.parameters` 字段中将 `log-driver` 参数设置为 `none`。如果要使用 DC/OS Web 界面配置容器：
 1. 单击 **JSON EDITOR** 切换。

      ![json editor](/cn/1.11/img/json-editor-toggle.png)

      图 1. JSON Editor 切换按钮

 1. 在 JSON 配置中输入 `parameters` 字段。


## DC/OS Web 界面

1. 单击 DC/OS Web 界面的 **Services** 选项卡，然后单击 **RUN A SERVICE**。

1. 单击 **Single Container**。

1. 输入服务 ID。

1. 在 **CONTAINER IMAGE** 字段输入容器镜像。

1. 单击 **MORE SETTINGS**。在 **Container Runtime** 部分，选择 **DOCKER ENGINE** 单选按钮。

1. 单击 **REVIEW & RUN** 和 **RUN SERVICE**。

## DC/OS CLI

在 [Marathon 应用定义](/cn/1.11/deploying-services/creating-services/#deploying-a-simple-docker-based-application-with-the-rest-api)中，将 `container.type` 参数设置为 `DOCKER`。

```json
{  
   "id":"<my-service>",
   "container":{  
      "type":"DOCKER",
      "docker":{
         "image":"<my-image>",
         "parameters": [
           {
             "key": "log-driver",
             "value": "none"
           }
         ]
      }
   },
   "args":[  
      "<my-arg>"
   ]
}
```

有关示例，请参阅[部署基于 Docker 的服务](/cn/1.11/deploying-services/creating-services/deploy-docker-app/)。

# 进一步阅读

- [查看 Docker containerizer 的 Mesos 文档](http://mesos.apache.org/documentation/latest/docker-containerizer/)。
