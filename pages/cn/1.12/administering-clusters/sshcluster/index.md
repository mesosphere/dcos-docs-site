---
layout: layout.pug
navigationTitle: SSH 至节点
title: SSH 至节点
menuWeight: 0
excerpt: 与您的 DC/OS 群集建立 SSH 连接 
enterprise: false
---

<!-- The source repo for this topic is https://github.com/dcos/dcos-docs-site -->

如果您与群集位于同一网络或通过 VPN 连接，则可以使用 `dcos node ssh` 命令 SSH 到您的群集。有关详细信息，请参阅 CLI 参考的 [dcos 节点部分][1]。

* [在 Unix/Linux 上 SSH 至 DC/OS 群集（macOS、Ubuntu 等）][2]
* [在 Windows 上 SSH 至 DC/OS 群集][3]

**要求：**

* 可用于通过 SSH 认证群集节点的未加密 SSH 密钥。不支持加密的 SSH 密钥。

## <a name="unix"></a>在 Unix/Linux 上 SSH 至 DC/OS 群集（macOS、Ubuntu 等）

<p class="message--warning"><strong>警告：</strong>Mesosphere 不支持 Ubuntu 作为 DC/OS 的操作系统，即便是使用 Microsoft Azure 时。</p>

1. 使用 `chmod` 命令更改 `.pem` 文件权限为所有者读/写权限。

   <p class="message--important"><strong>重要信息：</strong>您的 .pem 文件必须位于 <code>~/.ssh</code> 目录。</p>

    ```bash
    chmod 600 <private-key>.pem
    ```

2. SSH 至群集。

   从您的终端，将您的新配置添加到 `.pem` 文件，其中 `<private-key>` 是您的 `.pem` 文件。

    ```bash
    ssh-add ~/.ssh/<private-key>.pem
    Identity added: /Users/<yourdir>/.ssh/<private-key>.pem (/Users/<yourdir>/.ssh/<private-key>.pem)
    ```

 **要 SSH 至管理节点：**

从 DC/OS CLI，输入以下命令：

   ```bash
   dcos node ssh --master-proxy --leader
   ```

 CoreOS 默认用户是 `core` 。如果您正在使用 CentOS，输入：

   ```bash
   dcos node ssh --master-proxy --leader --user=centos
   ```

 **要 SSH 至代理节点：**

 从 DC/OS CLI，输入以下命令，其中 `<mesos-id>` 是您的代理节点 ID。

   ```bash
   dcos node ssh --master-proxy --mesos-id=<mesos-id>
   ```

 要查找代理 ID，选择 DC/OS [Web 界面](/cn/1.12/gui/) 中的 **节点** 选项卡并单击 **详细信息**。

 ![Web 界面节点 ID](/1.12/img/GUI-Nodes-Selected_Node_Detail_View-1_12.png)

 图 1. Web 界面节点 ID 屏幕


## <a name="windows"></a> 在 Windows 上 SSH 至 DC/OS 群集

**要求：**

* PuTTY SSH 客户端或同等工具。（这些说明假设您正在使用 PuTTY，但几乎所有 SSH 客户端都可以使用。）
* PuTTYgen RSA 和 DSA 密钥生成实用工具
* Pageant SSH 身份认证代理

要安装这些程序，从官方 PuTTY 下载页面下载 Windows 安装程序 <a href="http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html" target="_blank">。</a>

1. 使用 PuTTYgen 将 `.pem` 文件类型转换为 `.ppk` ：

 1. 打开 PuTTYgen，选择 **文件 > 加载私钥**，并选择您的 `.pem` 文件。

 2. 选择 **SSH-2 RSA** 作为密钥类型，单击 **保存私钥**，然后选择名称和位置以保存新的 .ppk 密钥。

 ![Windows](/1.12/img/windowsputtykey.png)

 图 2. Windows PuTTY 密钥

 3. 关闭 `PuTTYgen`。

2. SSH 至群集。

 * **要 SSH 至管理节点：**

 1. 从 DC/OS Web 界面，复制管理节点的 IP 地址。它将是您用于连接到 GUI 的 IP 地址。

 2. 打开 PuTTY 并在 **主机名（或 IP 地址）** 字段中输入管理节点 IP 地址。

 ![Putty 配置](/1.12/img/windowsputtybasic.png)

 图 3. PuTTY 配置

 3. 在 PuTTY 窗口左侧的 **类别** 窗格中，选择 **连接 > SSH > Auth**，单击 **浏览**，查找并选择您的 `.ppk` 文件，然后单击 **打开**。

 ![Putty SSH 选项](/1.12/img/windowsputtysshopt.png)

 图 4. PuTTY SSH 选项

 4. 如果您正在运行 CoreOS，则以“core”用户登录。CentOS 上的默认用户是“centos”。

 ![Windows 登录](/1.12/img/windowscore.png)

 图 5. Windows 登录

 * **要 SSH 至代理节点**

 <p class="message--warning"><strong>警告：</strong>SSH 代理转发具有安全影响。只能添加您信任并且您打算用于代理转发的服务器。有关代理转发的详细信息，请参阅 <a href="https://developer.github.com/guides/using-ssh-agent-forwarding/" target="_blank">使用 SSH 代理转发。</a></p>

 **先决条件：** 您必须退出管理节点。

 1. 启用 PuTTY 中的代理转发。

 1. 打开 PuTTY。在 PuTTY 窗口左侧的 **类别** 窗格中，选择 **连接 > SSH > Auth**，然后选中 **允许代理转发** 框。

 1. 单击 **浏览** 按钮并找到您之前使用 PuTTYgen 创建的 `.ppk` 文件。

   ![Windows 转发](/1.12/img/windowsforwarding.png)

   图 6. Windows 转发

 1. 向 Pageant 添加 `.ppk` 文件。

 1. 打开 Pageant。如果未显示“Pageant”窗口，在屏幕右下角时钟旁边的通知区域查找 Pageant 图标，然后双击该图标，打开 Pageant 的主窗口。

 1. 单击 **添加密钥** 按钮。

 1. 找到您使用 PuTTYgen 创建的 `.ppk` 文件，然后单击 **打开** ，将您的密钥添加到 Pageant 中。

   ![Windows Pageant](/1.12/img/windowspageant.png)

   图 7. Windows Pageant

 1. 单击 **关闭** 按钮关闭 Pageant 窗口。

 1. SSH 至管理节点。

 1. 从 DC/OS Web 界面，复制管理节点的 IP 地址。IP 地址显示在您的群集名称下方。

 2. 在 PuTTY 窗口左侧的 **类别** 窗格中，选择 **会话**，在 **主机名（或 IP 地址）** 字段中输入管理节点 IP 地址。

 4. 如果您正在运行 CoreOS，则以“core”用户登录。CentOS 上的默认用户是“centos”。

 ![Windows 登录](/1.12/img/windowscore.png)

 图 8. Windows 登录

 4. 从管理节点，SSH 至代理节点。

 1. 从 Mesos Web 界面，复制代理节点主机名。您可以在 **框架** (`<master-node-IPaddress>/mesos/#/frameworks`) 或 **从节点** 页面 (`<master-node-IPaddress>/mesos/#/slaves`) 找到主机名。

 2. 使用指定的代理节点主机名以用户`core`的身份 SSH 至代理节点：

 `ssh core@<agent-node-hostname>`

 [1]: /cn/1.12/cli/command-reference/
 [2]: #unix
 [3]: #windows
