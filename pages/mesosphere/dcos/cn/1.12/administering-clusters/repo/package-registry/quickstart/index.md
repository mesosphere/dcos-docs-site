---
layout: layout.pug
navigationTitle: 包注册表入门
title: 包注册表入门
menuWeight: 1
excerpt: 开始使用 DC/OS 包注册表
enterprise: true
---

# 准备安装包注册表

## 安装或升级到 DC/OS Enterprise 1.12

DC/OS 包注册表包含在 DC/OS Enterprise 1.12 中。如有需要，请先按照 [升级到 DC/OS 1.12 的说明](/mesosphere/dcos/cn/1.12/installing/production/upgrading/) 进行操作之后再继续。

## 删除 Universe 存储库（可选）

如果 DC/OS 群集没有对 Universe 存储库的网络访问权限，或者如果您不需要该存储库中的 DC/OS 包，请使用以下命令将其删除：

```bash
dcos package repo remove Universe
```

# 安装 DC/OS 包注册表

## 启用包注册表的只读 Bootstrap

DC/OS Enterprise 已预先配置为运行只读包注册表，其中包含两个 DC/OS 包：DC/OS Enterprise CLI 和 DC/OS 包注册表。要使用 DC/OS 包管理器启用此存储库，必须将其添加到存储库列表中。

```bash
dcos package repo add "Bootstrap Registry" https://registry.component.thisdcos.directory/repo
```

## 创建包注册表的服务帐户

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

<p class="message--important"><strong>重要信息：</strong>与服务帐户相关联的密钥信息存储在 DC/OS 密钥存储库中名为<code> registry-private-key </code>的路径中。如要使用不同的文件名，请在此处替换<code> registry-private-key </code>。</p>

<p class="message--warning"><strong>警告：</strong>这些指令在本地文件系统上创建两个敏感文件：<code> private-key.pem </code>和<code> public-key.pem </code>。请务必将这些文件保存在安全的地方或将其删除。在 DC/OS 密钥存储库中存储之后就不需要再保留它们了。</p>

## 配置和安装 DC/OS 包注册表

1. 在密钥存储库中为服务帐户密钥提供位置：

    ```bash
    echo '{"registry":{"service-account-secret-path":"registry-private-key"}}' > registry-options.json
    ```

1. 安装包注册表：

    ```bash
    dcos package install package-registry --options=registry-options.json --yes
    ```

DC/OS 包注册表默认在本地文件系统上存储 DC/OS 包。但是，这一注册表不能水平扩展，也不是高度可用。请参阅 [S3 存储选项](/mesosphere/dcos/cn/1.12/administering-clusters/repo/package-registry/operating/planning/#s3-storage-option)，了解更灵活的方法。此外，默认配置假定 DC/OS 包注册表的服务帐户的密钥存储在 DC/OS 密钥存储库的 `registry-private-key` 中。如果不是默认情况，请为 `registry-private-key` 替换正确的路径和文件名。

## 使用 DC/OS 包管理器启用 DC/OS 包注册表

要将包注册表添加到 DC/OS 包管理器，请使用以下命令：

```bash
dcos package repo add --index=0 Registry https://registry.marathon.l4lb.thisdcos.directory/repo
```

<p class="message--note"><strong>注意：</strong>假设使用<code>注册表</code>（默认值）作为服务名称安装了 DC/OS 包注册表。否则，请相应更新 URL（将<code>注册表</code>替换为实际服务名称）。</p>
