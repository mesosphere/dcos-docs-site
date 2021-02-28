---
navigationTitle:  升级
title: 升级
menuWeight: 25
excerpt: 升级 DC/OS 群集
model: /mesosphere/dcos/2.1/data.yml
---

升级是指在主要版本之间移动以添加新特性，或以新特性/功能替代现有特性的过程。只有您使用高级安装过程在群集上安装 DC/OS 时，才能升级 DC/OS。

<p class="message--important"><strong>重要信息：</strong>只有更改您的 DC/OS 安装的主要或次要版本时，才需要升级。例如：2.0 --> 2.1</p>

- 要更新到较新的维护版本（例如 2.0.2 到 2.0.4），请参阅 [修补](/mesosphere/dcos/cn/2.1/installing/production/patching/) 的说明。
- 要修改群集配置，请参阅 [修补] 的说明。(/mesosphere/dcos/cn/2.1/installing/production/patching/).

如果在支持的操作系统上执行升级且所有前提条件均满足，则升级 **应该** 维持在群集上运行任务的状态。

## 重要指南

- 生产安装方法是 DC/OS 的 **唯一** 建议升级路径。建议您熟悉 [DC/OS 部署指南](/mesosphere/dcos/cn/2.1/installing/production/deploying-dcos/) 后再继续操作。
- 在升级 DC/OS 之前，请先查看 [版本注释](/mesosphere/dcos/cn/2.1/release-notes/)
- 由于覆盖网络存在群集配置问题，建议在升级或配置新群集时，在 `enable_ipv6` 中将 `config.yaml` 设为“false”。您可以在我们最新重要的 [产品咨询] 中找到更多信息和更详细的补救流程(https://support.mesosphere.com/s/article/Critical-Issue-with-Overlay-Networking).[enterprise type="inline" size="small" /]
- 如果 IPv6 在内核中被禁用，则必须在 `config.yaml` 文件中禁用 IPv6。
- DC/OS 企业版许可证密钥必须驻留在 `genconf/license.txt` 文件中。[enterprise type="inline" size="small" /]
- 直到所有管理节点都升级到位，DC/OS GUI 和其他更高级别的系统 API 可能不一致或不可用。
  出现这种情况时：
   * DC/OS GUI 不能提供准确的服务列表。
- 升级后的 DC/OS Marathon 领导者无法连接至领导 Mesos 管理节点，直到它也升级。在所有管理节点都升级到位之前，DC/OS UI 都不可信任。有多个 Marathon 调度器实例和多个 Mesos 管理节点，每个均已升级，Marathon 领导者可能不是 Mesos 领导者。
- Mesos UI 中的任务历史记录不会持续到升级。

## 支持的升级路径
下表列出了支持的 DC/OS 2.1 升级路径。


|**显示图标** | **服务** |
|---------- | ------- |
| ⚫ | 支持 |
| ◯ | 不支持 |

<table style="border-collapse: collapse;" Border = "1" Cellpadding = "5" Cellspacing = "5">
   <caption>DC/OS 1.13 至 2.1 升级路径</caption>
   <tr>
    <th Rowspan = "20" Align = "center"><strong>升级<br> 前版本</strong></th>
   <tr>
    <th></th>
    <th Colspan = "20" Align = "center"><strong>升级后版本</strong></th>
   </tr>
    <th></th>
    <th Align = "center">2.1.0</th>
   </tr>
   <tr>
    <th>1.13.0</th>
    <td Align = "center">◯</td>
   </tr>
   <tr>
    <th>1.13.1</th>
    <td Align = "center">◯</td>
   </tr>
   <tr>
    <th>1.13.2</th>
    <td Align = "center">◯</td>
   </tr>
   <tr>
    <th>1.13.3</th>
    <td Align = "center">◯</td>
   </tr>
   <tr>
    <th>1.13.4</th>
    <td Align = "center">◯</td>
   </tr>
   <tr>
    <th>1.13.5</th>
    <td Align = "center">◯</td>
   </tr>
   <tr>
    <th>1.13.6</th>
    <td Align = "center">⚫</td>
   </tr>
   <tr>
    <th>1.13.7</th>
    <td Align = "center">⚫</td>
   </tr>
   <tr>
    <th>1.13.9</th>
    <td Align = "center">⚫</td>
   </tr>
</table>
<br>
<table style="border-collapse: collapse;" Border = "1" Cellpadding = "5" Cellspacing = "5">
   <caption>DC/OS 2.0 至 2.1 升级路径</caption>
   <tr>
    <th Rowspan = "20" Align = "center"><strong>升级<br> 前版本</strong></th>
   <tr>
    <th></th>
    <th Colspan = "20" Align = "center"><strong>升级后版本</strong></th>
   </tr>
    <th></th>
    <th Align = "center">2.1.0</th>
   </tr>
   <tr>
    <th>2.0.0</th>
    <td Align = "center">⚫</td>
   </tr>
   <tr>
    <th>2.0.1</th>
    <td Align = "center">⚫</td>
   </tr>
   <tr>
    <th>2.0.2</th>
    <td Align = "center">⚫</td>
   </tr>
   <tr>
    <th>2.0.3</th>
    <td Align = "center">⚫</td>
   </tr>
   <tr>
    <th>2.0.4</th>
    <td Align = "center">⚫</td>
   </tr>
  </table>

# 修改 DC/OS 配置 [enterprise type="inline" size="small" /]

**不能** 在升级到新版本的同时更改群集配置。必须通过对已安装版本的修补进行群集配置更改。例如，您无法同时将群集从 2.0 升级到 2.1 并添加更多公共代理节点。您可以通过修补到 2.0，然后升级到 2.1 的路径来添加更多公共代理节点，或者可以升级到 2.1，然后在升级后通过 [修补 2.1](/mesosphere/dcos/cn/2.1/installing/production/patching/) 的方式添加更多公共代理节点。

# 说明
必须执行这些步骤才能进行版本升级。

## 前提条件
- 企业用户：DC/OS Enterprise 下载可见 [此处](https://support.mesosphere.com/hc/en-us/articles/213198586-Mesosphere-Enterprise-DC-OS-Downloads).[enterprise type="inline" size="small" /]
- 开源用户：DC/OS Open Source 下载可见 [此处](https://dcos.io/releases/).[oss type="inline" size="small" /]
- Mesos、Mesos 框架、Marathon、Docker 和群集中的所有运行任务应稳定且处于已知的运行良好状态。
- 出于 Mesos 兼容性原因，我们建议将任何运行Marathon-on-Marathon 实例升级至 Marathon 版本1.3.5，然后进行此 DC/OS 升级。
- 您必须有权访问与之前 DC/OS 版本一起使用的配置文件的副本 version: `config.yaml` and `ip-detect`.
- 您必须使用 systemd 218 或更新版本才能维持任务状态。
- 所有主机（管理和代理节点）必须能够与所有其他主机通信，如 [网络安全] 所述。(/mesosphere/dcos/cn/2.1/administering-clusters/securing-your-cluster/#network-security).
- 在 CentOS 或 RedHat 中，使用此命令安装 IP 集（在某些 IP 检测脚本中使用）：`sudo yum install -y ipset`
- 您必须熟悉使用 `systemctl` 和 `journalctl` 命令行工具，以查看和监控服务状态。故障排除说明可在本 [文档](#故障排除) 结尾部分找到。
- 您必须熟悉 DC/OS [生产安装][安装] 说明。
- 升级之前抓取 [ZooKeeper 的快照](/mesosphere/dcos/cn/2.1/installing/installation-faq/#q-how-do-i-backup-zookeeper-using-guano) Marathon 支持回滚，但不支持降级。
- 升级之前 [对 IAM 数据库进行快照](/mesosphere/dcos/cn/2.1/installing/installation-faq/#q-how-do-i-backup-the-iam-database-enterprise)。**这很容易做到，应该被视为必要的。**
- 确保在开始升级之前， Marathon 事件订阅者已被禁用。完成升级后，保持其禁用状态，因为此功能现已被弃用。

<p class="message--note"><strong>注意：</strong>Marathon 事件订阅者默认为禁用。勾选查看是否已将行 <code>  -  event_subscriber“http_callback”</code> 添加到管理节点上的 <code> sudo vi /opt/mesosphere/bin/marathon.sh</code> 这种情况下，必须移除该行，以禁用事件订阅者。</p>

[enterprise type="inline" size="small" /]

- 确认在在开始升级前，所有 Marathon 应用程序限制都有效。使用 [此脚本](https://github.com/mesosphere/public-support-tools/blob/master/check-constraints.py) 检查限制是否有效。
- [备份您的群集](/mesosphere/dcos/cn/2.1/administering-clusters/backup-and-restore/).[enterprise type="inline" size="small" /]
- 可选：您可以将自定义 [节点和群集健康检查](/mesosphere/dcos/cn/2.1/installing/production/deploying-dcos/node-cluster-health-check/) 添加到 `config.yaml`.
- 确认所有管理节点都处于运行良好状态：
   - 检查 Exhibitor UI 以确认所有管理节点已成功加入 quorum（状态指示灯将显示绿色）。Exhibitor UI 可在  获取。`http://<dcos_master>:8181/`.
   - 验证每个管理节点中 `curl http://<dcos_master_private_ip>:5050/metrics/snapshot` 的度量标准 `registrar/log/recovered` 的值为 `1`


## bootstrap 节点


此过程将 DC/OS 2.0 群集升级到 DC/OS 2.1。

1. 将现有 `config.yaml` 和 `ip-detect` 文件复制到 bootstrap 节点上的空 `genconf` 文件夹。文件夹与安装工具应当在同一个目录。
2. `config.yaml` 文件的语法可能与早期版本不同。有关当前 `config.yaml` 语法和参数的详细说明，请参阅 [文档](/mesosphere/dcos/cn/2.1/installing/production/advanced-configuration/configuration-reference/).
    * 在升级期间，您无法更改 `exhibitor_storage_backend` 设置。

3. 更新 `config.yaml` 后，比较旧的 `config.yaml` 和新的 `config.yaml`。验证路径或配置没有差异。升级时更改这些会导致灾难性群集失效。
4. 如有必要，修改 `ip-detect` 文件。
5. 构建安装工具包。

    1. 下载 `dcos_generate_config.ee.sh` [enterprise type="inline" size="small" /] 或  覆盖。`dcos_generate_config.sh`[oss type="inline" size="small" /] 文件。
    2. 生成安装文件。将以下命令中的 `<installed_cluster_version>` 替换为当前在要升级的群集上运行的 DC/OS 版本，例如 `2.0.4`.

        [enterprise type="inline" size="small" /]
        ```bash
        dcos_generate_config.ee.sh --generate-node-upgrade-script <installed_cluster_version>
        ```
        [oss type="inline" size="small" /]
        ```bash
        dcos_generate_config.sh --generate-node-upgrade-script <installed_cluster_version>
        ```
    3. 上一步骤的命令将在其输出的最后一行产生 URL，前缀为 `Node upgrade script URL:`. 记下此 URL 以供后续使用。它在本文档中被称为“节点升级脚本 URL”。

6. 使用 Docker [运行] [cmd] 命令运行 nginx 容器以提供 [安装文件] [安装]。对于 `<your-port>`，指定节点升级脚本 URL 中使用的端口值。
```bash
sudo docker run -d -p <your-port>:80 -v $PWD/genconf/serve:/usr/share/nginx/html:ro nginx
```

7. 转到 DC/OS 管理节点 [程序](#masters) 以完成安装。



## <a name="masters"></a>DC/OS 管理节点

通过以下步骤，继续以任何顺序升级每个管理节点，每次升级一个。完成每次升级时，监控 Mesos 管理节点度量标准，确保节点已重新加入群集并完成了协调。

1. 下载并运行节点升级脚本：
    ```bash
    curl -O <Node upgrade script URL>
    sudo bash dcos_node_upgrade.sh
    ```

1. 验证升级脚本是否成功并以状态代码  退出。`0`:
    ```bash
    echo $?
    0
    ```

1. 通过在管理节点上运行以下命令来验证升级：

    1. 监视 Exhibitor 并等待其聚合。

        在带有静态管理节点列表的 DC/OS Enterprise 群集上，使用以下命令：
        ```bash
        sudo curl --cacert /var/lib/dcos/exhibitor-tls-artifacts/root-cert.pem --cert /var/lib/dcos/exhibitor-tls-artifacts/client-cert.pem --key /var/lib/dcos/exhibitor-tls-artifacts/client-key.pem https://localhost:8181/exhibitor/v1/cluster/status
        ```

        在其他群集上，使用以下命令：
        ```bash
        curl http://localhost:8181/exhibitor/v1/cluster/status
        ```

        等待，直到响应显示所有主机都有 `"description":"serving"`。
    1. 等到 `dcos-mesos-master` 单元启动并运行。
    1. 验证 `curl http://localhost:5050/metrics/snapshot` 的度量标准 `registrar/log/recovered` 的值为 `1`.

        <p class="message--note"><strong>注意：</strong>如果要从宽容模式升级到严格模式，此 URL 将为 <code>curl https://...</code>，并且需要有 JWT 才能访问。</p>
        [enterprise type="inline" size="small" /]

1. 验证 `/opt/mesosphere/bin/mesos-master --version` 表示升级后的管理节点正在运行 [发行说明](/mesosphere/dcos/cn/2.1/release-notes/) 中指定的 Mesos 版本，例如 `1.9.1`.

    1. 验证 CockroachDB 中副本不足范围的数量是否已随着 IAM 数据库被复制到新管理节点而降至零。运行以下命令并确认 `ranges_underreplicated` 列仅显示零。
    ```bash
    sudo /opt/mesosphere/bin/cockroach node status --ranges --certs-dir=/run/dcos/pki/bouncer --host=$(/opt/mesosphere/bin/detect_ip)
    ```
    ```
    +----+---------------------+--------+---------------------+---------------------+------------------+-----------------------+--------+--------------------+------------------------+
    | id |       address       | build  |     updated_at      |     started_at      | replicas_leaders | replicas_leaseholders | ranges | ranges_unavailable | ranges_underreplicated |
    +----+---------------------+--------+---------------------+---------------------+------------------+-----------------------+--------+--------------------+------------------------+
    |  1 | 172.31.7.32:26257   | v1.1.4 | 2018-03-08 13:56:10 | 2018-02-28 20:11:00 |              195 |                   194 |    195 |                  0 |                      0 |
    |  2 | 172.31.10.48:26257  | v1.1.4 | 2018-03-08 13:56:05 | 2018-03-05 13:33:45 |              200 |                   199 |    200 |                  0 |                      0 |
    |  3 | 172.31.23.132:26257 | v1.1.4 | 2018-03-08 13:56:01 | 2018-02-28 20:18:41 |              187 |                   187 |    187 |                  0 |                      0 |
    +----+---------------------+--------+---------------------+---------------------+------------------+-----------------------+--------+--------------------+------------------------+
    ```

    如果 `ranges_underreplicated` 列列出了任何非零值，则等待一分钟，然后重新运行此命令。在所有数据被安全地复制后，数值将聚合为零。

1. 转到 DC/OS 代理节点 [程序](#agents) 以完成安装。

## <a name="agents"></a>DC/OS 代理

请注意，当升级代理节点时，在代理节点和任务到期之前，代理节点响应来自 Mesos 管理节点的运行状况检查 ping 有五分钟的超时。

在所有 DC/OS 代理节点上：

1. 导航至 `/opt/mesosphere/lib` 目录并删除此库文件。删除此文件可防止发生冲突。
    ```bash
      libltdl.so.7
    ```

1. 下载并运行节点升级脚本。
    ```bash
    curl -O <Node upgrade script URL>
    sudo bash dcos_node_upgrade.sh
    ```

1. 验证升级脚本是否成功并以状态代码  退出。`0`.
    ```bash
    echo $?
    0
    ```

1. 验证升级情况。

    - 验证 `curl http://<dcos_agent_private_ip>:5051/metrics/snapshot` 的度量标准 `slave/registered` 的值为 `1`.
    - 监控 Mesos UI 以验证升级的节点是否重新加入 DC/OS 群集以及任务是否已协调 (`http://<master-ip>/mesos`).
     如果要从宽容模式升级到严格模式，此 URL 将为 `https://<master-ip>/mesos`.

## <a name="troubleshooting"></a>故障排除建议

以下命令应提供对升级问题的洞见：

### 在所有群集节点上

```bash
sudo journalctl -u dcos-download
sudo journalctl -u dcos-spartan
sudo systemctl | grep dcos
```

如果您的升级因为 [自定义节点或群集检查](/mesosphere/dcos/cn/2.1/installing/production/deploying-dcos/node-cluster-health-check/) 而失败，运行以下命令可了解更多详细信息：
```bash
dcos-check-runner check node-poststart
dcos-check-runner check cluster
```

### 在 DC/OS 管理节点上

[enterprise type="inline" size="small" /]
```bash
sudo journalctl -u dcos-exhibitor
less /opt/mesosphere/active/exhibitor/usr/zookeeper/zookeeper.out
sudo journalctl -u dcos-mesos-dns
sudo journalctl -u dcos-mesos-master
```

[oss type="inline" size="small" /]
```bash
sudo journalctl -u dcos-exhibitor
less /var/lib/dcos/exhibitor/zookeeper/zookeeper.out
sudo journalctl -u dcos-mesos-dns
sudo journalctl -u dcos-mesos-master
```

### 在 DC/OS 代理节点上

```bash
sudo journalctl -u dcos-mesos-slave
```

## 注意：

- DC/OS 2.1 {{ model.packageRepo }} 中可用的包比旧版本 {{ model.packageRepo }} 中的要新。服务在安装 DC/OS 时不会自动升级，因为并非所有 DC/OS 服务都具有保持现有状态的升级路径。

[install]: /mesosphere/dcos/2.1/installing/production/deploying-dcos/installation/#custom-build-file
[cmd]: /mesosphere/dcos/2.1/installing/production/deploying-dcos/installation/#nginx-cmd
