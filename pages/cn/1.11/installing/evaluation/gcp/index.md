---
layout: layout.pug
excerpt: 使用 Universal 安装工具在 GCP 上的 DC/OS 指南
title: 使用 Universal 安装工具在 GCP 上部署 DC/OS
navigationTitle: GCP
menuWeight: 4
---

您可以使用 Universal 安装工具在 Google Cloud Platform (GCP) 上创建 DC/OS 群集，进行评估或生产部署。**GCP 上的 Universal 安装工具** 安装方法受到 Mesosphere 官方支持。使用此安装方法还支持升级。

如果您不熟悉 Terraform，并想以最少的配置或自定义在 GCP 上部署 DC/OS，以下任务概括了基本安装过程：

1) 在 GCP 上创建开源 DC/OS 群集。
2) 扩展群集以增加部署的节点数。
3) 升级群集以使用更新版本的 DC/OS。
4) 销毁群集和所有与其相关的 GCP 资源。

# 先决条件
- Terraform
- 云凭据
- SSH 密钥

## 安装 Terraform

1. 访问 [Terraform 下载页](https://www.terraform.io/downloads.html)，获得适用于 Linux、macOS 和 Windows 的捆绑安装和支持。

 如果您在安装了 [Homebrew](https://brew.sh/) 的 Mac 环境中，只需运行以下命令：

    ```bash
    brew install terraform
    ```

 已安装 [Chocolatey](https://chocolatey.org/docs/installation) 的 Windows 用户，请运行：

    ```bash
    choco install terraform -y
    ```

## 获取用于认证的应用程序默认凭据
您必须有 [应用程序默认凭据](https://cloud.google.com/sdk/gcloud/reference/auth/application-default/login) 以便 GCP 提供程序对 GCP 进行认证。

要接收应用程序默认凭据：
1) 运行以下命令：

  ```bash
  $ gcloud auth application-default login
  ```

2) 通过运行以下命令验证您是否有应用程序默认凭据：

  ```bash
  $ gcloud auth application-default print-access-token
  EXMAPLE.EXAMPLE-1llO--ZEvh6gQ-qhpL0I3gHcCeDKG_EXAMPLE7WtAepmpp47c0RCv9e0Oq6QnpQ79RZlHKzOw69XMxI87M2Q
  ```

## 设置 GCP 默认区域和项目
GCP 提供程序要求您将区域 (`desired-gcp-region`) 和项目 (`desired-gcp-project`) 标识符导出到环境变量中，即使这些值在 `gcloud-cli` 中设置。例如：

```bash
export GOOGLE_REGION="us-west1"
export GOOGLE_PROJECT="production-123"
```

您可以通过运行以下命令验证区域和项目设置：

```bash
> echo $GOOGLE_REGION
us-west1

> echo $GOOGLE_PROJECT
production-123
```

## 验证您有企业版的许可证密钥
DC/OS 企业版还需要由 Mesosphere 提供的有效许可证密钥，该密钥将作为 `dcos_license_key_contents` 传递到 `main.tf` 配置文件中。使用默认超级用户和密码登录：

用户名：`bootstrapuser`<br>
密码：`deleteme`

<p class="message--important"><strong>重要信息：</strong>您不应在生产环境中使用默认凭据。当您创建或确定用于生产环境的管理帐户时，还需要为该帐户生成密码哈希值。</p>

# 创建群集
1) 创建本地文件夹。

    ```bash
    mkdir dcos-tf-gcp-demo && cd dcos-tf-gcp-demo
    ```

1) 将以下示例代码复制并粘贴到新文件中，并将其保存为本地文件夹中的 `main.tf`。

    下面的示例代码在 GCP 上创建一个 DC/OS OSS 1.11.7 群集，其中包括：
    - 1 个管理节点
    - 2 个专用代理
    - 1 个公共代理

    该示例还指定在群集创建完成后，应打印以下输出：
      - ```masters-ips``` - 列出 DC/OS 管理节点。
      - ```cluster-address``` - 指定在设置群集后用来访问 DC/OS UI 的 URL。
      - ```public-agent-loadbalancer``` - 指定您的公共可路由服务的 URL。

      ```hcl
      variable "dcos_install_mode" {
        description = "specifies which type of command to execute. Options: install or upgrade"
        default = "install"
      }

      module "dcos" {
        source = "dcos-terraform/dcos/gcp"

        cluster_name        = "my-open-dcos"
        ssh_public_key_file = "~/.ssh/id_rsa.pub"

        num_masters        = "1"
        num_private_agents = "2"
        num_public_agents  = "1"

        dcos_version = "1.11.7"

        # dcos_variant              = "ee"
        # dcos_license_key_contents = "${file("./license.txt")}"
        dcos_variant = "open"

        dcos_install_mode = "${var.dcos_install_mode}"
      }

      output "masters-ips" {
        value       = "${module.dcos.masters-ips}"
      }

      output "cluster-address" {
        value       = "${module.dcos.masters-loadbalancer}"
      }

      output "public-agents-loadbalancer" {
        value = "${module.dcos.public-agents-loadbalancer}"
      }
      ```

    在本示例中，为了简化操作，配置值为硬编码。如果您有所需的群集名称或管理/代理节点数，则可以直接在 `main.tf` 配置文件中调节这些值。

    您可以 [在此](http://registry.terraform.io/modules/dcos-terraform/dcos/gcp/) 查找其他输入变量及其描述。

1) 如果需要，更改到您刚才创建 `main.tf` 文件所在的 `dcos-tf-gcp-demo` 文件夹。

    ```bash
    cd dcos-tf-gcp-demo
    ```

