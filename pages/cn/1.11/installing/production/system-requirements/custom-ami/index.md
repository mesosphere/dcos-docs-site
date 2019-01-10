---
layout: layout.pug
navigationTitle: 自定义 AMI
title: 使用自定义 AMI 进行安装
menuWeight: 20
excerpt: 使用 AWS 机器镜像启动 DC/OS
beta: true
---

可以利用基于 CentOS 7、CoreOS 和 RHEL 的自定义 [AWS 机器镜像 (AMI)](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AMIs.html) ，使用高级模板启动 DC/OS。

- 可以利用自定义 AMI 将 DC/OS 安装与自己的内部配置管理工具集成。
- 若要定制内核或驱动程序，可以使用自定义 AMI。

开始时，可建立自定义 AMI，然后使用高级模板安装 DC/OS。

# 构建自定义 AMI
这是建立自己的 AMI 的推荐方法。

## 构建 DC/OS cloud_images AMI

1. 使用 DC/OS [cloud_images](https://github.com/dcos/dcos/tree/master/cloud_images) 脚本作为模板。这些脚本构建 CentOS7 AMI，并安装所有 DC/OS 先决条件。

 验证您是否可以在不修改的情况下，原样使用这些脚本构建和部署 AMI。AMI 必须部署到要启动集群的每个分域。DC/OS Packer 构建脚本 [create_dcos_ami.sh] (https://github.com/dcos/dcos/blob/master/cloud_images/centos7/create_dcos_ami.sh)可以在运行脚本之前，通过设置环境变量 `DEPLOY_REGIONS` 将 AMI 部署到多个分域。

1. 使用 AWS CloudFormation Web 控制台启动 DC/OS 高级模板，并指定 DC/OS cloud_images AMI。验证集群是否已成功启动。如需更多信息，请参阅 [文档](/cn/1.11/installing/evaluation/cloud-installation/aws/advanced/#launch)。

## 修改 DC/OS cloud_images AMI 

使用 AWS CloudFormation Web 控制台成功构建并部署未经修改的 DC/OS cloud_images AMI 之后：

1. 使用自己的 AMI 自定义，修改 DC/OS [cloud_images](https://github.com/dcos/dcos/tree/master/cloud_images) AMI 脚本。

   <p class="message--note"><strong>注意: </strong>您的 AMI 必须满足模板中所示的所有 DC/OS AMI 先决条件。</p>

1. 使用 AWS CloudFormation Web 控制台启动 DC/OS 高级模板，并指定您的自定义 AMI。验证 DC/OS 是否如期启动，并且可以在 DC/OS 集群上启动服务。

1. 按照 [本说明](/cn/1.11/installing/evaluation/cloud-installation/aws/advanced/#launch) 完成安装。

## 故障排除

- 熟悉 DC/OS 服务启动 [流程](/cn/1.11/overview/architecture/boot-sequence/)。
- 查看安装故障排除 [文档](/cn/1.11/installing/troubleshooting/)。要进行故障排除，必须有所有集群节点的 [SSH 访问权限](/cn/1.11/administering-clusters/sshcluster/)。
- [DC/OS Slack](https://support.mesosphere.com) 社区是另一个获得帮助的好地方。
