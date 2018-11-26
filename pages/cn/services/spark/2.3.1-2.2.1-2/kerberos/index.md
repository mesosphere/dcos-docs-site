---
layout: layout.pug
excerpt: 通过 Spark 使用 Kerberos
title: Kerberos
navigationTitle: Kerberos
menuWeight: 120
model: /cn/services/spark/data.yml
render: mustache
---


# HDFS Kerberos

Kerberos 是一个认证系统，允许 Spark 对启用 Kerberos 的 HDFS 进行数据的安全检索和写入。
集群中设置 ingress 的示例和重要信息。至 Mesosphere Spark `2.2.0-2` 起，长时间运行的作业将更新其授权令牌（认证
凭证）。此部分假定您之前设置了启用 Kerberos 的 HDFS 集群。

<p class="message--note"><strong>注意: </strong> 根据您的 OS，Spark 可能需要以 <code>root</code> 运行，以使用启用 Kerberos 的服务进行认证。这可以通过在提交作业时设置 <code>--conf spark.mesos.driverEnv.SPARK_USER=root</code> 来完成。</p>

## Spark 安装

Spark（和所有启用 Kerberos 的）组件需要有效的 `krb5.conf` 文件。您可以设置 Spark 服务以
对其所有驱动程序使用单个 `krb5.conf` 文件。

1. `krb5.conf` 文件告诉 Spark 如何连接到您的 KDC。Base64 编码此文件：
```
 cat krb5.conf | base64 -w 0 
```
2. 将编码文件（作为字符串）放入您的 JSON 配置文件：

    ```json
    {
       "security": {
         "kerberos": {
          "enabled": "true",
          "krb5conf": "<base64 encoding>"
          }
       }
    }
    ```
        
 您的配置可能还有来自上述的 `hdfs` 参数：
     
```json
    {
    "service": {
        "name": "kerberized-spark",
        "user": "nobody"
    },
    "hdfs": {
        "config-url": "http://api.hdfs.marathon.l4lb.thisdcos.directory/v1/endpoints"
    },
    "security": {
        "kerberos": {
            "enabled": true,
            "krb5conf": "<base64_encoding>"
        }
    }
    }
```

 或者，您可以使用更加简洁的选项指定 `krb5.conf`属性：
