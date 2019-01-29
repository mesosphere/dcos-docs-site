---
layout: layout.pug
navigationTitle: DC/OS 覆盖网络
title: DC/OS 覆盖网络
menuWeight: 10
excerpt: 了解 DC/OS 覆盖网络
enterprise: false
---


DC/OS 覆盖网络 (Overlay) 是一种 SDN 解决方案，适用于到货时预封装有 DC/OS 的 UCR 和 Docker 容器，默认情况下处于启用状态。DC/OS 覆盖网络可以运行给定 DC/OS 集群中的多个虚拟网络实例。从 DC/OS 1.11 开始，DC/OS 覆盖网络就支持创建 IPv6 网络。

<p class="message--note"><strong>注意: </strong> IPv6 支持仅适用于 Docker 容器。</p>

DC/OS 覆盖网络提供的功能包括：
* Mesos 和 Docker 容器均可从单个节点的内部以及在集群上的节点之间通信。
* 可以创建服务，使其流量与来自集群中任何其他虚拟网络或主机的其他流量隔离。
* 无需担心可能与应用程序中的端口重合，无需使用服务用的非标准端口来避免重合。
* 可以生成一类任务任意数量的实例，并让它们全部侦听同一端口，使得客户端不必进行端口发现。
* 可以运行需要集群间连通的应用程序，如 Cassandra、HDFS 和 Riak。
* 可以创建多个虚拟网络来隔离您组织的不同部分，如开发、营销和生产。

有关 DC/OS 覆盖网络的设计和实现的详细信息，请参阅 [覆盖简介](/cn/1.11/overview/design/overlay/)。DC/OS 覆盖网络的默认配置提供 IPv4 虚拟网络、`dcos`，以及 YAML 配置如下的 IPv6 虚拟网络 `dcos6`：

```yaml
 dcos_overlay_network :
   vtep_subnet: 44.128.0.0/20
   vtep_subnet6: fd01:a::/64
   vtep_mac_oui: 70:B3:D5:00:00:00
   overlays:
     - name: dcos
       subnet: 9.0.0.0/8
       prefix: 24
     - name: dcos6
       subnet6: fd01:b::/64
       prefix6: 80
```

