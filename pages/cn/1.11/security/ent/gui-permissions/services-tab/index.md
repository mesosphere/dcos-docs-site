---
layout: layout.pug
navigationTitle: 授予对 Services 选项卡的访问权限
title: 授予对 Services 选项卡的访问权限
menuWeight: 10
excerpt: 授予对 Services 选项卡的访问权限

enterprise: true
---



您可以授予用户访问**Services**选项卡的权限。新用户默认没有权限。

**提示：**此过程可授予访问**Services**选项卡的全部用户权限。如果您正在以 `strict` 或 `permissive` [安全模式](/cn/1.11/security/ent/#security-modes) 运行并希望配置细粒度用户访问权限，请参阅 [文档](/cn/1.11/deploying-services/service-groups/)。

# <a name="services-access-via-ui"></a>使用 GUI 授予访问权限

**先决条件：**

- 不具有 `dcos:superuser` [权限](/cn/1.11/security/ent/users-groups/) 的 DC/OS 用户账户。

1. 以具有 `dcos:superuser` 权限的用户身份登录 DC/OS GUI。

 ![登录](/cn/1.11/img/gui-installer-login-ee.gif)

 图 1. DC/OS Web 界面登录

1. 选择 **Organization** 并选择 **Users** 或 **Groups**。

1. 选择要授予权限的用户名或组名。

 ![添加 cory 权限](/cn/1.11/img/services-tab-user.png)

 图 2. 选择要授予权限的用户或组 

1. 从 **Permissions** 选项卡中，单击 **ADD PERMISSION**。

1. 单击 **INSERT PERMISSION STRING** 以切换对话框。

 ![添加权限](/cn/1.11/img/services-tab-user3.png)

 图 3. 插入权限字符串

1. 在 **Permissions Strings** 字段中复制并粘贴权限。根据您的 [安全模式] 选择权限字符串(/1.11/security/ent/#security-modes)，单击**添加权限**，然后单击**关闭**。

 ## 禁用

 ### 服务选项卡

    ```bash
    dcos:adminrouter:service:marathon full
    ```

 ### 服务任务

    ```bash
    dcos:adminrouter:ops:mesos full
    ```

 ### 任务详情和日志

    ```bash
    dcos:adminrouter:ops:slave full
    ```

 ## 宽容

 ### 服务选项卡

    ```
    dcos:adminrouter:service:marathon full
    dcos:service:marathon:marathon:services:/ full
    ```

 ### 服务任务

    ```
    dcos:adminrouter:ops:mesos full
    ```

 ### 任务详情和日志

    ```
    dcos:adminrouter:ops:slave full
    ```

 ## 严格

 ### 服务选项卡

    ```
    dcos:adminrouter:service:marathon full
    dcos:service:marathon:marathon:services:/ full
    ```

 ### 服务任务

    ```
    dcos:adminrouter:ops:mesos full
    ```

 ### 任务详情和日志

    ```
    dcos:adminrouter:ops:slave full
    dcos:mesos:master:framework:role:slave_public read
    dcos:mesos:master:executor:app_id read
    dcos:mesos:master:task:app_id read
    dcos:mesos:agent:framework:role:slave_public read
    dcos:mesos:agent:executor:app_id read
    dcos:mesos:agent:task:app_id read
    dcos:mesos:agent:sandbox:app_id read
    ```

# <a name="services-access-via-api"></a>使用 API 授予访问权限

**先决条件：**

- 您必须[安装 DC/OS CLI](/cn/1.11/cli/install/) 并以超级用户身份登录。
- 如果您的 [安全模式](/cn/1.11/security/ent/#security-modes) 是 `permissive` 或 `strict`，则必须 [获取根证书](/cn/1.11/security/ent/tls-ssl/get-cert/) 才能发布此部分的 curl 命令。

**提示：**

- 服务资源通常包括 `/` 必须在 curl 请求中以 `%252F` 替换的字符，如下例所示。
- 使用 API 管理权限时，您必须在授予之前先创建权限。如果权限已存在，API 将返回提示信息，您可以继续分配权限。


## 禁用

### 授权对 DC/OS Services 选项卡的访问权限

1. 创建权限。

    ```bash
    curl -X PUT  \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    -H 'Content-Type: application/json' \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:service:marathon  \
    -d '{"description":"Grants access to the Services tab"}'
    ```

1. 向用户授予以下权限 `uid`。

    ```bash
    curl -X PUT  \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:service:marathon/users/<uid>/full
    ```

 **提示：** 要向组而不是向用户授予权限，应替换 `/users/<uid>` with `/groups/<gid>`.

### 授予对 DC/OS 服务任务详细信息和日志的访问权限

1. 创建权限。

    ```bash
    curl -X PUT  \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    -H 'Content-Type: application/json' \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:mesos  \
    -d '{"description":"Grants access to the Mesos master API/UI and task details"}'
    curl -X PUT  \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    -H 'Content-Type: application/json' \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:slave  \
    -d '{"description":"Grants access to the Mesos agent API/UI and task details such as logs"}'
    ```

1. 向用户授予以下权限 `uid`。

    ```bash
    curl -X PUT  \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:mesos/users/<uid>/full
    curl -X PUT  \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:slave/users/<uid>/full
    ```   

 **提示：** 要向组而不是向用户授予权限，应替换 `/users/<uid>` with `/groups/<gid>`.

## 宽容

### 授权对 DC/OS Services 选项卡的访问权限

1. 创建权限。

    ```bash
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    -H 'Content-Type: application/json' \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:service:marathon  \
    -d '{"description":"Grants access to the Services tab"}'
    ```

1. 向用户授予以下权限 `uid`。

    ```bash
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:service:marathon/users/<uid>/full
    ```

 **提示：** 要向组而不是向用户授予权限，应替换 `/users/<uid>` with `/groups/<gid>`.

### 授予对 DC/OS 服务任务详细信息和日志的访问权限

1. 创建权限。

    ```bash
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    -H 'Content-Type: application/json' \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:mesos  \
    -d '{"description":"Grants access to the Mesos master API/UI and task details"}'
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    -H 'Content-Type: application/json' \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:slave  \
    -d '{"description":"Grants access to the Mesos agent API/UI and task details such as logs"}'
    ```

1. 向用户授予以下权限 `uid`。

    ```bash
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:mesos/users/<uid>/full
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:slave/users/<uid>/full
    ```

 **提示：** 要向组而不是向用户授予权限，应替换 `/users/<uid>` with `/groups/<gid>`.

### 授予对 Services 选项卡中所有服务的访问权限

1. 创建权限。

    ```bash
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    -H 'Content-Type: application/json' \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:service:marathon:marathon:services:%252F  \
    -d '{"description":"Grants access to all services"}'
    ```

1. 向用户授予以下权限 `uid`。

    ```bash
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:service:marathon:marathon:services:%252F/users/<uid>/full
    ```

 **提示：** 要向组而不是向用户授予权限，应替换 `/users/<uid>` with `/groups/<gid>`.

## 严格

### 授权对 DC/OS Services 选项卡的访问权限

1. 创建权限。

    ```bash
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    -H 'Content-Type: application/json' \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:service:marathon  \
    -d '{"description":"Grants access to the Services tab"}'
    ```

1. 向用户授予以下权限 `uid`。

    ```bash
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:service:marathon/users/<uid>/full
    ```

 **提示：** 要向组而不是向用户授予权限，应替换 `/users/<uid>` with `/groups/<gid>`.

### 授予对 DC/OS 服务任务详细信息和日志的访问权限

1. 创建权限。

    ```bash
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    -H 'Content-Type: application/json' \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:mesos  \
    -d '{"description":"Grants access to the Mesos master API/UI and task details"}'
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    -H 'Content-Type: application/json' \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:slave  \
    -d '{"description":"Grants access to the Mesos agent API/UI and task details such as logs"}'
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    -H 'Content-Type: application/json' \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:framework:role:slave_public  \
    -d '{"description":"Grants access to register as or view Mesos master information about frameworks registered with the slave_public role"}'
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    -H 'Content-Type: application/json' \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:executor:app_id  \
    -d '{"description":"Grants access to all executors on the Mesos master"}'
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    -H 'Content-Type: application/json' \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:task:app_id  \
    -d '{"description":"Grants access to all tasks on the Mesos master"}'
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    -H 'Content-Type: application/json' \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:framework:role:slave_public  \
    -d '{"description":"Grants access to view Mesos agent information about frameworks registered with the slave_public role"}'
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    -H 'Content-Type: application/json' \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:executor:app_id  \
    -d '{"description":"Grants access to all executors running on the Mesos agent"}'
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    -H 'Content-Type: application/json' \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:task:app_id  \
    -d '{"description":"Grants access to all tasks running on the Mesos agent"}'
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    -H 'Content-Type: application/json' \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:sandbox:app_id  \
    -d '{"description":"Grants access to the sandboxes on the Mesos agent"}'
    ```

1. 向用户授予以下权限 `uid`。

    ```bash
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:mesos/users/<uid>/full
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:slave/users/<uid>/full
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:framework:role:slave_public/users/<uid>/read
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:executor:app_id/users/<uid>/read
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:task:app_id/users/<uid>/read
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:framework:role:slave_public/users/<uid>/read
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:executor:app_id/users/<uid>/read
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:task:app_id/users/<uid>/read
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:sandbox:app_id/users/<uid>/read
    ```

 **提示：** 要向组而不是向用户授予权限，应替换 `/users/<uid>` with `/groups/<gid>`.

### 授予对 Services 选项卡中所有服务的访问权限

1. 创建权限。

    ```bash
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    -H 'Content-Type: application/json' \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:service:marathon:marathon:services:%252F  \
    -d '{"description":"Grants access to all services"}'
    ```

1. 向用户授予以下权限 `uid`。

    ```bash
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:service:marathon:marathon:services:%252F/users/<uid>/full
    ```

 **提示：** 要向组而不是向用户授予权限，应替换 `/users/<uid>` with `/groups/<gid>`.
