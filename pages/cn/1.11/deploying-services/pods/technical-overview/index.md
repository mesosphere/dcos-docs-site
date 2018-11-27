---
layout: layout.pug
navigationTitle: 技术概述
title: 技术概述
menuWeight: 10
excerpt: 了解 Pod
enterprise: false
---


Pod 是特殊类型的 Mesos 任务组，而 pod 中的任务或容器是组成员。通过 [Mesos 启动组] (https://github.com/apache/mesos/blob/cfeabec58fb2a87076f0a2cf4d46cdd02510bce4/docs/executor-http-api.md#launch-group)指令，将 pod 实例的容器一起彻底启动。

DC/OS以单一服务处理并代表 pod。Pod 中的容器 共享网络命名空间和临时卷。您可以通过 pod 定义配置 pod，这类似于 Marathon 应用定义。然而 Pod 和应用定义之间有一些差异。例如：

- 您必须指定端点（不是端口号），以便其他应用程序与 Pod 通信。
- Pod 具有单独的 REST API。
- Pod 仅支持 Mesos 级运行状况检查。

# 网络
Marathon Pod 仅支持 [DC/OS 通用容器运行时间](/cn/1.11/deploying-services/containerizers/)，该运行时间支持多种镜像格式，包括 Docker。

通用容器运行时间允许每个 pod 实例的容器通过 VLAN 或专用网络共享网络命名空间并进行通信，从而简化网络。如果在 pod 定义中指定没有名称的容器网络，它将被分配到默认网络。如果您已使用 [AWS 模板] 安装了 DC/OS(/1.11/installing/evaluation/cloud-installation/aws/)，则默认网络是 `dcos`。

如果其他应用需要与您的 pod 通信，请在 pod 定义中指定一个端点。其他应用程序将通过访问这些端点与 Pod 进行通信。参见 [示例部分](/cn/1.11/deploying-services/pods/examples/)，了解更多信息。

在您的 pod 定义中，您可以声明 `host` 或 `container` 网络类型。借助 `host` 类型创建的 Pod 共享主机的网络命名空间。借助 `container` 类型创建的 Pod 则使用虚拟网络。如果您指定 `container` 网络类型且 Marathon 未配置为具有默认网络名称，您也必须在 `name` 字段中声明虚拟网络名称。参见完整 JSON 的 [示例](/cn/1.11/deploying-services/pods/examples/) 部分。

# 临时存储库
Pod 内的容器共享临时存储库。在 pod 级别声明卷，且在被 `name` 引用之后安装到特定容器中。

# Pod 事件和状态

 更新已启动的 pod 时，只有在重新部署完成时才可使用 pod 的新版本。如果您在重新部署完成之前查询系统了解正在部署哪个版本时，您收到的回复可能是先前的版本。询问 Pod 状态时会收到同样的答复：如果更新 pod，直到完成重新部署之前，状态更改将不会反映在查询中。

 历史记录永久关联 `pod_id`。如果删除 pod，然后重新使用该 ID，即使 Pod 的详细信息不同，新的 pod 仍会显示先前的历史记录（例如，版本信息）。

# Pod 定义
Pod 通过 JSON pod 定义接受配置，与 Marathon 方式相似 [应用定义](/cn/1.11/deploying-services/creating-services/)。您必须声明 Pod 中每个容器所需的资源，因为Mesos（而非 Marathon）决定了 Pod 请求的所有资源执行隔离的方式和时间。参见 [示例](/cn/1.11/deploying-services/pods/examples/) 部分，了解完整的 pod 定义。

# 环境变量
在 pod 级别定义的环境变量将传播到所有 pod 容器。Pod 级环境变量被在 pod 容器级别定义的环境变量覆盖。

端口的环境变量以 pod 容器端点名称（即，ENDPOINT_）定义<ENDPOINT_NAME>=<PORT>).

以下是反映 [多个 Pod JSON pod 定义示例](/cn/1.11/deploying-services/pods/examples/#multi-pod) 的环境变量示例。

```
MESOS_EXECUTOR_ID=instance-test-pod.c2b47e5c-d1f5-11e6-a247-a65e72d2dda4
MARATHON_CONTAINER_RESOURCE_DISK=32.0
SHLVL=1
EP_CONTAINER_HTTPENDPOINT=8080
PYTHON_PIP_VERSION=9.0.1
MARATHON_CONTAINER_RESOURCE_MEM=32.0
ENDPOINT_HTTPENDPOINT=8080
GPG_KEY=97FC712E4C024BBEA48A61ED3A5CA953F73C700D
EP_HOST_HTTPENDPOINT2=21529
MARATHON_APP_ID=/test-pod
EP_CONTAINER_HTTPENDPOINT2=8081
ENDPOINT_HTTPENDPOINT2=8081
MARATHON_CONTAINER_RESOURCE_CPUS=0.1
PATH=/usr/local/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
MESOS_SANDBOX=/mnt/mesos/sandbox
MARATHON_CONTAINER_RESOURCE_GPUS=0
HOST=10.0.1.60
PYTHON_VERSION=3.5.2
MARATHON_APP_VERSION=2017-01-03T20:46:54.497Z
MARATHON_APP_LABELS=
MARATHON_CONTAINER_ID=healthtask1
PWD=/mnt/mesos/sandbox
EP_HOST_HTTPENDPOINT=21528
```

## 执行器资源

执行器在每个节点上运行，以管理脚本。默认情况下，执行器为每个 Pod 保留 32 MB 和 0.1 个 CPU 作为日常使用。在为 Pod 中的容器声明资源需求时，请将此日常使用考虑在内。可以修改 Pod 定义的 `executorResources` 字段中的执行器资源。

```json
{
    "executorResources": {
        "cpus": 0.1,
        "mem": 64,
        "disk": 10mb
    }
}
```

## 密钥

在 Pod 定义的 `secrets` 字段中指定密钥。论据应该是完全合格的可获取存储库中的密钥的路径。

```json
{
    "secrets": {
        "someSecretName": { "source": "/fully/qualified/path" }
    }
}
```

## 卷

Pod 支持临时卷，临时卷在 pod 级别定义。Pod 定义必须包括 `volumes` 字段（其中至少指定卷的名称）和 `volumeMounts` 字段（其中至少指定卷挂载路径）。

```json
{
	"volumes": [
		{
			"name": "etc"
		}
	]
}
```

```json
{
	"volumeMounts": [
		{
			"name": "env",
			"mountPath": "/mnt/etc"
		}
	]
}
```

Pod 还支持主机卷。Pod 卷参数可以声明 `host` 字段，用于指向代理上的已有文件或目录。
```json
{
	"volumes": [
		{
			"name": "local",
			"host": "/user/local"
		}
	]
}
```

**注意：** 重新启动脚本后，数据不复存在。

## Containerizer

Marathon Pod 支持 [DC/OS 通用容器运行时间](/cn/1.11/deploying-services/containerizers/)。通用容器运行时间 [支持多个镜像，例如 Docker](http://mesos.apache.org/documentation/latest/container-image/)。

以下 JSON 为 Pod 指定了 Docker 镜像：

```json
{  
   "image":{  
      "id":"mesosphere/marathon:latest",
      "kind":"DOCKER",
      "forcePull":false
   }
}
```

# 限制

- 目前仅支持基于 Mesos 的运行状况检查。
- 不支持就绪检查。
- 不支持服务端口。
- 无法配置依赖关系。
- 通用环境变量（例如 `$PORT0`）未传递。
