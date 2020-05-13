---
layout: layout.pug
navigationTitle: 配额管理
title: 配额管理
menuWeight: 5
render: mustache
model: /mesosphere/dcos/2.0/data.yml
excerpt: 为多租户使用组和配额管理
---
组为支持使用 Mesosphere&reg; DC/OS&trade; 的多租户群集而提供基础。组让您能够创建服务、权限、密匙和配额的逻辑集合。然后，您可以使用这些逻辑集合将组映射到特定团队、项目或业务线。

本部分的主题讨论如何通过设置配额限制来使用 **组** 管理资源，从而支持多租户。

# 配额
您可以定义 **配额** 来指定组中服务可以使用的最大资源。达到配额限制后，不允许任何新服务或扩展现有服务。

DC/OS 中的配额建立在 Apache&reg; Mesos&reg; 中的 [配额限制](https://mesos.apache.org/documentation/latest/quota/) 原语之上。
具体来说，顶级 DC/OS 组上的配额集（例如，“/dev”）被转换为对 Mesos 中的相应资源角色（例如，“Dev”）设置配额限制。
另外，在给定组内启动的服务配置成使用分配给 **组角色** （例如，“Dev”）的资源，以便可以通过定义的配额来限制其资源消耗。

# 先决条件

* [已安装并配置 DC/OS CLI](/mesosphere/dcos/2.0/cli/)。
* 有足够 [权限](/mesosphere/dcos/2.0/security/ent/perms-reference) 管理配额（仅限 Enterprise DC/OS）。

 配额管理操作通常由群集管理员执行。

# 创建组

要创建新组、dev，使用以下命令：

```bash
dcos marathon group add --id /dev. # If the group doesn't exist
```

# 设置配额

首次为某个组设置配额时，请使用以下命令：

```bash
dcos quota create dev --cpu 10 --mem 1024
```

# 查看配额
要查看组的配额限制和消耗，请使用以下命令：

```bash
dcos quota get dev
```

您还可以转到 **服务** 视图中“配额”选项卡，查看 DC/OS UI 中的配额信息。

# 更新配额
要更新组上的现有配额，请使用以下命令：

```bash
dcos quota update dev --cpu 20 --mem 2048
```

# 删除配额
要从组中删除现有配额，请使用以下命令：

```bash
dcos quota delete dev
```

请注意，删除配额不会影响组内任何正在运行的服务。服务将继续运行，但不会再受配额限制。

# 部署服务
在管理员为某个组设置配额后，常规用户可跟往常一样在组中部署服务。如果对组设置 `enforceRole` 属性，服务将会自动配置为使用组角色，并因此受配额限制。如果未设置属性，但用户希望其服务受配额限制，可以为其服务手动配置组角色。

# 迁移服务

为了实现向后兼容，所有现有顶级组都会将 `enforceRole` 属性设置为 false。因此，这些组中所启动的现有和新服务都将继续使用其传统角色，而非组角色。要修改此设置并导致新服务消耗配额，请运行：

```bash
dcos marathon group update /dev enforeceRole=true # only needed for groups created before DC/OS 2.0
```

现有服务将继续不消耗配额，必须进行迁移。要将使用传统角色的无状态服务迁移到组角色，用户可通过应用程序或 pod 更新来更新服务的角色字段：

```bash
dcos marathon app update /dev/my-app role=dev
```

要迁移有状态服务（例如，用于 Kafka&reg; 的 DC/OS 服务、用于 Cassandra&reg; 的 DC/OS 服务），用户必须更新服务角色，并为每个相应的 Pod 运行 `pod replace` 命令。请注意，`pod replace` 命令会导致本地持久数据丢失。

在运行 `pod replace` 命令之前：

1. 创建群集状态备份。
1. 确保基础服务复制可以一次处理一个节点的数据丢失。
1. 运行以下命令来更新服务角色：

    ```bash
    dcos kafka --name=/<group>/kafka update start --package-version="<version-supporting-group-role>"
    ```

完成上述步骤后，针对每个 pod 运行以下命令：

```bash
dcos kafka --name=/<group>/kafka pod replace <pod-name>
```

# 限制

* 您只能在顶级组（例如，"/dev") 而非嵌套组 ("/dev/foo") 中设置配额。
* 根组中运行的服务（例如，/app）不按配额执行。
* 并非所有目录服务都是按配额执行的。有关详细信息，请参阅具体的服务文档。
* 作业不按配额执行。
* 在不导致数据丢失的情况下，无法进行有状态服务迁移。

# 其他资源
您可以使用以下额外资源，了解有关使用配额限制的更多信息：

- [Mesos API](https://mesos.apache.org/documentation/latest/quota/)
