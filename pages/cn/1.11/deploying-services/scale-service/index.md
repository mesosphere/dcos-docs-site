---
layout: layout.pug
navigationTitle: 扩展服务
title: 扩展服务
menuWeight: 3
excerpt: 使用 Web 界面和 CLI 扩展服务

enterprise: false
---

本教程介绍如何使用 Web 界面和 CLI 扩展服务。

# 通过 Web 界面扩展服务

1. 在 **服务** 选项卡中，将光标放在要扩展的服务名称上，就会显示齿轮符号。
1. 单击齿轮符号并选择 **扩展**。
 ![gear symbol](/cn/1.11/img/gear-services.png)

 图 1. 下拉式设置菜单和选项

1. 输入您想要的实例总数，然后单击**扩展服务**。
 ![scale](/cn/1.11/img/scale-services.png)

 图 2. 选择实例数

1. 单击服务名称查看扩展的服务。
 ![post scale](/cn/1.11/img/post-scale-services.png)

 图 3. 服务列表

# 通过 CLI 扩展服务

1. 在 CLI 中输入以下命令：

    ```bash
    dcos marathon app update <app-id> instances=<total_desired_instances>
    ```

1. 输入此命令以查看扩展的服务。

    ```bash
    dcos task <task-id>
    ```


例如，此任务将扩展为 6 个实例：

```bash
dcos marathon app update basic-0 instances=6
dcos task basic-0
NAME     HOST        USER  STATE  ID                                            
basic-0  10.0.0.10   root    R    basic-0.1c73e448-0b47-11e7-a8b6-de4438bbb8f0  
basic-0  10.0.1.101  root    R    basic-0.1c739626-0b47-11e7-a8b6-de4438bbb8f0  
basic-0  10.0.1.41   root    R    basic-0.1c736f14-0b47-11e7-a8b6-de4438bbb8f0  
basic-0  10.0.1.92   root    R    basic-0.12d5bbc2-0b47-11e7-a8b6-de4438bbb8f0  
basic-0  10.0.1.92   root    R    basic-0.1c73bd37-0b47-11e7-a8b6-de4438bbb8f0  
basic-0  10.0.3.180  root    R    basic-0.1c739625-0b47-11e7-a8b6-de4438bbb8f0
```
