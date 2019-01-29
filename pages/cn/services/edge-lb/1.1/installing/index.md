---
layout: layout.pug
navigationTitle: 安装 
title: 安装 Edge-LB
menuWeight: 10
excerpt: 配置服务帐户并安装 Edge-LB
enterprise: false
---

要配置服务帐户并安装 Edge-LB 包，请遵照以下指令。

**先决条件：**

- [已安装 DC/OS CLI](/cn/1.11/cli/install/)
- 您以超级用户身份登录。
-  [已安装 DC/OS Enterprise CLI](/cn/1.11/cli/enterprise-cli/)。
- 您有权限访问 [远程 Edge-LB 软件库](https://support.mesosphere.com/hc/en-us/articles/213198586)。

**限制**
- 目前，在 DC/OS 1.11 中，Edge-LB 仅适用于宽容模式的 DC/OS Enterprise，而在 DC/OS 1.11 [安全模式](/cn/1.11/security/ent/#security-modes)中，适用于宽容或严格模式的 DC/OS Enterprise。它不适用于禁用模式。

# 添加 Edge-LB 包软件库
Edge-LB 包括两个组件：
- Edge-LB API 服务器
- Edge-LB 池

要安装 Edge-LB，您必须安装 Edge-LB API 服务器和 Edge-LB 池的 universe 软件库。Edge-LB API 服务器是管理一个或多个 Edge-LB 池的 RESTful API。每个 Edge-LB 池都是负载均衡器的集合。Edge-LB 池可用于启动负载均衡器的一个或多个实例，以创建单个高可用性负载均衡器。目前，Edge-LB 池仅支持 HAProxy 作为负载均衡器。

<p class="message--note"><strong>注意: </strong> 如果您的环境位于防火墙后方，或者无法访问公共目录，那么您必须使用本地目录。</p>

1. 从 [Mesosphere 服务支持页面](https://support.mesosphere.com/hc/en-us/articles/213198586)下载每个软件库的工件。

<p class="message--note"><strong>注意: </strong> 您必须有服务帐户，才能执行此操作。</p>

2. 当您拥有 Edge-LB API 服务器和 Edge-LB 池软件库的工件链接时，请使用以下命令将其添加到 universe 包软件库：

```bash
dcos package repo add --index=0 edgelb  https://<insert download link>/stub-universe-edgelb.json
```

```bash
dcos package repo add --index=0 edgelb-pool https://<insert download link>/stub-universe-edgelb-pool.json
```

[企业]
## <a name="build"></a>部署包含 Edge-LB 的本地 Universe
[/企业]

如果您需要部署包含您自己软件包组合的本地 Universe，您必须构建一个自定义的本地 Universe Docker 镜像。以下指令基于 [DC/OS universe 部署指令](/cn/1.11/administering-clusters/deploying-a-local-dcos-universe/#certified)。

**先决条件：** [Git](https://git-scm.com/)。在 Unix/Linux 中，参阅这些 [入门指令](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)。

1. 克隆 Universe 软件库：

    ```bash
    git clone https://github.com/mesosphere/universe.git --branch version-3.x
    ```

2. 构建 `universe-base` 镜像：

    ```bash
    cd universe/docker/local-universe/
    sudo make base
    ```

3. 从支持下载的站点获取 Edge-LB stub universe JSON 文件。请注意，需要有两个文件：
- `stub-universe-edgelb.json`
- `stub-universe-edgelb-pool.json`

4. 要将 JSON 定义添加到 universe，请使用 `add-stub-universe.sh` 脚本。每次运行 `add-stub-universe.sh` 脚本都将处理 JSON 文件，生成必要的 JSON 和 Mustache 文件，并将其添加到 `stub-repo/packages/<X>/<packagename>`.  

```bash
bash add-stub-universe.sh -j stub-universe-edgelb.json
```
```bash
bash add-stub-universe.sh -j stub-universe-edgelb-pool.json
```

5. 之后，可以将它们合并到主要 `universe/repo/packages` 目录：

```bash
cp -rpv stub-repo/packages/* ../../repo/packages
```

6. 然后，您可以构建 `mesosphere/universe` Docker 镜像并将其压缩至 `local-universe.tar.gz` 文件。使用 `DCOS_PACKAGE_INCLUDE` 变量指定包名称和版本的逗号分隔列表。要最大程度地减少容器尺寸和下载时间，您可以仅选择所需的内容。如果您不使用 `DCOS_PACKAGE_INCLUDE` 变量，所有已认证的 Universe 包都会包含在内。要查看已认证的包，请单击 DC/OS Web 界面中的 **目录** 选项卡。

    ```bash
    sudo make DCOS_VERSION=1.11 DCOS_PACKAGE_INCLUDE=“edgelb:v1.1.3,edgelb-pool:stub-universe,<other-package>:<version>” local-universe
    ```

7. 执行 <a href="/cn/1.11/administering-clusters/deploying-a-local-dcos-universe/#deploying-a-local-universe-containing-certified-universe-packages">部署包含已认证 Universe 包的本地 Universe</a> 中所述的所有步骤。


# 创建服务帐户
Edge-LB API 服务器必须与服务帐户关联，以便它可以根据用户请求在公用节点和专用节点上启动 Edge-LB 池。

[服务账户](/cn/1.11/security/ent/service-auth/) 与公私密钥对、密码、权限和身份认证令牌结合使用，为 DC/OS 服务提供访问 DC/OS 的权限。服务帐户控制服务被允许进行的通信和 DC/OS API 操作。

按照以下步骤创建服务帐户、与服务帐户相关联的主体，为该主体分配权限，并将密钥存储库与该服务帐户关联。Edge-LB 使用密钥存储库在 Edge-LB 池上检索和安装 TLS 证书，以便为客户端和服务后端之间的所有 HTTP 流量启用 TLS。

## <a name="create-a-keypair"></a>创建密钥对
在此步骤中，通过使用 DC/OS 企业 CLI，创建 2048 位 的 RSA 公私密钥对。

创建公私密钥对并将每个值保存到当前目录中的单独文件中。

```bash
dcos security org service-accounts keypair edge-lb-private-key.pem edge-lb-public-key.pem
```

<p class="message--note"><strong>注意: </strong> 您可以使用 <a href="/cn/1.11/security/ent/secrets/">DC/OS 密钥存储库</a> 以确保密钥对的安全。</p>

## 创建主体
从终端提示创建包含包含公钥 (`edge-lb-public-key.pem`) 的新服务帐户 (`edge-lb-principal`)。

```bash
dcos security org service-accounts create -p edge-lb-public-key.pem -d "Edge-LB service account" edge-lb-principal
```

<p class="message--note"><strong>注意: </strong> 使用以下命令验证您的新服务帐户。</p>

```bash
dcos security org service-accounts show edge-lb-principal
```

## <a name="create-an-sa-secret"></a>创建密码
使用您的服务帐户 (`edge-lb-principal`) 和指定的私钥 (`edge-lb-private-key.pem`) 创建密码 (`dcos-edgelb/edge-lb-secret`)。

<p class="message--note"><strong>注意: </strong> 如果您在与服务名称匹配的路径中存储密码（例如，服务名称和路径都为 `edge-lb`)，那么只有名为 `edge-lb` 的服务可以进行访问。</p>

```bash
dcos security secrets create-sa-secret --strict edge-lb-private-key.pem edge-lb-principal dcos-edgelb/edge-lb-secret
```

<p class="message--note"><strong>注意: </strong> 使用此命令列出密码。</p>

```bash
dcos security secrets list /
```

## <a name="give-perms"></a>创建和分配权限

使用以下 CLI 命令，为 Edge-LB 服务帐户配置所需权限。所有 CLI 命令也可通过 [IAM API 执行](/cn/1.11/security/ent/iam-api/)。

可以使用两种方法中的一种为 Edge-LB 服务帐户安全地配置所需权限：

1. 添加 `edge-lb-principal` 到 `superusers` 组
2. 允许限于 Edge-LB 相关任务的操作

### 向超级用户添加服务帐户

添加 `edge-lb-principal` 到 `superusers` 组，可确保在创建池时充分配置服务帐户。随着未来版本的 Edge-LB 中添加新的功能，拥有高级权限也将使升级更加简单。

```bash
dcos security org groups add_user superusers edge-lb-principal
```

### 允许服务账户进行有限操作

<p class="message--note"><strong>注意: </strong> 如果您添加 `edge-lb-principal` 到 `superusers` 组，则不需要这些步骤。</p>

这些更加有限的权限包括 DC/OS 包、Marathon 任务、Edge-LB 池与任务的管理。它们还使得 Edge-LB 池框架调度器能够通过 Mesos 管理节点进行注册并启动负载均衡器任务。

```bash
dcos security org users grant edge-lb-principal dcos:adminrouter:service:marathon full
dcos security org users grant edge-lb-principal dcos:adminrouter:package full
dcos security org users grant edge-lb-principal dcos:adminrouter:service:edgelb full
dcos security org users grant edge-lb-principal dcos:service:marathon:marathon:services:/dcos-edgelb full
dcos security org users grant edge-lb-principal dcos:mesos:master:endpoint:path:/api/v1 full
dcos security org users grant edge-lb-principal dcos:mesos:master:endpoint:path:/api/v1/scheduler full
dcos security org users grant edge-lb-principal dcos:mesos:master:framework:principal:edge-lb-principal full
dcos security org users grant edge-lb-principal dcos:mesos:master:framework:role full
dcos security org users grant edge-lb-principal dcos:mesos:master:reservation:principal:edge-lb-principal full
dcos security org users grant edge-lb-principal dcos:mesos:master:reservation:role full
dcos security org users grant edge-lb-principal dcos:mesos:master:volume:principal:edge-lb-principal full
dcos security org users grant edge-lb-principal dcos:mesos:master:volume:role full
dcos security org users grant edge-lb-principal dcos:mesos:master:task:user:root full
dcos security org users grant edge-lb-principal dcos:mesos:master:task:app_id full
```

另外，**对于创建的每个 Edge-LB 池**，都需要授予此权限：

```bash
dcos security org users grant edge-lb-principal dcos:adminrouter:service:dcos-edgelb/pools/<POOL-NAME> full
```

有关所需权限的详细信息，请参阅 [Edge-LB 权限](/cn/services/edge-lb/1.1/permissions/)

# <a name="create-json"></a>为服务身份认证创建配置文件
配置服务身份认证后，您必须使用凭据创建 JSON 选项文件。安装 Edge-LB 时，此文件将传递到 DC/OS。

在文件中指定之前创建的服务帐户密码 (`dcos-edgelb/edge-lb-secret`)。

```json
{
  "service": {
    "secretName": "dcos-edgelb/edge-lb-secret",
    "principal": "edge-lb-principal",
    "mesosProtocol": "https"
  }
}
```
EdgelB 还需要指定以下选项。它们的值取决于其正在运行的集群的安全模式：

* `service.mesosProtocol`: `"https"` 针对宽容和严格安全模式， `"http"`（默认）针对禁用安全模式
* `service.mesosAuthNZ`: `true`（默认）针对宽容和严格安全模式， `false`针对禁用安全模式 参数从 v1.1 版本开始可用。

其他有用的可配置服务参数包括：

* `service.name`: `"dcos-edgelb/api"`. 当  [配置池](/cn/services/edge-lb/1.1/pool-configuration/)，`apiserver`. `dcos-edgelb` 的服务路径对应于 `pool.namespace`。
* `service.logLevel`: `"info"`. 可以是 `debug`、`info`、`warn` 或 `error`中的一个。
* `service.cpus`: `1.1`
* `service.mem`: `1024`

以有意义的名称保存文件，如 `edge-lb-options.json`。将此文件保存在源控件中，以便您可以稍后快速更新配置。

# <a name="install-edge-lb"></a>安装 Edge-LB
使用此命令安装 Edge-LB。

```bash
dcos package install --options=edge-lb-options.json edgelb
```

运行此命令，等待 Edge-LB 服务准备就绪。

```bash
until dcos edgelb ping; do sleep 1; done
```

准备就绪时，您应收到此消息：

```bash
pong
```

- 有关配置 Edge-LB 的详细信息，请参阅 [Edge-LB 配置](/cn/services/edge-lb/1.1/pool-configuration/) 部分。
- 有关可用 Edge-LB 命令的详细信息，请参阅 [Edge-LB 命令参考](/cn/services/edge-lb/1.1/cli-reference/)。
