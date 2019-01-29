---
layout: layout.pug
navigationTitle: 配置 Universe 服务
title: 配置 Universe 服务
menuWeight: 2
excerpt: 使用 DC/OS CLI 配置服务

enterprise: false
---


本主题介绍如何使用 DC/OS CLI 配置服务。您还可以使用 DC/OS UI 中的 [Services](/cn/1.11/gui/services/) 选项卡自定义服务 。

1. 使用 dcos package describe --config <package-name> <package-name>命令查看服务的可用配置选项。

    ```bash
    dcos package describe --config marathon
    ```

    输出应当如下：

      ```json
      {
      ...
        "service": {
          "additionalProperties": false,
          "description": "Marathon app configuration properties.",
          "properties": {
            "cpus": {
              "default": 2,
              "description": "CPU shares to allocate to each Marathon instance.",
              "minimum": 0,
              "type": "number"
            },
            ...
            "instances": {
              "default": 1,
              "description": "Number of Marathon instances to run.",
              "minimum": 0,
              "type": "integer"
            },
            "mem": {
              "default": 1536,
              "description": "Memory (MB) to allocate to each Marathon instance.",
              "minimum": 512,
              "type": "number"
            }
          },
          ...
        }
      }
      ```

2. 创建 JSON 配置文件。您可以选择任意名称，但您可能想要选择类似于 `<package-name>-config.json`. For example, `marathon-config.json`的起名格式。

    ```bash
    nano marathon-config.json
    ```

3. 使用 `properties` 对象以构建您的 JSON 选项文件。例如，将 Marathon 的 CPU 共享数更改为 3，将内存分配更改为 2048：

    ```json
    {
      "service": {
        "cpus": 3.0, "mem": 2048.0
       }
    }
    ```

4. 从 DC/OS CLI 安装指定了自定义选项文件的 DC/OS 服务：

    ```bash
    dcos package install --options=marathon-config.json marathon
    ```

如需更多信息，请参阅 [dcos package](/cn/1.11/cli/command-reference/dcos-package/) 文档。