1) 初始化 Terraform 模块。

    ```bash
    terraform init
    ```

    您应该看到类似以下内容的确认消息：

    <p align=center><img src="./images/install/terraform-init.png"/></p>

1) 运行该执行计划并将其保存到静态文件中。例如，将输出保存在 `plan.out` 文件中。

    ```bash
    terraform plan -out=plan.out
    ```

    将执行计划写入文件让您将执行计划传递给 `apply` 命令，并保证计划的准确性。每次运行 `terraform plan` 命令，其输出都提供关于该计划将会添加、更改或销毁的资源的详细信息。由于本示例安装创建第一个 DC/OS 群集，输出表明执行该计划添加了 38 件基础架构/资源。

    在 `dcos-tf-gcp-demo` 文件夹中的 `main.tf` 文件旁边创建了计划输出文件。但是，此文件 **只能** 由 Terraform 读取。

    与以下类似的消息确认您已成功将执行计划保存到 `plan.out` 文件。
      <p align=center> <img src="./images/install/terraform-plan.png"/></p>

1) 运行以下命令来部署构建群集的计划：

    ```bash
    terraform apply plan.out
    ```

  在 Terraform 完成应用计划后，您应该看到类似于下面的输出：
    <p align=center><img src="./images/install/terraform-apply.png"/></p>

### 祝贺您！
您以最少的配置或自定义在 GCP 上成功安装了 DC/OS 群集。从这里，您可以登录以开始使用新群集。

<p align=center>
<img src="./images/install/dcos-login.png"/>
</p>

登录后，将会显示 DC/OS 仪表板。

<p align=center>
<img src="./images/install/dcos-ui.png"/>
</p>

有关使用更多高级配置选项在 GCP 上创建群集的更多信息，请参阅 [高级 GCP 群集配置选项](#AdvancedGCP)。

# 扩展群集
在创建初始群集后，TerraForm 很容易扩展您的群集以添加更多代理（公共或专用）。使用以下操作说明。

1) 增加您的 `main.tf` 文件中的 `num_private_agents` 和/或 `num_public_agents` 的值。在此示例中，您将群集从 `two` 个专用代理扩展到 `three` 个专用代理。

    ```hcl
    variable "dcos_install_mode" {
      description = "specifies which type of command to execute. Options: install or upgrade"
      default = "install"
    }

    module "dcos" {
      source = "dcos-terraform/dcos/gcp"

      cluster_name        = "my-open-dcos"
      ssh_public_key_file = "~/.ssh/id_rsa.pub"

      num_masters        = "1"
      num_private_agents = "3"
      num_public_agents  = "1"

      dcos_version = "1.11.7"

      # dcos_variant              = "ee"
      # dcos_license_key_contents = "${file("./license.txt")}"
      dcos_variant = "open"

      dcos_install_mode = "${var.dcos_install_mode}"
    }

    output "masters-ips" {
      value       = "${module.dcos.masters-ips}"
    }

    output "cluster-address" {
      value       = "${module.dcos.masters-loadbalancer}"
    }

    output "public-agents-loadbalancer" {
      value = "${module.dcos.public-agents-loadbalancer}"
    }
    ```

