---
layout: layout.pug
navigationTitle: 多租户原始文件
title: 多租户原始文件
menuWeight: 90
excerpt: DC/OS 中多租户的引物
---

# 概述
可以使用角色、预留、配额和权重的组合来保留 DC/OS 中的资源并确定其优先级。这些功能由 Apache Mesos 提供，位于 DC/OS 的核心，称为 `Primitives`，因为它们只能通过 API 访问，尚未集成到 DC/OS UI 或 CLI 中。在使用配额，预留和权重时，用户需要良好的监控来代替可用/已用的资源。

这一环境中的资源管理是指诸如代理上的资源预留、资源配额和框架的权重（优先级）等概念。这些对于许多场景都非常有用，例如配置多租户环境，其中有多个团队或项目在同一个 DC/OS 群集上共存，并且必须划分可用资源（CPU、RAM、磁盘和端口） 并保证每个群集具有可靠的配额。其次，在单个集群上混合工作负载，其中一类框架可能具有比另一类更高的权重（优先级），且其部署速度应当高于较低权重框架。

本页面涵盖多租户原始文档：多租户配额管理原始文档、实际场景的两个示例、实施指令和参考链接。

# 多租户配额管理原始文档
多租户原始文档的主要概念包括：

## 角色
角色指群集内的资源使用者。资源使用者可以代表组织内的用户，但也可以代表团队、组或服务。它通常是指正在运行的一级或一类活动。在 DC/OS 中，调度程序订阅一个或多个角色，以便代表他们正在服务的资源使用者接收资源并调度工作。调度程序包括 Marathon、Kubernetes 以及 DC/OS 目录中的许多经过认证的框架（例如 Kafka 和 Cassandra），它们都是为了纳入自己的调度程序而构建的。

框架将订阅两个默认角色：
- 专用代理上的 `*`
- 公共代理上的 `slave_public`。

目录中的框架采用自己的角色进行部署，并且可以按需创建唯一角色。

## 保留
保留是指针对特定角色在目标公共和专用代理上保留资源的位置。代理（公共/专用）启动需应用静态保留资源，如果不重新启动代理，则无法修改其他角色。动态保留资源使运营商和授权框架能够在代理启动后按需保留和取消保留资源。所有基于 SDK 的框架，如 Kafka 和 Cassandra（DC/OS 目录中列出的认证框架），都利用动态保留来保留他们打算在部署中使用的资源。

## 配额
配额是指保证角色将获得特定数量资源的机制。如今，配额是最大配额，如果定义了配额并且部署了角色的任务，那么这些资源将立即保留，无论任务是否扩展到需要使用它们。其他任务将无法使用这些资源，即使它们可能并未被提供的任务使用过。动态配额，其中的任务将仅使用当时所需的配额，但保证为未来发布内容规划配额、可撤销资源和超额订阅。

## 权重
权重是指使一个角色优先于另一个角色的机制，以允许分配给该角色的所有任务比具有较低权重的其他角色收到更多（资源）offer。这样可以加快部署、实现扩展和任务更换。

# 示例
基于现有客户用例的两个真实场景描述了这些概念。

## 具有加权 Spark 角色的分析平台
此示例基于现有客户的分析管道用例。主要工作负载是 Spark，有标记了角色的三个层级 Spark 作业；低 -  1，中 -  2 和高 -  3，表示相应的优先级和权重。

在实践中，高级角色获得分配的 offer（资源）是中级角色公平份额的三倍，而中级角色所得份额则是低级角色的两倍。除权重外，高优先级 Spark 角色获得 `x` 的 CPU 份额和 `y` 的 RAM。

在部署 Spark 作业时，高优先级 Spark 作业会比中低级角色优先接收 offer。假定中优先级角色和低优先级角色没有应用配额，中级角色将会比低级角色早收到 offer，但中级没有配额，因此如果中级角色需要的 `z` 核心且不可用，它将收到当时可用的所有核心。

## Marathon on Marathon 中的 Jenkins
在此示例中，客户将 Jenkins (CI/CD 管道) 作为一项具有数百个实例的服务运行，每个需要运行一项服务的开发团队都需要一个实例。

