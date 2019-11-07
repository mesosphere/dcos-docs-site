---
layout: layout.pug
navigationTitle: 创建和运行自定义应用程序
title: 创建和运行自定义应用程序
menuWeight: 5
excerpt: 说明如何使用容器来创建和部署单个命令或镜像（第 5 部分）
enterprise: false
---
在之前的教程中，您通过预定义的应用程序定义和 Docker 容器文件部署了示例应用程序。本教程介绍如何创建和部署尚未被预定义的示例应用程序。

在本教程中，您将获得实践经验：
- 创建简单的单命令服务
- 创建容器化服务

本教程演示如何通过使用 DC/OS 基于 Web 的管理控制台或运行命令行程序来完成这些任务。

# 开始之前
在开始本教程前，您应验证以下内容：
- 您必须能够访问被正确配置和正在运行的 [DC/OS 群集](../start-here/)。
- 您必须已安装 [DC/OS 命令行界面](../cli/)。

# 学习目的
完成本教程，您将学习到：
- 如何使用 DC/OS 基于 Web 的控制台来创建和部署单命令服务。
- 如何使用 DC/OS 命令行界面 (CLI) 来创建和部署单命令服务。
- 如何使用 DC/OS 基于 Web 的控制台来创建和部署容器化服务。
- 如何使用 DC/OS 命令行界面 (CLI) 来创建和部署容器化服务。

# 创建单个命令服务
您可以通过 DC/OS 基于 Web 的管理控制台或运行命令行程序来创建和部署简单的单命令服务。

## 使用 DC/OS 基于 Web 的控制台
1. 打开 Web 浏览器并导航到 DC/OS 基于 Web 控制台的 URL。

1. 单击 **服务** 选项卡，然后单击 **运行服务**。

1. 单击 **Single Container**。

1. 在 **服务 ID** 字段，键入服务名称。

    例如，为服务标识符键入 `single-cmd-service`。

    您可以使用实例、CPU 和内存数量的默认值，并将“容器镜像”字段保留为空白。

1. 在 **命令** 字段，输入 `sleep 10 && echo DONE`。

1. 单击 **更多设置**，然后选择 **通用容器运行时间 (UCR)** 以使用本地 DC/OS 容器运行时。

    **通用容器运行时间 (UCR)** 支持 Docker 文件、多个容器 (pod) 和使用 GPU 资源。如果选择此选项，则可选择指定 Docker 容器镜像。

    只有当您需要 Docker 特定功能时，才要选择 **Docker 引擎** 选项。如果您选择此选项，则必须在 **容器镜像** 字段中指定 Docker 容器镜像。
     
    本教程中，您可以将“高级”设置保留为未定义。

1. 单击 **检查和运行**，然后单击 **运行服务**。

    ![创建并运行单命令服务](/mesosphere/dcos/1.13/img/tutorial-single-cmd-create-ui.png)

1. 单击 **服务** 视图中的服务名称，查看其运行情况并监控其运行状况。

    ![检查 DC/OS 控制台中的运行服务](/mesosphere/dcos/1.13/img/tutorial-run-cmd-service.png)

### 使用 DC/OS CLI
您还可以使用 DC/OS CLI 创建和运行单命令服务。

1. 在您可以访问 DC/OS 命令行界面 (CLI) 的计算机上打开终端 shell。

1. 在文本编辑器中打开一个新文件，创建一个名为 `single-cmd-app-cli.json` 的 JSON 文件。

1. 将以下示例内容复制并粘贴到 `single-cmd-app-cli.json` 文件中：

    ```json
    {
      "id": "/single-cmd-app-cli",
      "cmd": "sleep 10",
      "instances": 1,
      "cpus": 1,
      "mem": 128,
      "portDefinitions": [
        {
          "protocol": "tcp",
          "port": 10000
        }
      ],
      "requirePorts": false
    }
    ```

1. 通过运行以下命令来启动单命令服务：

    ```bash
    dcos marathon app add single-cmd-app-cli.json
    ```

1. 通过运行以下命令来验证单命令服务已成功部署：

    ```bash
    dcos marathon app list
    ```

    该命令返回有关已部署服务的信息（类似于以下内容）。

    ```
    ID                   MEM  CPUS  TASKS  HEALTH  DEPLOYMENT  WAITING  CONTAINER  CMD                    
    /single-cmd-app-cli  128   1     0/1    N/A       ---      False       N/A     sleep 10               
    /single-cmd-service  128  0.1    0/1    N/A       ---      False      MESOS    sleep 10 && echo Done  
    ```

    如此示例输出所示，您可以验证通过 DC/OS 基于 Web 的控制台创建的单命令服务以及通过 JSON 文件和 CLI 命令部署的单命令服务是否都在运行。您还可以通过在 DC/OS 基于 Web 的控制台中单击 **服务** 来查看这两种服务。

    ![验证您的单命令服务](/mesosphere/dcos/1.13/img/tutorial-single-cmd-verification.png)

# 创建简单的容器化服务
您可以通过 DC/OS 基于 Web 管理控制台或运行命令行程序来创建和部署容器化服务。

