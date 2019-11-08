---
layout: layout.pug
navigationTitle: 包注册表
title: 包注册表
menuWeight: 50
excerpt: 使用 Web 界面或 CLI 管理包资源库
enterprise: true
render: mustache
model：/mesosphere/dcos/1.13/data.yml
---

<!-- The source repo for this topic is https://github.com/dcos/dcos-docs-site -->

DC/OS 预配置了 {{ model.packageRepo }}](https://github.com/mesosphere/universe) 包资源库作为 DC/OS 包的提供程序。但这是假设有互联网访问，而这种假设并非总是可能的。对于气隙环境，DC/OS Enterprise 提供包注册表，以便对包进行灵活无缝的管理。

有关 DC/OS 包注册表可用配置选项的完整列表，请使用以下命令获取：

```bash
dcos package describe package-registry --config
```
您可以在 [CLI 文档](/mesosphere/dcos/1.13/cli/command-reference/dcos-package/)中找到有关 `dcos package` 命令的更多信息。

有关如何配置和部署 DC/OS 服务的详细说明，请参阅 [配置 {{ model.packageRepo }} 服务](/mesosphere/dcos/1.13/deploying-services/config-universe-service/)。

# 默认安装

包注册表可以通过执行以下命令来立即激活：

```bash
# Install the package-registry CLI
dcos package install package-registry --cli --yes

# Activate the package-registry with default options
dcos registry activate
```

`registry activate` 命令使用默认选项，如果您在生产环境中安装，则 **不推荐** 使用。阅读其余部分以创建选项文件，然后通过执行以下命令激活包注册表：

```bash
dcos registry activate --options=<custom-options-file>
```

# 配置
如果您具有先前安装之一的配置文件，则可以跳过本部分，然后继续进行安装包注册表的下一部分。

在部署期间，可以使用以下选项来配置包注册表：

1. [存储选项](#storage-options)（本地存储或挂载卷或 S3 兼容存储）
1. [服务命名空间和密钥](#service-namespacing and-secrets)

如果您具有先前安装之一的配置文件，则可以跳过本部分，然后继续进行安装包注册表的下一部分。

## 存储选项

包注册表可配置为使用以下内容之一：
1. [本地存储](#local-storage)
1. [挂载卷](#mount-volume-option) 或
1. [S3 兼容存储](#S3-Storage-option)

### 本地存储

包注册表默认使用本地存储，**不推荐** 用于生产使用。配置用于生产使用的持久卷或 S3 兼容存储。如果您将此用于开发目的并希望使用本地存储，请跳至下一部分。

### 挂载卷选项

在 DC/OS 上创建挂载卷，请参阅[装载卷](/mesosphere/dcos/1.13/storage/mount-disk-resources/)文档，其中包括创建回送设备的示例。本指南的其余部分假定您的挂载卷已创建在 `/dcos/package-registry` 上。您必须指定 `container-path` 和 `pinned-hostname`，它是指挂载卷的代理的主机名。可以使用以下选项配置 `package-registry` 以使用挂载卷：

```json
{
    "registry": {
        "mount-volume": {
            "container-path": "package-registry",
            "pinned-hostname": "a.specific.node.com"
        }
    }
}
```

### S3 存储选项

如果是 DC/OS 包注册表的默认配置，则 DC/OS 包存储在主机文件系统的本地持久卷中。使用此默认存储配置时，您仅限使用注册表的一个实例。包注册表还可通过在 S3 兼容存储上存储 DC/OS 包支持高可用性配置，这支持部署多个注册表实例。

要使用 S3 存储配置 DC/OS 包注册表以存储 DC/OS 包，您必须提供以下详细信息：
  1. 特定的 S3 端点。
  2. S3 bucket 名称和路径。
  3. S3 访问密钥和秘密密钥。

#### S3 端点详细信息

使用 Amazon S3 时，请参考 [Amazon S3 分域和端点](https://docs.aws.amazon.com/general/latest/gr/rande.html#s3_region)，了解有关潜在端点的详细信息。包注册表已经过测试，并且已知可与 Amazon S3 和 Minio 存储配合使用。它可以与任何其他 S3 兼容存储配合使用。如果您遇到与其他 S3 兼容存储连接的问题，请联系 Mesosphere 服务支持。

#### S3 bucket 名称和路径

S3 bucket 名称和 bucket 内路径的组合对于包注册表的每个部署都应该是唯一的。每个部署的多个实例都将确保同步访问此 bucket。

#### 将 S3 凭据上传到 DC/OS 密钥存储库

创建（或使用现有文件）S3 凭据文件，并使用它在 DC/OS 中创建基于文件的密钥。

```bash
dcos security secrets create -f ~/.aws/credentials dcos-registry-s3-credential-file
```

有关如何创建 AWS 凭据文件的信息，请参阅 [AWS CLI 用户指南](https://docs.aws.amazon.com/cli/latest/userguide/cli-config-files.html)。

最终 `s3` 配置应该如下所示：

```json
{
    "registry": {
        "s3": {
            "credential-secret-path" : "dcos-registry-s3-credential-file",
            "credential-profile-name" : "default",
            "bucket" : "my-bucket",
            "path" : "my-path-in-bucket",
            "endpoint" : "https://s3.us-east-1.amazonaws.com"
        }
    }
}
```

<p class="message--note"><strong>注意：</strong>您必须覆盖 <tt>bucket</tt>、<tt>路径</tt>和<tt>端点</tt>等属性的值才能匹配 S3 配置。</p>

## 服务命名空间和密匙

默认情况下，包注册表作为 Marathon 应用程序安装，`dcos-registry` 作为其 ID。该名称具有独特的重要性，因为代理上的 `dockerd` 已配置为信任位于 `dcos-registry.marathon.l4lb.thisdcos.directory:443` 的包注册表实例。如果您决定更改该名称，您需要配置 `dockerd` 以信任注册表部署在 `<your-custom-name>.marathon.l4lb.thisdcos.directory:443` 的自定义名称。例如，如果您在 `/my/custom/dcos-registry` 命名空间下安装包注册表，则确保注册表在 `https://mycustomdcos-registry.marathon.l4lb.thisdcos.directory` （群集内部）处是可访问的：

```bash
curl -k https://mycustomdcos-registry.marathon.l4lb.thisdcos.directory
{"checks":{"/repo":{"Healthy":{"message":"Able to find 0 package(s)."}}}}
```

您还必须要求 `dockerd` 信任上述域名。要配置 `dockerd` 以信任 `mycustomdcos-registry.marathon.l4lb.thisdcos.directory` 处的包注册表 ，请执行以下命令：

```bash
sudo mkdir -p /etc/docker/certs.d/mycustomdcos-registry.marathon.l4lb.thisdcos.directory
sudo cp /run/dcos/pki/CA/ca-bundle.crt /etc/docker/certs.d/mycustomdcos-registry.marathon.l4lb.thisdcos.directory/ca.crt
sudo systemctl restart docker
```

<!-- TODO : Add more details on verification -->

### 设置服务帐户和密匙

DC/OS 包注册表需要通过一个服务帐户在 DC/OS Enterprise 中运行。使用以下步骤创建具有基本权限的服务帐户。

1. 使用 DC/OS Enterprise CLI：

    ```bash
    dcos package install dcos-enterprise-cli --yes
    ```

1. 为服务帐户创建专用/公共密钥对：

    ```bash
    dcos security org service-accounts keypair private-key.pem public-key.pem
    ```

1. 创建服务帐户：

    ```bash
    dcos security org service-accounts create -p public-key.pem -d "dcos_registry service account" registry-account
    ```

1. 在密钥存储库存储专用钥匙：

    ```bash
    dcos security secrets create-sa-secret --strict private-key.pem registry-account registry-private-key
    ```

1. 对服务帐户进行全面授权：

    ```bash
    dcos security org users grant registry-account dcos:adminrouter:ops:ca:rw full
    ```

<p class="message--important"><strong>重要信息：</strong>与服务帐户相关联的密钥信息存储在 DC/OS 密钥存储库中名为 <tt>registry-private-key</tt> 的路径中。如要使用不同的文件名，请替换 <tt>registry-private-key</tt>。 </p>

<p class="message--warning"><strong>警告：</strong>这些指令在本地文件系统上创建两个敏感文件：<tt>private-key.pem</tt> 和 <tt>public-key.pem</tt>。请务必将这些文件保存在安全的地方或将其删除。在 DC/OS 密钥存储库中存储之后就不需要再保留它们了。 </p>

服务 `instances`、`cpus`、`mem` 和 `disk` 也可根据需要进行配置。执行以下命令以查看所有配置选项的详尽列表：

```bash
dcos package describe package-registry --config
```

以下是服务的示例配置文件：

```bash
> cat package-registry-options.json
{
    "registry": {
        "s3": {
            "credential-secret-path" : "dcos-registry-s3-credential-file",
            "credential-profile-name" : "default",
            "bucket" : "my-bucket",
            "path" : "my-path-in-bucket",
            "endpoint" : "https://s3.us-east-1.amazonaws.com"
        },
        "service-account-secret-path" : "dcos-registry-secret"
    },
    "service": {
        "mem" : 2048,
        "instances" : 2
    }
    "
}
```

# 安装

现在您已成功创建配置文件（从此处开始被称为 `package-registry-options.json`），您已准备好安装包注册表。这可以通过以下方式实现：

```bash
dcos package install package-registry --options=package-registry-options.json
```

这将为 `package-registry` 启动 Marathon 应用程序。这通常需要几分钟。一旦 `package-registry` 运行良好，您可以将其添加作为 DC/OS 中的包资源库之一。这可以通过以下方式完成：

```bash
# Change the repo name and URL if you need to customize
dcos package repo add --index=0 "Registry" https://dcos-registry.marathon.l4lb.thisdcos.directory/repo
```

如果在上述命令中发生错误，等待几分钟（以考虑 `package-registry` 良好运行的延迟以及其 DNS 条目传播到所有管理节点的情况）并重试。

# 使用包注册表

在 `package-registry` 安装后，您可以开始向其添加包。使用包注册表的两步过程如下：

1. 构建包文件（`.dcos` 文件）
2. 将包上传至 `package-registry`。


## 构建包

Mesosphere 将其所有已认证包托管在 [downloads.mesosphere.com/universe/packages/packages.html](https://downloads.mesosphere.com/universe/packages/packages.html)。如果您需要的包可用，您可以下载并跳转至下一个部分，以将这些 `.dcos` 文件上传到您的群集。当 {{ model.packagerepo }} 包正在开发中并且您希望在创建拉取请求前对其进行测试，或者如果您希望构建非认证（社区）包，此部分非常有用。

### 要求

1. 确保您拥有有效的 {{ model.packagerepo }} 包定义文件 ([Schema](https://github.com/mesosphere/universe/tree/version-3.x/repo/meta/schema))。请注意，`package-registry` 仅支持使用 v4 或 {{ model.packagerepo }} 打包系统的更高模式打包的包。请参阅 [创建包](https://github.com/mesosphere/universe#creating-a-package)，了解更多详细信息。
1. `docker` 安装在系统中（**如果** 您的包使用 Docker 镜像）。
1. 包注册表 CLI 也需要安装。实现这一点有两种方法。
   1. 从 DC/OS 群集中安装 `package-registry` CLI。
      ```bash
      # Install CLI subcommand "registry"
      dcos package install --cli package-registry
      # Make sure the subcommand works
      dcos registry --help
      ```

   1. 如果您无权访问 DC/OS 群集（例如在 CI/CD 中），请下载 [Linux](https://downloads.mesosphere.io/package-registry/binaries/cli/linux/x86-64/latest/dcos-registry-linux)、[MACOS](https://downloads.mesosphere.io/package-registry/binaries/cli/darwin/x86-64/latest/dcos-registry-darwin) 或 [Windows](https://downloads.mesosphere.io/package-registry/binaries/cli/windows/x86-64/latest/dcos-registry-windows.exe)的 `package-registry`CLI

      ```bash
      # Change the URL based on macOS, linux or windows accordingly.
      curl -o dcos-registry https://downloads.mesosphere.io/package-registry/binaries/cli/darwin/x86-64/latest/dcos-registry-darwin
      # Give executable permissions to downloaded binary
      chmod +x dcos-registry
      # Make sure the executable works
      ./dcos-registry registry --help
      ```
      在本页的其余说明中，我们假设您已从附加的 DC/OS 群集下载了子命令。如果不是这样，在您的说明中将 `dcos` 替换为 `./dcos-registry`。

### 生成 `.dcos` 捆绑包的说明

`package-registry`CLI 可用于将包捆绑到 `.dcos` 文件，该文件可以被 `package-registry` 使用。假设 {{ model.packagerepo }} 包文件位于名为 `/path/to/package/` 的目录中。它应包含以下包定义文件：

```
➜ tree
.
├── config.json
├── marathon.json.mustache
├── package.json
└── resource.json
```
<p class="message--note"><strong>注意：</strong>必须可以访问 <tt>resource.json</tt> 中的所有资产 URIs，才能从您的环境中下载。也接受相对文件路径。</p>

```bash
# Create a temporary work directory to store the build definition and other files necessary to create the bundle.
mkdir /path/to/output

# `migrate` the unvierse package defintion to create a build defintion for the `.dcos` file.
dcos registry migrate --package-directory=/path/to/package --output-directory=/path/to/output

# `build` to download all the requrired assets and generate a `.dcos` file. This may take a while.
dcos registry build --build-definition-file=/path/to/output/<json-build-defintion-generated-above> --output-directory=/path/to/output
```

如果所有这些步骤都已成功完成，则您的 `/path/to/output` 目录应类似于以下内容：

```
➜ tree
.
├── <package-name>-<package-version>.dcos
└── <package-name>-<package-version>.json
```

您可以清除构建定义 .json file，因为不再需要它。`build` 和 `migrate` 子命令均接受可选的 `--json` 标记，以支持自动化。

执行上述所有步骤后，您应该拥有一个全新的 `.dcos` 文件。

## 将包上传至包注册表

现在您已经拥有您需要的所有 `.dcos` 文件，您可以继续执行：

```bash
dcos registry add --dcos-file <your-file>.dcos
```

这是异步操作，需要几分钟的时间才能在您的 {{ model.packagerepo }} 中看到该包。即使上述命令出错（即使在网络连接缓慢下成功上传时也可能发生），您可以通过执行以下步骤跟踪上传状态：

```bash
dcos registry describe --package-name=<package-name> --package-version=<package-version>
```

请耐心等待几分钟，以便包得以上传、处理以及在 {{ model.packagerepo }} 中可见。

请参阅 `dcos registry --help`，了解可用于管理包注册表中包的操作详尽列表。`registry` 子命令允许您 `add`、`remove` 和 `describe` 包。

<p class="message--warning"><strong>警告：</strong>在部署服务时删除包可能会导致服务停止工作。</p>

执行上述说明后，其余流程与从 {{model.packageRepo}} 获取的包相同。唯一的区别就是您不需要互联网访问（对于具有气隙环境的客户）就可从 `package-registry` 安装包。
