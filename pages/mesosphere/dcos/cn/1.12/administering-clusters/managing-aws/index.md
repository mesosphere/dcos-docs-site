---
layout: layout.pug
navigationTitle: 管理 AWS
title: 管理 AWS
menuWeight: 9
excerpt: 扩展 AWS 群集 
enterprise: false
---


您可以扩展 AWS 群集或更改代理节点的数量。

## 扩展 AWS 群集

DC/OS AWS CloudFormation 模板经优化以运行 DC/OS，但您可能希望根据您的需求更改代理节点的数量。

<p class="message--warning"><strong>警告：</strong>缩减 AWS 群集可能导致数据丢失。建议每次缩减一个节点，以让 DC/OS 服务恢复。例如，如果您正在运行 DC/OS 服务并从 10 个节点缩减到 5 个节点，这可能会导致您服务的所有实例丢失。</p>


要更改 AWS 的代理节点数：

1. 在 [AWS CloudFormation 管理][1] 页面中，选择您的 DC/OS 群集，然后单击 **更新堆栈**。
2. 单击到 **指定参数**页面，您可以为 **PublicSlaveInstanceCount** 和 **SlaveInstanceCount** 指定新值。
3. 在 **选项** 页面，接受默认值，然后单击 **下一步**。**提示：** 您可以选择是否退回查看故障。默认情况下，此选项设置为 **是**。
4. 在 **查看** 页面，选中确认框，然后单击 **创建**。

您的新机器需要几分钟才能完成初始化；您可以在 EC2 控制台中查看。DC/OS Web 界面将在新节点注册时即进行更新。

 [1]:https://console.aws.amazon.com/cloudformation/home
