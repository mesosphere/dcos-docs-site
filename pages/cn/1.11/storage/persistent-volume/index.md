---
layout: layout.pug
navigationTitle: 本地持久卷
title: 本地持久卷
menuWeight: 10
excerpt: 使用本地持久卷

enterprise: false
---



当您指定本地卷时，任务及其关联的数据将“固定”到首次启动的节点，如果它们终止，将在该节点上重新启动。还保留应用程序所需的资源。除了您指定为应用定义一部分的沙盒 `disk` 大小外，Marathon 将隐式保留适当的磁盘空间（通过 `persistent.size` 在卷中声明）。

# 使用本地持久卷的好处

- 动态保留有状态服务运行任务所需的所有资源，因此，确保在需要时使用相同的卷在同一节点上重新启动任务的能力。
- 您不需要约束，就可将任务固定到其数据所在的特定代理程序。
- 您仍可以使用约束来指定分发逻辑。
- Marathon 使您可以在不再需要的情况下找到和销毁未使用的持久卷。

# 使用本地持久卷创建应用定义

## 配置卷

使用以下选项配置持久卷:

```json
{
  "containerPath": "data",
  "mode": "RW",
  "persistent": {
    "type": "root",
    "size": 10,
    "constraints": []
  }
}
```

- `containerPath`：应用程序读写数据的路径。这必须是相对于容器的单层路径；不能包含正斜杠 (`/`)。（`"data"`，但不是 `"/data"`、`"/var/data"` 或 `"var/data"`）。
- `mode`：卷的访问模式。目前， `"RW"` 是唯一可能的值，它将让您的应用程序从卷中读取及写入卷。
- `persistent.type`：要使用的 Mesos 磁盘资源类型；有效选项为 `root`、`path` 和 `mount`，对应于[有效的 Mesos 多磁盘资源类型](http://mesos.apache.org/documentation/latest/multiple-disk/)。
- `persistent.size`：持久卷的大小 (MiB)。
- `persistent.profileName`：（上文未见）存储[卷配置文件](https://docs.mesosphere.com/services/beta-storage/0.1.0-beta/terminology-and-concepts/#volume-profile)。仅使用具有指定配置文件的卷来启动应用程序。如果未给出此选项，任何卷（有或无配置文件）将用于启动。
- `persistent.maxSize`：（上文未见）对于 `root` Mesos 磁盘资源，要考虑的专属挂载卷的可选最大大小。
- `persistent.constraints`：限制应该在何处创建新持久卷的约束。目前，只能通过正则表达式约束磁盘资源的路径。

## 配置有状态应用程序

若要设置有状态应用程序，请将 `unreachableStrategy` 设置为“禁用”。

```json
"unreachableStrategy": "disabled",
```

<a name="abs-paths"></a>

## 指定不受支持的容器路径

为了让您将本地持久卷动态地添加到正在运行的容器中并确保跨操作系统的一致性，`containerPath` 的值必须是相对的。然而，您的应用程序可能需要绝对容器路径或带有斜杠的相对容器路径。如果您的应用程序确实需要不受支持的 `containerPath`，则可以通过配置两个卷来处理此限制。第一个卷具有您需要的绝对容器路径，并且没有 `persistent` 参数。第一个卷的 `hostPath` 参数必须与第二个卷的相对 `containerPath` 相匹配。

```json
{
  "containerPath": "/var/lib/data",
  "hostPath": "mydata",
  "mode": "RW"
}
```

第二个卷是持久卷，具有与第一个卷 `hostPath` 相匹配的 `containerPath`。

```json
{
  "containerPath": "mydata",
  "mode": "RW",
  "persistent": {
    "size": 1000
  }
}
```

如需完整示例，请参阅[在 Marathon 上运行有状态 MySQL](#statful-sql)。

# 通过 DC/OS Web 界面创建有状态应用程序

1. 单击 **Services** 选项卡，然后 **RUN A SERVICE**。
1. 单击 **Volumes** 选项卡。
1. 选择要使用的卷的大小。确保您选择符合应用程序需求的卷大小；启动应用程序后，您将无法修改此大小。
1. 指定应用程序将读写数据的容器路径。容器路径必须非嵌套的，且不能包含斜杠，例如 `data`，但不是 `../../../etc/opt` 或 `/user/data/`。如果您的应用程序需要此类容器路径，请[使用此配置](#abs-path)。
1. 单击 **Create**。

# 扩展有状态的应用程序

当您为应用程序减容时，与已终止实例关联的卷将被分离，但仍保留所有资源。此时，您可以通过 Marathon API 删除任务，这将释放保留的资源并销毁持久卷。

由于在分离卷时仍然保留应用程序所需的所有资源，因此您可能希望销毁分离的卷以允许其他应用程序和框架使用这些资源。但是，如果您认为您将再次为您的应用程序增容，您可能希望将它们保持在分离状态；卷上的数据仍然存在。如果您的应用程序被销毁，任何关联的卷和保留资源也将被删除。Mesos 目前不会删除数据，但将来可能会这样做。

# 升级或重新启动有状态的应用程序

有状态应用程序的默认 `UpgradeStrategy` 为 `0.5` 的 `minimumHealthCapacity` 以及 `0` 的 `maximumOverCapacity`。如果覆盖此默认值，则您的定义必须保持低于这些值才能通过验证。`UpgradeStrategy` 必须保持低于这些值，因为 Marathon 需要能够在开始新的任务之前终止旧任务，以便新版本可以接管保留和卷，并且 Marathon 无法创建其他任务（因为 `maximumOverCapacity > 0` 会诱导）以防止其他卷创建。

对于有状态的应用程序，Marathon 将永远不会启动比 `UpgradeStrategy` 中指定实例更多的实例，并且会在升级或重新启动期间终止旧实例而不是创建新实例。

[beta]
# 创建具有本地持久卷的 pod
[/beta]

## 配置卷

使用以下选项配置持久卷:

```json
"volumes": [
  {
    "name": "pst",
    "persistent": {
      "type": "root",
      "size": 10,
      "constraints": []
    }
  }
]
```

其中

- `name`：pod 级别卷的名称
- `persistent.type`：要使用的 Mesos 磁盘资源类型；有效选项为 `root`、`path` 和 `mount`，对应于[有效的 Mesos 多磁盘资源类型](http://mesos.apache.org/documentation/latest/multiple-disk/)。
- `persistent.size`：持久卷的大小 (MiB)。
- `persistent.maxSize`：（上文未见）对于 `root` Mesos 磁盘资源，要考虑的专属挂载卷的可选最大大小。
- `persistent.profileName`：（上文未见）存储[卷配置文件](https://docs.mesosphere.com/services/beta-storage/0.1.0-beta/terminology-and-concepts/#volume-profile)。仅使用具有指定配置文件的卷来启动应用程序。如果未给出此选项，任何卷（有或无配置文件）将用于启动。
- `persistent.constraints`：限制应该在何处创建新持久卷的约束。目前，只能通过正则表达式约束磁盘资源的路径。

## 配置有状态的 pod

若要设置有状态 pod，请将 `unreachableStrategy` 设置为“禁用”。

```json
"unreachableStrategy": "disabled",
```

## 指定卷挂载参数

```json
"volumeMounts": [
  {
    "name": "pst",
    "mountPath": "pst1",
    "readOnly": false
  }
]
```

其中

- `name`：要引用的卷的名称。
- `mountPath`：卷所挂载的容器内的路径。
- `readOnly`：卷是否以只读方式挂载。


# 在后台

Marathon 利用三种 Mesos 功能来运行有状态应用程序：[动态保留](http://mesos.apache.org/documentation/latest/reservation/)、保留标签和[持久卷](http://mesos.apache.org/documentation/latest/persistent-volume/)。

与静态保留相反，动态预留在运行时为给定角色创建，并使用预留标签将资源与 `frameworkId` 和 `taskId` 的组合相关联。这让 Marathon 在由于某种原因终止后重新启动有状态任务，因为相关资源将不会提供给未配置好以使用此角色的框架。有关更多信息，请参阅[非唯一角色](#non-unique-roles)。

Mesos 创建持久卷以保存应用程序的状态数据。由于持久卷是代理程序本地的，因此使用此数据的有状态任务将固定到最初启动的代理程序上，并且将在需要时在此节点上重新启动。您无需为此指定任何约束：当 Marathon 需要启动任务时，它将接受匹配的 Mesos 服务提供，动态保留任务所需的资源，创建持久卷，并确保使用这些保留的资源始终重新启动任务，以便它可以访问现有的数据。

当使用持久卷的任务已终止时，将保留其元数据。此元数据将用于在需要时启动替换任务。

例如，如果从 5 个实例减容到 3 个实例，您将看到处于 `Waiting` 状态的 2 个任务以及关于任务所使用的持久卷与其所在的代理节点的信息。Marathon 不会取消保留这些资源，也不会销毁这些资源。当您再次增容时，Marathon 将在获得包含标记资源的 Mesos 服务邀约时尝试启动使用这些现有保留和卷的任务。Marathon 将仅在以下情况下安排取消保留/销毁操作：

- 应用程序被删除（在这种情况下，其所有任务的卷都将被销毁，并且所有预留都将被删除）。
- 您可以通过 `wipe=true` 标志明确删除一个或多个暂停任务。

如果预留资源或创建持久卷失败，则创建的任务将在配置 `task_reservation_timeout`（默认：20 秒）后超时，并且将进行新的预留尝试。如果任务 `LOST`（因为其代理程序断开链接或崩溃），预留和卷不会超时，您需要手动删除并擦除任务以让 Marathon 启动新的任务。

# 潜在缺陷

在使用动态预留和持久卷的 Marathon 中使用有状态应用程序时，请注意以下问题和限制。

## 资源要求

目前，在部署了应用定义后，将无法更改有状态应用程序的资源要求&mdash;卷大小、cpu 使用率、内存要求等&mdash;。

## 复制和备份

由于持久卷被固定到节点，因此如果节点与集群断开连接（例如，由于网络分区或崩溃的代理程序），则不可再访问它们。如果有状态服务本身不处理数据复制，则需要手动设置复制或备份策略，以防止网络分区或崩溃的代理程序导致的数据丢失。

如果代理程序重新注册集群并提供其资源，Marathon 最终能够在那儿重新启动任务。如果节点不重新注册集群，Marathon 将永远等待接收预期的服务邀约，因为其目标是重新使用现有数据。如果预计代理程序不会返回，您可以通过添加 `wipe=true` 标志手动删除相关任务，Marathon 最终将在另一代理程序上使用新卷启动新任务。

## 磁盘消耗

从 Mesos 0.28 起，销毁持久卷不会清理或销毁数据。Mesos 删除所提及的有关卷的元数据，但数据仍保留在磁盘上。为防止磁盘消耗，您应当在不再需要时手动删除数据。

<a name="non-unique-roles"></a>

## 非唯一角色

Mesos 中的静态和动态预留均与角色绑定，而不是与框架或框架实例绑定。如上所述，Marathon 添加标签，以声称已为 `frameworkId` 和 `taskId` 的组合保留了资源。但是，这些标签不能防止其他框架或旧 Marathon 实例（1.0 之前）的误用。注册给定角色的每个 Mesos 框架最终都会收到服务邀约，其包含为该角色保留的资源。

但是，如果另一个框架不遵守预期的标签和语义的存在并使用它们，则 Marathon 无法为初始目的回收这些资源。如果其中一个框架使用动态预留，我们建议不要对不同的框架使用相同的角色。HA 模式下的 Marathon 实例不需要具有唯一角色，因为它们在设计上使用相同的角色。

### The Mesos 沙盒

临时 Mesos  沙盒仍然是 `stdout` 和 `stderr` 日志的目标。要查看这些日志，请转到 DC/OS GUI 的 Marathon 窗格。

# 示例

## Marathon 上有状态的 PostgreSQL

Marathon 上 PostgreSQL 的模型应用定义如下所示。请注意，我们将 PostgreSQL 数据文件夹设置为 `pgdata`，它相对于 Mesos 沙盒（包含在 `$MESOS_SANDBOX` 变量中）。这使我们能够通过 `pgdata` 的 `containerPath` 设置持久卷。此路径不是嵌套的，并且根据需要对于沙盒相对：


```json
{
  "id": "/postgres",
  "cpus": 1,
  "instances": 1,
  "mem": 512,
  "networks": [
    {
      "mode": "container/bridge"
    }
  ],
  "container": {
    "type": "DOCKER",
    "volumes": [
      {
        "containerPath": "pgdata",
        "mode": "RW",
        "persistent": {
          "type": "mount",
          "size": 524288,
          "maxSize": 1048576,
          "constraints": [["path", "LIKE", "/mnt/ssd-.+"]]
        }
      }
    ],
    "docker": {
      "image": "postgres:latest"
    },
    "portMappings": [
      {
        "containerPort": 5432,
        "hostPort": 0,
        "protocol": "tcp",
        "name": "postgres"
      }
    ]
  },
  "env": {
    "POSTGRES_PASSWORD": "password",
    "PGDATA": "pgdata"
  },
  "unreachableStrategy": "disabled",
  "upgradeStrategy": {
    "maximumOverCapacity": 0,
    "minimumHealthCapacity": 0
  }
}
```

<a name="stateful-sql"></a>
## Marathon 上有状态的 MySQL

默认 MySQL Docker 镜像不允许您更改数据文件夹。由于我们无法使用绝对嵌套的 `containerPath`（如 `/var/lib/mysql`）定义持久卷，因此我们配置了一个解决方法来设置从 hostPath `mysqldata`（相对于 Mesos 沙盒）到 `/var/lib/mysql`（MySQL 尝试读/写的路径）的 Docker 挂载：

```json
{
  "containerPath": "/var/lib/mysql",
  "hostPath": "mysqldata",
  "mode": "RW"
}
```

除此之外，我们还使用 containerPath `mysqldata` 配置持久卷，它将本地持久卷作为 `mysqldata` 挂载到 Docker 容器中：

```json
{
  "containerPath": "mysqldata",
  "mode": "RW",
  "persistent": {
    "type": "root",
    "size": 1000
  }
}
```

完整的 JSON 应用定义如下所示：

```json
{
  "id": "/mysql",
  "cpus": 1,
  "mem": 512,
  "disk": 0,
  "instances": 1,
  "networks": [
    {
      "mode": "container/bridge"
    }
  ],
  "container": {
    "type": "DOCKER",
    "volumes": [
      {
        "containerPath": "mysqldata",
        "mode": "RW",
        "persistent": {
          "type": "root",
          "size": 1000
        }
      },
      {
        "containerPath": "/var/lib/mysql",
        "hostPath": "mysqldata",
        "mode": "RW"
      }
    ],
    "docker": {
      "image": "mysql",
      "forcePullImage": false
    },
    "portMappings": [
      {
        "containerPort": 3306,
        "hostPort": 0,
        "servicePort": 10000,
        "protocol": "tcp"
      }
    ]
  },
  "env": {
    "MYSQL_USER": "wordpress",
    "MYSQL_PASSWORD": "secret",
    "MYSQL_ROOT_PASSWORD": "supersecret",
    "MYSQL_DATABASE": "wordpress"
  },
  "unreachableStrategy": "disabled",
  "upgradeStrategy": {
    "minimumHealthCapacity": 0,
    "maximumOverCapacity": 0
  }
}
```

## 含有持久卷的 Pod

以下示例将创建含有两个容器和一个共享持久卷的 Pod。另请参见 [Pod](/cn/1.11/deploying-services/pods/)。

```json
{
  "id": "/persistent-volume-pod",
  "volumes": [
    {
      "name": "pst",
      "persistent": {
        "type": "root",
        "size": 10,
        "constraints": []
      }
    }
  ],
  "scaling": {
    "kind": "fixed",
    "instances": 1
  },
  "scheduling": {
    "unreachableStrategy": "disabled",
    "upgrade": {
      "minimumHealthCapacity": 0,
      "maximumOverCapacity": 0
    }
  },
  "containers": [
    {
      "name": "container1",
      "exec": {
        "command": {
          "shell": "cd $MESOS_SANDBOX && echo 'hello' >> pst1/foo && /opt/mesosphere/bin/python -m http.server $EP_HOST_HTTPCT1"
        }
      },
      "resources": {
        "cpus": 0.1,
        "mem": 128
      },
      "endpoints": [
        {
          "name": "httpct1",
          "hostPort": 0,
          "protocol": [
            "tcp"
          ]
        }
      ],
      "volumeMounts": [
        {
          "name": "pst",
          "mountPath": "pst1",
          "readOnly": false
        }
      ],
      "lifecycle": {
        "killGracePeriodSeconds": 60
      }
    },
    {
      "name": "container2",
      "exec": {
        "command": {
          "shell": "cd $MESOS_SANDBOX && /opt/mesosphere/bin/python -m http.server $EP_HOST_HTTPCT2"
        }
      },
      "resources": {
        "cpus": 0.1,
        "mem": 128
      },
      "endpoints": [
        {
          "name": "httpct2",
          "hostPort": 0,
          "protocol": [
            "tcp"
          ]
        }
      ],
      "volumeMounts": [
        {
          "name": "pst",
          "mountPath": "pst2",
          "readOnly": false
        }
      ],
      "lifecycle": {
        "killGracePeriodSeconds": 60
      }
    }
  ],
  "networks": [
    {
      "mode": "host"
    }
  ]
}
```

## 检查/删除暂停的有状态任务

要销毁和清理持久卷，并释放与任务相关联的保留资源，请执行以下两个步骤：

1. 找到包含持久卷的代理程序并删除其中的数据。
1. 向 Marathon 发送包含 `wipe=true` 标记的 HTTP DELETE 请求。

若要查找代理程序，请检查 Marathon UI，并检查 **Volumes**选项卡上的分离卷。或者，查询 `/v2/apps` 端点，该端点提供有关 `host` 和 Mesos `slaveId` 的信息。

```
http GET http://dcos/service/marathon/v2/apps/postgres/tasks
```

响应：

```json
{
  "appId": "/postgres",
  "host": "10.0.0.168",
  "id": "postgres.53ab8733-fd96-11e5-8e70-76a1c19f8c3d",
  "localVolumes": [
    {
      "containerPath": "pgdata",
      "persistenceId": "postgres#pgdata#53ab8732-fd96-11e5-8e70-76a1c19f8c3d"
    }
  ],
  "slaveId": "d935ca7e-e29d-4503-94e7-25fe9f16847c-S1"
}
```

**注意：**除上述信息外，正在运行的任务还将显示 `stagedAt`、`startedAt` 和 `version`。

然后，您可以

1. 通过 `ssh'ing` 进入代理程序并运行 `rm -rf <volume-path>/*` 命令来删除磁盘上的数据。
1. 使用 `wipe=true` 删除任务，这将从 Marathon 内部存储库中删除任务信息，最终销毁卷并取消保留以前与任务关联的资源：

```
http DELETE http://dcos/service/marathon/v2/apps/postgres/tasks/postgres.53ab8733-fd96-11e5-8e70-76a1c19f8c3d?wipe=true
```

## 查看应用程序状态 

您可以使用持久本地卷查看应用程序的状态。在创建应用程序后，单击应用程序详细视图的 **Volumes** 选项卡以获取有关应用程序实例和关联卷的详细信息。

状态列会告诉您应用程序实例是否连接到卷。如果您对应用程序进行了减容，则应用程序实例将显示为“已分离”。目前唯一可用的操作类型为读/写 (RW)。

单击卷查看卷详细信息页面，您可以在其中查看有关各个卷的信息。
