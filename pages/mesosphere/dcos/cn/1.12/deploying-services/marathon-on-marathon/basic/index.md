---
layout: layout.pug
navigationTitle: 使用自定义 Marathon 实例部署服务
title: 使用自定义 Marathon 实例部署服务
menuWeight: 39
excerpt: 使用基础非本地 Marathon 实例
enterprise: true
---

本专题描述了如何部署具有独立角色、保留和配额的非本地 Marathon 实例。此步骤不支持 [密钥](/mesosphere/dcos/cn/1.12/security/ent/secrets/) 或细粒度 ACL。如果需要这些功能，您必须使用自定义非本地 Marathon [程序](/mesosphere/dcos/cn/1.12/deploying-services/marathon-on-marathon/advanced/)。

**先决条件：**

- DC/OS 和 DC/OS CLI [已安装](/mesosphere/dcos/cn/1.12/installing/)。
- [DC/OS Enterprise CLI 0.4.14 或更高版本](/mesosphere/dcos/cn/1.12/cli/enterprise-cli/#ent-cli-install)。
- 您必须以超级用户身份登录。
- 对群集的 SSH 访问。

# 第 1 步 - 保留资源
在此步骤中，保留 Mesos 资源。选择 [静态](#static-reservations) 或 [动态](#dynamic-reservations) 保留的步骤。

## 静态保留

<p class="message--warning"><strong>警告：</strong>此步骤将关闭节点上运行的所有任务。</p>
</tr> 
</table>


1. [SSH](/mesosphere/dcos/cn/1.12/administering-clusters/sshcluster/) 到专用代理节点。

   ```bash
   dcos node ssh --master-proxy --mesos-id=<agent-id>
   ```

1. 导航至 `/var/lib/dcos` 并创建一个名为 `mesos-slave-common` ，且使用这些内容的文件，其中 `<myrole>` 是您的角色名称。
    ```bash
    MESOS_DEFAULT_ROLE='<myrole>'
    ```
1. 停止专用代理节点：
    ```bash
    sudo sh -c 'systemctl kill -s SIGUSR1 dcos-mesos-slave && systemctl stop dcos-mesos-slave'
    ```
1. 将节点重新添加到群集。
 1. 重新加载 `systemd` 配置。
        ```bash
        ﻿⁠⁠sudo systemctl daemon-reload
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
使用指定的 Mesos ID（`<mesos-id>`）、用户 ID（`<userid>`）、角色（`<myrole>`）和端口（`<begin-port>` 和 `<end-port>`）为非本机 Marathon 实例保留资源。

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
          "range": [
            {
              "begin": <begin-port>,
              "end": <end-port>
            }
          ]
        }
      }
    ]
  }
}' \
      -X POST "`dcos config show core.dcos_url`/mesos/api/v1"
```

# # 第 2 步 - 安装具有分配角色的非本地 Marathon 实例
在此步骤中，非本地 Marathon 实例安装在 DC/OS上，并分配了 Mesos 角色。

1. 创建自定义 JSON 配置文件并另存为 `marathon-config.json`。此文件用于安装自定义非本地 Marathon 实例。
    ```json
    {"marathon": {
     "mesos-role": "<myrole>",
     "role": "<myrole>",
     "default-accepted-resource-roles": "*,<myrole>"
     }
    }
     ```        
1. 通过指定的自定义 JSON 配置（`marathon-config.json`）安装来自 Universe 的 Marathon 包。
    ```bash
    dcos package install --options=marathon-config.json marathon
    ```
# 第 3 步 - 创建 Marathon 服务帐户
步骤创建了 Marathon 服务帐户。Marathon 服务账户可能是可选或必填项，具体取决于您的 [安全模式](/mesosphere/dcos/cn/1.12/security/ent/#security-modes)。

| 安全模式 |  Marathon 服务帐户 |
|---------------|----------------------|
| 宽容 | 可选 |
| 严格 | 必填 |

1. 创建一个 2048 位的 RSA 公私密钥对 (`<private-key>.pem` 和 `<public-key>.pem`) 并将值分别保存到当前目录中的单独文件中。

    ```bash
    dcos security org service-accounts keypair <private-key>.pem <public-key>.pem
    ```

1. 创建一个名为 `<service-account-id>` 的新服务帐户，并指定公钥（`<public-key>.pem`）。

    ```bash
    dcos security org service-accounts create -p <public-key>.pem -d "Non-native Marathon service account" <service-account-id>
    ```

# 第 4 步 - 分配权限（仅限严格模式）
在此步骤中，权限被分配至 Marathon-on-Marathon 实例。在严格模式下需要权限，而在宽容安全模式将其忽略即可。

所有 CLI 命令也可通过 [IAM API](/mesosphere/dcos/cn/1.12/security/ent/iam-api/) 执行。

| 安全模式 | 权限 |
|---------------|----------------------|
| 宽容 | 不可用 |
| 严格 | 必填 |


授予用户 `<uid>` 权限，启动作为 Linux 用户 `nobody` 执行的 Mesos 任务。
要允许作为不同 Linux 用户执行任务，请将 `nobody` 替换为该用户的 Linux 用户 ID。例如，如需以 Linux 用户 `bob` 身份启动任务，请将 `nobody` 替换为以下的 `bob`。
请注意， `nobody` 和 `root` 是默认出现在所有代理上的，但如果指定自定义 `bob` 用户，必须在可以执行这些任务的每个代理上手动创建（使用 `adduser` 或类似实用程序）。

```bash
dcos security org users grant <uid> dcos:mesos:master:task:user:nobody create --description "Tasks can execute as Linux user nobody"
dcos security org users grant <uid> dcos:mesos:master:framework:role:<myrole> create --description "Controls the ability of <myrole> to register as a framework with the Mesos master"
dcos security org users grant <uid> dcos:mesos:master:reservation:role:<myrole> create --description "Controls the ability of <myrole> to reserve resources"
dcos security org users grant <uid> dcos:mesos:master:volume:role:<myrole> create --description "Controls the ability of <myrole> to access volumes"
dcos security org users grant <uid> dcos:mesos:master:reservation:principal:<uid> delete --description "Controls the ability of <uid> to reserve resources"
dcos security org users grant <uid> dcos:mesos:master:task:app_id:/ create--description "Controls the ability to launch tasks"
dcos security org users grant <uid> dcos:mesos:master:volume:principal:<uid> delete --description "Controls the ability of <uid> to access volumes"
```

# 第 5 步 - 授予用户对非本地 Marathon 的访问权限
在此步骤中，用户被授权访问非本地 Marathon 实例。

1. 以具有 `superuser` 权限的用户身份登录 DC/OS Web 界面。

    ![登录](/mesosphere/dcos/1.12/img/LOGIN-EE-Modal_View-1_12.png)

    图 1. DC/OS Web 界面登录画面。

1. 选择**组织**，然后选择**用户**或**组**。

1. 选择要授予权限的用户名或组名。

    ![添加 cory 权限](/mesosphere/dcos/1.12/img/GUI-Organization-Users-List_View-1_12.png)

    图 2. 选择用户或组权限

1. 在 **权限** 选项卡中，单击 **添加权限**。

1. 单击**插入权限字符串**以切换对话框。

    ![添加权限](/mesosphere/dcos/1.12/img/GUI-Organization-Users-User_Alice_Add_Gen_Perms-1_12.png)

    图 3. 添加权限。

1. 在**权限字符串**字段中复制并粘贴权限。根据您的[安全模式]选择权限字符串(/cn/1.12/security/ent/#security-modes)。

### 宽容

- **完整权限**

    ```bash
    dcos:adminrouter:service:<service-name> full
    dcos:service:marathon:<service-name>:services:/ full
    dcos:adminrouter:ops:mesos full
    dcos:adminrouter:ops:slave full
    ```

- **访问单个服务或组**

  指定服务或组 (`<service-or-group>`) 和操作 (`<action>`)。操作可以是 `create`、 `read`、 `update`、`delete` 或 `full`。若要允许多个操作，请使用逗号分隔它们，例如: `dcos:service:marathon:<service-name>:services:/<service-or-group> read,update`。

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

  指定服务或组（`<service-or-group>`）、服务名称（`<service-name>`）、角色（`<myrole>`）和操作（`<action>`）。操作可以是 `create`、 `read`、 `update`、`delete` 或 `full`。若要允许多个操作，请使用逗号分隔它们，例如: `dcos:service:marathon:<service-name>:services:/<service-or-group> read,update`。

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

单击 **ADD PERMISSIONS**，然后单击 **Close**。

# 第 6 步 - 访问非本地 Marathon 实例
在此步骤中，您以授权用户身份登录非本地 Marathon DC/OS 服务。

1. 启动非本地 Marathon 接口，位于：`http://<master-public-ip>/service/<service-name>/`。

1. 输入您的用户名和密码，然后单击 **登录**。

    ![Log in DC/OS](/mesosphere/dcos/1.12/img/LOGIN-EE-Modal_View-1_12.png)

    图 4. DC/OS 登录屏幕

    成功了！

    ![Marathon on Marathon](/mesosphere/dcos/1.12/img/mom-marathon-gui.png)

    图 5. 操作成功的画面。
