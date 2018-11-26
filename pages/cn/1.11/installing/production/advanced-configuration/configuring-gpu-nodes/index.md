---
layout: layout.pug
navigationTitle: 设置 GPU 节点
title: 设置 GPU 节点
menuWeight: 10
excerpt: 添加图形处理单元到长期运行的 DC/OS 服务
---


DC/OS 支持将 GPU（图形处理单元）分配给您的长期运行 DC/OS 服务。在服务中添加 GPU 可以显著加快大数据工作负载。

借助基于 GPU 的计划，您可以共享传统和机器学习工作负载集群资源，还可以在这些集群内动态分配 GPU 资源并在需要时释放它们。您可以为有需要的工作负载预留 GPU 资源，或将这些启用了 GPU 的资源与基础架构的其余部分进行混合，以提高总体利用率。

在安装好启用了 GPU 的 DC/OS 之后，您可以通过 `gpus` 参数在应用定义中指定 GPU。

# 安装启用了 GPU 的 DC/OS 
必须在 DC/OS 安装期间启用 GPU。按照以下说明，根据您的特定 DC/OS 部署方法启用 GPU。

## 配备 GPU 的自定义 DC/OS 安装

1. 在每个具有 GPU 的集群节点上安装 [NVIDIA 管理库 (NVML)](https://developer.nvidia.com/nvidia-management-library-nvml)。所需的 NVIDIA 驱动程序最低版本为 340.29。如需详细的安装说明，请参阅 [Mesos GPU 支持文档](http://mesos.apache.org/documentation/latest/gpu-support/#external-dependencies)。
1. 使用 [自定义高级安装说明] 安装 DC/OS (/1.11/installing/production/deploying-dcos/installation/)。以下是 GPU 特定的配置参数：

 -** `enable_gpu_isolation`**：指示是否在 DC/OS 中启用 GPU 支持。默认设置为 `enable_gpu_isolation: 'true'`。
 -** `gpus_are_scarce`**：指示是否将 GPU 作为集群中的稀缺资源。默认设置为 `gpus_are_scarce: 'true'`，这意味着 DC/OS 仅为配置为占用 GPU 资源的服务保留 GPU 节点。值得注意的是，此设置将影响在 DC/OS 的哪些代理节点部署 GPU 感知框架。此设置不影响框架在运行时可能启动的具体任务。框架可以在有 GPU 的代理节点上安排非 GPU 任务。

 如需更多信息，请参阅 [配置参数文档](/cn/1.11/installing/production/advanced-configuration/configuration-reference/#enable-gpu-isolation) 和 Mesos [Nvidia GPU 支持文档](http://mesos.apache.org/documentation/latest/gpu-support/#external-dependencies)。

## 带有 GPU 的 AWS EC2 DC/OS 安装

## 先决条件
- AWS DC/OS 高级模板 [系统要求](/cn/1.11/installing/evaluation/cloud-installation/aws/advanced/)。
- 复制到本地机器的 `zen.sh` 脚本。脚本和说明在 [此处](/cn/1.11/installing/evaluation/cloud-installation/aws/advanced/)。

### 创建依赖关系

1. 运行 `zen.sh` 脚本以创建 Zen 模板依赖关系。这些依赖关系将用作在 CloudFormation 中创建堆栈的输入信息。

```
bash ./zen.sh <stack-name>
```

 **注意：** 必须运行 `zen.sh` 脚本才能执行下一步。

2. 请根据 [此处](/cn/1.11/installing/evaluation/cloud-installation/aws/advanced/) 说明，使用以下 GPU 专用配置创建具有高级 AWS 模板的集群。

3. 在 **创建堆栈** > **指定详情**页面指定您的堆栈信息并单击 **下一步**。以下是 GPU 特定设置。

 - **自定义 AMI** - 为您所在地区指定自定义 AMI：

 - us-west-2：`ami-d54a2cad`
 - us-east-1：`ami-5f5d1449`
 - ap-southeast-2：`ami-0d50476e`

 - **MasterInstancEtype**——接受默认管理节点实例类型（例如， `m3.xlarge`）。
 - **PrivateAgentInstancEtype**——指定 [AWS GPU 机器类型](https://aws.amazon.com/ec2/instance-types/#p2) （例如， `g2.2xlarge`）。
 - **PublicAgentInstancEtype**——指定 [AWS GPU 机器类型](https://aws.amazon.com/ec2/instance-types/#p2) （例如， `g2.2xlarge`）。

4. 在 **选项** 页面，接受默认值，然后单击 **下一步**。

 **注意：** 您可以选择是否退回查看故障。默认情况下，此选项设置为 **是**。

5. 在 **查看** 页面勾选确认框，然后单击 **创建**。

 **注意：** 如果显示 **创建新堆栈** 页面，可能是 AWS 仍在处理您的请求，也可能是您查看的是其他分域。导航至正确的分域并刷新页面以查看您的堆栈。
