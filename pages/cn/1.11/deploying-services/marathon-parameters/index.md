---
layout: layout.pug
navigationTitle: Marathon 配置参考
title: Marathon 配置参考
menuWeight: 0
excerpt: 了解 Marathon 应用定义

enterprise: false
---

本专题列出了 Marathon 应用定义的所有可用属性，并举例说明了所有所显示属性的 JSON 应用定义文件。

- Marathon 属性
- [示例](#example)

# Marathon 属性

### acceptedResourceRoles
一系列资源角色。Marathon 仅考虑在此列表中为启动此应用程序的任务提供的资源邀请。如需更多信息，请参阅 [Mesos 文档](http://mesos.apache.org/documentation/latest/roles/)。

### args
指定要运行命令的一组字符串。即便使用默认命令执行器，这里的 `args` 字段也可用于替代 `cmd`。

<p class="message--important"><strong>重要信息：</strong>必须在所有应用定义中指定 <tt>cmd</tt> 或 <tt>args</tt>。在同一应用程序中同时提供 <tt>cmd</tt> 或 <tt>args</tt> 则无效。</p> 


### backoffFactor
用于 `backoffSeconds` 值的被乘数。默认值为 `1.15`。`backoffSeconds` 和 `backoffFactor` 值相乘，直到达到 [`maxLaunchDelaySeconds`](#maxlaunchdelayseconds) 值。达到该值后，Marathon 等待 `maxLaunchDelaySeconds`，然后再重复此循环，按指数递增。例如，如果是 `backoffSeconds: 3`、`backoffFactor: 2` 和 `maxLaunchDelaySeconds: 3600`，则会尝试十次启动失败的任务，每次间隔三秒。尝试十次之后，Marathon 将等待 3600 秒，然后再重复此循环。

这样可以防止与连续失败的任务关联的砂盒填满 Mesos 从节点上的硬盘。这也适用于因不通过运行状况检查次数过多而遭到关闭的任务。

### backoffSeconds
Marathon 尝试再次启动失败任务之前的缓冲时间（秒）。默认为 `1`。`backoffSeconds` 和 `backoffFactor` 值相乘，直至达到 `maxLaunchDelaySeconds` 值。达到该值后，Marathon 等待 `maxLaunchDelaySeconds`，然后再重复此循环，按指数递增。例如，如果是 `backoffSeconds: 3`、`backoffFactor: 2` 和 `maxLaunchDelaySeconds: 3600`，则会尝试十次启动失败的任务，每次间隔三秒。尝试十次之后，Marathon 将等待 3600 秒，然后再重复此循环。

这样可以防止与连续失败的任务关联的砂盒填满 Mesos 从代理上的硬盘。这也适用于因不通过运行状况检查次数过多而遭到关闭的任务。

### cmd
执行的命令。该值由 Mesos 通过 `/bin/sh -c ${app.cmd}` 打包。

<p class="message--important"><strong>重要信息：</strong>必须在所有应用定义中指定 <tt>cmd</tt> 或 <tt>args</tt>。在同一应用程序中同时提供 <tt>cmd</tt> 或 <tt>args</tt> 则无效。</p> 


### constraints
控制应用程序运行位置的约束算子，帮助您针对容错或位置进行优化。如需更多信息，请参阅 [约束文档](https://mesosphere.github.io/marathon/docs/constraints.html)。

### container
容器信息。

- **type** containerizer 运行时间类型，为 `MESOS` 或 `DOCKER`。如需更多信息，请参阅 [使用Containerizer](/cn/1.11/deploying-services/containerizers/)。

- **portMappings** 主机和容器之间的端口映射阵列。端口映射类似于将 `-p` 传递到 Docker 命令行，以指定主机上端口与容器内的端口之间的关系。如果在创建时未指定（空），则默认为 { "portMappings": [ { "containerPort": 0, "name": "default" } ], ... }。指定空阵列 ([]) 即表示应用程序未使用端口；在此情况下未注入默认值。

 端口映射包括：

 - **containerPort** 容器端口（例如， `8080`）。
 - **hostPort** 主机端口（如 `0`）。默认值为 `0`。 [网络模式] (#networks) `container`不需要`hostPort`，但如果未指定，Marathon 不会随机分配端口。使用 `container/bridge` 模式时，未指定（空）的值 `hostPort` 设置 `hostPort: 0`。
 - **servicePort** 服务端口（如 `9000`）。
 - **protocol** HTTP 协议，为 `tcp` 或 `udp`。

 ### Notes

 端口映射与 `container` 和 `container/bridge` [网络模式](#networks) 一同使用，而如果在 `host` 网络模式下一同使用则会被忽略。与多个 `container` 网络结合使用时，每个指定 `hostPort` 的映射条目还必须声明 `name`，以确定映射应用的网络（单个 `hostPort` 只能映射到一个容器网络，而 `name` 默认值则会映射到 pod 或应用程序的所有容器网络）。
 - [`requirePorts`](#requirePorts) 不适用于 `portMappings`。
 - 未来版本的 Marathon 可能无法验证声明网络模式不是 `container` 或 `container/bridge` 的 `container.portMappings`。

- **docker** Docker 容器信息。

 - **forcePullImage** 是否拉取镜像，不考虑镜像是否已在本地系统上可用。
 - **image** Docker 镜像的路径。
 - **privileged** 是否为此容器提供扩展权限。如需更多信息，请参阅 [Docker 运行命令](https://docs.docker.com/engine/reference/commandline/run/)。
 - `"privileged": false` 不提供扩展权限。这是默认值。
 - `"privileged": true` 提供扩展权限。
 - **parameters** 用于 Mesos 容器执行的 `docker run` 命令的命令行选项。以此方式传递的参数不保证将来能够获得支持，因为 Mesos 可能不总是通过 CLI 与 Docker 进行交互。
 - **pullConfig** 一个密钥，它的值是密钥存储库中的一个字符串化 JSON 对象。参见 [使用专用 Docker 注册表](/cn/1.11/deploying-services/private-docker-registry/#secret-store-instructions)。

- **volume** 容器中可访问的卷。
 - **containerPath** 容器读写数据的路径。
 - **external** 外部持久卷。参见 [外部持久卷](/cn/1.11/storage/external-storage/)。
 - **name** 卷驱动程序用来查找外部卷的名称。
 - **provider** 存储提供商。
 - **options** 用于存储的 Docker 卷驱动程序。DC/OS 支持的 Docker 卷驱动程序只有 [REX-Ray](/cn/1.11/storage/external-storage/)。
 - **size** 外部持久卷的大小（GiB）。
 - **hostPath** 主机路径。
 - **mode** 卷的访问模式，为读写（`RW`） 或只读 (`RO`）模式。
 - **persistent** 本地持久卷。参见 [本地持久卷](/cn/1.11/storage/persistent-volume/)。
 - **size** 本地持久卷的大小 (MiB)。

### cpus
每个实例的 CPU 共享数。十进制小数或整数。

### dependencies
此应用程序所依赖的服务列表。启动、停止和升级应用程序的命令源自依赖关系。例如，假设应用 `/a` 依赖服务 `/b`，而该服务依赖 `/c`。如需启动所有 3 个应用，首先要启动 `/c` ，然后启动 `/b` 和 `/a`。

### disk
应用程序所需的磁盘空间量。十进制小数或整数 MB。

### env
环境变量。

### executor
用于启动应用程序的执行器。默认为 `//cmd`，需要 `cmd` 并在 shell 层级执行。

### fetch
要抓取的 URI 阵列。如需更多信息，请参阅 [Mesos Fetcher 文档](http://mesos.apache.org/documentation/latest/fetcher/)。

URI 包括：

- **uri** Mesos fetcher 模块要抓取的 URI。
- **executable** 将抓取的工件设置为可执行。
- **extract** 如果 Mesos fetcher 模块支持，则提取抓取的工件。
- **cache** 如果 Mesos fetcher 模块支持，则缓存抓取的工件。

### gpus
每个实例所需的 GPU 核数。

### healthChecks
针对应用程序任务运行的一系列检查。Marathon 运行状况检查对集群中分布的容器进行定期检查，以确保它们正常运行和响应。如需更多信息，请参阅 [运行状况检查文档](/cn/1.11/deploying-services/creating-services/health-checks/)。

运行状况检查包括：

- **gracePeriodSeconds** 指定立即在任务启动后，忽略运行状况检查的时间（秒）；或直至首次运行状况良好的时间。
- **intervalSeconds** 指定运行状况检查间隔的等待时间（秒）。
- **maxConsecutiveFailures** 指定发生多少次连续运行状况检查故障之后才能关闭任务。
- **path** 如果是 `"protocol": "HTTP"`，则此选项指定任务运行状况端点的路径。例如， `"/path/to/health"`。
- **portIndex** 指定用于运行状况请求的端口阵列中的端口号。应用程序可借助端口号使用任何端口（例如 `"[0, 0, 0]"`），而且任务可以借助端口环境变量启动，例如 `$PORT1`。
- **protocol** 指定请求的协议：`HTTP`、`HTTPS`、`TCP` 或 `Command`。
- **timeoutSeconds** 指定运行状况检查失败之前等待的时间（秒），不考虑响应结果。

### id
（必填）由一系列以斜线隔开的名称组成的应用程序唯一标识符。每个名称必须至少为 1 个字符，且只能包含数字 (0-9)、连字符 (-)、圆点 (.) 和小写字母 (a-z)。名称开头或结尾不得用连字符。

以下正则表达式显示了正确的格式：

```
^(([a-z0-9]|[a-z0-9][a-z0-9\\-]*[a-z0-9])\\.)*([a-z0-9]|[a-z0-9][a-z0-9\\-]*[a-z0-9])$
```

### instances
此应用程序中要启动的实例数。可以根据扩展应用程序的需要更改此数量。

### labels
向其他服务披露补充信息的元数据。例如，可以标记应用程序 `"environment": "staging"`，根据他们在管线中的位置标记服务。

### maxLaunchDelaySeconds
应用 [`backoffSeconds`](#backoffseconds) 和 [`backoffFactor`](#backofffactor) 值后，在尝试重新启动失败的任务之前，要等待的最长时间（秒）。`backoffSeconds` 和 `backoffFactor` 值相乘，直至达到 `maxLaunchDelaySeconds` 值。达到该值后，Marathon 等待 `maxLaunchDelaySeconds`，然后再重复此循环，按指数递增。例如，如果是 `backoffSeconds: 3`、`backoffFactor: 2` 和 `maxLaunchDelaySeconds: 3600`，则会尝试十次启动失败的任务，每次间隔三秒。尝试十次之后，Marathon 将等待 3600 秒，然后再重复此循环。

这样可以防止与连续失败的任务关联的砂盒填满 Mesos 从节点上的硬盘。这也适用于因不通过运行状况检查的次数过多而遭到关闭的任务。

### mem
每个实例所需的内存量 (MB)。

### networks
网络定义阵列。只有使用通用容器运行时间的应用程序才能指定多个网络（`MESOS`） [containerizer 运行时间](#container)。尽管 Docker 在每个容器中支持多个网络，但是 Docker Engine 的 containerizer 运行时间不支持多个网络。

网络定义包括：

- **mode** 网络模式。支持三种网络模式：`host`、`container`、`container/bridge`。应用程序无法混合网络模式：必须指定一个 `host` 网络、一个 `container/bridge` 网络，或一个或多个 `container` 网络。
- **name** 网络名称。`container` 模式下需要。
- **labels** 参见 [标签](#labels)。


### portDefinitions
代理主机上所必需的端口资源阵列。阵列中的项目数量决定了为每个任务分配的动态端口数。为端口数为零的端口分配并提供全局唯一（集群范围）的服务端口，并作为应用定义的一部分用于负载均衡定义中。如需更多信息，请参阅 [网络文档](/cn/1.11/networking/)。

端口定义包括：

- **port** 范围为 0 至 65535 的整数。
- **name** 此端口上托管的服务的名称。如果名称已指定，它在所有端口定义中都必须是唯一的。
- **labels** 要由防火墙等外部应用程序解释的元数据。
- **protocol** HTTP 协议，为 `tcp` 或 `udp`。

每个端口值通过环境变量 `$PORT0`、`$PORT1` 等披露到实例。分配给运行实例的端口也可通过任务资源提供。

端口定义仅用于 [`host`](#networks) 网络模式。端口定义（特别是其端口字段）通过 [`requirePorts`](#requireports) 字段的角度解释。如果 `requirePorts` 为假（默认），端口定义的端口被视为服务端口，而 Marathon 会灵活选择主机端口。如果 `requirePorts` 为真，端口定义的端口被视为既是主机端口，也是服务端口。

0 的特殊端口值告诉 Marathon 从 Mesos 资源邀请中选择任何主机端口，并在配置服务端口范围内选择任何服务端口。

**注意：**

- 在 [`container.portMappings`](#container) 中为 Docker 容器配置端口分配。
- 如果使用 [通用容器运行时间](/cn/1.11/deploying-services/containerizers/ucr/)，请将零作为端口值传递，为各个应用实例生成一个或多个规定的自由端口。

如需更多信息，请参阅 [容器](/cn/1.11/deploying-services/containerizers/)。

### requirePorts
是不是自动分配任务的主机端口。

- `"requirePorts": false` 端口将自动分配。
- `"requirePorts": true` 提前手动指定端口。Marathon 将仅安排有指定端口可用的主机上的相关任务。

### residency
设置有状态的应用程序。如需更多信息，请参阅 [本地持久卷](/cn/1.11/storage/persistent-volume/)。**Deprecated**。

- **taskLostBehavior** 指示 Marathon 是否会在收到 `TASK_LOST` 状态更新之后，在另一个节点启动任务。

 - **WAIT_FOREVER** 接收 `TASK_LOST` 状态更新后，不重新启动任务。需要此设置才能创建持久卷。这是默认值。
 - **RELAUNCH_AFTER_TIMEOUT** 收到 `TASK_LOST` 状态更新后，重新启动任务。

### taskKillGracePeriodSeconds
执行器将 SIGTERM 发送至任务，再发送 SIGKILL的间隔时间（秒）。


### unreachableStrategy
定义不可访问实例的处理。值为字符串或对象。字符串为“禁用”，可禁用对不可访问实例的处理。如果是 `inactiveAfter = 60` 和 `expungeAfter = 120`，实例超过 120 秒仍然不可访问即被排除，如果超过 60 秒仍然不可访问，就会启动第二个实例。

- **inactiveAfterSeconds** - 如果实例超过 `inactiveAfterSeconds` 不可访问就会被标记为不活跃。这将触发启动新实例。必须小于或等于 `expungeAfterSeconds`。
- **expungeAfterSeconds** - 如果实例超过 `expungeAfterSeconds` 不能访问，就会被排除。这意味着即便实例恢复访问也可能会被关闭。实例常常在被排除之前被标记为无法访问，但是不一定如此。此值必须大于 `inactiveAfterSeconds`，除非两者均为零。如果实例有与其关联的任何持久卷，该持久卷将会被销毁，而且相关数据会被删除。

### upgradeStrategy
在 Marathon 停用旧版本并启动新版本时有效的策略。升级期间，应用程序的所有实例都将替换为新版本。

- **minimumHealthCapacity** - 在升级期间保持运行良好状态的节点所占的最小百分比（以介于 `0.0` 和 `1.0` 之间的十进制小数表示）。升级期间，Marathon 可保证这种运行良好的实例的数量。默认为 `1.0`，这意味着在部署另一个运行良好的新版本之前，无法停用旧实例。`0.5` 值表示在升级期间，首先停用一半的旧版本实例，为新版本腾出空间。`0` 值表示立即将所有实例删除并替换为新应用程序。
- **maximumOverCapacity** - 在升级期间任一时候可以启用的新实例所占的最大百分比（以介于 `0.0` 和 `1.0` 之间的十进制小数来表示）。默认为 `1`，这意味着升级过程中，所有新旧实例均可同时存在。`0.1` 值表示在升级过程中，可提供比平时多 10% 的容量供新旧实例使用。`0.0` 值表示即便在升级过程中，也不可提供比平时多的容量供新实例使用。只有在停用旧版本之后，才能部署新实例。

如果是 `"minimumHealthCapacity": 1` 和 `"maximumOverCapacity": 0`，在升级过程开始时就新增了至少一个新实例。如果该实例运行良好，就会停用一个旧实例。停用后，就会启动另一个新实例，以此类推。

组合使用 `"minimumHealthCapacity": 0.9` 和 `"maximumOverCapacity": 0` 就会导致轮流更新，每次替换 10% 的实例，在升级期间始终保留至少 90% 的应用程序在线。

组合使用 `"minimumHealthCapacity": 1` 和 `"maximumOverCapacity": 0.1` 就会导致轮流更新，每次替换 10% 的实例，在升级期间始终保留至少 100% 的应用程序在线，另外增加 10% 的容量。

# 示例

以下示例展示了包含所有字段的 JSON 应用程序定义。

```json
{
    "id": "/product/service/myApp",
    "cmd": "env && sleep 300",
    "cpus": 1.5,
    "mem": 256.0,
    "portDefinitions": [
        { "port": 8080, "protocol": "tcp", "name": "http", "labels": { "VIP_0": "10.0.0.1:80" } },
        { "port": 9000, "protocol": "tcp", "name": "admin" }
    ],
    "requirePorts": false,
    "instances": 3,
    "executor": "",
    "container": {
        "type": "DOCKER",
        "docker": {
            "image": "group/image",
            "privileged": false,
            "parameters": [
                { "key": "a-docker-option", "value": "xxx" },
                { "key": "b-docker-option", "value": "yyy" }
            ]
        },
        "portMappings": [
            {
                "containerPort": 8080,
                "hostPort": 0,
                "servicePort": 9000,
                "protocol": "tcp"
            },
            {
                "containerPort": 161,
                "hostPort": 0,
                "protocol": "udp"
            }
        ],
        "volumes": [
            {
                "containerPath": "data",
                "hostPath": "mydata",
                "mode": "RO",
                "persistent": {
                    "size": 10
                }
            },
            {
                "containerPath": "test-rexray-volume",
                "external": {
                  "size": 100,
                  "name": "my-test-vol",
                  "provider": "dvdi",
                  "options": { "dvdi/driver": "rexray" }
                  },
                "mode": "RW"
              }
        ]
    },
    "residency": {
        "taskLostBehavior": "WAIT_FOREVER"
        },
    "env": {
        "LD_LIBRARY_PATH": "/usr/local/lib/myLib"
    },
    "constraints": [
        ["attribute", "$OPERATOR", "value"]
    ],
    "acceptedResourceRoles": [
        "role1", "*"
    ],
    "labels": {
        "environment": "staging"
    },
    "fetch": [
        { "uri": "https://raw.github.com/mesosphere/marathon/master/README.md" },
        { "uri": "https://foo.com/archive.zip", "executable": false, "extract": true, "cache": true }
    ],
    "dependencies": ["/product/db/mongo", "/product/db", "../../db"],
    "healthChecks": [
        {
            "protocol": "HTTP",
            "path": "/health",
            "gracePeriodSeconds": 3,
            "intervalSeconds": 10,
            "portIndex": 0,
            "timeoutSeconds": 10,
            "maxConsecutiveFailures": 3
        },
        {
            "protocol": "HTTPS",
            "path": "/machinehealth",
            "gracePeriodSeconds": 3,
            "intervalSeconds": 10,
            "port": 3333,
            "timeoutSeconds": 10,
            "maxConsecutiveFailures": 3
        },
        {
            "protocol": "TCP",
            "gracePeriodSeconds": 3,
            "intervalSeconds": 5,
            "portIndex": 1,
            "timeoutSeconds": 5,
            "maxConsecutiveFailures": 3
        },
        {
            "protocol": "COMMAND",
            "command": { "value": "curl -f -X GET http://$HOST:$PORT0/health" },
            "maxConsecutiveFailures": 3
        }
    ],
    "backoffSeconds": 1,
    "backoffFactor": 1.15,
    "maxLaunchDelaySeconds": 3600,
    "taskKillGracePeriodSeconds": 2,
    "upgradeStrategy": {
        "minimumHealthCapacity": 0.5,
        "maximumOverCapacity": 0.2
    },
    "networks": [
      { "mode": "container/bridge" }
  ]
}
```
