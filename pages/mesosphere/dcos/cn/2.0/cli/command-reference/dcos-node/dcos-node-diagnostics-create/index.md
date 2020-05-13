---
layout: layout.pug
navigationTitle:  dcos node diagnostics create
title: dcos node diagnostics create
menuWeight: 3
excerpt: 创建诊断捆绑包
enterprise: false
render: mustache
model: /mesosphere/dcos/2.0/data.yml
---

# 说明
`dcos node diagnostics create` 命令允许您创建诊断捆绑包。

<p class="message--warning"><strong>警告：</strong>自 DC/OS 2.0 以来，此命令已弃用，请使用 <a href="/mesosphere/dcos/2.0/cli/command-reference/dcos-diagnostics/dcos-diagnostics-create/"><tt>dcos diagnostics create</tt></a> 代替。</p>

# 使用

```bash
dcos node diagnostics create (<nodes>)
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `--help, h` | 显示用法。 |

## 位置自变量

| 名称 | 说明 |
|---------|-------------|-------------|
| `<nodes>` | 在其上运行命令的节点。节点可以是以下任一项：IP 地址、主机名、Mesos ID、或关键词 `all`、`masters`、`agents`。 |

# 示例

```bash
dcos node diagnostics create 10.0.2.221

Job has been successfully started, available bundle: bundle-2019-03-18-1552932773.zip
```

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos node](/mesosphere/dcos/2.0/cli/command-reference/dcos-node/) | 查看 DC/OS 节点信息。 |

