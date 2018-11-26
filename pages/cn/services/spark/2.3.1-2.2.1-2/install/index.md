---
layout: layout.pug
navigationTitle:
excerpt: 使用 Web 界面或 DC/OS CLI 安装 Spark
title: 安装和自定义
menuWeight: 15
featureMaturity:
model: /cn/services/spark/data.yml
render: mustache
---

DC/OS {{ model.techName }} 可在 Universe 中使用，可通过使用 GUI 或 DC/OS CLI 进行安装。

**前提条件：**

- [已安装 DC/OS 和 DC/OS CLI](https://docs.mesosphere.com/latest/installing/)。
- 根据您的 [安全模式](https://docs.mesosphere.com/latest/security/ent/#security-modes)，Spark 需要服务身份认证才能访问 DC/OS。更多信息：

| 安全模式 | 服务帐户 |
|---------|-------------|
| 已禁用 | 不可用 |
| 宽容 | 可选 |
| 严格 | **必需** |


# 默认安装
要安装 DC/OS {{ model.techName }}服务，在 DC/OS CLI 上运行以下命令。这将安装 {{ model.techShortName }} DC/OS 服务、{{ model.techShortName }} CLI、调度程序和可选的历史服务器。请参阅 [自定义安装](#custom) 安装历史服务器。

```bash
dcos package install {{ model.serviceName }}
```

转到 DC/OS GUI 的 **服务** > **部署** 选项卡，以监控部署。完成部署后
，访问 {{ model.techShortName }}：`http：//<dcos-url>/service/{{ model.serviceName }}/`. 

您也可以 [通过 DC/OS GUI 安装 {{ model.techShortName }} ](/cn/1.11/gui/#universe)。


## {{ model.techShortName }} CLI

您可以使用此命令安装 {{ model.techShortName }} CLI。如果您已经拥有运行中的 {{ model.techShortName }} 集群，但需要 {{ model.techShortName }} CLI，则会比较有用。


<p class="message--important"><strong>重要信息：</strong> 如果通过 DC/OS GUI 安装 {{ model.techShortName }}，您必须从 DC/OS CLI 作为单独步骤安装 {{ model.techShortName }} CLI。</p>

```bash
dcos package install {{ model.serviceName }} --cli
```

<a name="custom"></a>
# 自定义安装

您可以通过创建 JSON 选项文件并将其传递至 `dcos package install --options`，来自定义默认配置属性。例如，要使用通用容器运行时间 (UCR) 启动 Dispatcher，创建一个名为 `options.json` 的文件：

```json
{
  "service": {
    "UCR_containerizer": true
  }
}
```

使用在 `options.json` 文件中指定的配置安装 {{ model.techShortName }} ：

```bash
dcos package install --options=options.json {{ model.serviceName }}
```

**提示：** 运行此命令以查看所有配置选项：

```bash
dcos package describe {{ model.serviceName }} --config
```

## 自定义 {{ model.techShortName }} 分布

DC/OS {{ model.techName }} 不支持任意 {{ model.techShortName }} 分布，但 Mesosphere 提供多个预构建分布，主要用于选择 Hadoop 版本。

若要使用其中一个分布，自 [此处](https://github.com/mesosphere/{{ model.serviceName }}-build/blob/master/docs/{{ model.serviceName }}-versions.md) 选择您的 {{ model.techShortName }} 分布，然后自[此处](https://hub.docker.com/r/mesosphere/{{ model.serviceName }}/tags/)选择相应的 Docker 镜像，然后使用这些值设置以下配置变量：

```json
{
  "service": {
    "docker-image": "<docker-image>"
  }
}
```

# 最小安装

出于开发目的，您可以在本地 DC/OS 集群上安装 {{ model.techShortName }}。为此，您可以使用[dcos-vagrant](https://github.com/mesosphere/dcos-vagrant)。

1. 根据 [此处](https://github.com/mesosphere/dcos-vagrant)说明安装最小 DC/OS Vagrant。

1. 安装 {{ model.techShortName }}：

   ```bash
   dcos package install {{ model.serviceName }}
   ```

1. 运行简单的作业：

   ```bash
   dcos {{ model.serviceName }} run --class org.apache.{{ model.serviceName }}.examples.SparkPi http://downloads.mesosphere.com.s3.amazonaws.com/assets/{{ model.serviceName }}/{{ model.serviceName }}-examples_2.10-1.5.0.jar"
   ```

<p class="message--note"><strong>注意：</strong> DC/OS Vagrant 等有限资源环境限制了 DC/OS 中的某些功能 {{ model.techName }}。例如，除非您有足够的资源启动 5 代理集群，您将无法安装 DC/OS HDFS，因此无法启用历史服务器。</p>

另外，有限的资源环境可能限制您的执行程序的大小，例如使用`{{ model.serviceName }}.executor.memory`。


# 多次安装

安装 DC/OS {{ model.techName }} 包的多个实例提供基本的多团队支持。每个调度程序仅显示给定团队提交给它的作业，并且每个团队都可以被分配不同的资源。

要安装 DC/OS {{ model.techName }} 包的多个实例，在安装过程中，在您的 JSON 配置文件中设置每个 `service.name` 为唯一名称（例如： `{{ model.serviceName }}-dev`）。例如，创建 JSON 选项文件名 `multiple.json`：

```json
{
  "service": {
    "name": "{{ model.serviceName }}-dev"
  }
}
```

使用指定的选项文件安装 Spark：

```bash
dcos package install --options=multiple.json {{ model.serviceName }}
```

要指定使用哪个 Spark 实例，请添加 `--name=<service_name>` 到 CLI 中，例如

```bash
$ dcos {{ model.serviceName }} --name={{ model.serviceName }}-dev run ...
```
<a name="strict_setting"></a>
# 严格模式的安装（设置服务身份认证）

如果您的集群设置为 [严格](https://docs.mesosphere.com/latest/security/ent/#strict) 安全，则您需要按照以下步骤安装和运行 Spark。

## 服务帐户和密钥

1. 安装 `dcos-enterprise-cli` 以获取 CLI 安全命令（如果您还没有安装）：

    ```bash
    $ dcos package install dcos-enterprise-cli
    ```

1. 创建一个密钥对，使用 Enterprise DC/OS CLI 创建 2048 位 RSA 公私密钥对。创建一个
 公私密钥对并将每个值保存到当前目录中的单独文件中。

    ```bash
    $ dcos security org service-accounts keypair <your-private-key>.pem <your-public-key>.pem
    ```

   例如：

   ```bash
   dcos security org service-accounts keypair private-key.pem public-key.pem
   ```

1. 创建一个新服务帐户，`service-account-id`（例如 `{{ model.serviceName }}-principal`)，其中包含公钥，
    `your-public-key.pem`.

    ```bash
    $ dcos security org service-accounts create -p <your-public-key>.pem -d "Spark service account" <service-account>
    ```

   例如：

   ```bash
   dcos security org service-accounts create -p public-key.pem -d "Spark service account" {{ model.serviceName }}-principal
   ```

   在 Mesos 用语中，一个`service-account` 称为 `principal`，所以我们在这里可互换使用这些术语。

   <p class="message--note"><strong>注意: </strong> 您可以使用以下命令验证您的新服务帐户</p>

   ```bash
   $ dcos security org service-accounts show <service-account>
   ```
1. 创建密钥（例如，`{{ model.serviceName }}//<secret-name>`) 与您的服务帐户, `service-account`, 和指定的私钥, `your-private-key.pem`。

    ```bash
    # permissive mode
    $ dcos security secrets create-sa-secret <your-private-key>.pem <service-account> {{ model.serviceName }}/<secret-name>
    # strict mode
    $ dcos security secrets create-sa-secret --strict <private-key>.pem <service-account> {{ model.serviceName }}/<secret-name>
    ```

   例如，在严格模式 DC/OS 集群上：

   ```bash
   dcos security secrets create-sa-secret --strict private-key.pem {{ model.serviceName }}-principal {{ model.serviceName }}/{{ model.serviceName }}-secret
   ```

 <p class="message--note"><strong>注意: </strong> 使用 <tt>dcos security secrets list /</tt> 命令验证是否已创建密钥：</p>

   ```bash
   $ dcos security secrets list /
   ```

## 分配权限
必须创建权限，以便 Spark 服务能够启动 Spark 作业，这样作业本身可以启动代表其执行工作的执行程序。根据您的集群，需要记住几点：

* RHEL/CenTos 用户当前不能作为用户 `nobody`以严格模式运行 Spark，必须作为用户 `root` 才能运行。这是帐户映射到 UID 的方式所致。CorEos 用户不受影响，并可作为 `nobody` 用户运行。以下我们将用户指定为 `{{ model.serviceName }}-user`。

* Spark 默认为以 Mesos 默认角色运行，其由 `*` 符号表示。您可以部署多个 Spark 实例，而不用修改此默认值。如果您想覆盖默认 Spark 角色，您必须相应地修改这些代码样例。我们使用 `{{ model.serviceName }}-service-role` 指定以下所用角色。

也可通过 UI 分配权限。

1. 运行以下内容以创建 Spark 所需的权限：
   ```bash
   $ dcos security org users grant <service-account> dcos:mesos:master:task:user:<user> create --description "Allows the Linux user to execute tasks"
   $ dcos security org users grant <service-account> dcos:mesos:master:framework:role:<{{ model.serviceName }}-service-role> create --description "Allows a framework to register with the Mesos master using the Mesos default role"
   $ dcos security org users grant <service-account> dcos:mesos:master:task:app_id:/<service_name> create --description "Allows reading of the task state"
   ```

   注意上述 `dcos:mesos:master:task:app_id:/<service_name>` 可能会 `dcos:mesos:master:task:app_id:/{{ model.serviceName }}` 

   例如，续上述：

   ```bash
   dcos security org users grant {{ model.serviceName }}-principal dcos:mesos:master:task:user:root create --description "Allows the Linux user to execute tasks"
   dcos security org users grant {{ model.serviceName }}-principal dcos:mesos:master:framework:role:* create --description "Allows a framework to register with the Mesos master using the Mesos default role"
   dcos security org users grant {{ model.serviceName }}-principal dcos:mesos:master:task:app_id:/{{ model.serviceName }} create --description "Allows reading of the task state"

   ```

   此处，我们正在使用服务帐户 `{{ model.serviceName }}-principal` 和用户 `root`。

1. 如果您正在以 `root` 运行 {{ model.techName }} 服务 （如我们在本例中)，您需要增加 Marathon 额外权限：

   ```bash
   dcos security org users grant dcos_marathon dcos:mesos:master:task:user:root create --description "Allow Marathon to launch containers as root"
   ```

## 使用必要配置安装 Spark

在安装 Spark 之前，使用以下内容制作配置文件，这些设置也可通过 UI 完成：

   ```json
   $ cat {{ model.serviceName }}-strict-options.json
   {
   "service": {
         "service_account": "<service-account-id>",
         "user": "<user>",
         "service_account_secret": "{{ model.serviceName }}/<secret_name>"
         }
   }
   ```

 最小的例子是：

   ```json
   {
   "service": {
         "service_account": "{{ model.serviceName }}-principal",
         "user": "root",
         "service_account_secret": "{{ model.serviceName }}/{{ model.serviceName }}-secret"
         }
   }
   ```

 然后安装：

   ```bash
   $ dcos package install {{ model.serviceName }} --options={{ model.serviceName }}-strict-options.json
   ```


## 在提交时，向您的 Spark 作业添加必要的配置

要在严格的模式集群上运行作业，您必须添加 `principal`到命令行。例如，如果您想使用 [Docker Engine](/latest/deploying-services/containerizers/docker-containerizer/) 而非 [Universal Container Runtime](/latest/deploying-services/containerizers/ucr/)，您必须通过 `SPARK_USER` 环境变量指定用户：







```bash
$ dcos {{ model.serviceName }} run --verbose --submit-args=" \
--conf {{ model.serviceName }}.mesos.principal=<service-account> \
--conf {{ model.serviceName }}.mesos.containerizer=mesos \
--class org.apache.{{ model.serviceName }}.examples.SparkPi http://downloads.mesosphere.com/{{ model.serviceName }}/assets/{{ model.serviceName }}-examples_2.11-2.0.1.jar 100"
```


