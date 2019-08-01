---
layout: layout.pug
navigationTitle: 已升级
title: 已升级
menuWeight: 50
excerpt: 更新和升级 Kubernetes
---

## 在您开始之前

当前，更新包可能会触发子集或
此框架管理的所有组件的更新，这取决于
这些新的组件或相关组件是否是新版本的一部分。

更新这些组件意味着 Kubernetes 集群可能会经历某些
停机，或者在最坏的情况下，停止正常运行。同时，
尽管我们致力于让用户的体验尽可能稳健和顺畅，
但事实上，并没有什么防故障软件。

在更新包版本之前，**请谨慎操作并始终备份您的数据**。

未来，我们将整合灾难恢复功能，
这样，您就可以轻松恢复到前一个功能状态。

### 更新包 vs 更新包选项

当新包可用时，您可以选择更新至
新版本。如果您一段时间内未更新包，可能是
不允许更新到最新的包版本。如果是这种
情况，您将获得如何继续的信息。请注意，DC/OS 开源
版本需要额外的 [步骤](#dcos-open-edition) 来更新包版本。

然而，您可能只需要更新包选项，例如，
为了更改分配给一种 Kubernetes 组件的资源。
请记住，包选项更新也可能意味着 Kubernetes
集群会经历某些停机，或者在最坏的情况下，停止
正常运行。

在更新包选项之前，**请谨慎操作并始终备份您的数据**。

## 更新

要更新包，可以使用 `dcos kubernetes update` 
子命令。

```shell
$ dcos kubernetes update -h
usage: dcos kubernetes [<flags>] update [<flags>]

Flags:
  -h, --help               Show context-sensitive help.
  -v, --verbose            Enable extra logging of requests/responses
      --name="kubernetes"  Name of the service instance to query
      --options=OPTIONS    Path to a JSON file containing the target package options
      --package-version=PACKAGE-VERSION
                           The target package version
      --yes                Do not ask for confirmation before starting the update process
      --timeout=1200s      Maximum time to wait for the update process to complete
```

**重要信息：** 如果您拥有多个 Kubernetes 节点的集群，我们
建议将 `--timeout` 值调整为更大的值。但是，我们不能
提前计算该值应为多少，因为考虑到涉及的变量，
例如，可用的 DC/OS 集群资源、CPU 和互联网速度
等等

### 更新包版本

在开始更新进程之前，必须将 CLI
更新到新版本：

```shell
$ dcos package install kubernetes --cli --package-version=<NEW_VERSION>
```

#### DC/OS 企业版

以下是您开始包版本更新的方式：

```shell
$ dcos kubernetes update --package-version=<NEW_VERSION>
About to start an update from version <CURRENT_VERSION> to <NEW_VERSION>

Updating these components means the Kubernetes cluster may experience some
downtime or, in the worst-case scenario, cease to function properly.
Before updating proceed cautiously and always backup your data.

This operation is long-running and has to run to completion.
Are you sure you want to continue? [yes/no] yes

2018/03/01 15:40:14 starting update process...
2018/03/01 15:40:15 waiting for update to finish...
2018/03/01 15:41:56 update complete!
```

#### DC/OS 开源版本

与企业版本相比，DC/OS 开源包升级需要一些额外的
步骤，以实现相同的结果。

首先，将当前包配置导入名为 `config.json` 的 JSON 文件：

```shell
$ dcos kubernetes describe > config.json
```

要以非破坏性方式进行升级，首先删除 DC/OS Kubernetes
调度器，通过运行：

```shell
$ dcos marathon app remove /kubernetes
```

然后安装包的新版本：

```shell
$ dcos package install kubernetes --package-version=<NEW_VERSION> --options=config.json
```

### 更新包选项

此包揭示了某些选项，高级用户可根据自己的需要
使用这些选项来更新 Kubernetes 集群。例如，您可能想要
增加 `kube-apiserver` 计数或用于 `kube-proxy` 的资源。
举个例子，我们将描述如何实现后者。

假设您已使用默认选项安装包，那么
您所要做的只是使用以下内容
创建 JSON 文件：

```json
{
  "kube_proxy": {
    "cpus": 0.5,
    "mem": 1024
  }
}
```

假设文件被保存为 `new_options.json`，运行：

```shell
$ dcos kubernetes update --options=new_options.json
```

以下为预期输出。请注意，更改以
文本 `(CHANGED)` 进行突出显示：

```shell
The following differences were detected between service configurations (CHANGED, CURRENT):
 ==  {
 ==  "kube_proxy": {
 -      "cpus": 0.1,
 +      "cpus": 0.5,
 -      "mem": 512,
 +      "mem": 1024,
 ==  }
 == }

The components of the cluster will be updated according to the changes in the
options file [new_options.json].

Updating these components means the Kubernetes cluster may experience some
downtime or, in the worst-case scenario, cease to function properly.
Before updating proceed cautiously and always backup your data.

This operation is long-running and has to run to completion.
Are you sure you want to continue? [yes/no] yes

2018/03/01 15:40:14 starting update process...
2018/03/01 15:40:15 waiting for update to finish...
2018/03/01 15:41:56 update complete!
```

#### 值得注意的包选项

某些包选项有着特殊意义，他们 **必须**只在
包安装后更新 **一次**，并且仅朝向特定目标
值。这些包选项是

* `kubernetes.cloud_provider`：必须只有在
 选项的初始值是 `""` 以及目标值为 `"aws"` 时进行更新。
* `kubernetes.high_availability`：必须只有在
 选项的初始值是 `false` 以及目标值为 `true` 时进行更新。

此外，一些包选项 **不得** 在包被第一次安装后有 **任何**
更改。这些包选项是：

* `etcd.data_disk`
* `etcd.disk_type`
* `etcd.wal_disk`
* `kubernetes.network_provider`
* `kubernetes.service_cidr`
* `service.name`
* `kubernetes.authorization_mode`

请确保您理解并尊重这些规则。否则，您可能会
使您的集群不可用且面临丢失数据的风险。

## 更新 `1.2.0-1.10.5` 之前版本中的包选项

如果用户运行 `1.2.0-1.10.5` 之前的 DC/OS Kubernetes 版本，
则强烈建议更新至此版本。如果无法
或者不希望进行更新，则强烈建议用户在更新其集群选项
（例如，在更新分配给 Kubernetes 节点的 RAM 数量之前）之前，
执行一些手动步骤，以避免可能导致
更新操作期间集群停机的行为。这些手动步骤包括：
重新启动框架调度器，确保其从
重新启动中正常恢复，并检测 `deploy` 计划已达到 `COMPLETE`
状态。为此，可遵循以下步骤：

1. 强制框架调度器重新启动：

   ```
   $ dcos marathon app kill /<SERVICE_NAME>
   ```

   `<SERVICE_NAME>` 必须替换为服务名称（如
   `kubernetes`).

1. 确保框架调度器成功恢复，并且
 `deploy` 计划已完成：

   ```
   $ dcos kubernetes --name=<SERVICE_NAME> plan show deploy
   deploy (serial strategy) (COMPLETE)
   (...)
   ```

   `<SERVICE_NAME>` 必须替换为服务名称（如
 `kubernetes`)。此命令可能需要几分钟才能开始
 产生成功结果。
