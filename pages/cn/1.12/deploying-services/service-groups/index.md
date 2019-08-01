---
layout: layout.pug
navigationTitle: 授权访问服务和组
title: 授权访问服务和组
menuWeight: 3
excerpt: 使用 Web 界面或 CLI 对服务实施细粒度用户访问

enterprise: true
---

可以使用 DC/OS Web 界面、[API](/mesosphere/dcos/security/ent/iam-api/) 或 CLI，对服务实施细粒度用户访问 。

[Marathon 权限](/mesosphere/dcos/security/ent/perms-reference/#marathon-metronome) 帮助您按照服务或服务组，限制用户对服务的访问。该部分为您介绍实现这一切的步骤。

[Marathon 权限](/mesosphere/dcos/security/ent/perms-reference/#marathon-metronome) 和 [Mesos 权限](/mesosphere/dcos/security/ent/perms-reference/#mesos) 的服务名称、工作名称、服务组或作业组没有区别。因此，您的命名必须是唯一的。

**先决条件：**

- 必须 [安装 DC/OS CLI](/mesosphere/dcos/cli/install/) 并以超级用户登户身份登录。
- 用于分配权限的[用户帐户](/mesosphere/dcos/security/ent/users-groups/)。

# <a name="root-service"></a>授权访问服务

## <a name="root-service-ui"></a>通过 DC/OS Web 界面

1. 以具有 `superuser` 权限的用户身份登录 DC/OS Web 界面。

      ![登录](/mesosphere/dcos/1.12/img/LOGIN-EE-Modal_View-1_12.png)

      图 1. DC/OS Web 界面登录画面。

1. 选择**组织**，然后选择**用户**或**组**。

1. 选择要授予权限的用户名或组名。

      ![添加 cory 权限](/mesosphere/dcos/1.12/img/GUI-Organization-Users-Users_List_View_w_Users-1_12.png)

      图 2. 选择要授予权限的用户

1. 在**权限**选项卡上，单击**添加权限**。

1. 单击**插入权限字符串**以切换对话框。

1. 在**权限字符串**字段中复制并粘贴权限。根据您的[安全模式]选择权限字符串(/security/ent/#security-modes)。

      ![添加权限](/mesosphere/dcos/1.12/img/GUI-Organization-Users-User_Alice_Add_Gen_Perms-1_12.png)

      图 3. 复制和粘贴权限字符串。

 ### 宽容

 - **DC/OS 服务访问：**

      指定您的服务（`<service-name>`）和操作（`<action>`）。操作可以是 `create`、 `read`、 `update`、`delete` 或 `full`。若要允许多个操作，请使用逗号分隔它们，例如: `dcos:service:marathon:marathon:services:/<service-name> read,update`。

      ```bash
      dcos:adminrouter:service:marathon full
      dcos:service:marathon:marathon:services:/<service-name> <action>
      ```
 - **DC/OS 服务任务和日志：**

      ```bash
      dcos:adminrouter:ops:slave full
      ```

 ### 严格

 - **DC/OS 服务访问：**

      指定您的服务（`<service-name>`）和操作（`<action>`）。操作可以是 `create`、 `read`、 `update`、`delete` 或 `full`。若要允许多个操作，请使用逗号分隔它们，例如: `dcos:service:marathon:marathon:services:/<service-name> read,update`。

      ```bash
      dcos:adminrouter:service:marathon full
      dcos:service:marathon:marathon:services:/<service-name> <action>
      ```
 - **DC/OS 服务任务和日志：**

      ```bash
      dcos:adminrouter:ops:slave full
      dcos:mesos:agent:executor:app_id:/<service-name> read
      dcos:mesos:agent:framework:role:slave_public read
      dcos:mesos:agent:sandbox:app_id:/<service-name> read
      dcos:mesos:agent:task:app_id:/<service-name> read
      dcos:mesos:master:executor:app_id:/<service-name> read
      dcos:mesos:master:framework:role:slave_public read
      dcos:mesos:master:task:app_id:/<service-name> read       
      ```

单击 **ADD PERMISSIONS**，然后单击 **Close**。

## <a name="root-service-cli"></a>通过 CLI

**先决条件：**

- 必须 [安装 DC/OS CLI](/mesosphere/dcos/cli/install/) 并以超级用户登户身份登录。

- 向组而不是用户授予权限，将 `users grant <uid>` 替换为 `groups grant <gid>`。

### 宽容

- **DC/OS 服务访问：**

针对特定服务 (`<service-name>`) 向用户授予以下权限 `uid`。

```bash
dcos security org users grant <uid> dcos:adminrouter:service:marathon full
dcos security org users grant <uid> dcos:service:marathon:marathon:services:/<service-name> full --description "Controls access to a service or service group <service-name>"
```

- **DC/OS 服务任务和日志：**

向用户授予以下权限 `uid`。

```bash
dcos security org users grant <uid> dcos:adminrouter:ops:mesos full
dcos security org users grant <uid> dcos:adminrouter:ops:slave full
```

### 严格

- **DC/OS 服务访问：**

针对特定服务 (`<service-name>`) 向用户授予以下权限 `uid`。

```bash
dcos security org users grant <uid> dcos:adminrouter:service:marathon full
dcos security org users grant <uid> dcos:service:marathon:marathon:services:/<service-name> full --description "Controls access to a service or service group <service-name>"
```

- **DC/OS 服务任务和日志：**

针对特定服务 (`<service-name>`) 向用户授予以下权限 `uid`。

```bash
dcos security org users grant <uid> dcos:adminrouter:ops:mesos full
dcos security org users grant <uid> dcos:adminrouter:ops:slave full
dcos security org users grant <uid> dcos:mesos:agent:executor:app_id:/<service-name> read --description "Controls access to executors of a service, job, service group, or job group named <service-name>"
dcos security org users grant <uid> dcos:mesos:agent:framework:role:slave_public read --description "Controls access to information about frameworks registered under the slave_public role"
dcos security org users grant <uid> dcos:mesos:agent:sandbox:app_id:/<service-name> read --description "Controls access to the sandbox data of a service, job, service group, or job group named <service-name>"
dcos security org users grant <uid> dcos:mesos:agent:task:app_id:/<service-name> read --description "Controls access to tasks of a service, job, service group, or job group named <service-name>"
dcos security org users grant <uid> dcos:mesos:master:executor:app_id:/<service-name> read --description "Controls access to executors running inside a service, job, service group, or job group named <service-name>"
dcos security org users grant <uid> dcos:mesos:master:framework:role:slave_public read --description "Controls access to frameworks registered with the slave_public role"
dcos security org users grant <uid> dcos:mesos:master:task:app_id:/<service-name> read --description "Controls access to tasks of a service, job, service group, or job group named <service-name>"
```

# <a name="service-in-group"></a>授权访问服务组中的服务

## <a name="service-in-group-ui"></a>通过 DC/OS Web 界面

1. 以具有 `superuser` 权限的用户身份登录 DC/OS Web 界面。

      ![登录](/mesosphere/dcos/1.12/img/LOGIN-EE-Modal_View-1_12.png)

      图 3. DC/OS Web 界面登录画面。

1. 选择**组织**，然后选择**用户**或**组**。

1. 选择要授予权限的用户名或组名。

      ![添加 cory 权限](/mesosphere/dcos/1.12/img/GUI-Organization-Users-Users_List_View_w_Users-1_12.png)

      图 4. 选择要授予权限的用户

1. 在**权限**选项卡上，单击**添加权限**。

1. 单击**插入权限字符串**以切换对话框。

      ![添加权限](/mesosphere/dcos/1.12/img/GUI-Organization-Users-User_Alice_Add_Gen_Perms-1_12.png)

      图 5. 添加权限

1. 在**权限字符串**字段中复制并粘贴权限。根据您的[安全模式]选择权限字符串(/security/ent/#security-modes)。

 ### 宽容

 - **DC/OS 服务访问：**

指定您的服务（`<service-name>`）、组（`<gid>`）和操作（`<action>`）。操作可以是 `create`、 `read`、 `update`、`delete` 或 `full`。若要允许多个操作，请使用逗号分隔它们，例如: `dcos:service:marathon:marathon:services:/<service-name> read,update`。

```bash
dcos:adminrouter:service:marathon full
dcos:service:marathon:marathon:services:/<gid>/<service-name> <action>
```

- **DC/OS 服务任务和日志：**

```bash
dcos:adminrouter:ops:mesos full
dcos:adminrouter:ops:slave full
```

 ### 严格

 - **DC/OS 服务访问：**

指定您的服务（`<service-name>`）、组（`<gid>`）和操作（`<action>`）。操作可以是 `create`、 `read`、 `update`、`delete` 或 `full`。若要允许多个操作，请使用逗号分隔它们，例如: `dcos:service:marathon:marathon:services:/<service-name> read,update`。

```bash
dcos:adminrouter:service:marathon full
dcos:service:marathon:marathon:services:/<gid>/<service-name> <action>
```

- **DC/OS 服务任务和日志：**

```bash
dcos:adminrouter:ops:mesos full
dcos:adminrouter:ops:slave full
dcos:mesos:agent:executor:app_id:/<gid>/<service-name> read
dcos:mesos:agent:framework:role:slave_public read
dcos:mesos:agent:sandbox:app_id:/<gid>/<service-name> read
dcos:mesos:agent:task:app_id:/<gid>/<service-name> read
dcos:mesos:master:executor:app_id:/<gid>/<service-name> read
dcos:mesos:master:framework:role:slave_public read
dcos:mesos:master:task:app_id:/<gid>/<service-name> read
```

单击 **ADD PERMISSIONS**，然后单击 **Close**。

## <a name="service-in-group-cli"></a>通过 CLI

**先决条件：**

- 必须 [安装 DC/OS CLI](/mesosphere/dcos/cli/install/) 并以超级用户登户身份登录。

**提示：**

- 向组而不是用户授予权限，将 `users grant <uid>` 替换为 `groups grant <gid>`。

### 宽容

- **DC/OS 服务访问：**

针对特定服务 (`<service-name>`) 向用户授予以下权限 `uid`。

```bash
dcos security org users grant <uid> dcos:adminrouter:service:marathon full
dcos security org users grant <uid> dcos:service:marathon:marathon:services:/group/<service-name> full --description "Controls access to a service or service group <service-name> inside a group called group"
```

- **DC/OS 服务任务和日志：**

向用户授予以下权限 `uid`。

```bash
dcos security org users grant <uid> dcos:adminrouter:ops:mesos full
dcos security org users grant <uid> dcos:adminrouter:ops:slave full
```

### 严格

- **DC/OS 服务访问：**

1. 向用户授予以下权限 `uid`。

```bash
dcos security org users grant <uid> dcos:adminrouter:service:marathon full
dcos security org users grant <uid> dcos:service:marathon:marathon:services:/group/<service-name> full --description "Controls access to a service or service group <service-name> inside a group called group"
```

- **DC/OS 服务任务和日志：**

1. 针对特定服务 (`<service-name>`) 向用户授予以下权限 `uid`。

```bash
dcos security org users grant <uid> dcos:adminrouter:ops:mesos full
dcos security org users grant <uid> dcos:adminrouter:ops:slave full
dcos security org users grant <uid> dcos:mesos:agent:executor:app_id:/group/<service-name> read --description "Controls access to executors of a service, job, service group, or job group named <service-name> inside the group group"
dcos security org users grant <uid> dcos:mesos:agent:framework:role:slave_public read --description "Controls access to information about frameworks registered under the slave_public role"
dcos security org users grant <uid> dcos:mesos:agent:sandbox:app_id:/group/<service-name> read --description "Controls access to the sandbox data of a service, job, service group, or job group named <service-name> inside the group group"
dcos security org users grant <uid> dcos:mesos:agent:task:app_id:/group/<service-name> read --description "Controls access to tasks of a service, job, service group, or job group named <service-name> inside the group group"
dcos security org users grant <uid> dcos:mesos:master:executor:app_id:/group/<service-name> read --description "Controls access to executors running inside a service, job, service group, or job group named <service-name>"
dcos security org users grant <uid> dcos:mesos:master:framework:role:slave_public read --description "Controls access to frameworks registered with the slave_public role"
dcos security org users grant <uid> dcos:mesos:master:task:app_id:/group/<service-name> read --description "Controls access to tasks of a service, job, service group, or job group named <service-name>"
```

# <a name="service-group"></a>授予用户对服务组的访问权限

## <a name="service-group-ui"></a>通过 DC/OS Web 界面

1. 以具有 `superuser` 权限的用户身份登录 DC/OS Web 界面。

      ![登录](/mesosphere/dcos/1.12/img/LOGIN-EE-Modal_View-1_12.png)

      图 5. DC/OS Web 界面登录画面。

1. 选择**组织**，然后选择**用户**或**组**。

1. 选择要授予权限的用户名或组名。

      ![添加 cory 权限](/mesosphere/dcos/1.12/img/GUI-Organization-Users-Users_List_View_w_Users-1_12.png)

      图 6. 选择要授予权限的用户

1. 在**权限**选项卡上，单击**添加权限**。

1. 单击**插入权限字符串**以切换对话框。

      ![添加权限](/mesosphere/dcos/1.12/img/GUI-Organization-Users-User_Alice_Add_Gen_Perms-1_12.png)

      图 7. 添加权限

1. 在**权限字符串**字段中复制并粘贴权限。根据您的[安全模式](/mesosphere/dcos/security/ent/#security-modes)选择权限字符串。

### 宽容

- **DC/OS 组访问：**

指定您的组（`<gid>`）和操作（`<action>`）。操作可以是 `create`、 `read`、 `update`、`delete` 或 `full`。若要允许多个操作，请使用逗号分隔它们，例如: `dcos:service:marathon:marathon:services:/<service-name> read,update`。

```bash
dcos:adminrouter:service:marathon full
dcos:service:marathon:marathon:services:/<gid> <action>
```

- **组任务和日志：**

```bash
dcos:adminrouter:ops:mesos full
dcos:adminrouter:ops:slave full
```

### 严格

- **DC/OS 组访问：**

指定您的组（`<gid>`）和操作（`<action>`）。操作可以是 `create`、 `read`、 `update`、`delete` 或 `full`。若要允许多个操作，请使用逗号分隔它们，例如: `dcos:service:marathon:marathon:services:/<service-name> read,update`。

```bash
dcos:adminrouter:service:marathon full
dcos:service:marathon:marathon:services:/<gid> <action>
```

- **组任务和日志：**

```bash
dcos:adminrouter:ops:mesos full
dcos:adminrouter:ops:slave full
dcos:mesos:agent:executor:app_id:/<gid> read
dcos:mesos:agent:framework:role:slave_public read
dcos:mesos:agent:sandbox:app_id:/<gid> read
dcos:mesos:agent:task:app_id:/<gid> read
dcos:mesos:master:executor:app_id:/<gid> read
dcos:mesos:master:framework:role:slave_public read
dcos:mesos:master:task:app_id:/<gid> read
```

单击 **ADD PERMISSIONS**，然后单击 **Close**。

## <a name="service-group-cli"></a>通过 CLI

**先决条件：**

- 必须 [安装 DC/OS CLI](/mesosphere/dcos/cli/install/) 并以超级用户登户身份登录。

**提示：**

- 向组而不是用户授予权限，将 `users grant <uid>` 替换为 `groups grant <gid>`。

### 宽容

- **DC/OS 组访问：**

向用户授予以下权限 `uid`。

```bash
dcos security org users grant <uid> dcos:adminrouter:service:marathon full
dcos security org users grant <uid> dcos:service:marathon:marathon:services:/group full --description "Controls access to a service, job, service group, or job group named group"
```

- **组任务和日志：**

向用户授予以下权限 `uid`。

```bash
dcos security org users grant <uid> dcos:adminrouter:ops:mesos full
dcos security org users grant <uid> dcos:adminrouter:ops:slave full
```

### 严格

- **DC/OS 组访问：**

向用户授予以下权限 `uid`。

```bash
dcos security org users grant <uid> dcos:adminrouter:service:marathon full
dcos security org users grant <uid> dcos:service:marathon:marathon:services:/group full --description "Controls access to a service, job, service group, or job group named group"
```

- **组任务和日志：**

向用户授予以下权限 `uid`。

```bash
dcos security org users grant <uid> dcos:adminrouter:ops:mesos full
dcos security org users grant <uid> dcos:adminrouter:ops:slave full
dcos security org users grant <uid> dcos:mesos:agent:executor:app_id:/group read --description "Controls access to executors of a service, job, service group, or job group named group"
dcos security org users grant <uid> dcos:mesos:agent:framework:role:slave_public read --description "Controls access to information about frameworks registered under the slave_public role"
dcos security org users grant <uid> dcos:mesos:agent:sandbox:app_id:/group read --description "Controls access to the sandbox data of a service, job, service group, or job group named group"
dcos security org users grant <uid> dcos:mesos:agent:task:app_id:/group read --description "Controls access to tasks of a service, job, service group, or job group named group"
dcos security org users grant <uid> dcos:mesos:master:executor:app_id:/group read --description "Controls access to executors running inside a service, job, service group, or job group named group"
dcos security org users grant <uid> dcos:mesos:master:framework:role:slave_public read --description "Controls access to frameworks registered with the slave_public role"
dcos security org users grant <uid> dcos:mesos:master:task:app_id:/group read --description "Controls access to tasks of a service, job, service group, or job group named group"
```
