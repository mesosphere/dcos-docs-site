---
layout: layout.pug
navigationTitle: Universal Container Runtime (UCR)
title: Universal Container Runtime (UCR)
menuWeight: 10
excerpt: 使用 Universal Container Runtime 启动 Mesos 容器 
enterprise: false
---

# 使用 UCR 配置 Mesos 容器

[Universal Container Runtime (UCR)](http://mesos.apache.org/documentation/latest/container-image) 从二进制可执行文件启动 Mesos 容器，并扩展 Mesos 容器运行时间以支持配置 [Docker](https://docker.com/) 镜像。UCR 与 Docker Engine 相比，在运行 Docker 镜像方面具有许多[优势](/cn/1.11/deploying-services/containerizers/)。请仅在您需要 Docker Engine 的具体[功能](/cn/1.11/deploying-services/containerizers/#container-runtime-features) 时使用 Docker Engine。

# DC/OS Web 界面
使用此步骤从 DC/OS Web 界面配置 UCR 的容器。

1. 单击 DC/OS Web 界面的 **Services** 选项卡，然后单击 **RUN A SERVICE**。

1. 单击 **Single Container**。

1. 输入服务 ID。

1. 在 **CONTAINER IMAGE** 字段中，可以选择输入容器镜像。否则，在 **COMMAND** 字段中输入命令。

1. 指定 UCR。单击 **MORE SETTINGS**。在 **Container Runtime** 部分，选择 **UNIVERSAL CONTAINER RUNTIME (UCR)** 单选按钮。

1. 单击 **REVIEW & RUN** 和 **RUN SERVICE**。


## DC/OS CLI
使用此程序从 DC/OS 命令行配置 UCR 的容器。

1. 在 [Marathon 应用定义](/cn/1.11/deploying-services/creating-services/#deploying-a-simple-docker-based-application-with-the-rest-api)中，将 `container.type` 参数设置为 `MESOS`。在这里，我们指定一个有着 `docker` 对象的 Docker 容器。UCR 提供可选的 `pullConfig` 参数以使您能够[对专用 Docker 注册表进行身份认证](/cn/1.11/deploying-services/private-docker-registry/)。

```json
{
  "id": "/nginx-bridge",
  "container": {
    "portMappings": [
      {
        "containerPort": 80,
        "hostPort": 0,
        "labels": {
          "VIP_0": "/nginx2:1024"
        },
        "protocol": "tcp",
        "servicePort": 10000,
        "name": "webport"
      }
    ],
    "type": "MESOS",
    "volumes": [],
    "docker": {
        "image": "nginx",
        "forcePullImage": false,
        "pullConfig": {
            "secret": "pullConfigSecret"
        },
        "parameters": []
        }
    },
    "secrets": {
      "pullConfigSecret": {
        "source": "/mesos-docker/pullConfig"
    }
  },
  "args":[
  "<my-arg>"
  ],
  "cpus": 0.5,
  "disk": 0,
  "instances": 1,
  "mem": 128,
  "networks": [
    {
    "mode": "container/bridge"
    }
  ],
  "requirePorts": false
}
```

<table class=“table” bgcolor=#858585>
<tr> 
  <td align=justify style=color:white><strong>重要信息：</strong>如果您将“args”字段留空，默认入口点将是容器的启动命令。如果您的容器没有默认入口点，则须在“args”字段中指定命令。如果不这样做，您的服务将无法部署。</td> 
</tr> 
</table>

# 容器镜像垃圾收集

对于长时间运行的集群，容器镜像可能占用代理机器上的磁盘空间。为了改善操作员使用 UCR 的体验，从 Mesos 1.5.0 开始的文档会介绍容器镜像 GC（请阅读 Mesos 文档(http://mesos.apache.org/documentation/latest/container-image/#garbage-collect-unused-container-images) 以获取更多详细信息）。镜像 GC 在 DC/OS 中默认是自动的，而操作员可以手动启用。

## [自动镜像 GC](http://mesos.apache.org/documentation/latest/container-image/#automatic-image-gc-through-agent-flag)

容器镜像自动 GC 默认启用，由镜像 GC 配置文件配置。可通过 `/opt/mesosphere/etc/mesos-slave-common` 处的 `MESOS_IMAGE_GC_CONFIG` 环境变量更新此配置文件。默认配置文件位于 `/opt/mesosphere/etc/mesos-slave-image-gc-config.json`，以下是配置文件的参数：

- `image_disk_headroom`：用于计算容器镜像存储大小阈值的镜像磁盘空间。如果镜像磁盘使用率达到该阈值，将自动触发镜像垃圾收集。请注意，空间价值必须介于 0.0 和 1.0 之间。（默认为 0.1，表示以 90% 磁盘使用率作为阈值）
- `image_disk_watch_interval`：检查镜像存储磁盘使用率的周期时间间隔。请注意，此时间间隔的单位为“纳秒”。（默认为 300000000000，表示每 5 分钟检查一次磁盘）
- `excluded_images`：不应进行垃圾回收的已排除镜像列表。（默认为空列表）

## [手动镜像 GC](http://mesos.apache.org/documentation/latest/container-image/#manual-image-gc-through-http-api)

容器镜像手动 GC 可通过 HTTP Operator API 启用。请参阅 `PRUNE_IMAGES` [v1 Operator API 文档](http://mesos.apache.org/documentation/latest/operator-http-api/#prune_images)，了解更多详情。

# 进一步阅读
- [查看 UCR 的 Mesos 文档](http://mesos.apache.org/documentation/latest/container-image/)。
