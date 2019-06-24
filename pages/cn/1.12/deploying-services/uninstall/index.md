---
layout: layout.pug
navigationTitle: 卸载服务
title: 卸载服务
menuWeight: 7
excerpt: 在 CLI 中卸载 DC/OS 服务

enterprise: false
---

可在 CLI 中卸载服务。如果 Universe 服务有任何不能通过正常卸载过程清理的保留资源，也可能需要运行框架清理器脚本。[框架清理器脚本](#framework-cleaner) 从 ZooKeeper 中删除服务实例以及与其关联的任何数据。

# 卸载 Universe 服务

## CLI

使用以下命令卸载数据中心服务：

```bash
dcos package uninstall <servicename>
```

例如，如需卸载 Chronos：

```bash
dcos package uninstall chronos
```

## Web 界面

可在 DC/OS Web 界面的 **服务** 选项卡中卸载服务。“服务”选项卡为本地 DC/OS Marathon 实例提供了完整的功能界面。

1. 导航至 DC/OS Web 界面中的 [**服务**](/cn/1.12/gui/services/) 选项卡。
1. 选择服务，单击最右的垂直椭圆形，然后选择**删除**。

    ![Destroy app](/1.12/img/service-delete.png)
        
    图 1. 删除服务
    
1. 复制并运行显示的命令。

## 故障排除

卸载显示以下错误消息时可能失败：

```
Incomplete uninstall of package [chronos] due to Mesos unavailability
```

该服务可能处于非活动状态，并且不会显示在 DC/OS UI 中，但可以通过使用以下 CLI 命令查找：

```bash
dcos service --inactive
NAME          HOST     ACTIVE  TASKS  CPU  MEM  DISK  ID
chronos    10.0.6.138  False     0    0.0  0.0  0.0   7c0a7bd4-3649-4ec1-866c-5db8f2292bf2-0001
```

可以使用以下指定服务 ID 的 CLI 命令关闭服务，然后运行 [框架清理器](#framework-cleaner)，从而完成卸载：

```bash
dcos service shutdown 7c0a7bd4-3649-4ec1-866c-5db8f2292bf2-0001
```

# 卸载用户创建的服务

### CLI

使用以下命令卸载用户创建的服务：

```bash
dcos marathon app remove [--force] <app-id>
```

如需更多信息，请参阅 [命令名称](/cn/1.12/cli/command-reference/#dcos-marathon)。

### Web 界面

可在 **服务** 选项卡中打开 DC/OS Web 界面，并从中卸载服务。“服务”选项卡为本地 DC/OS Marathon 实例提供了完整的功能界面。

### Services 选项卡

1. 导航至 DC/OS Web 界面中的 [**服务**](/cn/1.12/gui/services/) 选项卡。
2. 单击 **已安装** 选项卡查看已安装的服务。
3. 将光标悬停在要卸载的包的名称上，然后就会看到右侧的红色“卸载”链接。单击此链接卸载包。

## <a name="framework-cleaner"></a>清理资源和 ZooKeeper

### 关于清理

如果服务有保留资源，并且没有自动清理对其进行彻底清理，您可以使用框架清理器的 Docker 镜像——`mesosphere/janitor`，从 ZooKeeper 中删除服务实例并销毁与其关联的所有数据，简化该流程。**在 DC/OS 1.10+ 群集上，仅在极少数情况下（例如卸载失败）需要该流程。** 包的文档可能在“卸载”部分有附加信息。

运行框架清理器脚本的方法有两种。首选方法是通过 DC/OS CLI 运行。如果没有 CLI ，也可以将镜像作为自行删除 Marathon 任务运行。

### 配置清理

脚本采用以下标记：

* `-r <role>`：要删除的资源的角色
* `-z <zk-node>`：要删除的配置 zookeeper 节点

命令运行如下：

```bash
docker run mesosphere/janitor /janitor.py -r <service_name>-role -z dcos-service-<service_name>
```

如果您正在使用严格模式群集，就必须提供执行清理所需的附加参数：
* `-a <token>`：用于认证的令牌
* `--username <username>` 和 `--password <password>`：用于认证的用户名和密码

例如，可以使用含有以下内容的认证令牌运行命令：

```bash
docker run mesosphere/janitor /janitor.py -r <service_name>-role -z dcos-service-<service_name> -a <content of "dcos config show core.dcos_acs_token">
```

### 通过 DC/OS CLI 运行

连接到首要实例并启动脚本：

1. 打开群集首要实例的 SSH 会话。
    ```bash
    your-machine$ dcos node ssh --master-proxy --leader
    ```

1. 运行 `mesosphere/janitor` 镜像，该镜像带有为服务配置的角色和 ZooKeeper 节点，并且在严格模式群集中还带有认证令牌：
    ```bash
    docker run mesosphere/janitor /janitor.py -r sample-role -z sample-zk [-a auth-token]
    ```

### 通过 Marathon 运行

在 DC/OS [**服务**](/cn/1.12/gui/) 选项卡中，使用 JSON 编辑器将以下内容添加为 Marathon 任务。根据需要清理的内容，替换传递到 `-r`/`-z` 的值。

  ```json
      {
  “id”: "janitor", 
  "cmd": "/janitor.py -r sample-role -z dcos-service-sample", 
  “CPU”: 1, 
  "mem": 128, 
  "disk": 1, 
  "instances": 1, 
  "container": {
  "docker": {
  "image": "mesosphere/janitor:latest", 
  "network": "HOST" 
          },
  "type": "DOCKER" 
        }
      }
  ```

当框架清理器完成工作后，就会自动从 Marathon 中移除，确保仅运行一次。移除操作即便已经成功完成，通常也会导致清理任务出现 `TASK_KILLED` 甚至是 `TASK_FAILED` 的结果。清理任务还会从“服务”和“仪表板”选项卡中迅速消失。

### 验证结果

如需查看脚本的结果，请前往 Mesos（`http://your-cluster.com/mesos`） 并查看任务的 `stdout` 内容。如果 `stdout` 缺少内容，请手动运行以下命令：

确定运行 Docker 任务的代理 ID。示例如下：

```bash
your-machine$ dcos node ssh --master-proxy --mesos-id=c62affd0-ce56-413b-85e7-32e510a7e131-S3

agent-node$ docker ps -a
CONTAINER ID        IMAGE                       COMMAND             ...
828ee17b5fd3        mesosphere/janitor:latest   /bin/sh -c /janito  ...

agent-node$ docker logs 828ee17b5fd33
```

### 示例结果

以下是成功运行样本安装的输出示例：
```
 your-machine$ dcos node ssh --master-proxy --leader

leader-node$ docker run mesosphere/janitor /janitor.py -r sample_role -z dcos-service-sample
[... docker download ...]
Master: http://leader.mesos:5050/master/ Exhibitor: http://leader.mesos:8181/ Role: sample_role ZK Path: sample

Destroying volumes...
Mesos version: 0.28.1 => 28
Found 1 volume(s) for role 'sample_role' on slave 3ce447e3-2894-4c61-bd0f-be97e4d99ee9-S5, deleting...
200
Found 1 volume(s) for role 'sample_role' on slave 3ce447e3-2894-4c61-bd0f-be97e4d99ee9-S4, deleting...
200
No reserved resources for any role on slave 3ce447e3-2894-4c61-bd0f-be97e4d99ee9-S3
No reserved resources for any role on slave 3ce447e3-2894-4c61-bd0f-be97e4d99ee9-S2
Found 1 volume(s) for role 'sample_role' on slave 3ce447e3-2894-4c61-bd0f-be97e4d99ee9-S1, deleting...
200
No reserved resources for role 'sample_role' on slave 3ce447e3-2894-4c61-bd0f-be97e4d99ee9-S0. Known roles are: [slave_public]

Unreserving resources...
Found 4 resource(s) for role 'sample_role' on slave 3ce447e3-2894-4c61-bd0f-be97e4d99ee9-S5, deleting...
200
Found 4 resource(s) for role 'sample_role' on slave 3ce447e3-2894-4c61-bd0f-be97e4d99ee9-S4, deleting...
200
No reserved resources for any role on slave 3ce447e3-2894-4c61-bd0f-be97e4d99ee9-S3
No reserved resources for any role on slave 3ce447e3-2894-4c61-bd0f-be97e4d99ee9-S2
Found 4 resource(s) for role 'sample_role' on slave 3ce447e3-2894-4c61-bd0f-be97e4d99ee9-S1, deleting...
200
No reserved resources for role 'sample_role' on slave 3ce447e3-2894-4c61-bd0f-be97e4d99ee9-S0. Known roles are: [slave_public]

Deleting zk node...
Successfully deleted znode 'dcos-service-sample' (code=200), if znode existed.
Cleanup completed successfully.
```
如果通过 Marathon 运行脚本，您还会看到以下输出：
```bash
 Deleting self from Marathon to avoid run loop: /janitor
Successfully deleted self from marathon (code=200): /janitor
 ```
