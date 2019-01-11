---
layout: layout.pug
navigationTitle: 高级安装
title: 高级安装
menuWeight: 20
excerpt: 高级安装选项
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes -->


默认的 DC/OS Kubernetes 包安装为尝试服务提供合理的默认设置。
此页面描述了许多选项，可以启用选择性功能或允许您更改
分配给 Kubernetes 集群的资源。

## 先决条件

为了使用默认参数运行框架，您的集群至少必须有一个专用代理以及运行下表所述任务所需的可用资源：

| | 每个集群的实例 | 每个 CPU 的实例 | 每个实例的 Mem (MB) | 每个实例的磁盘空间 (MB) |
| ----------------------- | --------------------- | ---------------- | --------------------- | --------------------------- |
| Package scheduler       | 1                     | 1                | 1024                  | -                           |
| etcd                    | 1                     | 0.5              | 1024                  | 3072 for data, 512 for logs |
| kube-apiserver          | 1                     | 0.5              | 1024                  | -                           |
| kube-scheduler          | 1                     | 0.5              | 512                   | -                           |
| kube-controller-manager | 1                     | 0.5              | 512                   | -                           |
| kube-proxy              | 1                     | 0.1              | 512                   | -                           |
| kubelet                 | 1                     | 3                | 3072                  | 10240                       |



如果需要高可用性，则必须启用`kubernetes.high_availability`包选项，且建议至少使用三个私有代理。在高可用性模式运行任务需以下资源：

| | 每个集群的实例 | 每个 CPU 的实例 | 每个实例的 Mem (MB) | 每个实例的磁盘空间 (MB) |
| ----------------------- | --------------------- | ---------------- | --------------------- | --------------------------- |
| 包调度器 | 1 | 1 | 1024 | - |
| etcd | 3 | 0.5 | 1024 | 3072 用于数据，512 用于日志 |
| kube-apiserver | 3 | 0.5 | 1024 | - |
| kube-scheduler | 3 | 0.5 | 512 | - |
| kube-controller-manager | 3 | 0.5 | 512 | - |
| kube-proxy | 1 | 0.1 | 512 | - |
| kubelet | 1 | 3 | 3072 | 10240 |


## 更改 Kubernetes 节点资源规格

如上表所示，默认是 3 个 CPU、3GB RAM 和 10GB 磁盘。但是，`kubelet` 和容器运行时将保留 1 个 CPU 和 1GB RAM。这意味着每个 Kubernetes 节点都有 2 个 CPU、2GB RAM 和 10GB 磁盘，可分配给 Kubernetes pod。

