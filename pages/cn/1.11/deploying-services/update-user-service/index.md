---
layout: layout.pug
navigationTitle: 更新用户创建的服务
title: 更新用户创建的服务
menuWeight: 3
excerpt: 更新已部署应用程序的配置

enterprise: false
---


可以使用 `dcos marathon` 命令轻松查看和更新已部署应用程序的配置。

**注意：**在 [DC/OS 目录] (/1.11/gui/catalog/)中更新软件包的流程不同。如需更多信息，请参阅 [文档](/cn/1.11/deploying-services/config-universe-service/)。

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

2. 编辑 `env_vars.json` 文件。将 `{ "env" :}` 包括在文件内容内并添加更新，将 JSON 变为有效对象：

```json
{ "env" : { "APISERVER_PORT" : "25502", "SCHEDULER_DRIVER_PORT" : "25501" } }
```

3. 使用指定的 JSON 文件指定此 CLI 命令：

```bash
dcos marathon app update test-app < env_vars.json
```

4. 查看更新结果：

```bash
dcos marathon app show test-app | jq '.env'
```

 [1]: /1.11/cli/
