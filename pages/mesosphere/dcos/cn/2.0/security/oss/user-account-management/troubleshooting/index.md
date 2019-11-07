---
layout: layout.pug
navigationTitle: 故障排除
title: 用户账户管理故障排除
excerpt: 排除用户账户管理问题
render: mustache
model：/mesosphere/dcos/2.0/data.yml
menuWeight: 50
---

# 用户账户管理调试

## Admin Router

Admin Router 通过 HTTP 接收所有的用户账户管理操作，并将其移交给 IAM。要调试用户管理问题，请使用以下命令确保管理节点上的 Admin Router 接收针对预期操作的 HTTP 请求。

```bash
sudo journalctl -u dcos-adminrouter.service
```

## 身份和访问管理器

要调试用户账户管理问题，请使用以下命令检查管理节点上的 IAM (Bouncer)。

```bash
sudo journalctl -u dcos-bouncer.service
```

## CockroachDB

IAM 将用户信息存储在管理节点上运行的 CockroachDB 中。
如果 Admin Router 和 IAM 接收到根据其日志执行的用户管理操作，而 IAM 无法满足其中的请求，则可能是 CockroachDB 遇到了问题。在这种情况下，请检查所有管理节点上的 CockroachDB 日志中是否存在错误或异常模式。

```bash
sudo journalctl -u dcos-cockroach.service
```

确定 CockroachDB 群集是否健康的最简单方法是从这类管理节点查询 CockroachDB 节点状态信息。

```bash
sudo /opt/mesosphere/bin/cockroach node status --ranges --host=$(/opt/mesosphere/bin/detect_ip) --insecure
```

报告的节点数量通常应该匹配 DC/OS 管理节点的数量。但是，每次更换管理节点时，旧的 DC/OS 管理节点的 CockroachDB 节点不会自动被移除。

`is_live` CockroachDB 节点的数量应始终匹配管理节点的当前数量。

DC/OS 将 CockroachDB 范围的副本数量设置为等于 DC/OS 管理节点的数量。这意味着一个管理节点应该保留一个数据副本。因此，如果管理节点停止运行，那么 `ranges_underreplicated` 的数量可以暂时增加。新的管理节点加入群集之后，`ranges_underreplicated` 的数量预计五分钟后会再次减少至零。

如果 `ranges_unavailable` 的数量不为零，那么此数据至少暂时不可用于读取和写入。在这种情况下，CockroachDB 范围内的 raft 组 quorum 最有可能受损。

在大多数 DC/OS 主节点上，将大多数 CockroachDB 实例的状态再次恢复为 `is_live` 有望修复 quorum，从而将 `ranges_unavailable` 减少至零。

通过重新启动报告 `is_live = false` 的 CockroachDB 实例，可轻松做到这一点。执行以下命令以重新启动相应管理节点上的 CockroachDB 节点。

```bash
sudo systemctl restart dcos-cockroach.service
```

如果无法恢复特定范围的 raft quorum 并且 `ranges_unavailable` 仍然存在，则无法使用的数据将不可避免地丢失，因为它们无法被读取或写入。

<p class="message--note"><strong>注意：</strong>对于已经处于 <code>ranges_unavailable</code> 状态的范围，重新安装或添加新的 DC/OS 管理节点 (CockroachDB 节点) 不会将其添加到 quorum。此外，删除现有的 CockroachDB 实例也会降低恢复的可能性。</p>

