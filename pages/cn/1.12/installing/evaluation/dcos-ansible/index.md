---
layout: layout.pug
title: 使用 Ansible 管理 Mesosphere DC/OS 群集生命周期
navigationTitle: DC/OS Ansible 角色
menuWeight: 15
excerpt: 自动安装、升级和配置 DC/OS 的 Enterprise 和开源版本
---

## 介绍 Mesosphere DC/OS Ansible 角色

现在的 Mesosphere DC/OS Ansible 角色现在是和 Mesosphere 通用安装工具一起受支持的 DC/OS 生命周期管理方法。对于已经使用 Ansible 来管理其基础架构和应用程序的用户，Ansible 角色只需对其现有堆栈进行一些更改即可使用，因为在开发它们时考虑了隔离和严格的名称间隔。虽然它们是开发用于使用 Mesosphere 通用安装工具配置的基础架构，但也可以与任何云和本地设置结合使用。


## 关于 Mesosphere DC/OS Ansibles 的角色

使用 [Mesosphere DC/OS Ansible 角色](https://github.com/dcos/dcos-ansible)安装、升级和配置一个或多个使用 [Ansible](https://www.ansible.com/)的 DC/OS 群集。这些角色既可以在新的或现有的 Ansible 设置中使用，也可以从 [官方的 Ansible Galaxy](https://galaxy.ansible.com/dcos/dcos_ansible)下载。

<p class="message--note"><strong>注意：</strong>DC/OS Ansible 角色目前仅适用于 CentOS 和 RHEL 平台。</p>

## 将 Mesosphere DC/OS Ansible 角色与 Mesosphere 通用安装工具结合使用

Mesosphere 支持使用一组 [通用安装工具](/cn/1.12/installing/evaluation/mesosphere-supported-methods/)构建基础架构，采用一种特别的 [Terraform-Ansible-Bridge-module](https://github.com/dcos-terraform/terraform-localfile-dcos-ansible-bridge)和 Ansible 来管理 DC/OS 软件的生命周期。

```hcl
module "dcos-ansible-bridge" {
  source  = "dcos-terraform/dcos-ansible-bridge/local_file"
  version = "~> 0.1"

  bootstrap_ip         = "${module.dcos-infrastructure.bootstrap.public_ip}"
  master_ips           = ["${module.dcos-infrastructure.masters.public_ips}"]
  private_agent_ips    = ["${module.dcos-infrastructure.private_agents.public_ips}"]
  public_agent_ips     = ["${module.dcos-infrastructure.public_agents.public_ips}"]

  bootstrap_private_ip = "${module.dcos-infrastructure.bootstrap.private_ip}"
  master_private_ips   = ["${module.dcos-infrastructure.masters.private_ips}"]
}

module "dcos-infrastructure" {
  source  = "dcos-terraform/infrastructure/aws"
  version = "~> 0.1"

  [...]

}
```

这将生成一个本地 `hosts` 文件，它是一个 Ansible 兼容的清单文件，可用于告知 Ansible 通用安装工具创建的群集节点。它还将生成一个 Ansible 兼容的主机变量文件 `dcos.yml`，该文件将由群集引导程序和管理节点地址填充。然后可以使用这两个文件来调用针对群集的任何 Ansible playbook，例如 [提供的示例 1](https://github.com/dcos/dcos-ansible/blob/master/dcos.yml)，从而将角色铺展到其相应的节点。

## 使用 Mesosphere DC/OS Ansible 角色进行本地设置

Mesosphere 支持使用可用于自动化 DC/OS 安装、升级和配置本地设置的 Ansible。[Mesosphere 提供的 Ansible 角色](https://galaxy.ansible.com/dcos/dcos_ansible) 将使用遵循 [Mesosphere DC/OS 系统要求](/cn/1.12/installing/production/system-requirements/) 的任何设置，并与 CentOS/RHEL 一起运行。