---
layout: layout.pug
navigationTitle:  扩展服务
title: 扩展服务
menuWeight: 3
excerpt: 使用 UI 和 CLI 扩展服务
enterprise: false
model: /mesosphere/dcos/1.13/data.yml
---

本教程介绍如何使用 UI 和 CLI 扩展服务。

# 通过 UI 扩展服务

1. 在 **服务** 选项卡中，单击服务右侧的菜单点以访问 **更多操作**。

    ![菜单](/mesosphere/dcos/1.13/img/GUI-Services-More-Actions_Callout.png)
   
    图 1. 更多操作菜单

2. 从下拉菜单中，选择 **扩展**。

   ![更多操作菜单](/mesosphere/dcos/1.13/img/GUI-Services-More-Actions-Menu.png)

   图 2. 更多操作菜单

3. 在 **扩展服务** 框中，输入您想要的实例总数，然后单击 **扩展服务**。

   ![scale](/mesosphere/dcos/1.13/img/GUI-Services-Scale-Service-Instances.png)

   图 3. 选择实例数

4. 在“服务”选项卡中，您可以看到您的服务扩展。

    ![服务部署](/mesosphere/dcos/1.13/img/GUI-Services-Scale-Confirmation.png)
    
    图 4. 服务扩展

5. 单击服务名称查看扩展的服务。
   ![post scale](/mesosphere/dcos/1.13/img/GUI-Services-Scaled-Service.png)

   图 5. 服务列表 

# 通过 CLI 扩展服务

您将需要 `app-id` 用于本程序。

1. 在 CLI 中输入以下命令，将 `app-id` 替换为自己的值以及将 `total_desired_instances` 替换为自己的编号：

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
