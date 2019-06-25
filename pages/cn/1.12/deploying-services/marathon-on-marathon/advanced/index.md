---
layout: layout.pug
navigationTitle: 使用自定义 Marathon 和安全功能部署服务
title: 使用自定义 Marathon 和安全功能部署服务
menuWeight: 40
excerpt: 使用高级非本地 Marathon 实例
enterprise: true

---

本专题描述了如何部署具有独立角色、保留、配额和安全功能的非本地 Marathon 实例  (Marathon on Marathon) 。高级非本地 Marathon 程序只能在您需要 [密钥](/cn/1.12/security/ent/secrets/) 或细粒度 ACL 时使用。否则，请使用 [基本步骤](/cn/1.12/deploying-services/marathon-on-marathon/basic/)。

对于本步骤，我们假设您已从支持团队成员获得了 Marathon 的企业版。如果您仍然需要企业工件，则需要首先通过 [Mesosphere 支持门户](https://support.mesosphere.com/s/) 提交故障单。企业工件作为 Docker 镜像文件提供，并包含 Marathon 以及 Marathon 插件，可启用 DC/OS Enterprise 功能 - 例如密钥和细分访问权限控制。

**先决条件：**

- DC/OS 和 DC/OS CLI [已安装](/cn/1.12/installing/)。
- [DC/OS Enterprise CLI 0.4.14 或更高版本](/cn/1.12/cli/enterprise-cli/#ent-cli-install)。
- 每个专用 DC/OS 代理可以通过网络访问的专用 Docker 注册表。可以遵循 [以下](/cn/1.12/deploying-services/private-docker-registry/) 关于如何在 Marathon 中设置，或使用其他选项的说明（如 [DockerHub](https://hub.docker.com/)、[Amazon EC2 容器注册表](https://aws.amazon.com/ecr/)和 [Quay](https://quay.io/)）。
- 自定义非本机 Marathon 镜像[部署在您的专用 Docker 注册表中](/cn/1.12/deploying-services/private-docker-registry#tarball-instructions)。通过 [支持门户](https://support.mesosphere.com) 提交故障单以获取企业 Marathon 镜像文件。
- 您必须以超级用户身份登录。
- 对群集的 SSH 访问。

<a name="variables-in-example"></a>
**此示例中的变量**

整个页面将指示您调用命令或执行使用特定于群集的值的操作。我们使用 `${VARIABLE}` 表示法表示这些特定于群集的值；请将以下变量替换为您的群集的合适值。

下表包含本页所用的所有变量：

| 变量 | 描述 |
|--------------------------|--------------------------------------------|
| `${MESOS_ROLE}` | 新 Marathon 实例将使用的 [Mesos 角色](https://mesos.apache.org/documentation/latest/roles/)的名称。该名称应该全部小写，并且是有效的 [Mesos 角色名称](https://mesos.apache.org/documentation/latest/roles/#invalid-role-names)，例如 `"marathon_ee"`。|
| `${SERVICE_ACCOUNT}` | Marathon 用来和 DC/OS 中的其他服务进行通信的 [服务帐户](/cn/1.12/security/ent/service-auth/) 的名称。名称应仅包含字母、数字、`@`、`.`、`\`、`_` 和 `-`。例如 `"marathon_user_ee"` |
| `${MARATHON_INSTANCE_NAME}` | 新 Marathon 实例的服务名称，由根 Marathon 实例启动。这应该是有效的 [Marathon 服务名称](https://mesosphere.github.io/marathon/docs/application-basics.html)，例如 `"mom_ee"`。|
| `${SERVICE_ACCOUNT_SECRET}` | [密钥存储库](/cn/1.12/security/ent/secrets/)中的密钥路径，用于保存 Marathon 将使用的私钥以及要在 DC/OS 上进行身份认证的 `${SERVICE_ACCOUNT}` 帐户。此名称 **不得**包含一个开头的 `/`。有效示例： `"marathon_user_ee_secret"` |
| `${DOCKER_REGISTRY_SECRET}` | [密钥](/cn/1.12/security/ent/secrets/)的名称，用于保存从专用注册表中获取 Marathon Docker 镜像的凭据。此名称 **不得**包含一个开头的 `/`。有效示例： `"registry_secret"`。 |
| `${PRIVATE_KEY}` | PEM 格式的私钥文件的路径（在本地文件系统中，不确定是否存在），最好以 `.pem` 为后缀 |
| `${PUBLIC_KEY}` | PEM 格式的公钥文件的路径（在本地文件系统中，不确定是否存在），最好以 `.pem` 为后缀 |
| `${MARATHON_IMAGE}` | **专用存储库中** 的 Marathon 镜像的名称，例如 `private-repo/marathon-dcos-ee`。|
| `${MARATHON_TAG}` | 要部署的 Marathon 版本的 Docker 镜像标记。例如 `v1.5.11_1.10.2` （0.11.0 或更高版本）。|

<p class="message--note"><strong>注意：</strong> 如果您使用的是 Mac OS 或 Linux 计算机，则可以在终端会话中预先定义上述大多数变量，只需将片段复制并粘贴到终端中即可.</p>

```
set -a
MESOS_ROLE="..."
SERVICE_ACCOUNT="..."
BEGIN_PORT="..."
END_PORT="..."
MARATHON_INSTANCE_NAME="..."
SERVICE_ACCOUNT_SECRET="..."
DOCKER_REGISTRY_SECRET="..."
PRIVATE_KEY="..."
PUBLIC_KEY="..."
MARATHON_IMAGE="..."
MARATHON_TAG="..."
```


# 步骤 1：准备

在以下步骤中，我们假设您已经：

1. 将 Marathon 企业镜像推送到您的专用注册表[（说明）] (/cn/1.12/deploying-services/private-docker-registry#tarball-instructions)，名称为 `${MARATHON_IMAGE}:${MARATHON_TAG}`。
1. 将您的专用 Docker 凭据存储在密钥存储库 [（说明）] (/cn/1.12/deploying-services/private-docker-registry/#referencing-private-docker-registry-credentials-in-the-secrets-store-enterprise)中，名称为 `${DOCKER_REGISTRY_SECRET}`。

 <p class="message--warning"><strong>警告：</strong> 密钥的名称应该位于根路径（例如 <code>/some-secret-name</code>）中，或者以应用程序的名称为前缀（例如 <code>/${MARATHON_INSTANCE_NAME}/some-secret-name</code>）。如果不这样做，将使根 Marathon 无法读取密钥值，并且无法启动自定义 Marathon-on-Marathon 实例。</p>

# 步骤 2：创建 Marathon 服务帐户
本步骤创建了 Marathon [服务账户](/cn/1.12/security/ent/service-auth/) 。Marathon 将使用此帐户对其余 DC/OS 组件进行身份认证。稍后授予此帐户的权限将定义允许 Marathon 执行的操作。

Marathon 服务账户可能是可选或必填项，具体取决于您的 [安全模式](/cn/1.12/security/ent/#security-modes)。

| 安全模式 |  Marathon 服务帐户 |
|---------------|------------|
| 宽容 | 可选 |
| 严格 | 必填 |

1. 创建 2048 位 RSA 公私密钥对 (`${PRIVATE_KEY}` 和 `${PUBLIC_KEY}`) 并将值分别保存到当前目录中的单独文件中。

   使用以下命令，我们创建一个公私密钥对。公钥将用于创建 Marathon 服务帐户。我们将私钥存储在 [密钥存储库] (/cn/1.12/security/ent/secrets/) 然后将其传递至 Marathon，供其进行自我授权。

    ```bash
    dcos security org service-accounts keypair ${PRIVATE_KEY} ${PUBLIC_KEY}
    ```

1. 使用我们生成的公钥（`${PUBLIC_KEY}`）创建一个名为 `${SERVICE_ACCOUNT}` 的新服务帐户。

    ```bash
    dcos security org service-accounts create -p ${PUBLIC_KEY} -d "Marathon-on-Marathon User" ${SERVICE_ACCOUNT}
    ```


# 步骤 3：创建服务帐户密钥
在此步骤中，为 Marathon 服务帐户创建密钥，并存储在密钥存储库中。

 创建的密钥 (`${SERVICE_ACCOUNT_SECRET}`) 将包含私钥 (`${PRIVATE_KEY}`) 和服务帐户名称 (`${SERVICE_ACCOUNT}`)。Marathon 将使用此信息对 DC/OS 进行身份认证。

 ## {.tabs}

 ### 宽容

  ```bash
  dcos security secrets create-sa-secret ${PRIVATE_KEY} ${SERVICE_ACCOUNT} ${SERVICE_ACCOUNT_SECRET}
  ```

 ### 严格

  ```bash
  dcos security secrets create-sa-secret --strict ${PRIVATE_KEY} ${SERVICE_ACCOUNT} ${SERVICE_ACCOUNT_SECRET}
  ```

 #### 建议

 * 使用以下命令确保您的密钥已就绪：

     ```bash
     dcos security secrets list /
     ```

 * 查看您的密钥，确保其包含正确的服务帐户 ID、私钥和 `login_endpoint` URL。如果是 `strict` 模式，应为 HTTPS，如果是 `permissive` 模式，则应为 HTTP。如果 URL 不正确，尝试 [升级 DC/OS Enterprise CLI](/cn/1.12/cli/enterprise-cli/#ent-cli-upgrade)，删除密钥，并重新创建。

   您可以使用此命令查看内容（需要安装 [jq 1.5 或更高版本](https://stedolan.github.io/jq/download)）：

      ```bash
      dcos security secrets get ${SERVICE_ACCOUNT_SECRET} --json | jq -r .value | jq
      ```

 * 从文件系统中删除私钥文件，防止不法之徒利用私钥通过 DC/OS 身份认证。


# 步骤 4：分配权限（仅限严格模式）
在此步骤中，权限被分配至 Marathon-on-Marathon 实例。在严格模式下需要权限，而在其他安全模式将其忽略即可。

| 安全模式 | 权限 |
|---------|----------|
| 宽容 | 不可用 |
| 严格 | 必填 |

所有 CLI 命令也可通过 [IAM API](/cn/1.12/security/ent/iam-api/) 执行。

授予服务帐户 `${SERVICE_ACCOUNT}` 权限，以启动将作为 Linux 用户 `nobody` 执行的 Mesos 任务。

要允许作为不同 Linux 用户执行任务，请将 `nobody` 替换为该用户的 Linux 用户名。例如，如需以 Linux 用户 `bob` 身份启动任务，请将 `nobody` 替换为以下的 `bob`。

请注意， `nobody` 和 `root` 用户是默认出现在所有代理上的；如果指定自定义用户 (例如，`bob`)，那么用户 `bob` 就需要在可以执行这些任务的每个代理上手动创建（使用 Linux `adduser` 或类似实用程序）。

```bash
dcos security org users grant ${SERVICE_ACCOUNT} dcos:mesos:master:task:user:nobody create --description "Tasks can execute as Linux user nobody"
dcos security org users grant ${SERVICE_ACCOUNT} dcos:mesos:master:framework:role:${MESOS_ROLE} create --description "Controls the ability of ${MESOS_ROLE} to register as a framework with the Mesos master"
dcos security org users grant ${SERVICE_ACCOUNT} dcos:mesos:master:reservation:role:${MESOS_ROLE} create --description "Controls the ability of ${MESOS_ROLE} to reserve resources"
dcos security org users grant ${SERVICE_ACCOUNT} dcos:mesos:master:volume:role:${MESOS_ROLE} create --description "Controls the ability of ${MESOS_ROLE} to access volumes"
dcos security org users grant ${SERVICE_ACCOUNT} dcos:mesos:master:reservation:principal:${SERVICE_ACCOUNT} delete --description "Controls the ability of ${SERVICE_ACCOUNT} to reserve resources"
dcos security org users grant ${SERVICE_ACCOUNT} dcos:mesos:master:task:app_id:/ create --description "Controls the ability to launch tasks"
dcos security org users grant ${SERVICE_ACCOUNT} dcos:mesos:master:volume:principal:${SERVICE_ACCOUNT} delete --description "Controls the ability of ${SERVICE_ACCOUNT} to access volumes"
```

# 步骤 5：安装具有分配角色 {.tabs} 的非本地 Marathon 实例
在此步骤中，非本地 Marathon 实例安装在 DC/OS上，并分配了 Mesos 角色。

创建一个自定义 JSON 配置，用于安装自定义非本机 Marathon 实例。JSON 文件内容因您的 [安全模式] 而有所不同(/cn/1.12/security/ent/#security-modes)。

 确保使用正确的值替换 JSON 文件中的所有 `${VARIABLES}`。

 或者，如果已在终端会话中导出变量（如 [变量部分] (#variables-in-example) 中所述），则可以使用以下命令自动将所有替代变量替换为其导出值。所得文件将保存为 `marathon-filled.json`：

   ```bash
   perl -p -e 's/\$\{(\w+)\}/(exists $ENV{$1}?$ENV{$1}:"<missing-variable-$1>")/eg' < marathon.json > marathon-filled.json
   ```

 ## {.tabs}

 ### 宽容

 如果在 `permissive` 安全模式下运行群集，请使用以下 JSON 模板。不要忘记**替换**符合 `${VARIABLES}` 格式的所有环境变量：

   ```json
   {
   "id":"/${MARATHON_INSTANCE_NAME}",
   "cmd":"cd $MESOS_SANDBOX && LIBPROCESS_PORT=$PORT1 && /marathon/bin/start --default_accepted_resource_roles \"*,${MESOS_ROLE}\" --enable_features \"vips,task_killing,external_volumes,secrets,gpu_resources\" --framework_name ${MARATHON_INSTANCE_NAME} --hostname $LIBPROCESS_IP --http_port $PORT0 --master zk://master.mesos:2181/mesos --max_instances_per_offer 1 --mesos_leader_ui_url /mesos --mesos_role ${MESOS_ROLE}  --zk zk://master.mesos:2181/universe/${MARATHON_INSTANCE_NAME} --mesos_user nobody --mesos_authentication --mesos_authentication_principal ${SERVICE_ACCOUNT}",
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
      "type": "MESOS",
      "docker":{
         "image":"${MARATHON_IMAGE}:${MARATHON_TAG}",
         "pullConfig": {
               "secret": "docker-registry-credential"
         }
      }
   },
   "env":{
      "JVM_OPTS":"-Xms256m -Xmx2g",
      "DCOS_STRICT_SECURITY_ENABLED":"false",
      "DCOS_SERVICE_ACCOUNT_CREDENTIAL":{
         "secret":"service-credential"
      },
      "MESOS_AUTHENTICATEE":"com_mesosphere_dcos_ClassicRPCAuthenticatee",
      "MESOS_MODULES":"{\"libraries\":[{\"file\":\"/opt/libmesos-bundle/lib/libdcos_security.so\",\"modules\":[{\"name\":\"com_mesosphere_dcos_ClassicRPCAuthenticatee\"}]}]}",
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
         "source":"${SERVICE_ACCOUNT_SECRET}"
      },
      "docker-registry-credential": {
         "source":"${DOCKER_REGISTRY_SECRET}"
      }
   },
   "labels":{
      "DCOS_SERVICE_NAME":"${MARATHON_INSTANCE_NAME}",
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
   ]
   }
   ```

 ### 严格

 如果在 `strict` 安全模式下运行群集，请使用以下 JSON 模板。不要忘记**替换**符合 `${VARIABLES}` 格式的所有环境变量：

   ```json
   {
   "id":"/${MARATHON_INSTANCE_NAME}",
   "cmd":"cd $MESOS_SANDBOX && LIBPROCESS_PORT=$PORT1 && /marathon/bin/start --default_accepted_resource_roles \"*,${MESOS_ROLE}\" --enable_features \"vips,task_killing,external_volumes,secrets,gpu_resources\" --framework_name ${MARATHON_INSTANCE_NAME} --hostname $LIBPROCESS_IP --http_port $PORT0 --master zk://master.mesos:2181/mesos --max_instances_per_offer 1 --mesos_leader_ui_url /mesos --mesos_role ${MESOS_ROLE}  --zk zk://master.mesos:2181/universe/${MARATHON_INSTANCE_NAME} --mesos_user nobody --mesos_authentication --mesos_authentication_principal ${SERVICE_ACCOUNT}",
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
      "type": "MESOS",
      "docker":{
         "image":"${MARATHON_IMAGE}:${MARATHON_TAG}",
         "pullConfig": {
               "secret": "docker-registry-credential"
         }
      }
   },
   "env":{
      "JVM_OPTS":"-Xms256m -Xmx2g",
      "DCOS_STRICT_SECURITY_ENABLED":"true",
      "DCOS_SERVICE_ACCOUNT_CREDENTIAL":{
         "secret":"service-credential"
      },
      "MESOS_AUTHENTICATEE":"com_mesosphere_dcos_ClassicRPCAuthenticatee",
      "MESOS_MODULES":"{\"libraries\":[{\"file\":\"/opt/libmesos-bundle/lib/libdcos_security.so\",\"modules\":[{\"name\":\"com_mesosphere_dcos_ClassicRPCAuthenticatee\"}]}]}",
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
         "source":"${SERVICE_ACCOUNT_SECRET}"
      },
      "docker-registry-credential": {
         "source":"${DOCKER_REGISTRY_SECRET}"
      }
   },
   "labels":{
      "DCOS_SERVICE_NAME":"${MARATHON_INSTANCE_NAME}",
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
   ]
   }
   ```

部署 Marathon 实例，传递您在上一步中创建的 JSON 文件。

   ```bash
   dcos marathon app add marathon-filled.json
   ```

# 步骤 6：授予用户对非本地 Marathon 的访问权限
到目前为止，您的新 Marathon 实例只能由 DC/OS 超级用户访问。为了提供对常规用户的访问权限，您需要根据群集安全模式明确授予他们访问权限：

 ## {.tabs}

 ### 宽容

 对于您要授予访问权限的每个 `${USER_ACCOUNT}`，是否在 `permissive` 安全模式下运行群集，取决于您要提供的权限类型：

 - 为在新创建的 Marathon 上运行的任何服务（或组）提供**完全**权限：

    ```bash
    # Access to the new Marathon service under `/service/<name>` URL
    dcos security org users grant ${USER_ACCOUNT} dcos:adminrouter:service:${MARATHON_INSTANCE_NAME} full
    dcos security org users grant ${USER_ACCOUNT} dcos:service:marathon:${MARATHON_INSTANCE_NAME}:services:/ full

    # Access to the Mesos tasks and their sandbox
    dcos security org users grant ${USER_ACCOUNT} dcos:adminrouter:ops:mesos full
    dcos security org users grant ${USER_ACCOUNT} dcos:adminrouter:ops:slave full

    # (Optionally) Access to the Marathon instance that runs on the root
    # Marathon and can be controlled via the DC/OS UI
    dcos security org users grant ${USER_ACCOUNT} dcos:adminrouter:service:marathon full
    dcos security org users grant ${USER_ACCOUNT} dcos:service:marathon:marathon:services:/${MARATHON_INSTANCE_NAME} full
    ```

 - 向在新创建的 Marathon 上运行且名为 `${CHILD_SERVICE_NAME}` 的**个体**服务（或组）提供权限：

    ```bash
    # Access to the new Marathon service under `/service/<name>` URL
    dcos security org users grant ${USER_ACCOUNT} dcos:adminrouter:service:${MARATHON_INSTANCE_NAME} full
    dcos security org users grant ${USER_ACCOUNT} dcos:service:marathon:${MARATHON_INSTANCE_NAME}:services:/${CHILD_SERVICE_NAME} full

    # Access to the Mesos tasks and their sandbox
    dcos security org users grant ${USER_ACCOUNT} dcos:adminrouter:ops:mesos full
    dcos security org users grant ${USER_ACCOUNT} dcos:adminrouter:ops:slave full

    # (Optionally) Access to the Marathon instance that runs on the root
    # Marathon and can be controlled via the DC/OS UI
    dcos security org users grant ${USER_ACCOUNT} dcos:adminrouter:service:marathon full
    dcos security org users grant ${USER_ACCOUNT} dcos:service:marathon:marathon:services:/${MARATHON_INSTANCE_NAME} full
    ```

 ### 严格

 对于您要授予访问权限的每个 `${USER_ACCOUNT}`，是否在 `strict` 安全模式下运行群集，取决于您要提供的权限类型：

 - 为在新创建的 Marathon 上运行的任何服务（或组）提供**完全**权限：

    ```bash
    # Access to the new Marathon service under `/service/<name>` URL
    dcos security org users grant ${USER_ACCOUNT} dcos:adminrouter:service:${MARATHON_INSTANCE_NAME} full
    dcos security org users grant ${USER_ACCOUNT} dcos:service:marathon:${MARATHON_INSTANCE_NAME}:services:/ full

    # Access to the Mesos tasks and their sandbox
    dcos security org users grant ${USER_ACCOUNT} dcos:adminrouter:ops:mesos full
    dcos security org users grant ${USER_ACCOUNT} dcos:adminrouter:ops:slave full
    dcos security org users grant ${USER_ACCOUNT} dcos:mesos:agent:executor:app_id:/ read
    dcos security org users grant ${USER_ACCOUNT} dcos:mesos:agent:framework:role:${MESOS_ROLE} read
    dcos security org users grant ${USER_ACCOUNT} dcos:mesos:agent:sandbox:app_id:/ read
    dcos security org users grant ${USER_ACCOUNT} dcos:mesos:agent:task:app_id:/ read
    dcos security org users grant ${USER_ACCOUNT} dcos:mesos:master:executor:app_id:/ read
    dcos security org users grant ${USER_ACCOUNT} dcos:mesos:master:framework:role:${MESOS_ROLE} read
    dcos security org users grant ${USER_ACCOUNT} dcos:mesos:master:task:app_id:/ read

    # (Optionally) Access to the Marathon instance that runs on the root
    # Marathon and can be controlled via the DC/OS UI
    dcos security org users grant ${USER_ACCOUNT} dcos:adminrouter:service:marathon full
    dcos security org users grant ${USER_ACCOUNT} dcos:service:marathon:marathon:services:/${MARATHON_INSTANCE_NAME} full
    ```

 - 向在新创建的 Marathon 上运行且名为 `${CHILD_SERVICE_NAME}` 的**个体**服务（或组）提供权限：

    ```bash
    # Access to the new Marathon service under `/service/<name>` URL
    dcos security org users grant ${USER_ACCOUNT} dcos:adminrouter:service:${MARATHON_INSTANCE_NAME} full
    dcos security org users grant ${USER_ACCOUNT} dcos:service:marathon:${MARATHON_INSTANCE_NAME}:services:/${CHILD_SERVICE_NAME} full

    # Access to the Mesos tasks and their sandbox
    dcos security org users grant ${USER_ACCOUNT} dcos:adminrouter:ops:mesos full
    dcos security org users grant ${USER_ACCOUNT} dcos:adminrouter:ops:slave full
    dcos security org users grant ${USER_ACCOUNT} dcos:mesos:agent:executor:app_id:/${CHILD_SERVICE_NAME} read
    dcos security org users grant ${USER_ACCOUNT} dcos:mesos:agent:framework:role:${MESOS_ROLE} read
    dcos security org users grant ${USER_ACCOUNT} dcos:mesos:agent:sandbox:app_id:/${CHILD_SERVICE_NAME} read
    dcos security org users grant ${USER_ACCOUNT} dcos:mesos:agent:task:app_id:/${CHILD_SERVICE_NAME} read
    dcos security org users grant ${USER_ACCOUNT} dcos:mesos:master:executor:app_id:/${CHILD_SERVICE_NAME} read
    dcos security org users grant ${USER_ACCOUNT} dcos:mesos:master:framework:role:${MESOS_ROLE} read
    dcos security org users grant ${USER_ACCOUNT} dcos:mesos:master:task:app_id:/${CHILD_SERVICE_NAME} read

    # (Optionally) Access to the Marathon instance that runs on the root
    # Marathon and can be controlled via the DC/OS UI
    dcos security org users grant ${USER_ACCOUNT} dcos:adminrouter:service:marathon full
    dcos security org users grant ${USER_ACCOUNT} dcos:service:marathon:marathon:services:/${MARATHON_INSTANCE_NAME} full
    ```


# 步骤 7：访问非本地 Marathon 实例
在此步骤中，您以授权用户身份登录非本地 Marathon DC/OS 服务。

1. 启动非本地 Marathon 接口，位于：`http://<master-public-ip>/service/${SERVICE_ACCOUNT}/`。

1. 输入您的用户名和密码，然后单击 **登录**。

   ![Log in DC/OS](/1.12/img/LOGIN-EE-Modal_View-1_12.png)

   图 4. 成功了！

  
# 后续步骤

- 您可以使用以下命令将 DC/OS CLI 配置为与非本机 Marathon 实例进行交互：

   ```sh
   dcos config set marathon.url \
   $(dcos config show core.dcos_url)/service/${MARATHON_INSTANCE_NAME}
   ```

   现在，任何未来 `dcos marathon ...` 命令将瞄准您的新 Marathon 实例。

   要撤消此更改，请使用以下命令：

   ```sh
   dcos config unset marathon.url
   ```


# 已知常见问题

- 启动 Docker 容器时，用户 `nobody` 可能没有足够的权限来成功运行。例如，无法作为用户 `nobody` 启动 `nginx` Docker 容器，因为 `nobody` 没有 `nginx` 所需的 `/var/log` 的写入权限。

- 用户 `nobody` 在不同的系统上具有不同的 UID（在 coreos 上为 99，在 ubuntu 上为 65534）。根据代理的分布情况，您可能需要修改容器镜像以使 UID 匹配！使用用户 `bob` 时也是如此。

- 使用自定义用户（例如 `bob`）时，用户必须存在于代理中，或者使用容器时，则必须存在于容器内。

- 使用新用户（例如 `bob`）时，请记住授予 Marathon 服务帐户以此用户身份运行任务的权限。
