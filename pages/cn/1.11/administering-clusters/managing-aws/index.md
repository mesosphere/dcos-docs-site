---
layout: layout.pug
navigationTitle: 管理 AWS
title: 管理 AWS
menuWeight: 9
excerpt: 扩展 AWS 集群 
enterprise: false
---


您可以扩展 AWS 集群或更改代理节点的数量。

## 扩展 AWS 集群

DC/OS AWS CloudFormation 模板为运行 DC/OS 已经过优化，但您可能希望根据您的需求更改代理节点的数量。

**注意：** 缩减 AWS 集群可能导致数据丢失。建议每次缩减一个节点，以让 DC/OS 服务恢复。例如，如果您正在运行 DC/OS 服务并从 10 个节点缩减到 5 个节点，这可能会导致您服务的所有实例丢失。

要更改 AWS 的代理节点数：

1. 在 [AWS CloudFormation 管理][3] 页面中，选择您的 DC/OS 集群，然后单击 **更新堆栈**。
2. 单击到 **指定参数**页面，您可以为 **PublicSlaveInstancEcount** 和 **SlaveInstancEcount** 指定新值。
3. 在 **选项** 页面，接受默认值，然后单击 **下一步**。**注意：** 您可以选择在故障时是否还原。默认情况下，此选项设置为 **是**。
4. 在 **查看** 页面，选中确认框，然后单击 **创建**。

您的新机器需要几分钟完成初始化；您可以在 EC2 控制台中查看。DC/OS Web 界面将在新节点注册时即进行更新。




 [3]:https://console.aws.amazon.com/cloudformation/home
