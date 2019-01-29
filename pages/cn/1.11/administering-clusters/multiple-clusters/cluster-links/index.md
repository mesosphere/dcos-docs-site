---
layout: layout.pug
navigationTitle: 集群链接
title: 集群链接
menuWeight: 3
excerpt: 管理集群之间的链接
enterprise: true
---

集群链接是集群和另一集群之间的 **单向** 关系。

您可以使用 DC/OS CLI [dcos cluster link](/cn/1.11/cli/command-reference/dcos-cluster/dcos-cluster-link/) 和 [dcos cluster unlink](/cn/1.11/cli/command-reference/dcos-cluster/dcos-cluster-unlink/) 命令和 [群集链接 API](/cn/1.11/administering-clusters/multiple-clusters/cluster-link-api/)添加和删除一个群集到另一个群集的链接。链接设置完成后，您可以使用 CLI 或 UI 轻松在群集之间切换。如果链接通过由 SSO 提供程序设置，您不需要提供凭证即可切换群集。

您必须以超级用户身份登录或具有相应的集群链接 [权限](/cn/1.11/security/ent/perms-reference/#cluster-linker)以查看、添加及删除链接和授予权限以查看链接的集群。


# 启用使用 SSO 访问集群链接

作为超级用户：

1. 配置 [OpenID IDP](/cn/1.11/security/ent/sso/setup-openid/)。
    1. 确保在 Google Dev 控制台中的**授权 Javascript 源** 和 **授权重定向 URI** 字段中均提供两个群集 URL。
    1. 提供 OIDC 名称，如“google-idp”。
    1. 配置 OIDC 时，确保两个群集使用相同的 `Client-Id` 和 `Client-Secret` 。
1. 为每个用户提供查看服务和已链接群集的权限：

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

# 将链接添加到集群

要添加指向另一个集群的链接，运行 `dcos cluster link` 命令，提供集群的 URL 以链接至：

```bash
dcos cluster link <dcos-url>
Choose the login method and provider to enable switching to this linked cluster::
1) Provider 1
2) Provider 2
(1-2):
```

# 查看已链接的集群

要查看所有已链接的集群，运行 `dcos cluster list` 命令。如果集群已链接，但未设置，其状态为 `UNCONFIGURED`。如果集群已链接和附加，其状态为 `AVAILABLE`。另请参阅 [查看连接的集群](/cn/1.11/administering-clusters/multiple-clusters/cluster-connections/)。

# 删除集群的链接

要删除链接，运行`dcos cluster unlink` 命令并提供已链接集群的 **名称** 或 **ID**。例如：

```bash
dcos cluster unlink <linked-cluster>
```

# 切换集群

您可以使用 CLI 或 UI 在已链接的集群之间切换。使用 CLI 切换集群时，新集群将成为 CLI 的活动集群。使用 UI 切换集群时，新集群将成为您在 UI 中看到的集群。如果在 CLI 中切换集群，它不会更改 UI 中的集群；同样，在 UI 中切换，不会影响 CLI 中附加的集群。

### 从 DC/OS CLI 切换到已链接的集群

运行 `dcos cluster attach` 命令并提供已链接集群的名称或 ID：

```bash
dcos cluster attach <linked-cluster>
```

如果您运行 `dcos cluster list`，`<linked-cluster>` ，其名称旁会有一个星号。

### 从 DC/OS UI 切换到已链接的集群

1. 在 DC/OS Web 界面的左上角，单击集群名称右侧的向下箭头。

 ![打开集群弹出窗口](/cn/1.11/img/open-cluster-popup.png)

 图 1. 打开集群菜单

1. 选择 **切换集群**。

 ![swi 集群](/cn/1.11/img/switch-cluster.png)

 图 2. 切换集群

1. 单击要切换到的集群名称。

 ![swi 已链接的集群](/cn/1.11/img/switch-linked-cluster.png)

 图 3. 切换到已链接的集群

如果您以超级用户身份登录，您也可以在“链接集群”选项卡中切换到已链接的集群。

1. 选择 **集群 -> 链接集群**。

1. 在切换目标集群的最右侧单击垂直椭圆，然后选择 **切换**。

 ![swi 已链接的集群2](/cn/1.11/img/switch-linked-cluster2.png)

 图 4. 切换到已链接的集群


# 链接和切换集群示例

## 以超级用户操作员通过 CLI 链接集群

1. 使用 `dcos-user` 提供程序设置集群 `cluster-a` 。

    ```
    $ dcos cluster setup --provider=dcos-users https://cluster-a.us-west-2.elb.amazonaws.com
    ```
 响应请求您验证集群证书捆绑包中的指纹，其必须通过响应`yes`接受。
 CLI 提示提供超级用户凭证。提供凭证。

1. 使用 `dcos-user` 提供程序设置 `cluster-b`。

    ```
    $ dcos cluster setup --provider=dcos-users https://cluster-b.us-west-2.elb.amazonaws.com
    ```

 响应请求您验证集群证书捆绑包中的指纹，其必须通过响应`yes`接受。
 CLI 提示提供超级用户凭证。提供凭证。

1. 附加到集群 `cluster-a` 并列示。

    ```
    dcos cluster attach cluster-a
    dcos cluster list
          NAME                    CLUSTER ID                 STATUS   VERSION                                         URL
     cluster-b  34ddd64a-9301-40b1-bb6a-201ec55a0d80  AVAILABLE  1.11-dev   https://cluster-b.us-west-2.elb.amazonaws.com
    cluster-a*  584d3e8f-c5c2-4c86-b180-ff3c1f15b0d5  AVAILABLE  1.11-dev  https://cluster-a.us-west-2.elb.amazonaws.com
    ```

1. 从集群 `cluster-a` 链接到集群 `cluster-b`。

    ```
    dcos cluster link https://cluster-b.us-west-2.elb.amazonaws.com
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

    <p class="message--note"><strong>注意: </strong> 如果群集链接成功，会没有回应。</p>

1. 附加到集群 `cluster-b`。

    ```
    $ dcos cluster attach cluster-b
    ```

1. 从集群 `cluster-b` 链接到集群 `cluster-a`。

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

1. 列出集群。

    ```
    dcos cluster list
          NAME                    CLUSTER ID                 STATUS   VERSION                                         URL
    cluster-b*  34ddd64a-9301-40b1-bb6a-201ec55a0d80  AVAILABLE  1.11-dev   https://cluster-b.us-west-2.elb.amazonaws.com
     cluster-a  584d3e8f-c5c2-4c86-b180-ff3c1f15b0d5  AVAILABLE  1.11-dev  https://cluster-a.us-west-2.elb.amazonaws.com
    ```


操作员设置链接后，您可使用 UI 或 CLI 在集群之间切换。

### 使用 UI 和 Google SSO 切换集群

您可以使用 Google OpenID 提供程序轻松切换到已设置的链接集群。


1. 作为外部用户，使用 Google 凭证登录集群的 DC/OS UI `cluster-a` 。

    ![google 登录](/cn/1.11/img/google-login.png)

    图 5. Google 登录

1. 从左上角，单击集群名称旁边的向下箭头。

    ![swi 集群](/cn/1.11/img/switch-cluster.png)

    图 6. 切换集群

1. 单击 **切换集群**。在“链接集群”窗格中，选择集群 `cluster-b`。集群 `cluster-b`的 UI 显示。


### 使用 CLI 和 Google SSO 切换集群

您可以使用 Google OpenID 提供程序轻松切换到已设置的链接集群。

1. 列出身份验证提供程序。

    ```
    dcos auth list-providers https://cluster-a.us-west-2.elb.amazonaws.com
    PROVIDER ID    AUTHENTICATION TYPE
    dcos-services  Log in using a DC/OS service user account (username and private key)
    dcos-users     Log in using a standard DC/OS user account (username and password)
    google-idp     Log in using OpenID Connect (Google IDP)
    ```

1. 使用 Google IDP 设置集群。

    ```
    dcos cluster setup --provider=google-id https://cluster-a.us-west-2.elb.amazonaws.com
    ```

 响应请求您验证集群证书捆绑包中的指纹，其必须通过响应`yes`接受。

1. 从浏览器复制认证令牌并粘贴到终端。

1. 列出集群。设置集群显示为“可用”并且已附加，之前链接的集群显示为“未配置”。

    ```
    dcos cluster list
          NAME                    CLUSTER ID                  STATUS     VERSION                                         URL
     cluster-b  34ddd64a-9301-40b1-bb6a-201ec55a0d80  UNCONFIGURED  1.11-dev   https://cluster-b.us-west-2.elb.amazonaws.com
    cluster-a*  584d3e8f-c5c2-4c86-b180-ff3c1f15b0d5   AVAILABLE    1.11-dev  https://cluster-a.us-west-2.elb.amazonaws.com
    ```

1. 附加到“未配置”集群。

    ```
    dcos cluster attach cluster-b
    ```

 响应请求您验证集群证书捆绑包中的指纹，其必须通过响应`yes`接受。

1. 从浏览器复制认证令牌并粘贴到终端。CLI 成功附加到集群`cluster-b`。

1. 列出集群以验证附加到 `cluster-b`。

    ```
    dcos cluster list
          NAME                    CLUSTER ID                 STATUS   VERSION                                         URL
    cluster-b*  34ddd64a-9301-40b1-bb6a-201ec55a0d80  AVAILABLE  1.11-dev   https://cluster-b.us-west-2.elb.amazonaws.com
     cluster-a  584d3e8f-c5c2-4c86-b180-ff3c1f15b0d5  AVAILABLE  1.11-dev  https://cluster-a.us-west-2.elb.amazonaws.com
    ```
