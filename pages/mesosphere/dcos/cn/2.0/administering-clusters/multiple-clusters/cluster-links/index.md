---
layout: layout.pug
navigationTitle:  群集链接
title: 群集链接
menuWeight: 3
excerpt: 管理群集之间的链接
enterprise: true
render: mustache
model：/mesosphere/dcos/2.0/data.yml
---

群集链接是群集和另一群集之间的 **单向** 关系。

您可以使用 DC/OS CLI [dcos cluster link] (/mesosphere/dcos/2.0/cli/command-reference/dcos-cluster/dcos-cluster-link/) 和 [dcos cluster unlink](/mesosphere/dcos/2.0/cli/command-reference/dcos-cluster/dcos-cluster-unlink/) 命令以及 [cluster link API](/mesosphere/dcos/2.0/administering-clusters/multiple-clusters/cluster-link-api/) 来添加和移除从一个群集到另一个群集的链接。设置链接后，您可以使用 CLI 或 UI 在群集之间轻松切换。如果已经使用 SSO 提供程序设置链接，您不需要提供凭证即可切换群集。

您必须以超级用户身份登录或具有相应的群集链接 [权限](/mesosphere/dcos/2.0/security/ent/perms-reference/#cluster-linker)以查看、添加和删除链接以及授予权限以查看链接的群集。


# 启用使用 SSO 访问群集链接

作为超级用户：

1. 配置 [OpenID IDP](/mesosphere/dcos/2.0/security/ent/sso/setup-openid/)。
    1. 确保在 Google Dev 控制台中的 **授权 JavaScript 源** 和 **授权重定向 URL** 字段中均提供两个群集 URL。
    1. 提供 OIDC 名称，如“google-idp”。
    1. 配置 OIDC 时，确保两个群集使用相同的 `Client-Id` 和 `Client-Secret`。
1. 为每个用户提供查看服务和链接群集的权限：

    1. 选择 **组织 -> 用户**。
    2. 选择用户。
    3. 单击 **添加权限**。
    4. 在右上方，单击 **插入权限字符串**。
    5. 粘贴权限：

        ```
        dcos:adminrouter:ops:mesos full
        dcos:adminrouter:ops:slave full
        dcos:adminrouter:service:marathon full
        dcos:service:marathon:marathon:services:/ full
        dcos:cluster:linker:* read
        ```

    6. 单击 **添加权限**。

# 添加群集链接

要添加指向另一个群集的链接，运行 `dcos cluster link` 命令，提供群集的 URL 以链接至：

```bash
dcos cluster link <dcos-url>
Choose the login method and provider to enable switching to this linked cluster::
1) Provider 1
2) Provider 2
(1-2):
```

# 查看链接的群集

要查看所有链接的群集，运行 `dcos cluster list` 命令。如果群集已链接，但未设置，其状态为 `UNCONFIGURED`。如果群集已链接和附加，其状态为 `AVAILABLE`。另请参阅 [查看连接的群集](/mesosphere/dcos/2.0/administering-clusters/multiple-clusters/cluster-connections/)。

# 删除群集的链接

要删除链接，运行`dcos cluster unlink` 命令并提供已链接群集的 **名称** 或 **ID**。例如：

```bash
dcos cluster unlink <linked-cluster>
```

# 切换群集

您可以使用 CLI 或 UI 在链接的群集之间切换。使用 CLI 切换群集时，新群集将成为 CLI 的活动群集。使用 UI 切换群集时，新群集将成为您在 UI 中看到的群集。如果在 CLI 中切换群集，它不会更改 UI 中的群集；同样，在 UI 中切换，不会影响 CLI 中附加的群集。

### 从 DC/OS CLI 切换到链接的群集

运行 `dcos cluster attach` 命令并提供链接群集的名称或 ID：

```bash
dcos cluster attach <linked-cluster>
```

要运行 `dcos cluster list`，`<linked-cluster>` 的名称旁就会有一个星号。

### 从 DC/OS UI 切换到链接的群集

1. 从左侧导航菜单，选择 **群集 > 链接的群集**。

    ![链接的群集链接](/mesosphere/dcos/2.0/img/GUI-Cluster-Linked-Clusters-Tab-Link.png)

    图 1 - 链接的群集链接

1. 在 DC/OS UI 的右上角，单击群集名称右侧的向下箭头。

    ![打开群集弹出窗口](/mesosphere/dcos/2.0/img/open-cluster-popup.png)

    图 2 - 打开群集菜单

1. 选择 **切换群集**。

    ![swi 集群](/mesosphere/dcos/2.0/img/switch-cluster-1-12.png)

    图 3 - 切换群集

1. 单击要切换到的群集名称。

    ![swi 链接的集群](/mesosphere/dcos/2.0/img/switch-linked-cluster.png)

    图 4 - 切换到链接的群集

#### 作为超级用户切换群集    
    
如果您以超级用户身份登录，则也可以在“链接的群集”选项卡中直接切换到链接的群集。

1. 选择 **群集 -> 链接的群集**。

1. 在最右边，点击垂直省略号，然后选择 **切换**。

   ![swi linked cluster2](/mesosphere/dcos/2.0/img/GUI-Linked-Clusters-Switch.png)

   图 5 - 切换到链接的群集


# 链接和切换群集示例

## 以超级用户操作员通过 CLI 链接群集

1. 使用 `dcos-user` 提供程序设置群集 `cluster-a` 。

    ```
    $ dcos cluster setup --provider=dcos-users https://cluster-a.us-west-2.elb.amazonaws.com
    ```
    响应请求您验证群集证书捆绑包中的指纹，其必须通过响应`yes`接受。
    CLI 提示提供超级用户凭证。提供凭证。

1. 使用 `dcos-user` 提供程序设置 `cluster-b`。

    ```
    $ dcos cluster setup --provider=dcos-users https://cluster-b.us-west-2.elb.amazonaws.com
    ```

    响应请求您验证群集证书捆绑包中的指纹，其必须通过响应`yes`接受。
    CLI 提示提供超级用户凭证。提供凭证。

1. 附加到群集 `cluster-a` 并列示。

    ```
    dcos cluster attach cluster-a
    dcos cluster list
          NAME                    CLUSTER ID                 STATUS   VERSION                                         URL
     cluster-b  34ddd64a-9301-40b1-bb6a-201ec55a0d80  AVAILABLE  1.12-dev   https://cluster-b.us-west-2.elb.amazonaws.com
    cluster-a*  584d3e8f-c5c2-4c86-b180-ff3c1f15b0d5  AVAILABLE  1.12-dev  https://cluster-a.us-west-2.elb.amazonaws.com
    ```

1. 从群集 `cluster-a` 链接到群集 `cluster-b`。

    ```
    dcos cluster link https://cluster-b.us-west-2.elb.amazonaws.com
    ```

    CLI 提示您选择用于切换的登录提供程序。

    ```
    Choose the login method and provider to enable switching to this linked cluster:
    1) Log in using a standard DC/OS user account (username and password)
    2) Log in using OpenID Connect (Google IDP)
    (1-2):
    ```

1. 选择 Google IDP (2)。如果群集链接成功，则无响应。

    ```
    (1-2): 2
    ```

1. 附加到群集 `cluster-b`。

    ```
    $ dcos cluster attach cluster-b
    ```

1. 从群集 `cluster-b` 链接到群集 `cluster-a`。

    ```
    dcos cluster link https://cluster-a.us-west-2.elb.amazonaws.com
    ```

    CLI 提示选择用于切换的登录提供程序。

    ```
    Choose the login method and provider to enable switching to this linked cluster:
    1) Log in using a standard DC/OS user account (username and password)
    2) Log in using OpenID Connect (Google IDP)
    (1-2):
    ```

1. 选择 Google IDP (2)。

    ```
    (1-2): 2
    ```

1. 列出群集。

    ```
    dcos cluster list
          NAME                    CLUSTER ID                 STATUS   VERSION                                         URL
    cluster-b*  34ddd64a-9301-40b1-bb6a-201ec55a0d80  AVAILABLE  1.12-dev   https://cluster-b.us-west-2.elb.amazonaws.com
     cluster-a  584d3e8f-c5c2-4c86-b180-ff3c1f15b0d5  AVAILABLE  1.12-dev  https://cluster-a.us-west-2.elb.amazonaws.com
    ```


操作员设置链接后，您可使用 UI 或 CLI 在群集之间切换。

### 使用 UI 和 Google SSO 切换群集

您可以使用 Google OpenID 提供程序轻松切换到已设置的链接群集。


1. 作为外部用户，使用 Google 凭证登录群集的 DC/OS UI `cluster-a` 。

   ![google 登录](/mesosphere/dcos/2.0/img/google-login.png)

   图 6 - Google 登录

1. 在 DC/OS UI 的右上角，单击群集名称右侧的向下箭头。

    ![打开群集弹出窗口](/mesosphere/dcos/2.0/img/open-cluster-popup.png)

    图 7 - 切换群集

1. 单击 **切换群集**。


### 使用 CLI 和 Google SSO 切换群集

您可以使用 Google OpenID 提供程序轻松切换到已设置的链接群集。

1. 列出身份验证提供程序。

    ```
    dcos auth list-providers https://cluster-a.us-west-2.elb.amazonaws.com
    PROVIDER ID    AUTHENTICATION TYPE
    dcos-services  Log in using a DC/OS service user account (username and private key)
    dcos-users     Log in using a standard DC/OS user account (username and password)
    google-idp     Log in using OpenID Connect (Google IDP)
    ```

1. 使用 Google IDP 设置群集。

    ```
    dcos cluster setup --provider=google-id https://cluster-a.us-west-2.elb.amazonaws.com
    ```

    响应请求您验证群集证书捆绑包中的指纹，其必须通过响应`yes`接受。

1. 从浏览器复制认证令牌并粘贴到终端。

1. 列出群集。设置群集显示为“可用”并且已附加，之前链接的群集显示为“未配置”。

    ```
    dcos cluster list
          NAME                    CLUSTER ID                  STATUS     VERSION                                         URL
     cluster-b  34ddd64a-9301-40b1-bb6a-201ec55a0d80  UNCONFIGURED  1.13-dev   https://cluster-b.us-west-2.elb.amazonaws.com
    cluster-a*  584d3e8f-c5c2-4c86-b180-ff3c1f15b0d5   AVAILABLE    1.13-dev  https://cluster-a.us-west-2.elb.amazonaws.com
    ```

1. 附加到“未配置”群集。

    ```
    dcos cluster attach cluster-b
    ```

    响应请求您验证群集证书捆绑包中的指纹，其必须通过响应`yes`接受。

1. 从浏览器复制认证令牌并粘贴到终端。CLI 成功附加到群集`cluster-b`。

1. 列出群集以验证附加到 `cluster-b`。

    ```
    dcos cluster list
          NAME                    CLUSTER ID                 STATUS   VERSION                                         URL
    cluster-b*  34ddd64a-9301-40b1-bb6a-201ec55a0d80  AVAILABLE  1.13-dev   https://cluster-b.us-west-2.elb.amazonaws.com
     cluster-a  584d3e8f-c5c2-4c86-b180-ff3c1f15b0d5  AVAILABLE  1.13-dev  https://cluster-a.us-west-2.elb.amazonaws.com
    ```
