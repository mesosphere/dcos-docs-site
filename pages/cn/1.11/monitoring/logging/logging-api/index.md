---
layout: layout.pug
navigationTitle: 日志记录 API
title: 日志记录 API
menuWeight: 3
excerpt: 使用日志记录 API
beta: false
enterprise: false
---


日志记录 API 揭示节点、组件和容器（任务）日志。

日志记录 API 由 [DC/OS 日志组件](/cn/1.11/overview/architecture/components/#dcos-log 支持)，后者在集群中的所有节点上运行。有关使用日志记录 API 的更多信息，请参阅 [日志记录](/cn/1.11/monitoring/logging/index.md)。关于使用示例，请参阅 [日志记录 API 示例](/cn/1.11/monitoring/logging/logging-api-examples/index.md)。

# 兼容性

对于 DC/OS 1.11，日志记录 API 已有重大更新。


## DC/OS 1.11 的日志记录新功能

在 1.11 之前的 DC/OS 版本中，任务日志可通过 [文件 API](http://mesos.apache.org/documentation/latest/endpoints/#files-1) 获得。现在，您可以利用*组件和任务日志*的综合 API。

## 上一版本注释

在 1.11 之前的 DC/OS 版本中，节点和组件日志由 `journald` 管理。不过，由于 [journald 性能问题](https://github.com/systemd/systemd/issues/5102)，[Mesos 任务 journald 日志槽已被禁用](https://github.com/dcos/dcos/pull/1269)。因此，只能通过 [Mesos 任务沙盒文件 API](http://mesos.apache.org/documentation/latest/sandbox/) 来访问旧版本的容器日志文件。

以下代码可能有用：

```
FRAMEWORK_NAME="marathon"
APP_ID="nginx"

# get the mesos task state json
MESOS_STATE="$(curl -k -H "Authorization: token=${DCOS_AUTH_TOKEN}" ${DCOS_URL}/mesos/state)"
TASK_STATE="$(echo "${MESOS_STATE}" | jq ".frameworks[] | select(.name == \"${FRAMEWORK_NAME}\") | .tasks[] | select(.name == \"${APP_ID}\")")"

# extract values from the task json
AGENT_ID="$(echo "${TASK_STATE}" | jq -r '.slave_id')"
TASK_ID="$(echo "${TASK_STATE}" | jq -r '.id')"
FRAMEWORK_ID="$(echo "${TASK_STATE}" | jq -r '.framework_id')"
EXECUTOR_ID="$(echo "${TASK_STATE}" | jq -r '.executor_id')"
CONTAINER_ID="$(echo "${TASK_STATE}" | jq -r '.statuses[0].container_status.container_id.value')"

# default to container ID when executor ID is empty
EXECUTOR_ID="${EXECUTOR_ID:-${TASK_ID}}"

# Using Mesos API, agent/files endpoint
curl -k -H "Authorization: token=${DCOS_AUTH_TOKEN}" "${DCOS_URL}/agent/${AGENT_ID}/files/read?path=/var/lib/mesos/slave/slaves/${AGENT_ID}/frameworks/${FRAMEWORK_ID}/executors/${EXECUTOR_ID}/runs/${CONTAINER_ID}/stdout&offset=0&length=50000"
```

<a name="routes"></a>
# 路由

访问日志记录 API 是通过每个节点上使用以下路由的 Admin Router 代理的：

```
/system/v1/logs/
```

代理节点的日志记录 API 访问是根据 `{agent_id}`，通过管理节点代理到适当代理节点的：

```
/system/v1/agent/{agent_id}/
```

要确定集群的地址，请参阅 [集群访问](/cn/1.11/api/access/)。


## 发现端点

服务于任务日志的管理节点路由也被称为*'发现端点'*。用户对发现端点进行 GET 请求时，用户被重定向到具有所需端点的代理节点。

请求中使用的参数来自 Mesos `state.json`，被称为“任务元数据”。


# 认证

所有日志记录 API 路由均需要认证才能使用。要验证 API 请求，请参阅 [获取认证令牌](/cn/1.11/security/ent/iam-api/#/obtaining-an-authentication-token/) 和 [传递认证令牌](/cn/1.11/security/ent/iam-api/#/passing-an-authentication-token/)。

日志记录 API 还需要通过以下权限授权：
| 路径 | 权限 |
| :---  | :---        |
| /system/v1/logs/v2/ | dcos:adminrouter:ops:system-logs |
| /system/v1/agent/{agent_id}/logs/v2/ | dcos:adminrouter:system:agent |

用户也可以通过 dcos:superuser 权限来到达所有路由。要为您的账户分配权限，请参阅 [权限名称](/cn/1.11/security/ent/perms-reference/)。

# 格式

API 请求标题可以是以下任何一项：

- 文本格式的 `text/plain`、`text/html` 、`*/*` 请求日志，以 `\n` 结束。
- JSON 格式的 `application/json` 请求日志。
- 服务器发送事件格式的 `text/event-stream` 请求日志。

DC/OS 日志记录遵循 [服务器发送事件规范](https://www.w3.org/TR/2009/WD-eventsource-20090421/)。如果客户端指定了 SSE 规范中所定义的请求标题 Last-Event-ID（最后一个事件的 ID），则它支持从特定光标位置读取日志条目。SSE 格式的每个日志条目都包含带有令牌 ID 的 ID：<token>这可以让客户端知道当前日志条目，让您能够在它被中断时恢复日志消耗。

# 资源

 [上述路由](#routes) 均提供以下资源：

 [swagger api='/1.11/api/logs2.yaml']
