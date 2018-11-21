---
layout: layout.pug
navigationTitle: 快速启动
title: 快速启动
menuWeight: 0
excerpt: 从 CLI 或 Web 界面启动 pod
enterprise: false
---


## 先决条件
- DC/OS [已安装](/cn/1.11/installing/)
- DC/OS CLI [已安装](/cn/1.11/cli/install/)

# 在 DC/OS CLI 中启动 Pod

1. 使用与本示例相似的内容创建 JSON 应用定义。在本例中，我们将文件称为 `simple-pod.json`。<!-- Validated. JSH 9/30/16 -->

    ```json
    {
        "id": "/simplepod",
        "scaling": { "kind": "fixed", "instances": 1 },
        "containers": [
            {
                "name": "sleep1",
                "exec": { "command": { "shell": "sleep 1000" } },
                "resources": { "cpus": 0.1, "mem": 32 }
            }
        ],
        "networks": [ {"mode": "host"} ]
    }
    ```

 **注意：** pod ID（ 上文 pod 规范中的 `id` 参数）一旦创建，将会用于和 Pod 进行的所有交互。

1. 使用以下 DC/OS CLI 命令在 DC/OS 上启动 pod：

    ```bash
    dcos marathon pod add simple-pod.json
    ```

1. 验证 Pod 的状态。

    ```
    dcos marathon pod show simplepod
    ```

# 在 DC/OS web 界面启动 Pod

您也可以在 DC/OS 的 [**服务**] (/1.11/gui/) 选项卡中启动 Pod。选择 **服务 -> 服务 -> 运行服务 -> 多容器 (Pod)**，然后切换到 JSON 模式并粘贴上述应用定义。

如果您已经运行了其他服务，请转到 **服务 -> 服务**，然后单击右上角的 **+**。

在启动 pod 之后，您将在 DC/OS Web 界面的 **服务** 选项卡上看到您的新 POD。单击 pod，查看有关 Pod 中容器状态的信息。

![Pods UI](/cn/1.11/img/pods-service-dashboard.png)

图 1. 服务 > Pods