每个虚拟网络通过一个规范的 `name` 识别（有关虚拟网络命名的限制，请参阅 [限制](#limitations)）。在虚拟网络上启动的容器从分配给虚拟网络的子网获取 IP 地址。要移除对全局 IPAM 的依赖关系，覆盖子网进一步分成更小的子网。每个更小的子网都会分配给代理。然后，代理可以使用主机本地 IPAM 将 IP 地址从它们各自相应的子网分配给在代理上启动的容器，并附加到给定的覆盖网络。`prefix` 确定分配给每个代理的子网（从覆盖子网创造出来）的大小，进而定义覆盖网络可运行的代理的数量。例如，在高于虚拟网络的默认配置中，`dcos` 分配有 /8 子网（在“子网”字段），它然后被分为每个将作为网络一部分的主机上使用的 /26 容器子网（在“前缀”字段中），如下所示：

![虚拟网络地址空间](/cn/1.11/img/overlay-network-address-space.png)

图 1. 虚拟网络地址空间

保留用于 ContainerID（此例中为 6 ）的位元然后被分为两个相等的组（此例中为 5 个位元），分别用于 Mesos 容器和 Docker 容器。使用默认配置时，每个代理将能够承载最多 2^5=32 个 Mesos 容器和 32 个 Docker 容器。使用此特定配置时，如果服务尝试在 Mesos containerizer或 Docker containerizer上启动超过 32 个任务，它将会收到 `TASK_FAILED`。请参阅虚拟网络主要页面的 [限制](#limitations) 部分，了解有关此限制的更多信息。

虽然上述示例是专门针对 IPv4 虚拟网络的，但同样的逻辑也可用于 IPv6 虚拟网络 `dcos6`。唯一的区别在于，目前Ipv6仅被 Docker 容器支持。

<p class="message--note"><strong>注意: </strong> 尝试启动 <strong><tt>dcos6</tt></strong> 上的 UCR 容器会导致容器启动失败。</p>

您可以修改默认虚拟网络配置，并可根据需要添加更多虚拟网络。目前，您只能在安装时添加或删除虚拟网络。

# 在安装时添加虚拟网络

DC/OS 虚拟网络只能在安装时进行添加和配置。要替换或添加另一个虚拟网络，[请根据这些说明重新安装 DC/OS](#replace)。

通过修改 `config.yaml` 文件，可以覆盖默认的网络，或者可以对其他虚拟网络进行设置：

```yaml
    agent_list:
    - 10.10.0.117
    - 10.10.0.116
    # Use this bootstrap_url value unless the DC/OS installer assets have been moved.
    bootstrap_url: file:///opt/dcos_install_tmp
    cluster_name: &lt;cluster-name&gt;
    master_discovery: static
    master_list:
    - 10.10.0.120
    - 10.10.0.119
    - 10.10.0.118
    resolvers:
    - 8.8.4.4
    - 8.8.8.8
    ssh_port: 22
    ssh_user: centos
    dcos_overlay_network:
      vtep_subnet: 44.128.0.0/20
      vtep_mac_oui: 70:B3:D5:00:00:00
      overlays:
        - name: dcos
          subnet: 9.0.0.0/8
          prefix: 26
        - name: dcos-1
          subnet: 192.168.0.0/16
          prefix: 24
```

上例中，定义了两个虚拟网络。虚拟网络 `dcos` 保留默认虚拟网络，并添加了另一个名为 `dcos-1` 的虚拟网络，其子网范围为 `192.168.0.0/16`。在 DC/OS 覆盖网络中，虚拟网络必须与一个名称和子网关联。该名称用于使用此特定虚拟网络来启动 Marathon 任务和其他 Mesos 框架任务（请参阅 [使用](/cn/1.11/networking/SDN/usage/)）。由于 Linux 设备名称的大小限制，虚拟网络名称必须少于 13 个字符。请参阅虚拟网络主要页面的 [限制](#limitations) 部分，了解更多信息。

# 检索虚拟网络状态

DC/OS 安装完成后，可从 `https://leader.mesos:5050/overlay-master/state` 端点获得虚拟网络配置。以下片断的 `network` 部分列出了当前覆盖配置，`agents` 部分列出了覆盖是如何跨 Mesos 代理节点分配的。以下内容显示了当名为 `dcos` 的集群中存在单个覆盖时的网络状态。

```json

  "agents": [
    {
      "ip": "172.17.0.2",
      "overlays": [
        {
          "backend": {
            "vxlan": {
              "vni": 1024,
              "vtep_ip": "44.128.0.1/20",
              "vtep_ip6": "fd01:a::1/64",
              "vtep_mac": "70:b3:d5:80:00:01",
              "vtep_name": "vtep1024"
            }
          },
          "info": {
            "name": "dcos",
            "prefix": 24,
            "subnet": "9.0.0.0/8"
          },
          "state": {
            "status": "STATUS_OK"
          },
          "subnet": "9.0.0.0/24"
        },
        {
          "backend": {
            "vxlan": {
              "vni": 1024,
              "vtep_ip": "44.128.0.1/20",
              "vtep_ip6": "fd01:a::1/64",
              "vtep_mac": "70:b3:d5:80:00:01",
              "vtep_name": "vtep1024"
            }
          },
          "info": {
            "name": "dcos6",
            "prefix6": 80,
            "subnet6": "fd01:b::/64"
          },
          "state": {
            "status": "STATUS_OK"
          },
          "subnet6": "fd01:b::/80"
        }
      ]
    },
    {
      "ip": "172.17.0.4",
      "overlays": [
        {
          "backend": {
            "vxlan": {
              "vni": 1024,
              "vtep_ip": "44.128.0.2/20",
              "vtep_ip6": "fd01:a::2/64",
              "vtep_mac": "70:b3:d5:80:00:02",
              "vtep_name": "vtep1024"
            }
          },
          "docker_bridge": {
            "ip": "9.0.1.128/25",
            "name": "d-dcos"
          },
          "info": {
            "name": "dcos",
            "prefix": 24,
            "subnet": "9.0.0.0/8"
          },
          "mesos_bridge": {
            "ip": "9.0.1.0/25",
            "name": "m-dcos"
          },
          "state": {
            "status": "STATUS_OK"
          },
          "subnet": "9.0.1.0/24"
        },
        {
          "backend": {
            "vxlan": {
              "vni": 1024,
              "vtep_ip": "44.128.0.2/20",
              "vtep_ip6": "fd01:a::2/64",
              "vtep_mac": "70:b3:d5:80:00:02",
              "vtep_name": "vtep1024"
            }
          },
          "docker_bridge": {
            "ip6": "fd01:b::1:8000:0:0/81",
            "name": "d-dcos6"
          },
          "info": {
            "name": "dcos6",
            "prefix6": 80,
            "subnet6": "fd01:b::/64"
          },
          "mesos_bridge": {
            "ip6": "fd01:b:0:0:1::/81",
            "name": "m-dcos6"
          },
          "state": {
            "status": "STATUS_OK"
          },
          "subnet6": "fd01:b:0:0:1::/80"
        }
      ]
    },
    {
      "ip": "172.17.0.3",
      "overlays": [
        {
          "backend": {
            "vxlan": {
              "vni": 1024,
              "vtep_ip": "44.128.0.3/20",
              "vtep_ip6": "fd01:a::3/64",
              "vtep_mac": "70:b3:d5:80:00:03",
              "vtep_name": "vtep1024"
            }
          },
          "docker_bridge": {
            "ip": "9.0.2.128/25",
            "name": "d-dcos"
          },
          "info": {
            "name": "dcos",
            "prefix": 24,
            "subnet": "9.0.0.0/8"
          },
          "mesos_bridge": {
            "ip": "9.0.2.0/25",
            "name": "m-dcos"
          },
          "state": {
            "status": "STATUS_OK"
          },
          "subnet": "9.0.2.0/24"
        },
        {
          "backend": {
            "vxlan": {
              "vni": 1024,
              "vtep_ip": "44.128.0.3/20",
              "vtep_ip6": "fd01:a::3/64",
              "vtep_mac": "70:b3:d5:80:00:03",
              "vtep_name": "vtep1024"
            }
          },
          "docker_bridge": {
            "ip6": "fd01:b::2:8000:0:0/81",
            "name": "d-dcos6"
          },
          "info": {
            "name": "dcos6",
            "prefix6": 80,
            "subnet6": "fd01:b::/64"
          },
          "mesos_bridge": {
            "ip6": "fd01:b:0:0:2::/81",
            "name": "m-dcos6"
          },
          "state": {
            "status": "STATUS_OK"
          },
          "subnet6": "fd01:b:0:0:2::/80"
        }
      ]
    }
  ],
  "network": {
    "overlays": [
      {
        "name": "dcos",
        "prefix": 24,
        "subnet": "9.0.0.0/8"
      },
      {
        "name": "dcos6",
        "prefix6": 80,
        "subnet6": "fd01:b::/64"
      }
    ],
    "vtep_mac_oui": "70:B3:D5:00:00:00",
    "vtep_subnet": "44.128.0.0/20",
    "vtep_subnet6": "fd01:a::/64"
  }
}
```

# 删除虚拟网络

要删除一个虚拟网络，请先卸载 DC/OS，然后删除管理节点上的覆盖复制日志以及代理节点上与虚拟网络关联的 iptable 规则。

## 覆盖复制日志

DC/OS 覆盖网络使用复制日志跨 Mesos 管理节点重启以保留虚拟网络状态，并在选择新的 Mesos 管理节点时恢复覆盖状态。覆盖复制日志的存储位置为 `/var/lib/dcos/mesos/master/overlay_replicated_log`。当从集群卸载 DC/OS 时，**不会**移除覆盖复制日志，因此您需要在重新安装 DC/OS 之前手动删除此日志。否则，Mesos 管理节点会尝试在启动期间对现有覆盖日志进行核对，如果发现未配置的虚拟网络，管理节点将失败。

<p class="message--note"><strong>注意: </strong> 覆盖复制日志不同于 <a href="http://mesos.apache.org/documentation/latest/replicated-log-internals/">管理节点的复制日志</a>，其存储位置为 <tt>/var/lib/mesos/master/replicated_log</tt>。移除覆盖复制日志对管理节点的恢复语义没有影响。</p>

## iptables
虚拟网络安装 IPMASQ 规则，让容器可以在虚拟网络之外进行通信。删除或替换虚拟网络时，必须移除与之前虚拟网络关联的规则。要移除与每个覆盖关联的 IPMASQ 规则，请从对应于虚拟网络子网的 POSTROUTING 更改的 NAT 表中移除 IPMASQ 规则。移除每个代理节点上的这些规则。

<a name="replace"></a>

# 替换或添加新的虚拟网络

要替换虚拟网络，请先卸载 DC/OS，然后删除管理节点上的覆盖复制日志以及代理节点的 iptable 规则。然后，通过在 `config.yaml` 文件中指定的所需网络重新安装。

# 故障排除

DC/OS Web 界面的**网络**选项卡提供了有助于排除故障的信息。它包含关于 DOS 覆盖网络中与容器关联的虚拟网络以及该虚拟网络上容器 IP 地址的信息。

<p class="message--note"><strong>注意: </strong>The network tab currently displays information about containers that are associated with virtual networks managed by DC/OS Overlay. It does not have information about containers running on virtual networks managed by any other CNI/CNM provider`.</p>

<a name="limitations"></a>
### 限制
* 对于 Docker 容器，DC/OS 覆盖仅支持 IPv6 网络。在 IPv6 网络上启动 UCR 容器会导致容器启动失败。但为了使其能在未来运行正常，在把子网分配给一个代理时，IPv6 子网会按照用于 IPv4 网络的相同逻辑预先分配给 MesosContainerizer 和 DockerContainerizer。

* DC/OS 覆盖网络不允许服务预留 IP 地址，这会造成为虚拟网络上多个化身之间的容器产生临时地址。此限制确保给定客户端连接到正确的服务。

DC/OS 在不同的 [区域](/cn/1.11/networking/DNS/) 提供 FQDN，提供通过可预测的 URL 访问服务的简洁方式。如果使用 DC/OS 覆盖网络，您应使用 DC/OS DNS 服务提供的 FQDN 之一，以便客户端能够轻松发现服务的位置。

* DC/OS 覆盖网络上的容器总数的限制与覆盖子网上可用 IP 地址的数量相同。但是，代理上的容器数量限制取决于分配给此代理的子网（将是覆盖子网的子集）。对于给定的代理子网，一半的地址空间分配给 `MesosContainerizer`，另一半分配给 `DockerContainerizer`。

* 在 DC/OS 覆盖网络中，虚拟网络的子网将细分成更小的子网，这些更小的子网会分配给各个代理。当代理耗尽为其分配的地址范围且服务尝试在此代理启动虚拟网络容器上的容器时，容器启动将失败，服务将收到 `TASK_FAILED` 消息。

 由于没有 API 报告代理上的地址耗尽，因此由服务决定容器是否因代理上缺少 IP 地址而无法在虚拟网络上启动。此限制对服务的行为有直接影响，例如尝试使用指定数量的实例来启动服务的 Marathon 等。由于此限制，如果 Marathon 等服务尝试在耗尽为其分配的 IP 地址范围的代理上启动某个服务的实例，这些服务可能无法完成在虚拟网络上启动服务的义务。

 在解决使用虚拟网络的框架相关问题时以及当您看到 `TASK_FAILED` 消息时，请牢记此限制。

* DC/OS 覆盖网络使用代理上的 Linux 网桥设备将 Mesos 和 Docker 容器连接到虚拟网络。这些网桥设备的名称来自虚拟网络名称。由于 Linux 系统对网络设备名称有 15 个字符的限制，因此虚拟网络名称的字符限制为 13 个字符（其中 2 个字符用于区分虚拟网络上的 CNI 网桥和 Docker 网桥）。

* 某些名称是预留的，不能用作 DC/OS 覆盖网络的名称。这是因为 DC/OS 覆盖网络使用底层 Docker 网络将 Docker 容器连接到覆盖网络，而这反过来预留某些网络的名称。预留的名称为：`host`、`bridge` 和 `default`。

* [Marathon 运行状况检查](/cn/1.11/deploying-services/creating-services/health-checks/) 会与某些 DC/OS 覆盖网络配置不兼容。如果您不使用默认的 DC/OS 覆盖配置且 Marathon 与虚拟网络隔离，运行状况检查将持续失败，即使服务的运行状况良好。

 以下任何情况时，Marathon 运行状况检查将可以运行：

 * 您在使用默认的 DC/OS 覆盖网络配置时。
 * Marathon 可以访问虚拟网络时。
 * 您使用 [`command` 运行状况检查](/cn/1.11/deploying-services/creating-services/health-checks/) 时。
