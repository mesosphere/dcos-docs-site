---
layout: layout.pug
navigationTitle: 使用专用 Docker 注册表
title: 使用专用 Docker 注册表
menuWeight: 4
excerpt: 创建专用 Docker 注册表的存档

enterprise: false
---


若要从专用 Docker 注册表中提供拉取凭据，请创建 Docker 凭据的存档，然后将其添加为服务或 pod 定义中的 URI。在 DC/OS Enterprise 中，您还可以 [将 Docker 注册表凭据上传到 DC/OS 密钥存储库](#secret-store-instructions) ，并在服务或 pod 定义中进行引用。

<a name="uri-instructions"></a>
# 将专用 Docker 注册表凭据以 URI 引用

## 步骤 1：压缩 Docker 凭据

1. 手动登录专用注册表。登录后会在主目录中创建 `.docker` 文件夹和 `.docker/config.json` 文件。

    ```bash
    docker login some.docker.host.com
    Username: foo
    Password:
    Email: foo@bar.com
    ```

1. 压缩 `.docker` 文件夹及其内容。

    ```bash
    cd ~
    tar -czf docker.tar.gz .docker
    ```
1. 验证两个文件都在存档中。

    ```bash
      tar -tvf ~/docker.tar.gz

      drwx------ root/root         0 2015-07-28 02:54 .docker/
      -rw------- root/root       114 2015-07-28 01:31 .docker/config.json
    ```

1. 将存档文件放置在您的应用定义可访问的位置。

    ```bash
    cp docker.tar.gz /etc/
    ```


<p class="message--important"><strong>重要信息：</strong>所有会启动您应用的节点都必须能够访问 URI。可以将文件分发到所有节点的本地文件系统，例如，通过 RSYNC/SCP 分发，或将其存储在共享网络驱动器上，例如 <a href="http://aws.amazon.com/s3/">Amazon S3</a>。仔细考虑所选方法的安全影响。</p>


## 步骤 2：将 URI 路径添加到服务定义

将存档文件登录凭据的路径添加到服务定义。

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

按照以下步骤向 [DC/OS Enterprise 密钥存储库] 添加 Docker 注册表凭据(/security/ent/secrets/)，然后在服务定义中引用该密钥。

<p class="message--important"><strong>重要信息：</strong>此功能仅适用于<a href="//deploying-services/containerizers/ucr/">通用容器运行时</a>。如果需要使用 Docker Engine，请遵循上述 URI 说明。</p>

## 步骤 1：创建凭据文件

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

    如果使用的是 Mac OS，就需要手动编码 `username:password` 字符串并修改您的 `config.json` ，以便与上面的片段匹配。使用 base64 为密钥对编码时，请务必省略后面的换行符：

    ```bash
    echo -n myuser@domain.com:hard-to-guess-password | base64
    ```

1. 添加 `config.json` 文件到 DC/OS 密钥存储库。[了解创建密钥的详细信息](/1.9/security/ent/secrets/create-secrets/)。

 <p class="message--note"><strong>注意：</strong>自 DC/OS 版本 1.10.0 开始，您只能使用 DC/OS CLI 将文件添加到密钥存储库。</p>

   ```bash
   dcos security secrets create --file=config.json <path/to/secret>
   ```

 如果您打算遵循以下示例，请输入以下命令以添加密钥：

   ```bash
   dcos security secrets create --file=config.json mesos-docker/pullConfig
   ```

## 步骤 2：为您的服务或 pod 定义添加密钥

### 对于服务

1. 在 `secrets` 参数中添加密钥位置，并在 `docker.pullConfig` 参数中引用密钥。

   <p class="message--important"><strong>重要信息：</strong>此功能 <strong>仅</strong> 获得通用容器运行时的支持：<code>container.type</code> 必须为 <code>MESOS</code>。</p>

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

1. 将服务添加到 DC/OS。如果您使用上述示例，则 `<svc-name>` 为 `mesos-docker`。

   ```
   dcos marathon app add <svc-name>.json
   ```

 Docker 镜像现在将使用提供的安全凭证进行拉取。

### 对于 pod

1. 在 `secrets` 参数中添加密钥位置，并在 `containers.image.pullConfig` 参数中引用密钥。

    <p class="message--important"><strong>重要信息：</strong>仅当 <code> image.kind </code>设置为<code> DOCKER </code>时，才支持此功能。</p>

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

1. 将 pod 添加到 DC/OS。如果您使用上述示例，则 `<pod-name>` 为 `simple-pod`。

      ```
      dcos marathon pod add <pod-name>.json
      ```

 Docker 镜像现在将使用提供的安全凭证进行拉取。

<a name="docker-repo-certs"></a>

# 配置代理以使用 Docker 注册表的自定义证书 
某些组织需要用户凭据和有效的安全套接字层 (SSL) 证书，才能授权访问 Docker 注册表。例如，某些注册表配置需要一个证书来加密客户端与注册表之间的通信，而用户凭据则确定在成功连接到注册表之后，谁可以访问注册表。

如果您的专用注册表使用证书来保证通信，则可以配置代理节点来授信您用来访问专用 Docker 注册表的证书。

要配置用于访问专用 Docker 注册表和 DC/OS UCR 的自定义证书，请完成以下步骤：

1. 创建或标识要用作访问 Docker 注册表的可信证书的自定义证书。

    您可以使用 OpenSSL、DC/OS Enterprise CLI 或其他程序生成公钥和私钥、证书请求以及加密的客户端和服务器证书。

    创建或标识证书后，可以按照注册表提供程序提供的说明将注册表配置为使用此证书。

1. 将证书下载或复制到每个代理的以下两个位置。

    ```bash
    /etc/docker/certs.d/<registry_name>:<registry_port>/ca.crt
    /var/lib/dcos/pki/tls/certs/<something>.crt
    ```

    对于每个代理上可信 CA 证书的路径，请将 `<registry_name>` 和 `<registry_port>` 替换为适合您的安装的特定注册表名称和端口号。

    例如，如果要将 DC/OS `ca.crt` 证书配置为可信证书并且本地 Docker 注册表引用为 `registry.mycompany.com:5000`，则可以下载 `ca.crt` 文件的副本并使用类似如下的命令将其设置为受信任：

    ```bash
    sudo mkdir -p /etc/docker/certs.d/registry.mycompany.com:5000
    sudo cp /path/to/ca.crt etc/docker/certs.d/registry.mycompany.com:5000/ca.crt
    sudo cp /etc/docker/certs.d/registry.mycompany.com:5000/ca.crt /var/lib/dcos/pki/tls/certs/docker-registry-ca.crt
    ```

1. 通过运行类似如下的命令为文件生成散列：

    ```bash
    cd /var/lib/dcos/pki/tls/certs/
    openssl x509 -hash -noout -in docker-registry-ca.crt

1. 从可信的证书创建一个标志性的链接到公共代理的 `/var/lib/dcos/pki/tls/certs` 注册表。

    ```bash
    sudo ln -s /var/lib/dcos/pki/tls/certs/docker-registry-ca.crt /var/lib/dcos/pki/tls/certs/<hash_number>.0
    ```

<a name="tarball-instructions"></a>

# 将自定义镜像推送到 tarball 的专用注册表。

如果您向您的销售代表索取了 enterprise 版的 Marathon, 可能会在 `.tar` 存档档案给您一个 Docker 镜像。跟着这些步骤将它部署到您的注册表：

## 第1步: 输入到本地机器

将 tarball 载入到您的本地 Docker 客户端，将路径传递到您的自定义 tarball。例如, `marathon-dcos-ee.<version>.tar`:
   ```bash
   docker load -i marathon-dcos-ee.<version>.tar
   ```

  您可以用这个指令显示 Marathon 镜像。

  ```
  Docker images
  ```

  您应可以看到类似这样的输出:

```bash
存储库标记镜像 ID 创建大小
mesosphere/marathon-dcos-ee 1.4.0-RC4_1.9.4 d1ffa68a50c0 3 months ago 926.4 MB
```

## 第2步: 将镜像推送到注册表

1. 重新给文件做标签来匹配您正在私用 Docker 注册表中的知识库。:
    ```bash
    docker tag \
    mesosphere/marathon-dcos-ee:<mesosphere-tag> \
    <your-repo>/marathon-dcos-ee:<your-tag>
    ```

   其中:

   - `<mesosphere-tag>` 是来自 Mesosphere 镜像的标签。一般这会在文件名与版本数匹配。
   - `<your-repo>` 是您想在其中存储镜像的私用知识库。
   - `<your-tag>` 是镜像的标签。建议您使用 Mesosphere 镜像相同的标签。
1. 将新镜像推送到您的私用 Docker 注册表:
    ```bash
    docker push <your-repo>/Marathon-DCOS-EE：<your-tag>
    ```
