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

以下是查看系统和组件日志所需的 [权限](/cn/1.11/security/ent/perms-reference/)：

| 权限字符串 | full | C | R | U | D |
|----------------------------|------|---|---|---|---|
| `dcos:adminrouter:ops:system-logs` <br>控制对 [系统日志 API] 的访问(/1.11/api/master-routes/#system)。| x | | | | |

**前提条件：**

- DC/OS 和 DC/OS CLI [已安装](/cn/1.11/installing/)，您以超级用户身份登录。

# 通过 DC/OS Web 界面

### 创建用户和授予权限

1. 选择**组织**并选择**用户**。选择现有用户或创建一个新用户。

 ![新用户](/cn/1.11/img/new-user-generic.png)

 图 1. 新用户屏幕

1. 从**权限**选项卡，选择**添加权限**。

 ![为用户添加权限](/1.10/img/permission-user.png)

 图 2. “添加权限”按钮

1. 单击**插入权限字符串**以切换对话框，并粘贴到以下权限中，单击**添加权限**。

    ```bash
    dcos:adminrouter:ops:system-logs full
    ```

 ![添加权限](/cn/1.11/img/comp-log-perms.png)

 图 3. 权限字符串对话框

 **权限**选项卡现应当是这样的：

 ![prod-group permissions complete](/cn/1.11/img/comp-log-perms-done.png)

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
如果您的 [安全模式](/cn/1.11/security/ent/#security-modes) 是 `permissive` 或 `strict`，则必须 [获取根证书](/cn/1.11/security/ent/tls-ssl/get-cert/) 才能发布此部分的 curl 命令。

### 提示

- 服务资源通常包括 `/` 必须在 curl 请求中以 `%252F` 替换的字符，如下例所示。
- 使用 API 管理权限时，您必须在授予之前先创建权限。如果权限已存在，API 将返回提示信息，您可以继续分配权限。

### <a name="grant-perm"></a>创建和授予权限

1. 授予用户权限 (`<username>`).

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
