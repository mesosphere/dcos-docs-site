---
layout: layout.pug
navigationTitle:  dcos marathon app show
title: dcos marathon app show
menuWeight: 6
excerpt: 查看应用程序的 JSON 文件

enterprise: false
---

# 说明

`dcos marathon app show command` 显示应用程序的 `marathon.json` 文件。

# 使用

```bash
dcos marathon app show [--app-version=<app-version>] <app-id>
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `-h`，`--help` | 显示有关此命令用法的信息。 |
| `--app-version=<app-version>` | 要使用的应用程序版本。可以指定为绝对值或相对值。绝对值必须为 ISO8601 日期格式。相对值必须指定为负整数，表示当前部署的应用定义中的版本。|

## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `<app-id>` | 应用程序 ID。您可以使用 `dcos marathon app list` 命令查看应用程序 ID 列表。|



# 示例

```json
dcos marathon app show spark
{
  "backoffFactor": 1.15,
  "backoffSeconds": 1,
  "cmd": "/sbin/init.sh",
  "container": {
    "docker": {
      "forcePullImage": true,
      "image": "mesosphere/spark:2.7.0-2.4.0-hadoop-2.7",
      "parameters": [
        {
          "key": "user",
          "value": "nobody"
        }
      ],
      "privileged": false
    },
    "type": "DOCKER",
    "volumes": []
  },
  "cpus": 1,
  "deployments": [],
  "disk": 0,
  "env": {
    "DCOS_SERVICE_NAME": "spark",
    "SPARK_DISPATCHER_MESOS_PRINCIPAL": "",
    "SPARK_DISPATCHER_MESOS_ROLE": "*",
    "SPARK_DISPATCHER_MESOS_SECRET": "",
    "SPARK_HDFS_CONFIG_URL": "",
    "SPARK_LOG_LEVEL": "INFO",
    "SPARK_USER": "nobody"
  },
  "executor": "",
  "gpus": 0,
  "healthChecks": [
    {
      "delaySeconds": 15,
      "gracePeriodSeconds": 5,
      "intervalSeconds": 60,
      "ipProtocol": "IPv4",
      "maxConsecutiveFailures": 3,
      "path": "/",
      "portIndex": 2,
      "protocol": "MESOS_HTTP",
      "timeoutSeconds": 10
    }
  ],
  "id": "/spark",
  "instances": 1,
  "killSelection": "YOUNGEST_FIRST",
  "labels": {
    "DCOS_PACKAGE_DEFINITION": "eyJtZXRhZGF0YSI6eyJDb250ZW50LVR5cGUiOiJhcHBs...Fc0hFd25LbWFXVzRTd3lRV3daN3BOeVNzckcybWUvRFFKYVlQOFBFczd6V3JSQkFBQT0ifQ==",
    "DCOS_PACKAGE_FRAMEWORK_NAME": "spark",
    "DCOS_PACKAGE_METADATA": "eyJwYWNrYWdpbmdWZXJzaW9uIjoiNC4wIiwibmFtZSI6...9hc3NldHMvaWNvbi1zZXJ2aWNlLXNwYXJrLWxhcmdlLnBuZyJ9fQ==",
    "DCOS_PACKAGE_NAME": "spark",
    "DCOS_PACKAGE_OPTIONS": "eyJzZXJ2aWNlIjp7Im5hbWUiOiJzcGFyayIsIm...2RjIjp7fSwia3JiNWNvbmYiOiIifX0sImhkZnMiOnt9fQ==",
    "DCOS_PACKAGE_SOURCE": "https://universe.mesosphere.com/repo",
    "DCOS_PACKAGE_VERSION": "2.7.0-2.4.0",
    "DCOS_SERVICE_NAME": "spark",
    "DCOS_SERVICE_PORT_INDEX": "2",
    "DCOS_SERVICE_SCHEME": "http",
    "SPARK_URI": ""
  },
  "maxLaunchDelaySeconds": 3600,
  "mem": 1024,
  "networks": [
    {
      "mode": "host"
    }
  ],
  "portDefinitions": [
    {
      "labels": {
        "VIP_0": "dispatcher.spark:7077"
      },
      "name": "dispatcher",
      "port": 10000,
      "protocol": "tcp"
    },
    {
      "labels": {
        "VIP_1": "dispatcher.spark:4040"
      },
      "name": "dispatcher-ui",
      "port": 10001,
      "protocol": "tcp"
    },
    {
      "labels": {
        "VIP_2": "dispatcher.spark:80"
      },
      "name": "dispatcher-proxy",
      "port": 10002,
      "protocol": "tcp"
    }
  ],
  "requirePorts": false,
  "tasks": [
    {
      "appId": "/spark",
      "healthCheckResults": [
        {
          "alive": true,
          "consecutiveFailures": 0,
          "firstSuccess": "2019-03-18T19:20:52.376Z",
          "instanceId": "instance [spark.marathon-c0efd47d-49b2-11e9-b8cd-1aeaf266c008]",
          "lastSuccess": "2019-03-18T19:20:52.376Z"
        }
      ],
      "host": "10.0.2.221",
      "id": "spark.c0efd47d-49b2-11e9-b8cd-1aeaf266c008",
      "ipAddresses": [
        {
          "ipAddress": "10.0.2.221",
          "protocol": "IPv4"
        }
      ],
      "localVolumes": [],
      "ports": [
        21515,
        21516,
        21517
      ],
      "region": "aws/us-west-2",
      "servicePorts": [],
      "slaveId": "02b1bdc8-2bac-44a0-81ff-65816936b97b-S1",
      "stagedAt": "2019-03-18T19:19:30.217Z",
      "startedAt": "2019-03-18T19:20:37.127Z",
      "state": "TASK_RUNNING",
      "version": "2019-03-18T19:19:29.410Z",
      "zone": "aws/us-west-2a"
    }
  ],
  "tasksHealthy": 1,
  "tasksRunning": 1,
  "tasksStaged": 0,
  "tasksUnhealthy": 0,
  "unreachableStrategy": {
    "expungeAfterSeconds": 0,
    "inactiveAfterSeconds": 0
  },
  "upgradeStrategy": {
    "maximumOverCapacity": 0,
    "minimumHealthCapacity": 0
  },
  "user": "nobody",
  "version": "2019-03-18T19:19:29.410Z",
  "versionInfo": {
    "lastConfigChangeAt": "2019-03-18T19:19:29.410Z",
    "lastScalingAt": "2019-03-18T19:19:29.410Z"
  }
}
```

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos marathon](/cn/1.12/cli/command-reference/dcos-marathon/) | 将应用程序部署到 DC/OS 并对其进行管理。|