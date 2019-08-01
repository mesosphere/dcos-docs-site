---
layout: layout.pug
title: AWS 上的高级 DC/OS
excerpt: 使用 Universal 安装工具在 AWS 上配置您的 DC/OS 安装
navigationTitle: 高级 AWS
menuWeight: 1
---

Mesosphere Universal 安装工具支持各种输入/变量，以便添加到您的 `main.tf`，并使您能够根据需要自定义您的 DC/OS 群集。这些输入/变量包括从指定操作系统（CentOS、Coreos、RHEL）到设置 DC/OS 群集的垃圾收集时间等各个项目。

基于 Terraform 的 Universal 安装工具旨在实现灵活的配置。下面是自定义 `main.tf` 的一个示例，在 AWS 上调配定制的 DC/OS 1.11.7 群集。

```hcl
module "dcos" {
  source  = "dcos-terraform/dcos/aws"
  version = "~> 0.1.0"

  cluster_name = "mydcoscluster"
  ssh_public_key_file = "~/.ssh/id_rsa.pub"
  admin_ips = ["198.51.100.0/24"]

  dcos_version = "1.11.7"
  num_masters = "3"
  num_private_agents = "2"
  num_public_agents = "1"

  # availability_zones = ["<your_selected_region>a"]

  dcos_cluster_docker_credentials_enabled =  "true"
  dcos_cluster_docker_credentials_write_to_etc = "true"
  dcos_cluster_docker_credentials_dcos_owned = "false"
  dcos_cluster_docker_registry_url = "https://index.docker.io"
  dcos_use_proxy = "yes"
  dcos_http_proxy = "example.com"
  dcos_https_proxy = "example.com"
  dcos_no_proxy = <<EOF
  # YAML
   - "internal.net"
   - "169.254.169.254"
  EOF
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

  # dcos_variant              = "ee"
  # dcos_license_key_contents = "${file("./license.txt")}"
  dcos_variant = "open"
}
```

## 输入

