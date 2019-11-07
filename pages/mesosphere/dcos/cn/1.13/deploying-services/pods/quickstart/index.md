---
layout: layout.pug
navigationTitle:  快速入门
title: 快速入门
menuWeight: 0
excerpt: 在 CLI 或 UI 中启动 pod
render: mustache
model：/mesosphere/dcos/1.13/data.yml
enterprise: false
---

## 先决条件
- DC/OS [已安装](/mesosphere/dcos/1.13/installing/)
- DC/OS CLI [已安装](/mesosphere/dcos/1.13/cli/install/)

# 在 DC/OS CLI 中启动 Pod

1. 使用与本示例相似的内容创建 JSON 应用定义。在本例中，我们将文件称为 `simple-pod.json`。

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

    <p class="message--note"><strong>注意：</strong>pod ID（上文 pod 规范中的 <code>id</code> 参数）用于创建 pod 后与 pod 进行的所有交互。</p>

1. 使用以下 DC/OS CLI 命令在 DC/OS 上启动 pod：

    ```bash
    dcos marathon pod add simple-pod.json
    ```

1. 验证 Pod 的状态。

    ```bash
    dcos marathon pod show simplepod
    ```

# 在 DC/OS UI 中启动 pod

您也可以在 DC/OS 的 [**服务**] (/mesosphere/dcos/1.13/gui/) 选项卡中启动 Pod。选择 **服务 -> 服务 -> 运行服务 -> 多容器 (Pod)**，然后切换到 JSON 模式并粘贴上述应用定义。

如果您已经运行了其他服务，请转到 **服务 -> 服务**，然后单击右上角的 **+**。

在启动 pod 之后，您将在 DC/OS UI 的 **服务** 选项卡上看到您的新 pod。单击 pod，查看有关 Pod 中容器状态的信息。

![Pods UI](/mesosphere/dcos/1.13/img/pods-service-dashboard.png)

图 1. 服务 > Pods
