---
layout: layout.pug
title: 从 DC/OS CLI 调试
menuWeight: 10
excerpt: 从命令行界面调试 DC/OS
beta: true
enterprise: false
---

DC/OS CLI 提供命令以调试未按照预期部署或表现的服务。要查看完整日志，请附加 `--log-level=debug` 到任何 DC/OS CLI 命令。例如，要排除 HDFS 软件包安装故障，请使用此命令：

```bash
dcos -—log-level="debug" package install hdfs
```
有关日志级别的更多信息，请参阅 [CLI 命令参考](/cn/1.11/cli/command-reference/) 或运行 `dcos --help`。

# 调试被卡住部署的子命令

DC/OS CLI 提供一组调试子命令，用于排除卡住的服务或 Pod 部署。您也可以从 [DC/OS Web 界面] 使用调试服务和 Pod(/1.11/monitoring/debugging/gui-debugging/)。

## 先决条件
- DC/OS 集群
- [DC/OS CLI 已安装](/cn/1.11/cli/install/)
- 部署时卡住的服务或 Pod

## 应用定义示例
如果您目前没有在部署时卡住的服务或 Pod，您可以使用以下两个 [Marathon 应用定义](/cn/1.11/deploying-services/creating-services/) 来验证本节的说明。

- mem-app.json

 此服务通过请求多于可获得的内存来创建无限部署。

  ```json
  {
        "id": "mem-app",
        "cmd": "sleep 1000",
        "cpus": 0.1,
        "mem": 12000,
        "instances": 3,
        "constraints": [
                [
                        "hostname",
                        "UNIQUE"
                ]
        ]
  }
  ```

- stuck-sleep.json

 此服务请求过多实例。

  ```json
  {
          "id": "stuck-sleep",
          "cmd": "sleep 1000",
          "cpus": 0.1,
          "mem": 3000,
          "instances": 10,
          "constraints": [
                  [
                          "hostname",
                          "UNIQUE"
                  ]
          ]
  }
  ```

## dcos marathon debug list

[`dcos marathon debug list`](/cn/1.11/cli/command-reference/dcos-marathon/dcos-marathon-debug-list/) 命令向您显示处于等待状态的所有服务。这让您能够只查看未在运行的服务。

```bash
dcos marathon debug list

ID 起始时间 等待启动的实例数 已处理的邀约 未使用的邀约 最后一个未使用的邀约 最后一个使用的邀约 
/mem-app 2017-02-28T19:08:59.547Z 3 True 13 13 2017-02-28T19:09:35.607Z ---                       
/stuck-sleep 2017-02-28T19:09:25.56Z 9 True 8 7 2017-02-28T19:09:35.608Z 2017-02-28T19:09:25.566Z
```

命令的输出表明：

- 多少个服务或 Pod 的实例在等待启动。
- 多少个 Mesos 资源邀约已处理。
- 多少个 Mesos 资源邀约未使用
- 用户创建或更新服务或 Pod 的时间。

此输出可以快速向您显示部署时哪些服务或 Pod 被卡住，以及它们卡住了多长时间。

## dcos marathon debug summary

一旦您知道部署时哪些服务或 Pod 被卡住，便可以使用 [`dcos marathon debug summary/<app-id>|/<pod-id>` 命令](/cn/1.11/cli/command-reference/dcos-marathon/dcos-marathon-debug-summary/)，了解有关特定被卡住服务或 Pod 的更多信息。

```bash
dcos marathon debug summary /mem-app

资源 请求的 匹配的 百分比 
角色 [*] 1 / 2 50.00% 
约束 [['hostname', 'UNIQUE']] 1 / 1 100.00% 
CPUS 0.1 1 / 1 100.00% 
MEM 12000 0 / 1 0.00% 
磁盘 0 0 / 0 ---         
端口 --- 0 / 0 ---  
```

此命令的输出显示了资源、请求的服务或 Pod、匹配的邀约数，以及匹配邀约的百分比。此命令可以快速显示哪些资源请求未被满足。


## dcos marathon debug details

[`dcos marathon debug details /<app-id>|/<pod-id>` 命令](/cn/1.11/cli/command-reference/dcos-marathon/dcos-marathon-debug-details/) 可以让您确切了解应当如何更改您的服务或 Pod 定义。

```bash
dcos marathon debug details /mem-app

HOSTNAME    ROLE  CONSTRAINTS  CPUS  MEM  DISK  PORTS  RECEIVED                  
10.0.0.193   ok        ok       ok    -    ok     ok   2017-02-28T23:25:11.912Z  
10.0.4.126   -         ok       -     -    ok     -    2017-02-28T23:25:11.913Z
```

命令的输出表明：

- 哪些主机正在运行服务或 Pod
- 服务或 Pod 请求的角色、约束、CPU、内存、磁盘和端口的状态
- 收到最后一个资源邀约的时间

上例中，您可以看到一个 `/mem-app` 实例的状态在除内存以外的所有其他类别中为 `ok`。另一个实例的成功资源匹配比较少，角色、CPU、内存和端口均没有匹配项。

有关此命令的更多信息，请参阅 [CLI 命令参考部分](/cn/1.11/cli/command-reference/dcos-marathon/dcos-marathon-debug-details/)。