| 名称 | 描述 | 类型 | 默认值 | 是否必需 |
|------|-------------|:----:|:-----:|:-----:|
| admin_ips | CIDR 管理 IP 的列表。| 列表 | - | 是 |
| availability_zones | 要使用的可用性区域。| 列表 | `<list>` | 否 |
| aws_ami | 将用于实例的 AMI，而不是 Mesosphere 提供的 AMI。| 字符串 | `` | 否 |
| aws_key_name | 指定要使用的 AWS SSH 密钥。我们假设其已经在您的 SSH 代理中加载。将 `ssh_public_key` 设为 none | 字符串 | `` | 否 |
| bootstrap_associate_public_ip_address | [BOOTSTRAP] 将公共 IP 地址与这些实例关联。| 字符串 | `true` | 否 |
| bootstrap_aws_ami | [BOOTSTRAP] 要使用的 AMI。| 字符串 | `` | 否 |
| bootstrap_instance_type | [BOOTSTRAP] 实例类型。| 字符串 | `t2.medium` | 否 |
| bootstrap_os | [BOOTSTRAP] 要使用的操作系统。您可以使用所提供的操作系统，而不一定使用您自己的 AMI。| 字符串 | `` | 否 |
| bootstrap_private_ip | 用于 bootstrap URL 的专用 IP。| 字符串 | `` | 否 |
| bootstrap_root_volume_size | [BOOTSTRAP] Root 卷大小，单位为 GB。| 字符串 | `80` | 否 |
| bootstrap_root_volume_type | [BOOTSTRAP] Root 卷类型。| 字符串 | `standard` | 否 |
| cluster_name | DC/OS 群集的名称。| 字符串 | `dcos-example` | 否 |
| cluster_name_random_string | 将随机字符串添加到群集名称。| 字符串 | `false` | 否 |
| custom_dcos_download_path | 插入 DC/OS 安装工具脚本的位置。（可选） | 字符串 | `` | 否 |
| dcos_adminrouter_tls_1_0_enabled | 指示是否在 Admin Router 中启用 TLSv1 支持。（可选） | 字符串 | `` | 否 |
| dcos_adminrouter_tls_1_1_enabled | 指示是否在 Admin Router 中启用 TLSv1.1 支持。（可选） | 字符串 | `` | 否 |
| dcos_adminrouter_tls_1_2_enabled | 指示是否在 Admin Router 中启用 TLSv1.2 支持。（可选） | 字符串 | `` | 否 |
| dcos_adminrouter_tls_cipher_suite | [企业 DC/OS] 指示是否允许 Web 浏览器通过非 HTTPS 连接发送 DC/OS 身份认证 cookie。（可选） | 字符串 | `` | 否 |
| dcos_agent_list | 用于列出 config.yaml 中的代理。（可选） | 字符串 | `` | 否 |
| dcos_audit_logging | [企业 DC/OS] 为 Mesos、Marathon 和作业记录已启用的安全决策。（可选） | 字符串 | `` | 否 |
| dcos_auth_cookie_secure_flag | [企业 DC/OS] 允许 Web 浏览器通过非 HTTPS 连接发送 DC/OS 身份认证 cookie。（可选） | 字符串 | `` | 否 |
| dcos_aws_access_key_id | Exhibitor 存储的 AWS 密钥 ID。（可选，但使用 `dcos_exhibitor_address` 时为必需） | 字符串 | `` | 否 |
| dcos_aws_region | Exhibitor 存储的 AWS 区域。（可选，但使用 `dcos_exhibitor_address` 时为必需） | 字符串 | `` | 否 |
| dcos_aws_secret_access_key | Exhibitor 存储的 AWS 秘密密钥 ID。（可选，但使用 `dcos_exhibitor_address` 时为必需） | 字符串 | `` | 否 |
| dcos_aws_template_storage_key_id | CloudFormation 模板存储的 AWS 密钥 ID。（可选） | 字符串 | `` | 否 |
| dcos_aws_template_storage_bucket | AWS CloudFormation bucket 名称。（可选） | 字符串 | `` | 否 |
| dcos_aws_template_storage_bucket_path | AWS CloudFormation bucket 路径。（可选） | 字符串 | `` | 否 |
| dcos_aws_template_storage_region_name | AWS CloudFormation 区域名称。（可选） | 字符串 | `` | 否 |
| dcos_aws_template_storage_secret_access_key | CloudFormation 模板的 AWS 秘密密钥。（可选） | 字符串 | `` | 否 |
| dcos_aws_template_upload | 将自定义高级模板自动上传到您的 S3 bucket。（可选） | 字符串 | `` | 否 |
| dcos_bootstrap_port | 用于指定 bootstrap URL 的端口。| 字符串 | `80` | 否 |
| dcos_bouncer_expiration_auth_token_days | [企业 DC/OS] 设置身份和访问管理的授权令牌生存时间值 (TTL)。（可选） | 字符串 | `` | 否 |
| dcos_ca_certificate_chain_path | [企业 DC/OS] 到包含完整 CA 证书链文件的路径（相对于 $DCOS_INSTALL_DIR），该证书链是最终实体证书验证所需的，采用 OpenSSL PEM 格式。（可选） | 字符串 | `` | 否 |
| dcos_ca_certificate_key_path | | 字符串 | `` | 否 |
| dcos_ca_certificate_path | [企业 DC/OS] 到包含单个 X.509 CA 证书文件的路径（相对于 $DCOS_INSTALL_DIR），该证书采用 OpenSSL PEM 格式。（可选） | 字符串 | `` | 否 |
| dcos_check_time | 检查在 DC/OS 启动过程中是否启用网络时间协议 (NTP)。（可选） | 字符串 | `` | 否 |
| dcos_cluster_docker_credentials | 要传递的 Docker 凭据的词典。（可选） | 字符串 | `` | 否 |
| dcos_cluster_docker_credentials_dcos_owned | 表示是否在 `/opt/mesosphere` 或 `/etc/mesosphere/docker_credentials` 中存储凭据文件。sysadmin 无法直接编辑 `/opt/mesosphere`（可选） | 字符串 | `` | 否 |
| dcos_cluster_docker_credentials_enabled | 表示是否向 Mesos 传递 Mesos `--docker_config` 选项。（可选） | 字符串 | `` | 否 |
| dcos_cluster_docker_credentials_write_to_etc | 表示是否写入群集凭据文件。（可选） | 字符串 | `` | 否 |
| dcos_cluster_docker_registry_enabled | | 字符串 | `` | 否 |
| dcos_cluster_docker_registry_url | Mesos 用来从中拉取 Docker 镜像的自定义 URL。如果设置，则会将 Mesos 的 `--docker_registry` 标记配置为指定的 URL。（可选） | 字符串 | `` | 否 |
| dcos_cluster_name | 设置 DC/OS 群集名称。| 字符串 | `` | 否 |
| dcos_config | 用于在 `config.yaml` 中添加未在此指定的任何额外参数。（可选） | 字符串 | `` | 否 |
| dcos_custom_checks | 添加到默认检查配置流程的自定义安装检查。（可选） | 字符串 | `` | 否 |
| dcos_customer_key | [企业 DC/OS] 设置客户密钥。（可选） | 字符串 | `` | 否 |
| dcos_dns_bind_ip_blacklist | DC/OS DNS 解析器无法绑定的 IP 地址列表。（可选） | 字符串 | `` | 否 |
| dcos_dns_forward_zones | 允许将 DNS 到某些域的请求转发到特定服务器。[以下语法](https://github.com/dcos/dcos-docs/blob/master/1.10/installing/custom/configuration/configuration-parameters.md#dns_forward_zones) 必须与 [Terraform string heredoc](https://www.terraform.io/docs/configuration/variables.html#strings) 结合使用。（可选） (:warning: DC/OS 1.10+) | 字符串 | `` | 否 |
| dcos_dns_search | 输入不合格域时尝试的域列表（以空格隔开）。（可选） | 字符串 | `` | 否 |
| dcos_docker_remove_delay | 删除存储在代理节点上的陈旧 Docker 镜像和由安装工具生成的 Docker 镜像之前等待的时间。（可选） | 字符串 | `` | 否 |
| dcos_enable_docker_gc | 指示是否运行 `docker-gc script`脚本，一个简单的 Docker 容器和镜像垃圾回收脚本，每小时清理一次失散的 Docker 容器。（可选） | 字符串 | `` | 否 |
| dcos_enable_gpu_isolation | 指示是否在 DC/OS 中启用 GPU 支持。（可选） | 字符串 | `` | 否 |
| dcos_exhibitor_address | 管理节点前面负载均衡器的地址。（建议） | 字符串 | `` | 否 |
| dcos_exhibitor_azure_account_key | Exhibitor 存储的 Azure 帐户密钥。（可选，但使用 `dcos_exhibitor_address` 时为必需） | 字符串 | `` | 否 |
| dcos_exhibitor_azure_account_name | Exhibitor 存储的 Azure 帐户名称。（可选，但使用 `dcos_exhibitor_address` 时为必需） | 字符串 | `` | 否 |
| dcos_exhibitor_azure_prefix | Exhibitor 存储的 Azure 帐户名称。（可选，但使用 `dcos_exhibitor_address` 时为必需） | 字符串 | `` | 否 |
| dcos_exhibitor_explicit_keys | 设置您是否使用 AWS API 密钥授予 Exhibitor 访问 S3 的权限。（可选） | 字符串 | `` | 否 |
| dcos_exhibitor_storage_backend | 选项为 `aws_s3`、`azure` 或 `zookeeper`（建议） | 字符串 | `static` | 否 |
| dcos_exhibitor_zk_hosts | 一个或多个 Zookeeper 节点 IP 和端口地址的逗号分隔列表，用于配置内部 Exhibitor 实例。（不建议，但 `exhibitor_storage_backend` 设置为 `zookeeper ` 时为必选。改用 `aws_s3` 或 `azure`。假设外部 ZooKeeper 已经在线。） | 字符串 | `` | 否 |
| dcos_exhibitor_zk_path | Exhibitor 用来存储数据的文件路径（不建议，但 exhibitor_storage_backend 设置为 `zookeeper` 时为必选。改用 `aws_s3` 或 `azure`。假设外部 ZooKeeper 已经在线。） | 字符串 | `` | 否 |
| dcos_fault_domain_detect_contents | [企业 DC/OS] 故障域脚本内容。可选，但如果不存在 `fault-domain-detect` 脚本，则为必选。| 字符串 | `` | 否 |
| dcos_fault_domain_enabled | [企业 DC/OS] 用于控制是否启用故障域。| 字符串 | `` | 否 |
| dcos_gc_delay | 清理执行器目录之前等待的最长时间（可选） | 字符串 | `` | 否 |
| dcos_gpus_are_scarce | 指示是否将 GPU 视为群集中的稀缺资源。（可选） | 字符串 | `` | 否 |
| dcos_http_proxy | http 代理。（可选） | 字符串 | `` | 否 |
| dcos_https_proxy | https 代理。（可选） | 字符串 | `` | 否 |
| dcos_install_mode | 指定要执行的命令类型。选项：`install` 或 `upgrade` | 字符串 | `install` | 否 |
| dcos_instance_os | 要使用的操作系统。您可以使用所提供的操作系统，而不一定使用您自己的 AMI。| 字符串 | `centos_7.5` | 否 |
| dcos_ip_detect_contents | 允许 DC/OS 检测您的专用地址。使用此项，作为输入传递给模块，而不是您的 bootstrap 节点内的文件。（建议） | 字符串 | `` | 否 |
| dcos_ip_detect_public_contents | 允许 DC/OS 知道您的公共可路由地址，以便于使用（建议） | 字符串 | `` | 否 |
| dcos_ip_detect_public_filename | 静态设置您的 `detect-ip-public` 路径 | 字符串 | `genconf/ip-detect-public` | 否 |
| dcos_l4lb_enable_ipv6 | 布尔值，表示第 4 层负载均衡是否可用于 IPv6 网络。（可选） | 字符串 | `` | 否 |
| dcos_license_key_contents | [企业 DC/OS] 用于提供企业版 DC/OS 的许可证密钥。如果 bootstrap 节点上存在 `license.txt`，则为可选。| 字符串 | `` | 否 |
| dcos_log_directory | 从 SSH 进程到安装工具主机日志的路径。（可选） | 字符串 | `` | 否 |
| dcos_master_discovery | Mesos 管理节点发现方法。可用选项是 `static` 或 `master_http_loadbalancer`。（建议使用 `master_http_loadbalancer`) | 字符串 | `static` | 否 |
| dcos_master_dns_bindall | 指示管理节点 DNS 端口是否打开。（可选） | 字符串 | `` | 否 |
| dcos_master_external_loadbalancer | [企业 DC/OS] 允许 DC/OS 围绕外部负载均衡器名称配置证书。如果未使用，则会出现 SSL 验证问题。（建议） | 字符串 | `` | 否 |
| dcos_master_list | 静态设置管理节点（不建议，但 `exhibitor_storage_backend` 设置为 `static` 时为必选。您可以改用 `aws_s3` 或 `azure`，这样您可以在云中更改管理节点。） | 字符串 | `` | 否 |
| dcos_mesos_container_log_sink | 容器（任务）的日志管理器。选项是将日志发送到：'journald'、'logrotate'、'journald+logrotate'。（可选） | 字符串 | `` | 否 |
| dcos_mesos_dns_set_truncate_bit | 指示在响应过大而无法放入单个数据包时，是否设置截断数位。（可选） | 字符串 | `` | 否 |
| dcos_mesos_max_completed_tasks_per_framework | Mesos 管理节点在内存中保留的每个框架的完成任务数。（可选） | 字符串 | `` | 否 |
| dcos_no_proxy | 从代理中排除的地址的 YAML 嵌套列表 (-)。（可选） | 字符串 | `` | 否 |
| dcos_num_masters | 设置管理节点的数量（`exhibitor_storage_backend` 设置为 `aws_s3`、`azure`、`zookeeper` 时为必需） | 字符串 | `` | 否 |
| dcos_oauth_enabled | [仅 DC/OS 开源] 指示是否为群集启用身份认证。（可选） | 字符串 | `` | 否 |
| dcos_overlay_config_attempts | 指定配置尝试失败多少次之后，覆盖配置模块才会停止尝试配置虚拟网络。（可选） | 字符串 | `` | 否 |
| dcos_overlay_enable | 启用以禁用覆盖。（可选） | 字符串 | `` | 否 |
| dcos_overlay_mtu | 在覆盖层上启动的容器中，虚拟以太网 (vEth) 的最大传输单元 (MTU)。（可选） | 字符串 | `` | 否 |
| dcos_overlay_network | 这组参数定义 DC/OS 的虚拟网络。（可选） | 字符串 | `` | 否 |
| dcos_package_storage_uri | 永久存储 DC/OS 包的位置。值必须是一个文件 URL。（可选） | 字符串 | `` | 否 |
| dcos_previous_version | DC/OS 1.9+ 要求用户设置此值，以确保用户知道该版本。Terraform 可帮助填充此值，但用户可以在此处覆盖。（建议） | 字符串 | `` | 否 |
| dcos_previous_version_master_index | 用于跟踪管理节点的索引，以便在升级过程中查询以前的 DC/OS 版本。（可选）适用：1.9+ | 字符串 | `0` | 否 |
| dcos_process_timeout | 在进程分叉之后等待开始操作的时间（以秒为单位）。（可选） | 字符串 | `` | 否 |
| dcos_public_agent_list | 静态设置公共代理（不建议） | 字符串 | `` | 否 |
| dcos_resolvers | DC/OS 群集节点 DNS 解析器的 YAML 嵌套列表 (-)。（建议） | 字符串 | `` | 否 |
| dcos_rexray_config | 用于在 Marathon 中启用外部持久卷的 REX-Ray 配置方法。（可选） | 字符串 | `` | 否 |
| dcos_rexray_config_filename | 用于在 Marathon 中启用外部持久卷的 REX-Ray 配置文件名。（可选） | 字符串 | `` | 否 |
| dcos_rexray_config_method | 用于在 Marathon 中启用外部持久卷的 REX-Ray 配置方法。（可选） | 字符串 | `` | 否 |
| dcos_s3_bucket | Exhibitor 后端的 S3 bucket 名称。（建议，但使用 `dcos_exhibitor_address` 时为必需） | 字符串 | `` | 否 |
| dcos_s3_prefix | Exhibitor 后端的 S3 前缀的名称。（建议，但使用 `dcos_exhibitor_address` 时为必需） | 字符串 | `` | 否 |
| dcos_security | [企业 DC/OS] 设置 DC/OS 的安全级别。默认值为 permissive。（建议） | 字符串 | `` | 否 |
| dcos_skip_check | 升级选项：用于跳过所有 DC/OS 检查，如果任何 DC/OS 组件运行不正常，这些检查可能阻止升级。（可选）适用：1.10+ | 字符串 | `false` | 否 |
| dcos_staged_package_storage_uri | 添加 DC/OS 包时的临时存储位置。（可选） | 字符串 | `` | 否 |
| dcos_superuser_password_hash | [企业 DC/OS] 设置超级用户密码哈希值。（建议） | 字符串 | `` | 否 |
| dcos_superuser_username | [企业 DC/OS] 设置超级用户的用户名。（建议） | 字符串 | `` | 否 |
| dcos_telemetry_enabled | 更改遥测选项。（可选） | 字符串 | `` | 否 |
| dcos_ucr_default_bridge_subnet | 分配给 mesos 桥接 CNI 网络，供 UCR 构建桥接模式网络的 IPv4 子网。（可选） | 字符串 | `` | 否 |
| dcos_use_proxy | 启用对内部路由代理的使用（可选） | 字符串 | `` | 否 |
| dcos_variant | 主要变量。| 字符串 | `open` | 否 |
| dcos_version | 指定要使用哪个 DC/OS 版本说明。选项：`1.9.0`、`1.8.8` 等。参见 [dcos_download_path](https://github.com/dcos/tf_dcos_core/blob/master/variables.tf) 或 [dcos_version](https://github.com/dcos/tf_dcos_core/tree/master/dcos-versions) 树，获得完整列表。| 字符串 | `1.11.7` | 否 |
| dcos_zk_agent_credentials | [企业 DC/OS] 设置 ZooKeeper 代理节点凭据。（建议） | 字符串 | `` | 否 |
| dcos_zk_master_credentials | [企业 DC/OS] 设置 ZooKeeper 管理节点凭据。（建议） | 字符串 | `` | 否 |
| dcos_zk_super_credentials | [企业 DC/OS] 设置 ZooKeeper 超级凭据。（建议） | 字符串 | `` | 否 |
| masters_associate_public_ip_address | [管理节点] 将公共 IP 地址与这些实例关联。| 字符串 | `true` | 否 |
| masters_aws_ami | [管理节点] 要使用的 AMI。| 字符串 | `` | 否 |
| masters_instance_type | [管理节点] 实例类型。| 字符串 | `m4.xlarge` | 否 |
| masters_os | [管理节点] 要使用的操作系统。您可以使用所提供的操作系统，而不一定使用您自己的 AMI。| 字符串 | `` | 否 |
| master_root_volume_size | [管理节点] Root 卷大小，单位为 GB。| 字符串 | `120` | 否 |
| num_masters | 指定管理节点数。为实现重复数据备份，您至少应有 3 个。| 字符串 | `3` | 否 |
| num_of_private_agents | | 字符串 | `` | 否 |
| num_of_public_agents | | 字符串 | `` | 否 |
| num_private_agent | 指定专用代理的数量。这些代理将提供您的主要资源。| 字符串 | `2` | 否 |
| num_public_agent | 指定公共代理的数量。这些代理将承载 marathon-lb 和 edgelb。| 字符串 | `1` | 否 |
| private_agents_associate_public_ip_address | [专用代理] 将公共 IP 地址与这些实例关联 | 字符串 | `true` | 否 |
| private_agents_aws_ami | [专用代理] 要使用的 AMI。| 字符串 | `` | 否 |
| private_agents_instance_type | [专用代理] 实例类型。| 字符串 | `m4.xlarge` | 否 |
| private_agents_os | [专用代理] 要使用的操作系统。您可以使用所提供的操作系统，而不一定使用您自己的 AMI。| 字符串 | `` | 否 |
| private_agents_root_volume_size | [专用代理] Root 卷大小，单位为 GB。| 字符串 | `120` | 否 |
| private_agents_root_volume_type | [专用代理] Root 卷类型。| 字符串 | `gp2` | 否 |
| public_agents_additional_ports | 允许在公共代理上公开访问的其他端口列表。（默认情况下 80 和 443 打开）| 字符串 | `<list>` | 否 |
| public_agents_associate_public_ip_address | [公共代理] 将公共 IP 地址与这些实例关联。| 字符串 | `true` | 否 |
| public_agents_aws_ami | [公共代理] 要使用的 AMI。| 字符串 | `` | 否 |
| public_agents_instance_type | [公共代理] 实例类型。| 字符串 | `m4.xlarge` | 否 |
| public_agents_os | [公共代理] 要使用的操作系统。您可以使用所提供的操作系统，而不是使用您自己的 AMI。| 字符串 | `` | 否 |
| public_agent_root_volume_size | [公共代理] Root 卷大小。| 字符串 | `120` | 否 |
| public_agents_root_volume_type | [公共代理] 指定 root 卷类型。| 字符串 | `gp2` | 否 |
| ssh_public_key | 要与实例一起使用的 SSH 公钥，采用授权密钥格式（例如 'ssh-rsa ..'）。确保您将此密钥添加到您的 SSH 代理。| 字符串 | `` | 否 |
| ssh_public_key_file | SSH 公钥的路径。这是必填项，但是，如果您想使用 ssh_public_key 连同密钥作为字符串，则可将其设为空字符串。| 字符串 | - | 是 |
| tags | 向所有资源添加自定义标记。| 映射 | `<map>` | 否 |

## 输出

| 名称 | 说明 |
|------|-------------|
| master-ips | 管理节点 IP 地址。 |
| masters-loadbalancer | 这是用来访问 DC/OS UI 的负载均衡器地址。 |
| public-agents-loadbalancer | 这是用来访问 DC/OS 公共代理的负载均衡器地址。 |