在 DC/OS 群集中，还有其他部署为 Marathon 任务的应用程序即服务。包括 Jenkins 在内的每个应用程序都在他们自己的 Marathon 实例中被分组，并被称为 Marathon on Marathon（MoM），在 DC/OS 文档中被归为非本地 Marathon  - 本地 Marathon 是 DC/OS 附带的默认 Marathon。从概念上讲，Marathon 上有一个本地 Marathon 和非本地 Marathon，专门用于分组其他任务。

每个 MoM 都会托管一个应用程序组，并且已附加角色和配额。每个角色和配额都提供了一种方法来保证其中一个角色经常获得扩展，比如 Jenkins就会根据需要为新构建程序启动代理，以获得必要资源。如果 Jenkins 需要更多资源，可以通过动态修改配额来提供。MoM 的另一种常见用途是在一个具有强大资源和访问管理功能的 DC/OS 群集上对开发、测试和暂存等环境进行分组。

总而言之，Jenkins 即服务是非常动态的工作负载，有数百个 Jenkins 代理按需运行。充分了解可用资源并了解何时达到配额是保障调整、可用性和增长的重要参数。Spark 示例测量高级角色任务运行的速度比低速度快多少，从而指示调整权重。

# 实现
您可以使用以下资源来学习如何实现 Marathon on Marathon 和 Spark 配额：
- [部署非本地 Marathon 实例](https://docs.mesosphere.com/1.12/deploying-services/marathon-on-marathon/)
- [Spark 配额](https://docs.mesosphere.com/services/spark/2.3.1-2.2.1-2/job-scheduling/#setting-quotas-for-the-drivers)

在下面的示例中，建议从安装了 [DC/OS CLI](https://docs.mesosphere.com/1.12/cli/) 的主机运行应用程序。

<p class="message--note"><strong>注意：</strong>在复制和粘贴到编辑器或终端时，需要清除下面的 JSON 示例中的所有双引号。</p>

## 角色
[角色](https://mesos.apache.org/documentation/latest/roles/) 指的是分配给框架、任务或代理的标记或标签。默认角色名为 <sup> `*` </sup>，群集中的所有现有角色都可以通过 Mesos UI 查看：`https://<cluster-name-or-IP>/mesos/#/roles`。


在以下示例中，在运行时将名为 `high` 的角色分配给 Spark 任务。可以执行 Spark 任务的多个实例，确保它们都能从与高层及相关联的资源管理中受益。

`spark.mesos.role=high`

DC/OS 目录中的应用程序（如 Kafka 和 Cassandra）将自动部署通用角色名称，而用户不可配置该角色名称。

`confluent_kafka_role`

角色不需要显式管理（例如配置新角色并将其分配给任务），它们是在部署任务或配置权重或配额时按需创建的。同样也不应删除角色，它们要在群集的持续时间内一直存在。

## 保留
[预留](https://mesos.apache.org/documentation/latest/reservation/)可以手动配置并由 SDK 框架使用。在这两种情况下都必须声明授权用户，称为主体/框架或操作者。对于 DC/OS 中的 SDK 框架，这也称为服务帐户。

### 添加
在 ID 为 `312dc1dc-9b39-474f-8295-87fc43872e7c-S0` 的特定代理上为低级角色添加预留资源，保证 `four` CPU 份额和 `512MB` RAM。当具有低请求角色的任何任务提供与此代理程序预留的资源匹配时，该任务在代理本身的资源空间将会得到保证。

<p class="message--note"><strong>注意：</strong>BootstrapUser 的主体与每个用户都不相同。在本示例中， `bootstrapuser` 的主体是我的超级用户帐户。</p>

必须更改群集上代理 ID 的 `agent_id`。使用 `$dcos node` 查找代理 ID。

```json
tee add-reservation.json << EOF
{
  "type": "RESERVE_RESOURCES",
  "reserve_resources": {
    "agent_id": {
      "value": "312dc1dc-9b39-474f-8295-87fc43872e7c-S0"
    },
    "resources": [
      {
        "type": "SCALAR",
        "name": "cpus",
        "reservation": {
          "principal": "bootstrapuser"
        },
        "role": "confluent-kafka-role",
        "scalar": {
          "value": 4.0
        }
      },
      {
        "type": "SCALAR",
                "name": "mem",
        "reservation": {
          "principal": "bootstrapuser"
        },
        "role": "confluent-kafka-role",
        "scalar": {
          "value": 512.0
        }
      },
      {
        "type": "RANGES",
        "name": "ports",
        "reservation": {
          "principal": "bootstrapuser"
        },
        "role": "confluent-kafka-role",
        "ranges": {
          "range": [
            {
              "begin": 8112,
              "end": 8114
            }
          ]
        }
      }
    ]
  }
}
EOF



curl -i -k \
      -H "Authorization: token=`dcos config show core.dcos_acs_token`" \
      -H "Content-Type: application/json" \
      -H "Accept: application/json" \
      -d @add-reservation.json \
-X POST "`dcos config show core.dcos_url`/mesos/api/v1"
```

成功之后，预计会有 `HTTP 202` 响应。

如果资源不可用于预订，预计响应内容为 `HTTP 409`，并且无法在该代理上预留资源。可能已经有运行的任务消耗了这些资源。

### 检查
最好通过 Mesos UI 针对您应用预留的特定代理或借助 `jq` 解析 `state.json` 来实现检查。

`https://<cluster-URL>/mesos/#/agents/<agent-id>`

### 删除
删除需要修改输入 `JSON`，从而仅引用以下格式的资源：

<p class="message--note"><strong>注意：</strong>更改 agent_id 以匹配群集上的代理 ID（如上例所示）。</p>

```json
tee remove-reservation.json << EOF
{
  "type": "UNRESERVE_RESOURCES",
  "unreserve_resources": {
    "agent_id": {
      "value": "312dc1dc-9b39-474f-8295-87fc43872e7c-S0"
    },
    "resources": [
      {
        "type": "SCALAR",
        "name": "cpus",
        "reservation": {
          "principal": "bootstrapuser"
        },
        "role": "confluent-kafka-role",
        "scalar": {
          "value": 4.0
        }
      },
      {
        "type": "SCALAR",
        "name": "mem",
        "reservation": {
          "principal": "bootstrapuser"
        },
        "role": "confluent-kafka-role",
        "scalar": {
          "value": 512.0
        }
      },
      {
        "type": "RANGES",
        "name": "ports",
        "reservation": {
          "principal": "bootstrapuser"
        },
        "role": "confluent-kafka-role",
        "ranges": {
          "range": [
            {
              "begin": 8112,
              "end": 8114
            }
          ]
        }
      }
    ]
  }
}
EOF

curl -i -k \
      -H "Authorization: token=`dcos config show core.dcos_acs_token`" \
      -H "Content-Type: application/json" \
      -H "Accept: application/json" \
      -d @remove-reservation.json \
-X POST "`dcos config show core.dcos_url`/mesos/api/v1"
```

还有其他选项，涉及动态和静态操作，以及修改参考链接中包含的现有预留。

## 配额
[配额](https://mesos.apache.org/documentation/latest/quota/) 指定角色保证接收的最小资源量（除非群集中的总资源少于配置的配额资源，而这种情况通常表示配置错误）。

### 添加
配额一旦申请就无法更新，必须将其删除然后重新添加，才能更新。以下示例将 `two` CPU 份额和 `4GB` RAM 的配额应用于名为 `high` 的角色。

```json
tee set-quota.json << EOF
{
  "type": "SET_QUOTA",
  "set_quota": {
    "quota_request": {
      "force": true,
      "guarantee": [
        {
          "name": "cpus",
          "role": "*",
          "scalar": {
            "value": 2.0
          },
          "type": "SCALAR"
        },
        {
          "name": "mem",
          "role": "*",
          "scalar": {
            "value": 4096.0
          },
          "type": "SCALAR"
        }
      ],
      "role": "high"
    }
  }
}
EOF

curl -i -k \
      -H "Authorization: token=`dcos config show core.dcos_acs_token`" \
      -H "Content-Type: application/json" \
      -H "Accept: application/json" \
      -d @set-quota.json \
-X POST "`dcos config show core.dcos_url`/mesos/api/v1"
```

成功之后，预计会有 `HTTP/1.1 200 OK` 响应。

### 检查

```json
tee get-quota.json << EOF
{
  "type": "GET_QUOTA"
}
EOF

curl -i -k \
      -H "Authorization: token=`dcos config show core.dcos_acs_token`" \
      -H "Content-Type: application/json" \
      -H "Accept: application/json" \
      -d @get-quota.json \
-X POST "`dcos config show core.dcos_url`/mesos/api/v1"

HTTP/1.1 200 OK
Server: openresty
Date: Fri, 21 Sep 2018 15:35:09 GMT
Content-Type: application/json
Content-Length: 224
Connection: keep-alive

{"type":"GET_QUOTA","get_quota":{"status":{"infos":[{"role":"high","principal":"bootstrapuser","guarantee":[{"name":"cpus","type":"SCALAR","scalar":{"value":2.0}},{"name":"mem","type":"SCALAR","scalar":{"value":128.0}}]}]}}}
```

### 删除

```json
tee remove-quota.json << EOF
{
  "type": "REMOVE_QUOTA",
  "remove_quota": {
    "role": "high"
  }
}
EOF
curl -i -k \
      -H "Authorization: token=`dcos config show core.dcos_acs_token`" \
      -H "Content-Type: application/json" \
      -H "Accept: application/json" \
      -d @remove-quota.json \
-X POST "`dcos config show core.dcos_url`/mesos/api/v1"

HTTP/1.1 200 OK
Server: openresty
Date: Fri, 21 Sep 2018 15:38:15 GMT
Content-Length: 0
Connection: keep-alive
```

成功之后，预计会有 `HTTP/1.1 200 OK` 响应。

## 权重 
[权重](https://mesos.apache.org/documentation/latest/weights/) 可用于控制提供给不同角色的群集资源的相对份额。

### 应用
该设置会应用权重 `five` 到角色 `perf`。

```json
tee set-weight.json << EOF
{
  "type": "UPDATE_WEIGHTS",
  "update_weights": {
    "weight_infos": [
      {
        "role": "perf",
        "weight": 5.0
      }
    ]
  }
}
EOF

curl -i -k \
      -H "Authorization: token=`dcos config show core.dcos_acs_token`" \
      -H "Content-Type: application/json" \
      -H "Accept: application/json" \
      -d @set-weight.json \
-X POST "`dcos config show core.dcos_url`/mesos/api/v1"
```

成功之后，预计会有 `HTTP/1.1 200 OK` 响应。

### 检查
```json
tee get-weight.json << EOF
{
  "type": "GET_WEIGHTS"
}
EOF

curl -i -k \
      -H "Authorization: token=`dcos config show core.dcos_acs_token`" \
      -H "Content-Type: application/json" \
      -H "Accept: application/json" \
      -d @get-weight.json \
-X POST "`dcos config show core.dcos_url`/mesos/api/v1"

HTTP/1.1 200 OK
Server: openresty
Date: Fri, 21 Sep 2018 15:25:25 GMT
Content-Type: application/json
Content-Length: 84
Connection: keep-alive
{"type":"GET_WEIGHTS","get_weights":{"weight_infos":[{"weight":5.0,"role":"perf"}]}}
```

### 删除
权重一旦设置就无法删除，可以使用与更新权重相同的方法进行修改。如果您希望重置角色的权重，可以将其设置回 `two`，其权重与默认角色 <sup> `*` </sup> 相同。


## Marathon on Marathon
DC/OS 目录包括 Marathon，可用于部署 MoM。应该注意，这仅适用于 DC/OS OSS 安装，但不提供对严格模式、密钥或 ACL 的支持。

要安装 Enterprise MoM，就必须联系 Mesosphere 服务支持以获取 Enterprise MoM tarball，然后使用根 Marathon 进行部署。

# 其他资源
您可以使用以下附加资源进一步了解：

- [超额订阅](https://mesos.apache.org/documentation/latest/oversubscription/)
- [授权](https://mesos.apache.org/documentation/latest/authorization/)
- [Mesos API](https://mesos.apache.org/documentation/latest/operator-http-api/)














