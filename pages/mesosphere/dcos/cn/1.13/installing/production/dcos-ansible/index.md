---
layout: layout.pug
title: 使用 Ansible 安装和管理 DC/OS
navigationTitle: 带 Ansible 的 DC/OS
menuWeight: 16
excerpt: 创建和管理您的基础架构以及使用 Ansible 模块来安装。
---

现在的 Mesosphere DC/OS Ansible 角色是受支持的 DC/OS 生命周期管理方法以及 Mesosphere 通用安装工具。对于已经使用 Ansible 来管理其基础架构和应用程序的用户，Ansible 角色只需对其现有堆栈进行一些更改即可使用，因为在开发它们时考虑了隔离和严格的名称间隔。虽然它们是开发用于使用 Mesosphere 通用安装工具配置的基础架构，但也可以与任何云和本地设置结合使用。

我们已将 DC/OS 的生命周期管理分为 4 个角色，以处理 DC/OS 的不同管理方面，例如群集前提条件、bootstrap 任务、管理节点任务、专用代理任务和公共代理任务。关于每个角色的更多信息可见下文：

- 前提条件 - 此角色处理所有[运行 DC/OS 的要求](/mesosphere/dcos/1.13/installing/production/system-requirements/#software-prerequisites)。
- GPU - 此角色是对“前提条件”角色的专门添加。它检测 Nvidia GPU 并尝试在 CentOSs 系统上安装驱动器。
-  bootstrap - bootstrap 角色处理与将 DC/OS 安装和升级脚本下载、生成和服务于群集中所有节点相关的所有任务。
- 管理节点 - 这些任务包括从 bootstrap 节点下载安装和升级文件，以及处理某些检查以确保升级已相应地进行。如果存在让群集无法进入不期望状态的问题，将回退升级。
- 代理 - 这些任务处理所有适合代理类型的所有升级和安装任务。


## 关于 Mesosphere DC/OS Ansibles 的角色

使用 [Mesosphere DC/OS Ansible 角色] (https://github.com/dcos/dcos-ansible)安装、升级和配置一个或多个使用 [Ansible] (https://www.ansible.com/)的 DC/OS 群集。这些角色既可以在新的或现有的 Ansible 设置中使用，也可以从 [官方的 Ansible Galaxy] (https://galaxy.ansible.com/dcos/dcos_ansible)下载。

<p class="message--note"><strong>注意：</strong>DC/OS Ansible 角色目前仅适用于 CentOS 和 RHEL 平台。</p>

## 通过 Terraform 在 AWS 上创建测试实例
如果您希望使用在 AWS 上预先配置的实例测试我们的 Ansible 解决方案，并熟悉 Terraform，请下载[下载并使用此 Terraform 脚本](https://gist.github.com/geekbass/45eb978fb420ae0da13f00fdfa0cd1c5)来部署示例基础架构，使得您可以使用上述 Ansible 脚本在它上面部署 DC/OS。该脚本不受 Mesosphere 的官方支持，仅供测试之用。

要使用该脚本部署基础架构：

1. 创建一个新文件夹
2. 将上述脚本复制到名为 main.tf 的文件
3. 初始化 Terraform：terraform init
4. 使用 Terraform 应用部署基础架构

最终输出应该如下所示：

```bash
Apply complete! Resources: 32 added, 0 changed, 0 destroyed.

Outputs:

bootstrap_private_ip = 172.12.15.101
bootstraps = 3.87.63.8
cluster-address = dcosansible-660064571.us-east-1.elb.amazonaws.com
masters = 100.27.19.199
54.196.221.181
35.168.16.40
masters_private_ips = 172.12.6.95
172.12.29.65
172.12.42.160
private_agents = 34.207.192.11
3.80.226.211
3.85.31.136
public-agents-loadbalancer = ext-dcosansible-1616099901.us-east-1.elb.amazonaws.com
public_agents = 3.86.34.141
```

如需了解如何将 Terraform 用作部署管理器的更多信息，请访问 [Universal 安装工具页面](/mesosphere/dcos/1.13/installing/evaluation/)。

## 将 Mesosphere DC/OS Ansible 角色与 Mesosphere 通用安装工具结合使用

Mesosphere 支持使用一组 [通用安装工具] (/mesosphere/dcos/1.13/installing/evaluation/)构建基础架构，专门采用 [Terraform-Ansible-Bridge-module] (https://github.com/dcos-terraform/terraform-localfile-dcos-ansible-bridge)和 Ansible 来管理 DC/OS 软件的生命周期。

```hcl
module "dcos-ansible-bridge" {
  source  = "dcos-terraform/dcos-ansible-bridge/local_file"
  version = "~> 0.1.0"

  bootstrap_ip         = "${module.dcos-infrastructure.bootstrap.public_ip}"
  master_ips           = ["${module.dcos-infrastructure.masters.public_ips}"]
  private_agent_ips    = ["${module.dcos-infrastructure.private_agents.public_ips}"]
  public_agent_ips     = ["${module.dcos-infrastructure.public_agents.public_ips}"]

  bootstrap_private_ip = "${module.dcos-infrastructure.bootstrap.private_ip}"
  master_private_ips   = ["${module.dcos-infrastructure.masters.private_ips}"]
}

module "dcos-infrastructure" {
  source  = "dcos-terraform/infrastructure/aws"
  version = "~> 0.1.0"

  [...]

}
```

这将生成一个本地 `hosts` 文件，它是一个 Ansible 兼容的清单文件，可用于告知 Ansible 通用安装工具创建的群集节点。它还将生成一个 Ansible 兼容的主机变量文件 `dcos.yml`，该文件将由群集引导程序和管理节点地址填充。然后可以使用这两个文件来调用针对群集的任何 Ansible playbook，例如 [提供的示例 1] (https://github.com/dcos/dcos-ansible/blob/master/dcos.yml)，从而将角色铺展到其相应的节点。

## 使用 Mesosphere DC/OS Ansible 角色进行本地设置

Mesosphere 支持使用可用于自动化 DC/OS 安装、升级和配置本地设置的 Ansible。[Mesosphere 提供的 Ansible 角色](https://galaxy.ansible.com/dcos/dcos_ansible) 将使用遵循 [Mesosphere DC/OS 系统要求] 的任何设置(/mesosphere/dcos/1.13/installing/production/system-requirements/) 并与 CentOS/RHEL 一起运行。

## GPU 支持
使用 [提供的示例手册](https://github.com/dcos/dcos-ansible/blob/master/dcos.yml)时，它将自动检测 NVIDIA GPU 硬件并尝试安装适当的驱动程序。这种方法尝试在没有任何重启的情况下起作用 - GPU 角色识别当前使用的内核，并尝试从当前基础存储库或从 CentOS Vault 保管存储库获取其标头文件。如果您有自定义内核在使用，则这可能会失败。在这种情况下，我们恳请您不要使用该模块，只需在您的 Playbook 中将其注释掉并自行处理驱动程序的安装即可。一旦安装驱动程序且 CUDA 库可用，DC/OS 代理将自动提供 GPU 资源。_提示：请确保安装驱动程序后在进行 DC/OS 安装。_
