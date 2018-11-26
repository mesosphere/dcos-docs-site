---
layout: layout.pug
excerpt: 使用 Terraform 在 DigitalOcean 上安装 DC/OS 集群
title: 在 DigitalOcean 上运行 DC/OS
navigationTitle: DigitalOcean
menuWeight: 15
oss: true
---

可以使用 Terraform 在 DigitalOcean 上创建 DC/OS 集群。

随附的 Terraform 模板设置为能在 DigitalOcean 上运行 Mesosphere DC/OS。根据安装的 DC/OS 服务或工作负载所需的计算量，可能须要修改模板才能满足需求。可以修改 Terraform 模板，但 Mesosphere 不能协助完成故障排除。如果需要有关 Droplet 创建或其他相关问题的支持，请发送电子邮件至 support@digitalocean.com，访问非官方的 DigitalOcean IRC 频道（#digitalocean on freenode）或考虑 [DC / OS Enterprise] (https://mesosphere.com/)。

**免责声明：请注意，这是 [社区推动的项目](https://github.com/dcos/terraform-dcos/tree/master/gcp)，未正式获得 Mesosphere 支持。**

**注意：** 此安装方法不支持升级。

## 安全

**注意：** 通过 Terraform 部署后，所有节点都默认面向互联网，并且未在开箱时设加防护。将管理节点和代理节点放入安全组需要其他配置。

## 环境

- 管理分区中的一个、三个或五个 Mesos 管理节点

- 四个 Mesos 专用代理节点

- 一个 Mesos 公共代理节点

- DigitalOcean 4GB（或更多）Droplet

# 创建 DC/OS 集群

## 先决条件

- [DigitalOcean API Key](https://www.digitalocean.com/help/api/)

- [Terraform by Hashicorp](https://www.terraform.io/intro/getting-started/install.html)

## 安装 DC/OS

1. 使用上述链接上的说明下载并安装 Terraform。

2. [在 GiThub 中下载 DC/OS Terraform 表单](https://github.com/jmarhee/digitalocean-dcos-terraform) 到本地目录。

    ```bash
    git clone https://github.com/jmarhee/digitalocean-dcos-terraform
    ```

3. 在该目录生成一个 `ssh` 密钥。

    ```bash
    ssh-keygen -t rsa -f ./do-key
    ```

4. 获取用于 API 的令牌。可以 [根据文档操作](https://www.digitalocean.com/community/tutorials/how-to-use-the-digitalocean-api-v2)。

5. 将密钥添加到 DigitalOcean。

    ```bash
    curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"dcos-key","public_key":"<public-key>"}' "https://api.digitalocean.com/v2/account/keys"
    ```

6. 获取密钥 ID。

    ```bash
    curl -X GET -H 'Content-Type: application/json' -H 'Authorization: Bearer $TOKEN' "https://api.digitalocean.com/v2/account/keys"
    ```

7. 复制 `sample.terraform.tfvars` 到名为 `terraform.tfvars` 的新文件，并编辑新文件，填写合适的值。以下字段为空；如果未填写，必要时 Terraform 会提示您：

 - `digitalocean_token` - 您的 DigitalOcean API 密钥

 - `ssh_key_fingerprint` - 上文提供的密钥 ID

 - `dcos_installer_url` - 在哪获得 DC/OS
 https://downloads.dcos.io/dcos/stable/dcos_generate_config.sh

以下字段具有默认值，可根据您的要求进行更改：

 - `region` - DigitalOcean 设施：[NYC1|NYC2|NYC3|SGP1|LON1|AMS2|AMS3|SFO1|TOR1|FRA1]
 为您的集群选择 DigitalOcean 数据中心——默认 NYC2

 - `agent_size` - 用于 DC/OS 代理的 DigitalOcean Droplet 大小：[4GB|8GB|16GB|32GB|48GB|64GB]
 选择用于 DC/OS 专用代理的 DigitalOcean Droplet 大小——默认为 4GB

 - `master_size` - 用于 DC/OS Master 的 DigitalOcean Droplet 大小：[4GB|8GB|16GB|32GB|48GB|64GB]
 选择用于 DC/OS 管理节点的 DigitalOcean Droplet 大小——默认为 4GB

 - `boot_size` - 用于 DC/OS 引导节点的 DigitalOcean Droplet 大小：[4GB|8GB|16GB|32GB|48GB|64GB]
 选择用于 DC/OS 引导服务器的 DigitalOcean Droplet 大小 ——默认为 4GB

 - `dcos_cluster_name` - DC/OS 集群的名称 ——默认为 digitalocean-dcos

 - `dcos_agent_count` - 要部署的专用代理数 ——默认为 4

 - `dcos_public_agent_count` - 要部署的公共代理数 ——默认为 1

 - `dcos_init_pubkey` - 在第 4 步中创建的 ssh 公钥路径 ——默认为 ./do-key.pub

 - `key_file_path` - 在第 4 步中创建的 ssh 私钥路径 ——默认为 ./do-key

8. 还是在这一目录中运行 `terraform init`，然后运行 `terraform apply`，将服务器部署到您在 DigitalOcean 的项目中，并运行 DC/OS 安装程序。完成后，您将看到和以下内容相似的输出，但它带有分配给您服务器的 IP 地址：

 ![terraform apply output](/cn/1.11/img/digitalocean_terraform_output.png)

 图 1. Terraform 应用输出

这时，可能需要等待几分钟时间才能使所有 DC/OS 服务变为活跃状态，并使控制面板在管理节点上可用。15 或 20 分钟后，查看 [故障排除](cn/1.11/installing/troubleshooting/) 文档。

# 启动 DC/OS
输入 Mesos 管理节点 IP 地址启动 DC/OS Web 界面：

1. 将运行 `terraform apply` 或运行相同目录中的 `terraform output` 得到的链接，剪切并粘贴到浏览器，从而打开 DC/OS Web 界面。该界面在标准 HTTP 端口 80 上运行，因此无需在主机名后指定端口号。

2. 安装 DC/OS 命令行界面 (CLI)。可以安装 CLI，用于管理 DC/OS 集群。可以通过单击左上方的集群名称随时访问文档。

 ![install CLI](/cn/1.11/img/install-cli-terminal.png)

 图 2. 安装 CLI

## 后续步骤

- 添加和删除节点：

 - 运行 `terraform apply -var ‘dcos_agent_count=N’`，将专用代理计数更改为指定数字。（`‘dcos_public_agent_count’` 同样可用）

 - 增加节点数的方法快速、安全而省心！

 - 我们不建议减少生产中的节点数。如果节点未进入维护模式，而且通过各自的调度程序重新安排其任务，则有状态 DC/OS 应用程序和服务可能遭受停机和故障。
