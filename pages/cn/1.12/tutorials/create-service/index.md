---
layout: layout.pug
navigationTitle: 创建和运行服务
title: 教程 - 创建和运行服务
menuWeight: 1
excerpt: 创建和部署服务及容器化服务

enterprise: false
---

#include /mesosphere/dcos/cn/include/tutorial-disclaimer.tmpl


本教程介绍如何使用 DC/OS GUI 和 CLI 创建和部署简单的单命令服务和容器化服务。

## 先决条件
- [DC/OS 群集](/mesosphere/dcos/cn/1.12/installing/)

# 单命令服务

## DC/OS GUI

从 DC/OS GUI 创建和运行简单服务：

1. 单击 DC/OS GUI 的 **Services** 选项卡，然后单击 **RUN A SERVICE**。
1. 单击 **Single Container**。

    1. 在 **SERVICE ID** 字段，输入服务名称。
    1. 在 **COMMAND** 字段，输入 `sleep 10`。
    1. 单击 **MORE SETTINGS**，然后选择容器运行时间。

    - **DOCKER ENGINE** 如果您需要 Docker 软件包的特定功能，请使用此选项。如果选择此选项，则必须在 **CONTAINER IMAGE** 字段中指定 Docker 容器镜像。
    - **UNIVERSAL CONTAINER RUNTIME (UCR)** Universal Container Runtime (UCR) 使用本地 Mesos 引擎。支持 Docker 文件格式、多个容器 (pod) 以及 GPU 资源。如果选择此选项，则可选择在 **CONTAINER IMAGE** 字段中指定 Docker 容器镜像。

    如需更多信息，请参阅[使用容器化工具](/mesosphere/dcos/cn/1.12/deploying-services/containerizers/)。

1. 单击**查看和运行**和**运行服务**。

    ![在 DC/OS UI 中创建服务](/mesosphere/dcos/1.12/img/deploy-svs-ui.png)

    图 1. 在 GUI 中创建服务

1. 单击 **Services** 视图中的服务名称，以查看其运行情况并监控运行状况。

    ![在 DC/OS UI 中运行服务](/mesosphere/dcos/1.12/img/GUI-Services-Running_Services_View-1_12.png)

    图 2. 在 GUI 中查看运行的服务

## DC/OS CLI

从 DC/OS CLI 创建和运行简单服务：

1. 使用以下内容创建名为 `my-app-cli.json` 的 JSON 文件：

    ```json
    {
      "id": "/my-app-cli",
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

1. 使用以下命令运行服务。

    ```bash
    dcos marathon app add my-app-cli.json
    ```

1. 运行以下命令以验证您的服务是否正在运行：

    ```bash
    dcos marathon app list
    ```

 您还可以单击 DC/OS GUI 的 **Services** 视图中的服务名称，以查看其运行情况并监控运行状况。

# 容器化服务

## DC/OS GUI

从 DC/OS GUI 创建并运行容器化服务：

1. 转到 [Mesosphere Docker Hub 存储库](https://hub.docker.com/r/mesosphere/hello-dcos/tags/) 的 `hello-dcos` 页面，并记下最新的图像标签。
1. 单击 DC/OS GUI 的 **Services** 选项卡，然后单击 **RUN A SERVICE**。
1. 单击 **Single Container**，在 **SERVICE ID** 字段中输入您的服务名称。
1. 单击 **Container Settings** 选项卡，在 **CONTAINER IMAGE** 字段中输入以下内容：`mesosphere/hello-dcos:<image-tag>`。使用您在步骤 1 中复制的标记替换 `<image-tag>`。

    ![DC/OS UI 中的容器化服务](/mesosphere/dcos/1.12/img/deploy-container-ui.png)

    图 3. GUI 中的容器化服务

1. 单击**查看和运行**和**运行服务**。
1. 在 **Services** 选项卡中，单击服务名称，然后选择任务实例之一。单击 **Logs**，然后切换到 **STDERR** 和 **STDOUT** 以查看服务的输出。

    ![在 DC/OS UI 中运行容器化服务](/mesosphere/dcos/1.12/img/container-running-ui.png)

    图 4. 在 GUI 中查看容器化服务

## DC/OS CLI

从 CLI 创建并运行容器化服务：


1. 转到 [Mesosphere Docker Hub 存储库](https://hub.docker.com/r/mesosphere/hello-dcos/tags/) 的 `hello-dcos` 页面，并记下最新的图像标签。
1. 使用以下内容创建名为 `hello-dcos-cli.json` 的 JSON 文件。将 `docker:image` 字段中的 `<image-tag>` 替换为您在步骤 1 中复制的标记。

    ```json
    {
      "id": "/hello-dcos-cli",
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

1. 使用以下命令运行服务。

    ```bash
    dcos marathon app add hello-dcos-cli.json
    ```

1. 运行以下命令以验证您的服务是否正在运行：

    ```bash
    dcos marathon app list
    ```

1. 在 DC/OS GUI 的 **Services** 选项卡中，单击服务名称，然后选择任务实例之一。
1. 单击 **Logs**，然后切换到 **STDERR (STDOUT)** 视图以查看服务的输出。
