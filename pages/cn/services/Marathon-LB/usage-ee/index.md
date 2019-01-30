---
layout: layout.pug
title: 在 DC/OS Enterprise 上安装和自定义
menuWeight: 2
excerpt: 在 DC/OS 企业上安装和自定义 Marathon-LB
navigationTitle: 上安装和自定义 ： 企业
enterprise: true
---

## 关于安装 Marathon-LB

安装流程因您的 [安全模式而异](/cn/1.11/installing/ent/custom/configuration/configuration-parameters/#security-enterprise)。有关分步说明，请参阅与安全模式相对应的部分。

- [`disabled` 和 `permissive` 模式](#mlb-disabled-install)
- [`strict` 模式](#mlb-strict-perm-install)

## <a name="mlb-disabled-install"></a>在禁用和宽容模式下安装

### 使用 DC/OS CLI

**先决条件：**
- [已安装 DC/OS CLI](/cn/1.11/cli/install/)
- 作为具有 [必要权限 的用户通过 `dcos auth login` 登录](/cn/1.11/security/ent/perms-reference/)。

如果您不想更改任何默认设置，您可以使用以下命令安装 Marathon-LB：

```bash
dcos package install marathon-lb
```

要自定义 Marathon-LB，使用以下命令来确定其选项。

```bash
dcos package describe --config marathon-lb
```

创建新的 `config.json` 文件以覆盖任何一个默认设置，并使用以下命令安装 Marathon-LB，其中 `config.json` 包含自定义设置。

```bash
dcos package install --options=config.json marathon-lb
```

### 使用目录

要在 `disabled` 和 `permissive` 模式中从目录中安装 Marathon-LB，以具有[必要权限的用户身份登录到 DC/OS Web 界面](/cn/1.11/security/ent/perms-reference/)。

1. 单击 **目录** 选项卡。
2. 找到 **marathon-lb**包。
3. 单击 **查看和运行**。
4. 要选择自定义 Marathon-LB，单击 **编辑**自定义参数，然后单击 **查看和运行**。
5. 单击 **运行服务**。

## <a name="mlb-strict-perm-install"></a>以严格模式安装

**先决条件：**

- Marathon-LB 需要一个`strict` [安全模式](/cn/1.11/installing/ent/custom/configuration/configuration-parameters/#security-enterprise)中的服务帐户。只有具有 `superuser` 权限的用户才能创建服务帐户。请参阅 [Provisioning Marathon-LB](/cn/services/marathon-lb/mlb-auth/) 了解说明。

- [已安装 DC/OS CLI](/cn/1.11/cli/install/) 并作为具有 [必要权限](/cn/1.11/security/ent/perms-reference/)的用户通过 `dcos auth login` 登录。

需要 [Provisioning Marathon-LB](/cn/services/marathon-lb/mlb-auth/) 中显示的参数才能安装 Marathon-LB。在安装服务之前，您可能希望修改其他默认值。要查看 Marathon-LB 的配置选项和默认值，请键入以下命令。

```bash
dcos package describe --config marathon-lb
```

您拥有包含所需和可选参数的 `config.json` 文件后，使用以下命令进行安装。

```bash
dcos package install --options=config.json marathon-lb
```

# 后续步骤

- [教程 - 使用 Marathon-LB 部署负载均衡应用](/cn/services/marathon-lb/marathon-lb-basic-tutorial/)
- [教程 - 使用 Marathon-LB 进行内部和外部负载均衡](/cn/services/marathon-lb/marathon-lb-advanced-tutorial/)
- 查看高级 Marathon-LB [文档](/cn/services/marathon-lb/advanced/)。

 [1]: /1.10/installing/
 [2]: /1.10/cli/install/
 [3]: /1.10/administering-clusters/managing-aws/
 [4]: /1.10/administering-clusters/sshcluster/
