---
layout: layout.pug
excerpt: 使用 Terraform 在 Packet 裸机上安装 DC/OS 群集
title: 在 Packet 上运行 DC/OS
navigationTitle: Packet
menuWeight: 50
oss: true
---

<p class="message--warning"><strong>免责声明：</strong>这是 <a href="https://github.com/dcos/terraform-dcos/tree/master/gcp">[社区推动的项目]</a>，未正式获得 Mesosphere 支持。这种安装方法用于快速演示和验证概念。本页说明如何使用 Terraform 模板在 Packet 裸机上安装 DC/OS 群集。Terraform 仅供参考，不建议用于生产目的。下列安装方法不支持升级。</p>

<p class="message--note"><strong>注意：</strong>联系<a href="https://groups.google.com/a/dcos.io/forum/#!forum/users">邮寄列表</a>或 <a href="http://chat.dcos.io/?_ga=2.226911897.58407594.1533244861-1110201164.1520633201">Slack 渠道</a>，获取社区支持。</p>

可以使用 Terraform 在 Packet 裸机上创建 DC/OS 群集。随附的 Terraform 模板配置为在 Packet 上运行 Mesosphere DC/OS。根据安装的 DC/OS 服务或工作负载所需的计算量，可能须要修改模板才能满足需求。可以修改 Terraform 模板，但 Mesosphere 不能协助完成故障排除。如需支持，您可以发送电子邮件至 help@packet.net，访问 Packet IRC 渠道 (#packethost on freenode) 或考虑 [DC/OS Enterprise](https://mesosphere.com/)。

## 硬件

- 管理分区中的一个、三个或五个 Mesos 管理节点

- 四个 Mesos 专用代理节点

- 一个 Mesos 公共代理节点

- Packet “Type 0”服务器实例

# 创建 DC/OS 群集

## 先决条件

- [Packet API 密钥](https://help.packet.net/quick-start/api-integrations)

- [Packet 项目 ID](https://help.packet.net/quick-start/api-integrations)

- [Terraform by Hashicorp](https://www.terraform.io/intro/getting-started/install.html)

## 安装 DC/OS

<p class="message--important"><strong>重要信息：</strong>使用此方法就会默认打开网络。因此<a href="/cn/1.12/administering-clusters/securing-your-cluster/#network-security">网络安全</a>是一个需要谨慎的问题，管理员应尽快解决。</p>

1. 使用“先决条件”部分提供的链接上的说明下载和安装 Terraform。

2. [在 GiThub 中下载 DC/OS Terraform 表单](https://github.com/dcos/packet-terraform) 到本地目录。

    ```bash
    git clone https://github.com/dcos/packet-terraform
    ```

3. 在该目录生成一个 ssh 密钥对：

    ```bash
    ssh-keygen -t rsa -f ./packet-key
    ```

4. 复制 `sample.terraform.tfvars` 到名为 `terraform.tfvars` 的新文件，并编辑新文件，填写合适的值。以下内容为空；如果未填写，必要时 Terraform 会提示您：

 - `packet_api_key` - 您的 Packet API 密钥

 - `packet_project_id` - Packet 项目 ID

 - `dcos_installer_url` - 在哪获取 [DC/OS 配置文件](https://downloads.dcos.io/dcos/stable/dcos_generate_config.sh)

 以下字段具有默认值，可根据您的要求进行更改：

 - `packet_facility` - Packet 设施：[ewr1|sjc1|ams1]
 ewr1 is New Jersey, ams1 is Amsterdam, sjc1 is San Jose - default sjc1

 - `packet_agent_type` - 用于 DC/OS 代理的 Packet 服务器类型：[`baremetal_0`|baremetal_1|baremetal_3]
 选择用于 DC/OS 专用代理的 Packet 服务器类型——默认为 `baremetal_0`

 - `packet_master_type` - 用于 DC/OS 管理节点的 Packet 服务器类型：[`baremetal_0`|baremetal_1|baremetal_3]
 选择用于 DC/OS 管理节点的 Packet 服务器类型——默认为 `baremetal_0`

 - `packet_boot_type` - 用于 DC/OS Boot 节点的 Packet 服务器类型：[`baremetal_0`|baremetal_1|baremetal_3]
 选择用于 DC/OS Boot 服务器的 Packet 服务器类型——默认为 `baremetal_0`

 - `dcos_cluster_name` - DC/OS 群集的名称——默认为 `packet-dcos`

 - `dcos_agent_count` - 要部署的专用代理数——默认为四个

 - `dcos_public_agent_count` - 要部署的公共代理数——默认为一个

 - `dcos_init_pubkey` - 在第 4 步中创建的 ssh 公钥路径——默认为 ./packet-key.pub

 - `key_file_path` - 在第 4 步中创建的 ssh 私钥路径——默认为 ./packet-key

5. 还是在这一目录中运行 `terraform apply`，将服务器部署到您在 Packet 的项目中，并运行 DC/OS 安装步骤。完成后，您将看到和以下内容相似，但带有分配给您服务器的 IP 地址的输出：

 ![terraform apply output](/mesosphere/dcos/1.12/img/packet_terraform_output.png)

 图 1. “Terraform apply" 输出

这时，可能需要等待几分钟时间才能使所有 DC/OS 服务变为活跃状态，并使控制面板在管理节点上可用。15 到 20 分钟后，请查看 [故障排除](/mesosphere/dcos/cn/1.12/installing/troubleshooting/) 文档。

# 启动 DC/OS
输入 Mesos 管理节点 IP 地址启动 DC/OS Web 界面：

1. 将运行 `terraform apply` 或运行相同目录中 terraform 输出得到的链接，剪切并粘贴到浏览器，从而打开 DC/OS Web 界面。该界面在标准 HTTP 端口 80 上运行，因此无需在主机名后指定端口号。

2. 安装 DC/OS 命令行界面 (CLI)。可以安装 CLI，用于管理 DC/OS 群集。可以通过单击左上方的群集名称随时访问文档。

 ![install CLI](/mesosphere/dcos/1.12/img/install-cli-terminal.png)

 图 2. 安装 DC/OS CLI 画面

## 后续步骤

- 添加和删除节点：

 - 运行 `terraform apply -var ‘dcos_agent_count=N’`，将专用代理计数更改为指定数字。（`‘dcos_public_agent_count’` 同样可用）。

 - 快速安全地增加节点数。

 - 我们不建议减少生产中的节点数。如果节点未进入维护模式，而且通过各自的调度程序重新安排其任务，则有状态 DC/OS 应用程序和服务可能遭受停机和故障。
