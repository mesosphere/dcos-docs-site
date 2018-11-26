---
layout: layout.pug
navigationTitle: 添加本地用户
title: 添加本地用户
menuWeight: 10
excerpt: 使用 Web 界面或 CLI 添加本地用户

enterprise: true
---

<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->


# 使用 Web 界面添加本地用户

1. 以具有 `superuser` 权限的用户身份登录。

 ![登录](/cn/1.11/img/gui-installer-login-ee.gif)

 图 1. 以超级用户身份登录

1. 选择 **Organization > Users** 并创建新用户。键入用户的全名、用户名和密码。

 ![创建用户 Cory](/cn/1.11/img/service-group3.png)

 图 2. 创建新用户


# 使用 CLI 添加本地用户

**先决条件：**
- [DC/OS Enterprise CLI](/cn/1.11/cli/enterprise-cli/)


1. 使用此命令创建名为 `services` 的用户组。

    ```bash
    dcos security org groups create services
    ```

1. 使用此命令将用户 `cory` 添加到 `services` 组。

    ```bash
    dcos security org groups add_user dcos-services cory
    ```

1. 使用此命令验证用户是否已添加到集群。

    ```bash
    dcos security org users show
    ```

 输出应类似于：

    ```bash
    dcos security org users show
    bootstrapuser:
        description: Bootstrap superuser
        is_remote: false
        is_service: false
    cory:
        description: Cory
        is_remote: false
        is_service: false
    ```
