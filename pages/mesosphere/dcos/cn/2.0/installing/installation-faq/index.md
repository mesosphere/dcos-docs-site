---
layout: layout.pug
navigationTitle:  常见问题
title: 常见问题
menuWeight: 20
excerpt: 关于安装 DC/OS 的常见问题
---


## 问：能否在已经运行的 Mesos 群集上安装 DC/OS？
我们建议从新群集开始，以确保所有默认值都设置为预期值。这样可防止版本和配置不匹配引起的意外条件。

## 问：DC/OS 的操作系统要求是什么？
请参阅 [系统要求](/mesosphere/dcos/cn/2.0/installing/production/system-requirements/) 文档。

## 问：DC/OS 是否安装 ZooKeeper？
DC/OS 运行自己的 ZooKeeper，由 Exhibitor 和 `systemd` 监督。

## 问：创建群集后是否需要维护 bootstrap 节点？
如果您在群集配置 [文件](/mesosphere/dcos/cn/2.0/installing/production/advanced-configuration/configuration-reference/) `exhibitor_storage_backend: static`中指定的 Exhibitor 存储后端类型不是 ，则必须保留在群集生命周期内一直保留外部存储库，方便首要实例选举。如果您的群集是任务攸关群集，则应使用 S3 加固外部存储库或运行 bootstrap ZooKeeper 担当 quorum。可以容忍外部存储库的服务中断，但永久性的状态丢失可能导致意外状况。

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

- 如需从容地关闭进程并防止系统重新启动，请添加 `stop` 命令：

    ```bash
    sudo systemctl kill -s SIGUSR1 dcos-mesos-slave && sudo systemctl stop dcos-mesos-slave
    ```

- 对于公共代理，运行以下命令：

    ```bash
    sudo systemctl kill -s SIGUSR1 dcos-mesos-slave-public && sudo systemctl stop dcos-mesos-slave-public
    ```

<a name="iam-backup"></a>

## 问：如何备份 IAM 数据库？

- 要将 IAM 数据库备份到文件，请在其中一个管理节点上运行以下命令：

```bash
dcos-shell iam-database-backup > ~/iam-backup.sql
```

## 问：如何恢复 IAM 数据库？

- 要在文件 `~/iam-backup.sql` 恢复 IAM 数据库，请在其中一个管理节点上运行以下命令：

```bash
dcos-shell iam-database-restore ~/iam-backup.sql
```

IAM 数据库从备份文件中恢复，群集正常运行。

<a name="zk-backup"></a>

## 问：我如何备份 ZooKeeper？

要备份 ZooKeeper，请按照指南备份和恢复 [DC/OS ZooKeeper 状态](/mesosphere/dcos/cn/2.0/administering-clusters/backup-and-restore/backup-restore-cli/#zookeeper)。
