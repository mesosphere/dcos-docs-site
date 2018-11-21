---
layout: layout.pug
navigationTitle: 为作业授予访问权限
title: 为作业授予访问权限
menuWeight: 200
excerpt: 使用 CLI 或 Web 界面为作业授予访问权限

enterprise: true
---

您可以使用 DC/OS Web 界面、CLI 或 [API](/cn/1.11/security/ent/iam-api/) 来实现对作业的细粒度用户访问。[Metronome 权限](/cn/1.11/security/ent/perms-reference/#marathon-metronome) 让您在每项作业或每个作业组上限制用户对作业的访问。该部分为您介绍实现这一切的步骤。

**前提条件：**

- 您必须[安装 DC/OS CLI](/cn/1.11/cli/install/) 并以超级用户身份登录。
- 用于分配权限的[用户帐户](/cn/1.11/security/ent/users-groups/)。

# <a name="job-group-access-via-ui"></a>通过 DC/OS Web 界面

1. 以具有 `superuser` 权限的用户身份登录 DC/OS Web 界面。

 ![登录](/cn/1.11/img/gui-installer-login-ee.gif)

 图 1. DC/OS Web 界面登录

1. 选择 **Organization** 并选择 **Users** 或 **Groups**。

1. 选择要授予权限的用户名或组名。

 ![添加 cory 权限](/cn/1.11/img/services-tab-user.png)

 图 2. 选择要添加权限的用户或组

1. 从 **Permissions** 选项卡中，单击 **ADD PERMISSION**。

1. 单击 **INSERT PERMISSION STRING** 以切换对话框。

 ![添加权限](/cn/1.11/img/services-tab-user3.png)

 图 3. 添加权限

1. 在 **Permissions Strings** 字段中复制并粘贴权限。根据您的[安全模式]选择权限字符串(/1.11/security/ent/#security-modes)。

 ### 已禁用

 - **DC/OS 作业访问权限：**

 指定作业组 (`<job-group>`), job name (`<job-name>`), and action (`<action>`). Actions can be either `create`, `read`, `update`, `delete`, or `full`. To permit more than one operation, use a comma to separate them, for example: `dcos:service:metronome:metronome:jobs:<job-group>/<job-name> read,update`。

       ```bash
       dcos:adminrouter:service:metronome full
       dcos:service:metronome:metronome:jobs:<job-group>/<job-name> <action>
       ```

 - **DC/OS 服务任务和日志：**

       ```bash
       dcos:adminrouter:ops:mesos full
       dcos:adminrouter:ops:slave full
       ```

 ### 宽容

 - **DC/OS 作业访问权限：**

 指定作业组 (`<job-group>`), job name (`<job-name>`), and action (`<action>`). Actions can be either `create`, `read`, `update`, `delete`, or `full`. To permit more than one operation, use a comma to separate them, for example: `dcos:service:metronome:metronome:jobs:<job-group>/<job-name> read,update`。

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

 指定作业组 (`<job-group>`), job name (`<job-name>`), and action (`<action>`). Actions can be either `create`, `read`, `update`, `delete`, or `full`. To permit more than one operation, use a comma to separate them, for example: `dcos:service:metronome:metronome:jobs:<job-group>/<job-name> read,update`。

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

1. 单击 **ADD PERMISSIONS**，然后单击 **Close**。


# <a name="job-group-access-via-cli"></a>通过 CLI

**前提条件：**

- 您必须[安装 DC/OS CLI](/cn/1.11/cli/install/) 并以超级用户身份登录。

**提示：**

- 向组而不是用户授予权限，用‘组授予’ <user-name>` with `替换‘用户授予’ <gid>`.

### 已禁用
此模式不提供细粒度控制。

### 宽容

- **DC/OS 作业访问权限：**

 1. 授予作业组的权限 (`<job-group>`) and job name (`<job-name>`).

        ```bash
        dcos security org users grant <user-name> adminrouter:service:metronome full --description "Controls access to Metronome services"
        dcos security org users grant <user-name> service:metronome:metronome:jobs:<job-group>/<job-name> full --description "Controls access to <job-group>/<job-name>"
        ```

- **DC/OS 服务任务和日志：**

 1. 授予用户权限 (`<user-name>`).

        ```bash
        dcos security org users grant <user-name> adminrouter:ops:mesos full --description "Grants access to the Mesos master API/UI and task details"
        dcos security org users grant <user-name> adminrouter:ops:slave full --description "Grants access to the Mesos agent API/UI and task details such as logs"
        ```   

### 严格

- **DC/OS 作业访问权限：**

 1. 授予作业组的权限 (`<job-group>`) and job name (`<job-name>`).

        ```bash
        dcos security org users grant <user-name> adminrouter:service:metronome full --description "Controls access to Metronome services"
        dcos security org users grant <user-name> service:metronome:metronome:jobs:<job-group>/<job-name> full --description "Controls access to <job-group>/<job-name>"
        ```

- **DC/OS 服务任务和日志：**

 1. 授予用户权限 (`<user-name>`) and group (`<job-group>`).

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
