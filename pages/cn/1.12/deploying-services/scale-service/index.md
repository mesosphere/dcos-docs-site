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

1. 在 **服务** 选项卡中，单击右侧的菜单点以访问 **更多操作**。
1. 单击菜单符号并选择 **扩展条件**。
    ![menu symbol](/1.12/img/GUI-Services-List_View_Item_More_Actions_Menu-1_12.png)

    图 1. 更多操作菜单

1. 输入您想要的实例总数，然后单击**扩展服务**。
    ![scale](/img/scale-services.png)

    图 2. 选择实例数

1. 单击服务名称查看扩展的服务。
    ![post scale](/img/post-scale-services.png)

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
