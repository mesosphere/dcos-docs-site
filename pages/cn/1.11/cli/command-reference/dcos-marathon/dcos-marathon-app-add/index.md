---
layout: layout.pug
navigationTitle: dcos marathon app add
title: dcos marathon app add
menuWeight: 1
excerpt: 添加应用程序

enterprise: false
---


# 说明
`dcos marathon app add` 命令允许您添加应用程序。

# 使用

```bash
dcos marathon app add <app-resource> [OPTION]
```

# 选项

无。

# 位置自变量

| 名称，简写 | 说明 |
|---------|-------------|
| `<app-resource>`   | Path to a file or HTTP(S) URL that contains the app's JSON definition. If omitted, the definition is read from `stdin`。有关详细说明，请参阅[文档](/cn/1.11/deploying-services/marathon-api/)。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos marathon](/cn/1.11/cli/command-reference/dcos-marathon/) | 将应用程序部署到 DC/OS 并对其进行管理。|

# 示例

## 部署简单的应用程序

在该示例中，一个简单的应用程序被部署到了 DC/OS Marathon。

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

1. 使用此命令验证应用程序是否已添加：

    ```bash
    dcos marathon app list
    ```

 输出应如下所示：

 ```bash
 ID MEM CPUS TASKS HEALTH DEPLOYMENT CONTAINER CMD
 /myApp 64 0.1 0/1 --- scale DOCKER None
    ```
