---
layout: layout.pug
title: 卸载 AWS EC2 上的 DC/OS
navigationTitle: 卸载 
menuWeight: 15
excerpt: 卸载 AWS EC2 上运行的 DC/OS
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->

可以使用本说明卸载 AWS EC2 上运行的 DC/OS。

**注意：出现以下情况，将会继续收取 AWS 费用：**

* 仅删除单个 EC2 实例，而非整个堆栈。如果仅删除单个实例，AWS 将重新启动您的 DC/OS 集群。
* 您的堆栈无法删除。您必须监控堆栈删除过程，确保成功完成删除。
* S3 bucket 未清空。

要卸载 AWS 上的 DC/OS：

1. 在 <a href="https://console.aws.amazon.com/cloudformation/home" target="_blank">云形成管理</a> 页面选择您的集群并单击 **删除堆栈**。如需更多信息，请参阅 <a href="http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-console-delete-stack.html" target="_blank">删除 AWS CloudFormation 控制台上的堆栈</a>。

2. 导航至 <a href="https://console.aws.amazon.com/s3/home" target="_blank">S3 管理控制台</a> 并删除您的 DC/OS bucket。如需更多信息，请参阅<a href="http://docs.aws.amazon.com/AmazonS3/latest/dev/delete-or-empty-bucket.html" target="_blank">删除或清空 bucket</a>。
