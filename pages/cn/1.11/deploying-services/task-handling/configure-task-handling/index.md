---
layout: layout.pug
navigationTitle: 配置任务处理
title: 配置任务处理
menuWeight: 0
excerpt: 为无法访问的任务配置 Marathon 

enterprise: false
---



可以为不可访问的任务配置 Marathon 操作。借助应用程序或 pod 定义的 `unreachableStrategy` 参数，可以通过以下两种方式配置：定义何时启动新任务实例，以及定义何时排除任务实例。

```json
"unreachableStrategy": {
	"inactiveAfterSeconds": "<integer>",
	"expungeAfterSeconds": "<integer>"
}
```

## 配置选项

- `inactiveAfterSeconds`：任务实例不可访问的时间超过该值，就会被标记为非活动，且新实例将启动。此时尚未排除不可访问的任务。该参数的最小值为 1。默认值为 300 秒。

- `expungeAfterSeconds`：实例不可访问的时间超过此值，就会被排除。被排除的任务一旦恢复就会被关闭。实例常常在被排除之前就被标记为无法访问，但并不一定会被标记。此参数必须大于 `unreachableInactiveAfterSeconds`。默认值为 600 秒。

可以将 `inactiveAfterSeconds` 和 `expungeAfterSeconds` 合在一起使用。例如，配置 `inactiveAfterSeconds = 60` 和 `expungeAfterSeconds = 120` 之后，实例超过 120 秒仍然不可访问即被排除，如果超过 60 秒仍然不可访问，就会启动第二个实例。

## 关闭选项
还可以定义关闭选项，声明 Marathon 在重新扩展或关闭多项任务时，首先关闭的是最新还是最旧的任务。此参数的默认值为 `YoungestFirst`。也可以指定 `OldestFirst`。

将 `killSelection` 参数添加到应用定义，或添加到 Pod 定义的 `PodSchedulingPolicy` 参数。

```json
{
    "killSelection": "YoungestFirst"
}
```

## 持久卷

在实例无法访问时间超过 7 天而被 Marathon 排除之后，拥有持久卷的应用程序的默认 `unreachableStrategy` 就会创建带有新卷的新实例并删除现有卷（尽可能）。

<table class=“table” bgcolor=#ffd000>
<tr> 
  <td align=justify style=“color:black><strong>警告：</strong>删除不可访问实例的现有卷时，可能会删除数据。</td> 
</tr> 
</table>

