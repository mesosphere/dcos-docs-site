---
layout: layout.pug
navigationTitle: 常见问题
title: 常见问题
menuWeight: 20
excerpt: 关于安装 DC/OS 的常见问题
---


## 问：能否在已经运行的 Mesos 群集上安装 DC/OS？
我们建议从新群集开始，以确保所有默认值都设置为预期值。这样可防止版本和配置不匹配引起的意外情况。

## 问：DC/OS 的操作系统要求是什么？
请参阅 [系统要求](/1.12/installing/production/system-requirements/) 文档。

## 问：DC/OS 是否安装 ZooKeeper？
DC/OS 运行自己的 ZooKeeper，由 Exhibitor 和 `systemd` 监督。

## 问：创建群集后是否需要维护 bootstrap 节点？
如果您在群集配置 [文件](/1.12/installing/production/advanced-configuration/configuration-reference/) 中指定的 Exhibitor 存储后端类型不是 `exhibitor_storage_backend: static`，则必须在群集生命周期内一直保留外部存储库，方便首要实例选举。如果您的群集是任务攸关群集，则应使用 S3 加固外部存储库或运行 bootstrap ZooKeeper 担当 quorum。可以承受外部存储库的服务中断的情况，但永久性的状态丢失可能导致意外状况。

## 问：如何将 Mesos 属性添加到节点以使用 Marathon 限制？

在 DC/OS 中，为您想添加的每个属性添加行 `MESOS_ATTRIBUTES=<key>:<value>` 到文件 `/var/lib/dcos/mesos-slave-common` （可能需要创建）。如需详细信息，请参阅 [Mesos 文档](http://mesos.apache.org/documentation/latest/attributes-resources/)。

## 问：如何从容关闭一个代理？

- 如需从容地关闭代理节点的 Mesos 进程并让 `systemd` 重新启动它，请运行以下命令。

    ```bash
    sudo systemctl kill -s SIGUSR1 dcos-mesos-slave
    ```

如果使用了自动扩展组，就会自动更换节点。

- 对于公共代理，运行以下命令：

    ```bash
    sudo systemctl kill -s SIGUSR1 dcos-mesos-slave-public
    ```

- 如需从容地关闭进程并防止 systemd 重新启动它，请添加 `stop` 命令：

    ```bash
    sudo systemctl kill -s SIGUSR1 dcos-mesos-slave && sudo systemctl stop dcos-mesos-slave
    ```

- 对于公共代理，运行以下命令：

    ```bash
    sudo systemctl kill -s SIGUSR1 dcos-mesos-slave-public && sudo systemctl stop dcos-mesos-slave-public
    ```
## 问：如何备份 IAM 数据库？

- 要将 IAM 数据库备份到文件，请在其中一个管理节点上运行以下命令：

```bash
dcos-shell iam-database-backup > ~/iam-backup.sql
```

## 问：如何恢复 IAM 数据库？

- 要从 `~/iam-backup.sql` 文件恢复 IAM 数据库，请在其中一个管理节点上运行以下命令：

```bash
dcos-shell iam-database-restore ~/iam-backup.sql
```

IAM 数据库从备份文件中恢复，群集正常运行。

## 问：如何使用 Guano 备份 Zookeeper？

在有些情况下，您可能需要备份 Zookeeper 的状态。使用以下说明，用 Guano 在代理节点或管理节点来备份 ZooKeeper。

<p class="message--important"><strong>重要信息：</strong>以下说明将不在 bootstrap 节点上工作。</p>

1. 下载 Guano ZooKeeper 实用程序。

```bash
sudo wget https://s3.eu-central-1.amazonaws.com/adyatlov-public/guano-0.1a.jar.zip
```

2. 解压缩该实用程序。

```bash
unzip guano-0.1a.jar.zip
```

3. 设置变量 `ZKHOST` 到 Zookeeper 端点。

```bash
export ZKHOST="zk-1.zk"
```

4. 运行以下命令来备份您的 Zookeeper 状态。

<p class="message--note"><strong>注意：</strong>用户必须输入具有读取 ZK 存储权限的登录凭据（用户名和密码）。</p>

```bash
/opt/mesosphere/bin/dcos-shell java -jar guano-0.1a.jar -u super -p secret -d / -o /tmp/mesos-zk-backup -s $ZKHOST:2181 && tar -zcvf zkstate.tar.gz /tmp/mesos-zk-backup/
```

