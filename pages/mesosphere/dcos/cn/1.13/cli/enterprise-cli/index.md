---
layout: layout.pug
title: DC/OS Enterprise CLI
menuWeight: 5
excerpt: 配置 DC/OS Enterprise 命令行界面
渲染：胡须
模型：/mesosphere/dcos/1.13/data.yml
enterprise: true
---

DC/OS Enterprise CLI 为 DC/OS Enterprise 功能提供命令：

- [`dcos backup`](/mesosphere/dcos/1.13/cli/command-reference/dcos-backup/)
- [`dcos license`](/mesosphere/dcos/1.13/cli/command-reference/dcos-license/)
- [`dcos security`](/mesosphere/dcos/1.13/cli/command-reference/dcos-security/)

# <a name="ent-cli-install"></a>安装 DC/OS Enterprise CLI

当设置从 CLI 到 DC/OS 群集的连接时，DC/OS Enterprise CLI **将自动安装**。

要确认 dcos-enterprise-cli 已安装，请运行 `dcos plugin list`。您可以看到 enterprise CLI，因为它现在是标准插件。要进行管理，请阅读 [关于 CLI 插件的文档](/mesosphere/dcos/1.13/cli/plugins/)。

使用 `dcos package install dcos-enterprise-cli` 的先前安装过程自 DC/OS 1.13 和 DC/OS CLI 0.8 以来已弃用。

## 已弃用安装 (DC/OS <= 1.12)
### 前提条件

DC/OS CLI 必须已经是 [已安装](/mesosphere/dcos/1.13/cli/install/)。

<p class="message--note"><strong>注意：</strong>必须从 DC/OS CLI 安装 DC/OS Enterprise CLI。无法在 Web 界面中从 {{ model.packageRepo }} 安装 DC/OS Enterprise CLI。</p>

若要安装 DC/OS Enterprise CLI，请从终端提示符发出以下命令。

```bash
dcos package install dcos-enterprise-cli
```

<p class="message--note"><strong>注意：</strong>请勿使用 <code>sudo</code>。</p>

<a name="ent-cli-upgrade"></a>

### 升级 DC/OS Enterprise CLI

重新安装 DC/OS Enterprise CLI 升级软件包。

```bash
dcos package install dcos-enterprise-cli
```


### <a name="ent-cli-uninstall"></a>卸载 DC/OS Enterprise CLI

若要卸载 DC/OS Enterprise CLI，请发出以下命令。

```bash
dcos package uninstall dcos-enterprise-cli
```