有关详细信息，请阅读 [Kubernetes node-allocatable 的官方文档](https://kubernetes.io/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable)。

DC/OS Kubernetes 允许您单独指定公用节点和专用节点的资源。

例如，我们要请求两个带 1 个 CPU、1 GB RAM 和 512 MB 磁盘的专用 Kubernetes 节点以及一个带 1 个 CPU、1GB RAM 和 512MB 磁盘的公用 Kubernetes 节点 。

<p class="message--note"><strong>注意：</strong> 这需要至少两个 DC/OS 专用代理和一个 DC/OS 公用代理，每个代理至少带有2 个 RAM、2 GB RAM 和 512 MB 磁盘，不分配给任何其他任务。额外资源由 Kubernetes 系统守护程序（如 `kubelet` 和容器运行时）进行使用。</p>

创建 JSON 选项文件，或编辑现有的文件：

```json
{
  "kubernetes": {
    "node_count": 2,
    "reserved_resources": {
      "kube_cpus": 1,
      "kube_mem": 1024,
      "kube_disk": 512
    },
    "public_node_count": 1,
    "public_reserved_resources": {
      "kube_cpus": 1,
      "kube_mem": 1024,
      "kube_disk": 512
    },  
  }
}
```

假设您将文件保存为 `options.json`，按如下方式安装包：

```shell
dcos package install kubernetes --options=options.json
```

## 更改 Kubernetes 节点数量

DC/OS Kubernetes 允许您指定集群中的专用和公用 Kubernetes 节点数量。

### 专用节点

默认的专用节点计数为 1。要更改此值，请在 JSON 选项文件中指定 `kubernetes.node_count`，如下所示。

例如，我们要请求 10 个专用 Kubernetes 节点。

<p class="message--note"><strong>注意：</strong> 这需要至少 10 个 DC/OS 代理，每个代理有 3 个 CPU、3 GB RAM 和 10 GB 磁盘空间。</p>

创建 JSON 选项文件，或编辑现有的文件：

```json
{
  "kubernetes": {
    "node_count": 10
  }
}
```

假设您将文件保存为 `options.json`，按如下方式安装包：

```shell
dcos package install kubernetes --options=options.json
```

### 公用节点

默认的公用节点计数为 0。要更改此值，请在 JSON 选项文件中指定 `kubernetes.public_node_count`，如下所示。

例如，我们要在之前前 10 个专用 Kubernetes 节点的基础上请求 2 个额外的 Kubernetes 节点。

<p class="message--note"><strong>注意：</strong> 默认资源设置与专用节点定义的设置相同。
因此，这需要至少两个公用 DC/OS 代理和 10 个专用代理，每个代理有 3 个 CPU、3GB RAM 和 10GB 磁盘空间。</p>

按如下方式编辑现有选项文件：

```json
{
  "kubernetes": {
    "node_count": 10,
    "public_node_count": 2
  }
}
```

## 布局约束

布局约束允许您自定义 DC/OS 集群中部署服务的位置。布局约束使用 [Marathon 运营商](http://mesosphere.github.io/marathon/docs/constraints.html) 语法。例如，`[["hostname", "UNIQUE"]]` 确保每个代理最多部署一个 Pod。

通用任务是指定要对其进行部署的白名单系统列表。为此，请使用以下语法用于布局约束：

`[["hostname", "LIKE", "10.0.0.159|10.0.1.202|10.0.3.3"]]`

<p class="message--note"><strong>注意：</strong>请务必在这种情境中包括超额容量，以便如果白名单系统中的一个系统性能下降，还有足够的容量修复您的服务。</p>

选项示例：

```json
{
  "kubernetes": {
    "control_plane_placement": "[[\"disk\",\"IS\",\"fast-ssd\"]]",
    "node_placement": "[\"hostname\",\"UNIQUE\"]",
    "public_node_placement": "[\"hostname\",\"UNIQUE\"]"
  }
}
```

<p class="message--note"><strong>注意：</strong>强制执行代理级别的任务反关联性，意味着没有相同类型的任务，例如， `kube-node-kube-proxy` 将在一个有其他 `kube-node-kube-proxy` 正在运行的代理上运行。</p>

### 更新布局约束

集群更改，那么您的布局约束也会更改。但是，已经运行的 pod 将不会受到布局约束变化的影响。这是因为更改布局约束可能使正在运行的 pod 的当前布局失效，而且 pod 不会被自动迁移，因为这种操作具有破坏性。我们建议使用以下程序更新 Pod 的布局约束：

- 更新服务中的布局约束定义。
- 针对每个受影响的 pod，一次执行一个 pod 替换。这将（破坏性地）移动 Pod 使其符合新的布局约束。


## TLS

该包可在可能的情况下为共同身份认证和通信加密强制执行 TLS。如下，您可以找到有关它何地、何时、如何发生的更多详细信息。

### 加密和共同身份认证

用于共同身份认证和通信加密的 TLS 实施为：

- `etcd` 集群 peer - 仅启用加密，而不是共同身份认证，因为 `etcd`
 不会基于所提供的主机名，而是基于 IP 地址上验证 peer 证书
 peer 视为 peer 或 DC/OS 不支持的 DNS SRV 发现。
- `etcd` client-server - 同时启用加密和共同身份认证。唯一就位的客户端
 是 `kube-apiserver`，这意味着 Kubernetes API
 和 `etcd` 之间的通信可靠。
- 所有 Kubernetes 组件均启用加密和共同身份认证，包括
 `kube-apiserver`、`kube-scheduler`、`kube-controller-manager`、`kube-proxy` 和 `kubelet`。
- 所有都包含（必须）插件，包括按需备份/恢复，尊重针对
 Kubernetes API 的共同身份认证。

<p class="message--note"><strong>注意：</strong> 我们暴露了一个不安全的 Kubernetes API 端点。这是提供外部应用程序的临时解决方案 - 在此包的范围之外 - 访问 Kubernetes API。目前用于提供 <a href="../kubernetes-dashboard">Kubernetes 仪表板</a> 的访问权限。这是一项 beta 特性，并且在未来版本的 Kubernetes 包中将被弃用。</>

### TLS 开源 vs 企业 DC/OS

TLS 工件，如密钥对（私和公）以及证书的创建、签名和交换，是用于证明实体（例如，人、组织、应用程序等等）的身份，目的在于建立信任。要建立此信任，则需要[公钥基础架构或 PKI](https://en.wikipedia.org/wiki/Public_key_infrastructure)。过去，此包只有在 DC/OS Enterprise 上运行时才完全支持 TLS，因为只有此版本提供 PKI 所需的机制：

- [DC/OS CA](/cn/1.11/security/ent/tls-ssl/) - 集中化证书授权
 (CA) 用于验证和最终签署证书签名请求 (CSR)。
- [DC/OS 密码](/cn/1.11/security/ent/secrets/) - 一种向包组件分配
 TLS 工件的集中、安全方式，例如，Kubernetes 组件和
 在同一 DC/OS 集群中的其他应用程序。
- [DC/OS 服务帐户](/cn/1.11/security/ent/service-auth/) - 我们的包和
 应用程序所需，以对上述服务进行身份认证。

开源 DC/OS 不提供此类功能。问题是我们如何在开源 DC/OS 上实施 TLS？ 答案如下图所示：

![alt text](../img/tls.png "TLS 设计")

图 1. TLS 设计

### 利用企业 DC/OS PKI

为了在设置 TLS 时充分利用 DC/OS Enterprise PKI 基础架构，需要有权限管理 CA 和密码的 [服务账户](/cn/1.11/security/ent/service-auth/)。在安装 Kubernetes 包之前， **必须** 进行配置。

为了配置此类服务帐户，首先需要安装 [DC/OS Enterprise CLI](/cn/1.11/cli/enterprise-cli/)。然后，执行以下操作：

```shell
dcos security org service-accounts keypair private-key.pem public-key.pem
dcos security org service-accounts delete kubernetes
dcos security org service-accounts create -p public-key.pem -d 'Kubernetes service account' kubernetes
dcos security secrets delete kubernetes/sa
dcos security secrets create-sa-secret private-key.pem kubernetes kubernetes/sa
dcos security org groups add_user superusers kubernetes
```

下一步，您需要 [授予](/cn/1.11/security/ent/perms-management/) 服务帐户正确的权限。

所需权限为：
```shell
dcos:mesos:master:framework:role:<service name>-role create
dcos:mesos:master:task:user:root create
dcos:mesos:agent:task:user:root create
dcos:mesos:master:reservation:role:<service name>-role create
dcos:mesos:master:reservation:principal:<service name> delete
dcos:mesos:master:volume:role:<service name>-role create
dcos:mesos:master:volume:principal:<service name> delete

dcos:service:marathon:marathon:services:/ create
dcos:service:marathon:marathon:services:/ delete

dcos:secrets:default:/<service name>/* full
dcos:secrets:list:default:/<service name> read
dcos:adminrouter:ops:ca:rw full
dcos:adminrouter:ops:ca:ro full

dcos:mesos:master:framework:role:slave_public/<service name>-role create
dcos:mesos:master:framework:role:slave_public/<service name>-role read
dcos:mesos:master:reservation:role:slave_public/<service name>-role create
dcos:mesos:master:volume:role:slave_public/<service name>-role create
dcos:mesos:master:framework:role:slave_public read
dcos:mesos:agent:framework:role:slave_public read
```
<!-- is the name of the service to be installed -->
其中 `<service name>` 是要安装的服务的名称, e.g. `kubernetes`。

最后，您需要告诉包安装程序您刚刚创建的服务帐户，以及
如何查找其凭据。创建 JSON 选项文件，或编辑现有的文件：

```json
{
  "service": {
    "service_account": "kubernetes",
    "service_account_secret": "kubernetes/sa"
  }
}
```

假设您将文件保存为 `options.json`，按如下方式安装包：

```shell
dcos package install kubernetes --options=options.json
```

## 当您有代理时

某些用户可以在其 DC/OS 集群和互联网之间进行代理设置。这导致安装此包出现问题，即无法运行 `kube-dns` 以及其他插件 pod。以下是此类故障的示例:

```
Normal Created 5m (x2502 over 8d) kubelet, kube-node-5-kubelet.kubernetes.mesos Created container
Normal Started 5m (x2502 over 8d) kubelet, kube-node-5-kubelet.kubernetes.mesos Started container
Normal Pulled 5m (x2501 over 8d) kubelet, kube-node-5-kubelet.kubernetes.mesos Container image "gcr.io/google_containers/k8s-dns-dnsmasq-nanny-amd64:1.14.5" already present on machine
Warning BackOff 3m (x32719 over 8d) kubelet, kube-node-5-kubelet.kubernetes.mesos Back-off restarting failed container
Warning Unhealthy 3m (x10009 over 8d) kubelet, kube-node-5-kubelet.kubernetes.mesos Liveness probe failed: Get http://9.0.6.3:10054/healthcheck/dnsmasq: net/http: request canceled (Client.Timeout exceeded while awaiting headers)
Normal Pulled 3m (x2645 over 8d) kubelet, kube-node-5-kubelet.kubernetes.mesos Container image "gcr.io/google_containers/k8s-dns-sidecar-amd64:1.14.5" already present on machine
Normal Created 3m (x2646 over 8d) kubelet, kube-node-5-kubelet.kubernetes.mesos Created container
Normal Killing 3m (x2502 over 8d) kubelet, kube-node-5-kubelet.kubernetes.mesos Killing container with id docker://dnsmasq:pod "kube-dns-2102953216-qwvtn_kube-system(fd285861-ce3a-11e7-9ca9-005056945d21)" container "dnsmasq" is unhealthy, it will be killed and re-created.
(...)
```

这里的问题是，`kubelet` 无法 HTTP GET `kube-dns` 用于活跃度和准备度探测的端点，因此容器始终在重新启动。但为什么会发生这种情况呢？ 设置 `HTTP_PROXY` 和/或
DC/OS 代理上的 `HTTPS_PROXY` 导致 `kubelet` 任务继承相同的值，因此强制 `kubelet` 尝试和使用代理来进入其管理的容器。

解决方案是，指定另一个环境变量，`NO_PROXY`，以便 `kubelet` 知道不应该使用 Kubernetes pod 容器的 HTTP GET 代理，例如，将 `NO_PROXY` 值设置到 Kubernetes pod 覆盖子网，`NO_PROXY=9.0.0.0/8`。

## 当使用 10.100.0.0/16 时

默认情况下，Kubernetes 集群将使用 `10.100.0.0/16` 作为服务 CIDR。
如果是这种情况，则需要对 Kubernetes 集群服务 CIDR 进行更改。

创建 JSON 选项文件，或编辑现有的文件：

```json
{
  "kubernetes": {
    "service_cidr": "<YOUR_CIDR_HERE>"
  }
}
```
<!-- above with a CIDR block that is not already assigned somewhere in your network -->
<p class="message--note"><strong>注意：</strong> 将上面的 `<YOUR_CIDR_HERE>` 用有一个尚未分配到网络中的CIDR块替换, 例如： `10.90.0.0/16`。</p>

假设您将文件保存为 `options.json`，按如下方式安装包：

```shell
dcos package install kubernetes --options=options.json
```

## 启用云提供商集成

Kubernetes 为选择性集成提供许多公用和专用云提供商。

目前，此包支持：

- [AWS](https://kubernetes.io/docs/concepts/cluster-administration/cloud-providers/#aws)

以下，您将找到有关如何选择性地让您的 Kubernetes 集群
与云提供商集成。

### AWS

#### IAM 政策和标签

<p class="message--important"><strong>警告: </strong>这些指令<strong>必须</strong>在安装 Kubernetes 包之前执行。</p>


每个节点的 IAM 策略需要针对 Kubernetes 正确就位，以利用
与 AWS 集成的优势。

以下是允许您成功集成的 IAM 政策示例：

```json
{
    "Resource": "*",
    "Action": [
        "ec2:CreateTags",
        "ec2:DescribeInstances",
        "ec2:CreateVolume",
        "ec2:DeleteVolume",
        "ec2:AttachVolume",
        "ec2:DetachVolume",
        "ec2:DescribeVolumes",
        "ec2:DescribeVolumeStatus",
        "ec2:DescribeVolumeAttribute",
        "ec2:CreateSnapshot",
        "ec2:CopySnapshot",
        "ec2:DeleteSnapshot",
        "ec2:DescribeSnapshots",
        "ec2:DescribeSnapshotAttribute",
        "ec2:AuthorizeSecurityGroupIngress",
        "ec2:CreateRoute",
        "ec2:CreateSecurityGroup",
        "ec2:DeleteSecurityGroup",
        "ec2:DeleteRoute",
        "ec2:DescribeRouteTables",
        "ec2:DescribeSubnets",
        "ec2:DescribeSecurityGroups",
        "ec2:ModifyInstanceAttribute",
        "ec2:RevokeSecurityGroupIngress",
        "elasticloadbalancing:AttachLoadBalancerToSubnets",
        "elasticloadbalancing:ApplySecurityGroupsToLoadBalancer",
        "elasticloadbalancing:CreateLoadBalancer",
        "elasticloadbalancing:CreateLoadBalancerPolicy",
        "elasticloadbalancing:CreateLoadBalancerListeners",
        "elasticloadbalancing:ConfigureHealthCheck",
        "elasticloadbalancing:DeleteLoadBalancer",
        "elasticloadbalancing:DeleteLoadBalancerListeners",
        "elasticloadbalancing:DescribeLoadBalancers",
        "elasticloadbalancing:DescribeLoadBalancerAttributes",
        "elasticloadbalancing:DetachLoadBalancerFromSubnets",
        "elasticloadbalancing:DeregisterInstancesFromLoadBalancer",
        "elasticloadbalancing:ModifyLoadBalancerAttributes",
        "elasticloadbalancing:RegisterInstancesWithLoadBalancer",
        "elasticloadbalancing:SetLoadBalancerPoliciesForBackendServer"
    ],
    "Effect": "Allow"
}
```

另外，需要指定标签以及密钥 `KubernetesCluster`。
确保此标签的值在 AWS 帐户的所有标签中都是唯一值
并应用到与节点关联的自动扩展和安全组：

```json
{
    "Tags" : [
        {
          "Key" : "KubernetesCluster",
          "Value" : "kubernetes-cluster"
        }
    ]
}
```

为了启用 AWS 云提供商集成，您必须将 `kubernetes.cloud_provider`
选项添加到包选项 JSON 文件：

```json
{
  "kubernetes": {
    "cloud_provider": "aws"
  }
}
```

假设您将文件保存为 `options.json`，按如下方式安装包：

```shell
dcos package install kubernetes --options=options.json
```

#### 配置 `StorageClass`

为了能够为您的 pod 请求存储，您必须在安装包之后至少创建一个 `StorageClass` 
资源。在执行此操作之前，强烈建议您要大体上
熟悉 [Amazon EBS](https://aws.amazon.com/ebs/?nc1=h_ls)、Kubernetes
[存储类](https://kubernetes.io/docs/concepts/storage/storage-classes/)，
而且要对
[AWS 特定选项](https://kubernetes.io/docs/concepts/storage/storage-classes/#aws)
特别熟悉。

举个例子，要使用
[通用固态硬盘](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSVolumeTypes.html)
卷作为您集群中卷的默认存储类型，您必须创建
以下 `StorageClass` 资源：

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: ssd
  annotations:
    storageclass.kubernetes.io/is-default-class: "true"
  labels:
    kubernetes.io/cluster-service: "true"
provisioner: kubernetes.io/aws-ebs
parameters:
  type: gp2
```

`storageclass.kubernetes.io/is-default-class: "true"` 注解
保证每个没有特性存储类的 `PersistentVolumeClaim` 
会使用您刚刚定义的 `ssd` 类。当然，
除默认设置外，您可以根据需要创建多个存储类。举个
例子，要为非频繁访问的数据创建类，您可以创建
以下 `StorageClass` 资源：

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: cold-hdd
  labels:
    kubernetes.io/cluster-service: "true"
provisioner: kubernetes.io/aws-ebs
parameters:
  type: sc1
```

要使用 pod 中的 `cold-hdd` 存储类，您必须首先创建
参照该存储类的 `PersistentVolumeClaim`：

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: http-archive
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 500Gi
  storageClassName: cold-hdd
```

最后，您必须参照 pod 中的 `PersistentVolumeClaim`，您将
准备就绪：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: http-archive
spec:
  containers:
    - name: nginx
      image: nginx:1.12.2-alpine
      ports:
        - containerPort: 80
          name: http
      volumeMounts:
        - mountPath: "/usr/share/nginx/html"
          name: data
  volumes:
    - name: data
      persistentVolumeClaim:
       claimName: http-archive
```

#### `Ingress` 支持

 `Ingress` 资源在 Kubernetes 中很特别，并不包含管理它的
内置控制器。这与
`PersistentVolumeClaim` 或 `LoadBalancer`-类型 `Service` 等资源相反，
其 Kubernetes 包含内置控制器和与云提供商的集成。
因此，要使用 `Ingress` AWS 中的资源，您必须部署自定义
ingress 控制器。请参阅
[Ingress](/cn/services/kubernetes/1.2.1-1.10.6/ingress/)
文档，以了解有关在您的
集群中设置 ingress 的示例和重要信息。
