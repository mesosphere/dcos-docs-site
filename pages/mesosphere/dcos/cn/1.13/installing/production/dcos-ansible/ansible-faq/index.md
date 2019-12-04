---
layout: layout.pug
title: DC/OS Ansible 常见问题和故障排除
navigationTitle: DC/OS Ansible 常见问题
menuWeight: 2
excerpt: 使用 DC/OS Ansible 时经常问的问题和常见问题
---

### 目录
- [官方文档和链接](#official-docs-and-links)
- [Ansible 新手](#new-to-ansible)
- [设置 SSH](#setting-up-ssh)
- [节点连接超时](#connection-timeout-to-node)
- [未提供清单文件](#no-inventory-file-provided)
- [remote_user 配置错误](#wrong-remoteuser-configured)
- [下载 URL 失败](#failure-downloading-url)
- [Mazer 安装目录](#mazer-install-directory)
- [更换 bootstrap 节点后 DC/OS 安装或升级失败](#dcos-installation-or-upgrade-fails-after-replacing-bootstrap-node)
- [配置更改和/或升级 DC/OS 版本](#config-changes-andor-upgrading-dcos-versions)


## 官方文档和链接
DC/OS Ansible 资源库在 [Github 在此处公布](https://github.com/dcos/dcos-ansible) 托管

官方的 Ansible Galaxy 页面和版本 [可在此处找到](https://galaxy.ansible.com/dcos/dcos_ansible)。

## Ansible 新手
如果您是 Ansible 新手，则强烈建议您先了解[入门](https://docs.ansible.com/ansible/latest/user_guide/intro_getting_started.html#remote-connection-information)指南。该指南更好地解释和介绍了我们如何使用 Ansible 来成功管理 DC/OS 生命周期。

## 设置 SSH
SSH 是指 Ansible 用来通过清单文件连接和管理主机的协议。如果您需要在 Ansible 控制机及其管理节点之间设置 SSH 连接，请参阅以下 [Ansible 文档](https://docs.ansible.com/ansible/latest/user_guide/intro_getting_started.html#remote-connection-information)。

然后，您可以通过以下方式测试连接：

```bash
ansible -m ping all
```

如果仍出现 ssh 错误，请确保您正在以正确的 `remote_user` 尝试进行连接。此项目的默认值为 `centos`，可能与您的情况不同。

如果您有不同的 `ansible.cfg`，则这也可能是 `host_key_checking` 的问题。您可以将其设置为 `False` 然后重试，或确保将正确的密钥添加到 ssh 代理。您可以通过以下方式检查您的密钥是否已添加：

```bash
ssh-add -l # for a list of keys
ssh-add ~/your/key # to add to ssh agent
```

## 节点连接超时
如果您的网络或节点繁忙，可能会出现超时，例如：

```bash
FAILED! => {"failed": true, "msg": "ERROR! Timeout (12s) waiting for privilege escalation prompt: "}
```

您只需再次重新运行 playbook，检查 ssh 下次运行时是否成功连接。它只会对相应节点进行更改。

如果您尝试多次并且继续发生错误而没有成功运行，您可能会对此开始故障排除，以了解节点是否存在问题。

## 未提供清单文件
发出 Asible 命令时，会出现以下错误：

```bash
[WARNING]: Unable to parse /etc/ansible/hosts as an inventory source

[WARNING]: No inventory was parsed, only implicit localhost is available

[WARNING]: provided hosts list is empty, only localhost is available. Note that the implicit localhost does not match 'all'
```
确保您位于含有清单文件的目录中。有关清单文件的更多信息，请参阅 [Ansible 文档](https://docs.ansible.com/ansible/latest/user_guide/intro_inventory.html#intro-inventory)。

## remote_user 配置错误
如果您在连接到以下机器时遇到错误：

```bash
fatal: [agent2-testsre.sre.mesosphe.re]: UNREACHABLE! => {"changed": false, "msg": "SSH Error: data could not be sent to remote host \"agent2-testsre.sre.mesosphe.re\". Make sure this host can be reached over ssh", "unreachable": true}
```

可能是您在尝试连接错误的 remote_user。请检查您的 `ansible.cfg` 或使用正确的远程用户运行命令。

```bash
Failure generating config
fatal: [172.16.2.65]: FAILED! => {"changed": true, "cmd": ["bash", "dcos_generate_config.ee.sh"], "delta": "0:00:02.724998", "end": "2019-04-08 17:50:51.568479", "msg": "non-zero return code", "rc": 1, "start": "2019-04-08 17:50:48.843481", "stderr": "\u001b[33m====> EXECUTING CONFIGURATION GENERATION\u001b[0m\nGenerating configuration files...\n\u001b[1;31mbouncer_expiration_auth_token_days: bouncer_expiration_auth_token_days must be a number of days or decimal thereof.\u001b[0m", "stderr_lines": ["\u001b[33m====> EXECUTING CONFIGURATION GENERATION\u001b[0m", "Generating configuration files...", "\u001b[1;31mbouncer_expiration_auth_token_days: bouncer_expiration_auth_token_days must be a number of days or decimal thereof.\u001b[0m"], "stdout": "", "stdout_lines": []}
module.dcos.module.dcos-install.module.dcos-install.null_resource.run_ansible_from_bootstrap_node_to_install_dcos (remote-exec): 	to retry, use: --limit @/dcos_playbook.retry
```

上述错误实际上不是 Ansible 错误，但是 dcos 发出的错误会生成配置脚本。请确保您的 DC/OS 配置有正确的密钥值。请参阅 DC/OS 文档了解 [配置参考](/mesosphere/dcos/1.13/installing/production/advanced-configuration/configuration-reference/)。

## 下载 URL 失败
确保您已为正在尝试安装的 DC/OS 的版本指定了正确的 URL。您可以通过以下方式找到可用链接：

- [DC/OS Enterprise](https://support.mesosphere.com/s/downloads)  [enterprise type="inline" size="small" /]

- [DC/OS](https://dcos.io/releases/)  [oss type="inline" size="small" /]

## Mazer 安装目录
不同版本的 Mazer 或定制 Mazer 安装都通过 Mazer 配置文件维护。在此配置文件中保持的其中一个配置是 content_path，这是从 Galaxy 提取内容的安装位置。如果您在找到内容路径或 Mazer 配置文件时遇到问题，请发出以下命令以找到 Mazer 配置文件：

```bash
mazer version | grep config
```

在 Mazer 配置文件中，检查 `content_path`。您可以在此查看有关 Mazer 配置文件的更多信息以及更多选项。

## 更换 bootstrap 节点后 DC/OS 安装或升级失败
如果您需要更换群集中的 bootstrap 节点实例，则需要更新要反映的新清单文件以反映以及变量文件中的 `bootstrap_url`。如果您在更换 bootstrap 节点后收到以下错误，请确保您也更新了变量文件。

```bash
TASK [DCOS.master : Upgrade: Run DC/OS master upgrade] **********************************************************************
fatal: [172.12.8.139]: FAILED! => {"changed": true, "cmd": "set -o pipefail; ./dcos_node_upgrade.sh --verbose | systemd-cat -t dcos-upgrade", "delta": "0:00:27.758455", "end": "2019-04-06 00:59:47.232139", "msg": "non-zero return code", "rc": 1, "start": "2019-04-06 00:59:19.473684", "stderr": "ERROR: Unable to fetch package dcos-config--setup_c0495a51346db67a274d71c612d1f0648ead23d0: Problem fetching http://172.12.6.132:8080/1.12.0/genconf/serve/packages/dcos-config/dcos-config--setup_c0495a51346db67a274d71c612d1f0648ead23d0.tar.xz to /tmp/tmp09jvhnfa.tar.xz because of HTTPConnectionPool(host='172.12.6.132', port=8080): Max retries exceeded with url: /1.12.0/genconf/serve/packages/dcos-config/dcos-config--setup_c0495a51346db67a274d71c612d1f0648ead23d0.tar.xz (Caused by NewConnectionError('<urllib3.connection.HTTPConnection object at 0x7f7272a92a90>: Failed to establish a new connection: [Errno 113] No route to host',)). Unable to remove partial download. Future builds may have problems because of it.", "stderr_lines": ["ERROR: Unable to fetch package dcos-config--setup_c0495a51346db67a274d71c612d1f0648ead23d0: Problem fetching http://172.12.6.132:8080/1.12.0/genconf/serve/packages/dcos-config/dcos-config--setup_c0495a51346db67a274d71c612d1f0648ead23d0.tar.xz to /tmp/tmp09jvhnfa.tar.xz because of HTTPConnectionPool(host='172.12.6.132', port=8080): Max retries exceeded with url: /1.12.0/genconf/serve/packages/dcos-config/dcos-config--setup_c0495a51346db67a274d71c612d1f0648ead23d0.tar.xz (Caused by NewConnectionError('<urllib3.connection.HTTPConnection object at 0x7f7272a92a90>: Failed to establish a new connection: [Errno 113] No route to host',)). Unable to remove partial download. Future builds may have problems because of it."], "stdout": "", "stdout_lines": []}
	to retry, use: --limit @/home/centos/ansible_collections/dcos/dcos_ansible/dcos-ansible-0.51.0/dcos.retry

```

## 配置更改和/或升级 DC/OS 版本
升级 DC/OS 版本或 DC/OS 配置更改是我们支持的两种群集升级方案。我们使这变得非常简单，需要很少的更改。我们的 dcos-ansible 工具能够确定您尝试执行的升级方案类型。

- 如果您尝试将 DC/OS 版本升级为新版本，只需将 `dcos.yml`（可变文件）中的 `download` 和 `version` 变量改为您所需的版本。然后，只需重新运行 playbook 便可让更改生效。

- 如果您想更改 DC/OS 配置参数，例如，更新解析器，只需对 `dcos.yml`（变量文件）中的所需 dcos 配置变量进行更改并重新运行 playbook。它将检测配置的变更并运行升级程序，以实行新配置。
