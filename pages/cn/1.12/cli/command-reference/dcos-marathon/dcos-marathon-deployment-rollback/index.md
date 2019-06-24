---
layout: layout.pug
navigationTitle:  dcos marathon deployment rollback
title: dcos marathon deployment rollback
menuWeight: 15
excerpt: 删除部署的应用程序
enterprise: false
---

# 说明

`dcos marathon deployment rollback` 命令让您可以删除部署的应用程序。

# 使用

```bash
dcos marathon deployment rollback <deployment-id>
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `-h`，`--help` | 显示有关此命令用法的信息。 |

## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `<deployment-id>` | 部署 ID。您可以使用 `dcos marathon deployment list` 命令查看应用程序 ID 列表。|



# 示例

在以下示例中，我们首先运行 `dcos marathon deployment list` 以获取应用程序 ID，然后用它来运行带有 `app-id` 的  `dcos marathon deployment rollback`。输出将列出 `deployment-id` 并将回滚应用程序。要验证应用程序是否已回滚，请再次使用 `dcos marathon deployment list`。

```json
~$ dcos marathon deployment list
APP          POD  ACTION  PROGRESS  ID                                    
/kubernetes  -    scale     1/2     e913f8a4-530c-438c-9f6e-709af1730c84  
~$ dcos marathon deployment rollback e913f8a4-530c-438c-9f6e-709af1730c84 
{
  "deploymentId": "88169044-d612-4890-8625-5a81da255c76",
  "version": "2019-03-18T20:11:19.737Z"
}
~$ dcos marathon deployment list
There are no deployments
```

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos marathon](/cn/1.12/cli/command-reference/dcos-marathon/) | 将应用程序部署到 DC/OS 并对其进行管理。|