---
layout: layout.pug
navigationTitle:  授予访问“网络”选项卡的权限
title: 授予访问“网络”选项卡的权限
menuWeight: 40
excerpt: 授予访问“网络”选项卡的权限
render: mustache
model: /mesosphere/dcos/1.13/data.yml
enterprise: true
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->

您可以授予用户访问**网络**选项卡的权限。新用户默认没有权限。

<p class="message--note"><strong>注意：</strong>此过程可授予访问<strong>网络</strong>选项卡的全部用户权限。如欲配置细分用户访问权限，请参阅 <a href="/mesosphere/dcos/1.13/deploying-services/service-groups/">文档</a>。</p>

## <a name="network-access-via-ui"></a>使用 UI 授予访问权限

**前提条件：**

- 不具有 `dcos:superuser` [权限](/mesosphere/dcos/1.13/security/ent/users-groups/) 的 DC/OS 用户账户。

1. 以具有 `superuser` 权限的用户身份登录 DC/OS UI。

   ![登录](/mesosphere/dcos/1.13/img/LOGIN-EE-Modal_View-1_12.png)

    图 1. DC/OS Web 界面登录

1. 选择**组织**，然后选择**用户**或**组**。

1. 选择要授予权限的用户名或组名。

    ![添加 cory 权限](/mesosphere/dcos/1.13/img/GUI-Organization-Users-List_View-1_12.png)

    图 2. 选择要授予权限的用户或组

1. 在**权限**选项卡上，单击**添加权限**。

1. 单击**插入权限字符串**以切换对话框。

    ![添加权限](/mesosphere/dcos/1.13/img/services-tab-user3.png)

    图 3. 插入权限字符串

1. 在**权限字符串**字段中复制并粘贴权限。根据您的 [安全模式] 选择权限字符串(/mesosphere/dcos/1.13/security/ent/#security-modes)，单击**添加权限**，然后单击**关闭**。

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

**前提条件：**

- 必须 [安装 DC/OS CLI](/mesosphere/dcos/cn/1.13/cli/install/) 并以超级用户登户身份登录。
- 您必须 [获取根证书](/mesosphere/dcos/1.13/security/ent/tls-ssl/get-cert/)，才能发布此部分的 curl 命令。

**提示：**

- 服务资源通常包括 `/` 必须在 curl 请求中以 `%252F` 替换的字符，如下例所示。
- 使用 API 管理权限时，您必须在授予之前先创建权限。如果权限已存在，API 将返回提示信息，您可以继续分配权限。

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

1. 向用户授予以下特权 `uid`。

    ```bash
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:networking/users/<uid>/full
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:mesos/users/<uid>/full
    ```

<p class="message--note"><strong>注意：</strong>要向组而不是向用户授予权限，应将 <code>/users/"uid"</code> 替换为 <code>/groups/"gid"</code>。</p>

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

1. 向用户授予以下特权 `uid`。

    ```bash
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:networking/users/<uid>/full
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:mesos/users/<uid>/full
    ```

<p class="message--note"><strong>注意：</strong>要向组而不是向用户授予权限，应将 <code>/users/"uid"</code> 替换为 <code>/groups/"gid"</code>。</p>
