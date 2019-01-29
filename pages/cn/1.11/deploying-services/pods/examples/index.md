---
layout: layout.pug
navigationTitle: Pod 示例
title: Pod 示例
menuWeight: 30
excerpt: 了解字段定义和 Pod 示例
enterprise: false
---


本专题提供 Pod 字段定义和使用示例。如需字段定义的详细信息，请参阅 [Marathon 配置参考](/cn/1.11/deploying-services/marathon-parameters/)。

# 带注释的简单 Pod 定义

这个名为 `simple-pod` 的 Pod 只有一个容器 `simpletask1`。容器展开镜像（`python:3.5.2-alpine`）并运行命令。<!-- validated by suzanne 6/23/17 -->

```json
{
   "id":"/simple-pod",
   "containers":[
      {
         "name":"simpletask1",
         "exec":{
            "command":{
               "shell":"env && sleep 10000"
            }
         },
         "resources":{
            "cpus":0.1,
            "mem":32
         },
         "image":{
            "kind":"DOCKER",
            "id":"python:3.5.2-alpine"
         }
      }
   ],
   "networks":[
      {
         "mode":"host"
      }
   ]
}
```

## 基本 Pod 字段

| 字段 | 类型 | 描述 |
|-----------------------|---------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|  `id` （必填） | 字符串 | Pod 唯一 ID。 |
|  `containers` （必填）| 阵列 | 参见 [pod 容器基础字段](#basic-pod-container-fields)。|
|  `volumes` | 阵列 | 与 Pod 关联的所有卷。 |
|  `volumes.name` | 字符串 | 共享卷的名称。 |
|  `volumes.host` | 字符串 | 代理上文件或目录的绝对路径，或者执行器沙箱中目录的相对路径。有助于映射代理上或执行器沙箱内存在的目录。 |
|  `networks` | 阵列 | 接受以下参数：`mode`、`name` 和 `labels`。|
|  `networks.mode` | 字符串 | 网络模式： `host` 或 `container`。 `host` 使用主机的网络命名空间。 `container` 使用虚拟网络，并且必须指定虚拟网络名称。 |
|  `networks:name` | 字符串 | `container` 网络模式必填。 |
|  `networks.labels` | 对象 | 密钥/值对（即，将元数据传递到 Mesos 模块）。|
|  `scaling` | 阵列 | 接受以下参数：`kind`、`instances` 和 `maxInstances`。|
|  `scaling.kind` | 字符串 | 扩展类型。当前仅支持 `fixed`。 |
|  `scaling.instances` | 整数 | pod 实例的初始数量（默认值：1）。|
|  `scaling.maxInstances` | 整数 | 此 pod 的最大实例数。 |

<a name="basic-pod-container-fields"></a>
## 基本 Pod 容器字段

| 字段 | 类型 | 描述 |
|--------------------------|---------|------------------------------------------------------------------------------------------------------------|
|  `containers` （必填） | 阵列 | 所有属于 pod 的容器的定义。 |
|  `containers.name` | 字符串 | 容器的唯一名称。 |
|  `containers.exec` | 对象 | 接受 `command` 参数。 |
|  `containers.exec.command` | 对象 | Mesos 执行的命令。 |
|  `containers.exec.command.shell` | 字符串 | 要执行的命令。如果使用容器进入点，请使用空字符串。|
|  `containers.exec.overrideEntrypoint` | 布尔值 | 如果提供 `command`，将该值默示设置为 `true`。要使用默认进入点，则设置为 `false`。|
|  `containers:resources` （必填）| 对象 | 资源的容器配置。 |
|  `containers.resources.cpus` | 数字 | CPU 共享（默认值：1.0）。|
|  `containers.resources.mem` | 数字 | 以 MiB 计算的内存资源（默认值：128）。|
|  `containers.resources.disk` | 双倍 | 以 MiB 计算的磁盘资源（默认值：128）。|
|  `containers.resources.gpus` | 整数 | GPU 资源（默认值：0）。|
|  `containers.image` | 对象 | 如果省略 `image`，就使用 Mesos containerizer。|
|  `containers.image.kind` | 字符串 | 容器镜像格式（`DOCKER` 或 `APPC`）。 |
|  `containers.image.id` | 字符串 | 容器镜像标签。 |
|  `containers.image.forcePull` | 布尔值 | 设置为 true 即可始终拉取镜像（默认值：假）。|
|  `containers.volumeMounts` | 阵列 | 接受以下参数：`name` 和 `mountPath`。 |
|  `containers.volumeMounts.name` | 字符串 | 共享卷的名称（必须是在 pod 层定义的有效卷）。|
|  `containers.volumeMounts.mountPath` | 字符串 | 挂载卷的容器路径。 |
|  `containers.endpoints` | 阵列 | 对象阵列。 |
|  `containers.endpoints.name` | 字符串 | 端口的唯一名称。 |
|  `containers.endpoints.containerPort` | 数字 | 容器任务正在侦听的容器点。如果网络模式为 `container`，则必填。 |
|  `containers.endpoints.hostPort` | 数字 | 主机上的映射端口。如果设置为 `0`，Marathon 就会灵活分配端口。 |
|  `containers.endpoints.protocol` | 阵列 | 端口协议（`tcp` 或 `http` ）。|
|  `containers.endpoints.labels` | 对象 | 元数据作为密钥/值对。 |

<a name="multi-pod"></a>
# 带注释的多个 Pod 及所有参数

下面的示例显示了一个 pod（`test-pod`），以及三个容器（ `healthtask1`、 `healthtask2`、和 `clienttask`）。Pod 使用共享卷和本地 DC/OS 虚拟网络解决方案。

```json
{
   "id":"/test-pod",
   "labels":{
      "pod_label":"pod"
   },
   "environment":{
      "POD_ENV":"pod"
   },
   "containers":[
      {
         "name":"healthtask1",
         "exec":{
            "command":{
               "shell":"./read-write-server.py 8080 mount1/test-file.txt"
            }
         },
         "resources":{
            "cpus":0.1,
            "mem":32,
            "disk":32,
            "gpus":0
         },
         "endpoints":[
            {
               "name":"httpendpoint",
               "containerPort":8080,
               "hostPort":0,
               "protocol":[
                  "tcp"
               ],
               "labels":{
                  "ep1_label":"ep1"
               }
            }
         ],
         "image":{
            "kind":"DOCKER",
            "id":"python:3.5.2-alpine"
         },
         "environment":{
            "C1_ENV":"c1"
         },
         "healthCheck":{
            "http":{
               "endpoint":"httpendpoint",
               "path":"/ping",
               "scheme":"HTTP"
            },
            "gracePeriodSeconds":30,
            "intervalSeconds":5,
            "maxConsecutiveFailures":3,
            "timeoutSeconds":3,
            "delaySeconds":2
         },
         "volumeMounts":[
            {
               "name":"sharedvolume",
               "mountPath":"mount1"
            }
         ],
         "artifacts":[
            {
               "uri":"https://s3-us-west-2.amazonaws.com/mesos-soak-cluster/read-write-server.py",
               "extract":false,
               "executable":true,
               "cache":true,
               "destPath":"read-write-server.py"
            }
         ],
         "labels":{
            "c1_label":"c1"
         }
      },
      {
         "name":"healthtask2",
         "exec":{
            "command":{
               "shell":"./read-write-server.py 8081 mount2/test-file.txt"
            }
         },
         "resources":{
            "cpus":0.1,
            "mem":32,
            "disk":32,
            "gpus":0
         },
         "endpoints":[
            {
               "name":"httpendpoint2",
               "containerPort":8081,
               "hostPort":0,
               "protocol":[
                  "tcp"
               ],
               "labels":{
                  "ep2_label":"ep2"
               }
            }
         ],
         "image":{
            "kind":"DOCKER",
            "id":"python:3.5.2-alpine"
         },
         "environment":{
            "C2_ENV":"c2"
         },
         "healthCheck":{
            "http":{
               "endpoint":"httpendpoint2",
               "path":"/ping",
               "scheme":"HTTP"
            },
            "gracePeriodSeconds":30,
            "intervalSeconds":5,
            "maxConsecutiveFailures":3,
            "timeoutSeconds":3,
            "delaySeconds":2
         },
         "volumeMounts":[
            {
               "name":"sharedvolume",
               "mountPath":"mount2"
            }
         ],
         "artifacts":[
            {
               "uri":"https://s3-us-west-2.amazonaws.com/mesos-soak-cluster/read-write-server.py",
               "extract":false,
               "executable":true,
               "cache":true,
               "destPath":"read-write-server.py"
            }
         ],
         "labels":{
            "c2_label":"c2"
         }
      },
      {
         "name":"clienttask",
         "exec":{
            "command":{
               "shell":"while true; do sleep 5 && curl -X GET localhost:8080/write && curl -X GET localhost:8081/read; done"
            }
         },
         "resources":{
            "cpus":0.1,
            "mem":32,
            "disk":32,
            "gpus":0
         },
         "endpoints":[

         ],
         "environment":{
            "C3_ENV":"c3"
         },
         "volumeMounts":[

         ],
         "artifacts":[

         ],
         "labels":{
            "c3_label":"c3"
         }
      }
   ],
   "secrets":{

   },
   "volumes":[
      {
         "name":"sharedvolume"
      }
   ],
   "networks":[
      {
         "name":"dcos",
         "mode":"container",
         "labels":{
            "net_label":"net"
         }
      }
   ],
   "scaling":{
      "kind":"fixed",
      "instances":1,
      "maxInstances":null
   },
   "scheduling":{
      "backoff":{
         "backoff":1,
         "backoffFactor":1.15,
         "maxLaunchDelay":3600
      },
      "upgrade":{
         "minimumHealthCapacity":1,
         "maximumOverCapacity":1
      },
      "placement":{
         "constraints":[

         ],
         "acceptedResourceRoles":[

         ]
      },
      "killSelection":"YOUNGEST_FIRST",
      "unreachableStrategy":{
         "inactiveAfterSeconds":900,
         "expungeAfterSeconds":604800
      }
   },
   "executorResources":{
      "cpus":0.1,
      "mem":32,
      "disk":10
   }
}
```

## 其他 Pod 字段

| 字段 | 类型 | 描述 |
|-----------------------------|----------|--------------------------------------------------------------------------------------------------------------------------------|
|  `labels` | 对象 | Pod 元数据作为密钥/值对。 |
|  `environment` | 对象 | pod 级别的环境变量。所有 pod 容器都将继承这些环境变量。必须大写。 |
|  `secrets` | 对象 | 存储库中的密钥的完全符合要求的路径。 |
|  `scheduling` | 对象 | 定义故障应用程序的指数退避行为，防止沙盒填满。 |
|  `scheduling.backoff` | 数字 | 启动实例失败时应用的初始退避（秒）（默认值：1）。|
|  `scheduling.backoffFactor` | 数字 | 应用于当前退避的因数，可确定新的退避（默认值：1.15）。|
|  `scheduling.maxLaunchDelay` | 数字 | 检测到后续故障时应用的最大退避（秒）（默认值：3600）。|
|  `scheduling.unreachableStrategy` | 字符串或对象 | 定义不可访问实例的处理。 |
|  `scheduling.unreachableStrategy.inactiveAfterSeconds` | 数字 | 实例被标记为非活动后无法访问的时长。 |
|  `scheduling.unreachableStrategy.expungeAfterSeconds` | 数字 | 实例被排除后无法访问的时长。 |
|  `scheduling.upgrade` | 对象 | 控制 pod 更新的升级策略。 |
|  `scheduling.upgrade.minimumHealthCapacity` | 数字 | 介于 0 和 1 之间的数字，表示在升级期间保持的最少运行良好的节点数量（默认值：1）。|
|  `scheduling.upgrade.maximumOverCapacity` | 数字 | 0 至 1 之间的数字，表示升级期间启动的最大附加实例数（默认值：1）。|
|  `placement` | 对象 | 控制 pod 任务的放置。 |
|  `placement.constraints` | 字符串[] | 约束控制 pod 任务的布局策略。选项：`UNIQUE`、`CLUSTER`、`GROUP_BY`、`LIKE`、`UNLIKE`、`MAX_PER`。|
|  `placement.acceptedResourceRoles` | 字符串[] | 资源角色列表。Marathon 组件只会考虑在此列表中列出角色，为此 Pod 的任务提供的资源邀请。 |
|  `killSelection` | 字符串 | 定义应用程序处于过度调配状态时首先被关闭的实例。选项：`YOUNGEST_FIRST`、`OLDEST_FIRST`。 |
|  `unreachableStrategy` |  代理从管理节点分区后的行为 |
|  `killSelection.inactiveAfterSeconds` | 整数 | 替换任务前等待的时间（秒）（默认值：900）。|
|  `killSelection.expungeAfterSeconds` | 整数 | 在排除前等待任务恢复的时间（秒）（默认值：603800）。|
|  `executorResources` | 对象 | 为 Pod 执行器保留的资源。 |
|  `executorResources.cpus` | 数字 | CPU 共享（默认值：0.1）。|
|  `executorResources.mem` | 数字 | 以 MiB 计算的内存资源（默认值：32）。|
|  `executorResources.disk` | 数字 | 以 MiB 计算的磁盘资源（默认值：10.0），|

## 其他 Pod 容器字段

| 字段 | 类型 | 描述 |
|------------------------------|---------|-------------------------------------------------------------------------------------------------------------------------|
|  `labels` | 对象 | 作为密钥/值对的容器元数据。 |
|  `environment` | 对象 | 容器环境变量。可覆盖 pod 环境变量。必须大写。 |
|  `healthCheck` | 对象 | 接受以下参数: `http`、`tcp` 和 `exec`。|
|  `healthCheck.http` | | 协议类型。选项：`http`、`tcp`、 `exec`。 |
|  `healthCheck.http.endpoint` | 字符串 | 要使用的端点名称。 |
|  `healthCheck.http.path` | 字符串 | 由提供运行状态的任务披露的端点路径。 |
|  `healthCheck.http.scheme` | 字符串 | 对于 httpHealthCheck，使用 `http`。|
|  `healthCheck.gracePeriodSeconds` | 整数 | 忽略运行状况检查失败距离第一次启动任务，或距离任务初次显示运行良好的时间间隔（默认值：300）。|
|  `healthCheck.intervalSeconds` | 整数 | 运行状况检查时间间隔（默认值：60）。|
|  `healthCheck.maxConsecutiveFailures` | 整数 | 任务被关闭之前连续故障的次数（默认值：3）。|
|  `healthCheck.timeoutSeconds` | 整数 | 等待运行状况检查完成的时间（默认值：20）。|
|  `healthCheck.delaySeconds` | 整数 | 开始运行状况检查之前等待的时间（默认值：2）。|
|  `artifacts` | 阵列 | 工件对象阵列 |
|  `healthCheck.uri` | 字符串 | 要下载资源的 URI（即 `.tgz`、 `tar.gz`、`.zip`、`.txz`、等）。|
|  `healthCheck.extract` | 布尔值 | 提取抓取工件。 |
|  `healthCheck.executable` | 布尔值 | 将抓取的工件设置为可执行。 |
|  `healthCheck.cache` | 布尔值 | 缓存抓取的工件。 |
|  `healthCheck.destPath` | 字符串 | 工件的目标路径。 |

# 带有多个容器的 Pod

以下 pod 定义指定了带有 3 个容器的 pod。<!-- Validated by suzanne 6-23-17 -->

```json
{
   "id":"/pod-with-multiple-containers",
   "version":"2017-01-03T18:21:19.31Z",
   "containers":[
      {
         "name":"sleep1",
         "exec":{
            "command":{
               "shell":"sleep 1000"
            }
         },
         "resources":{
            "cpus":0.01,
            "mem":32,
            "disk":0,
            "gpus":0
         }
      },
      {
         "name":"sleep2",
         "exec":{
            "command":{
               "shell":"sleep 1000"
            }
         },
         "resources":{
            "cpus":0.01,
            "mem":32,
            "disk":0,
            "gpus":0
         }
      },
      {
         "name":"sleep3",
         "exec":{
            "command":{
               "shell":"sleep 1000"
            }
         },
         "resources":{
            "cpus":0.01,
            "mem":32,
            "disk":0,
            "gpus":0
         }
      }
   ],
   "networks":[
      {
         "mode":"host"
      }
   ],
   "scaling":{
      "kind":"fixed",
      "instances":10,
      "maxInstances":null
   },
   "scheduling":{
      "backoff":{
         "backoff":1,
         "backoffFactor":1.15,
         "maxLaunchDelay":3600
      },
      "upgrade":{
         "minimumHealthCapacity":1,
         "maximumOverCapacity":1
      },
      "killSelection":"Youngest_First",
      "unreachableStrategy":{
         "inactiveAfterSeconds":900,
         "expungeAfterSeconds":604800
      }
   },
   "executorResources":{
      "cpus":0.1,
      "mem":32,
      "disk":10
   }
}
```

# 使用临时卷的 Pod

以下 pod 定义指定了称为 `v1` 的临时卷。<!-- Validated by suzanne 6-23-17 -->

```json
{
  "id": "/with-ephemeral-vol",
  "version": "2017-01-03T17:36:39.389Z",
  "containers": [
    {
      "name": "ct1",
      "exec": {
        "command": {
          "shell": "while true; do echo the current time is $(date) > ./jdef-v1/clock; sleep 1; done"
        }
      },
      "resources": {
        "cpus": 0.1,
        "mem": 32,
        "disk": 0,
        "gpus": 0
      },
      "volumeMounts": [
        {
          "name": "v1",
          "mountPath": "jdef-v1"
        }
      ]
    },
    {
      "name": "ct2",
      "exec": {
        "command": {
          "shell": "while true; do cat ./etc/clock; sleep 1; done"
        }
      },
      "resources": {
        "cpus": 0.1,
        "mem": 32,
        "disk": 0,
        "gpus": 0
      },
      "volumeMounts": [
        {
          "name": "v1",
          "mountPath": "etc"
        }
      ]
    }
  ],
  "volumes": [
    {
      "name": "v1"
    }
  ],
  "networks": [
    {
      "mode": "host"
    }
  ],
  "scaling": {
    "kind": "fixed",
    "instances": 1,
    "maxInstances": null
  },
  "scheduling": {
    "backoff": {
      "backoff": 1,
      "backoffFactor": 1.15,
      "maxLaunchDelay": 3600
    },
    "upgrade": {
      "minimumHealthCapacity": 1,
      "maximumOverCapacity": 1
    },
    "killSelection": "Youngest_First",
    "unreachableStrategy": {
      "inactiveAfterSeconds": 900,
      "expungeAfterSeconds": 604800
    }
  },
  "executorResources": {
    "cpus": 0.1,
    "mem": 32,
    "disk": 10
  }
}
```

# 使用持久卷的 Pod

如需查看使用持久卷的 pod 的示例，请参见 [创建具有本地持久卷的 pod](/cn/1.11/storage/persistent-volume/#create-a-pod-with-a-local-persistent-volume)。

## 各 Pod 的 IP 网络

以下 pod 定义指定名为 `dcos` 的虚拟（用户）网络。`networks:mode:container` 字段创建虚拟网络。`name` 字段为可选。如果您已使用 [我们的 AWS 模板](/cn/1.11/installing/evaluation/cloud-installation/aws/)安装 DC/OS，则默认虚拟网络名称为 `dcos`。<!-- Validated by suzanne 6-23-17 -->

```json
{
   "id":"/pod-with-virtual-network",
   "scaling":{
      "kind":"fixed",
      "instances":1
   },
   "containers":[
      {
         "name":"sleep1",
         "exec":{
            "command":{
               "shell":"sleep 1000"
            }
         },
         "resources":{
            "cpus":0.1,
            "mem":32
         }
      }
   ],
   "networks":[
      {
         "mode":"container",
         "name":"dcos"
      }
   ]
}
```

此 pod 声明端口 80 的侦听“web”端点。<!-- Validated by suzanne 6-23-17 -->

```json
{
   "id":"/pod-with-endpoint",
   "containers":[
      {
         "name":"simple-docker",
         "resources":{
            "cpus":1,
            "mem":128,
            "disk":0,
            "gpus":0
         },
         "image":{
            "kind":"DOCKER",
            "id":"nginx"
         },
         "endpoints":[
            {
               "name":"web",
               "containerPort":80,
               "protocol":[
                  "http"
               ]
            }
         ]
      }
   ],
   "networks":[
      {
         "mode":"container"
      }
   ]
}
```

此 pod 添加引用了 `web` 端点的运行状况检查。Mesos 将根据 `<container_ip>:80` 执行 HTTP 请求。如果 Mesos 收到 HTTP 200 响应，则会通过运行状况检查。
<!-- validated by suzanne 6-23-17 -->
```json
{
   "id":"/pod-with-healthcheck",
   "containers":[
      {
         "name":"simple-docker",
         "resources":{
            "cpus":1,
            "mem":128,
            "disk":0,
            "gpus":0
         },
         "image":{
            "kind":"DOCKER",
            "id":"nginx"
         },
         "endpoints":[
            {
               "name":"web",
               "containerPort":80,
               "protocol":[
                  "http"
               ]
            }
         ],
         "healthCheck":{
            "http":{
               "endpoint":"web",
               "path":"/"
            }
         }
      }
   ],
   "networks":[
      {
         "mode":"container"
      }
   ]
}
```


# 完成 Pod
以下 pod 定义可作为参考，用于创建更复杂的 Pod。

```json
{
  "id": "/complete-pod",
  "labels": {
    "owner": "zeus",
    "note": "Away from olympus"
  },
  "environment": {
    "XPS1": "Test"
  },
  "volumes": [
    {
      "name": "etc",
      "host": "/etc"
    }
  ],
  "networks": [
    {
     "mode": "container",
     "name": "dcos"
    }
  ],
  "scaling": {
    "kind": "fixed",
    "instances": 1
  },
  "scheduling": {
    "backoff": {
      "backoff": 1,
      "backoffFactor": 1.15,
      "maxLaunchDelay": 3600
    },
    "upgrade": {
      "minimumHealthCapacity": 1,
      "maximumOverCapacity": 1
    },
    "placement": {
      "constraints": [],
      "acceptedResourceRoles": []
    }
  },
  "containers": [
    {
      "name": "container1",
      "resources": {
        "cpus": 1,
        "mem": 128,
        "disk": 0,
        "gpus": 0
      },
      "endpoints": [
        {
          "name": "http-endpoint",
          "containerPort": 80,
          "hostPort": 0,
          "protocol": [ "HTTP" ],
          "labels": {}
        }
      ],
      "image": {
        "id": "nginx:latest",
        "kind": "DOCKER",
        "forcePull": false
      },
      "environment": {
        "XPS1": "Test"
      },
      "user": "root",
      "healthCheck": {
        "gracePeriodSeconds": 30,
        "intervalSeconds": 5,
        "maxConsecutiveFailures": 3,
        "timeoutSeconds": 4,
        "delaySeconds": 2,
        "http": {
          "path": "/",
          "scheme": "HTTP",
          "endpoint": "http-endpoint"
        }
      },
      "volumeMounts": [
        {
          "name": "etc",
          "mountPath": "/mnt/etc",
          "readOnly": true
        }
      ],
      "artifacts": [
        {
          "uri": "https://ftp.gnu.org/gnu/glibc/glibc-2.25.tar.gz",
          "executable": false,
          "extract": true,
          "cache": true,
          "destPath": "glibc-2.25.tar.gz"
        }
      ],
      "labels": {
        "owner": "zeus",
        "note": "Away from olympus"
      },
      "lifecycle": {
        "killGracePeriodSeconds": 60
      }
    }
  ]
}
```
