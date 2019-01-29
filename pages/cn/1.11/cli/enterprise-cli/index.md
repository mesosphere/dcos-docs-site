---
layout: layout.pug
title: DC/OS Enterprise CLI
menuWeight: 5
excerpt: 配置 DC/OS Enterprise 命令行界面

enterprise: true
---

DC/OS Enterprise CLI 为 DC/OS Enterprise 功能提供命令：

- [`dcos backup`](/cn/1.11/cli/command-reference/dcos-backup/)
- [`dcos license`](/cn/1.11/cli/command-reference/dcos-license/)
- [`dcos security`](/cn/1.11/cli/command-reference/dcos-security/)

# <a name="ent-cli-install"></a>安装 DC/OS Enterprise CLI

## 先决条件

DC/OS CLI 必须已经是 [已安装](/cn/1.11/cli/install/)。

<p class="message--note"><strong>注意: </strong> 必须从 DC/OS CLI 安装 DC/OS Enterprise CLI。无法在 Web 界面中从 Catalog 安装 DC/OS Enterprise CLI。</p>

若要安装 DC/OS Enterprise CLI，请从终端提示符发出以下命令。

```bash
dcos package install dcos-enterprise-cli
```

<p class="message--note"><strong>注意: </strong> 请勿使用 <tt>sudo</tt>。</p>


# <a name="ent-cli-upgrade"></a>升级 DC/OS Enterprise CLI

重新安装 DC/OS Enterprise CLI 升级软件包。

```bash
dcos package install dcos-enterprise-cli
```

# <a name="ent-cli-uninstall"></a>卸载 DC/OS Enterprise CLI

若要卸载 DC/OS Enterprise CLI，请发出以下命令。

```bash
dcos package uninstall dcos-enterprise-cli
```
