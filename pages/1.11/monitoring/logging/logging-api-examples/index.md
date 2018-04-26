---
layout: layout.pug
navigationTitle:  Logging API Examples
title: Logging API Examples
menuWeight: 4
excerpt: Understanding the Logging API
beta: true
enterprise: false
---

<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->


Here are some common usage examples for the Logging API.

**Prerequisites:**

- [Bash](https://www.gnu.org/software/bash/)
- [Curl](https://curl.haxx.se/)
- [jq](https://stedolan.github.io/jq/)
- [DC/OS](/1.11/installing/oss/)
- [DC/OS CLI](/1.11/cli/) must be installed, configured, and logged in.
- Extract `DCOS_URL` and `DCOS_AUTH_TOKEN` from the DC/OS CLI:

    ```
    DCOS_URL="$(dcos config show core.dcos_url)"
    DCOS_URL="${DCOS_URL%/}" # strip trailing slash, if present
    DCOS_AUTH_TOKEN="$(dcos config show core.dcos_acs_token)"
    ```

# Node Logs

Get the last 100 journal entries from a single node:

```
curl -k -H "Authorization: token=${DCOS_AUTH_TOKEN}" "${DCOS_URL}/system/v1/logs/v1/range/?skip_prev=100"
```

# Component Logs

Get the last 100 journal entries from a single component service:

**Leading Mesos Master:**

```
curl -k -H "Authorization: token=${DCOS_AUTH_TOKEN}" "${DCOS_URL}/system/v1/leader/mesos/logs/v1/range/?skip_prev=100&filter=_SYSTEMD_UNIT:dcos-mesos-master.service"
```

**Leading Marathon:**

```
curl -k -H "Authorization: token=${DCOS_AUTH_TOKEN}" "${DCOS_URL}/system/v1/leader/marathon/logs/v1/range/?skip_prev=100&filter=_SYSTEMD_UNIT:dcos-mesos-master.service"
```

**Agent DNS Forwarder (Spartan):**

```
# select an agent ID
AGENT_ID="$(dcos node --json | jq -r '.[0].id)')"
curl -k -H "Authorization: token=${DCOS_AUTH_TOKEN}" "${DCOS_URL}/system/v1/agent/${AGENT_ID}/logs/v1/range/?skip_prev=1&filter=_SYSTEMD_UNIT:dcos-spartan.service"
```

# Container Logs

**Important:**
The following example requires journald task logging, which by default is [disabled](/1.11/monitoring/logging/logging-api/#compatibility).

Get the last 100 journal entries from a single service container:

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

# Tail

Get the last 10 journal entries and follow new events:

```
curl -k -H "Authorization: token=${DCOS_AUTH_TOKEN}" "${DCOS_URL}/system/v1/logs/v1/stream/?skip_prev=10"
```

# Range

Skip 100 entries from the beginning of the journal and return the next 10 entries:

```
curl -k -H "Authorization: token=${DCOS_AUTH_TOKEN}" "${DCOS_URL}/system/v1/logs/v1/range/?skip_next=100&limit=10"
```

# Plain Text

Skip 200 entries from the beginning of the journal and return the next entry in plain text:

```
curl -k -H "Accept: text/plain" -H "Authorization: token=${DCOS_AUTH_TOKEN}" "${DCOS_URL}/system/v1/logs/v1/range/?skip_next=200&limit=1"
```

# JSON

Skip 200 entries from the beginning of the journal and return the next entry in JSON:

```
curl -k -H "Accept: application/json" -H "Authorization: token=${DCOS_AUTH_TOKEN}" "${DCOS_URL}/system/v1/logs/v1/range/?skip_next=200&limit=1"
```

# Event Stream

Skip 200 entries from the beginning of the journal and return the next entry as an event stream:

```
curl -k -H "Accept: text/event-stream" -H "Authorization: token=${DCOS_AUTH_TOKEN}" "${DCOS_URL}/system/v1/logs/v1/range/?skip_next=200&limit=1"
```

# Event Stream Cursor

Get all journal entries after a specific cursor and stream new entries:

```
# Get the 10th line in json and parse its cursor
CURSOR="$(curl -k -H "Accept: application/json" -H "Authorization: token=${DCOS_AUTH_TOKEN}" "${DCOS_URL}/system/v1/logs/v1/range/?skip_next=9&limit=1" | jq -r ".cursor")"

# Follow the stream in plain text starting at the 11th line using the cursor
curl -k -H "Authorization: token=${DCOS_AUTH_TOKEN}" "${DCOS_URL}/system/v1/logs/v1/stream/" --get --data-urlencode "cursor=${CURSOR}"
```

The cursor must be URL encoded.

# Range Cursor

Get 1,000 journal entries, 100 at a time:

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

Each call uses the cursor of the last entry from the previous call. The cursor must be URL encoded.
