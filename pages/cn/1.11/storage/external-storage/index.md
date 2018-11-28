---
layout: layout.pug
navigationTitle: 外部持久卷
title: 外部持久卷
menuWeight: 20
excerpt: 通过 Marathon 使用外部持久卷
beta: true
enterprise: false
---



<table class=“table” bgcolor=#ffd000>
<tr> 
  <td align=justify style=color:black><strong>警告：</strong>卷大小以在 GiB 指定。</td> 
</tr> 
</table>

当容错对您的应用程序至关重要时，请使用外部卷。如果主机发生故障，本地 Marathon 实例会在其他主机上重新安排您的应用程序及其相关数据，而无需用户干预。外部卷通常提供较大的存储量。

Marathon 应用程序通常在终止和重新启动时失去状态。在某些情况下，例如，如果您的应用程序使用 MySQL，您将希望应用程序保存其状态。您可以使用外部存储服务，例如 Amazon 的 Elastic Block Store (EBS)，创建跟随应用程序实例的持久卷。

# 创建具有外部持久卷的应用程序

## 使用 Marathon 应用定义创建应用程序

您可以在 [Marathon 应用定义][6] 中指定外部卷。

### 使用 Universal Container Runtime

此应用定义中 `cmd` 将 `date` 命令的输出附加到 `test.txt`。如果您看到应用程序连续运行的日志显示越来越多的 `date` 输出行，则可以验证是否正确使用了外部卷。

```json
{
  "id": "hello",
  "instances": 1,
  "cpus": 0.1,
  "mem": 32,
  "cmd": "date >> test-rexray-volume/test.txt; cat test-rexray-volume/test.txt",
  "container": {
    "type": "MESOS",
    "volumes": [
      {
        "containerPath": "test-rexray-volume",
        "external": {
          "size": 100,
          "name": "my-test-vol",
          "provider": "dvdi",
          "options": { "dvdi/driver": "rexray" }
          },
        "mode": "RW"
      }
    ]
  },
  "upgradeStrategy": {
    "minimumHealthCapacity": 0,
    "maximumOverCapacity": 0
  }
}
```

#### 卷配置选项

- `containerPath`：卷装载在容器内的路径。对于 Mesos 外部卷，这必须是相对于容器的单层路径；不能包含正斜杠 (`/`)。有关更多信息，请参阅[关于数据目录的 REX-Ray 文档][7]。
- `mode`：卷的访问模式。目前， `"RW"` 是唯一可能的值，它将允许您的应用程序从卷中读取及写入卷。
- `external.size`：以 **GiB** 为单位的卷大小。
- `external.name`: **name** 卷驱动程序用于查找外部卷的名称。当您的任务在代理程序上暂存时，卷驱动程序将在存储服务中查询具有此名称的卷。如果不存在，则是[隐式创建的][8]。否则，将重用现有卷。
- `external.options["dvdi/driver"]`：用于存储的 Docker 卷驱动程序。随 DC/OS 提供的唯一靠 Docker 卷驱动程序是 `rexray`。了解有关 [REX-Ray][9] 的更多信息。
- 您可以通过 `container.volumes[x].external.options[optionName]` 指定其他选项。Mesos 容器的 dvdi 提供程序适用 `dvdcli`，它提供以下[选项][10]。任何选项的可用性取决于您的卷驱动程序。
- 通过在 `container.volumes` 阵列中添加其他项来创建多个卷。
- 创建应用程序后，无法更改卷参数。
- 如 `upgradeStrategy.minimumHealthCapacity` 大于 0.5 或 `upgradeStrategy.maximumOverCapacity` 不等于 0，Marathon 将不会启动具有外部卷的应用程序。

### 使用 Docker 引擎

下面是一个示例应用定义，它使用 Docker Engine 并指定外部卷。此应用定义中 `cmd` 将 `date` 命令的输出附加到 `test.txt`。如果您看到应用程序连续运行的日志显示越来越多的 `date` 输出行，则可以验证是否正确使用了外部卷。

```json
{
  "id": "/test-docker",
  "instances": 1,
  "cpus": 0.1,
  "mem": 32,
  "cmd": "date >> /data/test-rexray-volume/test.txt; cat /data/test-rexray-volume/test.txt",
  "container": {
    "type": "DOCKER",
    "docker": {
      "image": "alpine:3.1",
      "network": "HOST",
      "forcePullImage": true
    },
    "volumes": [
      {
        "containerPath": "/data/test-rexray-volume",
        "external": {
          "name": "my-test-vol",
          "provider": "dvdi",
          "options": { "dvdi/driver": "rexray" }
        },
        "mode": "RW"
      }
    ]
  },
  "upgradeStrategy": {
    "minimumHealthCapacity": 0,
    "maximumOverCapacity": 0
  }
}
```

