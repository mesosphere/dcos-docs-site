---
layout: layout.pug
navigationTitle: 配置服务和 pod
title: 配置服务和 pod
menuWeight: 1
excerpt: 配置服务和 pod 以使用密钥

enterprise: true
---

<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->

您的服务定义可将密钥以环境变量或文件的方式指代。

## 基于文件的密钥

您可以将密钥以提高其他进程安全性的文件来指代，或者您的服务需要从容器中安装的文件中读取密钥。引用基于文件的密钥对以下内容特别有用：

- Kerberos keytab 或其他凭据文件。
- SSL 证书。
- 包含敏感数据的配置文件。

任务沙盒中提供基于文件的密钥 (`$MESOS_SANDBOX/<configured-path>`).

## 先决条件

- 现有密钥。以下示例使用了存储在 `developer` 路径名为 `my-secret` 的密钥。如果您完成[创建密钥]中的步骤(/1.11/security/ent/secrets/create-secrets/)，则您将满足此先决条件。

- [已安装 DC/OS CLI](/cn/1.11/cli/install/) 以及 [已安装 DC/OS Enterprise CLI](/cn/1.11/cli/enterprise-cli/#ent-cli-install)。
- 如果您的 [安全模式](/cn/1.11/security/ent/#security-modes) 是 `permissive` 或 `strict`，则必须 [获取根证书](/cn/1.11/security/ent/tls-ssl/get-cert/) 才能发布此部分的 curl 命令。
- 如果您的[安全模式](/cn/1.11/security/ent/#security-modes)为 `disabled`，则必须在将其发出前从命令中删除 `--cacert dcos-ca.crt`。
- 您的[安全模式]的适当权限(/1.11/security/ent/#security-modes)。

  <table class="table">
    <tr>
      <th>权限</th>
      <th>执行模式</th>
    </tr>
    <tr>
      <td><code>dcos:adminrouter:service:marathon full</code></td>
      <td>所有安全模式</td>
    </tr>
    <tr>
      <td><code>dcos:service:marathon:marathon:services:/[<i>service-group</i> full</code></td>
      <td><code>严格</code> 和 <code>宽容</code> 安全模式</td>
    </tr>
  </table>

 在 `strict` 模式，用户也可能需要以下内容。

 - `dcos:adminrouter:ops:mesos full`：查看 **任务** 面板信息。
 - `dcos:adminrouter:ops:slave full`：查看任务的详细信息，包括日志。

 只要密钥的路径和组的路径[匹配正确](/cn/1.11//security/ent/#spaces)，服务将能够访问密钥值。

该程序根据您是否要将密钥提供给 [pod](/cn/1.11/deploying-services/pods/) 或单个服务而有所不同。

- [单个服务](#service)
- [Pod](#pod)

# <a name="service"></a>配置服务以使用密钥

程序因网络接口而异。请参阅与您所需网络接口相对应的部分。

- [Web 界面](#deploying-the-service-via-the-web-interface)

- [Marathon API](#deploying-the-service-via-marathon-app-definition)

## <a name="deploying-the-service-via-the-web-interface"></a>配置服务以通过 Web 界面使用密钥

1. 以具有必要权限的用户身份登录 Web 界面，如 [前面部分](#service) 所述。

1. 单击 **Services** 选项卡。

1. 单击右上方的 **+** 图标。

 ![添加服务](/cn/1.11/img/add-service.png)

 图 1. 运行服务

1. 单击 **JSON Editor** 切换按钮。

1. 选择默认 JSON 架构的内容并删除它们，以便黑框中不显示任何文本。

1. 复制以下简单应用定义之一，并将其粘贴到黑框中。此应用定义在开发人员组内创建新服务，并引用了存储在开发人员路径内的密钥。

 基于环境变量的密钥：

   ```json
   {  
      "id":"/developer/service",
      "cmd":"sleep 100",
      "env":{  
         "MY_SECRET":{  
            "secret":"secret0"
         }
      },
      "secrets":{  
         "secret0":{  
            "source":"developer/my-secret"
         }
      }
   }
   ```

 在上述示例中，DC/OS 存储环境变量 `"MY_SECRET"` 下的密钥。观察 `"env"` 和 `"secrets"` 对象如何用于定义基于环境变量的密钥。

 基于文件的密钥：

   ```json
   {
     "id": "developer/service",
     "cmd": "sleep 100",
     "container": {
       "volumes": [
         {
           "containerPath": "path",
           "secret": "secretpassword"
         }
       ]
     },
     "secrets": {
       "secretpassword": {
         "source": "developer/databasepassword"
       }
     }
   }
   ```

 在上述示例中，密钥将具有文件名 `path`，并且将在任务的沙盒中可用 (`$MESOS_SANDBOX/path`) 。

 由于服务和密钥路径匹配，服务将能够访问该密钥。有关路径的更多详细信息，请参阅[空间](/cn/1.11/security/ent/#spaces)。

1. 单击 **查看并运行**。

1. 单击 **运行服务**。

1. 单击服务组名称，即**开发人员**。

1. 单击服务名称。

1. 单击其任务名称。

1. 滚动 **Details** 选项卡，查找您的 `DCOS_SECRETS_DIRECTIVE`。

# <a name="deploying-the-service-via-marathon-app-definition"></a>通过 Marathon 应用定义配置服务以使用基于环境变量的密钥

1. 通过 `dcos auth login` 以具有必要权限的用户身份登录 CLI。请参阅 [关于配置服务和 pod 以使用密钥](#service) 来发现所需的权限。

1. 在文本编辑器内，为 Marathon 服务创建应用定义。以下应用程序定义在开发人员组内创建新服务，并引用了存储在开发人员路径内的密钥。

 基于环境变量的密钥：

   ```json
   {  
      "id":"/developer/service",
      "cmd":"sleep 100",
      "env":{  
         "MY_SECRET":{  
            "secret":"secret0"
         }
      },
      "secrets":{  
         "secret0":{  
            "source":"developer/my-secret"
         }
      }
   }
   ```

 在上述示例中，DC/OS 存储环境变量 `"MY_SECRET"` 下的密钥。观察 `"env"` 和 `"secrets"` 对象如何用于定义基于环境变量的密钥。

 基于文件的密钥：

   ```json
   {
     "id": "developer/service",
     "cmd": "sleep 100",
     "container": {
       "volumes": [
         {
           "containerPath": "path",
           "secret": "secretpassword"
         }
       ]
     },
     "secrets": {
       "secretpassword": {
         "source": "developer/databasepassword"
       }
     }
   }
   ```

 由于服务组和密钥路径匹配，服务将能够访问密钥。有关路径的更多详细信息，请参阅[空间](/cn/1.11/security/ent/#spaces)。

1. 使用描述性名称保存文件，如 `myservice.json`。

1. 通过 DC/OS CLI 将服务添加到 DC/OS。

   ```bash
   dcos marathon app add myservice.json
   ```

 或者，使用 Marathon API 部署应用程序，如下所示。

   ```bash
   curl -X POST --cacert dcos-ca.crt $(dcos config show core.dcos_url)/service/marathon/v2/apps -d @myservice.json -H "Content-type: application/json" -H "Authorization: token=$(dcos config show core.dcos_acs_token)"
   ```

1. 打开 DC/OS Web 界面。

1. 单击服务组名称，例如**开发人员**。

1. 单击服务名称。

1. 单击其任务名称。

1. 滚动 **Details** 选项卡，查找您的 `DCOS_SECRETS_DIRECTIVE`。

# <a name="pod"></a>配置 pod 以使用密钥

1. 通过 `dcos auth login` 以具有必要权限的用户身份登录 CLI。有关权限的更多信息，请参阅 [关于配置服务和 pod 以使用密钥](#service)。

1. 在文本编辑器内，为 pod 创建应用定义。您可以使用 `"environment"` 和 `"secrets"` 对象添加密钥，如下所示。以下简单应用程序在开发人员组内定义新服务，并引用了存储在开发人员路径内的密钥。它将密钥存储在环境变量 `"MY_SECRET"` 下。

 基于环境变量的密钥：

    ```json
    {
      "id": "/developer/pod-secret",
      "environment": {
        "MY_SECRET": {
          "secret": "secret0"
        }
      },
      "secrets": {
        "secret0": { "source": "developer/my-secret"}
      },
      "containers": [
        {
          "name": "container-1",
          "resources": {
            "cpus": 0.1,
            "mem": 128
          },
          "exec": {
            "command": {
              "shell": "sleep 3600"
            }
          }
        }
      ],
      "scaling": {
        "kind": "fixed",
        "instances": 1
      },
      "networks": [
        {
          "mode": "host"
        }
      ]
    }
    ```

 基于文件的密钥：

    ```json
    {
      "id": "developer/pod-with-secrets",
      "containers": [
         {
           "name": "container-1",
           "exec": {
             "command": {
               "shell": "sleep 1"
             }
         },
         "volumeMounts": [
           {
             "name": "secretvolume",
             "mountPath": "path/to/db/password"
           }
         ]
       }
     ],
     "volumes": [
       {
         "name": "secretvolume",
         "secret": "secretpassword"
       }
     ],
     "secrets": {
       "secretpassword": {
         "source": "developer/databasepassword"
       }
     }
   }
   ```

 **注意：**由于服务组和密钥路径匹配，pod 将能够访问密钥。有关路径的更多详细信息，请参阅[命名空间](/cn/1.11//security/ent/#spaces)。

1. 使用描述性名称保存文件，如 `mypod.json`。

1. 使用 DC/OS CLI 部署 Pod，如下所示。

   ```bash
   dcos marathon pod add mypod.json
   ```

1. 打开 DC/OS Web 界面。

1. 单击服务组名称，例如**开发人员**。

1. 单击 Pod 的名称。

1. 单击以打开 **Configuration** 选项卡。

1. 滚动到 **环境变量** 区域，找到您的密钥 `MY_SECRET`。

### 限制

 基于文件的密钥仅与 UCR 配合使用。
