---
layout: layout.pug
navigationTitle:  权限参考
title: 权限参考
menuWeight: 40
excerpt: 了解 DC/OS 访问和权限参考
enterprise: true
render: mustache
model：/mesosphere/dcos/2.0/data.yml
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->

您可以通过资源和操作控制 DC/OS 访问。参阅 [权限管理](/mesosphere/dcos/2.0/security/ent/perms-management/)，了解如何控制权限的详细信息。此页面为每个可用的 DC/OS 权限提供参考。

执行

根据您的安全模式执行 DC/OS 权限。

| 权限类别                                                        | 宽容   | 严格   |
| -----------------------------------------------------                      | :----------: | :------: |
| [Admin Router 权限](#admin-router) (`dcos:adminrouter`)             | x            | x        |
| [Mesos 权限](#mesos) (`dcos:mesos`)                                 |              | x        |
| [Marathon 和 Metronome 权限](#marathon-metronome) (`dcos:service`) | x | x |
| [密钥存储库权限](#secrets) (`dcos:secrets`)                      | x            | x        |
| [群集链接器权限](#cluster-linker) (`dcos:cluster:linker`)      | x            | x        |
| [超级用户权限](#superuser) (`dcos:superuser`)                     | x            | x        |

# 权限

可用操作是 `create`、`read`、`update`、`delete` 和 `full`。按照惯例，`full` 表示权限支持所有其他操作标识符。操作 `full` 可能包括任何其他操作标识符不支持的操作。

许多资源标识符包括方括号中的可选部分，可以填写这些部分以进一步缩小授予的权限。如果忽略可选部分，则资源标识符引用所有可能的值。例如，资源标识符 `dcos:mesos:agent:framework:role` 控制对使用任何 [Mesos 角色](/mesosphere/dcos/2.0/overview/concepts/#mesos-role) 注册的 DC/OS 服务的查看访问权限，而资源标识符 `dcos:mesos:agent:framework:role:slave_public` 控制对使用角色 `slave_public` 注册的 DC/OS 服务的查看访问权限。

发送到 DC/OS 组件的大多数 HTTP 请求都需要认证证明。这些
包括由 DC/OS CLI、DC/OS UI、DC/OS API 以及
DC/OS 组件之间内部启动的操作。某些端点的 HTTP 请求需要
额外的授权。许多 DC/OS 组件与 DC/OS 服务
帐户用户一起发布，并在首次安装群集时
单独授予必要的权限。

有几个执行请求授权的 DC/OS 组件，
例如，Admin Router、Mesos、Marathon 等。在这种情况下，它们被称为 **授权者**
。所有授权者均遵循 DC/OS 授权程序。以下
是 DC/OS 授权程序的高级描述。

当授权者收到对受保护资源的 HTTP 请求时，
授权者会检查 `Authorization` HTTP 请求标头以获取 DC/OS
认证令牌。DC/OS 认证令牌由
授权者验证和评估。在 `uid` 从 DC/OS 身份验证
令牌中提取后，授权者检查是否已授予相应 DC/OS 用户
执行所请求操作的必要权限。例如，
由 `uid` 标识的 DC/OS 用户必须具有 `full` 访问权限，
该权限是针对受保护资源 `dcos:adminrouter:package`，以便能够通过
Admin Router 访问 DC/OS 软件包 API。


## <a name="admin-router"></a>Admin Router 权限

#包括 /mesosphere/dcos/include/permissions-inheritance-disclaimer.tmpl


对 DC/OS 群集发出的大多数 HTTP 请求都通过 Admin Router。对于许多
HTTP 端点，Admin Router 自身执行授权。例如，
由 `uid` 标识的 DC/OS 用户必须具有 `full` 访问权限，
该权限是针对受保护资源 `dcos:adminrouter:package`，以便能够
通过 Admin Router 访问 DC/OS 软件包 API。

| 资源标识符                                                                                                                                                                                                                                                                                     | 全部   | C   | R   | U   | D   |
| -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------                     | ------ | --- | --- | --- | --- |
| `dcos:adminrouter:acs`<br> 控制对安全和访问管理功能的访问。                                       | x      |     |     |     |     |
| `dcos:adminrouter:ops:ca:ro`<br> 控制对 [证书颁发机构 API](/mesosphere/dcos/2.0/security/ent/tls-ssl/ca-api/) 只读端点和 `dcos security cluster ca` [Enterprise DC/OS CLI] 命令 (/mesosphere/dcos/2.0/cli/enterprise-cli/) 的访问。                                                                 | x      |     |     |     |     |
| `dcos:adminrouter:ops:ca:rw`<br> 控制用户对 [证书颁发机构 API] (/mesosphere/dcos/2.0/security/ent/tls-ssl/ca-api/)所有端点和 `dcos security cluster ca` [Enterprise DC/OS CLI] 命令 (/mesosphere/dcos/2.0/cli/enterprise-cli/) 的访问。                                                             | x      |     |     |     |     |
| `dcos:adminrouter:ops:cockroachdb`<br> 控制对 [CockroachDB UI] (https://www.cockroachlabs.com/docs/v1.1/admin-ui-overview-dashboard.html) 的访问。                                              | x      |     |     |     |     |
| `dcos:adminrouter:ops:exhibitor`<br> 控制对 Exhibitor UI 和 API 的访问。此权限允许用户在卸载服务之后 [移除 ZooKeeper 状态](/mesosphere/dcos/2.0/deploying-services/uninstall/#framework-cleaner)。                            | x      |     |     |     |     |
| `dcos:adminrouter:ops:historyservice`<br> 控制对 [历史服务] (/mesosphere/dcos/2.0/overview/architecture/components/#dcos-history) 的访问。这包括从 Mesos 访问可能的敏感数据，例如，所有框架的名称、其使用的资源以及每种状态中的任务数量。此服务已弃用，将在未来版本中移除。| x      |     |     |     |     |
| `dcos:adminrouter:ops:mesos-dns`<br>  控制对 [Mesos DNS API] (/mesosphere/dcos/2.0/networking/DNS/mesos-dns/mesos-dns-api/) 的访问。                                        | x      |     |     |     |     |
| `dcos:adminrouter:ops:mesos`<br>  控制对 Mesos 管理节点 UI 和 API 的访问。                                                                                                                                                                                                  | x    |   |   |   |   |
| `dcos:adminrouter:ops:metadata`<br>  控制对 [元数据端点] (/mesosphere/dcos/2.0/api/master-routes/#metadata) 的访问。                                      | x      |     |     |     |     |
| | `dcos:adminrouter:ops:networking`<br>  控制对 [网络](/mesosphere/dcos/2.0/api/master-routes/#networking) 和 [网络度量](/mesosphere/dcos/2.0/api/master-routes/#network-metrics) 端点的访问。                    | x      |     |     |     |     |
| `dcos:adminrouter:ops:slave`<br> 控制对 Mesos 代理节点 UI 和 API 的访问。                                                                                                                                                                                                    | x    |   |   |   |   |
| `dcos:adminrouter:ops:system-health`<br>  控制对 [系统健康 API] (/mesosphere/dcos/2.0/api/master-routes/#system) 的访问。                                   | x      |     |     |     |     |
| `dcos:adminrouter:ops:system-logs` <br> 控制对 [系统日志 API](/mesosphere/dcos/2.0/api/master-routes/#system) 的访问。                                                                                                                                                                      | x    |   |   |   |   |
| `dcos:adminrouter:ops:system-metrics`<br>  控制对 [系统度量标准 API](/mesosphere/dcos/2.0/api/master-routes/#system) 的访问。                           | x      |     |     |     |     |
| `dcos:adminrouter:licensing`<br>  控制对许可 API 的访问。                                                 | x      |     |     |     |     |
| `dcos:adminrouter:package`<br>  控制对 [Cosmos API] (/mesosphere/dcos/2.0/api/master-routes/#cosmos) 的访问，其提供对 DC/OS {{ model.packageRepo }} 的访问。                                                      | x      |     |     |     |     |
| `dcos:adminrouter:service:[<group-name>/]<service-name>`<br>  控制对已安装的 DC/OS 服务的 UI 和 API 的访问。                            | x      |     |     |     |     |
| `dcos:adminrouter:service:marathon`<br>  控制对本地 Marathon 实例的访问。                                      | x      |     |     |     |     |
| `dcos:adminrouter:service:metronome`<br>  控制对 [DC/OS 作业 (Metronome)] (/mesosphere/dcos/2.0/deploying-jobs/) 的访问。                                | x      |     |     |     |     |

<a name="mesos"></a>
## Mesos 权限

许多 Mesos 操作需要授权。
必须将必要权限分配给向 Mesos 发出 HTTP 请求的 DC/OS 用户。
这并不总是与登录 UI 或 CLI 的 DC/OS 用户相同。
例如，当 Alice 使用 UI 创建 Marathon 应用程序时，Marathon 执行
HTTP 请求授权并检查 `alice` DC/OS 用户是否具有
对 `dcos:service:marathon:marathon:services:/` 资源的 `create` 访问权限。
如果是，它使用**其自己的** DC/OS 用户（ 具有 `dcos_marathon` 的 `uid` 的 DC/OS 服务帐户），用指令认证对 Mesos 的 HTTP 请求，以启动新的 Mesos 任务。
此时，Mesos 将执行 DC/OS 授权程序，并检查 `dcos_marathon` DC/OS 用户是否已在 `dcos:mesos:master:task:app_id` 资源上被授予 `create` 操作。

根据 Root Marathon 启动的应用程序只能接收为 `slave_public` 或 `*` [Mesos 角色](/mesosphere/dcos/2.0/overview/concepts/#mesos-role)保留的资源供应。

| 资源标识符                                                                                                                                                                                                                                                                 | 全部   | C   | R   | U   | D   |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | --- | --- | --- | --- |
| `dcos:mesos:agent:container:app_id[:<service-or-job-group>]`<br>  控制对特定服务或作业的 [调试](/mesosphere/dcos/2.0/monitoring/debugging/debug-perms/) 功能的访问 。                        |        |     |     | x   |     |
| `dcos:mesos:agent:container:role[:<role-name>]`<br>  控制对给定 [Mesos 角色](/mesosphere/dcos/2.0/overview/concepts/#mesos-role)的 [调试](/mesosphere/dcos/2.0/monitoring/debugging/debug-perms/) 功能的访问。              |     |     | x   |     |
| `dcos:mesos:agent:endpoint:path[:<endpoint>]`<br>  控制对未受保护的 [Mesos 端点](https://mesos.apache.org/documentation/latest/authorization/) 的访问。                           |        |     | x   |     |     |
| `dcos:mesos:agent:executor:app_id[:<service-or-job-group>]`<br>  控制对服务和作业的查看访问权限 [执行器信息](https://mesos.apache.org/documentation/latest/app-framework-development-guide/)。                                                                     |        |     | x   |     |     |
| `dcos:mesos:agent:flags`<br>  控制对 [代理标记](https://mesos.apache.org/documentation/latest/slave/flags/) 配置的查看访问权限。                                                                                                                                       |        |     | x   |     |     |
| `dcos:mesos:agent:framework:role[:<role-name>]`<br>  控制对在给定 [Mesos 角色](/mesosphere/dcos/2.0/overview/concepts/#mesos-role) 注册的 DC/OS 服务的查看访问权限。                                                                                                             |        |     | x   |     |     |
| `dcos:mesos:agent:log`<br>  控制对 [代理日志](/mesosphere/dcos/2.0/monitoring/logging/) 的访问。                                        |        |     | x   |     |     |
| `dcos:mesos:agent:nested_container_session:app_id[:<service-or-job-group>]`<br>  在[调试](/mesosphere/dcos/2.0/monitoring/debugging/) 时按服务或作业组控制对在服务或作业容器内启动容器的访问。                                                                                |        | x   |     |     |     |
| `dcos:mesos:agent:nested_container_session:role[:<role-name>]`<br>  在[调试](/mesosphere/dcos/2.0/monitoring/debugging/) 时按 [Mesos 角色](/mesosphere/dcos/2.0/overview/concepts/#mesos-role) 控制对服务或作业容器内启动容器的访问。                           |        | x   |     |     |     |
| `dcos:mesos:agent:nested_container_session:user[:<linux-user-name>]`<br>  在[调试] (/mesosphere/dcos/2.0/monitoring/debugging/) 时，按 Linux 用户，控制对服务或作业容器内启动容器的访问。两个嵌套容器的用户必须相同。      |        | x   |     |     |     |
| `dcos:mesos:agent:resource_provider`<br>  控制对按代理执行的资源提供程序信息的查看访问权限。                                                                                                                                                                           |        |     | x   |     |     |
| `dcos:mesos:agent:resource_provider_config`<br>  控制对按代理执行的资源提供程序配置更改的访问。                                                                                                                                                           |        | x   |     | x   | x   |
| `dcos:mesos:agent:sandbox:app_id[:<service-or-job-group>]`<br>  控制对 Mesos 沙盒的访问。                                                                                                                                                                                |        |     | x   |     |     |
| `dcos:mesos:agent:task:app_id[:<service-or-job-group>]`<br>  控制对任务信息的访问。                                                                                                                                                                                    |        |     | x   |     |     |
| `dcos:mesos:master:agent`<br>  控制对停用/重新激活代理节点的访问（更新），以及对 [排空代理节点](/mesosphere/dcos/2.0/administering-clusters/draining-a-node/)（删除）的访问。                                                                                                                                                                                               |        |     |     | x   | x   |
| `dcos:mesos:master:block_disk`<br>  控制对创建和销毁块磁盘的访问。                               |        | x   |     |     | x   |
| `dcos:mesos:master:endpoint:path[:<path>]`<br>  控制对这些未受保护的 [Mesos 端点] (https://mesos.apache.org/documentation/latest/authorization/) 的访问：`logging/toggle`、`/metrics/snapshot` 和 `/files/debug`。                                                     |        |     | x   |     |     |
| `dcos:mesos:master:executor:app_id[:<service-or-job-group>]`<br>  控制对 [执行器](https://mesos.apache.org/documentation/latest/app-framework-development-guide/) 服务和作业组的访问。                                                                              |        |     | x   |     |     |
| `dcos:mesos:master:flags`<br>  控制对 [管理标记] (https://mesos.apache.org/documentation/latest/endpoints/master/flags/) 配置的查看访问权限。                           |        |     | x   |     |     |
| `dcos:mesos:master:framework:principal[:<service-account-id>]`<br>  按服务账户 ID 控制对 Mesos [拆除](https://mesos.apache.org/documentation/latest/endpoints/master/teardown/) 端点的访问，这允许您卸载 DC/OS 服务。              |        |     |     |     | x   |
| `dcos:mesos:master:framework:role[:<role-name>]`<br>  按 [Mesos 角色](/mesosphere/dcos/2.0/overview/concepts/#mesos-role) 控制对在 [Mesos](https://mesos.apache.org/documentation/latest/roles/) 注册为框架的访问。                                                         |        | x   |     |     |     |
| `dcos:mesos:master:log`<br>  控制对 Mesos [管理节点日志](/mesosphere/dcos/2.0/monitoring/logging/)的访问。                            |        |     | x   |     |     |
| `dcos:mesos:master:mount_disk`<br>  控制对创建和销毁挂载磁盘的访问。                                      |        | x   |     |     | x   |
| `dcos:mesos:master:quota:role[:<role-name>]`<br>  按 [Mesos 角色](/mesosphere/dcos/2.0/overview/concepts/#mesos-role) 控制对 [资源配额](https://mesos.apache.org/documentation/latest/quota/) 的访问。                                                                             |        |     | x   | x   |     |
| `dcos:mesos:master:reservation:principal[:<service-account-id>]`<br>  按用户或服务账户 控制对取消保留 [资源](https://mesos.apache.org/documentation/latest/reservation/) 的访问。                                                                             |        |     |     |     | x   |
 |`dcos:mesos:master:reservation:role[:<role-name>]`<br>  按 [Mesos 角色](/mesosphere/dcos/2.0/overview/concepts/#mesos-role) 控制对保留 [资源](https://mesos.apache.org/documentation/latest/reservation/) 的访问。                                                                   |        | x   |     |     |     |
| `dcos:mesos:master:task:app_id[:<service-or-job-group>]`<br>  控制对运行任务的访问权限。                                                                                                                                                                                          |        | x   |     |     |     |
| `dcos:mesos:master:task:user[:<linux-user-name>]`<br>  控制作为特定 Linux 系统用户对运行任务的访问权限。                                                                                                                                                                        |        | x   |     |     |     |
| `dcos:mesos:master:volume:principal[:<service-account-id>]`<br>  控制对销毁卷的访问权限。                                                                                                                                                                                |        |     |     |     | x   |
| `dcos:mesos:master:volume:role[:<role-name>]`<br>  控制为给定 [Mesos 角色](/mesosphere/dcos/2.0/overview/concepts/#mesos-role) 创建卷的访问权限。                       |        | x   |     |     |     |
| `dcos:mesos:master:weight:role[:<role-name>]`<br>  控制对给定 [Mesos 角色](/mesosphere/dcos/2.0/overview/concepts/#mesos-role)的 [权重](https://mesos.apache.org/documentation/latest/weights/) 的访问。                      |        |     | x   | x   |     |

<a name="marathon-metronome"></a>

## Marathon 和 Metronome 权限

Marathon 和 Metronome 要求对某些受保护资源发出的 HTTP 请求必须获得授权。例如，必须为 DC/OS 用户授予对 `dcos:service:marathon:marathon:services:/dev` 资源的 `create` 操作，以便在 `/dev` 服务组中创建新的 Marathon 应用程序。

| 资源标识符                                                                                                                                                                                                                                                                 | 全部   | C   | R   | U   | D   |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | --- | --- | --- | --- |
| `dcos:service:marathon:marathon:admin:config`<br>  控制对 [GET /v2/info Marathon 端点](/mesosphere/dcos/2.0/deploying-services/marathon-api/#/info/) 的访问。                           |        |     | x   |     |     |
| `dcos:service:marathon:marathon:admin:events`<br>  控制对 Marathon 事件端点 [GET /v2/events](/mesosphere/dcos/2.0/deploying-services/marathon-api/#/events/) 的访问。                 | x      |     | x   |     |     |
| `dcos:service:marathon:marathon:admin:leader`<br>  控制对 [GET/DELETE /v2/leader](/mesosphere/dcos/2.0/deploying-services/marathon-api/#/leader/) 端点的访问。                      | x      |     | x   | x   |     |
| `dcos:service:marathon:marathon:services:/[<service-group>]`<br>  控制对本地 Marathon 实例启动的 [DC/OS 服务] (/mesosphere/dcos/2.0/deploying-services/)的访问。<br>  [POST /v2/group](/mesosphere/dcos/2.0/deploying-services/marathon-api/#/groups/) 需要 `full` 操作。         | x      | x   | x   | x   | x   |
| `dcos:service:metronome:metronome:jobs[:<job-group>]`<br>  控制对[ 作业和作业组](/mesosphere/dcos/2.0/deploying-jobs/) 的访问。                                      | x      | x   | x   | x   | x   |


## <a name="secrets"></a>密钥存储库权限

这些权限控制对[密钥 API](/mesosphere/dcos/2.0/security/ent/secrets/secrets-api/) 的访问。Mesos 框架必须
将权限授予其 DC/OS 服务帐户，以访问给定的密钥。如果您正在寻找有关如何使用密钥
启动 Marathon 应用程序的信息，请参阅[配置服务和 pod 以使用密钥](/mesosphere/dcos/2.0/security/ent/secrets/use-secrets/)。

| 资源标识符                                                                                                                                                                                                                                                                 | 全部   | C   | R   | U   | D   |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | --- | --- | --- | --- |
| `dcos:secrets:default:[/<path-name>/]<secret-name>`<br>  控制对单个 [密钥](/mesosphere/dcos/2.0/security/ent/secrets/) 的访问。                                           | x      | x   | x   | x   | x   |
| `dcos:secrets:list:default:/[<path>]`<br>  控制对 [密钥] 名称(/mesosphere/dcos/2.0/security/ent/secrets/)的查看访问权限。                                                                                                                                                              |        |     | x   |     |     |

## <a name="cluster-linker"></a> 群集链接器权限

DC/OS 用户需要链接群集的权限。

| 资源标识符                                                                                                                                                                                                                                                                 | 全部   | C   | R   | U   | D   |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | --- | --- | --- | --- |
| `dcos:cluster:linker:<cluster-id>`<br>  控制对单个 [群集链接](/mesosphere/dcos/2.0/administering-clusters/multiple-clusters/cluster-links/) 的访问。                                                                                                                                |        |     | x   |     |     |
| `dcos:cluster:linker:*`<br>  控制对 [群集链接](/mesosphere/dcos/2.0/administering-clusters/multiple-clusters/cluster-links/) 的访问。                                                                                                                                                      |        | x   | x   | x   | x   |


## <a name="superuser"></a>超级用户权限

与 Windows `Administrator` 或 Linux `root` 帐户类似，DC/OS 具有
`superuser` 概念。在 `dcos:superuser` 资源上至少具有 `create`、`read`、`update`、`delete` 或 `full` 中一项权限的用户具有对
整个 DC/OS 任何操作的完全、不受限制的访问权限。这是非常强大的，对这种权限的
授予应该谨慎。

| 资源标识符                                                                                                                                                                                                                                                                 | 全部   | C   | R   | U   | D   |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | --- | --- | --- | --- |
| `dcos:superuser`<br>  控制对 DC/OS 群集的完全访问权限。                                     | x      | x   | x   | x   | x   |
