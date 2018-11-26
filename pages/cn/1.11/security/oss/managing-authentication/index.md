---
layout: layout.pug
navigationTitle: 管理身份认证
excerpt: 管理 DC/OS CLI 中的身份认证
title: 身份认证管理
menuWeight: 20
---

<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->


DC/OS 用户数据库通过在路径 `/dcos/users` 下 [znodes](https://zookeeper.apache.org/doc/r3.1.2/zookeeperProgrammers.html#sc-zkDataModel-znodes) 中的管理节点上运行而保留在 ZooKeeper 中。在 HTTP 授权标题中发送至 DC/OS 的令牌必须采用以下格式：`token=<token>`. In future versions `Bearer <token>` 还将受到支持 。

DC/OS 开源通过 CLI 命令提供安全管理；请参阅 [CLI 命令参考](/cn/1.11/cli/command-reference/dcos-auth/)。在 CLI 中，您可以对集群进行身份认证，甚至可以选择退出基于 Auth0 的身份认证。


## <a name="log-in-cli"></a>通过 DC/OS CLI 进行身份认证

仅 DC/OS CLI 版本 0.4.3 及更高版本支持身份认证。有关升级说明，请参阅[此处](/cn/1.11/cli/update/)。

DC/OS CLI 将令牌存储在运行 CLI 的用户主目录下的目录 `.dcos` 中的配置文件里。此令牌可与 `curl` 命令一起使用，以访问 DC/OS API，使用 `curl` 或 `wget`。例如，`curl -H 'Authorization: token=<token>' http://cluster`。

1. 在终端提示符下，使用以下命令对集群进行身份认证。

    ```bash
    dcos auth login
    ```

 以下是输出示例：

    ```bash
    Please go to the following link in your browser:

        https://<public-master-ip>/login?redirect_uri=urn:ietf:wg:oauth:2.0:oob

    Enter OpenID Connect ID Token:
    ```

1. 在终端提示符中复制 URL 并将其粘贴到浏览器中。

1. 单击与您首选的身份提供程序相对应的按钮。

 ![id 提供程序商列表](/cn/1.11/img/auth-login.png)

 图 1. 选择身份提供程序

1. 如果出现提示，请将凭据提供给身份提供程序。如果您在当前浏览器会话期间已经对身份提供程序进行了认证身份，则无需再次执行此操作。

 ![auth 登录令牌](/cn/1.11/img/auth-login-token.png)

 图 2. Auth 登录令牌

1. 单击 **Copy to Clipboard**。

1. 返回到终端提示符，并在提示时粘贴 OpenID Connect ID 令牌值。

1. 您应该收到以下消息。

    ```bash
    Login successful!
    ```

1. 要注销，请运行此命令：

```bash
dcos auth logout
```

## 身份认证选择退出

如果您正在进行[高级安装](/cn/1.11/installing/production/deploying-dcos/installation/)，则可以通过将此参数添加到配置文件 (`genconf/config.yaml`) 中选择退出基于 Auth0 的身份认证。

```yaml
oauth_enabled: 'false'
```
如需更多信息，请参阅配置[文档](/cn/1.11/installing/production/advanced-configuration/configuration-reference/)。

如果您正在 [AWS](cn/1.11/install/evaluation/cloud-installation/aws/) 上进行云安装，则可以在**指定详细信息**步骤上将 `OAuthEnabled` 选项设置为 `false` 以禁用身份认证。

如果您在 [Azure](/cn/1.11/installing/evaluation/cloud-installation/azure/) 上进行云安装，则无法禁用身份认证。此选项将在未来 版本中与其他选项一起添加以自定义身份认证的选项。

请注意，如果您已经安装了集群并希望就地禁用此功能，则可以使用相同的参数集进行升级。


## 延伸阅读

- [让我们加密 DC/OS！](https://mesosphere.com/blog/2016/04/06/lets-encrypt-dcos/)：
 使用 [Let's Encrypt] 的博客帖子(https://letsencrypt.org/)，具有
 在 DC/OS 上运行的服务。

## 未来工作

我们期待与 DC/OS 社区合作，改进现有
安全功能，并在即将发布的版本中引入新功能。

## 后续步骤

- [了解 DC/OS 安全性](/cn/1.11/administering-clusters/)
- [了解如何监控 DC/OS 集群](/cn/1.11/monitoring/)

 [1]:https://en.wikipedia.org/wiki/STARTTLS
