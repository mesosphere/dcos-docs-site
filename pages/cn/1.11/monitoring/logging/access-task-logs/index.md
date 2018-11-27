---
layout: layout.pug
navigationTitle: 控制对任务日志的访问
title: 控制对任务日志的访问
menuWeight: 2
excerpt: 使用 Marathon 群组管理用户对任务日志的访问
beta: true
enterprise: true
---


您可以通过使用 Marathon 群组进行作业和服务，控制用户对任务日志的访问。然后，您可以分配访问这些群组的权限，从而让您可以控制用户可以访问哪些日志。

<table class=“table” bgcolor=#7d58ff>
<tr> 
  <td align=justify style=color:white><strong>重要信息：</strong>本文档所述的功能仅在严格安全模式下可用。</td> 
</tr> 
</table>


在此过程中，您将在单独的 Marathon 群组中部署服务，并授予用户权限以查看这些 Marathon 群组的任务。

以下是对所需 [权限] 的概述(/1.11/security/ent/perms-reference/)：

| 权限字符串 | full | C | R | U | D |
|----------------------------|------|---|---|---|---|
| `dcos:adminrouter:ops:mesos`<br> 控制对 Mesos 管理节点 UI 和 API 的访问。| x | | | | |
| `dcos:adminrouter:ops:slave`<br>控制对 Mesos 代理节点 UI 和 API 的访问。| x | | | | |
| `dcos:mesos:agent:executor:app_id[:<service-or-job-group>]`<br> 控制对服务和作业的查看访问权限 [执行器信息](https://mesos.apache.org/documentation/latest/app-framework-development-guide/)。| | | x | | |
| `dcos:mesos:agent:framework:role[:<role-name>]`<br> 控制对在特定角色注册的 DC/OS 服务的查看访问权限。| | | x | | |
| `dcos:mesos:agent:sandbox:app_id[:<service-or-job-group>]`<br> 控制对 Mesos 沙盒的访问。| | | x | | |
| `dcos:mesos:agent:task:app_id[:<service-or-job-group>]`<br> 控制对任务信息的访问。| | | x | | |
| `dcos:mesos:master:executor:app_id[:<service-or-job-group>]`<br> 控制对 [执行器](https://mesos.apache.org/documentation/latest/app-framework-development-guide/) 服务和作业群组的访问。| | | x | | |
| `dcos:mesos:master:framework:role[:<role-name>]` <br> 控制按角色对在 [Mesos] 注册为框架的访问(https://mesos.apache.org/documentation/latest/roles/)。| | x | | | |
| `dcos:mesos:master:task:app_id[:<service-or-job-group>]`<br> 控制运行任务的访问权限。| | x | | | |


**前提条件：**

- DC/OS 和 DC/OS CLI [已安装](/cn/1.11/installing/)，您以超级用户身份登录。

# 通过 DC/OS Web 界面

### 创建群组和授予权限

1. 选择**组织**并选择**组**。

 ![新组](/cn/1.11/img/new-user-group.png)

 图 1. 新用户组

1. 新建一个组。

 ![生产组(/1.11/img/new-user-group-prod.png)

 图 2. 创建新组屏幕

1. 选择组名，并从**权限**选项卡上单击**添加权限**。

 ![为生产组添加权限](/cn/1.11/img/new-user-group-prod-permission.png)

 图 3. “添加权限”按钮

1. 单击**插入权限字符串**以切换对话框，然后粘贴到以下权限中，单击**添加权限**。

    ```bash
    dcos:adminrouter:ops:mesos full
    dcos:adminrouter:ops:slave full
    dcos:mesos:agent:executor:app_id:/prod-group/ read
    dcos:mesos:agent:framework:role:slave_public/ read
    dcos:mesos:agent:sandbox:app_id:/prod-group/ read
    dcos:mesos:agent:task:app_id:/prod-group/ read
    dcos:mesos:master:executor:app_id:/prod-group/ read
    dcos:mesos:master:framework:role:slave_public/ read
    dcos:mesos:master:task:app_id:/prod-group/ read
    ```

 ![添加权限](/cn/1.11/img/new-user-group-prod-permission-string.png)

 图 4. 权限字符串已添加

### 创建用户和授予权限

1. 选择**组织**并选择**用户**。选择现有用户或创建一个新用户。

 ![新用户](/cn/1.11/img/new-user-generic.png)

 图 5. 用户屏幕

1. 从**组成员**选项卡，在搜索框中输入并选择组名。这将向单个用户授予组权限。

 ![添加 Alice 到安全组](/cn/1.11/img/new-user-alice-add-group.png)

 图 6. 将用户添加到安全组

### 启动用户组中的应用程序

本节介绍如何在组中部署简单的应用程序。

1. 选择**服务** > **运行服务**。

1. 选择**单个容器**，并将您的服务定义为：

 - **服务 ID**指定 `/<gid>/<service-name>`。这会在服务组内创建一个服务。
 - **命令**指定 `sleep 1000000000`。
 - **容器运行时**选择**通用容器运行时 (UCR)**。

 ![定义嵌套服务](/cn/1.11/img/new-user-alice-service-group.png)

 图 7. 定义一个嵌套服务

1. 单击**查看并运行**和**运行服务**以完成安装。您现在应该能看到一个在组中运行的服务。

 ![在组中运行的服务](/cn/1.11/img/new-user-alice-service-done.png)

 图 8. 在组中运行的服务

现在您可以 [验证访问权限](#verifying-access)。

# 通过 IAM API

**先决条件：**
您必须 [获取根证书](/cn/1.11/security/ent/tls-ssl/get-cert/) 才能发布此部分的 curl 命令。

### 提示

- 服务资源通常包括 `/` 必须在 `curl` 请求中以 `%252F` 替换的字符，如下例所示。
- 使用 API 管理权限时，您必须在授予之前先创建权限。如果权限已存在，API 将返回提示信息，您可以继续分配权限。

### <a name="create-services"></a>创建用户组和启动应用程序

1. 使用以下命令创建一个 Marathon 组 (`<gid>`).

   ```bash
   curl -X POST --cacert dcos-ca.crt \
   $(dcos config show core.dcos_url)/service/marathon/v2/groups \
   -d '{"id":"<gid>"}' \
   -H "Content-type: application/json" \
   -H "Authorization: token=$(dcos config show core.dcos_acs_token)"
   ```

1. 使用以下命令部署一个简单的应用程序 (`<service-name>`) inside of `<gid>`.

   ```bash
   curl -X POST --cacert dcos-ca.crt \
   $(dcos config show core.dcos_url)/service/marathon/v2/apps \
   -d '{"id":"/<gid>/<service-name>","cmd":"sleep 1000000000"}' \
   -H "Content-type: application/json" \
   -H "Authorization: token=$(dcos config show core.dcos_acs_token)"
   ```

### <a name="grant-perms"></a>创建和授予权限

1. 使用以下命令为您的组创建权限 (`<gid>`).

   ```bash
   curl -X PUT --cacert dcos-ca.crt \
   -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
   -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:mesos \
   -d '{"description":"Grants access to the Mesos master API/UI and task details"}'
   curl -X PUT --cacert dcos-ca.crt \
   -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
   -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:slave \
   -d '{"description":"Grants access to the Mesos agent API/UI and task details such as logs"}'
   curl -X PUT --cacert dcos-ca.crt \
   -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
   -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:framework:role:slave_public \
   -d '{"description":"Grants access to register as or view Mesos master information about frameworks registered with the slave_public role"}'
   curl -X PUT --cacert dcos-ca.crt \
   -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
   -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:executor:app_id:%252F<gid> \
   -d '{"description":"Controls access to executors running inside <gid>"}'
   curl -X PUT --cacert dcos-ca.crt \
   -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
   -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:task:app_id:%252F<gid> \
   -d '{"description":"Grants access to the tasks on the Mesos master that are running inside of <gid>"}'
   curl -X PUT --cacert dcos-ca.crt \
   -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
   -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:framework:role:slave_public \
   -d '{"description":"Grants access to view Mesos agent information about frameworks registered with the slave_public role"}'
   curl -X PUT --cacert dcos-ca.crt \
   -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
   -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:executor:app_id:%252F<gid> \
   -d '{"description":"Grants access to executors running on the Mesos agent inside <gid>"}'
   curl -X PUT --cacert dcos-ca.crt \
   -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
   -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:task:app_id:%252F<gid> \
   -d '{"description":"Grants access to tasks running on the Mesos agent inside <gid>"}'
   curl -X PUT --cacert dcos-ca.crt \
   -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
   -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:sandbox:app_id:%252F<gid> \
   -d '{"description":"Grants access to the sandboxes on the Mesos agent inside <gid>"}'
   ```

1. 使用以下命令向用户授予权限 (`<username>`). These will allow her to view the task logs in `<gid>`.

   ```bash
   curl -X PUT --cacert dcos-ca.crt \
   -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:mesos/users/<username>/full
   curl -X PUT --cacert dcos-ca.crt \
   -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:slave/users/<username>/full
   curl -X PUT --cacert dcos-ca.crt \
   -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:framework:role:slave_public/users/<username>/read
   curl -X PUT --cacert dcos-ca.crt \
   -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:executor:app_id:%252F<gid>/users/<username>/read
   curl -X PUT --cacert dcos-ca.crt \
   -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:task:app_id:%252F<gid>/users/<username>/read
   curl -X PUT --cacert dcos-ca.crt \
   -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:framework:role:slave_public/users/<username>/read
   curl -X PUT --cacert dcos-ca.crt \
   -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:executor:app_id:%252F<gid>/users/<username>/read
   curl -X PUT --cacert dcos-ca.crt \
   -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:task:app_id:%252F<gid>/users/<username>/read
   curl -X PUT --cacert dcos-ca.crt \
   -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:sandbox:app_id:%252F<gid>/users/<username>/read
   ```  

现在您可以 [验证访问权限](#verifying-access)。

# 验证访问权限

1. 以用户身份登录到 DC/OS CLI。

   ```bash
   dcos auth login
   ```

1. 运行此命令以访问用户有权访问的服务的日志。

   ```bash
   dcos task log --follow <service-name>
   ```

 例如，如果您的服务名是 `alice-service`：

   ```bash
   dcos task log --follow alice-service
   ```

 输出应类似于：

   ```bash
   Executing pre-exec command '{"arguments":["mesos-containerizer","mount","--help=false","--operation=make-rslave","--path=\/"],"shell":false,"value":"\/opt\/mesosphere\/active\/mesos\/libexec\/mesos\/mesos-containerizer"}'
   Executing pre-exec command '{"shell":true,"value":"mount -n -t proc proc \/proc -o nosuid,noexec,nodev"}'
   Executing pre-exec command '{"arguments":["mount","-n","-t","ramfs","ramfs","\/var\/lib\/mesos\/slave\/slaves\/151ee739-d2b9-4024-8dbd-1345148774df-S1\/frameworks\/151ee739-d2b9-4024-8dbd-1345148774df-0001\/executors\/dev-group_alice-service.363072a5-65b5-11e7-a133-1a6ac27c9efe\/runs\/b46bea37-f3bb-4d9b-b0b9-00b1215c8404\/.secret-48e7541e-6634-4c25-9185-986255249439"],"shell":false,"value":"mount"}'
   ```

 如果您没有正确的权限，您将看到以下输出：

   ```bash
   You are not authorized to perform this operation
   ```