```json
    {
    "security": {
        "kerberos": {
        "enabled": true,
        "kdc": {
            "hostname": "<kdc_hostname>",
            "port": <kdc_port>
        },
        "realm": "<kdc_realm>"
        }
    }
    }

```
3. 使用自定义配置安装 Spark，此处称为 `options.json`：
```
 dcos package install --options=/path/to/options.json spark
```      
4. 确保您的 keytab 位于 DC/OS 密钥存储库中，位于
 Spark 服务可访问的路径下。由于 keytab 是二进制文件，在 DC/OS 1.10 或更低版本中，您还必须对其进行 base64 编码。
 参见 [使用密钥存储库](../security/#using-the-secret-store)
 了解详情。

5. 如果您正在使用历史服务器，您还必须配置历史服务器的 `krb5.conf`、principal 和 keytab。

 将 Kerberos 配置添加到 spark-history JSON 配置文件中：

```json
        {
        "service": {
            "user": "nobody",
            "hdfs-config-url": "http://api.hdfs.marathon.l4lb.thisdcos.directory/v1/endpoints"
        },
        "security": {
            "kerberos": {
                "enabled": true,
                "krb5conf": "<base64_encoding>",
                "principal": "<Kerberos principal>",  # e.g. spark@REALM
                "keytab": "<keytab secret path>"      # e.g. spark-history/hdfs_keytab
            }
        }
        }
```

 或者，您可以指定 `krb5.conf` 的属性：

```json
        {
            "security": {
                "kerberos": {
                    "enabled": true,
                    "kdc": {
                    "hostname": "<kdc_hostname>",
                    "port": <kdc_port>
                    },
                    "realm": "<kdc_realm>"
                    "principal": "<Kerberos principal>",  # e.g. spark@REALM
                    "keytab": "<keytab secret path>"      # e.g. spark-history/hdfs_keytab
                }
            }
        }
```

6. 确保所有用户都拥有历史 HDFS 目录的写入权限。在 HDFS 客户端中：

```bash
hdfs dfs -chmod 1777 <history directory>
```

## 作业提交

要对 Kerberos KDC 进行身份认证，Mesos 上的 Spark 支持 keytab 文件以及票证授予式票证 (TGT)。
Keytab 无限期有效，而票证会过期。推荐使用 Keytab，尤其是对于长时间运行的流式
作业。

### 使用环境变量控制 `krb5.conf` 

如果您在安装时未指定 `service.security.kerberos.kdc.hostname`、 `service.security.kerberos.kdc.port`和
`services.security.realm`，但希望在作业提交时使用模板化的 krb5.conf，您可以使用
以下环境变量来实现：
```
    --conf spark.mesos.driverEnv.SPARK_SECURITY_KERBEROS_KDC_HOSTNAME=<kdc_hostname> \
    --conf spark.mesos.driverEnv.SPARK_SECURITY_KERBEROS_KDC_PORT=<kdc_port> \
    --conf spark.mesos.driverEnv.SPARK_SECURITY_KERBEROS_REALM=<kerberos_realm> \
```
您还可以在安装之后设置 base64 编码的 krb5.conf：

```
    --conf spark.mesos.driverEnv.SPARK_MESOS_KRB5_CONF_BASE64=<krb5.conf_base64_encoding> \
```

`SPARK_MESOS_KRB5_CONF_BASE64`的设置将覆写/覆盖使用
`SPARK_SECURITY_KERBEROS_KDC_HOSTNAME`、`SPARK_SECURITY_KERBEROS_KDC_PORT` 和 `SPARK_SECURITY_KERBEROS_REALM` 设置的任何设置。

### 设置 Spark 用户

默认情况下，启用 Kerberos 时，Spark 作为与指定 Kerberos principal 的主节点相对应的 OS 用户运行。例如，principal “alice@LOCAL”将映射到用户名“alice”。如果已知“alice”不作为 OS 用户使用，在 docker 镜像或在主机中都不是，则 Spark 用户应指定为“root”或“nobody”：

```
    --conf spark.mesos.driverEnv.SPARK_USER=<Spark user>
```

### Keytab 身份认证

使用 keytab 提交作业：
```
 dcos spark run --submit-args="\
 --kerberos-principal user@REALM \
 --keytab-secret-path /spark/hdfs-keytab\
 --conf spark.mesos.driverEnv.SPARK_USER=<spark user> \
 --conf .. --class MySparkJob <url> <args>"
```

### TGT 身份认证

使用票证提交作业：
```
 dcos spark run --submit-args="\
 --kerberos-principal user@REALM \
 --tgt-secret-path /spark/tgt \
 --conf spark.mesos.driverEnv.SPARK_USER=<spark user> \
 --conf .. --class MySparkJob <url> <args>"
```
<p class="message--note"><strong>注意：</strong> 此页面上的示例假设您正在使用 Spark 的默认服务名称 "spark"。如果使用不同的服务名称，请相应地更新密钥路径。</p>

<p class="message--note"><strong>注意：</strong> 您可以从 Mesos 上的 Spark 访问外部（即非 DC/OS） Kerberos 安全的 HDFS 集群。</p>

**DC/OS 1.10 或更早版本：** 这些凭证对安全至关重要。DC/OS 密钥存储库要求您在添加密钥之前使用 base64 编码二进制密钥（例如 Kerberos keytab）。如果使用 `__dcos_base64__` 前缀上传，当 Spark 作业可用该密钥时，密钥会被自动解码。如果密钥名称**没有**此前缀，keytab 将被解码并写入沙盒中的文件。这将导致密钥暴露，不建议这样使用。


# 使用 Kerberos 安全的 Kafka

Spark 可以消费启用 Kerberos 的 Kafka 集群中的数据。连接 Spark 到安全的 Kafka 不需要特殊的
安装参数。但是，它确实要求 Spark 驱动程序和 Spark 执行程序可以访问以下文件：

* 客户端 JAAS（Java 认证和授权服务）文件。这是使用带有 `--conf
 spark.mesos.uris=<location_of_jaas>`  的 Mesos URIS 提供的。JAAS 文件的一个示例见 [此处](/services/spark/2.3.1-2.2.1-2/usage-examples/#advanced)
* `krb5.conf` 用于 Kerberos 设置。与 HDFS 相似，这是使用文件的 base64 编码提供的。
 ```
 cat krb5.conf | base64 -w 0
   ```     
* 环境变量，`KRB5_CONFIG_BASE64`，包含驱动程序和执行程序的这些值：
```
 --conf spark.mesos.driverEnv.KRB5_CONFIG_BASE64=<base64_encoded_string>
 --conf spark.executorEnv.KRB5_CONFIG_BASE64=<base64_encoded_string>
  ```      
* `keytab` 包含访问 Kafka 集群的凭证。
```       
 --conf spark.mesos.containerizer=mesos # required for secrets
 --conf spark.mesos.driver.secret.name=<keytab> # 例如 spark/kafka_keytab
 --conf spark.mesos.driver.secret.filenames=<keytab_file_name> # 例如 kafka.keytab
 --conf spark.mesos.executor.secret.name=<keytab> # 例如 spark/kafka_keytab
 --conf spark.mesos.executor.secret.filenames=<keytab_file_name> # 例如 kafka.keytab
```     

最后，您必须告诉 Spark 使用 JAAS 文件：
```      
 --conf spark.driver.extraJavaOptions=-Djava.security.auth.login.login.config=/mnt/mesos/sandbox/<jaas_file>
 --conf spark.executor.extraJavaOptions=-Djava.security.auth.login.login=/mnt/mesos/sandbox/<jaas_file>
```

重要的是，驱动程序和执行程序 keytab 文件的文件名相同 (`<keytab_file_name>` 以上）以及
此文件在您的 JAAS 文件中正确地寻址。

有关来自安全 Kafka 的 Spark 消费者的工作示例，请参阅 [使用示例](/services/spark/2.3.1-2.2.1-2/usage-examples/)。
