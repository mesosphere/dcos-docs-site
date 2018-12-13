---
layout: layout.pug
navigationTitle: 池配置参考
title: Edge-LB 池配置参考
menuWeight: 80
excerpt: 所有可能的 Edge-LB 池配置值的参考
enterprise: false
---

这是所有可能的 Edge-LB 池配置值的参考，以及展示各种用例的一些示例。

# 配置参考

通过运行以下命令，可以找到包含所有可能的选项和描述的配置参考：

```
dcos edgelb show --reference
```

有关详细信息，请参阅 [`dcos edgelb show` 的 CLI 参考指南条目](/cn/1.1/cli-reference/dcos-edgelb-show/)。

# API 版本

Edge-LB v1.1.0 中采用名为 `apiVersion` 的新顶级配置字段。两种版本几乎相同，只有一个重要区别：`pool.haproxy.backends.servers`（apiVersion `V1`）已被 `pool.haproxy.backends.services` 替代，以更直观的方式为 HAProxy 选择服务/后端。

针对向后兼容，`apiVersion` 字段默认为 `V1`。因此，要使用 `V2` config，您必须将`pool.apiVersion` 明确设置为 `"V2"`。

在左侧选择一个 API 版本以查看相应的配置参考或示例。
