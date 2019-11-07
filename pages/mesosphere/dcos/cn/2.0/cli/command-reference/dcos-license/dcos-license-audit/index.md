---
layout: layout.pug
navigationTitle:  dcos license audit
title: dcos license audit
menuWeight: 1
excerpt: 获取群集许可证审计记录
enterprise: true
render: mustache
model: /mesosphere/dcos/2.0/data.yml
---

# 说明
`dcos license audit` 命令允许您检索您的 DC/OS 许可证的审核数据。

# 使用

```bash
dcos license audit [OPTIONS] COMMAND [ARGS]...
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `--help` | 显示此消息后退出。 |



# 示例
有关示例，请参阅[许可证](/mesosphere/dcos/2.0/administering-clusters/licenses/)。

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos license] ](/mesosphere/dcos/2.0/cli/command-reference/dcos-license/) | 管理 DC/OS 群集许可证。 |
