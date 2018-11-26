---
layout: layout.pug
navigationTitle: 打补丁
title: 打补丁
menuWeight: 20
excerpt: 了解集群补丁
---

# 不停机修补实时集群

DC/OS 补丁描述了一组更改和支持数据，用于更新、修复或改进 DC/OS 的特性/功能。软件包含次要变更的单点发布也称为补丁。

补丁流程包括以下内容：
- 说明修复问题、已知问题/限制，明显变更和安全增强
- 不会影响工作负载，这是在不停机的情况下修补实时集群重要的一部分
- 帮助用户了解影响 DC/OS 功能的次要变更

示例：DC/OS 1.X.A 至 1.X.B (1.11.1 --> 1.11.2)

**注意：** 修补进程仅在次要版本之间发生。

## 重要指南

- 在修补 DC/OS 之前，请先查看 [版本注释](/cn/1.11/release-notes/)。
- 由于覆盖网络存在集群配置问题，建议在修补或配置新集群时，在 `config.yaml` 中将 `enable_ipv6` 设为“false”。如果已修补到 DC/OS 1.11.x 而没有配置 `enable_ipv6`，或者 `config.yaml` 文件设置为 `true`，则在 DC/OS 1.11.3 发布之前不要添加新节点。您可以在我们最新的重要 [产品咨询] 中找到更多信息和更稳固的补救程序(https://support.mesosphere.com/s/login/?startURL=%2Fs%2Farticle%2FCritical-Issue-with-Overlay-Networking&ec=302) 。
- `config.yaml` 文件中有几个必须在修补前宣布的新选项。即使您之前通过 `config.yaml` 文件成功安装了 DC/OS，该文件需要新增功能才能与 DC/OS 1.11 一起运行。检查 `fault_domain_enabled` 和 `enable_ipv6` 是否已添加到 `config.yaml` 文件中。您可以查看 [此处]的样本文件 (1.11/installing/production/deploying-dcos/installation/#create-a-configuration-file). 
- 如果 IPv6 在内核中被禁用，则 IPv6 必须在 `config.yaml` 文件中禁用才能确保修补成功。
- DC/OS Enterprise 现在执行许可证密钥。许可证密钥必须驻留在 genconf/license.txt 文件中，否则修补将失败。[enterprise type="inline" size="small" /]
- 直到全部管理节点都被修补完毕，DC/OS GUI 和其他更高级别的系统 API 可能不一致或不可用。例如，修补后的 DC/OS Marathon 首要实例无法连接到首要的 Mesos 管理节点上，直到该节点也得到修补为止。出现这种情况时：

 - DC/OS GUI 不能提供准确的服务列表。
 - 对于多管理节点配置，在一个管理节点完成修补后，您可以从端口 8181 上的 Exhibitor UI 监控其余管理节点的健康状况。
- 升级后的 DC/OS Marathon 首要实例无法连接至不安全（未打补丁的）首要 Mesos 管理节点。在所有管理节点得到修补之前，DC/OS UI 都不可信任。有多个 Marathon 调度器实例和多个 Mesos 管理节点，每个均已修补，Marathon 首要实例可能不是 Mesos 首要实例。
- Mesos UI 中的任务历史记录不会持续到修补。
- DC/OS Enterprise 可在 [此处](https://support.mesosphere.com/hc/en-us/articles/213198586-Mesosphere-Enterprise-DC-OS-Downloads)下载。[enterprise type="inline" size="small" /]

## 支持的补丁路径

- 从任何当前版本到下一版本。例如，支持 1.9.1 到 1.9.2 的补丁。
- 从任何当前版本到同一版本。例如，支持 1.9.0 到 1.9.0 的补丁。这对于进行配置更改非常有用。



## 修改 DC/OS 配置

 **不能** 在修补到新版本的同时更改集群配置。必须通过对已安装版本的更新进行集群配置更改。例如，您无法同时将集群从 1.10.x 修补到 1.10.y 并添加更多公共代理节点。您可以更新为 1.10.x，然后修补为 1.10.y，或者可以修补到 1.10.y，再在修补后通过更新 1.10.y，添加更多公共代理。

要修改您的 DC/OS 配置，必须使用已修改的 `config.yaml` 运行安装工具并使用新的安装文件更新您的集群。更改 DC/OS 配置与修补主机的风险相同。配置错误可能会使主机或整个集群崩溃。

只能修改 DC/OS 配置参数的子集。对 DC/OS 上运行的任何软件的不利影响不在本文档探讨范围之内。请联系 Mesosphere 服务支持获取更多信息。

下表列出了可以修改的参数：

- [`dns_search`](/cn/1.11/installing/production/advanced-configuration/configuration-reference/#dns-search)
- [`docker_remove_delay`](/cn/1.11/installing/production/advanced-configuration/configuration-reference/#docker-remove-delay)
- [`gc_delay`](/cn/1.11/installing/production/advanced-configuration/configuration-reference/#gc-delay)
- [`resolvers`](/cn/1.11/installing/production/advanced-configuration/configuration-reference/#resolvers)
- [`telemetry_enabled`](/cn/1.11/installing/production/advanced-configuration/configuration-reference/#telemetry-enabled)
- [`use_proxy`](/cn/1.11/installing/production/advanced-configuration/configuration-reference/#use-proxy)
    - [`http_proxy`](/cn/1.11/installing/production/advanced-configuration/configuration-reference/#use-proxy)
    - [`https_proxy`](/cn/1.11/installing/production/advanced-configuration/configuration-reference/#use-proxy)
    - [`no_proxy`](/cn/1.11/installing/production/advanced-configuration/configuration-reference/#use-proxy)

安全模式 (`security`) 可以更改，但有特别的注意事项。

- 只能更新到更严格的安全模式。不支持安全降级。例如，如果集群处于 `permissive` 模式，而您希望降级至 `disabled` 模式，则必须重新安装集群并终止所有运行的工作负载。
- 每次更新时，只能将安全性提高一个级别。例如，您无法直接从 `disabled` 更新到 `strict` 模式。要从 `disabled` 提高到 `strict` 模式，必须首先更新到 `permissive` 模式，然后再从 `permissive` 更新到 `strict` 模式。

有关不同安全模式的更多信息，请参阅安全 [模式](/cn/1.11/installing/production/advanced-configuration/configuration-reference/#security-enterprise)。

# 说明
必须执行这些步骤才能进行版本补丁和集群配置更改。

## 先决条件

- Mesos、Mesos 框架、Marathon、Docker 和集群中的所有运行任务应稳定且处于已知的运行良好的状态。
- 出于 Mesos 兼容性原因，我们建议将任何运行 Marathon-on-Marathon 实例修补至 Marathon 版本1.3.5，然后进行此 DC/OS 修补。
- 您必须有权访问与之前 DC/OS 版本一起使用的配置文件的副本：`config.yaml` 和 `ip-detect`。
- 您必须使用 `systemd` 218 或更新版本才能维持任务状态。
- 所有主机（管理节点和代理节点）必须能够与所有端口上的所有其他主机通信（对于 TCP 和 UDP）。
- 在 CentOS 或 RedHat 中，使用此命令安装 IP 集（在某些 IP 检测脚本中使用）：`sudo yum install -y ipset`
- 您必须熟悉使用 `systemctl` 和 `journalctl` 命令行工具，以查看和监控服务状态。本 [文档](#故障排除) 结尾部分提供了故障排除说明。
- 您必须熟悉 [DC/OS 安装指南](/cn/1.11/installing/production/deploying-dcos/installation/)。
- 修补之前要对 ZooKeeper 截屏。Marathon 支持回滚，但不支持降级。
- 修补之前 [对 IAM 数据库截屏](/cn/1.11/installing/installation-faq/#q-how-do-i-backup-the-iam-database)。
- 确保在开始修补之前， Marathon 事件订阅者已被禁用。完成修补后，保持其禁用状态，因为此功能现已被弃用。
- **注意：** Marathon 事件订阅者默认为禁用。检查是否已将 `--event_subscriber "http_callback"` 行添加到管理节点上的 `sudo vi /opt/mesosphere/bin/marathon.sh`。如果是，就需要移除该行，以禁用事件订阅者。
- 确认在开始修补前，所有 Marathon 应用程序限制都有效。使用 [此脚本](https://github.com/mesosphere/public-support-tools/blob/master/check-constraints.py) 检查限制是否有效。
- [备份您的集群](/cn/1.11/administering-clusters/backup-and-restore/)。
- **可选** 您可以将自定义 [节点和集群运行状况检查](/cn/1.11/installing/production/deploying-dcos/node-cluster-health-check/#custom-health-checks) 添加到 `config.yaml`。

## Bootstrap 节点

选择您所需的安全模式，然后按照适用的补丁说明进行。

- [修补 DC/OS 1.11 而不更改安全模式](#current-security)
- [在宽容模式下修补 DC/OS 1.11]](#permissive)
- [在严格模式下修补 DC/OS 1.11](#strict)

# <a name="current-security"></a>修补 DC/OS 1.11 而不更改安全模式
改程序将 DC/OS 1.10 集群修补到 DC/OS 1.11 而不更改集群的 [安全模式](//1.11/installing/production/advanced-configuration/configuration-reference/#security-enterprise)。
1. 将现有 `config.yaml` 和 `ip-detect` 文件复制到 bootstrap 节点上的空 `genconf` 文件夹。文件夹与安装工具应当位于同一个目录中。
1. 将旧的 `config.yaml` 合并到新的 `config.yaml` 格式中。在大多数情况下，区别都很小。

 **注意：**

 * 在修补期间，您无法更改 `exhibitor_zk_backend` 设置。
 * `config.yaml` 的语法可能与早期版本不同。有关当前 `config.yaml` 语法和参数的详细说明，请参阅 [文档](/cn/1.11/installing/production/advanced-configuration/configuration-reference/)。
1. 更新 config.yaml 的格式后，比较旧的 `config.yaml` 和新的 `config.yaml`。验证路径或配置没有区别。修补时更改这些会导致灾难性集群故障。
1. 根据需要修改 `ip-detect` 文件。
1. 构建安装工具包。

 1. 下载 `dcos_generate_config.ee.sh` 文件。
 1. 生成安装文件。使用先前命令中使用的 IP 地址替换 `<installed_cluster_version>` in the command below with the DC/OS version currently running on the cluster you intend to patch, for example `1.8.8`。
        ```bash
        dcos_generate_config.ee.sh --generate-node-upgrade-script <installed_cluster_version>
        ```
 1. 上一步中的命令将在其输出的最后一行产生 URL，前缀为 `Node patch script URL:`。记录此 URL 以在后续步骤中使用。它在本文档中被称为“节点补丁脚本 URL”。
 1. 运行 [nginx](/cn/1.11/installing/production/deploying-dcos/installation/) 容器以便使用安装文件。

1. 转到 DC/OS 管理节点 [程序](/cn/1.11/installing/production/patching/#masters) 完成安装。

# <a name="permissive"></a>在宽容模式下的修补 DC/OS 1.11
此程序补丁在 [宽容安全模式] 下修补 DC/OS 1.11 (1.11/installing/production/advanced-configuration/configuration-reference/#security-enterprise)。

**先决条件：**

- 您的集群必须 [修补到 DC/OS 1.11](#current-security) 并在 [禁用安全模式] (1.11/install/production/advanced-configuration/configuration-reference/#security-enterprise) 下运行，才能修补为宽容模式。如果您的集群在补丁到 DC/OS 1.10，之前处于宽容模式，则可以跳过该程序。

<table class=“table” bgcolor=#858585>
<tr> 
  <td align=justify style=color:white><strong>重要信息：</strong>从禁用模式修补到宽容安全模式的补丁，您已配置的任何<a href="/1.11/installing/production/deploying-dcos/node-cluster-health-check/#custom-health-checks">自定义节点或集群运行状况检查</a>都会失败。未来版本支持绕过运行状况检查。</td> 
</tr> 
</table>

要将集群从禁用安全模式修补为宽容安全模式，请完成以下步骤：

1. 在 `config.yaml` 中以 `security: permissive` 替换 `security: disabled`。不要对 `config.yaml` 中的路径或配置进行任何其他更改。
1. 根据需要修改 `ip-detect` 文件。
1. 构建安装工具包。

 1. 下载 `dcos_generate_config.ee.sh` 文件。
 1. 生成安装文件。使用先前命令中使用的 IP 地址替换 `<installed_cluster_version>` in the below command with the DC/OS version currently running on the cluster you intend to patch, for example `1.8.8`。
        ```bash
        dcos_generate_config.ee.sh --generate-node-upgrade-script <installed_cluster_version>
        ```
 1. 上一步中的命令将在其输出的最后一行产生 URL，前缀为 `Node patch script URL:`。记录此 URL 以在后续步骤中使用。它在本文档中被称为“节点补丁脚本 URL”。
 1. 运行 [nginx][install] 容器以便使用安装文件。

1. 转到 DC/OS 管理节点 [程序](#masters) 完成安装。

# <a name="strict"></a>在严格模式下修补 DC/OS 1.11
该程序的在安全性严格 [模式](/cn/1.11/installing/production/advanced-configuration/configuration-reference/#security-enterprise) 下修补到 DC/OS 1.11。

如果正在更新运行的 DC/OS 集群在 `security: strict` 模式下运行，则请注意，在迁移到严格模式后，安全漏洞可能会持续存在。转到严格模式后，您的服务现在需要身份认证和授权，以便在 Mesos 注册或访问其 HTTP API。在打补丁到严格模式之前，应在宽容模式下测试这些配置，以便在升级期间维护调度程序和脚本正常运行时间。

**前提条件：**

- 集群必须 [修补到 DC/OS 1.11](#current-security) 并在 [宽容安全模式](#permissive) 下运行，然后才能更新到严格模式。如果集群在修补到 DC/OS 1.11 之前以严格模式运行，则可以跳过该程序。
- 如果您在运行 Pod 或者已在自定义配置中启用 Mesos“HTTP 命令执行器”功能，则必须在修补到严格模式之前，以 DC/OS 1.11 宽容安全模式重启这些任务。否则，在修补管理节点时，这些任务将会被重新启动。

要将集群从宽容安全模式更新为严格的安全性，请完成以下步骤：

1. 在 `config.yaml` 中以 `security: strict` 替换 `security: permissive`。不要对 `config.yaml` 中的路径或配置进行任何其他更改。
1. 根据需要修改 `ip-detect` 文件。
1. 构建安装工具包。

 1. 下载 `dcos_generate_config.ee.sh` 文件。
 1. 生成安装文件。使用先前命令中使用的 IP 地址替换 `<installed_cluster_version>` in the below command with the DC/OS version currently running on the cluster you intend to patch, for example `1.8.8`。
        ```bash
        dcos_generate_config.ee.sh --generate-node-upgrade-script <installed_cluster_version>
        ```
 1. 上一步中的命令将在其输出的最后一行产生 URL，前缀为 `Node patch script URL:`。记录此 URL 以在后续步骤中使用。它在本文档中被称为“节点补丁脚本 URL”。
 1. 运行 [nginx][install] 容器以便使用安装文件。

1. 转到 DC/OS 管理节点 [程序](#masters) 完成安装。

## <a name="masters"></a>DC/OS 管理节点

采用以下步骤，继续以任何顺序修补每个管理节点，每次修补一个。完成每次修补后，监控 Mesos 管理节点度量标准，确保节点已重新加入集群并完成了协调。

1. 下载并运行节点补丁脚本：
    ```bash
    curl -O <Node patch script URL>
    sudo bash dcos_node_upgrade.sh
    ```

1. 验证补丁脚本是否成功并以状态代码 `0` 退出：
    ```bash
    echo $?
    0
    ```

1. 验证补丁：

 1. 监视 Exhibitor 并等待其融合到 `http://<master-ip>:8181/exhibitor/v1/ui/index.html`。确认管理节点已成功重新加入 ZooKeeper 共识机制（状态指示灯将变为绿色）。

 **注意：** 如果要从宽容模式修补到严格模式，此 URL 将是 `https://...`。
 1. 等到 `dcos-mesos-master` 单元启动并运行。
 1. 验证 `curl http://<dcos_master_private_ip>:5050/metrics/snapshot` has the metric `registrar/log/recovered` with a value of `1`。
 **注意：** 如果要从宽容模式修补到严格模式，此 URL 将是 `curl https://...`，并且需要有 JWT 才能访问。
 1. 验证 `/opt/mesosphere/bin/mesos-master --version` 表示修补后的管理节点正在运行 Mesos 1.4.0。
 1. 验证副本不足范围的数量是否随着 IAM 数据库被复制到新管理节点而已经降至零。可以通过运行以下命令并确认右侧的最后一列是否只显示零来完成。
 ```bash
 sudo /opt/mesosphere/bin/cockroach node status --ranges --certs-dir=/run/dcos/pki/cockroach --host=$(/opt/mesosphere/bin/detect_ip)
        +----+---------------------+--------+---------------------+---------------------+------------------+-----------------------+--------+--------------------+------------------------+
 | id | address | build | updated_at | started_at | replicas_leaders | replicas_leaseholders | ranges | ranges_unavailable | ranges_underreplicated |
        +----+---------------------+--------+---------------------+---------------------+------------------+-----------------------+--------+--------------------+------------------------+
 | 1 | 172.31.7.32:26257 | v1.1.4 | 2018-03-08 13:56:10 | 2018-02-28 20:11:00 | 195 | 194 | 195 | 0 | 0 |
 | 2 | 172.31.10.48:26257 | v1.1.4 | 2018-03-08 13:56:05 | 2018-03-05 13:33:45 | 200 | 199 | 200 | 0 | 0 |
 | 3 | 172.31.23.132:26257 | v1.1.4 | 2018-03-08 13:56:01 | 2018-02-28 20:18:41 | 187 | 187 | 187 | 0 | 0 |
        +----+---------------------+--------+---------------------+---------------------+------------------+-----------------------+--------+--------------------+------------------------+
		```
 如果 `ranges_underreplicated` 栏列出任何非零值，则等待一分钟，然后重新运行命令。一旦所有数据被安全地复制，数值将聚合为零。

1. 转到 DC/OS 代理节点 [程序](#agents) 以完成安装。

## <a name="agents"></a>DC/OS 代理

**注意：** 修补代理节点时，，代理节点响应来自 Mesos 管理节点的运行状况检查 ping 的时间超过五分钟，代理节点和任务才会到期。
在所有 DC/OS 代理上：

1. 导航至 `/opt/mesosphere/lib` 目录并删除此库文件。删除此文件可防止发生冲突。

    ```bash
      libltdl.so.7
    ```

1. 下载并运行节点补丁脚本：
    ```bash
    curl -O <Node patch script URL>
    sudo bash dcos_node_upgrade.sh
    ```

1. 验证补丁脚本是否成功并以状态代码 `0` 退出：
    ```bash
    echo $?
    0
    ```

1. 验证补丁：

 - 验证 `curl http://<dcos_agent_private_ip>:5051/metrics/snapshot` has the metric `slave/registered` with a value of `1`。
 - 监控 Mesos UI 以验证修补的节点是否重新加入 DC/OS 集群以及任务是否已协调 (`http://<master-ip>/mesos`). If you are patching from permissive to strict mode, this URL will be `https://<master-ip>/mesos`。

## <a name="troubleshooting"></a>故障排除建议

以下命令应提供对修补问题的深度信息：

#### 在所有集群节点上

```bash
sudo journalctl -u dcos-download
sudo journalctl -u dcos-spartan
sudo systemctl | grep dcos
```

如果您的修补因为 [自定义节点或集群检查] 而失败(/1.11/installing/production/deploying-dcos/node-cluster-health-check/#custom-health-checks)，运行以下命令可了解更多详细信息：
```bash
dcos-diagnostics check node-poststart
dcos-diagnostics check cluster
```
### 在 DC/OS 管理节点上

```bash
sudo journalctl -u dcos-exhibitor
less /opt/mesosphere/active/exhibitor/usr/zookeeper/zookeeper.out
sudo journalctl -u dcos-mesos-dns
sudo journalctl -u dcos-mesos-master
```

### 在 DC/OS 代理节点上

```bash
sudo journalctl -u dcos-mesos-slave
```

## 注意：

- DC/OS 1.11 Universe 中可用的软件包比旧版本 Universe 中的要新。服务在已安装了 DC/OS 时不会自动修补，因为并非所有 DC/OS 服务都具有保持现有状态的修补路径。

