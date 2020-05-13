---
layout: layout.pug
title: DC/OS Ansible 快速入门指南
navigationTitle: Ansible 快速入门
menuWeight: 1
excerpt: 指导完成通过 Ansible 安装 DC/OS。
---

如果您是 Ansible 新手和/或希望使用 Ansible 快速轻松地部署 DC/OS，请遵循本指南。我们将逐步指导您如何：
- 下载 DC/OS Ansible 内容
- 为 DC/OS 配置 Ansible
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

请参阅 [最低系统要求](/mesosphere/dcos/2.0/installing/production/system-requirements/) 以及支持的 CentOS 和 Redhat Enterprise Linux (RHEL) [您的节点的版本](/mesosphere/dcos/version-policy/#dcos-platform-version-compatibility-matrix/)，尤其是在针对生产环境进行计划时。
有关为 Ansible 设置 SSH 连接的更多信息，请参阅 [远程连接文档](https://docs.ansible.com/ansible/latest/user_guide/intro_getting_started.html#remote-connection-information)。
如果您要安装 DC/OS Enterprise Edition，则还需要一个适当的许可密钥。

<p class="message--note"><strong>注意：</strong>注册 Enterprise 客户可以从 <a href="https://support.mesosphere.com/s/downloads">支持网站</a>访问 DC/OS Enterprise 配置文件。对于新客户，请联系您的销售代表或 <a href="mailto:sales@mesosphere.io">sales@mesosphere.io</a> 获取更多信息。</p>

## 下载内容
我们维护并托管 [Ansible Galaxy 上的 DC/OS Ansible 项目](https://galaxy.ansible.com/dcos/dcos_ansible) 以便消耗。目前，我们以及 RedHat 都建议使用 Mazer 工具将所有必要内容本地下载到您的机器上。有关 Mazer 工具和如何配置的更多信息，请参阅 [此处的项目文档](https://galaxy.ansible.com/docs/mazer/index.html)。

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
- Ansible 配置 (`ansible.cfg`) - 您想让 Ansible 在您的环境中运行的方式。此外，大多数默认值是可接受的，除了 `remote_user`。

您可以使用 DC/OS Ansible 来安装 DC/OS 和 DC/OS Enterprise。请按照以下说明进行操作，并注明时根据您的变量进行调整。这里，我们将安装版本 `1.13.0`。

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
    download: "https://downloads.dcos.io/dcos/stable/1.13.0/dcos_generate_config.sh"
    version: "1.13.0"
    enterprise_dcos: false
    # ...
    ```

4. 同样在变量文件中，在 `config` 下设置以下值。Enterprise 用户在此添加您的许可证密钥。（可选：在 `ip_detect_contents` 或 `ip_detect_public_contents` 中为您的环境指定特殊脚本，您可以在此处找到默认值 [ip-detect](https://github.com/dcos/dcos-ansible/blob/master/roles/DCOS.bootstrap/templates/onprem/ip-detect.j2) [ip-detect-public](https://github.com/dcos/dcos-ansible/blob/master/roles/DCOS.bootstrap/templates/onprem/ip-detect-public.j2)）：
    ```yaml
    # ...
    cluster_name: <your-cluster-name>

    # The Hostname or IP of you bootstrap node at port 8080 (If you are deploying on a public cloud, this is the private IPs of the node)
    bootstrap_url: <bootstrap-IP-or-hostname>:8080

    # Change the value(s) list to the IP(s) of your master node(s) used in the [master] inventory group. (If you are deploying on a public cloud, those are the private IPs of the node)
    master_list:
      - IP1
      - IP2

    # Add and uncomment this line for enterprise; paste or pass in your license key here
    # license_key_contents: “YOUR_ENT_LICENSE_CONTENTS”
    #
    # This is an ip-detect script example which also stands for ip_detect_public_contents
    # more info about ip-detect can be found here: /mesosphere/dcos/2.0/installing/production/deploying-dcos/installation/#create-an-ip-detection-script
    # ip_detect_contents: |
    #   #!/bin/sh
    #   set -o nounset -o errexit
    #   ip addr show dev eth1 primary | awk '/(inet .*\/)/ { print $2 }' | cut -d'/' -f1
    ```

5. （可选）在 `ansible.cfg` 中，将适当的 `remote_user` 设置为您将要在节点上连接的用户。默认设置为 `centos`。

## 确认您的设置
要测试所有设置是否正确，请使用 ping 模块并确保与所有节点的连接性：
```bash
ansible -m ping all
```
哪种应返回：
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

## 创建 DC/OS 群集
我们提供了一个简单的 playbook，以便运行整个安装和管理 DC/OS 的过程，包括基于 OS 的所有先决条件。将安装的 DC/OS 版本基于您在变量文件中为 `download` 和 `version` 配置的值。这些值对安装和升级群集至关重要。

要安装 DC/OS，请运行以下命令来执行 playbook。

```bash
ansible-playbook dcos.yml
```

**注意：在 DC/OS 安装之前，您需要按 Enter 继续安装或 Ctrl-C 以取消安装。**

```bash
TASK [DCOS.bootstrap : Double check the prefix/cluster name and version]
****************************************************************************************************************
[DCOS.bootstrap : Double check the prefix/cluster name and version]
Please double check the prefix/cluster name and version of this cluster:

  Cluster: dcosansible
  Version: 1.13.0 -> 1.13.0
  Commit:  None
  via:     http://downloads.mesosphere.com/dcos-enterprise/stable/1.13.0/dcos_generate_config.ee.sh

PRESS *ENTER* OR CANCEL NOW IF IT ISN'T CORRECT
```

当 ansible 完成时，您应该看到没有错误的输出，如下所示：

```bash
PLAY RECAP ****************************************************************************************************************
bootstrap                  : ok=24   changed=5    unreachable=0    failed=0
master                     : ok=24   changed=5    unreachable=0    failed=0
private_agent              : ok=24   changed=5    unreachable=0    failed=0
public_agent               : ok=24   changed=5    unreachable=0    failed=0
```

我们非常轻松地创建了运行版本 1.13.0 的 DC/OS 版本。现在，您可以通过您的管理节点访问 DC/OS：`http://master-node-ip`

## 正在登录
要访问用户界面，将要求您登录。

如果安装了 DC/OS Enterprise，您可以使用默认演示凭据登录。[enterprise type="inline" size="small" /]


* `username: bootstrapuser`
* `password: deleteme`

![enterprise-Login-Page](/mesosphere/dcos/2.0/img/dcos-ee-login.png)



如果您安装了 DC/OS 开源，请选择所需的 OAuth 提供程序。[oss type="inline" size="small" /]

![oss-login-page](/mesosphere/dcos/2.0/img/dcos-oe-login.png)

## 升级和管理群集
使用 Ansible，将群集升级到更新版本的 DC/OS 并使配置更改变得非常简单。这些模块设计用于自动检测群集和节点的状态，并自动将其设置为较新的声明状态。甚至可以同时更改代理节点配置和升级 DC/OS。

1. 例如，要升级：在变量文件 (`group_vars/all/dcos.yml`) 中，根据您的变量在 `dcos` 下设置下列值：

    [enterprise type="inline" size="small" /]
    ```bash
    # ...
    download: “http://downloads.mesosphere.com/dcos-enterprise/stable/1.13.0/dcos_generate_config.ee.sh”`
    # ...
    ```

    [oss type="inline" size="small" /]
    ```bash
    # ...
    download: “https://downloads.dcos.io/dcos/stable/1.13.0/dcos_generate_config.sh”
    version: “1.13.0"
    enterprise_dcos: false
    # ...
    ```

2. 要添加额外代理节点：首先让它们转换并可用。然后，打开 `inventory` 文件。在 `[agents_private]` 和 `[agents_public]` 所需组的下方，列出每个相应的节点 IP，如前提条件中所述。

3. 保存所有更改并再次运行 playbook 以更新群集。Ansible 模块将自动计算更改并按顺序执行。

    ```bash
    ansible-playbook dcos.yml
    ```
