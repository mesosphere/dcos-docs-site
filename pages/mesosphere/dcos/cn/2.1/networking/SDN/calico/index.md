---
navigationTitle:  Calico
title: Calico
menuWeight: 10
model: /mesosphere/dcos/2.1/data.yml
excerpt: 了解 DC/OS Calico 集成
---

## 概述

该包提供 DC/OS Calico 组件，以支持 DC/OS 中的 Calico 网络连接容器和网络策略。

## DC/OS Calico 组件

DC/OS Calico 组件通过提供用于 Mesos 通用容器运行时的 Calico CNI 插件和用于 Docker 引擎的 Calico libnetwork 插件，将 [Calico 网络连接](https://www.projectcalico.org) 集成到 DC/OS 中。此外，calico 控制面板还提供为 DC/OS 工作负载配置网络策略的功能。

### DC/OS Calico 服务

DC/OS Calico 将 Calico 集成到 DC/OS 中，用于管理容器网络连接和网络安全，并引入了三种服务：

* `dcos-calico-bird.service`：BGP 客户端，可以在主机之间为 Calico 交换路由信息。 [(来源)](https://github.com/projectcalico/bird)
* `dcos-calico-confd.service`：confd 模板引擎可以动态监控 etcd 数据存储，并动态地生成和重新加载 bird 配置。[(来源)](https://github.com/projectcalico/node)
* `dcos-calico-felix.service`：Calico 网络连接的控制面板，用于为容器计划路由和 ACL。 [(来源)](https://github.com/projectcalico/node)
* `dcos-calico-libntwork-plugin.service`：Docker 的网络插件，为 Docker 引擎提供 Calico 网络连接。[(来源)](https://github.com/projectcalico/libnetwork-plugin)

### DC/OS Calico CLI

DC/OS 命令行包括允许从群集外部运行 `calicoctl` 命令的 `calico` 插件。要运行任何 `calicoctl` 命令，则应将其作为 `dcos calico` 运行，如 `dcos calico get nodes`：

```sh
dcos calico get nodes
NAME
172.16.0.23
172.16.2.241
172.16.21.4
172.16.9.234

```

## DC/OS 配置参考（网络连接）

| 参数                              | 描述                                                                                                                                               |
|-----------|-------------|
| calico_network_cidr | 分配给 calico 的子网。由 `calico_network_cidr` 指定的子网不得与为 VXLAN 后端定义的子网或为 [DC/OS 虚拟网络](/mesosphere/dcos/cn/2.1/installing/production/advanced-configuration/configuration-reference/#dcos-overlay-enable) 定义的虚拟网络重叠。[ 默认：172.29.0.0/16 ] |
| calico_vxlan_enabled | 不管是 IP-in-IP 还是 VXLAN 模式被用于 calico，建议使用 Control，而不是默认的 VXLAN。对于不支持 IP in IP 的环境（例如，Azure），`calico_vxlan_enabled` 应该设置为“true”。[默认：“ture”] |
| calico_ipinip_mtu | 在 Calico IPIP 隧道设备上设置的 MTU。当 calico_vxlan_enabled 设置为 false 时，此配置会起作用。请参阅 [calico 文档](https://docs.projectcalico.org/networking/mtu)，以了解合适的 MTU 配置。[默认：1480] |
| calico_vxlan_port | 用于 calico VXLAN 的 UDP 端口。当 calico_vxlan_enabled 设置为 true 时，此配置会起作用。[默认：4789] |
| calico_vxlan_vni | 用于 calico VXLAN 的虚拟网络 ID。当 calico_vxlan_enabled 设置为 true 时，此配置会起作用。[默认：4096] |
| calico_vxlan_mtu | 在 Calico VXLAN 隧道设备上设置的 MTU。当 calico_vxlan_enabled 设置为 true 时，此配置会起作用。请参阅 [calico 文档](https://docs.projectcalico.org/networking/mtu)，以了解合适的 MTU 配置 [默认：1450] |
| calico_veth_mtu | 在 veth pair 设备上设置的 MTU，例如，容器接口和主机端接口。请参阅 [calico 文档](https://docs.projectcalico.org/networking/mtu)，以了解合适的 MTU 配置 [默认：1500] |



### Calico 网络连接（通用容器运行时）

要使用 Calico 网络连接容器，您只需要将网络名称指定为 `calico`。

以下 Marathon 应用定义示例将使用 _Mesos UCR engine_ 启动容器，并将其插入 `calico` 网络：

```json
{
  "id": "/calico-ucr",
  "instances": 1,
  "container": {
    "type": "MESOS",
    "volumes": [],
    "docker": {
      "image": "mesosphere/id-server:2.1.0"
    },
    "portMappings": []
  },
  "cpus": 0.1,
  "mem": 128,
  "requirePorts": false,
  "networks": [
    {
      "mode": "container",
      "name": "calico"
    }
  ],
  "healthChecks": [],
  "fetch": [],
  "constraints": []
}
```

### Calico 网络连接（Docker 引擎）

与之前的示例相似，以下 Marathon 应用定义示例将使用 _Docker Engine_ 启动容器，并将其插入 `calico` 网络：

```json
{
  "id": "/calico-docker",
  "instances": 1,
  "container": {
    "type": "DOCKER",
    "volumes": [],
    "docker": {
      "image": "mesosphere/id-server:2.1.0"
    },
    "portMappings": []
  },
  "cpus": 0.1,
  "mem": 128,
  "requirePorts": false,
  "networks": [
    {
      "mode": "container",
      "name": "calico"
    }
  ],
  "healthChecks": [],
  "fetch": [],
  "constraints": []
}
```

## 管理主题

### 网络策略

网络策略提供了根据标签选择器指定的应用于端点的有序规则集来控制网络流量的功能，请参阅 [calico 文档](https://docs.projectcalico.org/reference/resources/networkpolicy)，以了解有关策略规则定义和标签选择器语法的详细说明。

在 DC/OS 中，Calico 网络策略直接向操作人员公开，以便操作人员能够根据不同的情境来管理其流量控制。

DC/OS 中的网络策略限制：

* Calico 网络策略是一个命名空间资源，但现在，我们仅支持 DC/OS 中的 `default` 命名空间，并且所有命名空间 Calico 资源应该在 `default` 命名空间下进行定义。
* Calico 网络策略仅在 Calico 网络连接容器上生效，这意味着，在非 Calico 网络连接容器（例如，`hostnetwork`、`dcos` 和 `bridge`）上设置的标签不会计入 Calico 网络策略。
* 要让网络策略标签生效，则必须将其设置在 Mesos 上的 `NetworkInfo.Labels` 中，对于 Marathon 而言，标签应设置在 `networks.[].labels` 中，例如：

```json
{
  "id": "/client",
  "instances": 1,
   ...
  "networks": [
    {
      "mode": "container",
      "name": "calico",
      "labels": {
        "role": "client"
      }
    }
  ],
  ...
}
```

### 默认配置文件

Calico 配置文件对继承配置文件中所定义的标签的端点进行分组，例如，每个命名空间都有一个相应的配置文件，以将标签授予该命名空间中的 Pod。Calico 配置文件支持流量控制的策略规则，但不建议使用，我们更侧向于灵活的 NetworkPolicy 和 GlobalNetworkPolicy 资源。

就我们而言，`calico` 默认情况下，所有 Calico 网络连接容器都会被分配与 CNI 网络的名称相同的默认配置文件，此配置文件**仅**允许从一个 Calico 容器网络到另一个 Calico 容器网络的请求，这意味着 L4LB 和 L7 代理请求（其中源 IP 地址被转换到 Calico 所生成的隧道接口的地址(NATed)）最后会被丢弃。该配置文件可以在以下 YAML 定义中找到。

```yaml
apiVersion: projectcalico.org/v3
kind: Profile
metadata:
  creationTimestamp: 2019-12-23T04:16:55Z
  name: calico
  resourceVersion: "75"
  uid: 0e105ecb-253b-11ea-9e52-065b6833052c
spec:
  egress:
  - action: Allow
    destination: {}
    source: {}
  ingress:
  - action: Allow
    destination: {}
    source:
      selector: has(calico)
  labelsToApply:
    calico: ""
```

为了解决该问题，Calico 配置文件 `calico` 在默认情况下由 `dcos-calico-felix` 初始化，并允许所有流量进出 Calico 网络连接容器，而且 `calico` 是现在受支持并在所有 Calico 网络连接容器中共享的唯一个配置文件。
有关 Calico 配置文件的更详细描述，请阅读 [Calico 文档](https://docs.projectcalico.org/reference/resources/profile)。

### 网络策略示例

在以下业务隔离示例中，我们有三个应用程序定义，如下所示，bookstore-frontend 和 bookstore-server 都被标记为 `"biz_type": "bookstore"`，而 fruitstore-frontend 被标记为 `"biz_type": "fruitstore"`。在此，我们将创建一个网络策略，以拒绝从 fruitstore-frontend 到 bookstore-server 的请求，而允许从 bookstore-frontend 到 bookstore-server 的请求。

```
+----------------------+      +------------------------+
|                      |      |                        |
|  bookstore-frontend  |      |   fruitstore-frontend  |
|                      |      |                        |
+-----------------+----+      +----+-------------------+
                  |                |
                  |                |
                  |                x
                  |                |
             +----v----------------v--+
             |                        |
             |   bookstore-server     |
             |                        |
             +------------------------+
```

#### 5.3.1. 启动 Marathon 应用程序

bookstore-frontend 的 Marathon 应用程序定义（带有策略标签 `"biz_type": "bookstore"`）：

```json
{
  "id": "/bookstore-frontend",
  "instances": 1,
  "container": {
    "type": "MESOS",
    "volumes": [],
    "docker": {
      "image": "mesosphere/id-server:2.1.0"
    },
    "portMappings": []
  },
  "cpus": 0.1,
  "mem": 128,
  "requirePorts": false,
  "networks": [
    {
      "mode": "container",
      "name": "calico",
      "labels": {
        "biz_type": "bookstore"
      }
    }
  ],
  "healthChecks": [],
  "fetch": [],
  "constraints": []
}
```
bookstore-server 的 Marathon 应用程序定义（带有策略标签 `"biz_type": "bookstore"` 和 `"role": "server"`），在端口 80 上可用：

```json
{
  "id": "/bookstore-server",
  "instances": 1,
  "container": {
    "type": "MESOS",
    "volumes": [],
    "docker": {
      "image": "mesosphere/id-server:2.1.0"
    },
    "portMappings": []
  },
  "cpus": 0.1,
  "mem": 128,
  "requirePorts": false,
  "networks": [
    {
      "mode": "container",
      "name": "calico",
      "labels": {
        "biz_type": "bookstore",
        "role": "server"
      }
    }
  ],
  "healthChecks": [],
  "fetch": [],
  "constraints": []
}
```
fruitstore-frontend 的 Marathon 应用程序定义（带有策略标签 `"biz_type": "fruitstore"`）：

```json
{
  "id": "/fruitstore-frontend",
  "instances": 1,
  "container": {
    "type": "MESOS",
    "volumes": [],
    "docker": {
      "image": "mesosphere/id-server:2.1.0"
    },
    "portMappings": []
  },
  "cpus": 0.1,
  "mem": 128,
  "requirePorts": false,
  "networks": [
    {
      "mode": "container",
      "name": "calico",
      "labels": {
        "biz_type": "fruitstore"
      }
    }
  ],
  "healthChecks": [],
  "fetch": [],
  "constraints": []
}
```

通过执行 `dcos marathon app add ${app_definition_yaml_file}` 来启动以上三个 Marathon 应用程序，然后我们会获得三个运行中的 Marathon 应用程序，如下所示：

```sh
dcos task list
         NAME              HOST      USER     STATE                                         ID                                                    AGENT ID                  REGION  ZONE
  fruitstore-frontend  172.16.2.233  root  TASK_RUNNING  fruitstore-frontend.instance-8a3ed6db-2a47-11ea-91b3-66db602e14f5._app.1  0a1399a2-fe1f-4613-a618-f45159e12f2a-S0  N/A     N/A
  bookstore-server     172.16.29.45  root  TASK_RUNNING  bookstore-server.instance-825bcbda-2a47-11ea-91b3-66db602e14f5._app.1     0a1399a2-fe1f-4613-a618-f45159e12f2a-S1  N/A     N/A
  bookstore-frontend   172.16.2.233  root  TASK_RUNNING  bookstore-frontend.instance-79853919-2a47-11ea-91b3-66db602e14f5._app.1   0a1399a2-fe1f-4613-a618-f45159e12f2a-S0  N/A     N/A
```

#### 前端和服务器连接测试

在应用网络策略之前，从 bookstore-frontend 和 fruitstore-frontend 到 bookstore-server 的请求已成功，我们期待 FQDN `bookstore-server.marathon.containerip.dcos.thisdcos.directory` 返回 bookstore-server 容器 IP 地址：
```sh
dcos task exec fruitstore-frontend wget -qO- bookstore-server.marathon.containerip.dcos.thisdcos.directory:80/id
hubfeu2yculh%

dcos task exec bookstore-frontend wget -qO- bookstore-server.marathon.containerip.dcos.thisdcos.directory:80/id
hubfeu2yculh%
```

#### 应用网络策略

该网络策略在 bookstore-server 上生效，并允许来自标签 `biz_type` 设置为 `bookstore` 应用程序的请求，而拒绝来自标签 `biz_type` 设置为 `fruitstore` 的应用程序的请求：
```yaml
apiVersion: projectcalico.org/v3
kind: NetworkPolicy
metadata:
  name: allow-bookstore-cliient-to-server
spec:
  selector: biz_type == 'bookstore' && role == 'server'
  types:
  - Ingress
  ingress:
  - action: Allow
    protocol: TCP
    source:
      selector:  biz_type == 'bookstore'
    destination:
      ports:
      - 80
  - action: Deny
    protocol: TCP
    source:
      selector: biz_type == 'fruitstore'
    destination:
      ports:
      - 80
```
我们可以临时登录到 DC/OS 节点，并通过执行 `dcos calico apply -f ${network_policy_yaml_file}` 来应用网络策略。

来自 bookstore-frontend 的请求如期成功：
```sh
dcos task exec bookstore-frontend wget -qO- bookstore-server.marathon.containerip.dcos.thisdcos.directory:80/id
hubfeu2yculh%
```

来自 fruitstore-frontend 的请求超时，因为数据包丢失。
```sh
dcos task exec fruitstore-frontend wget -qO- --timeout=5 bookstore-server.marathon.containerip.dcos.thisdcos.directory:80/id
wget: can't connect to remote host (192.168.219.133): Connection timed out
```

### 添加网络配置文件

在大多数用例中，单个 Calico 配置文件已经足够。但是，如果出于任何原因需要创建更多网络，则应注意一些特殊情况。

> ⚠️ 注意：`calico-libnetwork-plugin` （到 Docker 运行时的网络接口）将 IP 池默示链接到与相应 calico docker 网络相关联的 calico 配置文件。

也就是说，要添加网络配置文件，您应该：

1. 创建新的 IP 池。例如：
  ```yaml
  apiVersion: projectcalico.org/v3
  kind: IPPool
  metadata:
    name: <network-name>
  spec:
    cidr: 10.1.0.0/16
    natOutgoing: true
    disabled: false
  ```

  将上述 yaml 保存到 `ip.yml`，然后运行：

  ```sh
  dcos calico create -f ip.yml
  ```

2. 创建新的 Calico 配置文件。例如：
  ```yaml
  apiVersion: projectcalico.org/v3
  kind: Profile
  metadata:
    name: <profile-name>
  spec:
    egress:
    - action: Allow
      destination: {}
      source: {}
    ingress:
    - action: Allow
      destination: {}
      source: {}
    labelsToApply:
      calico: ""
  ```

  将上述 yaml 保存到 `profile.yml`，然后运行：

  ```sh
  dcos calico create -f profile.yml
  ```

3. 在 **每个代理** 上，创建一个新的 docker 网络，并使用新的配置文件。您可以使用以下命令，确保子网与池中的 cidr 匹配：
  ```sh
  docker network create \
      --opt org.projectcalico.profile=<profile-name> \
      --driver calico \
      --ipam-driver calico-ipam \
      --subnet=10.1.0.0/16 \
      <network-name>
  ```

## 将应用程序从 DC/OS 覆盖迁移到 Calico

无法自动迁移 DC/OS 群集中现有的所有服务。可以通过各种 Apache Mesos 框架启动服务，包括经生产验证的平台 [Marathon](https://mesosphere.github.io/marathon/)、构建于 [dcos-common](https://github.com/mesosphere/dcos-commons. This includes existing, stateful services such as [Cassandra](https://docs.d2iq.com/mesosphere/dcos/services/cassandra) 和 [Spark](https://docs.d2iq.com/mesosphere/dcos/services/spark) 之上的服务以及从您的环境中托管的服务。

### Marathon 应用程序（aka DC/OS 服务）

至少有两种方法让 Marathon 应用程序的变更生效：

- DC/OS CLI
更新应用程序定义，以将网络名称从 `dcos` 变更为 `calico`。
`dcos app update calico_network_app.json`

对于此方法，相应的文件 `calico_network_app.json` 包含不同于 DC/OS 网络应用程序的 Calico 网络应用程序的定义，如下所示：
```json
  {
   "networks": [
     {
       "mode": "container",
-      "name": "dcos"
+      "name": "calico"
     }
   ]
  }
```

- DC/OS GUI

导航至服务的“网络连接”选项卡，并将网络类型从 `Virtual Network: dcos` 变更为 `Virtual Network: calico`。

### 构建于 dcos-common 之上的 DC/OS 服务

通常，DC/OS 服务中有两个组件：
- 调度器 - 执行一个计划以启动 Pod 的 Marathon 应用程序
- Pod - 履行服务职责的工人应用程序。

由于调度器和 Pod 被定义为发布包，并且为了在调度器和 Pod 使用虚拟网络的情况下进行永久性更改，我们必须在执行以下更改后生成新版本的 DC/OS 服务：

- 对于调度器
调度器的 Marathon 应用程序定义在包定义中被定义为模板 marathon.json.mustache，并由操作人员根据 `config.json` 中定义的变量来填写。启用虚拟网络时，操作员应确保 `VIRTUAL_NETWORK_NAME` 为 `calico`。

- 对于 Pod
`dcos-common` 允许 Pod 加入虚拟网络，并且默认情况下可使用 `dcos` 虚拟网络。将应用程序从 `dcos` 迁移至 `calico`，需要进行如下更改：

```yaml
pods:
  pod-on-virtual-network:
    count: {{COUNT}}
    networks:
-     dcos:
+     calico:
    tasks:
      ...
  pod-on-host:
    count: {{COUNT}}
    tasks:
      ...
```

## 故障排除

诊断信息（包括 Calico 资源、组件日志和 BGP peer 状态）被收集在 DC/OS 节点诊断捆绑包中，要调试 Calico 网络连接问题，请执行 `dcos node diagnostic create` 以创建诊断捆绑包，然后通过执行 `dcos node diagnostic download <diagnostic-bundle-name>` 下载诊断捆绑包。
