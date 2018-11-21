---
layout: layout.pug
navigationTitle: Marathon 布局约束
title: Marathon 布局约束
menuWeight: 3
excerpt: 了解 Marathon 布局约束

enterprise: false
---

Marathon 布局约束能够控制服务的运行位置，以便优化容错性（通过在多个节点上分散任务）或本地化（通过在同一节点上运行所有服务任务）。约束有三个部分：字段名称、算子和可选参数。该字段可以是代理节点的主机名或代理节点的任何属性。

# 字段名称

## 主机名作为字段名称

字段名称与代理节点主机名相匹配时输入 `@hostname`。字段名称为 `@hostname` 时，支持所有 Marathon 算子。参见以下 `UNIQUE operator`，查看使用示例。

### 分域和分区作为字段名称

使用 `@region` 和 `@zone` 字段名称设置 [故障域感知和容量扩展](/cn/1.11/deploying-services/fault-domain-awareness/)。

## 属性作为字段名称

如果 `@hostname`、 `@region` 或 `@zone` 未被指定为字段名称，那么字段名称将被解释为 Mesos 代理节点属性。Mesos 代理节点属性让您可以标记代理节点。参见 `mesos-slave --help`，了解如何设置属性。如果代理节点上未定义指定的属性，大多数算子将拒绝在其上运行任务。事实上，只有 `UNLIKE` 算子将始终接受此邀请，但其他算子将始终拒绝。

字段名称为属性时，则支持所有 Marathon 算子。Marathon 支持文本、标量、范围和数集属性值。为确定标量、范围和数集，Marathon 将对格式值执行字符串比较。格式与 Mesos 属性格式匹配。范围和数集的格式分别为 `[begin-end,...]` 和 `{item,...}` 。例如，您可能有一个格式为 `[100-200]` 的范围和格式为 `{a,b,c}` 的数集。正则表达式适用于 LIKE 和 UNLIKE 算子；如需匹配 ANY 值，请使用字符串 `.*`。

# 算子

## CLUSTER 算子
**值**（可选）: 字符串值。
指定值后，就会采用值完全匹配的属性在代理节点上启动任务。

`CLUSTER` 支持您在共享某个属性的代理节点上运行服务的所有任务。这一属性在您的服务有特殊硬件，或者想在同一机架上运行这些服务以降低延迟时，以及其他情况下都非常实用。

命名字段名称 `hostname` 告诉 Marathon 应用程序或 Pod 启动的任务应在同一代理上启动：
* 指定 `hostname` 的值后，就会在主机名与值匹配的代理上启动任务。
* `hostname` 值为空或未指定时，第一个实例在 **任意** 代理节点上启动，其余任务也和该实例一起在同一代理上启动。

当字段名称为属性时，Marathon 处理任务的方式会不同：
* 指定值后，任何代理只要带有一个根据**和**字段命名的属性，且属性具有匹配该限制的值，均可启动任务。
* 当值为空或未指定时，第一个实例会在具有根据字段命名的属性的任何代理上启动；该代理上属性的值用于将来限制的匹配。

## 示例
以下示例指定了运行应用程序任务的确切机架：

``` json
{
  "id": "sleep-cluster",
  "cmd": "sleep 60",
  "instances": 3,
  "constraints": [["rack_id", "CLUSTER", "rack-1"]]
}
```

此示例将值字段留空。这会告诉 Marathon ，所有应用程序任务都应在同一机架上运行，但不指定具体机架。

``` json
{
  "id": "sleep-cluster",
  "cmd": "sleep 60",
  "instances": 3,
  "constraints": [["rack_id", "CLUSTER"]]
}
```

此示例使用指定的 `hostname`，这意味着服务必须在特定节点上运行。

``` json
{
  "id": "sleep-cluster",
  "cmd": "sleep 60",
  "instances": 3,
  "constraints": [["hostname", "CLUSTER", "a.specific.node.com"]]
}
```

下面，字段已命名 `hostname`，但值为空。这会告诉 Marathon，所有应用程序任务必须在同一节点上运行，但不指定具体节点。

``` json
{
  "id": "sleep-cluster",
  "cmd": "sleep 60",
  "instances": 3,
  "constraints": [["hostname", "CLUSTER"]]
}
```

## LIKE 算子
**值**（必填）：属性值的正则表达式。

`LIKE` 接受正则表达式作为参数，并且只允许在字段值与正则表达式匹配的代理节点上运行任务。

``` json
{
  "id": "sleep-group-by",
  "cmd": "sleep 60",
  "instances": 3,
  "constraints": [["rack_id", "LIKE", "rack-[1-3]"]]
}
```

如果相关属性是一个标量，则会利用半偶（half-even）舍入法舍入到最接近的千分位数；小数点后的零会去掉。

## UNLIKE 算子
**值**（必填）：属性值的正则表达式。

`UNLIKE` 类似于 `LIKE` 算子，但指示 Marathon 仅在字段值 **不与**正则表达式匹配的代理节点上运行任务。

``` json
{
  "id": "sleep-group-by",
  "cmd": "sleep 60",
  "instances": 3,
  "constraints": [["rack_id", "UNLIKE", "rack-[7-9]"]]
}
```

## MAX_PER 算子
**值**（必填）：是一个整数，例如 `"2"`。

`MAX_PER` 接受数字作为指定每个组最大大小的参数。它可用于限制跨机架或数据中心的任务。

``` json
{
  "id": "sleep-group-by",
  "cmd": "sleep 60",
  "instances": 3,
  "constraints": [["rack_id", "MAX_PER", "2"]]
}
```

## UNIQUE 算子
`UNIQUE` 不接受值。

`UNIQUE` 告诉 Marathon 在所有服务任务中执行唯一性属性。例如，以下限制确保每个主机上只有一个服务任务。

``` json
{
  "id": "sleep-unique",
  "cmd": "sleep 60",
  "instances": 3,
  "constraints": [["hostname", "UNIQUE"]]
}
```

## GROUP_BY 算子
**值**（可选）: 是一个整数，例如 `"3"`。

`GROUP_BY` 可用于在机架或数据中心之间均匀地分布任务，以实现高可用性。

``` json
{
  "id": "sleep-group-by",
  "cmd": "sleep 60",
  "instances": 3,
  "constraints": [["rack_id", "GROUP_BY"]]
}
```

Marathon 通过分析 Mesos 传入的邀请，仅知道属性的不同值（例如，“`rack_id`”）。如果任务尚未分散到所有可能的值，请指定限制中的值的数量。如果没有指定值的数量，就可能发现任务仅分配给了一个值，即使您正在使用 `GROUP_BY` 限制。例如，在 3 个机架上分散时，使用：

``` json
{
  "id": "sleep-group-by",
  "cmd": "sleep 60",
  "instances": 3,
  "constraints": [["rack_id", "GROUP_BY", "3"]]
}
```

## IS 算子

**值**（必填）：根据 [Mesos 属性和资源类型规范] 指定的 Mesos 标量或文本值(http://mesos.apache.org/documentation/latest/attributes-resources/#types):

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

#### 比较标量值

比较标量时，将值与最接近的千分位数进行比较（使用半偶舍入法）。

假设节点的属性为“级别：0.8”，则匹配以下限制：

``` json
[["level", "IS", "0.8"]]

[["level", "IS", "0.80"]]

[["level", "IS", "0.8001"]]
```
