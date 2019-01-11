---
layout: layout.pug
navigationTitle: 使用
title: Edge-LB 使用
menuWeight: 60
excerpt: Edge-LB 使用的常见命令
enterprise: true
---

本页面介绍 Edge-LB 使用的常见命令。有关 CLI 命令的更详细列表，请参阅 [dcos edgelb cli 参考](/cn/services/edge-lb/1.1/cli-reference/)。

# 先决条件

- Edge-LB [安装和运行](/cn/services/edge-lb/1.1/installing/)。

# 创建池

启动服务并创建 [池配置文件](/cn/services/edge-lb/1.1/pool-configuration/)后，您可以使用 CLI 来部署它：

```
dcos edgelb create <pool-configuration-file>
```

# 更新池

使用以下命令更新池的配置：

```
dcos edgelb update <pool-configuration-file>
```

## 正常的重新加载场景

对通过池负载均衡的服务进行更改（例如，扩展），将触发其负载均衡器的重新加载。此重新加载具有以下属性：

* 无流量丢失（除非为请求提供服务的服务实例被终止）。

* 负载均衡器将等待，直到现有连接终止，因此，长时间连接将阻止重新加载完成。

* 重新加载将每 10 秒进行一次。

此重新加载的属性能够实现
[蓝色/绿色部署这样的策略](/cn/services/edge-lb/1.1/tutorials/blue-green-deploy/)。

## 负载均衡器重新启动场景

对负载均衡器池进行更改（例如，添加一个密码），将触发池中所有负载均衡器的重新启动。此重新启动具有以下属性：

- 流量丢失。为了尽量降低影响，我们建议在池内运行多个负载均衡器。
- 负载均衡器将在同一节点上（除非节点本身已出错）重新启动。

<p class="message--warning"><strong>警告：</strong> 负载均衡器的实例数不能缩小。此限制将在未来的 Edge-LB 版本中解决。</p>

## 替换出错的 pod

默认情况下，Edge-LB 负载均衡器实例与给定节点绑定；当节点下降时，Edge-LB 不会自动将包含 Edge-LB 负载均衡器实例的 pod 重新定位到新节点。您必须将 `pod replace` 命令发送池调度器，以便在新节点上启动负载均衡器实例。如果托管 pod 的计算机永久丢失，则需要手动干预来丢弃丢失的 pod，并在新节点上启动。

这可以通过 dcos CLI  `edgelb-pool` 子命令来完成（注意，这不同于 `edgelb` 子命令，如果尚未安装，则必须单独安装）。

1. 安装 `edgelb-pool` CLI 子命令：

```
$ dcos package install edgelb-pool --cli --yes
```

2. 获取您需要重新定位的 pod 的池名称：

```
dcos edgelb show
```

这将显示所有池配置。含有丢失 pod 的池将是以下 ` <pool-name>` 的值。

3. 获取您需要替换的 pod 的名称（在已删除的公用代理上运行的 pod）。这将是 ` 的值<pod-id>`.

```
$ dcos edgelb-pool --name=/dcos-edgelb/pools/<pool-name> pod list
```

4. 使用 `<pod-id>` with the `pod 替换` 命令：

```
$ dcos edgelb-pool --name=/dcos-edgelb/pools/<pool-name> pod replace <pod-id>
```

这将销毁池服务器，并重新启动新公用代理上的新服务器。

有关 Edge-LB 命令的列表，请参阅 [CLI 参考](/cn/services/edge-lb/1.1/cli-reference/) 页面。
