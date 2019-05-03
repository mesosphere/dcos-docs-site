---
layout: layout.pug
navigationTitle:  dcos marathon app add
title: dcos marathon app add
menuWeight: 1
excerpt: 添加应用程序

enterprise: false
---


# 说明

`dcos marathon app add` 命令让您可以添加应用程序。

# 使用

```bash
dcos marathon app add <app-resource> 
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `--help` | 显示此消息后退出。 |

## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `<app-resource>` | 包含应用程序的 JSON 定义的文件或 HTTP(S) URL 路径。如果遗漏，则从 `stdin` 中读取定义。有关详细说明，请参阅[文档](/cn/1.12/deploying-services/marathon-api/)。|


# 示例

## 部署简单的应用程序

在该示例中，将一个简单的应用程序部署到 DC/OS Marathon。

1. 使用这些内容创建名为 `my-app.json` 的应用定义文件。

    ```bash
    {
        "id": "/my-app",
        "networks": [
              { "mode": "container/bridge" }
        ],
        "container": {
        "type": "DOCKER",
        "docker": {
              "image": "group/image",
            }
        },
        "portMappings": [
          { "hostPort": 80, "containerPort": 80, "protocol": "tcp"}
        ],
        "instances": 1,
        "cpus": 0.1,
        "mem": 64
    }
    ```

1. 将您的应用程序添加到 Marathon：

    ```bash
    dcos marathon app add <my-app.json>
    ```

    如果添加成功，则没有输出。

1. 使用此命令验证是否已添加应用程序：

    ```bash
    dcos marathon app list
    ```

    输出应如下所示：

    ```bash
     ID     MEM  CPUS  TASKS  HEALTH  DEPLOYMENT  CONTAINER  CMD
    /myApp   64  0.1    0/1    ---      scale       DOCKER   None
    ```

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos marathon](/cn/1.12/cli/command-reference/dcos-marathon/) | 将应用程序部署到 DC/OS 并对其进行管理。|
