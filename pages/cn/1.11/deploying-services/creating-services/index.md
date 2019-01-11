---
layout: layout.pug
navigationTitle: 创建服务
title: 创建服务
menuWeight: 1
excerpt: 使用 Marathon 定义 DC/OS 服务
enterprise: false
---



Marathon 应用程序通常代表长期运行的服务，有许多实例在多个主机上运行。应用程序实例称为**任务**。**应用定义**描述启动和维护任务所需的一切。Marathon 应用定义创建 DC/OS **服务**。

# 内联 shell 脚本
您可以在内联 shell 脚本中部署简单的程序。我们从简单的示例开始：一项服务，它将 `Hello Marathon` 打印到 `stdout`，然后在无限循环地休眠 5 秒。

1. 使用以下 JSON 应用定义描述应用程序。使用您选择的名称创建文件。

    ```json
    {
        "id": "basic-0",
        "cmd": "while [ true ] ; do echo 'Hello Marathon' ; sleep 5 ; done",
        "cpus": 0.1,
        "mem": 10.0,
        "instances": 1
    }
    ```

    在上述示例中， `cmd` 是执行的命令。它的值由底层的 Mesos 执行器通过 `/bin/sh -c ${cmd}` 包装。

1. 使用 [DC/OS CLI](/cn/1.11/cli/) 将服务添加到 DC/OS。

    ```bash
    dcos marathon app add <your-service-name>.json
    ```

 当您定义并启动服务时，Marathon 将执行交给 Mesos。Mesos 为每个任务创建一个沙盒目录。沙盒目录是一个有着每个代理节点的目录，用作执行环境并包含相关的日志文件。`stderr` 和 `stdout` 流也会写入沙盒目录。

## 申请应用程序中的资源