1) 通过您对 `main.tf` 配置文件做出的更改，重新运行新执行计划。

      ```bash
      terraform plan -out=plan.out
      ```

      此步骤确保状态稳定，并确认您可以创建必要的资源，将专用代理扩展到所需的数量。执行该计划，会因扩展群集的专用代理，而添加以下资源：
    - 一个实例资源
    - 两个空资源，在后台处理 DC/OS 安装和先决条件。

      您应该看到类似以下内容的消息：
      <p align=center><img src="./images/scale/terraform-plan.png"/></p>

1) 运行以下命令，使 Terraform 部署新的资源集：

      ```bash
      terraform apply plan.out
      ```

      您应该看到类似以下内容的输出：
      <p align=center><img src="./images/scale/terraform-apply.png"/></p>

1) 使用 DC/OS UI 检查您的 DC/OS 群集，确认添加了其他代理。

    您应该看到总共连接了 `four` 个节点。例如：
      <p align=center><img src="./images/scale/node-count-4.png"/></p>

# 升级群集
Terraform 还可以轻松地将 DC/OS 群集升级到更新版本的 DC/OS。

在官方 [DC/OS 升级](https://docs.mesosphere.com/1.11/installing/production/upgrading/) 文档中了解有关 Terraform 执行的升级程序的更多信息。

要执行升级：

1) 打开 `main.tf` 配置文件。
2) 将当前 DC/OS 版本 (`dcos_version`) 修改为 `1.11.8` 并将 `dcos_install_mode` 参数设置为 `upgrade`。

 默认情况下，`dcos_install_mode` 参数值为 `install`，使您能够创建初始 DC/OS 群集并进行扩展，而无需明确地设置其值。但是，要升级现有群集，您必须明确将参数值设置为 `upgrade`。

<p class="message--important"><strong>重要信息：</strong>在执行升级时，不要更改管理节点、代理或公共节点的数量。</p>

  ```hcl
  variable "dcos_install_mode" {
    description = "specifies which type of command to execute. Options: install or upgrade"
    default = "install"
  }

  data "http" "whatismyip" {
    url = "http://whatismyip.akamai.com/"
  }

  module "dcos" {
    source = "dcos-terraform/dcos/gcp"

    cluster_name        = "my-open-dcos"
    ssh_public_key_file = "~/.ssh/id_rsa.pub"
    admin_ips           = ["${data.http.whatismyip.body}/32"]

    num_masters        = "1"
    num_private_agents = "3"
    num_public_agents  = "1"

    dcos_version = "1.11.8"

    # dcos_variant              = "ee"
    # dcos_license_key_contents = "${file("./license.txt")}"
    dcos_variant = "open"

    dcos_install_mode = "${var.dcos_install_mode}"
  }

  output "masters-ips" {
    value       = "${module.dcos.masters-ips}"
  }

  output "cluster-address" {
    value       = "${module.dcos.masters-loadbalancer}"
  }

  output "public-agents-loadbalancer" {
    value = "${module.dcos.public-agents-loadbalancer}"
  }
  ```

3) 重新运行新执行计划。

  ```bash
  terraform plan -out=plan.out -var dcos_install_mode=upgrade
  ```

 您应该看到类似以下内容的输出：
  <p align=center><img src="./images/upgrade/terraform-plan.png"/></p>

4) 运行以下命令以应用计划。

  ```bash
  terraform apply plan.out
  ```

5) 使用 DC/OS UI 验证群集是否已升级。
  <p align=center><img src="./images/upgrade/cluster-details-open.png"/></p>

# 维护群集
有关如何维护群集的说明，请遵循 [维护](https://github.com/dcos-terraform/terraform-gcp-dcos/tree/master/docs/maintain) 文档。

# 删除群集
如果想要销毁您的群集，请运行以下命令并等待其完成：

```bash
terraform destroy
```

<p class="message--note"><strong>注意：</strong>此命令将删除整个群集和所有其关联的资源。只有当您绝对确定不再需要访问您的群集时，才执行此命令。</p>

如果您想要销毁群集，请输入 `yes`。
<p align=center><img src="./images/destroy/terraform-destory.png"/>
</p>
