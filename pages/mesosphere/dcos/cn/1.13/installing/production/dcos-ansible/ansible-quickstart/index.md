---
layout: layout.pug
title: DC/OS Ansible 快速入门指南
navigationTitle: Ansible 快速入门
menuWeight: 1
excerpt: 指导完成通过 Ansible 安装 DC/OS。
---

如果您是 Ansible 新手和/或希望使用 Ansible 快速轻松地部署 DC/OS，请遵循本指南。我们将逐步指导您如何：
- 下载 DC/OS Ansible 内容
- 配置 DC/OS 的 Ansible
- 通过 Ansible 创建 DC/OS 群集
- 将群集升级到更新版本的 DC/OS

## 前提条件和设置
1. 您需要安装了 [Ansible](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html) 和 [Mazer 0.4](https://galaxy.ansible.com/docs/mazer/install.html)。有关更多安装信息，请参考链接。
     使用 Mac，您可以通过 brew 安装，然后使用您的 pip 版本安装 Mazer：
     ```bash
     brew install ansible && pip install mazer==0.4.0
     ```
     或者，您也可以使用 pip 安装 Anzer 和 Mazer：

      ```bash
      pip install ansible mazer==0.4.0
      ```
     关于 Windows 安装，请参阅 [Ansible 文档](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html#control-machine-requirements) 获取有关如何在 Windows 上安装的更多信息，或者，也您可以 SSH 到 bootstrap 主机（见下文），然后从那里部署和运行 Ansible。

2. 配置具有 SSH 访问权限的群集节点列表。您最少需要 4 个节点（CentOS 或 RedHat），通过具有根级别特权的用户提供 SSH 连接：
   - 1 个 bootstrap
   - 1 个管理节点
   - 1 个专用代理
   - 1 个公共代理

请参阅[最低系统要求](/mesosphere/dcos/1.13/installing/production/system-requirements/)以及支持的 CentOS 和 Redhat Enterprise Linux (RHEL) [您的节点的版本](/mesosphere/dcos/version-policy/#dcos-platform-version-compatibility-matrix/)，尤其是在针对生产环境进行计划时。
有关为 Ansible 设置 SSH 连接的更多信息，请参阅 [远程连接文档](https://docs.ansible.com/ansible/latest/user_guide/intro_getting_started.html#remote-connection-information)。
如果您要安装 DC/OS Enterprise Edition，则还需要一个适当的许可密钥。

<p class="message--note"><strong>注意：</strong>注册 Enterprise 客户可以从<a href="https://support.mesosphere.com/s/downloads">支持网站</a>访问 DC/OS Enterprise 配置文件。对于新客户，请联系您的销售代表或 <a href="mailto:sales@mesosphere.io">sales@mesosphere.io</a> 获取更多信息。</p>

## 下载内容
我们维护并托管[Ansible Galaxy 上的 DC/OS Ansible 项目](https://galaxy.ansible.com/dcos/dcos_ansible)以便于使用。目前，我们以及 RedHat 都建议使用 Mazer 工具将所有必要内容本地下载到您的机器上。有关 Mazer 工具和如何配置的更多信息，请参阅[此处的项目文档](https://galaxy.ansible.com/docs/mazer/index.html)。

1. 发出以下命令以下载内容：
     ```bash
     mazer install dcos.dcos_ansible
     ```

     这会默认将内容安装在 ` ~/.ansible/collections/ansible_collections`。但是，如果您有较早版本的 `mazer` 或者在您的 `mazer.yml` 有不同的内容路径，那么将安装在那里。您可以发出 `mazer version` 来查找 Mazer 配置文件的位置。

2. 在您的内容路径中，切换到 dcos_ansible 角色。
     ```bash
     cd ~/.ansible/collections/ansible_collections/dcos/dcos_ansible
     ```

3. Mazer 将在此目录中按版本下载您的角色，例如 `dcos-ansible-0.51.0`。找到该版本并将目录切换到所需版本以执行后续步骤：
   ```bash
   cd dcos-ansible-0.51.0
   ```

## 为您的 DC/OS 群集配置 Ansible
当您在本地下载内容后，您可以开始对其修改以满足您的特定需求。您需要配置以下文件才能开始：
- 清单文件 (`inventory`) - 您将指定您的哪些节点将被用作 bootstrap、管理节点、专用代理或公共代理。
- 组变量文件 (`/group_vars/all/dcos.yml`) - 此文件用于管理 OS 前提条件以及如何安装和配置 DC/OS。
- Ansible 配置 (`ansible.cfg`) - 您想让 Ansible 在您的环境中运行的方式。此处，大多数默认值是可接受的，除了 `remote_user`。

您可以使用 DC/OS Ansible 来安装 DC/OS 和 DC/OS Enterprise。请按照以下说明进行操作，并在注明处根据您的变量进行调整。这里，我们将安装版本 `1.13.0`。

1. 在 `~/.ansible/collections/ansible_collections/dcos/dcos_ansible/dcos-ansible-X.X.X` 目录中，将清单和组变量示例文件重命名为新文件：
     ```bash
     mv inventory.example inventory && \
     mv group_vars/all/dcos.yaml.example group_vars/all/dcos.yml
     ```

2. 打开 `inventory` 文件。在 `[bootstrap]`、`[masters]`、`[agents_private]` 和 `[agents_public]` 所需组的下方，列出每个相应的节点 IP，如前提条件中所述。如果您是在公共云上部署，则这些是节点的外部 IP。

3. 在变量文件 (`group_vars/all/dcos.yml`) 中，根据您的变量在 `dcos` 下设置下列值：

    [enterprise type="inline" size="small" /]
    ```yaml
    # ...
    download: "https://downloads.mesosphere.com/dcos-enterprise/stable/1.13.0/dcos_generate_config.ee.sh"
    # ...
    ```

    [oss type="inline" size="small" /]
    ```yaml
    # ...
    下载："https://downloads.dcos.io/dcos/stable/1.13.0/dcos_generate_config.sh"
    version: "1.13.0"
    enterprise_dcos: false
    # ...
    ```

4. Also in the variables file, set the following values under `config`. Enterprise users add your license key here. (Optional: specify a special script for your environment in `ip_detect_contents` or `ip_detect_public_contents` you can find the defaults here [ip-detect](https://github.com/dcos/dcos-ansible/blob/master/roles/DCOS.bootstrap/templates/onprem/ip-detect.j2) [ip-detect-public](https://github.com/dcos/dcos-ansible/blob/master/roles/DCOS.bootstrap/templates/onprem/ip-detect-public.j2)):
    ```yaml
    # ...
    cluster_name: <your-cluster-name>

    # 端口 8080 处的 bootstrap 节点的主机名或 IP（如果您是在公共云上部署，则这是节点的专用 IP）
    bootstrap_url: <bootstrap-IP-or-hostname>:8080

    # 将值列表更改为[管理节点]清单组中使用的管理节点的 IP。（如果您是在公共云上部署，则这些是节点的专用 IP）
    master_list:
      - IP1
      - IP2

    # 为 Enterprise 添加和取消注释此行；在此处粘贴或传递您的许可证密钥
    # license_key_contents: “YOUR_ENT_LICENSE_CONTENTS”
    #
    # 这是一个 ip-detect 脚本示例，它也表示 ip_detect_public_contents
    # 有关 ip-detect 的更多信息可在此处找到：/mesosphere/dcos/1.13/installing/production/deploying-dcos/installation/#create-an-ip-detection-script
    # ip_detect_contents: |
    #   #!/bin/sh
    #   set -o nounset -o errexit
    #   ip addr show dev eth1 primary | awk '/(inet .*\/)/ { print $2 }' | cut -d'/' -f1
    ```

5. (Optional) In `ansible.cfg`, set the appropriate `remote_user` to the user that you will connect as on your nodes. The default is set to `centos`.

## Confirming your setup
To test that you have everything set up correctly, use the ping module and ensure connectivity to all of your nodes:
```bash
ansible -m ping all
```
Which should return:
```bash
bootstrap | SUCCESS => {
    "changed": false,
    "ping": "pong"
}
master | SUCCESS => {
    "changed": false,
    "ping": "pong"
}
private-agent | SUCCESS => {
    "changed": false,
    "ping": "pong"
}
public-agent | SUCCESS => {
    "changed": false,
    "ping": "pong"
}
```

## Creating the DC/OS Cluster
We have provided a simple playbook to run the entire process of installing and managing DC/OS including all prerequisites based on your OS. The version of DC/OS that will be installed is based on the value you have configured in your variables file for `download` and `version`. The values are the most important to installing and upgrading your cluster.

To install DC/OS run the following command to execute the playbook.

```bash
ansible-playbook dcos.yml
```

**Note: Prior to DC/OS Install you will be required to either press ENTER to continue with install or CTRL-C to cancel install.**

```bash
任务 [DCOS.bootstrap : 仔细检查前缀/群集名和版本]
****************************************************************************************************************
[DCOS.bootstrap : 仔细检查前缀/群集名和版本]
仔细检查此群集的前缀/群集名和版本：

  群集：dcosansible
  版本：1.13.0 -> 1.13.0
  提交：非
  通过：     http://downloads.mesosphere.com/dcos-enterprise/stable/1.13.0/dcos_generate_config.ee.sh

如果不正确，请按 *ENTER* 或立即取消
```

When ansible is completed, you should see an output with no errors like below:

```bash
播放回顾**************************************************************************************************************** 
bootstrap                  : ok=24   changed=5    unreachable=0    failed=0
master                     : ok=24   changed=5    unreachable=0    failed=0
private_agent              : ok=24   changed=5    unreachable=0    failed=0
public_agent               : ok=24   changed=5    unreachable=0    failed=0
```

With very little effort we have created a DC/OS version running version 1.13.0. You can now access DC/OS via your master node(s) at: `http://master-node-ip`

## Logging In
To access the user interface, you will be asked to log in.

If you installed DC/OS Enterprise, you can login with default demo credentials. [enterprise type="inline" size="small" /]


* `username: bootstrapuser`
* `password: deleteme`

![enterprise-Login-Page](/mesosphere/dcos/1.13/img/dcos-ee-login.png)



If you installed DC/OS Open Source, select the OAuth provider of your choice. [oss type="inline" size="small" /]

![oss-login-page](/mesosphere/dcos/1.13/img/dcos-oe-login.png)

## Upgrading and managing your cluster
Upgrading your cluster to a newer version of DC/OS and making configuration changes is incredibly easy with Ansible. The modules have been designed to automatically detect the state of your cluster and nodes, and automatically get them to the newer declared state. It is even possible to change your agents configuration and upgrade DC/OS at the same time.

1. For example, to upgrade: in the variables file (`group_vars/all/dcos.yml`), set the following values under `dcos` according to your variant:

    [enterprise type="inline" size="small" /]
    ```bash
    # ...
    下载：“http://downloads.mesosphere.com/dcos-enterprise/stable/1.13.0/dcos_generate_config.ee.sh”`
    # ...
    ```

    [oss type="inline" size="small" /]
    ```bash
    # ...
    下载：“https://downloads.dcos.io/dcos/stable/1.13.0/dcos_generate_config.sh”
    version: “1.13.0"
    enterprise_dcos: false
    # ...
    ```

2. To add extra agents: First get them spun up and available. Then, open the `inventory` file. List each of your corresponding node IPs, as mentioned in the prerequisites, under the desired groups for `[agents_private]` and `[agents_public]`.

3. Save all changes and run the playbook again to update your cluster. The ansible modules will automatically calculate the changes and execute them in order.

    ```bash
    ansible-playbook dcos.yml
    ```
