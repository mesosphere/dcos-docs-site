---
layout: layout.pug
excerpt: 在 DC/OS 开源上安装和自定义 Marathon-LB
title: 在 DC/OS 开源上安装和自定义
menuWeight: 1
navigationTitle: 上安装和自定义 ： 开源
---


**先决条件：**

- DC/OS [已安装](/cn/1.11/installing/oss/)
- DC/OS CLI [已安装](/cn/1.11/cli/install/)

# 默认安装

从 DC/OS CLI 输入此命令：

  ```bash
  dcos package install marathon-lb
  ```

**提示：** 您也可以从 DC/OS [GUI] 安装(/1.10/gui/)。


# 自定义安装

1. 从 DC/OS CLI 查看可用的 Marathon-LB 配置选项：

  ```bash
  dcos package describe --config marathon-lb
  ```

 输出应与此类似：

  ```json
  {
    "$schema": "http://json-schema.org/schema#",
    "properties": {
      "marathon-lb": {
        "properties": {
          "auto-assign-service-ports": {
            "default": false,
            "description": "Auto assign service ports for tasks which use IP-per-task. See https://githu
  b.com/mesosphere/marathon-lb#mesos-with-ip-per-task-support for details.",
            "type": "boolean"
          },
          "bind-http-https": {
            "default": true,
            "description": "Reserve ports 80 and 443 for the LB. Use this if you intend to use virtual h
  osts.",
            "type": "boolean"
          },
  ...
  ```

2. 使用您的自定义创建 JSON 配置文件。您可以选择任意名称，但您可能想要选择像 `marathon-lb-config.json`这样的模式。例如，将 CPU 共享更改为 3，内存分配改为 2048：

  ```json
  {
    "marathon-lb": {
      "instances": 3.0, "mem": 2048.0
      }
  }
  ```

3. 从 DC/OS CLI，安装 Marathon-LB，并指定您的自定义选项文件。

  ```bash
  dcos package install --options=<filename>.json marathon-lb
  ```

## 后续步骤

- [教程 - 使用 Marathon-LB 部署负载均衡应用](/cn/services/marathon-lb/mlb-basic-tutorial/)
- [教程 - 使用 Marathon-LB 进行内部和外部负载均衡](/cn/services/marathon-lb/marathon-lb-advanced-tutorial/)
- 查看高级 Marathon-LB [文档](/cn/services/marathon-lb/advanced/)。
