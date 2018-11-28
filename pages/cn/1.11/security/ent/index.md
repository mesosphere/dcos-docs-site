---
layout: layout.pug
navigationTitle: DC/OS Enterprise 安全性
title: DC/OS Enterprise 安全性
menuWeight: 70
excerpt: 了解 DC/OS Enterprise 安全功能
enterprise: true
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->

DC/OS Enterprise 提供一系列功能，让您保护集群并防止其受破坏和其他攻击。本节概述了强化集群的安全功能和建议。

DC/OS 安全性的目标是：

- 通过所有网络接口的重要身份认证和授权隔离集群周边。
- 严密保护内部集群通信、容器和沙盒。
- 通过支持第三方安全集成来增强集群安全性。

DC/OS 基于 Linux 内核和 userspace。保护任何 Linux 系统的最佳实践同样适用于保护 DC/OS，包括设置正确的文件权限、限制根用户和普通用户帐户、使用 `iptables` 或其他防火墙保护网络接口以及定期应用与 DC/OS 配合使用的 Linux 发行版的更新，以确保 `systemd` 和 OpenSSH 等系统库、实用程序和核心服务是安全的。

# 安全区
在最高级别上，我们可以区分 DC/OS 部署的三个安全区域，即管理、专用和公共安全区。

## 管理区
**管理**区可通过 HTTP/HTTPS 和 SSH 连接访问，并提供对管理节点的访问。它还可通过 URL 路由向集群中的其他节点提供反向代理访问。为了安全起见，DC/OS 云模板允许配置白名单，以便只允许特定的 IP 地址范围访问管理区。

