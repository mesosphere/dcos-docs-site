---
layout: layout.pug
title: 基础 
navigationTitle: 基础
menuWeight: 5
excerpt: 使用 DC/OS 模板创建 DC/OS 集群
---

可以使用 AWS CloudFormation 上的 DC/OS 模板为 Amazon Web Services (AWS) 创建 DC/OS 集群。

基础模板提供：
- 有限的自定义选项
- 最快的部署和必要的基础设置
- 非常适合简单的生产部署、演示和测试

这些说明提供了一个基础的 AWS CloudFormation 模板，可以创建适合演示和 POC 的 DC/OS 集群。这是开始使用 AWS CloudFormation 的 DC/OS 模板的最快方式。

有关完整的 DC/OS 配置选项集，请参阅 [高级 AWS 安装指南](/cn/1.11/installing/evaluation/aws/advanced/)。

<p class="message--important"><strong>重要信息：</strong>此安装方法不支持升级。</p> 


# 系统要求

## 硬件

AWS EC2 <a href="https://aws.amazon.com/ec2/pricing/" target="_blank">m3.xlarge</a> 实例。建议不要选择较小的 VM，而选择较少的 VM 可能会导致某些资源密集型服务（例如，分布式数据存储）无法正常工作。

* 可选择一个或三个 Mesos 管理节点。
* 默认值为五个 [专用](/cn/1.11/overview/concepts/#private-agent-node) Mesos 代理节点。
* 默认值为一个 [公共](/cn/1.11/overview/concepts/#public-agent-node) Mesos 代理节点。端口默认已关闭，运行状况检查配置为 Marathon-LB。端口 80 和 443 配置为 AWS 弹性负载均衡器。

## 软件

- DC/OS AWS 模板：
 * 联系销售代表或 <a href="mailto:sales@mesosphere.com">sales@mesosphere.com</a>，获取这些文件。[enterprise type="inline" size="small" /]
 * 最新的 DC/OS 开源 AWS 模板可从 [downloads.dcos.io](https://downloads.dcos.io/dcos/stable/aws.html) 下载，旧版本可从 [dcos.io/releases](https://dcos.io/releases/) 下载。[oss type="inline" size="small" /]

- AWS 帐户。
- 与集群相同分域的 AWS EC2 密钥对。密钥对不能跨分域共享。AWS 密钥对使用公钥加密来提供对 AWS 集群的安全登录。有关创建 AWS EC2 密钥对的详细信息，请参阅 <a href="http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html#having-ec2-create-your-key-pair" target="_blank">文档</a>。
- 已安装和配置 SSH。需要访问 DC/OS 集群中的节点。


# 创建 DC/OS 集群堆栈 

[enterprise]
## Enterprise 用户 
[/enterprise]

1. 启动 <a href="https://console.aws.amazon.com/cloudformation/home" target="_blank">AWS CloudFormation</a>。

2. 单击 **创建堆栈**。

3. 在 **选择模板** 页面的**选择模板**字段，单击指定 **Amazon S3 模板 URL** 单选按钮，然后将销售发送的模板 URL 粘贴进去。

<p class="message--note"><strong>注意：请勿单击 查看/编辑设计程序中的模板</strong> 链接并编辑模板。DC/OS 模板是为运行 DC/OS 配置的。如果修改模板，您可能无法在 DC/OS 集群上运行某些包。</p> 


 ![Launch stack](/cn/1.11/img/dcos-aws-step2b.png)

 图 1. 启动堆栈

4. 单击 **下一步**。

5. 在 **指定详情** 页面指定集群名称（`Stack name`）、密钥对（`KeyName`）、公共代理（`PublicSlaveInstanceCount`）和专用代理（`SlaveInstanceCount`）。单击 **下一步**。创建集群后，根据您安装的 DC/OS 服务，可能需要更改代理节点数。如需更多信息，请参阅 [在 AWS 中扩展 DC/OS 集群][1]。

6. 跳过开源用户部分，转到第 6 步。

![Create stack](/cn/1.11/img/dcos-aws-step2c-ee.png)

图 2. 创建堆栈

[oss]
## 开源用户 
[/oss]

1. 在 CloudFormation 上启动 <a href="https://downloads.dcos.io/dcos/EarlyAccess/aws.html" target="_blank">DC/OS 模板</a>，选择分域和管理节点数量（一个或三个）。所选分域必须有一个密钥对。

2. 在 **选择模板** 页面接受默认值，然后单击 **下一步**。

 ![Launch stack](/cn/1.11/img/dcos-aws-step2b.png)

 图 3. 启动堆栈

3. 在 **指定详情** 页面指定集群名称（`Stack name`）、密钥对（`KeyName`）、是否启用 OAuth 身份认证（`OAuthEnabled`）、公共代理节点数（`PublicSlaveInstanceCount`）、专用代理节点数（`SlaveInstanceCount`），然后单击 **下一步**。

<p class="message--warning"><strong>警告：</strong>请勿单击 <strong>查看/编辑设计程序中的模板</strong> 链接并编辑模板。DC/OS 模板是为运行 DC/OS 配置的。如果修改模板，您可能无法在 DC/OS 集群上运行某些包。</p>


4. 转到“所有用户”部分的第 6 步。

![Create stack](/cn/1.11/img/dcos-aws-step2c.png)

图 4. 创建堆栈

## 所有用户
1. 在 **选项** 页面，接受默认值，然后单击 **下一步**。在“高级”部分，您可以选择是否退回查看故障。默认情况下，此选项设置为 **是**。

1. 在 **查看** 页面，选中确认框，然后单击 **创建**。如果显示 **创建新堆栈** 页面，要么是 AWS 仍在处理您的请求，要么就是您查看的是其他分域。导航至正确的分域并刷新页面以查看您的堆栈。

# 监控集群堆栈启动

在 <a href="https://console.aws.amazon.com/cloudformation/home" target="_blank">AWS CloudFormation</a> 中，您会看到以下内容：

* 集群堆栈启动需要 10 到 15 分钟时间。
* 状态从 CREATE_IN_PROGRESS 更改为 CREATE_COMPLETE。

**故障排除：** ROLLBACK_COMPLETE 状态表示部署失败。如需实用故障信息，请参阅**事件**选项卡。



# <a name="launchdcos"></a>打开并登录 DC/OS GUI

1. 在 AWS CloudFormation 中，勾选堆栈旁边的复选框。

2. 单击 **输出**选项卡并复制 Mesos 管理节点主机名。

 ![Monitor stack creation](/cn/1.11/img/dcos-stack.png)

 图 5. 监控堆栈创建

3. 将主机名粘贴到浏览器中，打开 DC/OS Web 界面。该界面在标准 HTTP 端口 80 上运行，因此无需在主机名后指定端口号。浏览器可能会显示您的连接不安全的警告。这是因为 DC/OS 使用自签名证书。可以忽略该错误，然后单击进入登录画面。

    ![DC/OS GUI auth](/cn/1.11/img/dc-os-gui-login-ee.png)

    图 6. DC/OS Web 界面登录画面。

    <p class="message--note"><strong>注意: </strong> 可能需要调整窗口大小以查看此选项卡。可以随时在 <a href="https://signin.aws.amazon.com/signin?redirect_uri=https%3A%2F%2Fconsole.aws.amazon.com%2Fcloudformation%2Fhome%3Fstate%3DhashArgs%2523%26isauthcode%3Dtrue&client_id=arn%3Aaws%3Aiam%3A%3A015428540659%3Auser%2Fcloudformation&forceMobileApp=0">AWS CloudFormation 管理</a> 页面找到 DC/OS 主机名。</p>

4. 输入超级用户帐户的用户名和密码。默认用户名为 `bootstrapuser`，默认密码 `deleteme`。单击 **登录**。[enterprise type="inline" size="small" /]

# 安装 DC/OS CLI

必须安装 [DC/OS 命令行界面 (CLI)][2] ，才能管理 DCOS 集群。

1. 单击 DC/OS GUI 左上角的下拉菜单，然后选择 **安装 CLI**。

2. 复制代码片段并在终端中运行。输入 sudo 密码，接受集群证书的指纹并输入超级用户名和密码，完成 CLI 身份认证。

# 后续步骤

- [添加用户到集群][3]
- [扩展注意事项][4]

 [1]: /cn/1.11/administering-clusters/managing-aws/
 [2]: /cn/1.11/cli/install/
 [3]: /cn/1.11/security/ent/users-groups/
 [4]: https://aws.amazon.com/autoscaling/
