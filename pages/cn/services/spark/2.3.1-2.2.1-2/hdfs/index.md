---
layout: layout.pug
excerpt: 了解如何通过 DC/OS Apache Spark 配置 HDFS 
title: 与 HDFS 集成
navigationTitle: HDFS
menuWeight: 20
model: /cn/services/spark/data.yml
render: mustache
---

# HDFS

如果计划使用 DC/OS {{ model.techName }} 从 HDFS 读取和写入，有两个 Hadoop 配置文件应包含在 {{ model.techShortName }}的类路径中：
- `hdfs-site.xml`，为 HDFS 客户端提供默认行为。
- `core-site.xml`，设置默认文件系统名称。您可以在安装时或每个作业中指定这些文件的位置。

## {{ model.techShortName }} 安装
在 {{ model.techShortName }} 服务配置中，设置 `hdfs.config-url` 为为您的 `hdfs-site.xml` 和 `core-site.xml` 服务的 URL，如 [以下示例](#add-hdfs) 中那样，其中 `http://mydomain.com/hdfs-config/hdfs-site.xml` 和 `http://mydomain.com/hdfs-config/core-site.xml` 是有效的 URL：

```json
{
  "hdfs": {
    "config-url": "http://mydomain.com/hdfs-config"
  }
}
```
这也可通过 Web 界面进行。如果您正在使用 Mesosphere 的 HDFS 默认安装，这可能是 `http://api.hdfs.marathon.l4lb.thisdcos.directory/v1/endpoints`。

<a name="adding-hdfs"></a>
## 每个作业添加 HDFS 配置文件
为作业手动添加配置文件，使用 `--conf {{ model.serviceName }}.mesos.uris=<location_of_hdfs-site.xml>,<location_of_core-site.xml>`。这会将文件下载到驱动程序 {{ model.techShortName }} 应用程序的沙盒中，DC/OS {{ model.techName}} 将自动将这些文件加载到正确的位置。

**注意：** 这些文件名称为 `hdfs-site.xml` 和 `core-site.xml`，这点很重要。

### {{ model.techShortName }} 检查点

为了在使用 {{ model.techShortName }} 中使用检查点，确保您遵循[此处]说明(https://spark.apache.org/docs/latest/streaming-programming-guide.html#checkpointing) 并使用 HDFS 目录作为检查点目录。

例如：
```
val checkpointDirectory = "hdfs://hdfs/checkpoint"
val ssc = ...
ssc.checkpoint(checkpointDirectory)
```
HDFS 目录将在 HDFS 上创建，{{ model.techShortName }} 流式应用也将处理检查点数据，即使应用程序重启或出现故障。

# S3
您可以使用基于环境的密钥对 S3 进行文件读/写，以传递 AWS 凭证。您的凭证必须首先上传到 DC/OS 密钥存储库：

```
dcos security secrets create <secret_path_for_key_id> -v <AWS_ACCESS_KEY_ID>
dcos security secrets create <secret_path_for_secret_key> -v <AWS_SECRET_ACCESS_KEY> 
```
然后您的 {{ model.techShortName }} 作业可直接获得这些凭证：

```
dcos {{ model.serviceName }} run --submit-args="\
...
--conf {{ model.serviceName }}.mesos.containerizer=mesos  # required for secrets
--conf {{ model.serviceName }}.mesos.driver.secret.names=<secret_path_for_key_id>,<secret_path_for_secret_key>
--conf {{ model.serviceName }}.mesos.driver.secret.envkeys=AWS_ACCESS_KEY_ID,AWS_SECRET_ACCESS_KEY
...
```

