---
layout: layout.pug
navigationTitle: 使用 GPU
title: 使用 GPU
menuWeight: 110
excerpt: 为您的长期运行 DC/OS 服务添加图形处理单元
enterprise: false
---


DC/OS 支持将 GPU（图形处理单元）分配给您的长期运行的 DC/OS 服务。将 GPU 添加到服务中 可以显著加快大数据工作负载。借助基于 GPU 的计划，您可以共享用于传统和机器学习工作负荷的集群资源，还可以在这些集群内动态分配 GPU 资源并在需要时释放它们。您可以为有需要的工作负荷预留 GPU 资源，或将这些启用了 GPU 的资源与基础架构的其余部分进行混合，以提高总体利用率。在启用 GPU 的 DC/OS 之后，您可以通过 `gpus` 参数在应用定义中指定 GPU。

# 安装启用了 GPU 的 DC/OS 
必须在 DC/OS 安装期间启用 GPU。按照以下说明，根据您的特定 DC/OS 部署方法启用 GPU。

## 配备 GPU 的自定义 DC/OS 安装

1. 在每个具有 GPU 的集群节点上安装 [NVIDIA 管理库 (NVML)](https://developer.nvidia.com/nvidia-management-library-nvml)。所需的 NVIDIA 驱动程序最低版本为 340.29。如需详细的安装说明，请参阅 [Mesos GPU 支持文档](http://mesos.apache.org/documentation/latest/gpu-support/#external-dependencies)。
1. 使用 [自定义高级安装说明] 安装 DC/OS (/1.11/installing/production/deploying-dcos/installation/)。以下是 GPU 专有的配置参数：

 - **enable_gpu_isolation**：指示是否在 DC/OS 中启用 GPU 支持。默认设置为 `enable_gpu_isolation: 'true'`。
 - **gpus_are_scarce**：指示是否将 GPU 作为集群中的稀缺资源。默认设置为 `gpus_are_scarce: 'true'`，这意味着 DC/OS 仅为配置为占用 GPU 资源的服务保留 GPU 节点。值得注意的是，此设置将影响在 DC/OS 的哪些代理节点部署 GPU 感知框架。此设置不影响框架在运行时可能启动的具体+任务。框架可以在有 GPU 的代理节点上安排非 GPU 任务。

 如需更多信息，请参阅 [配置参数文档](/cn/1.11/installing/production/advanced-configuration/configuration-reference/#enable-gpu-isolation) 和 Mesos [Nvidia GPU 支持文档](http://mesos.apache.org/documentation/latest/gpu-support/#external-dependencies)。

## 带有 GPU 的 AWS EC2 DC/OS 安装

## 先决条件
- AWS DC/OS 高级模板 [系统要求](cn/1.11/install/evaluation/cloud-installation/aws/advanced/)。
- 复制到本地机器的 `zen.sh` 脚本。脚本和说明在 [此处](/cn/1.11/installing/evaluation/cloud-installation/aws/advanced/)。

### 创建依赖关系

1. 运行 `zen.sh` 脚本以创建 Zen 模板依赖关系。这些依赖关系将用作在 CloudFormation 中创建堆栈的输入信息。

   ```
   bash ./zen.sh <stack-name>
   ```

    <table class=“table” bgcolor=#858585>
    <tr> 
    <td align=justify style=color:white><strong>重要信息：</strong>执行后续步骤前，必须运行“zen.sh”脚本。</td> 
    </tr> 
    </table>

1. 按照 [此处] 的说明 (1.11/install/evaluation/cloud-installation/aws/advanced/) 使用高级 AWS 模板创建集群，并使用以下 GPU 特定配置。

1. 在 **创建堆栈** > **指定详情**页面指定您的堆栈信息并单击 **下一步**。以下是 GPU 特定设置。

 - **自定义 AMI** - 为您所在地区指定自定义 AMI：

 - us-west-2：`ami-d54a2cad`
 - us-east-1：`ami-5f5d1449`
 - ap-southeast-2：`ami-0d50476e`

 - **MasterInstanceType** - 接受默认管理实例类型（例如 `m3.xlarge`）。
 - **PrivateAgentInstanceType** - 指定 [AWS GPU 机器类型](https://aws.amazon.com/ec2/instance-types/#p2) （例如 `g2.2xlarge`）。
 - **PublicAgentInstanceType** - 指定 [AWS GPU 机器类型](https://aws.amazon.com/ec2/instance-types/#p2) （例如 `g2.2xlarge`）。

1. 在 **选项** 页面，接受默认值，然后单击 **下一步**。在有故障时回滚。默认情况下，此选项设置为 **是**。

1. 在 **查看** 页面勾选确认框，然后单击 **创建**。如果显示 **创建新堆栈** 页面，要么是 AWS 仍在处理您的请求，要么就是您查看的是另一个分域。导航至正确的分域并刷新页面以查看您的堆栈。

# 在您的应用程序中使用 GPU

可以通过 `gpus` 参数在应用定义中指定 GPU。

- 只能在应用程序定义中指定整数数量的 GPU。如果选中分数数量，启动任务后就会造成 `TASK_ERROR`。
- NVIDIA GPU 支持仅适用于使用 [DC/OS 通用容器运行时间] 启动的任务(/1.11/deploying-services/containerizers/)。

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

 服务部署完成后，检查 `stdout` 内容，验证该服务是否采用 `nvidia-smi` 命令产生正确的输出。您会看到如下内容，并且每隔 5 秒重复一次。[通过 DC/OS  CLI](/cn/1.11/monitoring/logging/quickstart/) 或在 DC/OS 仪表板上的服务 **运行状况** 页面访问日志。

 ```bash
    +------------------------------------------------------+
 | NVIDIA-SMI 352.79 Driver Version: 352.79 |
    |-------------------------------+----------------------+----------------------+
 | GPU Name Persistence-M| Bus-Id Disp.A | Volatile Uncorr. ECC |
 | Fan Temp Perf Pwr:Usage/Cap| Memory-Usage | GPU-Util Compute M. |
    |===============================+======================+======================|
 | 0 Tesla M60 Off | 0000:04:00.0 Off | 0 |
 | N/A 34C P0 39W / 150W | 34MiB / 7679MiB | 0% Default |
    +-------------------------------+----------------------+----------------------+
    ```

 您还将在服务的 **配置** 选项卡上看到 DC/OS  GUI 的 **GPU** 条目。

## 基于 Docker 的应用定义
在本示例中部署了一个具有 GPU 的应用程序，用于指定 Docker 容器和 [DC/OS 通用容器运行时间 (UCR)](/cn/1.11/deploying-services/containerizers/) （容器类型为 `MESOS`）。

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

 服务部署完成后，检查 `stdout` 内容，验证该服务是否采用 `nvidia-smi` 命令产生正确的输出。您会看到如下内容，并且每隔 5 秒重复一次。[通过 DC/OS  CLI](/cn/1.11/monitoring/logging/quickstart/) 或在 DC/OS 仪表板上的服务 **运行状况** 页面访问日志。

    ```
    +------------------------------------------------------+
 | NVIDIA-SMI 352.79 Driver Version: 352.79 |
    |-------------------------------+----------------------+----------------------+
 | GPU Name Persistence-M| Bus-Id Disp.A | Volatile Uncorr. ECC |
 | Fan Temp Perf Pwr:Usage/Cap| Memory-Usage | GPU-Util Compute M. |
    |===============================+======================+======================|
 | 0 Tesla M60 Off | 0000:04:00.0 Off | 0 |
 | N/A 34C P0 39W / 150W | 34MiB / 7679MiB | 0% Default |
    +-------------------------------+----------------------+----------------------+
    ```

 您还将在服务页面的 **配置** 选项卡上看到 **GPU** 条目。

## 详细了解 GPU

- [什么是 GPU 计算？](http://www.nvidia.com/object/what-is-gpu-computing.html)
- [Mesos NVIDIA GPU 支持](https://github.com/apache/mesos/blob/master/docs/gpu-support.md)。
- [教程：使用 TensorFlow、Nvidia 和 Apache Mesos (DC/OS ) 进行深入学习](https://dcos.io/blog/2017/tutorial-deep-learning-with-tensorflow-nvidia-and-apache-mesos-dc-os-part-1/index.html)。
- 演示文稿：[在 Apache Mesos 上 Docker 容器中支持 GPU](https://docs.google.com/presentation/d/1FnuEW2ic5d-cpSyVOUMfUSM7WxJlZtTAAWt2dZXJ52A/edit#slide=id.p)。
- 演示文稿：[Apache Mesos 中的 GPU 支持](https://www.youtube.com/watch?v=giJ4GXFoeuA)。
- 演示文稿：[在 Mesos 添加 GPU 支持](https://docs.google.com/presentation/d/1Y1IUlWV6g1HzD1wYIYXy6AmbfnczWfjvvmqqpeDFBic/edit#slide=id.p)。
