---
layout: layout.pug
navigationTitle: 使用有安全功能的自定义 Marathon 部署服务
title: 使用有安全功能的自定义 Marathon 部署服务
menuWeight: 40
excerpt: 使用高级非本地 Marathon 实例
enterprise: true

---

本专题描述了如何部署具有独立角色、保留、配额和安全功能的非本地 Marathon 实例。高级非本地 Marathon 程序只能在您需要 [密钥](/cn/1.11/security/ent/secrets/) 或细粒度 ACL 时使用，否则请使用 [基本程序](/cn/1.11/deploying-services/marathon-on-marathon/basic/)。

要使用此程序，您必须向销售代表获取自定义非本地 Marathon tarball（<sales@mesosphere.io>）。这一自定义 tarball 包含 Marathon 以及一个密钥和授权插件。这些附加插件帮助您在非本地 Marathon 文件夹层级中使用密码和细粒度访问控制。

**先决条件：**

- DC/OS 和 DC/OS CLI [已安装](/cn/1.11/installing/)。
- [DC/OS Enterprise CLI 0.4.14 或更高版本](/cn/1.11/cli/enterprise-cli/#ent-cli-install)。
- 自定义非本地 Marathon tarball。联系销售代表或 <sales@mesosphere.io> 获取本文件的访问权限。
- 每个专用 DC/OS 代理可以通过网络访问的专用 Docker 注册表。可以遵循 [以下](/cn/1.11/deploying-services/private-docker-registry/) 了解关于如何在 Marathon 中设置，或使用其他选项的说明（如 [DockerHub](https://hub.docker.com/)、[Amazon EC2 容器注册表](https://aws.amazon.com/ecr/)和 [Quay](https://quay.io/)）。
- 您必须以超级用户身份登录。
- 对集群的 SSH 访问。

# 第 1 步 - 加载和推送自定义非本地 Marathon 镜像
在此步骤中，自定义非本地 Marathon 实例被推送到专用 Docker 注册表。

1. 使用所要求的自定义非本地 Marathon 文件（`marathon-dcos-ee<version>.tar`）将 tarball 加载到 Docker 中。

   ```bash
   docker load -i marathon-dcos-ee.<version>.tar
   ```

   **提示：** 可以使用此命令查看 Marathon 镜像。

    ```
    docker images
    ```

   您会看到与如下内容类似的输出：

      ```bash
      REPOSITORY                    TAG                 IMAGE ID            CREATED             SIZE
      mesosphere/marathon-dcos-ee   1.4.0-RC4_1.9.4     d1ffa68a50c0        3 months ago        926.4 MB
      ```

1. 重命名文件以匹配您在专用 Docker 注册表中使用的存储库，其中：
   - `<mesosphere-tag>` 是 Mesosphere 镜像的标签。通常，该标签与文件名中的版本号匹配。
   - `<your-repo>` 是您要存储镜像的专用存储库的名称。
   - `<your-tag>` 是镜像的标签。建议使用与 Mesosphere 镜像相同的标记。

   ```bash
   docker tag mesosphere/marathon-dcos-ee:<mesosphere-tag> <your-repo>/marathon-dcos-ee:<your-tag>
   ```

1. 将 Marathon 镜像推送至您的专用 Docker 注册表。

   ```bash
   docker push <your-repo>/marathon-dcos-ee:<your-tag>
   ```

# 第 2 步 - 保留资源
在此步骤中，保留 Mesos 资源。选择 [静态](#static-reservations) 或 [动态](#dynamic-reservations) 保留的步骤。

## 静态保留

<p class="message--important"><strong>警告：</strong>此程序将关闭节点上运行的所有任务。</p>

1. [SSH](/cn/1.11/administering-clusters/sshcluster/) 到专用代理节点。

   ```bash
   dcos node ssh --master-proxy --mesos-id=<agent-id>
   ```

1. 导航至 `/var/lib/dcos` 并创建一个名为 `mesos-slave-common` 且含有这些内容的文件，其中 `<myrole>` 是您的角色名称。

    ```bash
    MESOS_DEFAULT_ROLE='<myrole>'
    ```
1. 停止专用代理节点：

    ```bash
    sudo sh -c 'systemctl kill -s SIGUSR1 dcos-mesos-slave && systemctl stop dcos-mesos-slave'
    ```

1. 将节点重新添加到集群。

1. 重新加载 systemd 配置。

      ```bash
      sudo systemctl daemon-reload
      ```

1. 删除代理节点上的 `latest` 元数据指针：

      ```bash
      ⁠⁠⁠⁠sudo rm /var/lib/mesos/slave/meta/slaves/latest
      ```

1. 使用新配置的属性和资源规范启动代理。

      ```bash
      sudo systemctl start dcos-mesos-slave
      ```

   可以使用以下命令检查状态：

      ```bash
      sudo systemctl status dcos-mesos-slave
      ```

1. 对每个附加节点重复上述步骤。

## 动态保留
使用 Mesos ID 为非本地 Marathon 实例保留资源 (`<mesos-id>`), user ID (`<userid>`), role (`<myrole>`), and ports (`<begin-port>` and `<end-port>`) 。

```bash
curl -i -k \
      -H "Authorization: token=`dcos config show core.dcos_acs_token`" \
      -H "Content-Type: application/json" \
      -H "Accept: application/json" \
      -d '{
  "type": "RESERVE_RESOURCES",
  "reserve_resources": {
    "agent_id": {
      "value": "<mesos-id>"
    },
    "resources": [
      {
        "type": "SCALAR",
        "name": "cpus",
        "reservation": {
          "principal": "<userid>"
        },
        "role": "<myrole>",
        "scalar": {
          "value": 1.0
        }
      },
      {
        "type": "SCALAR",
        "name": "mem",
        "reservation": {
          "principal": "<userid>"
        },
        "role": "<myrole>",
        "scalar": {
          "value": 512.0
        }
      },
      {
        "type": "RANGES",
        "name": "ports",
        "reservation": {
          "principal": "<userid>"
        },
        "role": "<myrole>",
        "ranges": {
          "begin": "[<begin-port>]",
          "end": "[<end-port>]"
        }
      }
    ]
  }
}' \
      -X POST "`dcos config show core.dcos_url`/mesos/api/v1"
```

# 第 3 步 - 创建 Marathon 服务帐户
Marathon 服务账户可能是可选或必填项，具体取决于您的 [安全模式](/cn/1.11/security/ent/#security-modes)。

| 安全模式 |  Marathon 服务帐户 |
|---------------|----------------------|
| 禁用 | 可选 |
| 宽容 | 可选 |
| 严格 | 必填 |

1. 创建 2048 位 RSA 公私密钥对 (`<private-key>.pem` and `<public-key>.pem`)，将每个值保存到当前目录中的单独文件中。

    ```bash
    dcos security org service-accounts keypair <private-key>.pem <public-key>.pem
    ```

1. 创建名为 ` <service-account-id>`, with the public key specified (`<public-key>.pem`）的新服务帐户。

    ```bash
    dcos security org service-accounts create -p <public-key>.pem -d "Non-native Marathon service account" <service-account-id>
    ```

# 第 4 步 - 为专用代理创建专用 Docker 注册表凭据
在此步骤中，使用 [安全拷贝] 将凭据 tarball 传输到每个专用代理的本地文件系统(https://linux.die.net/man/1/scp)。以下指示针对 CoreOS 管理节点和代理节点进行了优化。如果您正在运行 CentOS，请将以下所有命令中的 `core` 替换为 `centos`。

1. 利用终端提示登录您的专用 Docker 注册表。
   - 如果专用存储库位于 Docker Hub，请使用此命令：

         ```bash
         docker login
         ```
   - 如果专用存储库不在 Docker Hub 上，请使用此命令，其中带有为您指定的专用注册表域名（`<domain-name>`）。

         ```bash
         docker login <domain-name>
         ```

1. 导航至您的主目录并确认 `.docker` 目录与此类似。

   ```bash
   ls -la .docker
   drwxr-xr-x 4 user group 136 Aug 15 17:29 . 
   drwxr-xr-x+ 118 user group 4012 Jan 26 18:16 .. 
   -rw------- 1 user group 217 Jan 25 13:52 config.json
      ```

1. 压缩 Docker 凭据。

   ```bash
   sudo tar cvzf docker.tar.gz .docker
   ```

   可以通过此命令确认操作成功。

   ```bash
   tar -tvf docker.tar.gz
   ```

   您会看到与以下内容类似的输出。

   ```bash
   drwxr-xr-x 0 user group 0 Jan 23 15:47 .docker/
   -rw------- 0 user group 217 Jan 23 15:48 .docker/config.json
      ```

1. 复制 Docker 凭据文件到管理节点之一，使用公共管理 IP 地址 (` <public-master-ip>`) 。

 可以通过单击 DC/OS Web 界面左上角的集群名称找到公共管理 IP 地址。

      ```bash
      scp docker.tar.gz core@<public-master-ip>:
   ```

1. [SSH](/cn/1.11/administering-clusters/sshcluster/) 到包含 Docker 凭据文件的管理节点。

   ```bash
   dcos node ssh --master-proxy --mesos-id=<master-id>
   ```

1. 存储环境变量中每个专用代理的 IP 地址。所需步骤取决于您的 [安全模式](/cn/1.11/security/ent/#security-modes)。

 ### 已禁用

   ```bash
   PRIVATE_AGENT_IPS=$(curl -sS leader.mesos:5050/slaves | jq '.slaves[] | select(.reserved_resources.slave_public == null) | .hostname' | tr -d '"');
   ```   

 ### 宽容

   ```bash
   PRIVATE_AGENT_IPS=$(curl -sS leader.mesos:5050/slaves | jq '.slaves[] | select(.reserved_resources.slave_public == null) | .hostname' | tr -d '"');
   ```

 ### 严格

 1. 验证认证令牌并将其保存到 `AUTH_TOKEN` 环境变量，使用指定的 DC/OS 用户名 (`<username>`) and password (`<password>` 。

       ```bash
       AUTH_TOKEN=$(curl -X POST localhost:8101/acs/api/v1/auth/login \
       -d '{"uid":"<username>","password":"<password>"}' \
       -H 'Content-Type: application/json' | jq -r '.token')
       ```

 1. 下载证书捆绑包，需使用您的集群 URL (`<cluster-url>`) 。

       ```bash
       sudo curl -k -v https://<cluster-url>/ca/dcos-ca.crt -o /etc/ssl/certs/dcos-ca.crt
       ```

 1. 将每个专用代理的专用 IP 地址保存到 `PRIVATE_AGENT_IPS` 环境变量。

       ```bash
       PRIVATE_AGENT_IPS=$(curl -sS --cacert /etc/ssl/certs/dcos-ca.crt \
       -H "Authorization: token=$AUTH_TOKEN" https://leader.mesos:5050/slaves | jq '.slaves[] | select(.reserved_resources.slave_public == null) | .hostname' | tr -d '"');
       ```

1. 复制 `docker.tar.gz` 文件到每个专用代理的 `/home/core` 目录。

   ```bash
   for i in $PRIVATE_AGENT_IPS; do scp -o StrictHostKeyChecking=no docker.tar.gz core@$i:~/docker.tar.gz ; done
   ```
# 第 5 步 - 创建服务帐户密钥
在此步骤中，为 Marathon 服务帐户创建密钥，并存储在密钥存储库中。创建密钥 (`<path-to-secret-name>`) for your service account. The secret will contain the private key (`<private-key>.pem`) and the name of the service account (`<service-account-id>`).

### 已禁用

```bash
dcos security secrets create-sa-secret <private-key>.pem <service-account-id> <path-to-secret-name>
```

### 宽容

```bash
dcos security secrets create-sa-secret <private-key>.pem <service-account-id> <path-to-secret-name>
```

### 严格

```bash
dcos security secrets create-sa-secret --strict <private-key>.pem <service-account-id> <path-to-secret-name>
```  

#### 建议

- 查看您的密钥，确保其包含正确的服务帐户 ID、私钥和 `login_endpoint` URL。如果是 `strict` 模式，应为 HTTPS，如果是 `disabled` 或 `permissive` 模式，则应为 HTTP。如果 URL 不正确，尝试 [升级 DC/OS Enterprise CLI](/cn/1.11/cli/enterprise-cli/#ent-cli-upgrade)，删除密钥，并重新创建。可以使用此命令查看内容：

   ```bash
   dcos security secrets list /
   ```

 或者，如果已安装 [jq 1.5 或更高版本](https://stedolan.github.io/jq/download)，就可以使用以下命令：

   ```bash
   dcos security secrets get /momee-serv-group/momee-serv-group-service/<secret-name> --json | jq -r .value | jq
   ```

- 从文件系统中删除私钥文件，防止恶意者利用私钥通过 DC/OS 身份认证。

# 第 6 步 - 分配权限（仅限严格模式）
在此步骤中，权限被分配至 Marathon-on-Marathon 实例。在严格模式下需要权限，而在其他安全模式将其忽略即可。

| 安全模式 | 权限 |
|---------------|----------------------|
| 禁用 | 不可用 |
| 宽容 | 不可用 |
| 严格 | 必填 |

所有 CLI 命令也可通过 [IAM API](/cn/1.11/security/ent/iam-api/) 执行。

授予服务帐户 `<service-account-id>` 允许启动将作为Linux用户执行的Mesos任务 `nobody`。
要允许作为不同 Linux 用户执行任务，请将 `nobody` 替换为该用户的 Linux 用户 ID。例如，如需以 Linux 用户 `bob` 身份启动任务，请将 `nobody` 替换为以下的 `bob`。
请注意， `nobody` 和 `root` 是默认出现在所有代理上的，但如果指定自定义 `bob` 用户，必须在可以执行这些任务的每个代理上手动创建（使用 `adduser` 或类似实用程序）。

```bash
dcos security org users grant <service-account-id> dcos:mesos:master:task:user:nobody create --description "Tasks can execute as Linux user nobody"
dcos security org users grant <service-account-id> dcos:mesos:master:framework:role:<myrole> create --description "Controls the ability of <myrole> to register as a framework with the Mesos master"
dcos security org users grant <service-account-id> dcos:mesos:master:reservation:role:<myrole> create --description "Controls the ability of <myrole> to reserve resources"
dcos security org users grant <service-account-id> dcos:mesos:master:volume:role:<myrole> create --description "Controls the ability of <myrole> to access volumes"
dcos security org users grant <service-account-id> dcos:mesos:master:reservation:principal:<service-account-id> delete --description "Controls the ability of <service-account-id> to reserve resources"
dcos security org users grant <service-account-id> dcos:mesos:master:task:app_id:/ create --description "Controls the ability to launch tasks"
dcos security org users grant <service-account-id> dcos:mesos:master:volume:principal:<service-account-id> delete --description "Controls the ability of <service-account-id> to access volumes"
```

# 第 7 步 - 安装具有分配角色的非本地 Marathon 实例
在此步骤中，非本地 Marathon 实例安装在 DC/OS上，并分配了 Mesos 角色。

1. 创建自定义 JSON 配置文件并另存为 `config.json`。此文件用于安装自定义非本地 Marathon 实例。JSON 文件内容因您的 [安全模式](/cn/1.11/security/ent/#security-modes) 而有所不同。将这些示例中的变量替换为您的具体信息：

   | 变量 | 描述 |
   |--------------------------|--------------------------------------------|
   | `<non-native-marathon>` | 非本地 Marathon 框架名称 |
   | `<service-account-id>` | 非本地 Marathon 服务账户 |
   | `<secret-name>` | 密钥 |
   | `<myrole>` | Mesos 角色 |
   | `<your-repo>` | 专用 Docker 注册表存储库 |
   | `<your-tag>` | Docker 标签 |
   | `<linux-user>` | Linux user  `核心` or `centos' |

 ### 已禁用

   ```json
   {  
   "id":"/<non-native-marathon>",
   "cmd":"cd $MESOS_SANDBOX && LIBPROCESS_PORT=$PORT1 && /marathon/bin/start --default_accepted_resource_roles \"*,<myrole>\" --enable_features \"vips,task_killing,external_volumes,secrets,gpu_resources\" --framework_name <non-native-marathon> --hostname $LIBPROCESS_IP --http_port $PORT0 --master zk://master.mesos:2181/mesos --max_tasks_per_offer 1 --mesos_leader_ui_url /mesos --mesos_role <myrole>  --zk zk://master.mesos:2181/universe/<non-native-marathon> --mesos_user nobody --mesos_authentication --mesos_authentication_principal <service-account-id>",
   "user":"nobody",
   "cpus":2,
   "mem":4096,
   "disk":0,
   "instances":1,
   "constraints":[  
      [  
         "hostname",
         "UNIQUE"
      ]
   ],
   "container":{  
      "type":"DOCKER",
      "docker":{  
         "image":"<your-repo>/marathon-dcos-ee:<your-tag>",
         "network":"HOST",
         "privileged":false,
         "parameters":[  

         ],
         "forcePullImage":false
      },
      "volumes":[  
         {  
            "containerPath":"/opt/mesosphere",
            "hostPath":"/opt/mesosphere",
            "mode":"RO"
         }
      ]
   },
   "env":{  
      "JVM_OPTS":"-Xms256m -Xmx2g",
      "DCOS_STRICT_SECURITY_ENABLED":"false",
      "DCOS_SERVICE_ACCOUNT_CREDENTIAL_TOFILE":{  
         "secret":"service-credential"
      },
      "MESOS_AUTHENTICATEE":"com_mesosphere_dcos_ClassicRPCAuthenticatee",
      "MESOS_MODULES":"file:///opt/mesosphere/etc/mesos-scheduler-modules/dcos_authenticatee_module.json",
      "MESOS_NATIVE_JAVA_LIBRARY":"/opt/mesosphere/lib/libmesos.so",
      "MESOS_VERBOSE":"true",
      "GLOG_v":"2",
      "PLUGIN_ACS_URL":"http://master.mesos",
      "PLUGIN_AUTHN_MODE":"dcos/jwt+anonymous",
      "PLUGIN_FRAMEWORK_TYPE":"marathon"
   },
   "healthChecks":[  
      {  
         "path":"/ping",
         "protocol":"HTTP",
         "portIndex":0,
         "gracePeriodSeconds":1800,
         "intervalSeconds":10,
         "timeoutSeconds":5,
         "maxConsecutiveFailures":3,
         "ignoreHttp1xx":false
      }
   ],
   "secrets":{  
      "service-credential":{  
         "source":"<path-to-secret-name>"
      }
   },
   "labels":{  
      "DCOS_SERVICE_NAME":"<non-native-marathon>",
      "DCOS_SERVICE_PORT_INDEX":"0",
      "DCOS_SERVICE_SCHEME":"http"
   },
   "portDefinitions":[  
      {  
         "port":0,
         "name":"http"
      },
      {  
         "port":0,
         "name":"libprocess"
      }
   ],
   "fetch":[  
      {  
         "uri":"file:///home/<linux-user>/docker.tar.gz"
      }
   ]
   }
   ```   

 ### 宽容

   ```json
   {  
   "id":"/<non-native-marathon>",
   "cmd":"cd $MESOS_SANDBOX && LIBPROCESS_PORT=$PORT1 && /marathon/bin/start --default_accepted_resource_roles \"*,<myrole>\" --enable_features \"vips,task_killing,external_volumes,secrets,gpu_resources\" --framework_name <non-native-marathon> --hostname $LIBPROCESS_IP --http_port $PORT0 --master zk://master.mesos:2181/mesos --max_tasks_per_offer 1 --mesos_leader_ui_url /mesos --mesos_role <myrole>  --zk zk://master.mesos:2181/universe/<non-native-marathon> --mesos_user nobody --mesos_authentication --mesos_authentication_principal <service-account-id>",
   "user":"nobody",
   "cpus":2,
   "mem":4096,
   "disk":0,
   "instances":1,
   "constraints":[  
      [  
         "hostname",
         "UNIQUE"
      ]
   ],
   "container":{  
      "type":"DOCKER",
      "docker":{  
         "image":"<your-repo>/marathon-dcos-ee:<your-tag>",
         "network":"HOST",
         "privileged":false,
         "parameters":[  

         ],
         "forcePullImage":false
      },
      "volumes":[  
         {  
            "containerPath":"/opt/mesosphere",
            "hostPath":"/opt/mesosphere",
            "mode":"RO"
         }
      ]
   },
   "env":{  
      "JVM_OPTS":"-Xms256m -Xmx2g",
      "DCOS_STRICT_SECURITY_ENABLED":"false",
      "DCOS_SERVICE_ACCOUNT_CREDENTIAL_TOFILE":{  
         "secret":"service-credential"
      },
      "MESOS_AUTHENTICATEE":"com_mesosphere_dcos_ClassicRPCAuthenticatee",
      "MESOS_MODULES":"file:///opt/mesosphere/etc/mesos-scheduler-modules/dcos_authenticatee_module.json",
      "MESOS_NATIVE_JAVA_LIBRARY":"/opt/mesosphere/lib/libmesos.so",
      "MESOS_VERBOSE":"true",
      "GLOG_v":"2",
      "PLUGIN_ACS_URL":"http://master.mesos",
      "PLUGIN_AUTHN_MODE":"dcos/jwt+anonymous",
      "PLUGIN_FRAMEWORK_TYPE":"marathon"
   },
   "healthChecks":[  
      {  
         "path":"/ping",
         "protocol":"HTTP",
         "portIndex":0,
         "gracePeriodSeconds":1800,
         "intervalSeconds":10,
         "timeoutSeconds":5,
         "maxConsecutiveFailures":3,
         "ignoreHttp1xx":false
      }
   ],
   "secrets":{  
      "service-credential":{  
         "source":"<path-to-secret-name>"
      }
   },
   "labels":{  
      "DCOS_SERVICE_NAME":"<non-native-marathon>",
      "DCOS_SERVICE_PORT_INDEX":"0",
      "DCOS_SERVICE_SCHEME":"http"
   },
   "portDefinitions":[  
      {  
         "port":0,
         "name":"http"
      },
      {  
         "port":0,
         "name":"libprocess"
      }
   ],
   "fetch":[  
      {  
         "uri":"file:///home/<linux-user>/docker.tar.gz"
      }
   ]
   }
   ```

 ### 严格

   ```json
   {  
   "id":"/<non-native-marathon>",
   "cmd":"cd $MESOS_SANDBOX && LIBPROCESS_PORT=$PORT1 && /marathon/bin/start --default_accepted_resource_roles \"*,<myrole>\" --enable_features \"vips,task_killing,external_volumes,secrets,gpu_resources\" --framework_name <non-native-marathon> --hostname $LIBPROCESS_IP --http_port $PORT0 --master zk://master.mesos:2181/mesos --max_tasks_per_offer 1 --mesos_leader_ui_url /mesos --mesos_role <myrole>  --zk zk://master.mesos:2181/universe/<non-native-marathon> --mesos_user nobody --mesos_authentication --mesos_authentication_principal <service-account-id>",
   "user":"nobody",
   "cpus":2,
   "mem":4096,
   "disk":0,
   "instances":1,
   "constraints":[  
      [  
         "hostname",
         "UNIQUE"
      ]
   ],
   "container":{  
      "type":"DOCKER",
      "docker":{  
         "image":"<your-repo>/marathon-dcos-ee:<your-tag>",
         "network":"HOST",
         "privileged":false,
         "parameters":[  

         ],
         "forcePullImage":false
      },
      "volumes":[  
         {  
            "containerPath":"/opt/mesosphere",
            "hostPath":"/opt/mesosphere",
            "mode":"RO"
         }
      ]
   },
   "env":{  
      "JVM_OPTS":"-Xms256m -Xmx2g",
      "DCOS_STRICT_SECURITY_ENABLED":"true",
      "DCOS_SERVICE_ACCOUNT_CREDENTIAL_TOFILE":{  
         "secret":"service-credential"
      },
      "MESOS_AUTHENTICATEE":"com_mesosphere_dcos_ClassicRPCAuthenticatee",
      "MESOS_MODULES":"file:///opt/mesosphere/etc/mesos-scheduler-modules/dcos_authenticatee_module.json",
      "MESOS_NATIVE_JAVA_LIBRARY":"/opt/mesosphere/lib/libmesos.so",
      "MESOS_VERBOSE":"true",
      "GLOG_v":"2",
      "PLUGIN_ACS_URL":"https://master.mesos",
      "PLUGIN_AUTHN_MODE":"dcos/jwt",
      "PLUGIN_FRAMEWORK_TYPE":"marathon"
   },
   "healthChecks":[  
      {  
         "path":"/",
         "protocol":"HTTP",
         "portIndex":0,
         "gracePeriodSeconds":1800,
         "intervalSeconds":10,
         "timeoutSeconds":5,
         "maxConsecutiveFailures":3,
         "ignoreHttp1xx":false
      }
   ],
   "secrets":{  
      "service-credential":{  
         "source":"<path-to-secret-name>"
      }
   },
   "labels":{  
      "DCOS_SERVICE_NAME":"<non-native-marathon>",
      "DCOS_SERVICE_PORT_INDEX":"0",
      "DCOS_SERVICE_SCHEME":"http"
   },
   "portDefinitions":[  
      {  
         "port":0,
         "name":"http"
      },
      {  
         "port":0,
         "name":"libprocess"
      }
   ],
   "fetch":[  
      {  
         "uri":"file:///home/<linux-user>/docker.tar.gz"
      }
   ]
   }
   ```

1. 部署 Marathon 实例。

    ```bash
    dcos marathon app add config.json
    ```

# 第 8 步 - 授予用户对非本地 Marathon 的访问权限
在此步骤中，用户被授权访问非本地 Marathon 实例。

1. 以具有 `superuser` 权限的用户身份登录 DC/OS Web 界面。

 ![登录](/cn/1.11/img/gui-installer-login-ee.gif)

 图 1. DC/OS Web 界面登录

1. 选择 **Organization** 并选择 **Users** 或 **Groups**。

1. 选择要授予权限的用户名或组名。

 ![添加 cory 权限](/cn/1.11/img/services-tab-user.png)

 图 2. 选择用户以获取权限

1. 在 **权限** 选项卡中，单击 **添加权限**。

1. 单击 **INSERT PERMISSION STRING** 以切换对话框。

 ![添加权限](/cn/1.11/img/services-tab-user3.png)

 图 3. 添加权限字符串

1. 在 **Permissions Strings** 字段中复制并粘贴权限。根据您的[安全模式]选择权限字符串(/cn/1.11/security/ent/#security-modes)。

 ### 已禁用

 - 完整权限

        ```bash
        dcos:adminrouter:service:<service-name> full
        dcos:service:marathon:<service-name>:services:/ full
        dcos:adminrouter:ops:mesos full
        dcos:adminrouter:ops:slave full
        ```

 - 禁用安全模式不支持访问单个服务或组。

 ### 宽容

 - **完整权限**

        ```bash
        dcos:adminrouter:service:<service-name> full
        dcos:service:marathon:<service-name>:services:/ full
        dcos:adminrouter:ops:mesos full
        dcos:adminrouter:ops:slave full
        ```

 - **访问单个服务或组**

 指定服务或组 (`<service-or-group>`) and action (`<action>`). Actions can be either `创建`, `读取`, `更新`, `删除`, or `完整`. To permit more than one operation, use a comma to separate them, for example: `dcos:service:marathon:<service-name>:services:/<service-or-group> read,update`。

       ```bash
       dcos:adminrouter:service:<service-name> full
       dcos:service:marathon:<service-name>:services:/<service-or-group> <action>
       dcos:adminrouter:ops:mesos full
       dcos:adminrouter:ops:slave full
       ```

 ### 严格

 - **完整权限**

        ```bash
        dcos:adminrouter:service:<service-name> full
        dcos:service:marathon:<service-name>:services:/ full
        dcos:adminrouter:ops:mesos full
        dcos:adminrouter:ops:slave full
        dcos:mesos:agent:executor:app_id:/ read
        dcos:mesos:agent:framework:role:<myrole> read
        dcos:mesos:agent:sandbox:app_id:/ read
        dcos:mesos:agent:task:app_id:/ read
        dcos:mesos:master:executor:app_id:/ read
        dcos:mesos:master:framework:role:<myrole> read
        dcos:mesos:master:task:app_id:/ read
        ```  

 - **访问单个服务或组**

 指定服务或组 (`<service-or-group>`), service name (`<service-name>`), role (`<myrole>`), and action (`<action>`). Actions can be either `创建`, `读取`, `更新`, `删除`, or `完整`. To permit more than one operation, use a comma to separate them, for example: `dcos:service:marathon:<service-name>:services:/<service-or-group> read,update`。

       ```bash
       dcos:adminrouter:service:<service-name> full
       dcos:service:marathon:<service-name>:services:/<service-or-group> <action>
       dcos:adminrouter:ops:mesos full
       dcos:adminrouter:ops:slave full
       dcos:mesos:agent:executor:app_id:/<service-or-group> read
       dcos:mesos:agent:framework:role:<myrole> read
       dcos:mesos:agent:sandbox:app_id:/<service-or-group> read
       dcos:mesos:agent:task:app_id:/<service-or-group> read
       dcos:mesos:master:executor:app_id:/<service-or-group> read
       dcos:mesos:master:framework:role:<myrole> read
       dcos:mesos:master:task:app_id:/<service-or-group> read
       ```


1. 单击 **ADD PERMISSIONS**，然后单击 **Close**。

# 第 9 步 - 访问非本地 Marathon 实例
在此步骤中，您以授权用户身份登录非本地 Marathon DC/OS 服务。

1. 启动非本地 Marathon 接口，位于：`http://<master-public-ip>/service/<service-name>/`.

1. 输入您的用户名和密码，然后单击 **登录**。

 ![Log in DC/OS](/cn/1.11/img/gui-installer-login-ee.gif)

 图 4. 成功了！

 ![Marathon on Marathon](/cn/1.11/img/mom-marathon-gui.png)

 图 5. 登录 Marathon 

# 后续步骤

在部署具有唯一 Mesos 角色的非本地 Marathon 实例之后，您可能希望利用配额、静态保留或动态保留，为非本地 Marathon 实例保留一些资源。

- 一些任务完成并产生资源后，动态保留将生效。或者可以关闭某些任务以释放资源。
- 静态保留需要重新启动代理并关闭其所有任务。

如需更多详情，请参阅 Apache Mesos 文档。

- [保留](http://mesos.apache.org/documentation/latest/reservation/)
- [配额](https://mesos.apache.org/documentation/latest/quota/)
