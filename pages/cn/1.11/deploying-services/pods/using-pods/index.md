---
layout: layout.pug
navigationTitle: 使用 Pod
title: 使用 Pod
menuWeight: 20
excerpt: 通过 CLI 或 Marathon API 端点创建和管理 Pod
enterprise: false
---



您可通过 DC/OS CLI 或通过[Marathon API] 的 `/v2/pods/` 端点创建和管理 Pod(/1.11/deploying-services/marathon-api/)。

# 使用 Pod CLI

Pod CLI 中提供以下命令：

* `dcos marathon pod add [<pod-resource>]`
* `dcos marathon pod list [--json]`
* `dcos marathon pod remove [--force] <pod-id>`
* “dcos marathon pod show” <pod-id>`
* `dcos marathon pod update [--force] <pod-id>`

## 添加 Pod

若要添加 pod，首先创建 JSON pod 定义。然后运行以下命令：
```bash
dcos marathon pod add <pod-json-file>
```

## 列出 pod
使用以下命令列出 pod 及其拥有的容器数：
```bash
dcos marathon pod list
```

## 删除 Pod
使用以下命令删除 pod：
```bash
dcos marathon pod remove <pod-id>
```

如果当前 pod 正在部署，您将无法删除该 pod。若仍然要删除 pod，请使用 `--force` 标记运行该命令。

## 显示 Pod JSON
要查看 pod 定义，请运行以下命令：
```bash
dcos marathon pod show <pod-id>
```
您可使用 `show` 命令以编程方式读取有关 pod 的数据。

## 更新 Pod
若要更新 pod，首先修改 pod 的 JSON 定义，然后运行以下命令:

```bash
dcos marathon pod update <pod-id> < <new-pod-definition>
```

如果当前 pod 正在部署，您将无法更新该 pod。若仍然要更新 pod，请使用 `--force` 标记运行该命令。

# 使用 REST API

## 创建

```bash
 curl -X POST -H "Content-type: application/json" -d@<mypod>.json http://<ip>:<port>/v2/pods
```

样本响应：

```json
{
    "containers": [
        {
            "artifacts": [],
            "endpoints": [],
            "environment": {},
            "exec": {
                "command": {
                    "shell": "sleep 1000"
                }
            },
            "healthCheck": null,
            "image": null,
            "labels": {},
            "lifecycle": null,
            "name": "sleep1",
            "resources": {
                "cpus": 0.1,
                "disk": 0,
                "gpus": 0,
                "mem": 32
            },
            "user": null,
            "volumeMounts": []
        }
    ],
    "environment": {},
    "id": "/simplepod2",
    "labels": {},
    "networks": [
        {
            "labels": {},
            "mode": "host",
            "name": null
        }
    ],
    "scaling": {
        "instances": 2,
        "kind": "fixed",
        "maxInstances": null
    },
    "scheduling": {
        "backoff": {
            "backoff": 1,
            "backoffFactor": 1.15,
            "maxLaunchDelay": 3600
        },
        "placement": {
            "acceptedResourceRoles": [],
            "constraints": []
        },
        "upgrade": {
            "maximumOverCapacity": 1,
            "minimumHealthCapacity": 1
        }
    },
    "secrets": {},
    "user": null,
    "volumes": []
}
```

## 状态

获得所有 Pod 的状态：

```bash
curl -X GET http://<ip>:<port>/v2/pods/::status
```

获取单个 Pod 的状态：

```bash
curl -X GET http://<ip>:<port>/v2/pods/<pod-id>::status
```

## 删除

```bash
curl -X DELETE http://<ip>:<port>/v2/pods/<pod-id>
```
 
