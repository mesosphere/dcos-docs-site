---
layout: layout.pug
navigationTitle: 在 DC/OS CA 中建立信任
title: 在 DC/OS CA 中建立信任
menuWeight: 200
excerpt: 配置 Chrome 和 Firefox 以信任您的 DC/OS CA。
beta: true
enterprise: true
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->


**先决条件：**[DC/OS CA 根证书](/cn/1.11/security/ent/tls-ssl/get-cert/)的本地副本。

添加 DC/OS CA 作为受信任根证书颁发机构的步骤因操作系统和浏览器而异。请参阅与您的浏览器/操作系统对相对应的部分。

- [OS X 上的 Google Chrome](#osx-chrome)

- [Windows 10 上的 Google Chrome](#win-chrome)

- [OS X 或 Windows 上的 Mozilla Firefox](#osx-win-firefox)

# <a name="osx-chrome"></a>在 OS X 上配置 Google Chrome 以信任您的 DC/OS CA

- 此程序最适用于 Chrome 56 或更高版本。

- 可能会提示您输入密码以允许修改验证序号链。在提示时提供您的密码。

1. 单击桌面右上角的放大镜图标，打开 Spotlight Search。在框中键入 **Keychain Access**。

1. 在 **Keychain Access** 对话框中，选择 **System**。

1. 使用以下方法之一将 `dcos-ca.crt` 文件添加到 **System** 验证序号链：
 - 拖放文件
 - **文件** -> **导入项目** 

1. 双击验证序号链中的证书，展开 **信任** 部分，并选择**使用此证书时** **始终信任**。

1. 关闭对话框。

1. 打开新的 Incognito Chrome 窗口并打开 DC/OS Web 界面。地址栏中的 DC/OS Web 界面的路径应标记为 **Secure**。您也可以尝试访问每个管理节点的公共 IP 地址，以确认所有管理节点均显示为 **Secure**。

# <a name="win-chrome"></a>在 Windows 上配置 Google Chrome 以信任您的 DC/OS CA

- 此程序最适用于 Chrome 56 或更高版本或 Windows 10。

1. 打开 Chrome 浏览器并在地址栏中键入 `chrome://settings`。

1. 向下滚动并单击 **Show advanced settings**。

1. 向下滚动并单击 **Manage certificates**。

1. 单击以打开 **Trusted Root Certification Authority** 选项卡。

1. 单击 **Import**。

1. 单击证书导入向导的 **Welcome** 页面上的 **Next**。

1. 单击 **Browse**。

1. 导航至您的 `dcos-ca.crt` 文件，选择它，并单击 **Open**。

1. 单击 **下一步**。

1. 确保选中 **Place all certificates in the following store** 选项，以及**Certificate Store** 是 **Trusted Root Certification Authorities**。

1. 单击 **下一步**。

1. 单击 **Finish**。

1. 您应检查指纹是否与 DC/OS CA 根证书的指纹匹配，然后单击 **Yes**。

1. 单击确认消息上的 **OK**。

1. 单击 **Close**。

1. 关闭并重新启动 Chrome，或打开新的 Incognito 会话。访问您的集群 URL 和每个管理节点的公共 IP 地址，以确认这些站点现在显示为 **Secure**。


# <a name="osx-win-firefox"></a>在 OS X 或 Windows 上配置 Mozilla Firefox 以信任您的 DC/OS CA

1. 打开 Mozilla Firefox 浏览器并在地址栏中键入 `about:preferences#advanced`。

1. 单击 **Certificates**。

1. 单击 **View Certificates**。

1. 单击 **Import**。

1. 在对话框中找到并选择 `dcos-ca.crt` 文件并单击 **Open**。

1. 我们建议单击 **View** 以检查证书。理想情况下，您应确认指纹是否与 DC/OS CA 根证书的指纹相匹配。

1. 验证证书后，选择 **Trust this CA to identify websites**，然后单击 **OK**。

1. 再次单击 **OK**，关闭 **Certificate** 对话框。

1. 在地址栏中键入您的集群 URL 并按 ENTER 键。地址栏中的 DC/OS Web 界面的路径应标记为 **Secure**。您也可以尝试访问每个管理节点的公共 IP 地址，以确认所有主节点均显示为 **Secure**。