### Admin Router
对管理区的访问由 [Admin Router] 控制(/1.11/overview/architecture/components/#admin-router)。

传入 DC/OS 集群的 HTTP 请求通过 Admin Router 代理（使用 [Nginx](http://nginx.org)，其核心是 [OpenResty](https://openresty.org)）。Admin Router 拒绝访问大多数 HTTP 端点未经身份认证的请求。为了请求能得到身份认证，它需要在其 `Authorization` 报文头中提供有效的认证令牌。可通过验证流程获得令牌。

## 专用区
**专用**区是非可路由网络，仅可从管理区或通过公共区的边缘路由器访问。部署的服务在专用区运行。此区域是运行大多数代理节点运行的位置。

## 公共区
可选的**公共**区是运行公共可访问的应用程序的地方。通常，此区域只运行少量代理节点。边缘路由器将流量转发给专用区中运行的应用程序。公共区中的代理节点被标记为特殊角色，以便只有特定任务才能安排在此处。这些代理节点具有公共和专用 IP 地址，也只能在其 `iptables` 防火墙中打开特定端口。

典型部署（包括负载均衡器）如下所示：

![安全区](/cn/1.11/img/security-zones.png)

图 1. 安全区典型部署

# <a name="security-modes"></a>安全模式

您可以通过资源和操作（创建、读取、更新、删除）来控制 DC/OS Enterprise 访问。可用的安全模式为禁用、宽容和严格。严格的模式提供了最好的细粒度控制。根据您的安全模式执行 DC/OS 权限。安全模式在 [DC/OS 安装](/cn/1.11/installing/ent/custom/advanced/) 过程中设置，并且只能通过执行升级进行更改。

| 权限类别 | 禁用 | 宽容 | 严格 |
|-----------------------------------------------------|:--------:|:----------:|:------:|
| Ad min Router权限（`dcos:adminrouter`） | x | x | x |
| Mesos 权限（`dcos:mesos`） | | | x |
| Marathon 和 Metronome 权限（`dcos:service`） | | x | x |
| 密钥存储库权限（`dcos:secrets`） | x | x | x |

有关完整说明，请参阅[权限参考](/cn/1.11/security/ent/perms-reference/)。

### 已禁用
此模式旨在确保从 DC/OS 早期版本顺利升级，但仅提供最低限度的安全功能，不适用于生产环境。禁用模式不提供 Marathon 或 Mesos 权限。

### 宽容
此模式提供了一些安全功能，但不包括 Mesos 权限。

### 严格
此模式提供最强大的安全状态，需要大量配置。

## <a name="set"></a>设置安全模式
安全模式在 [DC/OS 安装](/cn/1.11/installing/ent/custom/advanced/) 过程中设置，并且只能通过执行[升级](/cn/1.11/installing/ent/upgrading/) 进行更改。安全模式已在有 [`security` 参数](/cn/1.11/installing/ent/custom/configuration/configuration-parameters/#security-enterprise) 的安装配置文件设置。

<table class=“table” bgcolor=#858585>
<tr> 
  <td align=justify style=color:white><strong>重要信息：</strong>升级期间，您只能从“禁用”移至“宽容”，从“宽容”移至“严格”。</td> 
</tr> 
</table>

## <a name="discover"></a>了解您的安全模式
您可以使用以下任一方法来确定现有集群的安全模式。

- 向以下端点发送 `GET` 请求：`http[s]://<cluster-url>/dcos-metadata/bootstrap-config.json`。
 **要求：**您的用户帐户必须具有 `dcos:adminrouter:ops:metadata full` 或 `dcos:superuser` 权限。在 `permissive` 或 `strict` 模式下，您必须使用 HTTPS。查看 [保护 TLS 通信的安全](/cn/1.11/security/ent/tls-ssl/)，了解如何获取 DC/OS CA 的根证书，并将其置备到首选客户端。

- [SSH](/cn/1.11/administering-clusters/sshcluster/) 进入首要节点并查看 `/opt/mesosphere/etc/bootstrap-config.json` 内容。

# <a name="authentication"></a>身份认证
DC/OS 集群外部的所有请求都需要认证令牌。根据您的安全模式，可能会要求集群内认证令牌。如需更多信息，请参阅 [服务账户文档](/cn/1.11/security/ent/service-auth/)。

DC/OS 认证令牌是 [JSON Web 令牌 (JWT)](https://jwt.io/introduction/)，默认情况下，在发布后五天到期。默认到期时间可在 [自定义安装或升级] 期间进行修改(/1.11/installing/ent/custom/configuration/configuration-parameters/#bouncer-expiration-auth-token-days-enterprise)。

在  bootstrap 序列期间，DC/OS 使用 ZooKeeper 凭据配置管理节点。这使得管理节点可以将自己指定为潜在的 Mesos 管理节点。

<table class=“table” bgcolor=#858585>
<tr> 
  <td align=justify style=color:white><strong>重要信息：</strong>除非在安装或升级期间进行了更改（强烈建议），否则每个集群将使用相同的默认 ZooKeeper 凭据。参见<a href="/1.11/security/ent/hardening/#zk">强化</a>，了解更多信息。</td> 
</tr> 
</table>

## <a name="user"></a>用户登录
您可以使用 DC/OS GUI、DC/OS CLI 或编程式客户端登录。

- 如果已配置 LDAP 目录服务器，则 DC/OS 会将您的凭据传递到 LDAP 目录服务器进行验证。
- 如果您已配置 SAML 或 OpenID Connect 身份提供程序 (Idp)，则会将凭据直接传递给 IdP。

**提示：**如果您使用 DC/OS GUI、SAML 和 OpenID Connect 提供程序登录，则他们可能会在浏览器 Cookie 中发现必要的登录详细信息。在这种情况下，您无需传递凭据。

下图详细说明了顺序。

![用户身份认证](/cn/1.11/img/authn-user.png)

图 2. 用户身份认证顺序

认证令牌到期后，您可以重新验证以接收另一个认证令牌。

使用 DC/OS GUI 登录时，Identity 和 Access Manager 会生成包含认证令牌的 Cookie。虽然它收到 [`HttpOnly`](https://www.owasp.org/index.php/HttpOnly) 标志的保护，但您应在浏览器会话结束时**注销**以清除此 Cookie。

请注意，清除 Cookie 不会使认证失效。如果监测到未加密的连接或从 cookie 中提取，则可能有人使用认证令牌登录了 DC/OS。为降低此风险，我们建议在 `permissive` 和 `strict` 模式下设置[安全标志](https://www.owasp.org/index.php/SecureFlag)，如[强化]中所述(/1.11/security/ent/hardening/#secure-flag)。

## <a name="passwords"></a>密码

集群本地用户帐户（不使用 LDAP、SAML 或 OpenID Connect 的账户）的凭据包含用户名和密码，可用于验证但不能复制用户密码。使用 [crypt(3)] (http://man7.org/linux/man-pages/man3/crypt.3.html) SHA-512 对密码进行单独加盐和密码散列。这会导致单向散列，可用于验证但不能复制用户密码。为了进一步阻止暴力攻击并达到或超过 NIST FIPS 安全要求，散列函数使用 128 位盐长度执行多次迭代。

在 DC/OS IAM 验证了您的凭据后，就会将认证令牌返回给您。然后，认证令牌将用于会话期间进一步请求身份认证。这样，密码不需要存储在客户端，并且只能在输入后立即通过电报发送。通过电报，使用 TLS 加密身份认证请求。TLS 是必需的，并以严格模式执行，但在宽容模式下可选。有关更多信息，请参阅[安全模式](/cn/1.11/security/ent/#security-modes)。

## <a name="service"></a>服务身份认证
服务帐户为 [服务](/cn/1.11/overview/concepts/#dcos-service) 提供身份，以使用 DC/OS 进行身份认证。服务帐户控制服务与 DC/OS 组件之间的通信。DC/OS 服务可能需要 [服务帐户](/cn/1.11/security/ent/service-auth/)，这取决于您的安全模式。

## <a name="sysd"></a>组件身份认证
在严格和宽容 [安全模式](/cn/1.11/security/ent/#security-modes)下，DC/OS 在 bootstrap 序列期间使用服务账户自动配置 DC/OS 组件（[DC/OS 节点上的systemd服务](/cn/1.11/overview/concepts/#systemd-service)）。服务帐户在禁用安全模式下不可用。

例如，Mesos 代理节点配置了用于向 Mesos 管理节点进行身份认证的服务帐户。这确保仅授权代理节点可加入 Mesos 集群、宣传资源并被要求启动任务。

您可以从 DC/OS GUI 的 **Organization -> Service Accounts** 选项卡查看 `systemd` 服务帐户。这些服务帐户以 `dcos_` 为前缀。

<table class=“table” bgcolor=#ffd000>
<tr> 
  <td align=justify style=color:black><strong>警告：</strong>修改任何自动配置服务帐户的权限可能会导致服务失败。</td> 
</tr> 
</table>


# <a name="authorization"></a>授权

除了对请求进行身份认证之外，DC/OS 还会检查与该帐户关联的权限，以确定请求者是否有权访问所请求的资源。

下图说明了授权顺序。

![授权顺序](/cn/1.11/img/authz.png)

图 3. 授权顺序

图中的 `OPT` 序列说明了权限执行如何因安全模式而异。

- Admin Router 和密钥存储库在所有安全模式下执行其权限。

- Metronome 和 Marathon 在 `permissive` 和 `strict` 模式执行其权限。但是，只有在请求者提供认证令牌时才会执行 `permissive` 模式，这在 `permissive` 模式下是可选的。如果集群中的请求者未提供认证令牌，Metronome 和 Marathon 则将按照请求是否由具有 `dcos:superuser` 权限的用户所发出进行操作。
- Mesos 管理节点的和代理节点仅在 `strict` 安全模式下执行其权限。

该图未显示密钥存储库序列。Admin Router 不会检查向密钥存储库请求的权限。它将这些请求发送给密钥存储库，后者会针对每个请求执行自己的权限。

有关权限的更多信息，请参阅[管理权限](/cn/1.11/security/ent/perms-reference/)。

# <a name="encryption"></a>传输层安全性 (TLS) 加密

DC/OS 通信的加密因[安全模式]而异(/1.11/security/ent/#security-modes)。

| 安全模式 | 外部通信* | 节点间通信 |
|---------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------|
| 禁用 | 仅支持 HTTP。HTTP 连接不会重定向到 HTTPS，反之亦然。HTTPS 连接将被拒绝，因为 Admin Router 未配置为其服务。如果您使用密码登录 DC/OS，密码将在用户代理程序（例如，Web 浏览器或 DC/OS CLI）和 Admin Router 之间不安全地传输。| 未加密 |
| 宽容 | 支持 HTTP 和 HTTPS。根路径的 HTTP 请求（例如， `http://example.com/`）重定向到 HTTPS。具有与根路径不同的目标的 HTTP 请求（例如， `http://example.com/foo`）不会重定向到 HTTPS。如果使用密码登录 DC/OS，则可以选择是不安全地还是安全地传输密码（需要正确的证书验证，包括客户端上的主机名验证）。| 启用加密 |
| 严格 | 仅支持 HTTPS。所有 HTTP 连接都重定向到 HTTPS。如果使用密码登录 DC/OS，则将安全地传输密码（需要正确的证书验证，包括客户端上的主机名验证）。如果一个或多个 HTTP 代理或负载均衡器在用户代理程序和 Admin Router 之间，则安全密码传输适用于 Admin Router 和先前代理或负载均衡器之间的最终通信。| 执行加密** |

\* *与集群以外的客户端进行通信。例如，浏览器和 DC/OS CLI*。

\*\* *在任何安全模式下未加密的 ZooKeeper 实例之间的节点间通信除外。每个管理节点都有 ZooKeeper 实例。这些 ZooKeeper 实例定期通信，以保持其内存数据库同步。您可以使用 [Ipsec](https://datatracker.ietf.org/wg/ipsec/documents/) 对这些通信进行手动加密。*

目前，并非所有现有用户服务都支持加密。如果服务支持加密，则可以在 `permissive` 模式下启用它。在 `strict` 模式下，执行用户服务通信加密。因此，只有支持加密的用户服务能在 `strict` 模式下被部署。

节点间通信通过 TLS 1.2 进行。为确保浏览器支持，外部通信目前接受 TLS 1.0、1.1 和 1.2。这些配置是可设置的。

有关更多信息，请参阅[使用 TLS 确保通信安全](/cn/1.11/security/ent/tls-ssl/)。

# <a name="spaces"></a>空间

空间允许您：

- [限制用户对服务和作业的访问](#serv-job) 。

- [限制对密钥的服务访问](#secrets)。

我们建议至少使用空间来限制对密钥的服务访问。

## <a name="serv-job"></a>服务和作业空间

空间的一个方面涉及服务和作业组。您可以在任何安全模式下将服务和作业放入组中。这可帮助用户找到与其相关的作业或服务。

在 `strict` 和 `permissive` 安全模式下，您可以使用[权限](/cn/1.11/security/ent/perms-reference/#marathon-metronome)来限制用户对每个服务/作业或服务/作业组的访问。

若要了解如何执行此操作，请参阅[控制用户对服务的访问](/cn/1.11/deploying-services/service-groups/)和[控制用户对作业的访问](/cn/1.11/deploying-jobs/job-groups/)。

## <a name="secrets"></a>密钥空间

密钥路径控制哪些服务可以访问它。如果在存储密钥时未指定路径，则任何服务均可访问它。

密钥路径与服务组配合使用，以控制访问。但是，您无需让服务组控制对密钥的访问，您也可以使用服务的名称。下表提供了一些示例，以说明其工作方式。

| 密钥 | 服务 | 服务是否能访问密钥？ |
|---------------------|--------------------------|----------------------------|
| `group/secret` | `/marathon-user/service` | 否 |
| `group/secret` | `/group/hdfs/service` | 是 |
| `group/hdfs/secret` | `/group/spark/service` | 否 |
| `hdfs/secret` | `/hdfs` | 是 |

**注意：**

- 如果只有单个服务需要访问密钥，则将密钥存储在与服务名称匹配的路径中（例如， `hdfs/secret`）。这可防止其他服务访问。
- 服务组以 `/` 开头，而密钥路径则不是。

## 密钥

为了保护私钥、API 令牌和数据库密码等敏感值，DC/OS提供：

- [安全存储和传输](#storage-transport)
- [细粒度访问控制](#access)

## <a name="storage-transport"></a>密钥的安全存储和传输

DC/OS 使用 Galois 计数器模式 (GCM) 中的高级加密标准 (AES) 算法将密钥存储库数据存储在 ZooKeeper 中的一个开封密钥中。密钥存储库将解封密钥发送到 ZooKeeper 之前使用开封密钥加密，并在从 ZooKeeper 收到密钥后解密密钥。这可确保密钥在休息和传输时都被加密。TLS 为从 ZooKeeper 传输到密钥存储库的密钥提供了额外的加密层。

开封密钥在公共 GPG 密钥下加密。对 [Secrets API] 的请求(/1.11/security/ent/secrets/secrets-api/)仅返回加密的开封密钥。当密钥存储库被手动或由于故障而被密封时，必须使用专用 GPG 密钥解密开封密钥并开启密钥存储库。为方便起见，DC/OS 在 bootstrap 序列期间自动生成新的 4096-bit GPG 密钥对。它使用此密钥初始化密钥存储库，并将密钥对存储在 ZooKeeper 中。

<!-- If you wish to generate your own GPG keypair and store it in an alternate location, you can [reinitialize the Secret Store with a custom GPG keypair](/cn/1.11/security/ent/secrets/custom-key/). -->

密钥存储库适用于所有安全模式。默认情况下，您不能存储大于一兆字节的密钥。如果您需要超过此限制，请联系 Mesosphere 支持中心。我们目前不支持替代或额外的密钥存储库。您应只使用 Mesosphere 提供的 `default` 密钥存储库。

## <a name="access"></a>密钥的细粒度访问控制

DC/OS 允许您限制：

- **用户对密钥的访问：**使用 [权限](/cn/1.11/security/ent/perms-reference/#secrets)控制哪些用户可以访问哪些密钥及其可执行的操作。

- **应用程序对密钥的访问：**使用 [空间](/cn/1.11//security/ent/#spaces)以控制哪些应用程序可以检索哪些密钥。

# <a name="linux-users"></a>Linux 用户帐户

任务和沙盒文件的默认 Linux 用户根据您的[安全模式](/cn/1.11/security/ent/#security-modes)和任务在其中运行的[容器类型](/cn/1.11/deploying-services/containerizers/)而有所不同。

默认情况下，所有任务将在 Mesos 容器内运行。然而，用户服务可配置为在 Docker 容器内运行任务。有关示例，请参阅[将基于 Docker 的服务部署到 Marathon](/cn/1.11/deploying-services/creating-services/deploy-docker-app/)。

下表列出了每种情况下的默认 Linux 用户。

| 容器类型 | 禁用 | 宽容 | 严格 |
|----------------|------------------------------------------------------------------------|------------------------------------------------------------------------|----------------------------------------------------------------------------|
| Mesos | 任务在 `root` 下运行。提取和创建的文件归 `root` 所有。| 任务在 `root` 下运行。提取和创建的文件归 `root` 所有。| 任务在 `nobody` 下运行。提取和创建的文件归 `nobody` 所有。
| Docker | 任务在 `root` 下运行。提取和创建的文件归 `root` 所有。| 任务在 `root` 下运行。提取和创建的文件归 `root` 所有。| 任务在 `root` 下运行。提取和创建的文件归 `nobody` 所有。

默认情况下，Docker 任务在 `root` 下运行，但 Docker 用户权限仅限于 Docker 容器。如果您希望更改默认任务用户，请修改 Docker 容器。有关更多信息，请参考 [Docker 文档](https://docs.docker.com/engine/tutorials/dockerimages/)以及用户服务[文档](/services/)。

**注意：**如果压缩了提取的文件，内部的单个文件将保留文件压缩时分配的权限和所有权，并且不受任何其他配置或设置的影响。

请参阅 [覆盖默认 Linux 用户](/cn/1.11/security/ent/users-groups/config-linux-user/)。
