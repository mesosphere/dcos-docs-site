---
layout: layout.pug
navigationTitle: 节点和群集健康检查
title: 节点和群集健康检查
menuWeight: 25
excerpt: 使用您的 DC/OS 群集进行健康检查
---


节点和群集健康检查提供群集信息，包括可用端口、Mesos 代理节点状态和 IP 检测脚本验证。健康检查是通过其退出代码报告 DC/OS 群集或节点状态的 shell 命令。您可以编写自己的自定义健康检查或使用预定义的检查。

# 预定义的健康检查
DC/OS 包括一组针对 DC/OS 核心组件的预定义内置健康检查。这些内置检查可验证以下内容：

- 所有 DC/OS 组件都是健康的。
- XZ 实用程序可用。
- IP 检测脚本生成有效输出。
- Mesos 代理节点已经注册了管理节点。

# 自定义健康检查
自定义检查是由用户编写的检查，在 `config.yaml` 文件中安装 DC/OS 时指定。应为非核心 DC/OS 组件编写自定义检查。DC/OS 核心组件的健康检查包括在 [预定义的健康检查](#predefined-health-checks) 中，可直接使用。
例如，您可以编写自定义健康检查以验证以下内容：

- DC/OS 服务是否健康
- 节点上的本地装载是否健康

## 创建自定义健康检查
自定义健康检查是一组用户定义命令，可添加到一组用于判定节点或群集健康状况的检查中。自定义健康检查必须采用下表中的一种退出代码报告状态。

| 代码 | 状态 | 描述 |
|--------------|----------|---------------------------------------------------|
| 0 | 正常 | 检查通过。无需调查。 |
| 1 | 警告 | 检查通过，但可能需要调查。|
| 2 | 重要 | 检查失败。调查是否出现意外。|
| 3 或更大 | 未知 | 状态无法确定。调查。 |

或者，您可以配置检查以输出可人工读取的消息到 `stderr` 或 `stdout`。

## 指定自定义健康检查
在安装 DC/OS，之前，必须在 `custom_checks` 安装配置参数中指定自定义健康检查。如果您想在安装后修改配置文件，就必须遵循 [DC/OS 升级流程](/1.11/installing/production/upgrading/)。

如果文件是绝对路径（例如，在 `/usr/bin/` 中有可执行文件），您可以直接在 `cmd` 中指定该文件。如果用名称引用没有绝对路径的可执行文件（例如， `echo` 而不是 `/usr/bin/echo`），系统将使用此搜索路径，并使用其发现的第一个可执行文件来查找：`/opt/mesosphere/bin:/usr/bin:/bin:/sbin`。

有关此参数的描述和示例，请参阅 [配置参数文档](/1.11/installing/production/advanced-configuration/configuration-reference/#custom-checks)。

## 自定义健康检查可执行文件
在安装 DC/OS，之前，您可以选择在 `genconf/check_bins/` 提供可执行文件的目录，列出要分发到所有群集节点，用于自定义检查的可执行文件。如果提供，这些可执行文件将被添加到检查可执行文件的搜索路径末尾。若要使用自定义检查可执行文件，参考 `custom_checks` 不带绝对路径的参数（例如，要在自定义检查中使用 `genconf/check_bins/custom_script.sh` ，请参阅 `custom_script.sh`）。

# 健康检查的类型

## 群集检查
群集检查报告整个 DC/OS 群集的健康状况。所有节点上的集群均可运行群集检查。通过 SSH 连接到群集节点并运行此命令：`/opt/mesosphere/bin/dcos-shell dcos-diagnostics check cluster --list`，可以发现定义了哪些群集检查。

## 节点检查
节点检查会在安装后报告各个节点的状态。通过 SSH 连接到各个节点，可在安装后运行节点检查。可以通过 SSH 连接到区级节点并运行此命令: `/opt/mesosphere/bin/dcos-shell dcos-diagnostics check node-poststart --list`，可以查看定义了哪些节点检查。

# 运行健康检查
可在群集节点运行以下命令，调用自定义或预定义的健康检查。

**前提条件：**

- DC/OS 已安装，您已通过超级用户权限登录。


1. [SSH 连接到群集节点](/1.11/administering-clusters/sshcluster/)。

    ```bash
    dcos node --master-proxy --mesos-id=<agent-node-id>
    ```

1. 运行此命令以查看可用的健康检查，需采用指定的检查类型 (`<check-type>`) specified. The check type can be either cluster (`cluster`) or node (`node-poststart`). 

    ```bash
    /opt/mesosphere/bin/dcos-shell dcos-diagnostics check <check-type> --list
    ```

 输出应类似于：

    ```bash
    {
      "clock_sync": {
        "description": "System clock is in sync.",
        "cmd": [
          "/opt/mesosphere/bin/dcos-checks",
          "time"
        ],
        "timeout": "1s"
      },
      "components_agent": {
        "description": "All DC/OS components are healthy",
        "cmd": [
          "/opt/mesosphere/bin/dcos-checks",
          "--role",
          "agent",
          "--iam-config",
          "/run/dcos/etc/dcos-diagnostics/agent_service_account.json",
          "--force-tls",
          "--ca-cert=/run/dcos/pki/CA/ca-bundle.crt",
          "components",
          "--scheme",
          "https",
          "--port",
          "61002"
        ],
        "timeout": "3s"
      },
      ...
    ```

1. 使用指定的检查名称运行检查 (`<checkname>`) 。

    ```bash
    /opt/mesosphere/bin/dcos-shell dcos-diagnostics check node-poststart <checkname>
    ```

 例如：运行 `component_agent` 检查。

    ```bash
    /opt/mesosphere/bin/dcos-shell dcos-diagnostics check node-poststart component_agent
    ```   

 输出应类似于：

    ```bash
    {
      “status”: 2,
      “checks”: {
        “component_agent”: {
          “status”: 2,
          “output”: “”
        },
        “exhibitor”: {
          “status”: 0,
          “output”: “”
        }
      }
    }
    ```


# 示例

## 列出所有检查

列出所有群集检查。

```
/opt/mesosphere/bin/dcos-shell dcos-diagnostics check cluster --list
```

列出所有节点检查。

```bash
/opt/mesosphere/bin/dcos-shell dcos-diagnostics check node-poststart --list
```

## 列出特定检查

列出特定群集检查（`check1`）。

```bash
/opt/mesosphere/bin/dcos-shell dcos-diagnostics check cluster --list check1 [check2 [...]]
```

列出特定节点检查（`check1`）。

```bash
/opt/mesosphere/bin/dcos-shell dcos-diagnostics check node-poststart --list check1 [check2 [...]]
```

## 运行所有检查

运行群集检查。

```bash
/opt/mesosphere/bin/dcos-shell dcos-diagnostics check cluster
```

运行节点检查。

```bash
/opt/mesosphere/bin/dcos-shell dcos-diagnostics check node-poststart
```

## 运行特定检查

运行特定群集检查（`check1`）。

```bash
dcos-diagnostics check cluster check1 [check2 [...]]
```

运行特定节点检查（`check1`）。

```bash
dcos-diagnostics check node-poststart check1 [check2 [...]]
```
