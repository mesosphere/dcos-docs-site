---
layout: layout.pug
navigationTitle: 输入格式
title: 输入格式
menuWeight: 45
excerpt: 池配置文件格式信息
enterprise: false
---


Edge-LB 接受 YAML 或 JSON 格式的配置文件。

# 将 YAML 转换为 JSON

将 YAML 配置文件转换为 JSON，并使用以下命令将结果输出到 `stdout`。

`dcos edgelb show --convert-to-json=/path/to/yaml`

# 将 JSON 转换为 YAML

目前没有自动化方法来执行此操作。我们建议您手动进行转换，然后使用 YAML 上的 YAML-to-JSON 转换。然后使用 `diff` 命令来找出您的 YAML 和 JSON 之间的区别。

1. 将 JSON 手动转换为 YAML。
2. 使用 `diff` shell 命令与原始的 json 进行比较。
3. 甚至可以“转换” JSON 文件，以获得一致格式化的 JSON。

```
diff <(dcos edgelb show --convert-to-json=myconfig.yaml) <(dcos edgelb show --convert-to-json=myconfig.json)
```
