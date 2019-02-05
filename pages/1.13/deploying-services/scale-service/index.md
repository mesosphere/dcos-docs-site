---
layout: layout.pug
navigationTitle:  Scaling a Service
title: Scaling a Service
menuWeight: 3
excerpt: Scaling a service using the web interface and the CLI

enterprise: false
---

This tutorial shows how to scale a service using the web interface and the CLI.

# Scale Your Service from the Web Interface

1. From the **Services** tab, click the menu dots to the right side to access **More Actions**.  
1. Click the menu symbol and choose **Scale By**.
   ![menu symbol](/1.13/img/GUI-Services-List_View_Item_More_Actions_Menu-1_12.png)

   Figure 1. More Actions menu

1. Enter the total number of instances you would like, then click **SCALE SERVICE**.
   ![scale](/img/scale-services.png)

   Figure 2. Choose number of instances

1. Click the name of your service to see your scaled service.
   ![post scale](/img/post-scale-services.png)

   Figure 3. Services list

# Scale Your Service from the CLI

1.  Enter the following command from the CLI, :

    ```bash
    dcos marathon app update <app-id> instances=<total_desired_instances>
    ```

1.  Enter this command to see your scaled service.

    ```bash
    dcos task <task-id>
    ```


For example, this task is scaled to 6 instances:

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
