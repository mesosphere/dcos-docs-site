---
layout: layout.pug
navigationTitle: 权限
title: Edge-LB 权限
menuWeight: 50
excerpt: 使用 Edge-LB 安装包所需的服务帐户和用户权限
enterprise: false
---


Edge-LB 作为 DC/OS 服务进行安装，而非内置组件。以下列出的超级用户权限（`dcos:superuser`）或用户或组权限需要使用 Edge-LB。

# 权限注意事项

- 超级用户权限允许用户管理所有 Edge-LB 池。如果您无需配置细粒度访问，请使用此选项。
- 授予用户或组以下权限，以更细粒度地访问 Edge-LB 池。使用此方法，您可以限制服务帐户访问您指定的池。

# 安装权限

要安装 Edge-LB，用户必须具有以下权限：

- `dcos:adminrouter:package`
- `dcos:adminrouter:service:edgelb`
- `dcos:adminrouter:service:marathon`
- `dcos:service:marathon:marathon:services:/dcos-edgelb`

# 服务帐户权限

要使 Edge-LB 运行，必须将其配置为使用 [服务账户](/cn/services/edge-lb/1.1/installing/#create-a-service-account/)。

为方便管理，将服务帐户主体添加到 `superusers` 组。

或者，如果您希望仅授予必要的个人权限，则向服务帐户主体授予以下权限：

- `dcos:adminrouter:service:marathon`
- `dcos:adminrouter:package`
- `dcos:adminrouter:service:edgelb`
- `dcos:service:marathon:marathon:services:/dcos-edgelb`
- `dcos:mesos:master:endpoint:path:/api/v1`
- `dcos:mesos:master:endpoint:path:/api/v1/scheduler`
- `dcos:mesos:master:framework:principal:edge-lb-principal`
- `dcos:mesos:master:framework:role`
- `dcos:mesos:master:reservation:principal:edge-lb-principal`
- `dcos:mesos:master:reservation:role`
- `dcos:mesos:master:volume:principal:edge-lb-principal`
- `dcos:mesos:master:volume:role`
- `dcos:mesos:master:task:user:root`
- `dcos:mesos:master:task:app_id`

另外，**对于创建的每个 Edge-LB 池**，都需要授予此权限：

- `dcos:adminrouter:service:dcos-edgelb/pools/<POOL-NAME>`

# 多租户使用权限

要授予仅管理单个 Edge-LB 池的有限权限，用户必须具有以下权限：

- `dcos:adminrouter:package`
- `dcos:adminrouter:service:marathon`
- `dcos:adminrouter:service:dcos-edgelb/pools/<POOL-NAME>`
- `dcos:service:marathon:marathon:services:/dcos-edgelb/pools/<POOL-NAME>`

`dcos edgelb` CLI 子命令使用端点的以下权限。权限可单独授予：

- Ping：
    - `dcos:adminrouter:service:edgelb:/ping`
- 列表池：
    - `dcos:adminrouter:service:edgelb:/config`
- 读取池：
 - `dcos:adminrouter:service:edgelb:/pools/<POOL-NAME>`
- 创建 V1 池：
    - `dcos:adminrouter:service:edgelb:/v1/loadbalancers`
- 更新 V1 池：
 - `dcos:adminrouter:service:edgelb:/v1/loadbalancers/<POOL-NAME>`
 - `dcos:service:marathon:marathon:services:/dcos-edgelb/pools/<POOL-NAME>`
- 创建 V2 池：
    - `dcos:adminrouter:service:edgelb:/v2/pools`
- 更新 V2 池：
 - `dcos:adminrouter:service:edgelb:/v2/pools/<POOL-NAME>`
 - `dcos:service:marathon:marathon:services:/dcos-edgelb/pools/<POOL-NAME>`
- 删除池
 - `dcos:adminrouter:service:edgelb:/v2/pools/<POOL-NAME>`
