---
layout: layout.pug
navigationTitle: 常见问题
title: 常见问题
menuWeight: 20
excerpt: 关于安装 DC/OS 的常见问题
---


## 问：能否在已经运行的 Mesos 群集上安装 DC/OS？
我们建议从新群集开始，以确保所有默认值都设置为预期值。这样可防止版本和配置不匹配引起的意外条件。

## 问：DC/OS 的操作系统要求是什么？
请参阅 [系统要求](/cn/1.11/installing/production/system-requirements/) 文档。

## 问：DC/OS 是否安装 ZooKeeper？
DC/OS 运行自己的 ZooKeeper，由 Exhibitor 和 `systemd` 监督。

## 问：创建群集后是否需要维护 bootstrap 节点？
如果您在群集配置 [文件](/cn/1.11/installing/production/advanced-configuration/configuration-reference/)中指定的 Exhibitor 存储后端类型不是 `exhibitor_storage_backend: static`，则必须保留在群集生命周期内一直保留外部存储库，方便首要实例选举。如果您的群集是任务攸关群集，则应使用 S3 加固外部存储库或运行 bootstrap ZooKeeper 担当 quorum。可以容忍外部存储库的服务中断，但永久性的状态丢失可能导致意外状况。

## 问：如何将 Mesos 属性添加到节点以使用 Marathon 限制？

在 DC/OS 为需要添加的每个属性，将行 `MESOS_ATTRIBUTES=<key>:<value>` 添加到文件 `/var/lib/dcos/mesos-slave-common`（可能需要创建该行）。如需更多信息，请参阅 [Mesos 文档](http://mesos.apache.org/documentation/latest/attributes-resources/)。

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

[enterprise]
## 问：如何备份 IAM 数据库？
[/enterprise]

要将 IAM 数据库备份到文件，请在其中一个管理节点上运行以下命令：

```bash
sudo /opt/mesosphere/bin/cockroach dump --certs-dir=/run/dcos/pki/cockroach --host=$(/opt/mesosphere/bin/detect_ip) iam > ~/iam-backup.sql
```

[enterprise]
## 问：如何恢复 IAM 数据库？
[/enterprise]

要从文件 `~/iam-backup.sql` 恢复 IAM 数据库，请在其中一个管理节点上运行以下命令：

1. 首先，我们创建一个名为 `iam_new` 的新数据库，以便在其中加载备份。

    ```bash
    sudo /opt/mesosphere/bin/cockroach sql --certs-dir=/run/dcos/pki/cockroach --host=$(/opt/mesosphere/bin/detect_ip) -e "CREATE DATABASE iam_new"
    ```

1. 接下来，我们将数据加载到新数据库中。

    ```bash
    sudo /opt/mesosphere/bin/cockroach sql --certs-dir=/run/dcos/pki/cockroach --host=$(/opt/mesosphere/bin/detect_ip) --database=iam_new < ~/iam-backup.sql
    ```

1. 将备份数据加载到 `iam_new` 数据库后，现在我们需要将 `iam` 数据库重命名为 `iam_old`。

    ```bash
    sudo /opt/mesosphere/bin/cockroach sql --certs-dir=/run/dcos/pki/cockroach --host=$(/opt/mesosphere/bin/detect_ip) -e "ALTER DATABASE iam RENAME TO iam_old"
    ```

    <p class="message--note"><strong>注意：</strong>发出这个命令后，IAM 就会完全不可用。向 IAM 任何请求都会失败。</p>

1. 最后，我们将 `iam_new` 数据库重命名为 `iam`。

    ```bash
    sudo /opt/mesosphere/bin/cockroach sql --certs-dir=/run/dcos/pki/cockroach --host=$(/opt/mesosphere/bin/detect_ip) -e "ALTER DATABASE iam_new RENAME TO iam"
    ```
    <p class="message--note"><strong>注意：</strong>发出这个命令后，IAM 就会恢复可用。对 IAM 的请求将会再一次成功。</p>

 IAM 数据库从备份文件中恢复，群集正常运行。

## 问：如何使用 Guano 备份 Zookeeper？

在有些情况下，您可能需要备份 Zookeeper 的状态。执行以下步骤，使用 Guano 备份 ZooKeeper。

1. 下载 Guano ZooKeeper 实用程序。

    ```bash
    sudo wget https://s3.eu-central-1.amazonaws.com/adyatlov-public/guano-0.1a.jar.zip
    ```

1. 解压缩该实用程序。

    ```bash
    unzip guano-0.1a.jar.zip
    ```

1. 运行以下命令来备份您的 Zookeeper 状态。

    ```bash
    /opt/mesosphere/bin/dcos-shell java -jar guano-0.1a.jar -u super -p secret -d / -o /tmp/mesos-zk-backup -s $ZKHOST:2181 && tar -zcvf zkstate.tar.gz /tmp/mesos-zk-backup/
    ```

