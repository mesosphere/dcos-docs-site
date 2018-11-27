---
layout: layout.pug
navigationTitle: 日志记录 API 示例
title: 日志记录 API 示例
menuWeight: 4
excerpt: 日志记录 API 示例
beta: true
enterprise: false
---

以下是日志记录 API 的一些常见使用示例。

**前提条件：**

- [Bash](https://www.gnu.org/software/bash/)
- [Curl](https://curl.haxx.se/)
- [jq](https://stedolan.github.io/jq/)
- [DC/OS](/cn/1.11/installing/)
- 必须安装、配置和登录 [DC/OS CLI](/cn/1.11/cli/)。
- 从 DC/OS CLI 提取 `DCOS_URL` 和 `DCOS_AUTH_TOKEN`：

    ```
    DCOS_URL="$(dcos config show core.dcos_url)"
    DCOS_URL="${DCOS_URL%/}" # strip trailing slash, if present
    DCOS_AUTH_TOKEN="$(dcos config show core.dcos_acs_token)"
    ```

# 节点日志

从单个节点获取最后 100 个日志条目：

```
curl -k -H "Authorization: token=${DCOS_AUTH_TOKEN}" "${DCOS_URL}/system/v1/logs/v1/range/?skip_prev=100"
```

# 组件日志

从单个组件服务获取最后 100 个日志条目：

**领导 Mesos 管理节点：**

```
curl -k -H "Authorization: token=${DCOS_AUTH_TOKEN}" "${DCOS_URL}/system/v1/leader/mesos/logs/v1/range/?skip_prev=100&filter=_SYSTEMD_UNIT:dcos-mesos-master.service"
```

**领导 Marathon：**

```
curl -k -H "Authorization: token=${DCOS_AUTH_TOKEN}" "${DCOS_URL}/system/v1/leader/marathon/logs/v1/range/?skip_prev=100&filter=_SYSTEMD_UNIT:dcos-mesos-master.service"
```

**代理 DNS 转发器 (Spartan)：**

```
# select an agent ID
AGENT_ID="$(dcos node --json | jq -r '.[0].id)')"
curl -k -H "Authorization: token=${DCOS_AUTH_TOKEN}" "${DCOS_URL}/system/v1/agent/${AGENT_ID}/logs/v1/range/?skip_prev=1&filter=_SYSTEMD_UNIT:dcos-spartan.service"
```

# 容器日志


<table class=“table” bgcolor=#858585>
<tr> 
  <td align=justify style=color:white><strong>重要信息：</strong>以下示例需要进行 journald 任务日志记录，它默认为 <a href="/1.11/monitoring/logging/logging-api/#compatibility">禁用</a>。
  </td> 
</tr> 
</table>

从单个组件容器获取最后 100 个日志条目：

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

# get container/task logs
curl -k -H "Authorization: token=${DCOS_AUTH_TOKEN}" "${DCOS_URL}/system/v1/agent/${AGENT_ID}/logs/v1/range/framework/${FRAMEWORK_ID}/executor/${EXECUTOR_ID}/container/${CONTAINER_ID}?skip_prev=100"
```

# 结尾

获取最后 10 个日记账条目并追踪新事件：

```
curl -k -H "Authorization: token=${DCOS_AUTH_TOKEN}" "${DCOS_URL}/system/v1/logs/v1/stream/?skip_prev=10"
```

# 范围

从日志开头跳过 100 个条目，并返回接下来的 10 个条目：

```
curl -k -H "Authorization: token=${DCOS_AUTH_TOKEN}" "${DCOS_URL}/system/v1/logs/v1/range/?skip_next=100&limit=10"
```

# 纯文本

从日志开头跳过 200 个条目，并以纯文本返回下一个条目：

```
curl -k -H "Accept: text/plain" -H "Authorization: token=${DCOS_AUTH_TOKEN}" "${DCOS_URL}/system/v1/logs/v1/range/?skip_next=200&limit=1"
```

# JSON

从日志开头跳过 200 个条目，并以 JSON 返回下一个条目：

```
curl -k -H "Accept: application/json" -H "Authorization: token=${DCOS_AUTH_TOKEN}" "${DCOS_URL}/system/v1/logs/v1/range/?skip_next=200&limit=1"
```

# 事件流

从日志开头跳过 200 个条目，并返回作为事件流的下一个条目：

```
curl -k -H "Accept: text/event-stream" -H "Authorization: token=${DCOS_AUTH_TOKEN}" "${DCOS_URL}/system/v1/logs/v1/range/?skip_next=200&limit=1"
```

# 事件流游标

获取特定游标后的所有日志条目并流式传输新条目：

```
# Get the 10th line in json and parse its cursor
CURSOR="$(curl -k -H "Accept: application/json" -H "Authorization: token=${DCOS_AUTH_TOKEN}" "${DCOS_URL}/system/v1/logs/v1/range/?skip_next=9&limit=1" | jq -r ".cursor")"

# Follow the stream in plain text starting at the 11th line using the cursor
curl -k -H "Authorization: token=${DCOS_AUTH_TOKEN}" "${DCOS_URL}/system/v1/logs/v1/stream/" --get --data-urlencode "cursor=${CURSOR}"
```

游标必须为 URL 编码。

# 范围游标

获取 1,000 个日志条目，每次 100 个：

```
TIMES=10 # number of times to call the endpoint
LINES=100 # number of log lines to retrieve per call
CURSOR="" # first call uses an empty cursor to start from the beginning
for i in $(seq 1 ${TIMES}); do
  BUFFER="$(curl -k -H "Accept: application/json" -H "Authorization: token=${DCOS_AUTH_TOKEN}" "${DCOS_URL}/system/v1/logs/v1/range/?limit=${LINES}" --get --data-urlencode "cursor=${CURSOR}")"
  echo "${BUFFER}"
  CURSOR="$(echo "${BUFFER}" | jq -r ".cursor" | tail -1)"
done
```

每次调用都使用上次调用中最后一个条目的光标。游标必须为 URL 编码。
