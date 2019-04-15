---
layout: layout.pug
excerpt: 使用 Mesosphere Universal 安装工具在 Azure 上的 DC/OS 指南
title: 使用 Universal 安装工具在 Azure 上的 DC/OS
navigationTitle: Azure
menuWeight: 2
---

要使用 Mesosphere Universal 安装工具配合 Azure，必须安装 Azure 命令行界面并配置为您将用于资源的帐户的安全凭据。以下操作说明将引导您完成必要的帐户创建和凭据，以便成功配置 Azure CLI 并安装 DC/OS。

## 前提条件

- Linux、macOS 或 Windows
- 命令行 shell 终端，例如 Bash 或 PowerShell
- 已验证具有必要权限的 Azure 资源管理器帐户

# 安装 Terraform

访问 [Terraform 下载页](https://www.terraform.io/downloads.html)，获得适用于 Linux、macOS 和 Windows 的捆绑安装和支持。

 如果您在安装了 [Homebrew](https://brew.sh/) 的 Mac 环境中，只需运行以下命令：

  ```bash
  brew install terraform
  ```

 已安装 [Chocolatey](https://chocolatey.org/docs/installation) 的 Windows 用户，请运行：

  ```bash
  choco install terraform -y
  ```

# 安装和配置 Azure CLI

1. 建立一个 [Azure 资源管理器帐户](https://azure.microsoft.com/en-us/free/)（如果您还没有建立）。确保至少有一个 [用户角色设置](https://docs.microsoft.com/en-us/azure/security-center/security-center-permissions)。

1. [安装 Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest) 指南，安装 `az` 并运行。对于 macOS 用户，可使用 Homebrew 实现：

    ```bash
    brew install azure-cli
    ```

1. 在您拥有 Azure CLI 后，需要用它来连接到您想要使用的帐户。如果您已经安装 CLI，则您可能已经设置了凭据。要设置您的凭据，或根据需要随时更新凭据，请运行：

    ```bash
    az login
    ```

 遵循任何指示，包括从浏览器登录，以启用 CLI。

1. 您可以通过列出您的帐户权限来确保登录：

    ```bash
    az account
    ```

   这将返回如下内容：

    ```bash
    $ az account
    [
      {
        "cloudName": "AzureCloud",
        "id": "12345678-abcd-efgh-9876-abc123456789",
        "isDefault": true,
        "name": "DC/OS Production Subscription",
        "state": "Enabled",
        "tenantId": "987654321-abcd-efgh-9876-abc123456789",
        "user": {
          "name": "myaccount@azuremesosphere.onmicrosoft.com",
          "type": "user"
        }
      }
    ]
    ```

1. 设置 `ARM_SUBSCRIPTION_ID`。适用于 Azure 的当前 Terraform 提供程序要求先设置默认 Azure 订阅，然后才能启动 terraform。请提供 Azure 订阅 ID。您可以使用以下命令设置默认帐户：

    ```bash
    export ARM_SUBSCRIPTION_ID="desired-subscriptionid"
    ```

    例如：

    ```bash
    export ARM_SUBSCRIPTION_ID="12345678-abcd-efgh-9876-abc123456789"
    ```

    确保设置完毕：

    ```bash
    echo $ARM_SUBSCRIPTION_ID
    ```

# 为群集设置 SSH 凭据

1. Terraform 使用 SSH 密钥对，安全地连接到它创建的群集。如果您已经有了一个密钥对，并已添加到您的 SSH 代理，则可以跳过此步骤。

    这将开始创建您的密钥对的交互式过程。将会要求您输入用来存储密钥的位置。例如，要在您的 `.ssh` 目录中设置新的密钥对：

    ```bash
    ssh-keygen -t rsa
    ```

    完整的流程看起来像这样：

    ```bash
    生成公共/专用 rsa 密钥对。
    输入用来保存密钥的文件 (/Users/<your-username>/.ssh/id_rsa）：~/.ssh/arm-demo-key
    输入密码（无密码时为空）：
    再次输入同一密码：
    您的身份标识已保存在 /Users/<your-username>/.ssh/arm-demo-key。
    您的公钥已保存在 /Users/<your-username>/.ssh/arm-demo-key。
    密钥指纹是：
    4a:dd:0a:c6:35:4e:3f:ed:27:38:8c:74:44:4d:93:67 your-email@here
    该密钥的 randomart 图像是：
    +-[ RSA 2048]----+
        |          .oo.   |
        |         .  o.E  |
        |        + .  o   |
        |     . = = .     |
        |      = S = .    |
        |     o + = +     |
        |      . o + o .  |
        |           . o   |
        |                 |
        +-----------------+
    ```

1. 将密钥添加到您的 SSH 代理。例如，在 macOS 上：

    ```bash
    ssh-add ~/.ssh/arm-demo-key
    ```

# 创建 DC/OS 群集

1. 首先，我们来创建一个本地文件夹并用 cd 命令进入该文件夹。此文件夹将用作下载所有必需的 Terraform 模块并保存您即将创建的群集的配置的预备区域。

    ```bash
    mkdir dcos-tf-azure-demo && cd dcos-tf-azure-demo
    ```

1. 在该文件夹中创建一个名为 `main.tf` 的文件，这是每次创建计划时 Mesosphere Universal 安装工具都会调用的配置文件。该文件的名称应始终是 `main.tf`。

    ```bash
    touch main.tf
    ```

1. 在您选择的代码编辑器中打开该文件，然后粘贴以下内容。注意代码块右上角的复制图标，可将代码复制到剪贴板：

    ```hcl
    variable "dcos_install_mode" {
      description = "specifies which type of command to execute. Options: install or upgrade"
      default = "install"
    }

    data "http" "whatismyip" {
      url = "http://whatismyip.akamai.com/"
    }

    module "dcos" {
      source  = "dcos-terraform/dcos/azurerm"
      version = "~> 0.1.0"

      dcos_instance_os    = "coreos_1855.5.0"
      cluster_name        = "my-dcos"
      ssh_public_key_file = "<path-to-public-key-file>"
      admin_ips           = ["${data.http.whatismyip.body}/32"]
      location            = "West US"

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

1. 有两个主要变量，必须设置这些变量才能完成 `main.tf`，您也可以在此时更改任何其他变量。

 1. `ssh_public_key_file = " <path-to-public-key-file>"`：您群集的公钥的路径，按照我们的示例，该路径为：
        ```bash
        "~/.ssh/arm-key.pub"
        ```

 1. `location = "West US"`：AzureRM 提供程序的实现方式强迫我们在模块中指定 `location`。如果您想使用不同的区域，请将 `location` 替换为您所需的区域。

1. 企业用户可以对该区段取消注释/添加注释，实现类似于以下注释，将该位置插入到许可证密钥。[enterprise type="inline" size="small" /]

    ```bash
    dcos_variant              = "ee"
    dcos_license_key_contents = "${file("./license.txt")}"
    # dcos_variant = "open"
    ```

1. 此示例配置文件将使您开始安装具有以下节点的开源 DC/OS 1.11.7 群集：

    - 1 个管理节点
    - 2 个专用代理
    - 1 个公共代理

    如果您想更改群集名称或改变管理/代理节点数量，也可以调整这些值。群集名称必须唯一，包含字母数字字符、'-'、'_' 或 '.'，开头和结尾均为字母数字字符，且不超过 24 个字符。您可以在此查阅其他 [输入变量及其描述](/cn/1.11/installing/evaluation/azure/advanced-azure/)。

    模块下方还列出一些简单的助手工具，可找到您的公共 IP，并指定在群集创建完成后应打印以下输出：

    - `master-ips` 您的 DC/OS 管理节点列表
    - `cluster-address` 在设置群集后用来访问 DC/OS UI 的 URL。
    - `public-agent-loadbalancer` 您的公共可路由服务的 URL。

1. 检查您是否已将云提供商和公钥路径插入到 `main.tf`，按需要更改或添加任何其他变量，然后保存并关闭您的文件。

1. 现在，开始实际创建群集和安装 DC/OS 的操作。首先，初始化项目的本地设置和数据。确保您仍在您创建 `main.tf` 文件的 `dcos-tf-azure-demo` 文件夹中工作，然后运行初始化。

    ```bash
    terraform init
    ```

    ```text
    Terraform has been successfully initialized!

    You may now begin working with Terraform. Try running "terraform plan" to see
    any changes that are required for your infrastructure. All Terraform commands
    should now work.

    If you ever set or change modules or backend configuration for Terraform,
    rerun this command to reinitialize your environment. If you forget, other
    commands will detect it and remind you to do so if necessary.
    ```

    <p class="message--note"><strong>注意：</strong>如果 Terraform 无法连接到您的提供程序，确保您已登录并导出凭据。请参阅 <a href="https://www.terraform.io/docs/providers/azurerm/#creating-credentials">Azure 提供程序</a>说明，了解更多信息。</p>

1. 在初始化 Terraform 之后，下一步是运行执行计划并将其保存到静态文件 - 在本例中，即 `plan.out`。

    ```bash
    terraform plan -out=plan.out
    ```

    将我们的执行计划写入文件允许我们将执行计划传递给以下 `apply` 命令，并帮助我们保证计划的准确性。请注意，此文件只能由 Terraform 读取。

    此后，我们应该看到类似下面的消息，确认我们已成功保存到 `plan.out` 文件。此文件应显示在您的 `dcos-tf-azure-demo` 文件夹中的 `main.tf` 旁边。

      <p align=center>
      <img src="./images/install/terraform-plan.png"/>
      </p>

    您每次运行 `terraform plan` 时，输出总是详细列出您的计划将要添加、更改或销毁的资源。由于我们是首次创建 DC/OS 群集，因此输出告诉我们，我们的计划将导致添加 38 件基础设施/资源。

1. 下一步是让 Terraform 构建/部署我们的计划。运行以下命令。

    ```bash
    terraform apply plan.out
    ```

 坐下来放松一下，等一等吧！您的 DC/OS 群集的基础架构正在您的注视下创建。这可能需要几分钟。

 在 Terraform 完成应用我们的计划后，您应该看到类似于下面的输出：

  <p align=center>
  <img src="./images/install/terraform-apply.png"/>
  </p>

 祝贺您，成功启动并运行！

# 登录 DC/OS

1. 要登录并开始浏览您的群集，请导航到 CLI 的输出中列出的 `cluster-address`。您可以从这里选择您的提供程序，创建超级用户帐户 [oss type="inline" size="small" /]，或使用您的特定企业凭据登录 [enterprise type="inline" size="small" /]。

<p align=center>
<img src="./images/install/dcos-login.png"/>
</p>

<p align=center>
<img src="./images/install/dcos-ui.png"/>
</p>

# 扩展群集
在创建初始群集后，TerraForm 很容易扩展您的群集以添加其他代理（公共或专用）。只需按以下说明操作。

1. 增加您的 `main.tf` 文件中的 `num_private_agents` 和/或 `num_public_agents` 的值。在本示例中，我们要将群集从 2 个专用代理扩展到 3 个，只更改该行，并保存文件。

    ```bash
    num_masters        = "1"
    num_private_agents = "3"
    num_public_agents  = "1"
    ```

1. 既然我们已经更改 `main.tf`，我们需要重新运行新的执行计划。

    ```bash
    terraform plan -out=plan.out
    ```

    这样做有助于我们确保状态稳定，并确认我们只会创建必要的资源，将我们的专用代理扩展到所需的数量。

      <p align=center>
      <img src="./images/scale/terraform-plan.png"/>
      </p>

    您应该看到类似以上内容的消息。扩展集群的专用代理的结果是，将会添加 3 个资源（1 个实例资源和 2 个空资源，在幕后处理 DC/OS 安装和先决条件）。

1. 现在，我们的计划已设置，就像前面一样，我们来让 Terraform 构建/部署该计划。

    ```bash
    terraform apply plan.out
    ```

    <p align=center>
    <img src="./images/scale/terraform-apply.png"/>
    </p>

 当您看到类似于以上消息的输出后，检查您的 DC/OS 群集，确保已添加其他代理。

 您现在应该看到总共 4 个通过 DC/OS UI 连接的节点，如下所示。

  <p align=center>
  <img src="./images/scale/node-count-4.png"/>
  </p>

# 升级群集

Terraform 还可以轻松地将我们的群集升级到更新版本的 DC/OS。如果您有兴趣了解有关 Terraform 执行的升级程序的更多信息，请参阅官方 [DC/OS 升级文档](/cn/1.11/installing/production/upgrading/)。

1. 为了执行升级，我们需要返回到我们的 `main.tf` 并将当前 DC/OS 版本 (`dcos_version`) 修改为较新版本，如本示例的 `1.11.8`，同时还需指定另一个参数 (`dcos_install_mode`)。默认情况下，此参数设置为 `install`，这就是我们在创建初始 DC/OS 群集和扩展群集时能够不设置该参数的原因。

    <p class="message--important"><strong>重要信息：</strong>在执行升级时，不要更改任何管理节点、代理或公共节点的数量。</p>

    ```hcl
    dcos_version = "1.11.8"
    ```

1. 重新运行该执行计划，通过设置在额外变量中读取的标记，暂时覆盖默认安装模式。

    ```bash
    terraform plan -out=plan.out -var dcos_install_mode=upgrade
    ```

    您应该看到如下的输出，`main.tf` 现在设置为在新版本的 DC/OS 上正常操作。

    <p align=center>
    <img src="./images/upgrade/terraform-plan.png"/>
    </p>

1. 应用该计划。

    ```bash
    terraform apply plan.out
    ```

 应用完成后，您可以验证群集是否已通过 DC/OS UI 升级。

  <p align=center>
  <img src="./images/upgrade/cluster-details-open.png"/>
  </p>

# 删除群集

如果想要销毁您的群集，则使用以下命令并等待其完成。

```bash
terraform destroy
```

<p class="message--important"><strong>重要信息：</strong>运行此命令将导致整个群集及其所有关联的资源被销毁。只有当您绝对确定不再需要访问您的群集时，才运行此命令。</p>

您需要输入 `yes` 进行验证。

<p align=center>
<img src="./images/destroy/terraform-destory.png"/>
</p>
