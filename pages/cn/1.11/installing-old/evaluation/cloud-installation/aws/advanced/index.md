---
layout: layout.pug
title: 在 AWS EC2 Advanced 上运行 DC/OS
navigationTitle: Advanced
menuWeight: 10
excerpt: 使用 AWS CloudFormation 模板创建和扩展 DC/OS 集群
---


可以使用 AWS CloudFormation 模板创建和扩展 DC/OS 集群。高级模板包括：
* 高度可自定义
* 可堆叠；例如，您可以将多个代理池部署到同一个集群
* 复杂；需要更多设置工作

高级 AWS CloudFormation 模板为创建和扩展 DC/OS 集群带来了优势和灵活性。通过这些模板，您可以从一整套 DC/OS 配置选项中进行选择。

 - 在现有的 VPC/子网组合上实例化完整的 DC/OS 集群。
 - 通过添加更多的 [代理](/cn/1.11/overview/concepts/#agent) 节点来扩展和更新现有的 DC/OS 集群。

模板一起用于创建 DC/OS 集群。驱动这些模板的是 AWS CloudFormation 用于创建每个堆栈的参数。

<p class="message--important"><strong>重要信息：</strong>此安装方法不支持升级。</p> 


## 先决条件

### 硬件

您必须有 AWS EC2 <a href="https://aws.amazon.com/ec2/pricing/" target="_blank">m3.xlarge</a> 实例。建议不要选择较小的 VM，而选择较少的 VM 可能会导致某些资源密集型服务（如分布式数据存储）无法正常工作。

### 软件
- `dcos_generate_config` 文件：
 * Enterprise 用户应使用 [dcos_generate_config file](https://support.mesosphere.com/hc/en-us/articles/213198586-Mesosphere-Enterprise-DC-OS-Downloads)。请联系销售代表或 <a href="mailto:sales@mesosphere.com">sales@mesosphere.com</a>，访问配置文件。[enterprise type="inline" size="small" /]
 * 开源用户应使用 [dcos_generate_config file](https://downloads.dcos.io/dcos/stable/dcos_generate_config.sh)。[oss type="inline" size="small" /]
- 带根 [IAM](https://aws.amazon.com/iam/) 权限的 Amazon Web Services 帐户。安装高级模板需要高级权限。如需更多信息，请联系 AWS 管理员。
- 与群集相同分域的 AWS EC2 密钥对。密钥对不能跨分域共享。AWS 密钥对使用公钥加密功能提供对 AWS 群集的安全登录。有关创建 AWS EC2 密钥对的详细信息，请参阅 <a href="http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html#having-ec2-create-your-key-pair" target="_blank">文档</a>。
- AWS [命令行界面](https://aws.amazon.com/cli/)。
- CLI JSON 处理器 [jq](https://github.com/stedolan/jq/wiki/Installation)。
- 符合 bootstrap 节点 [系统要求](/cn/1.11/installing/production/system-requirements/) 的节点。
- 具有读写访问权限的 AWS s3 bucket。
 - S3 bucket 必须具备 bucket 策略，以便让启动的 AWS 实例从 s3 bucket下载文件。以下是任何人均可下载的示例政策：

      ```json
      {
        "Version":"2012-10-17",
        "Statement":[
          {
            "Sid":"AddPerm",
            "Effect":"Allow",
            "Principal": "*",
            "Action":["s3:GetObject"],
            "Resource":["arn:aws:s3:::<bucket_name>/<bucket_path>/*"]
          }
        ]
      }
      ```

有关 s3 bucket 策略的详细信息，请参阅 [AWS 文档](http://docs.aws.amazon.com/AmazonS3/latest/dev/example-bucket-policies.html)。

# 创建模板

1. 在节点的主目录中创建名为 `genconf` 的目录，然后导航到该目录。

    ```bash
    mkdir -p genconf
    ```
1. 在 `genconf` 目录中创建配置文件并另存为 `config.yaml`。此配置文件指定您的 AWS 凭据以及用于存储生成的原图的 S3 位置。

    企业和开源用户所需的参数为：

[enterprise type="inline" size="small" /]

```

 aws_template_storage_bucket: <your-bucket>
 aws_template_storage_bucket_path: <path-to-directory>
 aws_template_upload: true
 aws_template_storage_access_key_id: <your-access-key-id>
 aws_template_storage_secret_access_key: <your-secret-access_key>
 cluster_name: <cluster-name>
 安全：[宽容|严格|禁用]
 superuser_password_hash: <hashed-password>
 superuser_username: <username>
 zk_super_credentials: <userid>:<password>
 zk_master_credentials: <userid>:<password>
 zk_agent_credentials: <userid>:<password>
```

[oss type="inline" size="small" /]
```

 aws_template_storage_bucket: <your-bucket>
 aws_template_storage_bucket_path: <path-to-directory>
 aws_template_upload: true
 aws_template_storage_access_key_id: <your-access-key-id>
 aws_template_storage_secret_access_key: <your-secret-access_key>
```

有关参数描述和配置示例，请参阅 [文档](/cn/1.11/installing/ent/custom/configuration/configuration-parameters/)。

1. 使用指定的 AWS 参数运行 DC/OS 安装工具脚本。此命令创建 DC/OS 原图和模板的自定义构造并将其上传到指定的 s3 bucket。

    [enterprise type="inline" size="small" /]

    ```bash
    sudo bash dcos_generate_config.ee.sh --aws-cloudformation
    ```

    [oss type="inline" size="small" /]

    ```bash
    sudo bash dcos_generate_config.sh --aws-cloudformation
    ```

    此 bucket 位置的根 URL 位于本步骤的末尾。您将看到以下消息：

    ```bash
    AWS CloudFormation templates now available at: https://<amazon-web-endpoint>/<path-to-directory>
    ```

1. 转到 [S3](https://console.aws.amazon.com/s3/home) 并导航至上述 ` 中的 s3 bucket<path-to-directory>`.

 1. 选择 **cloudformation**，然后选择管理节点所需数量的 zen 模板。例如，为单个管理配置选择 **el7-zen-1.json**。
 1. 右键单击并选择 **属性**，然后复制 AWS S3 模板 URL。
5. 转到 [CloudFormation](https://console.aws.amazon.com/cloudformation/home) 并单击 **创建堆栈**。
6. 在 **选择模板** 页面指定 Zen 模板的 AWS S3 模板 URL 路径。例如：

    ```
    https://s3-us-west-2.amazonaws.com/user-aws/templates/config_id/14222z9104081387447be59e178438749d154w3g/cloudformation/ee.el7-zen-1.json
    ```

# 创建模板依赖关系

使用 `zen.sh` 脚本创建模板依赖关系。这些依赖关系将用作在 CloudFormation 中创建堆栈的输入信息。

1. 将此脚本另存为 `zen.sh` 

    ```bash
    #!/bin/bash
    export AWS_DEFAULT_OUTPUT="json"
    set -o errexit -o nounset -o pipefail

    if [ -z "${1:-}" ]
    then
      echo Usage: $(basename "$0") STACK_NAME
      exit 1
    fi

    STACK_NAME="$1"
    VPC_CIDR=10.0.0.0/16
    PRIVATE_SUBNET_CIDR=10.0.0.0/17
    PUBLIC_SUBNET_CIDR=10.0.128.0/20

    echo "Creating Zen Template Dependencies"

    vpc=$(aws ec2 create-vpc --cidr-block "$VPC_CIDR" --instance-tenancy default | jq -r .Vpc.VpcId)
    aws ec2 wait vpc-available --vpc-ids "$vpc"
    aws ec2 create-tags --resources "$vpc" --tags Key=Name,Value="$STACK_NAME"
    echo "VpcId: $vpc"

    ig=$(aws ec2 create-internet-gateway | jq -r .InternetGateway.InternetGatewayId)
    aws ec2 attach-internet-gateway --internet-gateway-id "$ig" --vpc-id "$vpc"
    aws ec2 create-tags --resources "$ig" --tags Key=Name,Value="$STACK_NAME"
    echo "InternetGatewayId: $ig"

    private_subnet=$(aws ec2 create-subnet --vpc-id "$vpc" --cidr-block "$PRIVATE_SUBNET_CIDR" | jq -r .Subnet.SubnetId)
    aws ec2 wait subnet-available --subnet-ids "$private_subnet"
    aws ec2 create-tags --resources "$private_subnet" --tags Key=Name,Value="${STACK_NAME}-private"
    echo "Private SubnetId: $private_subnet"

    public_subnet=$(aws ec2 create-subnet --vpc-id "$vpc" --cidr-block "$PUBLIC_SUBNET_CIDR" | jq -r .Subnet.SubnetId)
    aws ec2 wait subnet-available --subnet-ids "$public_subnet"
    aws ec2 create-tags --resources "$public_subnet" --tags Key=Name,Value="${STACK_NAME}-public"
    echo "Public SubnetId: $public_subnet"
    ```

1. 运行 `zen.sh` 脚本，为指定 DC/OS 堆栈（`STACK_NAME`）设置可选标签值，或使用默认值 `dcos`。此值将用于在 AWS 中标记 DC/OS 集群。

    ```bash
    bash ./zen.sh <STACK_NAME>
    ```

    输出应如下所示：

    ```bash
    Creating Zen Template Dependencies
    VpcId: vpc-e0bd2c84
    InternetGatewayID: igw-38071a5d
    Private SubnetId: subnet-b32c82c5
    Public SubnetId: subnet-b02c55c4
    ```

 使用这些依赖值作为输入，在后续步骤中创建您在 CloudFormation 中的堆栈。

# <a name="launch"></a>在 CloudFormation 上启动模板

1. 转到 [CloudFormation](https://console.aws.amazon.com/cloudformation/home) 并单击 **创建堆栈**。

- 在 **选择模板** 页面，从您的工作站上传 [Zen](/cn/1.11/installing/evaluation/cloud-installation/aws/advanced/template-reference/#zen) 模板，然后单击 **下一步**。

    模板示例：

    - `https://s3-us-west-2.amazonaws.com/dcos/templates/dcos/config_id/6a7451f6dec/cloudformation/ee.el7-zen-1.json` [enterprise type="inline" size="small" /]

    - `https://s3-us-west-2.amazonaws.com/dcos/templates/dcos/config_id/6a7451f6dec/cloudformation/el7-zen-1.json` [oss type="inline" size="small" /]

2. 在 **指定详情**页面指定这些值，然后单击 **下一步**。

     ![AWS UI](/cn/1.11/img/aws-advanced-1.png)

    图 1. AWS Advanced Web 界面

 * **StackName** 指定集群名称。
 * **CustomAMI** 可选：指定 AMI ID。如需更多信息，请参阅 [使用自定义 AMI 进行安装](/cn/1.11/installing/evaluation/aws/advanced/aws-ami/)。
 * **InternetGateway** 指定 `zen.sh` 脚本的 `InternetGatewayID` 输出值。互联网网关 ID 必须附加于 VPC。该互联网网关用于所有节点向外互联网访问。
 * **KeyName** 指定 AWS EC2 密钥对。
 * **MasterInstanceType** 指定 AWS EC2 实例类型。推荐 <a href="https://aws.amazon.com/ec2/pricing/" target="_blank">m3.xlarge</a> 实例类型。
 * **PrivateAgentInstanceCount** 指定专用代理的数量。
 * **PrivateAgentInstanceType** 指定专用代理节点的 AWS EC2 实例类型。推荐 <a href="https://aws.amazon.com/ec2/pricing/" target="_blank">m3.xlarge</a> 实例类型。
 * **PrivateSubnet** 指定 `zen.sh` 脚本的 `Private SubnetId` 输出值。所有专用代理都将使用该子网 ID。
 * **PublicAgentInstanceCount** 指定公共代理的数量。
 * **PublicAgentInstanceType** 指定公共代理节点的 AWS EC2 实例类型。推荐 <a href="https://aws.amazon.com/ec2/pricing/" target="_blank">m3.xlarge</a> 实例类型。
 * **PublicSubnet** 指定 `zen.sh` 脚本的 `Public SubnetId` 输出值。所有公共代理都将使用该子网 ID。
 * **Vpc** 指定 `zen.sh` 脚本的 `VpcId` 输出值。所有节点都将使用该 VPC 项下的子网和互联网网关启动。

3. 在 **选项** 页面，接受默认值，然后单击 **下一步**。

    <p class="message--note"><strong>注意: </strong>您可以选择是否退回查看故障。默认情况下，此选项设置为 <strong>是</strong>。</p>

4. 在 **查看** 页面，选中确认框，然后单击 **创建**。

    <p class="message--note"><strong>注意: </strong>如果显示 **创建新堆栈** 页面，要么是 AWS 仍在处理您的请求，要么就是您查看的是其他分域。导航至正确的分域并刷新页面以查看您的堆栈。</p>

# 监控 DC/OS 集群聚合过程

在 CloudFormation 中，您会看到：

* 集群堆栈启动需要 15 到 20 分钟时间。您将为其逐个创建堆栈，其中<stack-name>` is the value you specified for **Stack name** and `<stack-id>` 是自动生成的 ID。

  ![AWS UI](/cn/1.11/img/aws-advanced-2.png)

  图 2. AWS 堆栈详细信息

* Zen 模板： `<stack-name>`
* 公共代理： `<stack-name>-PublicAgentStack-<stack-id>`
* 专用代理：`<stack-name>-PrivateAgentStack-<stack-id>`
* 管理节点： `<stack-name>-MasterStack-<stack-id>`
* 基础架构： `<stack-name>-Infrastructure-<stack-id>`

* 状态从 `CREATE_IN_PROGRESS` 变为 `CREATE_COMPLETE`。

<p class="message--important"><strong>重要信息：</strong>ROLLBACK_COMPLETE 状态表示部署失败。如需实用故障信息，请参阅“事件”选项卡。</p> 


# 启动 DC/OS

可以通过输入管理节点主机名启动 DC/OS Web 界面。按照以下说明查找 Mesos 管理节点主机名。

1. 在 <a href="https://console.aws.amazon.com/cloudformation/home" target="_blank">AWS CloudFormation 管理</a> 页面，单击选中堆栈旁边的复选框。

1. 单击 **输出**选项卡，复制/粘贴 Mesos 管理节点主机名，打开 DC/OS Web 界面。该界面在标准 HTTP 端口 80 上运行，因此无需在主机名后指定端口号。

    <p class="message--note"><strong>注意：</strong> 可能需要调整窗口大小以查看此选项卡。可以随时在<a href="https://console.aws.amazon.com/cloudformation/home" target="_blank"> AWS CloudFormation 管理</a>页面找到 DC / OS 主机名。</p>

    ![Monitor stack creation](/cn/1.11/img/dcos-aws-step3a.png)

    图 3. Mesos 管理节点主机名

1. 单击 **登录到 DC/OS**。

    <p class="message--important"><strong>重要信息：</strong>单击“登录到 DC/OS”，浏览器就会显示您的连接不安全的警告。这是因为 DC/OS 使用自签名证书。可以忽略该错误，然后单击以继续。</p> 


   ![UI installer success](/cn/1.11/img/gui-installer-success-ee.gif)

   图 4. 操作成功的画面

4. 输入超级用户帐户的用户名和密码。

    <p class="message--note"><strong>注意：</strong> 默认用户名为 <tt>bootstrapuser</tt>，默认密码为 <tt>deleteme</tt>。</p>

    ![alt text](/cn/1.11/img/ui-installer-auth2.png)

    图 5. 登录画面

    成功了！

    ![UI dashboard](/cn/1.11/img/dashboard-ee.png)

    图 6. DC/OS 仪表板

# 后续步骤

您的高级模板 DC/OS 安装已启动并运行，您可以添加更多代理节点。

### 添加更多代理节点

可以通过创建新的堆栈来添加更多代理节点。使用 [advanced-priv-agent.json](/cn/1.11/installing/evaluation/cloud-installation/aws/advanced/template-reference/#private-agent) 或 [advanced-pub-agent.json](/cn/1.11/installing/evaluation/cloud-installation/aws/advanced/template-reference/#public-agent) 模板。这些模板创建代理，然后作为 AutoScalingGroup 的一部分附加到 `PrivateAgentStack` 或 `PublicAgentStack`。

使用 `zen.sh` 脚本以及管理节点和基础架构堆栈的输出值。这些新的代理节点将自动添加到您的 DC/OS 集群。

专用代理：

* **InternalMasterLoadBalancerDnsName** 指定 `InternalMasterLoadBalancerDnsName` 主栈的值 (`<stack-name>-MasterStack-<stack-id>`)。可以在 **输出** 选项卡中找到此值。
* **KeyName** 指定 AWS EC2 密钥对。
* **PrivateAgentInstanceCount** 指定专用代理的数量。
* **PrivateAgentInstanceType** 指定专用代理节点的 AWS EC2 实例类型。推荐 <a href="https://aws.amazon.com/ec2/pricing/" target="_blank">m3.xlarge</a> 实例类型。
* **PrivateAgentSecurityGroup** 指定专用代理的安全组 ID。该组具备有限的外部访问权限。可以在基础架构堆栈的 **输出** 选项卡中找到此值 (`<stack-name>-Infrastructure-<stack-id>`).
* **PrivateSubnet** 指定 `zen.sh` 脚本的 `Private SubnetId` 输出值。所有专用代理都将使用该子网 ID。

公共代理：

* **InternalMasterLoadBalancerDnsName** 指定 `InternalMasterLoadBalancerDnsName` 主栈的值 (`<stack-name>-MasterStack-<stack-id>`)。可以在 **输出** 选项卡中找到此值。
* **KeyName** 指定 AWS EC2 密钥对。
* **PublicAgentInstanceCount** 指定公共代理的数量。
* **PublicAgentInstanceType** 指定公共代理节点的 AWS EC2 实例类型。推荐 <a href="https://aws.amazon.com/ec2/pricing/" target="_blank">m3.xlarge</a> 实例类型。
* **PublicAgentSecurityGroup** 指定公共代理的安全组 ID。该组具备有限的外部访问权限。可以在基础架构堆栈的 **输出** 选项卡中找到此值 (`<stack-name>-Infrastructure-<stack-id>`).
* **PublicSubnet** 指定 `zen.sh` 脚本的 `Public SubnetId` 输出值。所有公共代理都将使用该子网 ID。

对于所有高级配置选项，请参阅模板参考 [文档](/cn/1.11/installing/evaluation/cloud-installation/aws/advanced/template-reference/)。


# 限制

- 升级不支持经过修改的模板。
- 不支持添加代理和任务隔离。
- 无法扩展管理节点大小。
- 您必须处于扁平网络空间（由我们的基础架构模板控制）。如果无法使用我们的基础架构模板，您可能遭受非法入侵且需自行承担风险。我们可能会更改基础架构模板，您必须支持此类后续变更。


# 模板参考
如需完整的高级配置选项，请参阅模板参考 [文档](/cn/1.11/installing/evaluation/cloud-installation/aws/advanced/template-reference/)。
