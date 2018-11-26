---
layout: layout.pug
navigationTitle: 用户访问管理
excerpt: 管理 DC/OS 开源部署中的用户访问
title: 用户访问管理
menuWeight: 10
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->


其他授权用户可授予用户对 DC/OS 的访问权限。首个登录到 DC/OS 集群的用户自动创建默认用户。可从 Web 界面或 CLI 添加用户。

## 从 Web 界面添加用户

1. 启动 DC/OS Web 界面，使用您的用户名（Google、GiThub 和 Microsoft）和密码登录。

2. 单击左侧菜单中的 **Organization**。在 **Users** 屏幕中，单击右上角的加号 (**+**)，然后填写新用户电子邮件地址。将自动向新用户发送电子邮件，通知他们对 DC/OS 的访问权限。

![新 DC/OS 用户](/cn/1.11/img/1-11-add-user-to-cluster.png)

图 1. 添加新用户

**注意：**对 DC/OS 有访问权限的任何用户可以邀请更多用户。每个 DC/OS 用户都是管理员，DC/OS 没有明确的权限概念。

## 从 CLI 添加用户
您可以使用 `dcos_add_user.py` 脚本从终端将用户添加到 DC/OS 集群。默认情况下，您的 DC/OS 安装将包含此脚本。

**前提条件：**

- DC/OS [已安装](/cn/1.11/installing/)

1. [SSH](/cn/1.11/administering-clusters/sshcluster/) 到管理节点并运行此命令，其中 `<email>` 是用户的电子邮件：

    ```bash
    sudo -i dcos-shell /opt/mesosphere/bin/dcos_add_user.py <email>
    ```

1. 发送 DC/OS 集群的 URL（如 `http://<public-master-ip>/`) to the new user. The user specified by `<email>` 现在可以登录并访问集群。

## 删除用户
1. 在 **Users** 屏幕中，选择用户名，然后单击 **Delete**。
2. 单击 **Delete** 以确认操作。

<img src="/1.11/img/1-11-delete-user.png" alt="delete-user" width="350" height="300" border="2">

 图 2. 删除用户

## 切换用户 

要切换用户，您必须退出当前用户，然后再返回到新用户。

### 从 Web 界面

1. 要退出 DC/OS Web 界面，请单击左上方的用户名，然后选择 **Sign Out**。

 ![退出](/cn/1.11/img/1-11-user-drop-down-menu.png)

 图 3. 下拉用户菜单

现在您可以作为另一用户登录。

### 从 CLI

1. 要退出 DC/OS CLI，请输入命令：

        ```bash
        dcos config unset core.dcos_acs_token
        Removed [core.dcos_acs_token]
        ```

现在您可以作为另一用户登录。

## 后续步骤

有关安全的更多信息，请检查[安全和身份认证](/cn/1.11/security/oss/)
