---
layout: layout.pug
navigationTitle: 外部用户帐户
title: 外部用户帐户管理
excerpt: 管理外部用户帐户
render: mustache
model: /mesosphere/dcos/1.13/data.yml
menuWeight: 10
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->

<p class="message--note"><strong>注意：</strong>为通过 Web 界面登录 DC/OS 群集的第一个用户自动创建一个外部用户。</p>

# 添加外部用户帐户

## 使用 Web 界面

1. 登录 Web 界面。

2. 单击左侧菜单中的 **Organization**。在 **Users** 屏幕中，单击右上角的加号 (**+**)，然后填写新用户电子邮件地址。

![新 DC/OS 用户](/mesosphere/dcos/1.13/img/1-11-add-user-to-cluster.png)

图 1. 添加新用户

## 使用命令行

您可以使用 `dcos_add_user.py` 脚本从终端将外部用户添加到 DC/OS 群集中。

**前提条件：**

- DC/OS [已安装](/mesosphere/dcos/cn/1.13/installing/)

1. [SSH](/mesosphere/dcos/cn/1.13/administering-clusters/sshcluster/) 到主节点并运行此命令，其中 `<email>` 是用户的电子邮件：

    ```bash
    sudo -i dcos-shell /opt/mesosphere/bin/dcos_add_user.py <email>
    ```

2. 向新用户发送 DC/OS 群集的 URL（例如 `http://<public-master-ip>/`）。`<email>` 指定的用户现在可以登录并访问群集了。

# 删除外部用户帐户

## 使用 Web 界面

1. 在 **Users** 屏幕中，选择用户名，然后单击 **Delete**。
2. 单击 **Delete** 以确认操作。

![新 DC/OS 用户](/mesosphere/dcos/2.0/img/1-11-delete-user.png)

 图 2. 删除用户
