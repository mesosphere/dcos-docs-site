---
layout: layout.pug
navigationTitle: 连接客户端
title: 连接客户端
menuWeight: 72
excerpt: 将客户端连接到 Kubernetes 集群

---

## 连接客户端

在尝试连接到 Kubernetes 集群之前，您应确保
您已正确将 Kubernetes API 暴露于 DC/OS 外部
集群中设置 ingress 的示例和重要信息。这可通过遵循
[暴露 Kubernetes API](/cn/services/kubernetes/1.2.1-1.10.6/exposing-the-kubernetes-api/) 中所述的步骤实现。

您还应确保
[`kubectl`](https://kubernetes.io/docs/tasks/tools/install-kubectl/) 已
安装并可用于终端会话。如果您已通过
DC/OS UI 安装 Kubernetes 包，那么您还需要安装
`dcos kubernetes` 命令：

```
# dcos package install kubernetes --cli
```

在进行之前，您还应确保 `dcos` 被充分配置，
可访问所需的 DC/OS 集群。

<div class="message--important"><p><strong>警告</strong></p>
<p>在进行之前，<tt>dcos</tt> <b>必须</b> 被配置，可通过 HTTPS 访问
所需的 DC/OS 集群。您必须确保</p>
<p><tt>$ dcos config show core.dcos_url</tt></p>
<p> 返回以<tt>https://</tt> 开头的 URL。</p>

<p>如果返回的 URL 不是以
<tt>https://</tt> 开头，那么您必须运行
<tt>$ dcos config set core.dcos_url https://&lt;master-ip&gt;</tt></p>
<p>如果 DC/OS 使用的 TLS 证书不受信任，那么您也必须运行以下命令来禁用 TLS 验证：
<tt>$ dcos config set core.ssl_verify false</tt>
</p>
</div>

### 无 TLS 验证

要将 `kubectl` 配置为无需验证所提供的 TLS 证书
即可访问 Kubernetes API，您必须运行以下命令：

```
$ dcos kubernetes kubeconfig \
    --apiserver-url https://kube-apiserver.example.com:6443 \
    --insecure-skip-tls-verify
```

您必须将 `https://kube-apiserver.example.com:6443` 替换为
Kubernetes API 暴露于 DC/OS 集群外部的 URL。

### 有 TLS 验证

要将 `kubectl` 配置为访问 Kubernetes API 的同时验证
即可访问 Kubernetes API，您必须运行以下命令：

```
$ dcos kubernetes kubeconfig \
    --apiserver-url https://kube-apiserver.example.com:6443 \
    --path-to-custom-ca ca.pem
```

哪个 `ca.crt` 是访问 CA（签署用于暴露 Kubernetes API 的证书）
证书的路径。您必须将
`https://kube-apiserver.example.com:6443` 替换为 Kubernetes
API 暴露于 DC/OS 集群外部的 URL。

从此，任何 `kubectl` 调用都可以轻松运行，基于
已配置 Kubernetes API 授权模式以及授予您 Kubernetes 服务帐户的权限。

## 管理多个集群

如文档中所述，DC/OS Kubernetes 仅支持一个 Kubernetes 集群
部署。然而，您可能想要使用多个 Kubernetes 集群，
有可能是在其他 Kubernetes 提供者上运行的集群。 `kubectl` 支持多个上下文环境，您随后可以切换至
所需的环境。

要在不切换上下文环境的情况下创建 DC/OS Kubernetes config，请执行以下操作：

```bash
$ dcos kubernetes kubeconfig \
    --apiserver-url https://kube-apiserver.example.com:6443 \
    --path-to-custom-ca ca.pem \
    --no-activate-context
kubeconfig context 'kube-apiserver-example-com6443' created successfully
```

要切换到 DC/OS Kubernetes 集群上下文环境，
您必须运行：

```bash
$ kubectl config use-context kube-apiserver-example-com6443
Switched to context "kube-apiserver-example-com6443".
```

或在运行命令时指定上下文环境：

```bash
$ kubectl get nodes --context=kube-apiserver-example-com6443
NAME                                   STATUS    AGE        VERSION
kube-node-0-kubelet.kubernetes.mesos   Ready     10m        v1.10.6
```

默认情况下，`kubeconfig` 上下文环境名称源自
`--apiserver-url` 标签的值。要使上下文环境名称更容易记住和相互切换，
您可以通过使用 `--context-name` 标签指定一个名称：

```bash
$ dcos kubernetes kubeconfig \
    --apiserver-url https://kube-apiserver.example.com:6443 \
    --path-to-custom-ca ca.pem \
    --context-name=my-context
```

你应该注意，`dcos kubernetes kubeconfig` 将拒绝覆盖
现有的 `user`、`context` 和 `cluster` 条目（其名称与
`--context-name` 标签的值相匹配）（或从
`--apiserver-url` 标签的值中获取的值，以防 `--context-name` 未被指定）。您
应确保您为 `--context-name` 提供一个唯一、当前不存在的值。