#### 卷配置选项

* `containerPath` 必须是绝对的。
* 只有某些版本的 Docker 与 REX-Ray 卷驱动程序兼容。请参阅 [REX-Ray 文档][11]。

## 从 DC/OS Web 界面创建应用程序

1. 单击 **Services** 选项卡，然后 **RUN A SERVICE**。
1. 如果您正在使用 Docker 容器，请单击 **Container Settings** 并配置您的容器运行时间。
1. 单击 **Volumes** 并输入卷名称和容器路径。
1. 单击 **Deploy**。

<a name="implicit-vol"></a>

# 隐式卷

默认隐式卷大小为 16 GiB。如果您使用的是 Universal Container Runtime，则可以通过设置 `volumes[x].external.size` 来修改特定卷的此默认值。如果您使用的是 Docker Engine，则无法修改特定卷的此默认值。但是，对于这两个运行时间，您可以通过修改 [REX-Ray configuration][4] 来修改所有隐式卷的默认大小。

# 扩展应用程序

使用外部卷的应用程序只能扩展为单个实例，因为卷一次只能附加到单个任务。

如果将应用程序减容到 0 个实例，该卷将从装载它的代理程序中分离，但不会被删除。如果您再次扩展应用程序，则与其关联的数据仍然可用。

# 潜在缺陷

* 每个卷只能分配一个任务。您的存储提供程序可能有其他限制。
* 您创建的卷不会自动清除。如果删除集群，则必须转至存储提供程序并删除不再需要的卷。如果您正在使用 EBS，请通过您在 Marathon 应用定义中设置的 `container.volumes.external.name` 进行搜索来查找它们。此名称对应于 EBS 卷 `Name` 标签。
* 卷由其存储提供程序命名。选择唯一的卷名称以避免冲突。
* 如果使用 Docker，则必须使用兼容的 Docker 版本。请参阅 [REX-Ray 文档][11]，了解哪些版本的 Docker 与 REX-Ray 卷驱动程序兼容。
* 对于隐式创建卷的应用程序，启动时间可能会增加。增加的量取决于若干因素，包括卷大小和类型。存储提供程序处理卷的方法也会影响隐式创建卷的启动时间。
* EBS 特定的：
 * 在同一 AWS 帐户上创建的卷共享命名空间。选择唯一的卷名称以避免在同一帐户下启动多个集群时的冲突。
 * EBS 卷也由其可用性区 (AZ) 命名，并且 EBS 卷[只能连接到同一 AZ 的 EC2 实例][12]。因此，尝试在不同的 AZ 中运行的代理程序中启动任务将导致创建同名的新卷。如果您在一个 AZ 中创建集群，请将其销毁，如果您希望重用任何外部卷，请确保在同一 AZ 中创建集群。如果集群跨越多个 AZ，请使用 Marathon 限制仅在同一 AZ 中启动实例。
 * 默认情况下，REX-Ray 将在连接 13 个 EBS 卷后失败。尽管 REX-Ray [0.11.0 引入了配置选项 `useLargeDeviceRange` 来扩展此限制][13]，但 DC/OS v1.11.0 捆绑了 REX-Ray 0.9.0。
* 有关外部卷的故障排除，请参阅代理程序或系统日志。如果您在 DC/OS 上使用 REX-Ray，还可以查阅 systemd 日志。

[4]:https://rexray.readthedocs.io/en/v0.9.0/user-guide/config/
[5]:http://rexray.readthedocs.io/en/v0.9.0/user-guide/storage-provider/
[6]: /1.11/deploying-services/creating-services/
[7]:https://rexray.readthedocs.io/en/v0.9.0/user-guide/config/#data-directory
[8]: #implicit-vol
[9]:https://rexray.readthedocs.io/en/v0.9.0/user-guide/schedulers/
[10]:https://github.com/emccode/dvdcli#extra-options
[11]:https://rexray.readthedocs.io/en/v0.9.0/user-guide/schedulers/#docker-containerizer-with-marathon
[12]:https://docs.aws.amazon.com/AWSEC2/latest/Userguide/ebs-attach-volume.html
[13]:https://rexray.readthedocs.io/en/v0.11.0/user-guide/storage-provider/aws/#configuration-notes
