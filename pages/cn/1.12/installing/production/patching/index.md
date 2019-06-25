---
layout: layout.pug
navigationTitle: 打补丁
title: 打补丁
menuWeight: 20
excerpt: 了解群集补丁
---

DC/OS 补丁描述了一组更改和支持数据，用于更新、修复或改进 DC/OS 的特性/功能。包含次要变更的单点发布也称为补丁。

补丁流程包括以下内容：
- 说明修复问题、已知问题和限制，明显变更和安全改善
- 不会影响工作负载，这是在不停机的情况下修补实时群集的重要部分
- 帮助用户了解影响 DC/OS 功能的次要变更

<p class="message--note"><strong>注意：</strong>这些说明仅适用于对群集配置或维护版本号的更改。例如，从 DC/OS 1.12.1 到 1.12.2。</p>

- 要更新到较新的主要或次要版本（例如，从 1.11 到 1.12），请参阅 [升级](/1.12/installing/production/upgrading/) 的说明。

如果在支持的操作系统上执行修补且所有前提条件均满足，则修补 **应该** 维持在群集上运行任务的状态。

## 重要指南

- 在修补 DC/OS 之前，请先查看 [版本注释](/1.12/release-notes/)。
- 由于覆盖网络存在群集配置问题，建议在修补或配置新群集时，在 `config.yaml` 中将 `enable_ipv6` 设为“false”。您可以在我们最新的重要 [产品咨询](https://support.mesosphere.com/s/login/?startURL=%2Fs%2Farticle%2FCritical-Issue-with-Overlay-Networking&ec=302) 中找到更多信息和更稳固的补救程序 。
- 如果 IPv6 在内核中被禁用，则必须在 `config.yaml` 文件中禁用 IPv6。
- DC/OS 企业版许可证密钥必须驻留在 `genconf/license.txt` 文件中。[enterprise type="inline" size="small" /]
- 如果没有修补全部管理节点，DC/OS GUI 和其他更高级别的系统 API 可能不一致或不可用。例如，修补后的 DC/OS Marathon 首要实例无法连接到首要的 Mesos 管理节点上，直到该节点也得到修补为止。出现这种情况时：

 - DC/OS GUI 不能提供准确的服务列表。
 - 对于多管理节点配置，在一个管理节点完成修补后，您可以从端口 8181 上的 Exhibitor UI 监控其余管理节点的运行状况。
- 升级后的 DC/OS Marathon 首要实例无法连接至不安全（未打补丁的）首要 Mesos 管理节点。在所有管理节点得到补丁之前，DC/OS UI 都不可信任。有多个 Marathon 调度器实例和多个 Mesos 管理节点，每个均已修补，Marathon 首要实例可能不是 Mesos 首要实例。
- 打补丁后，Mesos UI 中的任务历史记录不会持续保存。
- DC/OS Enterprise 可在 [此处](https://support.mesosphere.com/hc/en-us/articles/213198586-Mesosphere-Enterprise-DC-OS-Downloads)下载。[enterprise type="inline" size="small" /]

## 支持的补丁路径
- 从任何当前版本到下一版本。例如，支持 1.12.0 到 1.12.1 的补丁。
- 从任何当前版本到同一版本。例如，支持 1.12.0 到 1.12.0 的补丁。这对于进行配置更改非常有用。

## 修改 DC/OS 配置

将补丁版本应用于当前安装的软件版本时，对群集配置所做的更改就会存在限制。例如，如果要修补一个版本，则无法更改群集的安全模式。

要修改您的 DC/OS 配置，必须首先在 `config.yaml` 文件作出配置更改。然后，您可以使用修改后的 `config.yaml` 文件运行安装程序，以更新群集，从而能够使用新配置。更改 DC/OS 配置与修补主机的风险相同。配置错误可能会使主机或整个群集崩溃。

只能修改 DC/OS 配置参数的子集。在 DC/OS 之上运行的任何软件上的不良效应不在本文档的范围之内。请联系 Mesosphere 服务支持获取更多信息。

以下是可以修改的参数的列表：

- [`dns_search`](/1.12/installing/production/advanced-configuration/configuration-reference/#dns-search)
- [`docker_remove_delay`](/1.12/installing/production/advanced-configuration/configuration-reference/#docker-remove-delay)
- [`gc_delay`](/1.12/installing/production/advanced-configuration/configuration-reference/#gc-delay)
- [`resolvers`](/1.12/installing/production/advanced-configuration/configuration-reference/#resolvers)
- [`telemetry_enabled`](/1.12/installing/production/advanced-configuration/configuration-reference/#telemetry-enabled)
- [`use_proxy`](/1.12/installing/production/advanced-configuration/configuration-reference/#use-proxy)
    - [`http_proxy`](/1.12/installing/production/advanced-configuration/configuration-reference/#use-proxy)
    - [`https_proxy`](/1.12/installing/production/advanced-configuration/configuration-reference/#use-proxy)
    - [`no_proxy`](/1.12/installing/production/advanced-configuration/configuration-reference/#use-proxy)
- [`enable_mesos_input_plugin`](/1.12/installing/production/advanced-configuration/configuration-reference/#enable-mesos-input-plugin)

安全模式（`security`）可以更改，但只能更改为更严格的安全模式。不支持安全降级。例如，如果群集处于 `strict` 模式，而您希望降级至 `permissive` 模式，则必须重新安装群集并终止所有运行的工作负载。

有关不同安全模式的更多信息，请参阅安全 [模式](/1.12/installing/production/advanced-configuration/configuration-reference/#security-enterprise)。

# 说明
必须执行这些步骤才能进行版本补丁和群集配置更改。

## 先决条件

- Mesos、Mesos 框架、Marathon、Docker 和群集中的所有运行任务应稳定且处于已知的运行良好状态。
- 出于 Mesos 兼容性原因，我们建议将任何运行 Marathon-on-Marathon 实例修补至 Marathon 版本1.3.5，然后进行此 DC/OS 修补。
- 您必须有权访问与之前 DC/OS 版本一起使用的配置文件的副本：`config.yaml` 和 `ip-detect`。
- 您必须使用 `systemd` 218 或更新版本才能维持任务状态。
- 所有主机（管理和代理节点）必须能够与所有其他主机通信，如 [网络安全](/1.12/administering-clusters/securing-your-cluster/#network-security) 所述。
- 在 CentOS 或 RedHat 中，使用此命令安装 IP 集（在某些 IP 检测脚本中使用）：`sudo yum install -y ipset`
- 您必须熟悉使用 `systemctl` 和 `journalctl` 命令行工具，以查看和监控服务状态。故障排除说明可在本 [文档](#故障排除) 结尾部分找到。
- 您必须熟悉 [DC/OS 安装指南](/1.12/installing/production/deploying-dcos/installation/)。
- 修补之前要 [对 ZooKeeper 进行实时捕捉](/1.12/installing/installation-faq/#q-how-do-i-backup-zookeeper-using-guano)。Marathon 支持回滚，但不支持降级。
- 修补之前 [对 IAM 数据库进行实时捕捉](/1.12/installing/installation-faq/#q-how-do-i-backup-the-iam-database-enterprise)。
- 确保在开始修补之前， Marathon 事件订阅者已被禁用。完成修补后，保持其禁用状态，因为此功能现已被弃用。

 <p class="message--note"><strong>注意：</strong>Marathon 事件订阅者默认为禁用。勾选查看是否已将行 <code>  -  event_subscriber“http_callback”</code> 添加到管理节点上的 <code> sudo vi /opt/mesosphere/bin/marathon.sh</code>。如果是，就需要移除该行，以禁用事件订阅者。</p>

- 确认在开始修补前，所有 Marathon 应用程序限制都有效。使用 [此脚本](https://github.com/mesosphere/public-support-tools/blob/master/check-constraints.py) 检查限制是否有效。
- [备份您的群集](/1.12/administering-clusters/backup-and-restore/)。
- **可选** 您可以将自定义 [节点和群集运行状况检查](/1.12/installing/production/deploying-dcos/node-cluster-health-check/#custom-health-checks) 添加到 `config.yaml`。

## bootstrap 节点

选择您所需的安全模式，然后按照适用的补丁说明进行。

- [修补 DC/OS 1.12 而不更改安全模式](#current-security)
- [在严格安全模式下修补 DC/OS 1.12](#strict)

# <a name="current-security"></a>修补 DC/OS 1.12 而不更改安全模式
该程序修补 DC/OS 1.12 群集而不更改群集的 [安全模式](/1.12/1.12/installing/production/advanced-configuration/configuration-reference/#security-enterprise)。
1. 将现有 `config.yaml` 和 `ip-detect` 文件复制到 bootstrap 节点上的空 `genconf` 文件夹。文件夹与安装工具应当在同一个目录。
1. 将旧的 `config.yaml` 合并为新的 `config.yaml` 格式。大多数情况下，区别会很小。

    <p class="message--note"><strong>注意：</strong>在修补期间，您无法更改 <code>exhibitor_zk_backend</code> 设置。<code>config.yaml</code> 的语法可能与早期版本不同。有关当前 <code>config.yaml</code> 语法和参数的详细说明，请参阅 <a href="/1.12/installing/production/advanced-configuration/configuration-reference/">文档</a>。</p>

1. 更新 config.yaml 的格式后，比较旧的 `config.yaml` 和新的 `config.yaml`。验证路径或配置没有差异。修补时更改这些会导致灾难性群集故障。
1. 根据需要修改 `ip-detect` 文件。
1. 构建安装工具包。

 1. 下载 `dcos_generate_config.ee.sh` 文件。
 1. 生成安装文件。将以下命令中的 `<installed_cluster_version>` 替换为当前要修补的群集上正在运行的 DC/OS 版本，例如 `1.8.8`。
        ```bash
        dcos_generate_config.ee.sh --generate-node-upgrade-script <installed_cluster_version>
        ```
 1. 上一步骤的命令将在其输出的最后一行产生 URL，前缀为 `Node patch script URL:`。记下此 URL 以供后续使用。它在本文档中被称为“节点补丁脚本 URL”。
 1. 运行 [nginx](/1.12/installing/production/deploying-dcos/installation/) 容器以为安装文件提供服务。

1. 转到 DC/OS 管理节点 [程序](/1.12/installing/production/patching/#masters) 完成安装。

# <a name="strict"></a>在严格模式下修补 DC/OS 1.12
该程序的在安全性严格 [安全模式](/1.12/installing/production/advanced-configuration/configuration-reference/#security-enterprise) 下修补到 DC/OS 1.12。

如果正在更新运行的 DC/OS 群集在 `strict` 安全模式下运行，则请注意，在迁移到严格模式后，安全漏洞可能会持续存在。当转到严格模式时，您的服务现在需要身份认证和授权，以便在 Mesos 注册或访问其 HTTP API。在升级到严格模式之前，应在宽容模式下测试这些配置，以便在升级期间维护调度程序和脚本正常运行时间。

由于宽容模式允许一些不安全的行为，因此群集在升级到严格安全模式之前可能已遭到泄露。要获得严格安全模式的全部安全优势，我们建议您在每个节点上重新安装操作系统并安装新群集。

**先决条件：**

- 群集必须是 [DC/OS 1.12 的新近修补版本](#current-security) 并在 [宽容安全模式](#permissive) 下运行，然后才能更新到严格模式。如果群集在修补到 DC/OS 1.12 之前以严格模式运行，则可以跳过该程序。
- 如果您在运行 Pod 或者已在自定义配置中启用 Mesos “HTTP 命令执行器” 功能，则必须在修补到严格模式之前，以 DC/OS 1.12 宽容安全模式重启这些任务。否则，在修补管理节点时，这些任务将会被重新启动。

要将群集从宽容的安全性更新为严格的安全性，请完成以下步骤：

1. 在 `config.yaml` 中以 `security: strict` 替换 `security: permissive`。不要对 `config.yaml` 中的路径或配置进行任何其他更改。
1. 根据需要修改 `ip-detect` 文件。
1. 构建安装工具包。

 1. 下载 `dcos_generate_config.ee.sh` 文件。
 1. 生成安装文件。将以下命令中的 `<installed_cluster_version>` 替换为当前要修补的群集上正在运行的 DC/OS 版本，例如 `1.8.8`。
        ```bash
        dcos_generate_config.ee.sh --generate-node-upgrade-script <installed_cluster_version>
        ```
 1. 上一步骤的命令将在其输出的最后一行产生 URL，前缀为 `Node patch script URL:`。记下此 URL 以供后续使用。它在本文档中被称为“节点补丁脚本 URL”。
 1. 运行 [nginx] (安装) 容器以服务安装文件。

1. 转到 DC/OS 管理节点 [程序](#masters) 以完成安装。

## <a name="masters"></a>DC/OS 管理节点

采用以下步骤，继续以任何顺序修补每个管理节点，每次修补一个。完成每次修补后，监控 Mesos 管理节点度量标准，确保节点已重新加入群集并完成了协调。

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

 1. 监视 Exhibitor 并等待其在 `http://<master-ip>:8181/exhibitor/v1/ui/index.html` 中聚合。确认管理节点已成功重新加入 ZooKeeper quorum（状态指示灯将变为绿色）。

    <p class="message--note"><strong>注意：</strong>如果要从宽容模式修补到严格模式，此 URL 将是 "https://..."。</p>

 1. 等到 `dcos-mesos-master` 单元启动并运行。
 1. 验证 `curl http://<dcos_master_private_ip>:5050/metrics/snapshot` 的度量标准 `registrar/log/recovered` 的值为 `1`。

    <p class="message--note"><strong>注意：</strong>如果要从宽容模式修补到严格模式，此 URL 将是 "curl https://..." 而且您将需要 JWT 进行访问。</p>
    [enterprise type="inline" size="small" /]

 1. 验证 `/opt/mesosphere/bin/mesos-master --version` 表示修补后的管理节点正在运行 [发行说明](/1.12/release-notes/) 中指定的 Mesos 版本，例如 `1.5.1`。
 1. 验证副本不足范围的数量是否随着 IAM 数据库被复制到新管理节点而已经降至零。这可以通过运行以下命令并确认右侧的最后一列是否只显示零来完成。
	    
    ```bash
    sudo /opt/mesosphere/bin/cockroach node status --ranges --certs-dir=/run/dcos/pki/cockroach --host=$(/opt/mesosphere/bin/detect_ip)
    +----+---------------------+--------+---------------------+---------------------+------------------+-----------------------+--------+--------------------+------------------------+
    | id |       address       | build  |     updated_at      |     started_at      | replicas_leaders | replicas_leaseholders | ranges | ranges_unavailable | ranges_underreplicated |
    +----+---------------------+--------+---------------------+---------------------+------------------+-----------------------+--------+--------------------+------------------------+
    |  1 | 172.31.7.32:26257   | v1.1.4 | 2018-03-08 13:56:10 | 2018-02-28 20:11:00 |              195 |                   194 |    195 |                  0 |                      0 |
    |  2 | 172.31.10.48:26257  | v1.1.4 | 2018-03-08 13:56:05 | 2018-03-05 13:33:45 |              200 |                   199 |    200 |                  0 |                      0 |
    |  3 | 172.31.23.132:26257 | v1.1.4 | 2018-03-08 13:56:01 | 2018-02-28 20:18:41 |              187 |                   187 |    187 |                  0 |                      0 |
    +----+---------------------+--------+---------------------+---------------------+------------------+-----------------------+--------+--------------------+------------------------+
    ```
     如果 `ranges_underreplicated` 列列出了任何非零值，则等待一分钟，然后重新运行此命令。一旦所有数据被安全地复制，数值将聚合为零。

1. 转到 DC/OS 代理节点 [程序](#agents) 以完成安装。

## <a name="agents"></a>DC/OS 代理

<p class="message--note"><strong>注意：</strong>修补代理节点时，在代理节点和任务到期之前，代理节点响应来自 Mesos 管理节点的运行状况检查 ping 的时间超过五分钟才是超时。</p>

在所有 DC/OS 代理节点上：

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

 - 验证 `curl http://<dcos_agent_private_ip>:5051/metrics/snapshot` 的度量标准 `slave/registered` 的值为 `1`。
 - 监控 Mesos UI 以验证修补的节点是否重新加入 DC/OS 群集以及任务是否已协调 (`http://<master-ip>/mesos`)。如果要从宽容模式修补到严格模式，此 URL 将是 `https://<master-ip>/mesos`。

## <a name="troubleshooting"></a>故障排除建议

以下命令应提供对修补问题的深度信息：

### 在所有群集节点上

```bash
sudo journalctl -u dcos-download
sudo journalctl -u dcos-spartan
sudo systemctl | grep dcos
```

如果您的修补因为 [自定义节点或群集检查](/1.12/installing/production/deploying-dcos/node-cluster-health-check/#custom-health-checks) 而失败，运行以下命令可了解更多详细信息：
```bash
dcos-check-runner check node-poststart
dcos-check-runner check cluster
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

### 注意

DC/OS 1.12 Universe 中可用的软件包比旧版本 Universe 中的要新。服务在安装 DC/OS 时不会自动修补，因为并非所有 DC/OS 服务都具有保持现有状态的修补路径。