本实践使用一个容器化、长期运行的示例任务，该任务可以从 [Mesosphere Docker Hub 资源库] 中获得(https://hub.docker.com/r/mesosphere/hello-dcos/tags/)。

## 使用 DC/OS 基于 Web 的控制台
1. 打开 Web 浏览器并导航到 [Mesosphere Docker Hub 资源库] 上的 [`hello-dcos`](https://hub.docker.com/r/mesosphere/hello-dcos/tags/)，并复制最新的镜像标签。

1. 打开 Web 浏览器并导航到 DC/OS 基于 Web 的控制台的 URL。

1. 单击 **服务** 选项卡，然后单击 **运行服务**。

1. 单击 **Single Container**。

1. 在 **服务 ID** 字段，键入服务名称。

    例如，为服务标识符键入 `container-hello-dcos-service`。

1. 在 **容器镜像** 字段中键入容器路径和镜像标签。

    例如，输入 `mesosphere/hello-dcos:1.0`，其中 1.0 是您从 [`hello-dcos`](https://hub.docker.com/r/mesosphere/hello-dcos/tags/) 页面复制的`<image-tag>`。

    ![DC/OS UI 中的容器化服务](/mesosphere/dcos/1.13/img/deploy-container-ui.png)

1. 单击 **检查和运行**，然后单击 **运行服务**。

1. 单击 **服务** 视图中的服务名称，查看其运行情况并监控其运行状况。

    ![验证容器化服务正在运行](/mesosphere/dcos/1.13/img/tutorial-running-container.png)

1. 单击容器化服务的名称，然后选择一个任务实例以查看任务详情、文件和日志。

1. 单击 **日志**，然后单击 **错误 (stderr)** 和 **输出 (stdout)**，以查看容器化服务的记录消息和输出。

    ![验证容器化服务正在运行](/mesosphere/dcos/1.13/img/container-running-ui.png)

### 使用 DC/OS CLI
1. 打开 Web 浏览器并导航到 [Mesosphere Docker Hub 资源库] 上的 [`hello-dcos`](https://hub.docker.com/r/mesosphere/hello-dcos/tags/)，并复制最新的镜像标签。

1. 在您可以访问 DC/OS 命令行界面 (CLI) 的计算机上打开终端 shell。

1. 在文本编辑器中打开一个新文件，创建一个名为 `container-app-cli.json` 的 JSON 文件。

1. 将以下示例内容复制并粘贴到 `container-app-cli.json` 文件中，用您在步骤 1 中复制的标签替换 `<image-tag>`。

    ```json
    {
      "id": "/container-hello-dcos-cli",
      "instances": 1,
      "cpus": 1,
      "mem": 128,
      "container": {
        "type": "DOCKER",
        "docker": {
          "image": "mesosphere/hello-dcos:<image-tag>",
          "forcePullImage": false,
          "privileged": false
        }
      },
      "acceptedResourceRoles": ["slave_public"],
      "portDefinitions": [
        {
          "protocol": "tcp",
          "port": 10001
        }
      ],
      "requirePorts": false
    }
    ```

1. 通过运行以下命令来启动服务：

    ```bash
    dcos marathon app add container-app-cli.json
    ```

1. 通过运行以下命令来验证容器化服务已成功部署：

    ```bash
    dcos marathon app list
    ```
    该命令返回有关已部署服务的信息（类似于以下内容）。

    ```
    ID                             MEM   CPUS  TASKS  HEALTH  DEPLOYMENT  WAITING  CONTAINER  CMD                       
    /container-hello-dcos-cli      128    1     1/1    N/A       ---      False      DOCKER   N/A                       
    /container-hello-dcos-service  128   0.1    1/1    N/A       ---      False      DOCKER   N/A                       
    /dcos-101/app1                 128    1     1/1    N/A       ---      False      DOCKER   while true; do python...  
    /redis-tutorial                1024   1     1/1    1/1       ---      False      DOCKER   N/A                       
    /single-cmd-app-cli            128    1     0/1    N/A       ---      False       N/A     sleep 10                  
    /single-cmd-service            128   0.1    0/1    N/A       ---      False      MESOS    sleep 10 && echo DONE
    ```

1. 打开 DC/OS 基于 Web 的管理控制台，单击 **服务**，然后单击服务名称以显示其详细信息。

1. 单击 **日志**，然后单击 **输出 (stdout)** 视图以查看服务的输出。

![容器应用程序的示例输出](/mesosphere/dcos/1.13/img/tutorial-hello-dcos-output.png)

# 后续步骤
在本教程中，您使用 DC/OS 基于 Web 的管理控制台和 DC/OS 命令行程序部署了一些简单的自定义应用程序。现在，您已经了解如何在不使用容器镜像、不使用本地通用容器运行时、不使用 Docker 容器的情况下将应用程序添加到群集，并且已验证所有自定义应用程序都在群集上运行。

下一个教程将探讨更高级的部署场景和任务，并揭示 DC/OS 架构中的一些其他核心组件：
- [安排任务作为作业运行](../schedule-jobs/)
- [发现已部署服务]../service-discovery/)
[部署和公开本地应用程序](../native-app/)

# 相关主题
在本教程中，您使用单个容器和 [Marathon](../../../deploying-services/creating-services/) 编排框架部署自定义应用程序。

有关通用容器运行时 (UCR) 以及使用 Docker 容器和镜像的更多信息，请参阅 [使用 Containerizer](../../../deploying-services/containerizers/)。
