---
layout: layout.pug
navigationTitle: 访问系统和组件日志
title: 访问系统和组件日志
menuWeight: 1
excerpt: 管理用户对系统和组件日志的访问
beta: true
enterprise: true
---

您可以限制用户对系统和组件日志的访问。

以下是查看系统和组件日志所需的 [权限](/mesosphere/dcos/1.12/security/ent/perms-reference/)：

| 权限字符串 | full | C | R | U | D |
|----------------------------|------|---|---|---|---|
| `dcos:adminrouter:ops:system-logs` <br>控制对 [系统日志 API] (/1.12/api/master-routes/#system) 的访问。| x | | | | |

**先决条件：**

- DC/OS 和 DC/OS CLI [已安装](/mesosphere/dcos/1.12/installing/)，您以超级用户身份登录。

# 通过 DC/OS Web 界面

### 创建用户和授予权限

1. 选择**组织**并选择**用户**。选择现有用户或创建一个新用户。

 ![新用户](/mesosphere/dcos/1.12/img/GUI-Organization-Users-View_w_AddUser_Tooltip-1_12.png)

 图 1. 新用户屏幕

1. 从**权限**选项卡，选择**添加权限**。

 ![为用户添加权限](/mesosphere/dcos/1.12/img/GUI-Organization-Users-User_Main_View.png)

 图 2. “添加权限”按钮

1. 单击**插入权限字符串**以切换对话框，并粘贴到以下权限中，单击**添加权限**。

    ```bash
    dcos:adminrouter:ops:system-logs full
    ```

 ![添加权限](/mesosphere/dcos/1.12/img/GUI-Organization-User-Add_Single_User_Perm_String-1_12.png)

 图 3. 权限字符串对话框

 **权限**选项卡现应当是这样的：

 ![prod-group permissions complete](/mesosphere/dcos/1.12/img/GUI-Organization-Users-User_View_w_Perm.png)

 图 4. 权限已添加

### <a name="verify-perms"></a>以用户身份登录到 CLI

1. 以用户身份登录到 DC/OS CLI。

   ```bash
   dcos auth login
   ```

1. 运行此命令以访问系统和组件日志。

   ```bash
   dcos node log --leader --component=dcos-mesos-master
   ```

 您应该能看到 Mesos 管理节点的日志。

 如果您没有正确的权限，您将看到以下输出：

   ```bash
   You are not authorized to perform this operation
   ```

# 通过 IAM API

**先决条件：**
您必须 [获取根证书](/mesosphere/dcos/1.12/security/ent/tls-ssl/get-cert/) 才能发布此部分的 curl 命令。

### 提示

- 服务资源通常包括 `/` 必须在 curl 请求中以 `%252F` 替换的字符，如下例所示。
- 使用 API 管理权限时，您必须在授予之前先创建权限。如果权限已存在，API 将返回提示信息，您可以继续分配权限。

### <a name="grant-perm"></a>创建和授予权限

1. 向用户授予权限 (`<username>`)。

   ```bash
   dcos security org users grant <username> dcos:adminrouter:ops:system-logs full --description "Grants access to system and component logs."
   ```

### <a name="verify-perms"></a>以用户身份登录到 CLI

1. 以用户身份登录到 DC/OS CLI。

   ```bash
   dcos auth login
   ```

1. 运行此命令以访问系统和组件日志。

   ```bash
   dcos node log --leader --component=dcos-mesos-master
   ```

 您应该能看到 Mesos 管理节点的日志。

 如果您没有正确的权限，您将看到以下输出：

   ```bash
   You are not authorized to perform this operation
   ```
