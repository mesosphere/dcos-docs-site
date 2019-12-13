---
layout: layout.pug
navigationTitle: 授予访问“网络”选项卡的权限
title: 授予访问“网络”选项卡的权限
menuWeight: 40
excerpt: 授予访问“网络”选项卡的权限

enterprise: true
---


您可以授予用户访问**网络**选项卡的权限。新用户默认没有权限。

<p class="message--note"><strong>注意: </strong>此过程可授予访问这个屏幕选项卡的全部用户权限。如果您正在以 <tt>strict</tt> 或 <tt>permissive</tt> <a href="/mesosphere/dcos/cn/1.11/security/ent/#security-modes">安全模式</a> 运行并希望配置细粒度用户访问权限，请参阅 <a href="/mesosphere/dcos/cn/1.11/deploying-services/service-groups/">文档</a>。</p>

## <a name="network-access-via-ui"></a>使用 GUI 授予访问权限

**先决条件：**

- 不具有 `dcos:superuser` [权限](/mesosphere/dcos/cn/1.11/security/ent/users-groups/) 的 DC/OS 用户账户。

1. 以具有 `superuser` 权限的用户身份登录 DC/OS GUI。

 ![登录](/mesosphere/dcos/cn/1.11/img/gui-installer-login-ee.gif)

 图 1. DC/OS Web 界面登录

1. 选择 **Organization** 并选择 **Users** 或 **Groups**。

1. 选择要授予权限的用户名或组名。

 ![添加 cory 权限](/mesosphere/dcos/cn/1.11/img/services-tab-user.png)

 图 2. 选择要授予权限的用户或组


1. 从 **Permissions** 选项卡中，单击 **ADD PERMISSION**。

1. 单击 **INSERT PERMISSION STRING** 以切换对话框。

 ![添加权限](/mesosphere/dcos/cn/1.11/img/services-tab-user3.png)

 图 3. 插入权限字符串

1. 在 **Permissions Strings** 字段中复制并粘贴权限。根据您的 [安全模式](/mesosphere/dcos/cn/1.11/security/ent/#security-modes) 选择权限字符串，单击**添加权限**，然后单击**关闭**。

## 禁用

```bash
dcos:adminrouter:ops:networking full
dcos:adminrouter:ops:mesos full
```

## 宽容

```bash
dcos:adminrouter:ops:networking full
dcos:adminrouter:ops:mesos full
```

## 严格

```bash
dcos:adminrouter:ops:networking full
dcos:adminrouter:ops:mesos full
```

## <a name="network-access-via-api"></a>使用 API 授予访问权限

**先决条件：**

- 您必须[安装 DC/OS CLI](/mesosphere/dcos/cn/1.11/cli/install/) 并以超级用户身份登录。
- 如果您的 [安全模式](/mesosphere/dcos/cn/1.11/security/ent/#security-modes) 是 `permissive` 或 `strict`，则必须 [获取根证书](/mesosphere/dcos/cn/1.11/security/ent/tls-ssl/get-cert/) 才能发布此部分的 curl 命令。

**提示：**

- 服务资源通常包括 `/` 必须在 curl 请求中以 `%252F` 替换的字符，如下例所示。
- 使用 API 管理权限时，您必须在授予之前先创建权限。如果权限已存在，API 将返回提示信息，您可以继续分配权限。

## 禁用

1. 创建权限。

    ```bash
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    -H 'Content-Type: application/json' \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:networking  \
    -d '{"description":"Grants access to the contents of the Network tab"}'
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    -H 'Content-Type: application/json' \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:mesos  \
    -d '{"description":"Grants access to the Mesos master API/UI and task details"}'
    ```

1. 向用户授予以下权限 `uid`。

    ```bash
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:networking/users/<uid>/full
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:mesos/users/<uid>/full
    ```

<p class="message--note"><strong>注意: </strong> 要向组而不是向用户授予权限，应替换 <tt>/users/<uid></tt> with <tt>/groups/<gid></tt>.</p>

## 宽容

1. 创建权限。

    ```bash
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    -H 'Content-Type: application/json' \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:networking  \
    -d '{"description":"Grants access to the contents of the Network tab"}'
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    -H 'Content-Type: application/json' \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:mesos  \
    -d '{"description":"Grants access to the Mesos master API/UI and task details"}'
    ```

1. 向用户授予以下权限 `uid`。

    ```bash
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:networking/users/<uid>/full
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:mesos/users/<uid>/full
    ```

<p class="message--note"><strong>注意: </strong> 要向组而不是向用户授予权限，应替换 <tt>/users/<uid></tt> with <tt>/groups/<gid></tt>.</p>

## 严格

1. 创建权限。

    ```bash
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    -H 'Content-Type: application/json' \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:networking  \
    -d '{"description":"Grants access to the contents of the Network tab"}'
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    -H 'Content-Type: application/json' \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:mesos  \
    -d '{"description":"Grants access to the Mesos master API/UI and task details"}'
    ```

1. 向用户授予以下权限 `uid`。

    ```bash
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:networking/users/<uid>/full
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:mesos/users/<uid>/full
    ```

<p class="message--note"><strong>注意: </strong> 要向组而不是向用户授予权限，应替换 <tt>/users/<uid></tt> with <tt>/groups/<gid></tt>.</p>
