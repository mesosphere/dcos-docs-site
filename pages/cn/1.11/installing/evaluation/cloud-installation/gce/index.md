---
layout: layout.pug
excerpt: 使用 Terraform 在 Google 计算引擎上运行 DC/OS 集群
title: 在 Google 计算引擎上运行 DC/OS
navigationTitle: GCE
menuWeight: 20
oss: true
---

# Terraform

在 GCE 上部署 OSS DC/OS 集群的推荐方式是使用 [Terraform](#terraform)。

<p class="message--warning"><strong>免责声明：</strong>请注意，这是 <a href="https://github.com/dcos/terraform-dcos/tree/master/gcp">社区推动的项目</a>，未正式获得 Mesosphere 支持。</p>

## 先决条件
- [Terraform 0.11.x](https://www.terraform.io/downloads.html)
- Google 云端平台 (GCP) 凭据 [配置方式：`gcloud auth login`](https://cloud.google.com/sdk/downloads)
- SSH 密钥
- 现有 Google 项目。这是通过 Terraform 使用 [此处](https://cloud.google.com/community/tutorials/managing-gcp-projects-with-terraform) 记录的项目创建自动执行的。

## Google 身份认证
使用前提条件中列出的凭据对 Google 云端平台进行身份认证。将在本地下载您使用 Terraform 的凭据。

```bash
$ gcloud auth login
```

## 配置 GCP SSH 密钥
必须设置要在 Terraform 中一起使用 `ssh-agent` 和 `set public key` 的私钥。设置私钥将让您在部署 DC/OS 后登录到集群。私钥还有助于在部署时设置集群。

```bash
$ ssh-add ~/.ssh/your_private_key.pem
```

```bash
$ cat desired_cluster_profile.tfvars
gcp_ssh_pub_key_file = "INSERT_PUBLIC_KEY_PATH_HERE"
...
```

## 配置预先存在的 Google 项目

目前 `terraform-dcos` 假设 GCP 中已有项目，可供您开始部署资源。该存储库即将支持 Terraform 代表用户通过本 [文档](https://cloud.google.com/community/tutorials/managing-gcp-projects-with-terraform) 创建项目。目前，您只能提前创建此项目，或使用现有项目。

```bash
$ cat desired_cluster_profile.tfvars
gcp_project = "massive-bliss-781"
...
```

## Terraform 部署示例

### 快速入门

使用 DC/OS 实验的典型默认值如下：

- 将为您部署三个代理：两个专用代理和一个公共代理。
- 不需要 `git clone` 到本存储库。Terraform 会为您完成这些。

 运行以下命令以在云中部署多个管理节点设置。

```bash
terraform init -from-module github.com/dcos/terraform-dcos//gcp
terraform apply -var gcp_project="your_existing_project"
```

### 自定义 `terraform-dcos` 变量

默认变量在 [variables.tf](https://github.com/dcos/terraform-dcos/blob/master/gcp/variables.tf) 文件内跟踪。但是，如果您为了抓取新发布的 DC/OS 升级而运行 `terraform get --updates`，这个文件就可能会被覆盖。因此，最好使用 [desired_cluster_profile.tfvars](https://github.com/dcos/terraform-dcos/blob/master/gcp/desired_cluster_profile.tfvars.example) 并设置自定义 Terraform 和 DC/OS 标记。这样在集群的整个生命周期中，只跟踪一个能够用于管理的文件就可以了。

如需这一存储库支持的操作系统列表，请参阅 [此处](https://docs.mesosphere.com/1.10/installing/production/system-requirements/) 的 DC/OS 推荐。您可以在 [此处](http://github.com/bernadinm/tf_dcos_core) 找到 Terraform 支持的列表。

要应用配置文件，请运行以下命令：

```bash
terraform apply -var-file desired_cluster_profile.tfvars
```

#### 高级 YAML 配置

我们将这项任务作了灵活设计。以下示例中的工作变量允许使用单个 `tfvars` 文件进行自定义。

对于具有严格要求的高级用户，这里是 DC/OS 标记示例，只需将您的 YAML 配置粘贴到 `desired_cluster_profile.tfvars` 即可。YAML 的替代方案是将其转换为 JSON。

```bash
$ cat desired_cluster_profile.tfvars
dcos_version = "1.10.2"
os = "centos_7.3"
num_of_masters = "3"
num_of_private_agents = "2"
num_of_public_agents = "1"
expiration = "6h"
dcos_security = "permissive"
dcos_cluster_docker_credentials_enabled =  "true"
dcos_cluster_docker_credentials_write_to_etc = "true"
dcos_cluster_docker_credentials_dcos_owned = "false"
dcos_cluster_docker_registry_url = "https://index.docker.io"
dcos_overlay_network = <<EOF
# YAML
    vtep_subnet: 44.128.0.0/20
    vtep_mac_oui: 70:B3:D5:00:00:00
    overlays:
      - name: dcos
        subnet: 12.0.0.0/8
        prefix: 26
EOF
dcos_rexray_config = <<EOF
# YAML
  rexray:
    loglevel: warn
    modules:
      default-admin:
        host: tcp://127.0.0.1:61003
    storageDrivers:
    - ec2
    volume:
      unmount:
        ignoreusedcount: true
EOF
dcos_cluster_docker_credentials = <<EOF
# YAML
  auths:
    'https://index.docker.io/v1/':
      auth: Ze9ja2VyY3licmljSmVFOEJrcTY2eTV1WHhnSkVuVndjVEE=
EOF
gcp_ssh_pub_key_file = "INSERT_PUBLIC_KEY_PATH_HERE"
```
<p class="message--note"><strong>注意: </strong> 设置 DC/OS 专用 YAML 需要 YAML 评论。</p>

## 升级 DC/OS

可以使用单个命令升级 DC/OS 集群。这种 Terraform 脚本用于执行安装和升级。通过以下升级程序，还可以更加精细地控制管理节点或代理节点在给定时间内如何升级。这将让您更改管理节点和代理节点升级的并行度。

### DC/OS 升级

#### 滚动升级

dcos.io 支持的升级

##### 管理节点顺序，代理节点并行：
```bash
terraform apply -var-file desired_cluster_profile.tfvars -var state=upgrade -target null_resource.bootstrap -target null_resource.master -parallelism=1
terraform apply -var-file desired_cluster_profile.tfvars -var state=upgrade
```

##### 所有角色同步
该命令不受 dcos.io 支持，但不启用 `dcos_skip_checks` 即可工作。

```bash
terraform apply -var-file desired_cluster_profile.tfvars -var state=upgrade
```

## 维护

若要从集群中添加或删除专用或公共代理，可以告知 Terraform 您的预期状态，它将进行必要更改。例如，如果您在 `-var-file` 中有两个专用代理和一个公共代理，就可以通过指定 `-var` 标记来覆盖上述标记。`var` 标记的优先级高于 `-var-file`。

### 添加代理

```bash
terraform apply \
-var-file desired_cluster_profile.tfvars \
-var num_of_private_agents=5 \
-var num_of_public_agents=3
```

### 删除代理
<p class="message--note"><strong>注意: </strong>切记，每次删除代理之前都要在 <tt>desired_cluster_profile.tfvars</tt> 保存需要的状态。</p>

```bash
terraform apply \
-var-file desired_cluster_profile.tfvars \
-var num_of_private_agents=1 \
-var num_of_public_agents=1
```

## 重新部署现有管理节点

若要重新部署一个有问题的管理节点（例如，您的存储已满，导致集群无响应），您可以在下一个循环命令 Terraform 进行重新部署。

<p class="message--note"><strong>注意: </strong> 这仅适用于已将 <tt>dcos_master_discovery</tt> 设置为 <tt>master_http_loadbalancer</tt> 而不是 <tt>static</tt> 的 DC/OS 集群。</p>

### 管理节点

#### Taint 管理节点

```bash
terraform taint google_compute_instance.master.0 # The number represents the agent in the list.
```

#### 重新部署管理节点

```bash
terraform apply -var-file desired_cluster_profile.tfvars
```

## 重新部署现有代理

若要重新部署一个有问题的代理，您可以在下一个循环命令 Terraform 进行重新部署。


### 专用代理

#### Taint 专用代理

```bash
terraform taint google_compute_instance.agent.0 # The number represents the agent in the list.
```

#### 重新部署代理

```bash
terraform apply -var-file desired_cluster_profile.tfvars
```


### 公共代理

#### Taint 专用代理

```bash
terraform taint google_compute_instance.public-agent.0 # The number represents the agent in the list
```

#### 重新部署代理

```bash
terraform apply -var-file desired_cluster_profile.tfvars
```

### 实验 [experimental type="inline" size="large" /]

#### 添加 GPU 专用代理

即将推出！

### 销毁集群

可以运行以下命令，关闭和/或销毁环境中的所有资源：

```bash
terraform destroy -var-file desired_cluster_profile.tfvars
```
