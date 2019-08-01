---
layout: layout.pug
excerpt: 使用 Terraform 在 DigitalOcean 上安装 DC/OS 群集
title: 在 DigitalOcean 上运行 DC/OS
navigationTitle: DigitalOcean
menuWeight: 40
oss: true
---

<p class="message--warning"><strong>免责声明：</strong>这是 <a href="https://github.com/dcos/terraform-dcos/tree/master/gcp">[社区推动的项目]</a>，未正式获得 Mesosphere 支持。这种安装方法用于快速演示和验证概念。本页说明如何使用 Terraform 在 DigitalOcean 上安装 DC/OS 群集。Terraform 仅供参考，不建议用于生产目的。下列安装方法不支持升级。</p>

<p class="message--note"><strong>注意：</strong>联系<a href="https://groups.google.com/a/dcos.io/forum/#!forum/users">邮寄列表</a>或 <a href="http://chat.dcos.io/?_ga=2.226911897.58407594.1533244861-1110201164.1520633201">Slack 渠道</a>，获取社区支持。</p>

可以使用 Terraform 在 DigitalOcean 上创建 DC/OS 群集。

随附的 Terraform 模板配置为可在 DigitalOcean 上运行 Mesosphere DC/OS。根据安装的 DC/OS 服务或工作负载所需的计算量，可能须要修改模板才能满足需求。可以修改 Terraform 模板，但 Mesosphere 不能协助完成故障排除。如果需要有关 Droplet 创建或其他相关问题的支持，请发送电子邮件至 <a href="mailto:support@digitalocean.com"></a>，访问非官方的 DigitalOcean IRC 频道 (#digitalocean on freenode) 或考虑 [DC/OS Enterprise](https://mesosphere.com/)。

## 安全

<p class="message--important"><strong>重要信息：</strong>使用此方法就会默认打开网络。因此<a href="/1.12/administering-clusters/securing-your-cluster/#network-security">网络安全</a>是一个需要谨慎的问题，管理员应尽快解决。</p>

## 环境

- 管理分区中的一个、三个或五个 Mesos 管理节点

- 四个 Mesos 专用代理节点

- 一个 Mesos 公共代理节点

- DigitalOcean 4GB（或更多）Droplet

# 创建 DC/OS 群集

## 先决条件

- [DigitalOcean API Key](https://www.digitalocean.com/help/api/)

- [Terraform by Hashicorp](https://www.terraform.io/intro/getting-started/install.html)

## 安装 DC/OS

1. 使用上述链接上的说明下载并安装 Terraform。

1. [在 GiThub 中下载 DC/OS Terraform 表单](https://github.com/jmarhee/digitalocean-dcos-terraform) 到本地目录。

    ```bash
    git clone https://github.com/jmarhee/digitalocean-dcos-terraform
    ```

1. 在该目录生成一个 `ssh` 密钥。

    ```bash
    ssh-keygen -t rsa -f ./do-key
    ```

1. 获取用于 API 的令牌。可以 [根据文档操作](https://www.digitalocean.com/community/tutorials/how-to-use-the-digitalocean-api-v2)。

1. 将密钥添加到 DigitalOcean。

    ```bash
    curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"dcos-key","public_key":"<public-key>"}' "https://api.digitalocean.com/v2/account/keys"
    ```

1. 获取密钥 ID。

    ```bash
    curl -X GET -H 'Content-Type: application/json' -H 'Authorization: Bearer $TOKEN' "https://api.digitalocean.com/v2/account/keys"
    ```

1. 复制 `sample.terraform.tfvars` 到名为 `terraform.tfvars` 的新文件，并编辑新文件，填写合适的值。以下字段为空；如果未填写，必要时 Terraform 会提示您：

    - `digitalocean_token` - 您的 DigitalOcean API 密钥

    - `ssh_key_fingerprint` - 上文提供的密钥 ID

    - `dcos_installer_url` - 在哪获得 DC/OS
    https://downloads.dcos.io/dcos/stable/dcos_generate_config.sh

    以下字段具有默认值，可根据您的要求进行更改：

    - `region` - DigitalOcean 设施：[NYC1|NYC2|NYC3|SGP1|LON1|AMS2|AMS3|SFO1|TOR1|FRA1]
    为您的群集选择 DigitalOcean 数据中心——默认 NYC2

    - `agent_size` - 用于 DC/OS 代理的 DigitalOcean Droplet 大小：[4GB|8GB|16GB|32GB|48GB|64GB]
    选择用于 DC/OS 专用代理的 DigitalOcean Droplet 大小——默认为 4GB

    - `master_size` - 用于 DC/OS Master 的 DigitalOcean Droplet 大小：[4GB|8GB|16GB|32GB|48GB|64GB]
    选择用于 DC/OS 管理节点的 DigitalOcean Droplet 大小——默认为 4GB

    - `boot_size` - 用于 DC/OS 引导节点的 DigitalOcean Droplet 大小：[4GB|8GB|16GB|32GB|48GB|64GB]
    选择用于 DC/OS 引导服务器的 DigitalOcean Droplet 大小 ——默认为 4GB

    - `dcos_cluster_name` - DC/OS 群集的名称 ——默认为 digitalocean-dcos

    - `dcos_agent_count` - 要部署的专用代理数 ——默认为 4

    - `dcos_public_agent_count` - 要部署的公共代理数 ——默认为 1

    - `dcos_init_pubkey` - 在第 4 步中创建的 ssh 公钥路径 ——默认为 ./do-key.pub

    - `key_file_path` - 在第 4 步中创建的 ssh 私钥路径 ——默认为 ./do-key

1. 还是在这一目录中运行 `terraform init`，然后运行 `terraform apply`，将服务器部署到您在 DigitalOcean 的项目中，并运行 DC/OS 安装步骤。完成后，您将看到和以下内容相似，但带有分配给您服务器的 IP 地址的输出：

 ![terraform apply output](/mesosphere/dcos/1.12/img/digitalocean_terraform_output.png)

 图 1. Terraform 应用输出

可能需要等待几分钟时间才能使所有 DC/OS 服务变为活跃状态，并使控制面板在管理节点上可用。15 到 20 分钟后，请查看 [故障排除](/mesosphere/dcos/cn/1.12/installing/troubleshooting/) 文档。

# 启动 DC/OS
输入 Mesos 管理节点 IP 地址启动 DC/OS Web 界面：

1. 将运行 `terraform apply` 或运行相同目录中 `terraform output` 得到的链接，剪切并粘贴到浏览器，从而打开 DC/OS Web 界面。该界面在标准 HTTP 端口 80 上运行，因此无需在主机名后指定端口号。

2. 安装 DC/OS 命令行界面 (CLI)。可以安装 CLI，用于管理 DC/OS 群集。可以通过单击左上方的群集名称随时访问文档。

 ![install CLI](/mesosphere/dcos/1.12/img/install-cli-terminal.png)

 图 2. 安装 CLI

## 后续步骤

- 添加和删除节点：

 - 运行 `terraform apply -var ‘dcos_agent_count=N’`，将专用代理计数更改为指定数字。（`‘dcos_public_agent_count’` 同样可用）

 - 增加节点数的方法快速、安全而省心！

 - 我们不建议减少生产中的节点数。如果节点未进入维护模式，而且通过各自的调度程序重新安排其任务，则有状态 DC/OS 应用程序和服务可能遭受停机和故障。
