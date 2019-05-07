---
layout: layout.pug
navigationTitle: 更新用户创建的服务
title: 更新用户创建的服务
menuWeight: 3
excerpt: 更新已部署应用程序的配置

enterprise: false
---


可以使用 `dcos marathon` 命令轻松查看和更新已部署应用程序的配置。

在 [DC/OS 目录] (/cn/1.12/gui/catalog/)中更新包的流程不同。如需更多信息，请参阅 [文档](/cn/1.12/deploying-services/config-universe-service/)。

# 更新所有环境变量

使用 DC/OS CLI 中的 `dcos marathon app update` 命令更新服务的 JSON 服务定义的所有方面。例如，按照以下说明更新服务定义的环境变量（[`env` 字段] [1]）。

```bash
dcos marathon app update test-app env='{"APISERVER_PORT":"25502"}'
```

这将使用指定的新值替换整个`env` 字段。运行以下命令，查看更新结果：

```bash
dcos marathon app show test-app | jq '.env'
```

## 使用 JSON 文件

也可以通过在命令参数中指定 JSON 文件来更新[`env` 字段][1] 。

1. 将现有环境变量保存到文件：

    ```bash
    dcos marathon app show test-app | jq .env >env_vars.json
    ```

    文件将包含 `env` 字段的 JSON：

    ```json
    { "SCHEDULER_DRIVER_PORT": "25501", }
    ```

1. 编辑 `env_vars.json` 文件。使用 `{ "env" :}` 括起文件内容并添加更新，将 JSON 变为有效对象：

    ```json
    { "env" : { "APISERVER_PORT" : "25502", "SCHEDULER_DRIVER_PORT" : "25501" } }
    ```

1. 使用指定的 JSON 文件指定此 CLI 命令：

    ```bash
    dcos marathon app update test-app < env_vars.json
    ```

1. 查看更新结果：

    ```bash
    dcos marathon app show test-app | jq '.env'
    ```

 [1]: /cn/1.12/cli/
