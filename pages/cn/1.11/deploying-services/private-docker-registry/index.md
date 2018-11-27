---
layout: layout.pug
navigationTitle: 使用专用 Docker 注册表
title: 使用专用 Docker 注册表
menuWeight: 4
excerpt: 创建专用 Docker 注册表的存档

enterprise: false
---


若要从专用 Docker 注册表中提供拉取凭据，请创建 Docker 凭据的存档，然后将其添加为服务或 pod 定义中的 URI。在 DC/OS Enterprise 中，您还可以将 Docker 注册表凭据上传到 DC/OS 密钥存储库]（#secret-store-instructions），并在服务或 pod 定义中进行引用。

<a name="uri-instructions"></a>
# 将专用 Docker 注册表凭据以 URI 的形式来使用

## 第 1 步：压缩 Docker 凭据

1. 手动登录专用注册表。登录后会在主目录中创建 `.docker` 文件夹和 `.docker/config.json` 文件。

    ```bash
    docker login some.docker.host.com
    Username: foo
    Password:
    Email: foo@bar.com
    ```

1. 压缩 `.docker` 文件夹及其内容。

    ```bash
    cd 
~    tar -czf docker.tar.gz .docker
    ```
1. 验证两个文件都在存档中。

 ```bash
 tar -tvf ~/docker.tar.gz

 drwx------ root/root 0 2015-07-28 02:54 .docker/
 -rw------- root/root 114 2015-07-28 01:31 .docker/config.json
    ```

1. 将存档文件放置在您的应用定义可访问的位置。

    ```bash
    cp docker.tar.gz /etc/
    ```


<table class=“table” bgcolor=#858585>
<tr> 
  <td align=justify style=color:white><strong>重要信息：</strong>URI 必须能够通过所有会启动您应用的节点访问。可以将文件分发到所有节点的本地文件系统，例如，通过 RSYNC/SCP 分发，或将其存储在共享网络驱动器上，例如 <a href="http://aws.amazon.com/s3/">Amazon S3</a>。仔细考虑所选方法的安全影响。</td> 
</tr> 
</table>

## 第 2 步：将 URI 路径添加到服务定义

1. 将存档文件登录凭据的路径添加到服务定义。

    ```bash
    "fetch": [
      {
        "uri": "file:///etc/docker.tar.gz"
      }
    ]
    ```

 例如：

    ```json
    {  
      "id": "/some/name/or/id",
      "cpus": 1,
      "mem": 1024,
      "instances": 1,
      "container": {
        "type": "DOCKER",
        "docker": {
          "image": "some.docker.host.com/namespace/repo"
        }
      },
      "fetch": [
        {
          "uri": "file:///etc/docker.tar.gz"
        }
      ]
    }
    ```

 Docker 镜像现在将使用提供的安全凭证进行拉取。

<a name="secret-store-instructions"></a>
# 引用密钥存储库中的专用 Docker 注册表凭据 [enterprise type="inline" size="small" /]

按照以下步骤向 [DC/OS Enterprise 密钥存储库] 添加 Docker 注册表凭据(/1.11/security/ent/secrets/)，然后在服务定义中引用该密钥。

**注意：** 此功能仅适用于 [通用 Containerizer 运行时间](/cn/1.11/deploying-services/containerizers/ucr/)。如果需要使用 Docker Engine，请遵循上述 [URI 说明](#uri-instructions)。

## 第 1 步：创建凭据文件

1. 手动登录您的专用注册表。这会创建 `~/.docker` 目录和 `~/.docker/config.json` 文件。

    ```bash
    docker login some.docker.host.com
    Username: foo
    Password:
    Email: foo@bar.com
    ```

1. 检查您是否有 `~/.docker/config.json` 文件。

    ```bash
    ls ~/.docker
    config.json
    ```

 您的 `config.json` 文件应该是这样的，其中 `auth` 的值是基于 64 位编码的 `username:password` 字符串。

    ```json
    {
      "auths": {
          "https://index.docker.io/v1/": {
              "auth": "XXXXX",
              "email": "<your-email>"
          }
      }
    }
    ```

 **注意：** 如果使用的是 Mac OSX，就需要手动编码 `username:password` 字符串并修改您的 `config.json` ，以便与上面的片段匹配。

1. 添加 `config.json` 文件到 DC/OS 密钥存储库。[了解创建密钥的详细信息](/1.9/security/ent/secrets/create-secrets/)。

 **注意：** 自 DC/OS 版本 1.10.0 开始，您只能使用 DC/OS CLI 将文件添加到密钥存储库。

   ```bash
   dcos security secrets create --value-file=config.json <path/to/secret>
   ```

 如果您打算遵循以下示例，请输入以下命令以添加密钥：

   ```bash
   dcos security secrets create --value-file=config.json mesos-docker/pullConfig
   ```

## 第 2 步：为您的服务或 pod 定义添加密钥

### 对于服务

1. 在 `secrets` 参数中添加密钥位置，并在 `docker.pullConfig` 参数中引用密钥。

 **注意：** 此功能**仅** 获得 **通用容器运行时间**支持： `container.type` 必须为 `MESOS`。

   ```json
   {
      "id": "/mesos-docker",
      "container": {
        "docker": {
          "image": "<your/private/image>",
          "pullConfig": {
            "secret": "pullConfigSecret"
          }
        },
        "type": "MESOS"
      },
      "secrets": {
        "pullConfigSecret": {
          "source": "/mesos-docker/pullConfig"
        }
      },
      "args": ["hello"],
      "cpus": 0.2,
      "mem": 16.0,
      "instances": 1
   }
   ```

1. 将服务添加到 DC/OS。如果您使用上述示例，则为`<svc-name>` is `mesos-docker`。

   ```
   dcos marathon app add <svc-name>.json
   ```

 Docker 镜像现在将使用提供的安全凭证进行拉取。

### 对于 pod

1. 在 `secrets` 参数中添加密钥位置，并在 `containers.image.pullConfig` 参数中指向密钥。

 **注意：** 只有在 `image.kind` 设置为 `DOCKER` 时，支持此功能。

   ```json
   {
        "id":"/simple-pod",
        "containers":[
           {
             "name":"simpletask1",
             "exec":{
                 "command":{
                   "shell":"env && sleep 1000"
                 }
               },
             "resources":{
               "cpus":0.1,
               "mem":32
           },
           "image":{
               "kind":"DOCKER",
               "id":"<your/private/image>",
               "pullConfig":{
                 "secret":"pullConfigSecret"
              }
           }
        }
     ],
     "networks":[
         {
           "mode":"host"
         }
     ],
     "secrets":{
         "pullConfigSecret":{
           "source":"/pod/pullConfig"
        }
     }
   }
   ```

1. 将 pod 添加到 DC/OS。如果您使用上述示例，则为`<pod-name>` is `simple-pod`。

      ```
      dcos marathon pod add <pod-name>.json
      ```

 Docker 镜像现在将使用提供的安全凭证进行拉取。