若要运行任何有意义的应用程序，通常依赖于一组资源：文件或文件存档。为了管理资源分配，Marathon 具有 URI（统一资源标识符）的概念。URI 使用 [Mesos 抓取器](http://mesos.apache.org/documentation/latest/fetcher/)在下载（并可能）提取资源方面做好工作。

示例：

```json
{
    "id": "basic-1",
    "cmd": "`chmod u+x cool-script.sh && ./cool-script.sh`",
    "cpus": 0.1,
    "mem": 10.0,
    "instances": 1,
    "fetch": [ { "uri": "https://example.com/app/cool-script.sh" } ]
}
```

上述示例执行 `cmd` 内容，下载资源 `https://example.com/app/cool-script.sh` (通过 Mesos)，并使其在服务实例的 Mesos 沙盒中可用。您可以通过访问 DC/OS Web 界面并单击 `basic-1` 的实例，然后单击**Files**选项卡来验证是否已下载。您应该在那里找到 `cool-script.sh`。

<p class="message--note"><strong>注意：</strong> 默认情况下，抓取器不会使下载的文件可执行。在上述示例中， `cmd` 首先使文件可执行。</p>

如前所述，Marathon 还知道如何处理存档中的应用程序资源。目前，Marathon（通过 Mesos 并在执行 `cmd` 之前） 首先尝试使用以下文件扩展名解压缩/提取资源：

* `.tgz`
* `.tar.gz`
* `.tbz2`
* `.tar.bz2`
* `.txz`
* `.tar.xz`
* `.zip`

以下示例展示了这在实践中是如何进行的。假设您有一个位于 `https://example.com/app.zip` 中的 zip文件中的应用程序可执行文件。此 zip 文件包含要执行的脚本 `cool-script.sh`。方法如下：

```json
{
    "id": "basic-2",
    "cmd": "app/cool-script.sh",
    "cpus": 0.1,
    "mem": 10.0,
    "instances": 1,
    "fetch": [ { "uri": "https://example.com/app.zip" } ]
}
```

与实例 `basic-1` 相反，我们现在有一个 `cmd`，值为 `app/cool-script.sh`。下载并解压缩 zip 文件后，根据文件名 `app.zip` 创建目录 `app`，并将 zip 文件的内容提取到其中。

您可以指定多个资源。例如，您可以提供 Git 存储库以及 CDN 中的一些资源，如下所示：

```json
{
    "fetch": [
        { "uri": "https://git.example.com/repo-app.zip", "https://cdn.example.net/my-file.jpg"},
        { "uri": "https://cdn.example.net/my-other-file.css" }
    ]
}
```

开发和部署周期的典型模式是让您的自动构建系统将应用程序二进制文件放置在可通过 URI 下载的位置。Marathon 可以从多个来源下载资源。Marathon 支持以下 [URI 方案](http://tools.ietf.org/html/rfc3986#section-3.1)：

* `file:`
* `http:`
* `https:`
* `ftp:`
* `ftps:`
* `hdfs:`
* `s3:`
* `s3a:`
* `s3n:`


# REST API
您可以使用 REST API 部署基于 Docker 的简单应用程序。通过 Marathon，运行使用 Docker 镜像的应用程序非常简单。

以下示例使用了 Marathon API 将 Docker 应用程序部署到 DC/OS。Docker 应用程序是基于 Python 的 Web 服务器，使用 [python:3](https://registry.hub.docker.com/_/python/) 镜像。在容器内，Web 服务器在端口 `80`（`containerPort`的值）上运行。 `hostPort` 设置为 `0` 以让 Marathon 在 Mesos 代理节点上分配一个随机端口，该端口映射到容器内的端口 80。

1. 选择是否使用 Universal Container Runtime (UCR) 或 Docker Engine 运行时间。请参阅[使用容器化工具](/cn/1.11/deploying-services/containerizers/)。
 - 若要使用 Universal Container Runtime (UCR)，请将以下 JSON 粘贴到名为 `basic-3-mesos.json` 的文件中：

      ```json
      {
        "id": "basic-3-mesos",
        "cmd": "cd /;python3 -m http.server 80",
        "acceptedResourceRoles": ["slave_public"],
        "container": {
          "portMappings": [
            {
              "containerPort": 80,
              "hostPort": 0
            }
          ],
          "type": "MESOS",
          "docker": { "image": "python:3" }
        },
        "cpus": 0.5,
        "mem": 32,
        "networks": [ { "mode": "container/bridge" } ]
      }
      ```

 - 若要使用 Docker Engine 运行时间，请将以下 JSON 粘贴到名为 `basic-3-docker.json` 的文件中：

    ```json
    {
      "id": "basic-3-docker",
      "cmd": "cd /;python3 -m http.server 80",
      "acceptedResourceRoles": [ "slave_public" ],
      "container": {
        "portMappings": [
          {
            "containerPort": 80,
            "hostPort": 0
          }
        ],
        "type": "DOCKER",
        "docker": {
          "image": "python:3" },
          "parameters": [
            {
              "key": "log-driver",
              "value": "none"
            }
          ]
      },
      "cpus": 0.5,
      "instances": 1,
      "mem": 32,
      "networks": [ { "mode": "container/bridge" } ]
    }
    ```

1. 使用 [Marathon API](/cn/1.11/deploying-services/marathon-api/) 部署应用程序 `basic-3-docker`。请参阅 [验证 HTTP API 端点](/cn/1.11/security/ent/iam-api/) 以了解有关如下命令中所需的 API 令牌的更多信息。

    ```sh
     curl -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -X POST <master-IP>/service/marathon/v2/apps -d @basic-3-docker.json -H "Content-type: application/json"
    ```

1. 转到 DC/OS GUI 的 **Services** 选项卡以查看正在运行的服务。
1. 单击 `basic-3-docker`，然后单击任务 ID。
1. 向下滚动到 **Marathon Task Configuration** 部分，并记录 PORTS 属性。

 ![容器端口](/cn/1.11/img/container-port.png)

 图 1. 容器端口
   
1. 确定[公共节点的 IP 地址](/cn/1.11/administering-clusters/locate-public-agent/)。
1. 导航至 `<public-node-IP>:<port>` 以查看 Docker 容器根目录的内容。
