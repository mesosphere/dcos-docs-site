---
layout: layout.pug
navigationTitle: 计划
title: 计划
menuWeight: 5
excerpt: 计划使用 DC/OS 包注册表
enterprise: true
---

# 存储

## 默认

DC/OS 包注册表的默认配置是将 DC/OS 包存储在主机文件系统中的本地持久卷中。使用此默认存储配置时，您 [仅限使用注册表的一个实例](/cn/1.12/administering-clusters/repo/package-registry/#limitations)。DC/OS 包注册表还支持通过 S3 存储选项存储 DC/OS 包，从而支持部署多个注册表实例。

## S3 存储选项

要配置 DC/OS 包注册表以使用 S3 存储选项存储 DC/OS 包，您必须提供特定的 S3 端点、bucket 名称、访问密钥和密码。使用 Amazon S3 时，请参考 [Amazon S3 区域和端点](https://docs.aws.amazon.com/general/latest/gr/rande.html#s3_region)，了解有关潜在端点的详细信息。

### 将 S3 凭据上传到 DC/OS 密钥存储库

```bash
dcos security secrets create -f ~/.aws/credentials <registry-s3-credential-file>
```

有关如何创建 AWS 凭据文件的信息，请参阅 [AWS CLI 用户指南](https://docs.aws.amazon.com/cli/latest/userguide/cli-config-files.html)。

### 配置和安装 DC/OS 包注册表

```bash
echo '{
  "registry": {
    "service-account-secret-path": "registry-private-key",
    "s3" : {
      "credential-secret-path" : "registry-s3-credential-file",
      "credential-profile-name" : "default",
      "bucket" : "my-bucket",
      "path" : "my-path-in-bucket",
      "endpoint" : "https://s3.us-east-1.amazonaws.com"
    },
    "service" : {
      "instances" : 2
    }
  }
}' > registry-options.json
```

默认配置将 DC/OS 包注册表的服务帐户的密钥设置为存储在 DC/OS 密钥存储库的 `registry-private-key` 中。此外，如果不是存储在这里，请将 `registry-private-key` 替换为正确的文件名。

<p class="message--note"><strong>注意：</strong>您必须覆盖<code> bucket </code>、<code>路径</code>和<code>端点</code>等属性的值才能匹配 S3 配置。</p>


## Docker 引擎集成

要使 Docker 守护程序能够获取存储在 DC/OS 包注册表中的镜像，必须将其配置为信任 DC/OS 包注册表。Docker 提供 [配置文档](https://docs.docker.com/engine/security/certificates/#understanding-the-configuration) 协助实现该配置。注册表的名称是：`<service-name>.marathon.l4lb.thisdcos.directory`而`<service-name>`是安装 DC/OS 包注册表时使用服务的名称。服务名称默认为 `registry`。

要在所有 DC/OS 代理节点（公用和专用节点）中配置 Docker 守护程序，以信任 DC/OS 包注册表的默认配置，请执行以下命令：

```bash
sudo mkdir -p /etc/docker/certs.d/registry.marathon.l4lb.thisdcos.:443
sudo cp /run/dcos/pki/CA/ca-bundle.crt /etc/docker/certs.d/registry.marathon.l4lb.thisdcos.directory:443/ca.crt
sudo systemctl restart docker
```

必须对所有 DC/OS 代理节点执行此配置。
