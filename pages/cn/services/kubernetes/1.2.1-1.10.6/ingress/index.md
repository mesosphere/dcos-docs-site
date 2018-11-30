---
layout: layout.pug
navigationTitle: 外部入口
title: 外部入口
menuWeight: 90
excerpt: 管理入口控制器
---


## 运行 ingress 控制器

如果您想将 HTTP/S (L7) 应用程序暴露到外部世界 - 至少
DC/OS 集群外部 - 您应创建一个
[Kubernetes `Ingress`](https://kubernetes.io/docs/concepts/services-networking/ingress)
资源。然而，为了让 Ingress 资源工作，Kubernetes
集群必须具有 **自定义 ingress 控制器** 在运行。此包不会
默认安装此控制器，但是允许您选择默认 ingress 控制器。

您至少需要一个 DC/OS 公用代理，自定义 ingress 控制器可以在该代理上
运行。在安装 Kubernetes 包之前，确保您拥有足够多的公用
代理，以满足您的可用性需求，并根据需要
设置 `kubernetes.public_node_count` 包选项的值：

```
{
  (...)
  "kubernetes": {
    (...)
    "public_node_count": 3
    (...)
  }
  (...)
}
(...)
```

请确保 `kubernetes.public_node_count` 的设置值
小于或等于您集群中的公用代理数量。如果您设置
更高的值，框架将无法安装。

### 开源 ingress 控制器

您可以选择一些开源、 cloud-agnostic ingress 控制器
：

* [Traefik](https://docs.traefik.io/user-guide/kubernetes/)
* [NGINX](https://github.com/kubernetes/ingress-nginx)
* [HAProxy](https://github.com/appscode/voyager)
* [Envoy](https://github.com/heptio/contour)
* [Istio](https://istio.io/docs/tasks/traffic-management/ingress.html)

如果您正在 AWS 上运行，并希望与
[Amazon ELB](https://aws.amazon.com/documentation/elastic-load-balancing/) 集成，
那么以下项目可能是一个选项：

* [ALB Ingress 控制器](https://github.com/coreos/alb-ingress-controller)

#### 示例：使用 Traefik ingress 控制器

我们将引导您使用 Traefik ingress 控制器来
公开暴露在 Kubernetes 集群中运行的
服务。第一步应该是部署 ingress 控制器本身：

```yaml
---
kind: ClusterRole
apiVersion: rbac.authorization.k8s.io/v1beta1
metadata:
  name: traefik-ingress-controller
rules:
  - apiGroups:
      - ""
    resources:
      - services
      - endpoints
      - secrets
    verbs:
      - get
      - list
      - watch
  - apiGroups:
      - extensions
    resources:
      - ingresses
    verbs:
      - get
      - list
      - watch
---
kind: ClusterRoleBinding
apiVersion: rbac.authorization.k8s.io/v1beta1
元数据：
 名称：traefik-ingress-controller
rolEref:
 apiGroup: rbac.authorization.k8s.io
 kind: 集群角色
 名称：traefik-ingress-controller
subjects:
- kind: 服务帐户
 名称：traefik-ingress-controller
 命名空间： kube-system
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: traefik-ingress-controller
  namespace: kube-system
---
kind: 部署。
apiVersion：应用程序/v1
元数据：
 名称：traefik-ingress-controller
 命名空间： kube-system
 标签：
 k8s-app: traefik-ingress-controller
规格：
 副本：1
 选择器：
 matchLabel:
 k8s-app: traefik-ingress-controller
 模板：
 元数据：
 标签：
 k8s-app: traefik-ingress-controller
 名称：traefik-ingress-controller
 规格：
 服务账户名称：traefik-ingress-controller
 terminationGracePeriodSeconds: 60
 容器：
 - 图像： traefik:v1.6.4-alpine
 名称：traefik-ingress-controller
 args:
 - --api
 - --kubernetes
 - --logLevel=INFO
# NOTE: 以下是必要的补充：
# https://docs.traefik.io/user-guide/kubernetes
# 请在下方查看详细说明
 端口：
 - containerPort: 80
 hostPort: 80
 名称： http
 协议：TCP
 - containerPort: 8080
 名称：admin
 协议：TCP
 亲和性：
 podAntiAffinity:
 requiredDuringSchedulingIgnoredDuringExecution:
 - labelSelector:
 matchExpression:
 - 键：k8s-app
 操作员：In
 值：
 - traefik-ingress-lb
 topologyKey: "kubernetes.io/hostname" 
 nodeSelector:
 kubernetes.dcos.io/node-type：公用
 容忍：
 - 键："node-type.kubernetes.dcos.io/public" 
 操作员："Exists" 
 效果："NoSchedule" 
```

创建这些资源将导致 Traefik 被部署为
您集群中的 ingress 控制器。我们对
[official manifests](https://docs.traefik.io/user-guide/kubernetes) 进行了一些补充，因此
部署按预期工作：

* 将每个 pod 的`:80` 端口绑定到主机的 `:80` 端口。这是
 在公用节点上暴露 ingress 控制器的最简单方式，因为 DC/OS
 已经开启公用代理上的 `:80` 端口。但是，当使用 `hostPort` 时，您需要
 负责确保没有其他应用程序
 （在集群中或甚至在 DC/OS 外）在使用每个公用代理上的 `:80` 
 端口。如果端口已被使用，Kubernetes 将无法在特定代理商上
 调度 pod。
* 利用 pod 反关联，确保 pod 在可用的 
 公用代理之间散开，以确保高可用性。当使用
 如上所述的 `hostPort` 时，这会有些冗余，但是，当使用
 不同的方法（见下文）暴露控制器会有帮助。
* 利用 `nodeSelector` 约束，以强制 pod
 只在公用节点上调度。
* 利用 `node-type.kubernetes.dcos.io/public` 节点污点，以便
 pod 实际上可在公用节点上运行。

假设您在集群中有一个附带 IP `<public-agent-ip>` 的公用代理，
ingress 控制器将可以在
http://<public-agent-ip>`. If you have `N` 公用代理上访问，我们建议
您将 `.spec.replicas` 设置成与上述实例中的 `N` 相同。就像在一个
场景中，当有单个公用代理时，ingress 控制器
可以在每个代理的 `:80` 端口上被访问。

如上所述，使用 `hostPort` 容易使
部署受到端口碰撞的影响。如果你想确保安全，
那么您可以删除上述部署中的 `.spec.spec.ports` 字段并使用
`NodePort`-类型 `Service` 以暴露 ingress 控制器：

```yaml
apiVersion: v1
kind: Service
metadata:
  name: traefik-ingress-controller
  namespace: kube-system
spec:
  selector:
    k8s-app: traefik-ingress-controller
  ports:
    - port: 80
      name: http
  type: NodePort
```

创建上述 `Service` 对象将导致 Kubernetes master 分配
来自标签配置范围（`:30000` 至 `:32767`）的端口，并且每个节点会将
该端口代理到 ingress 控制器。结果端口
会在 `Service`的 `spec.ports[0].nodePort` 字段中被报告。如果您想使用特定的
端口号，您可以将 `nodePort` 字段手动添加至 `.spec.ports[0]`。在任何
情况下，记录结果 `nodePort`，

```shell
$ kubectl -n kube-system describe svc traefik-ingress-controller | grep NodePort
Type:                     NodePort
NodePort:                 http  <node-port>/TCP
```

并确保设置防火墙规则，以便每个公用代理中的 `:<node-port>` 端口
可以从 `0.0.0.0/0` 被访问—或者，从
已知 IP 或范围的受限集合（拥有访问
通过 ingress 暴露的服务的权限）。例如，如果您正在运行
AWS 上的 Kubernetes，您可以使用以下命令设置这些防火墙
规则：

```shell
$ aws ec2 authorize-security-group-ingress \
    --group-id "<security-group-id>" \
    --protocol tcp \
    --port "30000-32767" \
    --cidr "0.0.0.0/0" \
    --region "<region>"
```

运行上述命令时，您必须将 `<security-group-id>` 替换为
管理 DC/OS 集群中的公用代理访问权限的安全组的 ID，
并将 `<region>` 替换为与您集群部署的区域。请
注意，此规则可能过于宽容。我们强烈建议您
设置最严格的防火墙规则集（符合您的场景）。

防火墙规则到位后，您将准备好部署应用程序，
并把它暴露在互联网上。在本示例中，我们将暴露一个简单的 HTTP
服务器，该服务器以 "Hello world!" 消息对 `GET /` 作出相应。使用
`kubectl` 创建以下对象：

```yaml
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hello-world
  labels:
    app: hello-world
spec:
  replicas: 2
  selector:
    matchLabels:
      app: hello-world
  template:
    metadata:
      labels:
        app: hello-world
    spec:
      containers:
      - name: echo-server
        image: hashicorp/http-echo
        args:
        - -listen=:80
        - -text="Hello from Kubernetes!"
        ports:
        - containerPort: 80
---
apiVersion: v1
kind: 服务
元数据：
 名称：hello-world
规格：
 选择器：
 应用程序：hello-world
 端口：
 - 端口 80
 targetPort: 80
```

现在，创建将暴露 `hello-world` 服务的 `Ingress` 对象：

```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  annotations:
    kubernetes.io/ingress.class: traefik
  name: hello-world
spec:
  rules:
  - http:
      paths:
      - path: /
        backend:
          serviceName: hello-world
          servicePort: 80
```

注意 `kubernetes.io/ingress.class` 注解 — 这是您指定
ingress 控制器的位置，负责满足此 ingress。
创建此资源后，打开浏览器并导航至

```
http://<public-agent-ip>/
```

或

```
http://<public-agent-ip>:<node-port>/
```

基于您选择的上述选项（`hostPort` vs `nodePort`）。您应该
能够看到 `Hello from Kubernetes!` 消息，意味着 ingress
已成功创建，Traefik 正在将您的服务暴露给
互联网。如果您看不到消息，请确保您已设置
上述防火墙规则。
