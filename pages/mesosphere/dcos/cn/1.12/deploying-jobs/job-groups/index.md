---
layout: layout.pug
navigationTitle: 授予对作业的访问权限
title: 授予对作业的访问权限
menuWeight: 200
excerpt: 使用 CLI 或 Web 界面授予对作业的访问权限

enterprise: true
---

您可以使用 DC/OS Web 界面、CLI 或 [API](/mesosphere/dcos/cn/1.12/security/ent/iam-api/) 来实现对作业的细粒度用户访问。[Metronome 权限](/mesosphere/dcos/cn/1.12/security/ent/perms-reference/#marathon-metronome) 让您可以在每项作业或每个作业组上限制用户对作业的访问。该部分为您介绍实现这一切的步骤。

**先决条件：**

- 必须 [安装 DC/OS CLI](/mesosphere/dcos/cn/1.12/cli/install/) 并以超级用户登户身份登录。
- 用于分配权限的[用户帐户](/mesosphere/dcos/cn/1.12/security/ent/users-groups/)。

# <a name="job-group-access-via-ui"></a>通过 DC/OS Web 界面

1. 以具有 `superuser` 权限的用户身份登录 DC/OS Web 界面。

 ![登录](/mesosphere/dcos/1.12/img/LOGIN-EE-Modal_View-1_12.png)

 图 1. DC/OS Web 界面登录

1. 选择**组织**，然后选择**用户**或**组**。

1. 选择要授予权限的用户名或组名。

      ![添加 cory 权限](/mesosphere/dcos/1.12/img/GUI-Organization-Users-Users_List_View_w_Users-1_12.png)

      图 2. 选择要添加权限的用户或组

1. 在**权限**选项卡上，单击**添加权限**。

1. 单击**插入权限字符串**以切换对话框。

      ![添加权限](/mesosphere/dcos/1.12/img/GUI-Organization-Users-User_Alice_Add_Gen_Perms-1_12.png)

      图 3. 添加权限

1. 在**权限字符串**字段中复制并粘贴权限。根据您的[安全模式](/mesosphere/dcos/cn/1.12/security/ent/#security-modes)选择权限字符串。

### 宽容

- **DC/OS 作业访问权限：**

指定您的作业组 (`<job-group>`)、作业名称 (`<job-name>`) 和操作 (`<action>`)。操作可以是 `create`、 `read`、 `update`、`delete` 或 `full`。若要允许多个操作，请使用逗号分隔它们，例如: `dcos:service:metronome:metronome:jobs:<job-group>/<job-name> read,update`。

```bash
dcos:adminrouter:service:metronome full
dcos:service:metronome:metronome:jobs:<job-group>/<job-name> <action>
```

- **DC/OS 服务任务和日志：**

```bash
dcos:adminrouter:ops:mesos full
dcos:adminrouter:ops:slave full
```

### 严格

- **DC/OS 作业访问权限：**

指定您的作业组 (`<job-group>`)、作业名称 (`<job-name>`) 和操作 (`<action>`)。操作可以是 `create`、 `read`、 `update`、`delete` 或 `full`。若要允许多个操作，请使用逗号分隔它们，例如: `dcos:service:metronome:metronome:jobs:<job-group>/<job-name> read,update`。

```bash
dcos:adminrouter:service:metronome full
dcos:service:metronome:metronome:jobs:<job-group>/<job-name> <action>
```

- **DC/OS 服务任务和日志：**

```bash
dcos:adminrouter:ops:mesos full
dcos:adminrouter:ops:slave full
dcos:mesos:master:framework:role:* read
dcos:mesos:master:executor:app_id:/<job-group>/<job-name> read
dcos:mesos:master:task:app_id:/<job-group>/<job-name> read
dcos:mesos:agent:framework:role:* read
dcos:mesos:agent:executor:app_id:/<job-group>/<job-name> read
dcos:mesos:agent:task:app_id:/<job-group>/<job-name> read
dcos:mesos:agent:sandbox:app_id:/<job-group>/<job-name> read
```       

单击 **ADD PERMISSIONS**，然后单击 **Close**。


# <a name="job-group-access-via-cli"></a>通过 CLI

**先决条件：**

- 必须 [安装 DC/OS CLI](/mesosphere/dcos/cn/1.12/cli/install/) 并以超级用户登户身份登录。

**提示：**

- 向组而不是用户授予权限，将 `users grant <user-name>` 替换为 `groups grant <gid>`。

### 宽容

- **DC/OS 作业访问权限：**

授予作业组（`<job-group>`）和作业名称（`<job-name>`）的权限。

```bash
dcos security org users grant <user-name> adminrouter:service:metronome full --description "Controls access to Metronome services"
dcos security org users grant <user-name> service:metronome:metronome:jobs:<job-group>/<job-name> full --description "Controls access to <job-group>/<job-name>"
```

- **DC/OS 服务任务和日志：**

授予用户权限 (`<user-name>`)。

```bash
dcos security org users grant <user-name> adminrouter:ops:mesos full --description "Grants access to the Mesos master API/UI and task details"
dcos security org users grant <user-name> adminrouter:ops:slave full --description "Grants access to the Mesos agent API/UI and task details such as logs"
```   

### 严格

- **DC/OS 作业访问权限：**

授予作业组（`<job-group>`）和作业名称（`<job-name>`）的权限。

```bash
dcos security org users grant <user-name> adminrouter:service:metronome full --description "Controls access to Metronome services"
dcos security org users grant <user-name> service:metronome:metronome:jobs:<job-group>/<job-name> full --description "Controls access to <job-group>/<job-name>"
```

- **DC/OS 服务任务和日志：**

向用户 (`<user-name>`) 和 (`<job-group>`) 授予权限。

```bash
dcos security org users grant <user-name> adminrouter:ops:mesos full --description "Grants access to the Mesos master API/UI and task details"
dcos security org users grant <user-name> adminrouter:ops:slave full --description "Grants access to the Mesos agent API/UI and task details such as logs"
dcos security org users grant <user-name> mesos:master:framework:role:* read --description "Controls access to frameworks registered with the Mesos default role"
dcos security org users grant <user-name> mesos:master:executor:app_id:/<job-group>/<job-name> read --description "Controls access to executors running inside <job-group>/<job-name>"
dcos security org users grant <user-name> mesos:master:task:app_id:/<job-group>/<job-name> read --description "Controls access to tasks running inside <job-group>/<job-name>"
dcos security org users grant <user-name> mesos:agent:framework:role:* read --description "Controls access to information about frameworks registered under the Mesos default role"
dcos security org users grant <user-name> mesos:agent:executor:app_id:/<job-group>/<job-name> read --description "Controls access to executors running inside <job-group>/<job-name>"
dcos security org users grant <user-name> mesos:agent:task:app_id:/<job-group>/<job-name> read --description "Controls access to tasks running inside <job-group>/<job-name>"
dcos security org users grant <user-name> mesos:agent:sandbox:app_id:/<gid>/ read --description "Controls access to the sandboxes of <job-group>/<job-name>"
```
