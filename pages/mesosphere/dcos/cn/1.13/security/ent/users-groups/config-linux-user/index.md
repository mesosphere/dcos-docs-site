---
layout: layout.pug
navigationTitle:  覆盖默认 Linux 用户
title: 覆盖默认 Linux 用户
menuWeight: 31
excerpt: 覆盖默认 Linux 用户
enterprise: true
render: mustache
model: /mesosphere/dcos/1.13/data.yml
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->

服务或作业的默认 Linux 用户可能因安全模式和容器类型而异 请参阅 [Linux 用户](/mesosphere/dcos/1.13/security/ent/#linux-users) 了解更多信息。

覆盖默认 Linux 用户的程序因服务或作业类型而异。

- [覆盖 {{ model.packageRepo }} 服务的默认 Linux 用户](#universe)
- [通过 Marathon 应用定义覆盖服务的默认用户](#marathon-app-def)
- [通过 Metronome 作业定义覆盖作业的默认用户](#metronome-job-def)

# <a name="universe"></a>覆盖 {{ model.packageRepo }} 服务的默认 Linux 用户

许多 {{ model.packageRepo }} 服务忽略其用户帐户的覆盖，在 `strict` 模式下除外。我们提供覆盖服务默认 Linux 用户的详细步骤，该服务在[服务账户](/mesosphere/dcos/1.13/security/ent/service-auth/)中支持此覆盖。有关逐步说明，请参阅与感兴趣的服务相关的部分。程序还说明如何配置服务以使用加密和服务帐户。

请记得授予权限，以便对启动 {{ model.packageRepo }} 服务的服务帐户用户执行 `dcos:mesos:master:task:user[:<linux-user-name>]` 资源上的 `create` 操作。请参阅 [Mesos 权限](/mesosphere/dcos/1.13/security/ent/perms-reference/#mesos-permissions)，了解更多信息。

# <a name="marathon-app-def"></a>通过 Marathon 应用定义覆盖默认 Linux 用户

Marathon 应用定义提供用于覆盖默认 Linux 用户的 `"user"` 密钥。**提示：**参考 [Marathon 文档](/mesosphere/dcos/1.13/deploying-services/creating-services/)，了解有关编写 Marathon 服务的更多详细信息。

以下教程将展示所有权如何运作。在开始之前，请确保：

- 代理程序上已存在 Linux 用户帐户。
- 您已安装并登录到 [DC/OS CLI](/mesosphere/dcos/1.13/cli/)。
- 必须遵守 [下载根证书] (/mesosphere/dcos/1.13/security/ent/tls-ssl/get-cert/) 中的步骤才能发布此部分的 curl 命令。
- 您已授予对`dcos:mesos:master:task:user:<linux-user-name>` DC/OS 服务帐户用户 `create` 资源执行 `dcos_marathon` 操作的权限。

满足这些先决条件后，完成以下步骤以覆盖默认 Linux 用户。

1. 创建 Marathon 应用定义，并使用信息名称保存，如 `myservice.json`。以下服务会将其在用户名称下运行的用户名称写入日志，创建新文件，并从 dcos.io 获取 Mesosphere 徽标。

    ```json
    {
      "id": "linux-user-override",
      "cmd": "whoami && tee file && sleep 1000",
      "user": "<your-test-user-account>",
      "uris": [
          "/1.13/img/logos/mesosphere.svg"
      ]
    }
    ```

    <p class="message--important"><strong></strong>重要信息：不要忘记将“your-test-user-account”替换为代理程序上存在的 Linux 用户的名称，并且与默认值不同。</p>

1. 使用 [Marathon API] 部署服务(/mesosphere/dcos/1.13/deploying-services/marathon-api/)。

    ```bash
    curl -X POST --cacert dcos-ca.crt $(dcos config show core.dcos_url)/service/marathon/v2/apps -d @myservice.json -H "Content-type: application/json" -H "Authorization: token=$(dcos config show core.dcos_acs_token)"
    ```


1. 检查 DC/OS Web 界面的 **服务** 选项卡，以确认您的应用程序已成功创建。

1. 单击您的服务，然后单击 **Configuration** 选项卡。

1. 向下滚动以查看指定为**用户**值的 Linux 用户帐户。

1. 单击 **Tasks** 选项卡。到这时，您的服务应该已成功部署。单击任务名称。

1. 单击 **Files** 选项卡。

1. 观察作为获取和创建文件的**所有者**而传入的 Linux 用户名。

1. 单击以打开 **stdout** 文件。

1. 滚动到底部，您应该看到 `whoami` 命令的结果，例如，任务在其下运行的用户名称。

# <a name="metronome-job-def"></a>通过 Metronome 作业定义覆盖默认 Linux 用户

Metronome 作业定义提供 `"user"` 密钥，可用于覆盖默认 Linux 用户。

<p class="message--note"><strong>注意：</strong>有关创建和部署作业的更多信息，请参阅 <a href="/mesosphere/dcos/1.13/deploying-jobs/quickstart/">作业文档</a>。</p>


以下程序将引导您完成快速教程，以展示所有权如何运作。在开始之前，请确保：

- 代理程序上已存在 Linux 用户帐户。
- 您已安装并登录到 [DC/OS CLI](/mesosphere/dcos/1.13/cli/)。
- 必须遵守 [下载根证书] (/mesosphere/dcos/1.13/security/ent/tls-ssl/get-cert/) 中的步骤才能发布此部分的 curl 命令。
- 您已授予对`dcos:mesos:master:task:user:<linux-user-name>` DC/OS 服务帐户用户 `create` 资源执行 `dcos_metronome` 操作的权限。

满足这些先决条件后，完成以下步骤以覆盖默认 Linux 用户。


1. 创建 Metronome 作业定义，并使用信息名称保存，如 `myjob.json`。

    ```json
    {
    "id": "test-user-override",
    "run": {
      "artifacts": [
        {
          "uri": "/1.13/img/logos/mesosphere.svg"
        }
      ],
      "cmd": "whoami && printf 'iamme' | tee file && sleep 1000",
      "cpus": 0.01,
      "mem": 32,
      "disk": 0,
      "user": "<your-test-user-account>"
    }
    }
    ```

    <p class="message--important"><strong>重要信息：</strong>不要忘记将“your-test-user-account”替换为代理程序上存在的 Linux 用户的名称，并且与默认值不同。如果您尚未配置用户，则将存在 Linux 用户 <code>nobody</code>。</p>

1. 使用 [Metronome REST API](https://dcos.github.io/metronome/docs/generated/api.html) 部署作业。

   ```bash
   curl -X POST --cacert dcos-ca.crt $(dcos config show core.dcos_url)/service/metronome/v1/jobs -d @myjob.json -H "Content-type: application/json" -H "Authorization: token=$(dcos config show core.dcos_acs_token)"
   ```

1. 检查 DC/OS Web 界面的 **Jobs** 选项卡，以确认您的应用程序已成功部署。

1. 单击您的作业，然后单击 **Run Now**。

1. 单击三个堆叠点并选择 **Run Now**，从右上方打开下拉菜单。

1. 展开作业并单击打开其任务。

1. 单击以打开 **Files** 选项卡。注意所有文件都将您的 Linux 用户作为**所有者**。

1. 单击以打开 `stdout` 文件。

1. 滚动到底部，您应该看到 `whoami` 命令的结果，任务在其下运行的用户名称，然后是 `iamme`。
