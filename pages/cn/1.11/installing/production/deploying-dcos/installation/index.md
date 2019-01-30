---
layout: layout.pug
navigationTitle: 生产安装
title: 生产安装
menuWeight: 15
excerpt: 安装生产就绪的 DC/OS 
---


本部分介绍如何安装可升级的 DC/OS 生产就绪部署。使用这种方法，您可以打包 DC/OS 分发并手动连接到每个节点，以运行 DC/OS 安装命令。若要与现有系统集成，或者您没有集群的 SSH 访问权限，则推荐使用这种安装方法。

DC/OS 安装进程需要 bootstrap 节点、管理节点、公共代理节点和专用代理节点。可以查看 [节点](/cn/1.11/overview/concepts/#node) 文档以了解更多信息。

# 生产安装流程

 安装 DC/OS 集群需要以下步骤：

1. 配置 bootstrap 节点
1. 在管理节点上安装 DC/OS
1. 在代理节点上安装 DC/OS

![Production Installation Process](/cn/1.11/img/advanced-installer.png)
图 1. 生产安装流程


此安装方法要求：

* bootstrap 节点必须在可从集群节点访问的网络。
* 从集群节点到 bootstrap 节点的 HTTP(S) 端口必须在打开状态。

DC/OS 安装会创建以下文件夹：

| 文件夹 | 描述 |
|-----------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------|
| | `/opt/mesosphere` | 包含 DC/OS 二进制文件、库和集群配置。请勿修改。 |
| | `/etc/systemd/system/dcos.target.wants` | 包含启动 systemd 组件的 systemd 服务。它们因受 systemd 限制而必须位于 `/opt/mesosphere` 之外。 |
| `/etc/systemd/system/dcos. <units>`      | Contains copies of the units in `/etc/systemd/system/dcos.target.wants`. They must be at the top folder as well as inside `dcos.target.wants`. |
| | `/var/lib/dcos/exhibitor/zookeeper` | 包含 [ZooKeeper](/cn/1.11/overview/concepts/#exhibitor-zookeeper) 数据。 |
| | `/var/lib/docker` | 包含 Docker 数据。 |
| | `/var/lib/dcos` | 包含 DC/OS 数据。 |
| | `/var/lib/mesos` | 包含 Mesos 数据。 |

<p class="message--warning"><strong>警示: </strong> 不支持更改 <tt>/opt/mesosphere</tt>。它们可能导致 DC/OS 中出现不可预测的行为，并防止升级。</p>

## 先决条件
您的集群必须符合软件和硬件 [要求](/cn/1.11/installing/production/system-requirements/)，才能安装 DC/OS。


# <a name="configure-cluster"></a>配置您的集群

在 bootstrap 节点上创建名为 `genconf` 的目录，并导航到该目录。

```bash
mkdir -p genconf
```

[enterprise]
# <a name="license"></a>存储许可证文件
[/enterprise]
1. 创建 [许可证文件](/cn/1.11/administering-clusters/licenses/)（包含您的授权支持联系人发送的电子邮件中提供的许可文本）并另存为 `genconf/license.txt`。

# <a name="ip-detect-script"></a>创建 IP 检测脚本

在这一步创建 IP 检测脚本。这一脚本报告集群中每个节点的 IP 地址。DC/OS 集群中的每个节点都有一个唯一的 IP 地址，用于在集群中的节点之间进行通信。每次在节点上启动 DC/OS 时，IP 检测脚本都会将节点的唯一 IPv4 地址打印到 STDOUT。

**注意：**

- 在节点上安装 DC/OS 后，节点的 IP 地址不能更改。例如，当重新启动节点或更新 DHCP 租约时，IP 地址不应更改。如果节点的 IP 地址更改，就必须 [卸载](/cn/1.11/installing/production/uninstalling/) 节点。
- 脚本必须返回与 `config.yaml` 中指定的相同 IP 地址。例如，如果将 `config.yaml` 中的专用管理节点 IP 指定为 `10.2.30.4`，您的脚本在管理节点上运行时应返回相同的值。

1. 为您的环境创建 IP 检测脚本，并另存为 `genconf/ip-detect`。此脚本需要 `UTF-8` 加密并具备有效的 [shebang](https://en.wikipedia.org/wiki/Shebang_(Unix) 行。可以使用以下示例。

* #### 使用 AWS 元数据服务器

  此方法使用 AWS 元数据服务获取 IP 地址：

  ```bash
  #!/bin/sh
  # Example ip-detect script using an external authority
  # Uses the AWS Metadata Service to get the node's internal
  # ipv4 address
  curl -fsSL http://169.254.169.254/latest/meta-data/local-ipv4
  ```

 * #### 使用 GCE 元数据服务器

   此方法使用 GCE 元数据服务器获取 IP 地址：

   ```bash
   #!/bin/sh
   # Example ip-detect script using an external authority
   # Uses the GCE metadata server to get the node's internal
   # ipv4 address
   
   curl -fsSl -H "Metadata-Flavor: Google" http://169.254.169.254/computeMetadata/v1/instance/network-interfaces/0/ip
   ```

 * #### 使用现有网络接口的 IP 地址

 此方法发现节点特定网络接口的 IP 地址。

 如果有带有不同内部 IP 地址的多代硬件，可以在主机之间更改网络接口名称。IP 检测脚本必须考虑网络接口名称更改。如果将多个 IP 地址连接到同一个网络接口，或建立复杂的 Linux 网络等，则也会混淆示例脚本。

   ```bash
    #!/usr/bin/env bash
    set -o nounset -o errexit
    export PATH=/usr/sbin:/usr/bin:$PATH
    echo $(ip addr show eth0 | grep -Eo '[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}' | head -1)
    ```

 * #### 使用 Mesos 管理节点的网络路由

 此方法使用 Mesos 管理节点的路由查找源 IP 地址，然后与该节点通信。

 在本示例中，我们假设 Mesos 管理节点具有 IP 地址 `172.28.128.3`。可以使用在此脚本中使用任何语言。Shebang 行必须指向所用语言的相应环境，且输出必须是正确的 IP 地址。

 [enterprise type="inline" size="small" /]

```bash
#!/usr/bin/env bash
set -o nounset -o errexit
MASTER_IP=172.28.128.3
echo $(/usr/sbin/ip route show to match 172.28.128.3 | grep -Eo '[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}' | tail -1)
```

[oss type="inline" size="small" /]

```bash
#!/usr/bin/env bash
set -o nounset -o errexit -o pipefail
export PATH=/sbin:/usr/sbin:/bin:/usr/bin:$PATH
MASTER_IP=$(dig +short master.mesos || true)
MASTER_IP=${MASTER_IP:-172.28.128.3}
INTERFACE_IP=$(ip r g ${MASTER_IP} | \
awk -v master_ip=${MASTER_IP} '
BEGIN { ec = 1 }
 {
  if($1 == master_ip) {
        print $7
        ec = 0
 } else if($1 == "local") {
        print $6
        ec = 0
 }
      if (ec == 0) exit;
    }
         if (ec == 0) exit;
       }
         END { exit ec }
       ')
       echo $INTERFACE_IP
   ```

[enterprise]
# 创建故障域检测脚本
[/enterprise]

DC/OS 集群默认启用 [故障域意识](/cn/1.11/deploying-services/fault-domain-awareness/)，所以无须更改 `config.yaml` 来使用此功能。但必须包含名为 `fault-domain-detect` 故障域检测脚本到您的 `./genconf` 目录。要选择禁用故障域感知，请将 `config.yaml` 文件中的 `fault_domain_enabled` 参数设置为 `false`。


1. 创建名为 `fault-domain-detect` 的故障域检测脚本，在每个节点上运行，以检测节点的故障域。安装过程中此脚本的输出被传递到 Mesos。

 推荐脚本输出的格式为 `fault_domain: region: name: <region>, zone: name: <zone>`。我们提供 [AWS 和 Azure 故障域检测脚本](https://github.com/dcos/dcos/tree/master/gen/fault-domain-detect)。对于具有 aws 节点和 azure 节点的集群，可将两者组合为一个脚本。可以使用这些模型为本地集群创建故障域检测脚本。

   <p class="message--note"><strong>注意：</strong>如果在环境中使用代理，此脚本将不起作用。如果使用代理，则必须进行修改。</p>


2. 添加新创建的 `fault-domain-detect` 脚本到 bootstrap 节点的 `/genconf` 目录。


# 创建配置文件

在这一步，可以创建针对您的环境自定义的 YAML 配置文件。DC/OS 在安装期间使用此配置文件生成集群安装文件。

[Enterprise]
## 设置超级用户密码
[/enterprise]
在以下说明中，我们假定您使用 ZooKeeper 进行共享存储。

1. 在 bootstrap 节点运行此命令，创建用于超级用户身份认证的带井号密码，其中 `<superuser_password>` 是超级用户密码。

2. 保存带井号的密码密钥，用于`config.yaml` 文件中的 `superuser_password_hash` 参数 。

  ```bash
  sudo bash dcos_generate_config.ee.sh --hash-password <superuser_password>
  ```

  以下是带井号密码输出的示例。

  ```
  Extracting an image from this script and loading it into a docker daemon, can take a few minutes.
  dcos-genconf.9eda4ae45de5488c0c-c40556fa73a00235f1.tar
  Running mesosphere/dcos-genconf docker with BUILD_DIR set to /home/centos/genconf
  00:42:10 dcos_installer.action_lib.prettyprint:: ====> HASHING PASSWORD TO SHA512
  00:42:11 root:: Hashed password for 'password' key:
  $6$rounds=656000$v55tdnlMGNoSEgYH$1JAznj58MR.Bft2wd05KviSUUfZe45nsYsjlEl84w34pp48A9U2GoKzlycm3g6MBmg4cQW9k7iY4tpZdkWy9t1
  ```

## 创建配置 
创建配置文件并另存为 `genconf/config.yaml`。可以使用此模板开始创建。

Enterprise 指定三个Mesos 管理节点、静态管理节点发现列表、Exhibitor 的内部存储后端、一个自定义代理、指定的安全模式，以及云专用的 DNS 解析器。[enterprise type="inline" size="small" /]

此开源模板指定三个 Mesos 管理节点、三个用于 Exhibitor 存储的 ZooKeeper 实例、静态管理节点发现列表、Exhibitor 的内部存储后端、一个自定义代理，以及云专用的 DNS 解析器。[oss type="inline" size="small" /]

如果服务器在您的 `/etc/resolv.conf` 中安装时带有域名，请添加 `dns_search` 参数。有关参数描述和配置示例，请参阅 [文档](/cn/1.11/installing/ent/custom/configuration/configuration-parameters/)。

<p class="message--note"><strong>注意: </strong> 如果 AWS DNS IP 在您的国家/地区不可用，可以使用本地 DNS 服务器替换 AWS DNS IP 服务器 <tt>8.8.8.8</tt> 和 <tt>8.8.4.4</tt>。</p>
<p class="message--note"><strong>注意: </strong>如果指定了 `master_discovery: static`，还必须创建脚本，以进行内部 IP 到 bootstrap 节点上的公共 IP（例如， <tt>genconf/ip-detect-public</tt>）的映射。此脚本在以下 IP 中引用：<tt>ip_detect_public_filename: <relative-path-from-dcos-generate-config.sh></tt>.</p>
<p class="message--note"><strong>注意: </strong> 在 AWS 或任何其他无法控制节点的 IP 地址的环境中，都需要设置 <tt>master_discovery</tt> 才能使用 <tt>master_http_load_balancer</tt>，并且需要设置负载均衡器。</p>

[enterprise]
## Enterprise 模板
[/enterprise]

```bash
bootstrap_url: http://<bootstrap_ip>:80
cluster_name: <cluster-name>
superuser_username:
superuser_password_hash:
#customer_key in yaml file has been replaced by genconf/license.txt in DC/OS 1.11
#customer_key: <customer-key>
exhibitor_storage_backend: static
master_discovery: static
ip_detect_public_filename: <relative-path-to-ip-script>
master_list:
- <master-private-ip-1>
- <master-private-ip-2>
- <master-private-ip-3>
resolvers:
- 169.254.169.253
# Choose your security mode: permissive, strict, or disabled 
security: <security-mode>
# A custom proxy is optional. For details, see the configuration documentation.
use_proxy: 'true'
http_proxy: http://<user>:<pass>@<proxy_host>:<http_proxy_port>
https_proxy: https://<user>:<pass>@<proxy_host>:<https_proxy_port>
no_proxy:
- 'foo.bar.com'
- '.baz.com'
# Fault domain entry required for DC/OS Enterprise 1.11+
fault_domain_enabled: false
#If IPv6 is disabled in your kernel, you must disable it in the config.yaml
enable_ipv6: 'false'
```

[oss]
## 开源模板
[/oss]
       
       bootstrap_url: http://<bootstrap_ip>:80
       cluster_name: <cluster-name>
       exhibitor_storage_backend: static
       master_discovery: static
       ip_detect_public_filename: <relative-path-to-ip-script>
       master_list:
       - <master-private-ip-1>
       - <master-private-ip-2>
       - <master-private-ip-3>
       resolvers:
       - 169.254.169.253
       use_proxy: 'true' 
       http_proxy: http://<user>:<pass>@<proxy_host>:<http_proxy_port>
       https_proxy: https://<user>:<pass>@<proxy_host>:<https_proxy_port>
       no_proxy:
       - 'foo.bar.com' 
       - '.baz.com' 


# <a name="install-bash"></a>安装 DC/OS

在这一步，您将在 bootstrap 节点上创建一个自定义 DC/OS 构建文件，然后在集群上安装 DC/OS。使用这种方法，您可以
1. 自行打包 DC/OS 发布
2. 手动连接到每个服务器
3. 运行命令

**注意：**

- 由于覆盖网络存在集群配置问题，建议在升级或配置新集群时，在 `config.yaml` 中将 `enable_ipv6` 设置为 `false`。如果已升级到 DC/OS 1.11.x 而没有配置 `enable_ipv6`，或者 `config.yaml` 文件设置为 `true`，请不要添加新节点。可以在我们最新的重要 [产品咨询] 中找到更多信息和更详细的补救程序(https://support.mesosphere.com/s/login/?startURL=%2Fs%2Farticle%2FCritical-Issue-with-Overlay-Networking&ec=302) 。[enterprise type="inline" size="small" /]
- 必须生效以下项目才能安装 DC/OS：所有 DC/OS 节点上的 IP 检测脚本、DNS 和 NTP 均已同步时间。参见 [故障排除](/cn/1.11/installing/ent/troubleshooting/)，了解更多信息。
- 如果出现问题并且您想重新运行设置，请使用集群 [卸载] [11]说明。

**先决条件**

* 经过优化，可在节点上手动发布 DC/OS 的 `genconf/config.yaml` 文件。
* 包含 DC/OS Enterprise 许可证的 `genconf/license.txt` 文件。[enterprise type="inline" size="small" /]
* `genconf/ip-detect` 脚本。

**注意：** 术语 `dcos_generate_config file` 是指 `dcos_generate_config.ee.sh` 文件或 `dcos_generate_config.sh` 文件，具体取决于您使用的是 Enterprise 版本还是开源版本的 DC/OS。

- 下载并保存 [dcos_generate_config file](https://support.mesosphere.com/hc/en-us/articles/213198586-Mesosphere-Enterprise-DC-OS-Downloads) 到 bootstrap 节点。此文件用于创建自定义 DC/OS 构建文件。请联系销售代表或 <a href="mailto:sales@mesosphere.com">sales@mesosphere.com</a>，访问此文件。[enterprise type="inline" size="small" /]

 或

- 下载并保存 [dcos_generate_config file](https://downloads.dcos.io/dcos/stable/dcos_generate_config.sh) 到 bootstrap 节点。此文件用于创建自定义 DC/OS 构建文件。[oss type="inline" size="small" /]

    ```bash
    curl -O https://downloads.dcos.io/dcos/stable/dcos_generate_config.sh
    ```


1. 在 bootstrap 节点运行 DC/OS 安装工具 shell 脚本，生成自定义 DC/OS 构建文件。安装脚本提取 Docker 容器，该容器使用通用 DC/OS 安装工具文件为集群创建自定义 DC/OS 构建文件。构建文件会输出到 `./genconf/serve/`。

 可以通过以下方式查看所有自动命令行安装工具选项：
 * `dcos_generate_config.ee.sh --help` 标记 [enterprise type="inline" size="small" /] 
 或 
 * `dcos_generate_config.sh --help` 标记。[oss type="inline" size="small" /]


[enterprise type="inline" size="small" /]
```
 sudo bash dcos_generate_config.ee.sh
```

此时，目录结构应类似于：
```
 ├── dcos-genconf.c9722490f11019b692-cb6b6ea66f696912b0.tar
 ├── dcos_generate_config.ee.sh
 ├── genconf
 │ ├── config.yaml
 │ ├── ip-detect
 │ ├── license.txt
```

[oss type="inline" size="small" /]
```
 sudo bash dcos_generate_config.sh 
```

此时，目录结构应类似于：
```
├── dcos-genconf. <HASH>.tar
├── dcos_generate_config.sh
├── genconf
│ ├── config.yaml
│ ├── ip-detect
```   

- 要使安装脚本生效，必须首先创建 `genconf/config.yaml` 和 `genconf/ip-detect`。

2. 在主目录中运行以下命令，以通过 NGINX Docker 容器托管 DC/OS 安装包。对于 `<your-port>`, 指定在中使用的端口值 `bootstrap_url`。

   ```bash
   sudo docker run -d -p <your-port>:80 -v $PWD/genconf/serve:/usr/share/nginx/html:ro nginx
   ```

3. <A name="masterinstall"></A>在使用自定义生成文件安装 DC/OS 之后，继续在每个主节点上运行以下命令：

 * SSH 连接到管理节点。

        ```bash
        ssh <master-ip>
        ```
 * 创建并导航到新目录。

 * 创建并导航到新目录。

    ```bash
    mkdir /tmp/dcos && cd /tmp/dcos
    ```

 * 在 NGINX Docker 容器中下载 DC/OS 安装工具，其中 `<bootstrap-ip>` and `<your_port>` are specified in `bootstrap_url`。

    ```bash
    curl -O http://<bootstrap-ip>:<your_port>/dcos_install.sh
    ```

 * 运行以下命令，在管理节点上安装 DC/OS。

    ```bash
    sudo bash dcos_install.sh master
    ```

 <p class="message--note"><strong>注意: </strong> DC/OS 可能一直发出错误消息，直到所有管理节点都配置完毕，尽管这对群集 DC/OS 没有实际损害。</p>

4. <A name="slaveinstall"></A>在每个代理节点上运行以下命令，使用自定义构建文件安装 DC / OS：

 * SSH 连接到代理节点。

    ```bash
    ssh <agent-ip>
   ```

 * 创建并导航到新目录。

    ```bash
    mkdir /tmp/dcos && cd /tmp/dcos
   ```

 * 在 NGINX Docker 容器中下载 DC/OS 安装工具，其中 `<bootstrap-ip>` and `<your_port>` are specified in `bootstrap_url`。

    ```bash
    curl -O http://<bootstrap-ip>:<your_port>/dcos_install.sh
    ```

 * 运行此命令，在代理节点上安装 DC/OS。您必须将代理节点指定为 [公共代理节点][2] 或 [专用代理节点][3]。

 * 专用代理节点：

    ```bash
   sudo bash dcos_install.sh slave
    ```

 * 公共代理节点：

   ```bash
   sudo bash dcos_install.sh slave_public
   ```


   <p class="message--note"><strong>注意: </strong> 如果遇到错误（例如在 journald 中的 <tt>Time is marked as bad</tt>、<tt>adjtimex</tt> 或 <tt>Time not in sync</tt>），请验证是否在所有节点都启用了网络时间协议 (NTP)。如需更多信息，请参阅 <a href="/cn/1.11/installing/ent/custom/system-requirements/#port-and-protocol">系统要求</a> 文档。</p>

5. 监视 Exhibitor 并等待其融合到 `http://<master-ip>:8181/exhibitor/v1/ui/index.html`。

   <p class="message--note"><strong>注意: </strong> 该进程大约需要 10 分钟。在此期间，您将看到管理节点在 Exhibitor 控制台上可见并上线，并且最后会显示一个绿灯图标。</p>

   ![Exhibitor for ZooKeeper](/cn/1.11/img/chef-zk-status.png)

   图 2. Exhibitor for ZooKeeper

   当状态图标为绿色时，可以访问 DC/OS Web 界面。

6. 在以下链接启动 DC/OS Web 界面：`http://<master-node-public-ip>/`。如果无法启动，请查看 [故障排除][11] 文档。

 <p class="message--note"><strong>注意: </strong>单击 **登录到 DC/OS**，浏览器就会显示您的连接不安全的警告。这是因为 DC/OS 使用自签名证书。可以忽略该错误，然后单击以继续。</p>

7. 输入您的管理员用户名和密码。

   ![Login screen](/cn/1.11/img/ui-installer-auth2.png)

   图 3. 登录对话


   成功了！现在将显示 UI 仪表板。

   ![UI dashboard](/cn/1.11/img/dashboard-ee.png)

   图 4. DC/OS UI 仪表板


### 后续步骤：Enterprise 和开源用户

下列链接提供了后续步骤的信息：
- [分配用户角色][7]。
- [系统要求](/cn/1.11/installing/production/system-requirements/)
- [公共代理节点][2]
- [专用代理节点][3]
- [安装 DC/OS 命令行界面 (CLI)][9]
- [使用节点和集群运行状况检查][12]
- [DC/OS 安装故障排除][10]
- [卸载 DC/OS][11]


[1]: /cn/1.11/installing/production/system-requirements/
[2]: /cn/1.11/overview/concepts/#public
[3]: /cn/1.11/overview/concepts/#private
[5]: /cn/1.11/img/ui-installer-auth2.png
[6]: /cn/1.11/img/dashboard-ee.png
[7]: /cn/1.11/security/ent/users-groups/
[8]: /cn/1.11/security/ent/users-groups/
[9]: /cn/1.11/cli/install/
[10]: /cn/1.11/installing/oss/troubleshooting/
[11]: /cn/1.11/installing/oss/custom/uninstall/
[12]: /cn/1.11/installing/production/deploying-dcos/node-cluster-health-check/

