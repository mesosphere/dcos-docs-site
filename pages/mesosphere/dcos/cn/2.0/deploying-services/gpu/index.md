---
layout: layout.pug
navigationTitle: 使用 GPU
title: 使用 GPU
menuWeight: 110
excerpt: 向您的长期运行 DC/OS 服务添加图形处理单元
render: mustache
model: /mesosphere/dcos/2.0/data.yml
enterprise: false
---

DC/OS&trade; 支持将 GPU（图形处理单元）分配给您的长期运行 DC/OS 服务。在服务中添加 GPU 可以显著加快大数据工作负载。借助基于 GPU 的计划，您可以共享传统和机器学习工作负载的群集资源，还可以在这些群集内动态分配 GPU 资源并在需要时释放它们。您可以为有需要的工作负载预留 GPU 资源，或将这些启用了 GPU 的资源与基础架构的其余部分进行混合，以提高总体利用率。在安装了启用 GPU 的 DC/OS 之后，您可以通过 `gpus` 参数在应用定义中指定 GPU。

# 安装启用了 GPU 的 DC/OS
必须在 DC/OS 安装期间启用 GPU。按照以下说明，根据您的特定 DC/OS 部署方法启用 GPU。

## 带有 GPU 的本地 DC/OS 安装

1. 在每个具有 GPU 的群集节点上安装 [NVIDIA&reg; 管理库 (NVML)](https://developer.nvidia.com/nvidia-management-library-nvml)。所需的 NVIDIA 驱动程序最低版本为 340.29。有关详细的安装说明，请参阅 [Apache&reg; Mesos&reg; GPU 支持文档](http://mesos.apache.org/documentation/latest/gpu-support/#external-dependencie)。
1. 使用 [自定义高级安装说明](/mesosphere/dcos/2.0/installing/production/advanced-configuration/)安装 DC/OS。以下是 GPU 特定的配置参数：

 - **enable_gpu_isolation**：指示是否在 DC/OS 中启用 GPU 支持。默认设置为 `enable_gpu_isolation: 'true'`。
 - **gpus_are_scarce**：指示是否将 GPU 作为群集中的稀缺资源。默认设置为 `gpus_are_scarce: 'true'`，这意味着 DC/OS 仅为配置为占用 GPU 资源的服务保留 GPU 节点。值得注意的是，此设置将影响在 DC/OS 的哪些代理节点部署 GPU 感知框架。此设置不影响框架在运行时可能启动的具体任务。框架可以在有 GPU 的代理节点上安排非 GPU 任务。
 - **marathon_gpu_scheduling_behavior**：表示 Marathon 是否会在带有可用 GPU 的节点上安排非 GPU 任务。默认为 `restricted`。
 - **metronome_gpu_scheduling_behavior**：表示 Metronome 是否会在带有可用 GPU 的节点上安排非 GPU 任务。默认为 `restricted`。

 有关更多信息，请参阅 [配置参数文档](/mesosphere/dcos/2.0/installing/production/advanced-configuration/configuring-gpu-nodes/) 和 Mesos [Nvidia GPU 支持文档](http://mesos.apache.org/documentation/latest/gpu-support/#external-dependencie)。

## 带有 GPU 的 AWS EC2&reg; DC/OS 安装

## 先决条件

- 查看 DC/OS Universal 安装工具的 [先决条件](/mesosphere/dcos/2.0/installing/evaluation/)。
- 查看云提供程序的先决条件，例如 [AWS](/mesosphere/dcos/2.0/installing/evaluation/aws/#prerequisites)、[Azure](/mesosphere/dcos/2.0/installing/evaluation/azure/#prerequisites)或 [GCP](/mesosphere/dcos/2.0/installing/evaluation/gcp/#prerequisites)。

### 自定义您的 main.tf

在用于部署 DC/OS 的 main.tf 文件中，请确保至少有一个代理节点部署有一个或多个 GPU。同时确保该代理节点符合所有其他 [代理节点要求](/mesosphere/dcos/2.0/installing/production/system-requirements/#agent-node-requirements)。

例如，在 AWS 上，您可以将 `private_agents_instance_type` 设置为在分域中可用的、启用了 GPU 的任何实例类型：

```
private_agents_instance_type = "p2.xlarge"
```

然后照常进行安装。DC/OS Universal 安装工具将检测 NVIDIA GPU 是否存在于代理节点上，并自动安装所需的软件。

# 在您的应用程序中使用 GPU

可以通过 `gpus` 参数在应用定义中指定 GPU。

- 只能在应用程序定义中指定整数 GPU。如果选中分数数量，启动任务后就会造成 `TASK_ERROR`。
- NVIDIA GPU 支持仅适用于使用 [DC/OS 通用容器运行时](/mesosphere/dcos/2.0/deploying-services/containerizers/) 启动的任务。不支持 Docker。

# 示例

## 简单 GPU 应用定义
在本示例中，定义了使用 GPU 的简单睡眠应用程序。

1. 创建名为 `simple-gpu-test.json` 的应用定义。

    ```json
    {
         "id": "simple-gpu-test",
         "acceptedResourceRoles":["slave_public", "*"],
         "cmd": "while [ true ] ; do nvidia-smi; sleep 5; done",
         "cpus": 1,
         "mem": 128,
         "disk": 0,
         "gpus": 1,
         "instances": 1
    }
    ```

1. 使用 DC/OS  CLI 启动应用程序：

    ```bash
    dcos marathon app add simple-gpu-test.json
    ```

1. 服务部署完成后，检查 `stdout` 内容，验证该服务是否采用 `nvidia-smi` 命令产生正确的输出。您会看到如下内容，并且每隔 5 秒重复一次。[通过 DC/OS  CLI](/mesosphere/dcos/2.0/monitoring/logging/quickstart/) 或在 DC/OS 仪表板上的服务 **健康** 页面访问日志。

    ```bash
    +------------------------------------------------------+
    | NVIDIA-SMI 352.79     Driver Version: 352.79         |
    |-------------------------------+----------------------+----------------------+
    | GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
    | Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
    |===============================+======================+======================|
    |   0  Tesla M60           Off  | 0000:04:00.0     Off |                    0 |
    | N/A   34C    P0    39W / 150W |     34MiB /  7679MiB |      0%      Default |
    +-------------------------------+----------------------+----------------------+
    ```

您还将在服务的 **配置** 选项卡上看到 DC/OS  GUI 的 **GPU** 条目。

## 基于 Docker&reg; 的应用定义
在本示例中部署了一个具有 GPU 的应用程序，用于指定 Docker 容器和 [DC/OS 通用容器运行时间 (UCR)](/mesosphere/dcos/2.0/deploying-services/containerizers/) （容器类型为 `MESOS`）。

1. 创建名为 `docker-gpu-test.json` 的应用定义。

    ```json
    {
        "id": "docker-gpu-test",
        "acceptedResourceRoles":["slave_public", "*"],
        "cmd": "while [ true ] ; do nvidia-smi; sleep 5; done",
        "cpus": 1,
        "mem": 128,
        "disk": 0,
        "gpus": 1,
        "instances": 1,
        "container": {
          "type": "MESOS",
          "docker": {
            "image": "nvidia/cuda"
          }
        }
    }
    ```

1. 使用 DC/OS  CLI 启动应用程序：

    ```bash
    dcos marathon app add docker-gpu-test.json
    ```

1. 服务部署完成后，检查 `stdout` 内容，验证该服务是否采用 `nvidia-smi` 命令产生正确的输出。您会看到如下内容，并且每隔 5 秒重复一次。[通过 DC/OS  CLI](/mesosphere/dcos/2.0/monitoring/logging/quickstart/) 或在 DC/OS 仪表板上的服务 **健康** 页面访问日志。


您还将在服务页面的 **配置** 选项卡上看到 **GPU** 条目。

## 详细了解 GPU

- [什么是 GPU 计算？](http://www.nvidia.com/object/what-is-gpu-computing.html）
- [Mesos NVIDIA GPU 支持](https://github.com/apache/mesos/blob/master/docs/gpu-support.md)。
- [教程：使用 TensorFlow、Nvidia 和 Apache Mesos (DC/OS ) 进行深入学习](https://dcos.io/blog/2017/tutorial-deep-learning-with-tensorflow-nvidia-and-apache-mesos-dc-os-part-1/index.html)。
- 演示文稿：[在 Apache Mesos 上 Docker 容器中支持 GPU](https://docs.google.com/presentation/d/1FnuEW2ic5d-cpSyVOUMfUSM7WxJlZtTAAWt2dZXJ52A/edit#slide=id.p)。
- 演示文稿：[Apache Mesos 中的 GPU 支持](https://www.youtube.com/watch?v=giJ4GXFoeuA)。
- 演示文稿：[添加 GPU 支持到 Mesos](https://docs.google.com/presentation/d/1Y1IUlWV6g1HzD1wYIYXy6AmbfnczWfjvvmqqpeDFBic/edit#slide=id.p)。
