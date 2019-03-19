---
layout: layout.pug
navigationTitle: 配置参考
title: 配置参考
menuWeight: 5
excerpt: DC/OS Enterprise 和 DC/OS 开源可用的配置参数
---

# 配置参数

本页包含 DC/OS Enterprise 和 DC/OS 开源的配置参数。


# 集群设置

| 参数 | 描述 |
|----------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| [agent_list](#agent-list) |  [专用代理](/cn/1.11/overview/concepts/#private-agent-node)主机名的  IPv4 地址的 YAML 嵌套列表（`-`）。|
| aws_template_storage_access_key_id | 拥有 AWS S3 bucket 的帐户 [访问密钥 ID](http://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html#access-keys-and-secret-access-keys) 。 |
| aws_template_storage_bucket | 包含在 [自定义高级 AWS 模板](/cn/1.11/installing/evaluation/aws/advanced/#create-your-templates) 中的 S3 bucket 的名称。 |
| aws_template_storage_bucket_path | S3 bucket 内模板工件存储位置的路径。
| aws_template_storage_region_name | 包含 S3 bucket 的分域。 |
| aws_template_storage_secret_access_key | 拥有 AWS S3 bucket 的帐户的 [密钥访问密钥](http://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html#access-keys-and-secret-access-keys)。 |
| aws_template_upload | 是否将自定义高级 AWS 模板上传到 S3 bucket。 |
| [bootstrap_url](#bootstrap-url) |（必填）DC/OS 安装工具存储定义 DC/OS 构建文件的 URI 路径。 |
| [cluster_docker_credentials](#cluster-docker-credentials) | 要传递给 Docker 的词典。 |
| [cluster_docker_credentials_enabled](#cluster-docker-credentials-enabled) | 是否传递 Mesos `--docker_config` 选项给 Mesos。 |
| [cluster_docker_registry_url](#cluster-docker-registry-url) | Mesos 用来从来拉取 Docker 镜像的自定义 URL。 |
| [cluster_name](#cluster-name) | 集群的名称。 |
| [cosmos_config](#cosmos-config) | 传递给 [DC/OS 软件包管理器 (Cosmos) ](https://github.com/dcos/cosmos) 的软件包配置词典。 |
| [custom_checks](#custom-checks) | 添加到默认检查配置进程的自定义安装检查。 |
| [exhibitor_storage_backend](#exhibitor-storage-backend) | 用于 Exhibitor 的存储后端类型。 |
| [enable_gpu_isolation](#enable-gpu-isolation) | 指示是否在 DC/OS 中启用 GPU 支持。 |
| [gpus_are_scarce](#gpus-are-scarce) | 指示是否将 GPU 作为集群中的稀缺资源。 |
| [ip_detect_public_filename](#ip-detect-public-filename) | 要在集群中使用的 IP 检测文件。 |
| [master_discovery](#master-discovery) |（必填）Mesos 管理节点发现方法。 |
| [master_external_loadbalancer](#master-external-loadbalancer) | 负载均衡器的 DNS 名称或 IP 地址。[enterprise type="inline" size="small" /] |
| [mesos_container_log_sink](#mesos-container-log-sink) | 容器（任务）的日志管理器。 |
| [platform](#platform) | 基础架构平台。 |
| [public_agent_list](#public-agent-list) | [公共代理](/cn/1.11/overview/concepts/#public-agent-node)主机名的  IPv4 地址的 YAML 嵌套列表（`-`）。|
| [rexray_config](#rexray-config) | 在 Marathon 中启用外部持久卷的 [REX-Ray](https://rexray.readthedocs.io/en/v0.9.0/user-guide/config/) 配置方法。不能同时指定 `rexray_config` 和 `rexray_config_preset`。|
| [rexray_config_preset](#rexray-config-preset) | 如果您在 AWS 上运行 DC/OS，将此参数设置为 `aws`，请将 `rexray_config` 参数设置为与 DC/OS 本身捆绑的合理默认 REX-Ray 配置。不能同时指定 `rexray_config` 和 `rexray_config_preset`。|

# 网络

| 参数 | 描述 |
|------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [dcos_overlay_enable](#dcos-overlay-enable) | 指定是否启用 DC/OS 虚拟网络的参数模块。 |
| [dns_bind_ip_blacklist](#dns-bind-ip-blacklist) | 无法绑定 DC/OS DNS 解析程序的 IP 地址列表。|
| [dns_forward_zones](#dns-forward-zones) | 配置 DNS 查询自定义转发行为的 DNS 分区、IP 地址 和端口的嵌套列表。|
| [dns_search](#dns-search) | 进入不合格域时尝试的域列表（以空格隔开）。 |
| [master_dns_bindall](#master-dns-bindall) | 指示管理节点 DNS 端口是否打开。 |
| [mesos_dns_set_truncate_bit](#mesos-dns-set-truncate-bit) | 指示在响应过大而无法放入单个数据包时，是否设置缩短数位。 |
| [resolvers](#resolvers) | DC/OS 集群节点 DNS 解析器 的 YAML 嵌套列表（`-`）。|
| [use_proxy](#use-proxy) | 指示是否启用 DC/OS 代理。 |
|[enable_ipv6](#enable-ipv6) | 指示 IPv6 网络支持是否在 DC/OS 中可用的布尔值。默认值为 `true`。 |
| [dcos_l4lb_enable_ipv6](#dcos-l4lb-enable-ipv6) | 指示第 4 层负载均衡是否可用于 IPv6 网络的布尔值。该值仅在 `enable_ipv6` 设置为 `true` 时生效。默认值为 `false`。|
|[dcos_ucr_default_bridge_subnet](#dcos-ucr-default-bridge-subnet) |分配给 `mesos-bridge` CNI 网络，供 UCR 构建桥接模式网络的 IPv4 子网。 |

[enterprise]
# 存储
[/enterprise]
| 参数 | 描述 |
|------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [feature_dcos_storage_enabled](#feature-dcos-storage-enabled-enterprise) | 一个标记，设定后将启用 DC/OS 中的高级存储功能，包括 Mesos [CSI](https://github.com/container-storage-interface/spec) 支持和预安装的 CSI 设备插件。此功能标志需要打开才能使用 [DC/OS 存储服务 (DSS)](/cn/services/beta-storage/) [enterprise type="inline" size="small" /]|

# 性能和微调

| 参数 | 描述 |
|------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [docker_remove_delay](#docker-remove-delay) | 删除存储在代理节点上保存的旧 Docker 镜像和安装程序生成的 Docker 镜像之前等待的时间。 |
| [dcos_audit_logging](#dcos-audit-logging-enterprise) | 指示是否为 Mesos、Marathon 和作业记录安全决策（身份认证、授权）。[enterprise type="inline" size="small" /] |
| [enable_docker_gc](#enable-docker-gc) | 指示是否运行 [docker-gc](https://github.com/spotify/docker-gc#excluding-images-from-garbage-collection) 脚本，一个简单的 Docker 容器和镜像垃圾回收脚本，每小时清理一次失散的 Docker 容器。|
| [gc_delay](#gc-delay) | 清理执行器目录前等待的最长时间。 |
| [log_directory](#log-directory) | 从 SSH 进程日志到安装工具主机的路径。 |
| [mesos_max_completed_tasks_per_framework](#mesos-max-completed-tasks-per-framework) | Mesos 管理节点在内存中保留的每个框架的完成任务数。 |
| [process_timeout](#process-timeout) | 在进程分叉之后等待开始操作的时间（以秒为单位）。|

# 安全和身份认证

[enterprise type="inline" size="small" /]

| 参数 | 描述 |
|------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [adminrouter_auth_cache_enabled](#adminrouter-auth-cache-enabled-enterprise) | 控制 Admin Router 是否授权缓存的启用。[enterprise type="inline" size="small" /] |
| [adminrouter_tls_1_0_enabled](#adminrouter-tls-1-0-enabled) | 指示是否在管理路由器中启用 TLSv1 支持。|
| [adminrouter_tls_1_1_enabled](#adminrouter-tls-1-1-enabled) | 指示是否在 Admin Router 中启用 TLSv1.1 支持。|
| [adminrouter_tls_1_2_enabled](#adminrouter-tls-1-2-enabled) | 指示是否在 Admin Router 中启用 TLSv1.2 支持。|
| [adminrouter_tls_cipher_suite](#adminrouter-tls-cipher-suite) | 覆盖 Admin Router 中的默认 TLS 密码套件。 |
| [auth_cookies_secure_flag](#auth-cookies-secure-flag-enterprise) | 指示是否允许 Web 浏览器通过非 HTTPS 连接发送 DC/OS 身份认证 Cookie。[enterprise type="inline" size="small" /] |
| [bouncer_expiration_auth_token_days](#bouncer-expiration-auth-token-days-enterprise) | 设置身份和访问管理的授权令牌生存时间值 (TTL)。[enterprise type="inline" size="small" /]|
| ca_certificate_path | 使用此路径设置自定义 CA 证书。参见 [使用自定义 CA 证书](/cn/1.11/security/ent/tls-ssl/ca-custom#configuration-parameter-reference) 页面，获取详细的配置参数参考。[enterprise type="inline" size="small" /] |
| ca_certificate_key_path | 使用此路径设置自定义 CA 证书。参见 [使用自定义 CA 证书](/cn/1.11/security/ent/tls-ssl/ca-custom#configuration-parameter-reference) 页面，获取详细的配置参数参考。[enterprise type="inline" size="small" /] |
| ca_certificate_chain_path | 使用此路径设置自定义 CA 证书。参见 [使用自定义 CA 证书](/cn/1.11/security/ent/tls-ssl/ca-custom#configuration-parameter-reference) 页面，获取详细的配置参数参考。[enterprise type="inline" size="small" /] |
| [security](#security-enterprise) | 安全模式：禁用、宽容或严格。[enterprise type="inline" size="small" /] |
| [ssh_key_path](#ssh-key-path) | 安装工具用来登录到目标节点的路径。 |
| [ssh_port](#ssh-port) | SSH 的端口，例如 22。|
| [ssh_user](#ssh-user) | SSH 的用户名，例如 `centos`。|
| [superuser_password_hash](#superuser-password-hash-enterprise) | 必填 - 带井号的超级用户密码。[enterprise type="inline" size="small" /] |
| [superuser_username](#superuser-username-enterprise) | 必填 - 超级用户的用户名。[enterprise type="inline" size="small" /] |
| [telemetry_enabled](#telemetry-enabled) | 指示是否为集群启用匿名数据共享。 |
| [zk_super_credentials](#zk-superuser) | ZooKeeper 超级用户凭据。[enterprise type="inline" size="small" /] |
| [zk_master_credentials](#zk-master) | ZooKeeper 管理凭据。[enterprise type="inline" size="small" /] |
| [zk_agent_credentials](#zk-agent) | ZooKeeper 代理凭据。[enterprise type="inline" size="small" /] |


[oss type="inline" size="small" /]
| 参数 | 描述 |
|------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [oauth_enabled](#oauth-enabled-open-source) | 指示是否为集群启用身份认证。[oss type="inline" size="small" /] |
| [ssh_key_path](#ssh-key-path) | 安装工具用来登录到目标节点的路径。 |
| [ssh_port](#ssh-port) | SSH 的端口，例如 22。|
| [ssh_user](#ssh-user) | SSH 的用户名，例如 `centos`。|
| [telemetry_enabled](#telemetry-enabled) | 指示是否为集群启用匿名数据共享。 |

# 参数描述

## adminrouter_auth_cache_enabled [enterprise type="inline" size="small" /]
此选项已添加到 DC/OS 1.11.1。

控制 Admin Router 授权缓存的启用。

* `adminrouter_auth_cache_enabled: false` （默认）每项授权检查 Admin Router 的执行都将在 IAM 加载用户的权限。
* `adminrouter_auth_cache_enabled: true` Admin Router 将在执行授权检查后 5 秒内缓存用户的权限。


## adminrouter_tls_1_0_enabled [enterprise type="inline" size="small" /]
指示是否在 Admin Router 中启用 TLS 1.0。更改此设置对代理节点上的内部 Admin Router 配置没有影响。

- `adminrouter_tls_1_0_enabled: 'true'` 在 Admin Router 中启用 TLS 1.0 协议。
- `adminrouter_tls_1_0_enabled: 'false'` 在 Admin Router 中禁用 TLS 1.0 协议。这是默认值。

建议您不要启用 TLS 1.0，因为该协议被视为不安全。

如果您已经安装了集群，并且想要就地更改此设备，可以通过 [升级](/cn/1.11/installing/production/upgrading/) 实现，同时将 `adminrouter_tls_1_0_enabled` 参数设置为所需值。


## adminrouter_tls_1_1_enabled [enterprise type="inline" size="small" /]
指示是否在 Admin Router 中启用 TLS 1.1。更改此设置对代理节点上的内部 Admin Router 配置没有影响。

- `adminrouter_tls_1_1_enabled: 'true'` 在 Admin Router 中启用 TLS 1.1 协议。这是默认值。
- `adminrouter_tls_1_1_enabled: 'false'` 在 Admin Router 中禁用 TLS 1.1 协议。

如果您已经安装了集群，并且想要即时更改此设备，可以通过 [升级](/cn/1.11/installing/production/upgrading/) 实现，同时将 `adminrouter_tls_1_1_enabled` 参数设置为所需值。


## adminrouter_tls_1_2_enabled [enterprise type="inline" size="small" /]
指示是否在 Admin Router 中启用 TLS 1.2。更改此设置对代理节点上的内部 Admin Router 配置没有影响。

- `adminrouter_tls_1_2_enabled: 'true'` 在 Admin Router 中启用 TLS 1.2 协议。这是默认值。
- `adminrouter_tls_1_2_enabled: 'false'` 在 Admin Router 中禁用 TLS 1.2 协议。

建议保持启用此协议版本，因为它是最安全的受支持 TLS 版本。

如果您已经安装了集群，并且想要更改此设备，可以通过 [升级](/cn/1.11/installing/production/upgrading/) 实现，同时将 `adminrouter_tls_1_2_enabled` 参数设置为所需值。

## adminrouter_tls_cipher_suite [enterprise type="inline" size="small" /]
提供 TLS 密码套件的自定义列表。该值将直接传递到 Admin Router  [`ssl_ciphers`](http://nginx.org/en/docs/http/ngx_http_ssl_module.html#ssl_ciphers) 配置指令。此字符串没有验证。设置错误将导致 DC/OS 安装失败。此配置设置仅影响在 DC/OS 管理节点上运行的 Admin Router 。

如果未提供值，则使用默认值 `EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5;`。

要验证所提供值的准确性，请使用 `openssl ciphers` 实用程序并提供您自己的价值：`openssl ciphers <cipher-suites>`。如需所有可用密码的列表，请参阅 [OpenSSL 文档](https://www.openssl.org/docs/man1.0.2/apps/ciphers.html)。

<p class="message--note"><strong>注意: </strong> 由于 Java 管辖区限制，不能仅使用 AES256 加密套件安装 DC/OS。</p>

## agent_list
[专用代理](/cn/1.11/overview/concepts/#private-agent-node)主机名的  IPv4 地址的 YAML 嵌套列表（`-`）。

## auth_cookie_secure_flag [enterprise type="inline" size="small" /]
指示是否允许 Web 浏览器通过非 HTTPS 连接发送 DC/OS 身份认证 Cookie。DC/OS 身份认证 cookie 允许访问 DC/OS 集群，应通过加密连接发送。

* `auth_cookie_secure_flag: false`（默认）浏览器将通过未加密的 HTTP 连接或加密的 HTTPS 连接发送 DC/OS 身份认证 Cookie。
* `auth_cookie_secure_flag: true` DC/OS 设置的身份认证 Cookie 将包含 [`Secure` 标记](https://www.owasp.org/index.php/SecureFlag)，指示浏览器不在未加密的 HTTP 连接上发送 Cookie。这可能导致身份认证在下列情况下失败。

 - 如果安全模式是 `disabled`
 - 如果安全模式是 `permissive`，URL 就会指定 HTTP 和 URL 包括与根路径不同的目标（例如，`http://<cluster-url>/<path>/`)
 - 在浏览器和终止 TLS 的 DC/OS 之间有代理

## bootstrap_url（必填）
 DC/OS 安装工具用于存储自定义 DC/OS 构建文件的 URL 路径。如果正在使用自动化 DC/OS 安装工具，则应指定 `bootstrap_url: file:///opt/dcos_install_tmp`，除非已经移动安装工具组。自动化 DC/OS 安装工具默认将构建文件放置于 `file:///opt/dcos_install_tmp`。

## bouncer_expiration_auth_token_days [enterprise type="inline" size="small" /]
此参数设置了认证令牌生存时间值 (TTL) ，用于身份和访问管理。必须指定 YAML 字符串中包裹的 Python 浮动语法的值。令牌默认在五天后到期。例如，要将令牌寿命设置为半天：

```json
bouncer_expiration_auth_token_days: '0.5'
```

如需更多信息，请参阅 [安全](/cn/1.11/security/ent/) 文档。

## cluster_docker_credentials
要传递给 Docker 的词典。

- 如果未在 DC/OS 安装期间设置，就会在 `/etc/mesosphere/docker_credentials` 创建默认的空凭据文件。sysadmin 可根据需要更改凭据。`systemctl restart dcos-mesos-slave` 或 `systemctl restart dcos-mesos-slave-public` 需要更改才能生效。
- 您也可以通过使用 `--docker_config` JSON [格式](http://mesos.apache.org/documentation/latest/configuration/)指定。您可以在 `config.yaml` 文件中将其作为 YAML 写入，之后它会自动映射到 JSON 格式。这样就会把 Docker 凭据存储在与 DC/OS 内部配置（`/opt/mesosphere`）相同的位置。如需更新或更改配置，就必须创建新的 DC/OS 内部配置。

**注意：**
- `cluster_docker_credentials` 只有在 [`cluster_docker_credentials_enabled`](#cluster-docker-credentials-enabled) 设置为 `'true'` 之后才能生效。
- 升级期间，`cluster_docker_credentials` 只有在将 `cluster_docker_credentials_dcos_owned` 设置为 `'true'` 后才能生效。

可以使用以下选项进一步配置 Docker 凭据：

* `cluster_docker_credentials_dcos_owned` 指示是否将凭据文件存储在 `/opt/mesosphere` 或 `/etc/mesosphere/docker_credentials` 中。sysadmin 无法直接编辑 `/opt/mesosphere`。
 * `cluster_docker_credentials_dcos_owned: 'true'` 凭据文件存储在 `/opt/mesosphere` 中。
 * `cluster_docker_credentials_write_to_etc` 是否写入集群凭据文件。
 * `cluster_docker_credentials_write_to_etc: 'true'` 写入凭据文件。该操作在覆盖凭据文件会引起问题（例如，如果文件是机器图像或 AMI 的一部分）的时候很实用。这是默认值。
 * `cluster_docker_credentials_write_to_etc: 'false'` 请勿写入凭据文件。
 * `cluster_docker_credentials_dcos_owned: 'false'` 凭据文件存储在 `/etc/mesosphere/docker_credentials` 中。

如需更多信息，请参阅 [示例](/cn/1.11/installing/ent/custom/configuration/examples/#docker-credentials)。

## cluster_docker_credentials_enabled
是否向 Mesos 传递包含 [`cluster_docker_credentials`](#cluster-docker-credentials) 的 Mesos `--docker_config` 选项。

* `cluster_docker_credentials_enabled: 'true'` 请传递 Mesos `--docker_config` 选项给 Mesos。它将指向包含所提供 `cluster_docker_credentials` 数据的文件。
* `cluster_docker_credentials_enabled: 'false'` 请勿传递 Mesos `--docker_config` 选项给 Mesos。


## cluster_docker_registry_url
Mesos 用于拉取 Docker 镜像的自定义 URL。设置后将配置 Mesos 的 `--docker_registry` 标记到指定 URL。这将更改 Mesos 用于拉取 Docker 镜像的默认 URL。默认使用 `https://registry-1.docker.io`。

## cluster_name
集群的名称。

## cosmos_config
要传递给 [DC/OS 包管理器] 的打包配置词典(https://github.com/dcos/cosmos)。设置后，还必须指定以下选项。

* `package_storage_uri`
 永久存储 DC/OS 包的位置。值必须是一个文件 URL，例如 `file:///var/lib/dcos/cosmos/packages`。
* `staged_package_storage_uri`
 添加 DC/OS 包时，临时存储软件包的位置。值必须是一个文件 URL，例如 `file:///var/lib/dcos/cosmos/staged-packages`。

## custom_checks
添加到默认检查配置进程的自定义安装检查。配置用 [DC/OS 诊断组件](/cn/1.11/overview/architecture/components/#dcos-diagnostics) 来执行安装和升级检查。在安装和升级期间，这些自定义检查与默认的启动前和启动后检查一起运行。

- `cluster_checks` - 这组参数指定整个 DC/OS 集群的运行状况检查。

    - `<check-name>` - 运行状况检查的自定义名称
 - `description` - 指定检查说明
 - `cmd` - 指定运行状况检查命令字符串阵列
 - `timeout` - 指定在认定检查失败之前需等待（以秒为单位）的时间。超时的检查通常有 `3 (UNKNOWN)` 的状态

- `node_checks` - 这组参数指定节点运行状况检查。

    - `<check-name>` - 运行状况检查的自定义名称
 - `description` - 指定检查说明
 - `cmd` - 指定运行状况检查命令字符串阵列
 - `timeout` - 指定在认定检查失败之前需等待（以秒为单位）的时间。超时的检查通常有 `3 (UNKNOWN)` 的状态

有关如何使用这些自定义检查的详细信息，请参阅 [示例](/cn/1.11/installing/ent/custom/configuration/examples/#custom-checks) 以及 [节点和集群运行状况检查](/cn/1.11/installing/ent/custom/node-cluster-health-check/) 文档。


## dcos_audit_logging [enterprise type="inline" size="small" /]
指明是否已记录 Mesos、Marathon 和作业的安全决策（身份认证、授权）。

* `'dcos_audit_logging': 'true'` Mesos、Marathon 和作业已记录。这是默认值。
* `'dcos_audit_logging': 'false'` Mesos、Marathon 和作业未记录。

如需更多信息，请参阅 [安全文档](/cn/1.11/security/ent/)。

## dcos_overlay_enable
指示是否启用 DC/OS 虚拟网络。

<p class="message--note"><strong>注意: </strong> 虚拟网络需要 Docker 1.11 或更高版本，但如果您使用 Docker 1.11 或更早版本，则必须指定 <tt>dcos_overlay_enable: 'false'</tt>。如需更多信息，请参阅 <a href="/cn/1.11/installing/ent/custom/system-requirements/">系统要求</a>。</p>

* `dcos_overlay_enable: 'false'` 请勿启用 DC/OS 虚拟网络。
* `dcos_overlay_enable: 'true'` 请启用 DC/OS 虚拟网络。这是默认值。启用虚拟网络后，您还可以指定以下参数：

 * `dcos_overlay_config_attempts` 指定配置尝试失败多少次之后，覆盖配置模块才会停止配置虚拟网络。

 <p class="message--note"><strong>注意: </strong> 故障可能与功能异常的 Docker 守护程序有关。</p>

 * `dcos_overlay_mtu` 在覆盖层上启动的容器中，虚拟以太网 (Veth) 的最大传输单元 (MTU)。

 * `dcos_overlay_network` 这组参数定义 DC/OS 的虚拟网络。DC/OS 的默认配置提供了名为 `dcos` 的虚拟网络，具有以下 YAML 配置：

      ```yaml
      dcos_overlay_network:
         vtep_subnet: 44.128.0.0/20
         vtep_mac_oui: 70:B3:D5:00:00:00
         overlays:
            - name: dcos
               subnet: 9.0.0.0/8
               prefix: 26
      ```

 * `vtep_subnet` 用于虚拟网络 VxLAN 后端的专用地址空间。无法从代理或管理节点外部访问此地址空间。
 * `vtep_mac_oui` 连接到公共节点中虚拟网络接口的 MAC 地址。
 
 
 <p class="message--note"><strong>注意: </strong> 最后三个字节必须为 <tt>00</tt>。</p>

        *  `overlays`
 * `name` 典型名称（参见 [限制](/cn/1.11/networking/virtual-networks/)，了解有关命名虚拟网络的限制）。
 * `subnet` 分配给虚拟网络的子网。
 * `prefix` 分配给每个代理的子网大小，进而定义覆盖网络可运行的代理的数量。子网的大小在覆盖子网中创建。

 如需更多信息，请参阅 [示例](/cn/1.11/installing/ent/custom/configuration/examples/#overlay) 和 [文档](/cn/1.11/networking/virtual-networks/)。


## dns_bind_ip_blacklist
DC/OS DNS 解析器无法绑定的 IP 地址列表。

## dns_forward_zones
配置 DNS 查询自定义转发行为的 DNS 分区、IP 地址和端口列表。DNS 分区与一组 DNS 解析器的映射。

样本定义如下：

```yaml
dns_forward_zones:
a.contoso.com:
- "1.1.1.1:53"
- "2.2.2.2:53"
b.contoso.com:
- "3.3.3.3:53"
- "4.4.4.4:53"
```

在上述示例中，发送到 `myapp.a.contoso.com` 的 DNS 查询将转发至 `1.1.1.1:53` 或 `2.2.2.2:53`。同样，发送到 `myapp.b.contoso.com` 的 DNS 查询将转发至 `3.3.3.3:53` 或 `4.4.4.4:53`。

## dns_search
一份以空格隔开列表，列出了输入不合格域时尝试过的域（例如，不包含 &#8216;.&#8217; 的域搜索）。Linux 实施 `/etc/resolv.conf` 将最大域数限制为 6 个，最大字符数可能设置为 256。如需更多信息，请参阅 [man /etc/resolv.conf](http://man7.org/linux/man-pages/man5/resolv.conf.5.html)。

每个集群管理节点的 `/etc/resolv.conf` 文件都添加了一个 `search` 行。 `search` 具有与 `domain` 相同的功能并且可以指定多个域，因而更具可扩展性。

在本例中， `example.com` 有公共网站 `www.example.com`，而且数据中心的所有主机都具有完全限定的以 `dc1.example.com` 结尾的域名。数据中心中的一个主机具有 `foo.dc1.example.com` 主机名。如果 `dns_search` 设置为 &#8216;dc1.example.com example.com&#8217;，那么每个执行 `foo` 名称查找的 DC/OS 主机都将获得关于 `foo.dc1.example.com` 的 A 记录。如果机器查找 `www`，首先会检查 `www.dc1.example.com`，但它不存在，因此搜索将尝试下一个域，查找 `www.example.com`，找到一条 A 记录就会返回。

```yaml
dns_search: dc1.example.com dc1.example.com example.com dc1.example.com dc2.example.com example.com
```

## docker_remove_delay
删除存储在代理节点上保存的旧 Docker 镜像和安装程序生成的 Docker 镜像之前等待的时间。建议您接受 1 小时作为默认值。

## enable_docker_gc
指示是否运行 [docker-gc](https://github.com/spotify/docker-gc#excluding-images-from-garbage-collection) 脚本，一个简单的 Docker 容器和镜像垃圾回收脚本，每小时清理一次失散的 Docker 容器。您可以使用 `/etc/` 配置参数，设置运行时间行为。如需更多信息，请参阅 [文档](https://github.com/spotify/docker-gc#excluding-images-from-garbage-collection)

* `enable_docker_gc: 'true'` 请每小时运行一次 docker-gc 脚本。这是 [云](/cn/1.11/installing/evaluation/) 模板安装的默认值。
* `enable_docker_gc: 'false'` 请勿每小时运行一次 docker-gc 脚本。这是 [自定义](/cn/1.11/installing/ent/custom/) 安装的默认值。

## exhibitor_storage_backend
Exhibitor 使用的存储后端类型。可以使用内部 DC/OS 存储库（`static`）或指定外部存储系统（`ZooKeeper`、`aws_s3`和 `Azure`），使用 Exhibitor 在管理节点上设置和编排 ZooKeeper。在 DC/OS 安装期间，Exhibitor 自动配置管理节点上的 ZooKeeper 安装。

*   `exhibitor_storage_backend: static`
 Exhibitor 存储后端在您的集群内部进行管理。

      **注意：** 如果 [master_discovery](#master-discovery) 设置为 `master_http_loadbalancer`，那么 exhibitor_storage_backend 就无法设置为 `static`。

*   `exhibitor_storage_backend: zookeeper`
 用于共享存储库的 ZooKeeper 实例。如果使用 ZooKeeper 实例来引导 Exhibitor，此 ZooKeeper 实例必须与您的 DC/OS 集群分开。您必须始终保有至少 3 个 ZooKeeper 实例才能实现高可用性。如果指定了 `zookeeper`，您还必须指定这些参数。
    *   `exhibitor_zk_hosts`
 以逗号隔开的列表（`<ZK_IP>:<ZK_PORT>, <ZK_IP>:<ZK_PORT>, <ZK_IP:ZK_PORT>`），列举了用于配置内部 Exhibitor 实例的一个或多个 ZooKeeper 节点 IP 和端口地址。Exhibitor 使用此 ZooKeeper 集群编排其配置。建议执行多个 ZooKeeper 实例，解决生产环境中的故障切换。
    *   `exhibitor_zk_path`
 Exhibitor 用来存储数据的文件路径。
*   `exhibitor_storage_backend: aws_s3`
 用于共享存储的 Amazon 简单存储服务 (S3) bucket。如果指定了 `aws_s3`，您还必须指定这些参数：
    *  `aws_access_key_id`
 AWS 密钥 ID。
    *  `aws_region`
 S3 bucket 的 AWS 分域。
    *  `aws_secret_access_key`
 AWS 密钥访问密匙。
    *  `exhibitor_explicit_keys`
 指明您是否会使用 AWS API 密匙授予 Exhibitor 访问 S3 的权限。
        *  `exhibitor_explicit_keys: 'true'`
 如果要使用 AWS API 密匙，请手动授予 Exhibitor 访问权限。
        *  `exhibitor_explicit_keys: 'false'`
 如果要使用 AWS 身份和访问管理 (IAM)，请将 Exhibitor 访问权限授予 s3。
    *  `s3_bucket`
 S3 bucket 的名称。
    *  `s3_prefix`
 S3 前缀用于 Exhibitor 使用的 S3 bucket 中。

      <p class="message--note"><strong>注意: </strong> 不支持 AWS EC2 Classic。</p>

*   `exhibitor_storage_backend: azure`
 用于共享存储库的 Azure 存储帐户。数据将存储在名为 `dcos-exhibitor` 的容器中。如果指定了 `azure`，您还必须指定这些参数：
    *  `exhibitor_azure_account_name`
 Azure 存储帐户名称。
    *  `exhibitor_azure_account_key`
 访问 Azure 存储帐户的密钥。
    *  `exhibitor_azure_prefix`
 供 Exhibitor 使用的存储账户中使用的 blob 前缀。

## enable_gpu_isolation
指示是否在 DC/OS 中启用 GPU 支持。

* `enable_gpu_isolation: 'true'` DC/OS 中安装的任何 GPU 将自动被发现并用作 DC/OS 任务的可占用资源。这是默认值。
* `enable_gpu_isolation: 'false'` GPU 不可用于集群。

如需更多信息，请参阅 [GPU 文档](/cn/1.11/deploying-services/gpu/)。

## gc_delay
清理执行器目录前等待的最长时间。建议您接受两天作为默认值。

## gpus_are_scarce
指示是否将 [GPU](/cn/1.11/deploying-services/gpu/) 作为集群中的稀缺资源。

* `gpus_are_scarce: 'true'` 将 GPU 视为稀缺资源。这样就把 GPU 完全保留给通过 [Mesos `GPU_RESOURCES` 框架功能](http://mesos.apache.org/documentation/latest/gpu-support/) 选择消耗 GPU 的服务。这是默认值。
* `gpus_are_scarce: 'false'` 将 GPU 与其他资源同等对待。所有框架，不论是否使用 [Mesos `GPU_RESOURCES` 框架功能](http://mesos.apache.org/documentation/latest/gpu-support/)，都会没有差别地收到 GPU。

## ip_detect_public_filename
bootstrap 节点上的文件（`/genconf/ip-detect-public`）路径，其中包含 shell 脚本，可进行内部 IP 到公用 IP 的映射。例如：

```bash
#!/bin/sh
set -o nounset -o errexit

curl -fsSL https://ipinfo.io/ip
```

## log_directory
从 SSH 进程到安装工具主机日志的路径。默认设置为 `/genconf/logs`。在大多数情况下不应更改路径，因为 `/genconf` 是容器运行安装工具的本地路径，还是一个挂载卷。

## master_discovery（必填）
Mesos 管理节点发现方法。可用选项是 `static` 或 `master_http_loadbalancer`。

*  `master_discovery: static`
 指定使用 Mesos 代理节点，通过向每个代理提供管理节点 IP 的静态列表来发现管理节点。管理节点不得更改 IP 地址，而如果已经更换管理节点，新管理节点必须采用旧管理节点的 IP 地址。如果制定了 `static`，还必须指定以下参数：

    *  `master_list`
 静态管理节点 IP 地址的 YAML 嵌套列表（`-`）。

* `master_discovery: master_http_loadbalancer` 这组管理节点的开头有一个 HTTP 负载均衡器。代理节点会得知负载均衡器的地址。它们使用负载均衡器访问管理节点中的 Exhibitor ，获取管理节点 IP 的完整列表。如果指定了 `master_http_load_balancer`，您还必须指定这些参数：

 * `exhibitor_address` （必填） 
 管理节点前面负载均衡器的地址（推荐 IP 地址）。如果需要替换管理节点，该地址成为代理用来查找新管理节点的静态地址。对于 DC/OS Enterprise，该地址包含在 [DC/OS 证书](/cn/1.11/security/ent/tls-ssl/) 中。

 负载均衡器必须接受端口 80、443、2181、5050、8080、8181 的流量。流量也必须转发到管理节点上的相同端口。例如，负载均衡器上的 Mesos 端口 5050 应转发到管理节点的端口 5050 上。管理节点应通过循环调度转发任何新连接，并且应避免对 Mesos 端口 5050 的请求做出响应的机器以确保管理节点保持运行。

 <p class="message--note"><strong>注意: </strong> 内部负载均衡器必须在 TCP 模式下工作，不终止任何 TLS。</p>
       
 * `num_masters` （必填） 
 DC/OS 集群中的 Mesos 管理节点的数量。此后不能更改。负载均衡器后面的管理节点数量不得大于这个数字，但在发生故障时，该数量可以减少。

**注意：**

* 如果将 master_discovery 设置为 `master_http_loadbalancer`，那么 [exhibitor_storage_backend](#exhibitor-storage-backend) 就无法设置为 `static`。
* 在 AWS 等动态分配内部 IP 的平台上，不应使用静态管理节点列表。管理节点实例因任何原因终止，都可能导致集群不稳定。建议为 Exhibitor 存储后端使用 aws_s3，因为我们可依赖 s3 在管理节点不可用时管理 Quorum 大小。

## master_dns_bindall
指示管理节点 DNS 端口是否打开。打开的管理节点 DNS 端口会在管理节点上公开侦听。如果正在升级，请将此参数设置为 `true`。

* `master_dns_bindall: 'true'` 管理节点 DNS 端口已打开。这是默认值。
* `master_dns_bindall: 'false'` 管理节点 DNS 端口已关闭。


## master_external_loadbalancer [enterprise type="inline" size="small" /]
负载均衡器的 DNS 名称或 IP 地址。指定后，将被作为对象替代名称纳入管理节点上 Admin Router 的 [DC/OS 证书](/cn/1.11/security/ent/tls-ssl/) 中。


## mesos_agent_work_dir [oss type="inline" size="small" /]
代理和公共代理节点上的 Mesos 工作目录的位置。它定义了集群中 Mesos 代理的 `work_dir` 参数。默认为 `/var/lib/mesos/slave`。如需更多信息，请参阅 [Mesos 文档](https://mesos.apache.org/documentation/latest/configuration/agent/)。

## mesos_container_log_sink
容器（任务）的日志管理器。选项包括：

* `'journald'` - 仅将任务日志发送到 journald
* `'logrotate'` - 仅将任务日志发送到文件系统（即 stdout/err 文件）
* `'journald+logrotate'` - 将日志发送到 journald 和文件系统

默认为 `logrotate`。由于性能问题， 不推荐 `journald`。如需更多信息，请参阅 [记录 API](/cn/1.11/monitoring/logging/logging-api/#compatibility)。

## mesos_dns_set_truncate_bit
指示在响应过大而无法放入单个数据包时，Mesos-DNS 是否设置缩短数位。

* `mesos_dns_set_truncate_bit: 'true'` 如果响应太大而无法放入单个数据包并且被缩短，Mesos-DNS 会设置缩短位。这是默认行为，符合 RFC7766。
* `mesos_dns_set_truncate_bit: 'false'` 如果响应太大而无法放入单个数据包，Mesos-DNS 不会设置缩短数位。如果您知道应用程序在 TCP 上解析缩短的 DNS 响应时会崩溃，或出于响应 DNS 请求的性能原因，应将此选项设置为 `false` ，并需注意，您从 Mesos-DNS 收到的 DNS 响应可能丢失了被安静丢弃的条目。这意味着缩短的 DNS 响应将显示为完整（即使并不完整），因此不会触发 TCP 重试。此行为不符合 RFC7766。

有关缩短的 DNS 响应和重试 TCP 的详细信息，请参阅 [RFC7766 - 在 TCP 中传输 DNS——实施要求](https://tools.ietf.org/html/rfc7766)。

## mesos_master_work_dir [oss type="inline" size="small" /]
管理节点上的 Mesos 工作目录位置。它定义了集群中 Mesos 管理节点的  `work_dir`  参数。默认为 `/var/lib/dcos/mesos/master`。如需更多信息，请参阅 [Mesos 文档](https://mesos.apache.org/documentation/latest/configuration/master/)。

## mesos_max_completed_tasks_per_framework
Mesos 管理节点在内存中保留的每个框架的完成任务数。在具有大量长时间运行框架的集群中，保留过多已完成的任务可能导致管理节点出现内存问题。如果未指定此参数，请使用 1000 作为 Mesos 默认值 。


## oauth_enabled [oss type="inline" size="small" /]
指示是否为集群启用身份认证。<!-- DC/OS auth -->

- `oauth_enabled: true` 请启用集群身份认证。这是默认值。
- `oauth_enabled: false` 请禁用集群身份认证。

如果已经安装了集群，并且希望禁用此功能，可以使用同一参数集进行升级。

## platform
基础架构平台。该值为可选的自由格式，无内容验证，仅用于遥测。提供适当的价值，以帮助通知 DC/OS 平台优先做出决策。示例值：`aws`、 `azure`、`oneview`、`openstack`、`vsphere`、`vagrant-virtualbox`、`onprem` （默认）。

## process_timeout
在进程分叉之后允许等待操作开始的时间（以秒为单位）。这个参数不是完整的进程时间。默认值为 120 秒。

**注意：** 对于较慢的网络，请考虑更改为 `process_timeout: 600`。

## public_agent_list
[公共代理](/cn/1.11/overview/concepts/#public-agent-node)主机名的  IPv4 地址的 YAML 嵌套列表（`-`）。

## resolvers
DC/OS 集群节点 DNS 解析器的 YAML 嵌套列表（`-`）。最多可指定 3 个解析器。将此参数设置为您拥有的最权威的域名服务器。

- 如需解析内部主机名，请将其设置为可解析它们的域名服务器。
- 如果没有要解析的内部主机名，您可以将其设置为 Google 或 AWS 等公共域名服务器。例如，可以指定 [Google 公共 DNS IP 地址 (Ipv4)](https://developers.google.com/speed/public-dns/docs/using)：

    ```bash
    resolvers:
    - 8.8.4.4
    - 8.8.8.8
    ```
- 如果没有 DNS 基础架构且没有权限访问互联网 DNS 服务器，您可以指定 `resolvers: []`。指定该设置后，发送到非 `.mesos` 的所有请求都将返回一个错误。如需更多信息，请参阅 Mesos-DNS [文档](/cn/1.11/networking/mesos-dns/)。

<p class="message--note"><strong>注意: </strong> 如果设置的 <tt>resolvers</tt> 参数不正确，您将永久损坏配置，必须重新安装 DC/OS。</p>

## rexray_config
<a href="https://rexray.readthedocs.io/en/v0.9.0/user-guide/config/" target="_blank"> REX-Ray</a> 配置，用于在 Marathon 中启用外部持久卷。REX-Ray 是一个存储编排引擎。以下为示例配置。

```
 rexray_config:
 rexray:
 loglevel: info
 service: ebs
 libstorage:
 integration:
 volume:
 operations:
 unmount:
 ignoreusedcount: true
 server:
 tasks:
 logTimeout: 5m
```
请查看外部持久卷 [文档](/cn/1.11/storage/external-storage/)，了解有关如何创建配置的信息。

请查看外部持久卷 [文档](/cn/1.11/storage/external-storage/)，了解有关如何创建配置的信息。

如果提供了 `rexray_config` 参数，则请为 REX-Ray 完全按照参数内容进行设置。这样就可以完全自定义与各种 [外部存储提供商] 集成的 REX-Ray 配置 ( https://rexray.readthedocs.io/en/v0.9.0/user-guide/storage-providers/)。然而，如果将集群升级到包含更新版的 REX-Ray 的版本，就必须确保 `rexray_config` 参数与较新版本的 REX-Ray 兼容。


## rexray_config_preset
如果您正在 AWS 上运行集群，并希望 DC/OS 与弹性块存储器 (EBS) 集成，而无需关注特定的 REX-Ray 配置，并将 `rexray_config_preset` 参数设置为 `aws`。这样就会将 `rexray_config` 参数设置为与 DC/OS 捆绑的默认 REX-Ray 配置。这一选项的另一优势在于，在您升级到包含已更新 REX-Ray 版本的 DC/OS 版本后，它能自动升级您集群的 REX-Ray 配置。

## security [enterprise type="inline" size="small" /]
指定 `security: permissive`（默认）以外的安全模式。模式后面是潜在的值。

- `security: disabled`
- `security: permissive`
- `security: strict`

请参阅 [安全模式](/cn/1.11/security/ent/#security-modes) 部分，了解对于每个参数的详细探讨。

## ssh_key_path
安装工具用于登录到目标节点的路径。默认情况下，这设置为 `/genconf/ssh_key`。该参数不能更改，因为 `/genconf` 在容器运行安装工具的本地路径，并是一个挂载卷。

## ssh_port
SSH 端口，例如 `22`。

## ssh_user
SSH 用户名，例如 `centos`。

## superuser_password_hash (Required) [enterprise type="inline" size="small" /]
带井号的超级用户密码。`superuser_password_hash` 通过使用安装工具 `--hash-password` 标记生成。第一个超级用户帐户用于提供登录 DC/OS 的方法，登入后可添加其他管理帐户。如需更多信息，请参阅 [安全文档](/cn/1.11/security/ent/)。

## superuser_username（必填）[enterprise type="inline" size="small" /]
超级用户的用户名。此帐户使用 `superuser_password_hash`。如需更多信息，请参阅 [安全文档](/cn/1.11/security/ent/)。

## telemetry_enabled
指示是否为集群启用匿名数据共享。<!-- DC/OS auth -->

- `telemetry_enabled: 'true'` 请启用匿名数据共享。这是默认值。
- `telemetry_enabled: 'false'` 请禁用匿名数据共享。

如果已经安装了集群，并且希望禁用此功能，可以使用同一参数集进行 [升级](/cn/1.11/installing/production/upgrading/)。

## use_proxy
指示是否启用 DC/OS 代理。

* `use_proxy: 'false'` 请勿配置 DC/OS [组件](/cn/1.11/overview/architecture/components/) 以使用自定义代理。这是默认值。
* `use_proxy: 'true'` 请配置 DC/OS [组件](/cn/1.11/overview/architecture/components/) 以使用自定义代理。如果指定了 `use_proxy: 'true'`，您还可以指定这些参数：

 <p class="message--note"><strong>注意: </strong> 指定的代理必须在提供的 <a href="#resolvers">解析器</a> 列表中解析。</p>

 * `http_proxy: http://<user>:<pass>@<proxy_host>:<http_proxy_port>` HTTP 代理。
 * `https_proxy: https://<user>:<pass>@<proxy_host>:<https_proxy_port>` HTTPS 代理。
 * `no_proxy`：子域的 YAML 嵌套列表（`-`），避免此类子域转发到 `https_proxy`。如果地址与其中一个字符串匹配，或主机位于其中一个字符串的域中，则不代理 http(s) 向该节点发送的请求。例如，`no_proxy` 列表可以是内部 IP 地址列表。

 <p class="message--note"><strong>注意: </strong> 不支持通配符（<tt>*</tt>）。</p>

如需更多信息，请参阅 [示例](/cn/1.11/installing/ent/custom/configuration/examples/#http-proxy)。

<p class="message--note"><strong>注意: </strong>还应为 配置 HTTP 代理 <a href="https://docs.docker.com/engine/admin/systemd/#/http-proxy">Docker</a>。</p>

## enable_ipv6
* `enable_ipv6: 'true'`：请在 DC/OS 中启用 IPv6 网络。这是默认值。
* `enable_ipv6: 'false'`：请在 DC/OS 中禁用 IPv6 网络。

目前，IPv6 网络仅有 Docker 容器受支持。将此标记设置为 `true`，就可以启用以下功能：
* 用户可以创建 IPv6 DC/OS 覆盖网络。**注意：** 此操作仅适用于 Docker 容器。
* IPv6 容器的服务发现将可用。
* 如果将 [dcos_l4lb_enable_ipv6](#dcos-l4lb-enable-ipv6) 设置为 `true`，IPv6 Docker 容器即可使用第 4 层负载均衡。

## dcos_l4lb_enable_ipv6
指示第 4 层负载均衡是否可用于 IPv6 容器。
* `dcos_l4lb_enable_ipv6: 'false'` 请为 IPv6 容器禁用 [第 4 层负载均衡](/cn/1.11/networking/load-balancing-vips/)。这是默认值。
* `dcos_l4lb_enable_ipv6: 'true'` 请为 IPv6 容器启用第 4 层负载均衡。**注意：** 为 IPv6 容器打开第 4 层负载均衡时应保持谨慎。`[DCOS_OSS-2010](https://jira.mesosphere.com/browse/DCOS_OSS-2010)

## dcos_ucr_default_bridge_subnet
取得 IPv4 子网。子网被分配到`mesos-bridge` CNI 网络创建的桥接 `ucr-br0`。`mesos-bridge` CNI 网络代表的网络用于在为 UCR 容器选中桥接模式网络时，启动 UCR 容器。

用于 UCR 的桥接模式网络与 Docker 的桥接模式网络相同，因此 `ucr-br0` 与 `docker0` Docker 桥接模式网络的桥接发挥相同作用。

为 `dcos_ucr_default_bridge_subnet` 选择 IPv4 子网的唯一限制是不应在代理连接的网络上使用子网。换言之，只能在代理中访问这一子网。

## feature_dcos_storage_enabled [enterprise type="inline" size="small" /]
支持 DC/OS 中的高级存储功能，包括 Mesos 的 [CSI](https://github.com/container-storage-interface/spec) 支持和支持预安装的 CSI 设备插件。
* `feature_dcos_storage_enabled: 'false'` 请在 DC/OS 中禁用 CSI 支持。这是默认值。
* `feature_dcos_storage_enabled: 'true'` 请在 DC/OS 中启用 CSI 支持。有必要使用 [DC/OS 存储服务 (DSS)](/cn/services/beta-storage/)

<a id="zk-superuser"></a>

## zk_super_credentials [enterprise type="inline" size="small" /]
在 DC/OS `strict` 和 `permissive` 模式集群上， 使用访问控制列表 (ACL) 保护 ZooKeeper 中存储的信息，从而使恶意用户无法连接到 ZooKeeper Quorum，从而不能直接修改服务元数据。ACL 指定与这些 ID 关联的资源 ID (RID) 和操作集合。ZooKeeper 支持可插拔的身份认证方案，并有一些内置方案：`world`、`auth`、`digest`、`host` 和 `ip`。

DC/OS ZooKeeper 凭据 `zk_super_credentials`、 `zk_master_credentials` 和 `zk_agent_credentials` 使用 `digest` 身份认证。这种身份认证需要 `<uid>:<password>` 字符串，随后用作一个 ID，检查客户端是否可以访问特定资源。

`zk_super_credentials` 支持访问等同于 ZooKeeper 的 `root` 或 `superuser` 的帐户，该账户可以访问所有资源，不受现有 ACL 限制。此凭据支持算子访问 ZooKeeper Quorum 中存储的所有元数据，并由 DC/OS 引导脚本在初始化集群时使用。默认值：`'super:secret'`。

要加固群集，Mesosphere 建议您将所有凭据的默认值更改为长而复杂的值。设置后，您可以使用在 DC/OS 管理节点上可用的 `/opt/mesosphere/active/exhibitor/usr/zookeeper/bin/zkCli.sh` 进行验证。`zkCli` 默认不作验证，所以 `/dcos` 树中的节点将无法访问。调用 `addauth digest <zk_super_credentials>` in `zkCli`, 可以访问ZooKeeper中的所有节点`zk_master_credentials` and `zk_agent_credentials` 为它们的一个子集提供访问权限。例如：

```
[zk: localhost:2181(CONNECTED) 0] addauth digest super:secret
[zk: localhost:2181(CONNECTED) 1] ls /dcos
[backup, agent, RootCA, secrets, vault, CAChainInclRoot, CAChain, CACertKeyType, ca, master]
[zk: localhost:2181(CONNECTED) 2] ls /dcos/secrets
[core, init, system, bootstrap_user, keys]
```
<a id="zk-master"></a>
## zk_master_credentials [enterprise type="inline" size="small" /]
引导进程使用的凭据，用于访问将在 DC/OS 管理节点上运行的服务的凭据。

<a id="zk-agent"></a>
## zk_agent_credentials [enterprise type="inline" size="small" /]
引导进程使用的凭据，用于访问将在 DC/OS 代理节点上运行的服务的凭据。
