---
layout: layout.pug
navigationTitle:  密钥
title: 密钥
menuWeight: 7
excerpt: 使用“密钥”页面
enterprise: true
渲染：胡须
型号：/mesosphere/dcos/1.14/data.yml
---

您可以在“密钥”页面管理密钥和证书。

![Secrets](/mesosphere/dcos/1.14/img/GUI-Secrets-Secrets_View_With_Secrets-1_12.png)
图 1 - “密匙”页面


有关创建和管理密匙的完整详情，请参阅 [密匙](/mesosphere/dcos/1.14/security/ent/secrets) 文档。

<p class="message--important"><strong>重要信息：</strong>密钥的最大文件大小约为 1 MB，减去了大约 1 KB 的密钥存储库元数据。</p>


# 创建键值对密钥 

1. 以具有 `dcos:superuser` 权限的用户身份登录 DC/OS UI。

1. 打开 **Secrets** 选项卡。

1. 单击右上方的 **+** 图标。

    ![新密钥](/mesosphere/dcos/1.14/img/new-secret.png)

    图 2 - 新密钥图标

    如果您当前没有密钥，将显示 **创建密钥** 界面。单击 **创建密匙** 按钮。

    ![创建密钥](/mesosphere/dcos/1.14/img/GUI-Secrets-Create-Secret.png)

    图 3 -“创建密匙”按钮

1. 在 **创建新密钥** 屏幕的 **ID** 框中，键入密钥的名称及其路径（若有）。

1. 选择 **键值对** 作为类型。

1. 在 **Value** 框中键入或粘贴密钥。

    ![密钥 ID/值字段](/mesosphere/dcos/1.14/img/GUI-Secrets-Create-New-Keypair.png)

    图 4 - 创建新密钥

1. 单击 **创建密匙**。

# 从文件创建密匙 

本程序介绍如何通过 DC/OS Web 界面使用文件来创建密匙。

1. 以具有 `dcos:superuser` 权限的用户身份登录 DC/OS UI。
1. 单击左侧导航菜单上的 **密匙** 选项卡。
1. 单击右上方的 **+** 图标。

    ![新密钥](/mesosphere/dcos/1.14/img/new-secret.png)

    图 5 -“密匙”屏幕

    如果您当前没有密钥，将显示“创建密钥”屏幕。单击 **创建密匙** 按钮。

    ![创建密钥](/mesosphere/dcos/1.14/img/GUI-Secrets-Create-Secret.png)

    图 6 -“创建密匙”按钮

1. 在 ID 框中，提供密钥名称及其路径（若有）。

    ![创建新密钥](/mesosphere/dcos/1.14/img/GUI-Secrets-Create-New-Secret.png)

    图 7 -“创建新密匙”对话框

1. 选择 **文件** 作为类型。
1. 单击 **选择文件**。
1. 找到并选择要据其创建密匙的文件。
1. 单击 **创建密匙**。

# 查看创建的密匙 
返回到“密匙”屏幕，您可以看到密匙已经部署。

   ![已部署密匙](/mesosphere/dcos/1.14/img/GUI-Secrets-Deployed.jpeg)
   图 8 - 已部署密钥
