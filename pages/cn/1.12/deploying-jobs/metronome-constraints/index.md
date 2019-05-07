---
layout: layout.pug
navigationTitle: Metronome 放置约束
title: Metronome 放置约束
menuWeight: 3
excerpt: 了解 Metronome 放置约束

enterprise: false
---

Metronome 放置的位置约束作业运行的控制。约束有三个部分：字段名称、算子和值。该字段可以是代理的主机名或代理的任何属性。

Metronome 支持 Marathon 算子的子集，并且支持 Marathon 的所有特殊字段名称。

# 字段名称

## 代理属性作为字段名称

字段名称是以 `@` 开头的约束的代表代理属性。

### 主机名

字段名称与代理主机名相匹配时输入 `@hostname`。参见 `LIKE` 算子，查看使用示例。

### 分域和分区作为字段名称

使用 `@region` 和 `@zone` 字段名称配置 [故障域感知和容量扩展](/cn/1.12/deploying-services/fault-domain-awareness/)。参见 `IS` 算子，查看使用示例。

## 属性作为字段名称

如果 `@hostname`、`@region` 或 `@zone` 未指定为字段名称，则字段名称将被解释为 Mesos [代理属性](http://mesos.apache.org/documentation/attributes-resources/#attributes)。

Metronome 支持文本、标量和范围属性值。对于标量和范围，Metronome 将对格式化值进行字符串比较，因为它们将 [根据 Mesos 中的规范](http://mesos.apache.org/documentation/attributes-resources/#attributes)进行指定。

# 算子

## IS 算子

支持 DC/OS 1.12.1 及更高版本。

**值**（必填）：Mesos 标量或文本值，由 [Mesos 属性和资源类型规范](http://mesos.apache.org/documentation/latest/attributes-resources/#types)指定：

```
scalar : floatValue

floatValue : ( intValue ( "." intValue )? ) | ...

intValue : [0-9]+

text : [a-zA-Z0-9_/.-]
```

### 比较文本值

指定 `IS` 限制后，任务仅在具有指定值的节点上启动。

``` json
{
  "id": "sleep-cluster",
  "cmd": "sleep 60",
  "instances": 3,
  "constraints": [["rack", "IS", "rack-1"]]
}
```

### 比较标量值

比较标量时，将值与最接近的千分位数进行比较（使用半偶舍入法）。

假设代理的属性为“级别：0.8”，则匹配以下限制：

```json
[["level", "IS", "0.8"]]

[["level", "IS", "0.80"]]

[["level", "IS", "0.8001"]]
```

### 示例

以下示例将导致作业在 us-east-1 区域中运行：

```json
{
  "description": "Remote Sleeper",
  "id": "sleeper-remote",
  "run": {
    ...,
    "placement": {
      "constraints": [
        { "attribute": "@region", "operator": "IS", "value": "us-east-1" }
      ]
    }
  }
}
```

## LIKE 算子
**值**（必填）：属性值的正则表达式。

`LIKE` 接受正则表达式作为参数，并且只允许在字段值与正则表达式匹配的代理上运行任务。请注意，必须匹配整个值（假设正则表达式周围有隐式 `^` 和 `$`）。

```json
{
  "description": "Important Job",
  "id": "sleeper",
  "run": {
    ...,
    "placement": {
      "constraints": [
        { "attribute": "@hostname", "operator": "LIKE", "value": "host-[7-9]" }
      ]
    }
  }
}
```

`LIKE` 约束不会匹配缺少相关属性的代理发出的 offer。

如果相关属性是一个标量，则会利用半偶（half-even）舍入法舍入到最接近的千分位数；小数点后的零会去掉。

## UNLIKE 算子
**值**（必填）：属性值的正则表达式。

`UNLIKE` 类似于 `LIKE` 算子，但指示 Metronome 仅在字段值 **不与**正则表达式匹配的代理上运行任务。

``` json
{
  "description": "Important Job",
  "id": "sleeper",
  "run": {
    ...,
    "placement": {
      "constraints": [
        { "attribute": "@hostname", "operator": "UNLIKE", "value": "temp-host-.*" }
      ]
    }
  }
}
```

`UNLIKE` 约束将匹配缺少相关属性的代理发出的 offer。
