---
layout: layout.pug
title: 限制对 DC/OS 服务组的访问
navigationTitle: 限制对 DC/OS 服务组的访问
menuWeight: 90
excerpt: 使用 DC/OS UI 在宽容模式下实现多租户
enterprise: true
render: mustache
model: /mesosphere/dcos/2.0/data.yml
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->

在本部分，您将看到如何使用 DC/OS UI 在宽容模式下实现多租户。

本教程演示如何在宽容[安全模式](/mesosphere/dcos/2.0/security/ent/#security-modes)下实现 DC/OS 服务的用户权限。完成后，您将通过使用 DC/OS 权限获得多租户。

**前提条件：**

- DC/OS Enterprise [已安装](/mesosphere/dcos/2.0/installing/)在宽容[模式](/mesosphere/dcos/2.0/security/ent/#security-modes)下。


## 创建用户和组

1. 从 **Services > Services > Create Group** 创建服务组。

    ![服务创建组](/mesosphere/dcos/2.0/img/GUI-Services-No_Services_Running-1_12.png)

    图 1. 创建组页面

    在此示例中，创建了一个名为 `prod-a` 和一个名为 `prod-b`。创建组之后，您应该看到两个文件夹。您可以在此处为用户组部署服务并为每个单元设置权限。

    ![组文件夹](/mesosphere/dcos/2.0/img/GUI-Services-List_View_Groups_Empty-1_12.png)

    图 2. 新建组文件夹

1. 创建用户和组并定义每个组所需的权限。

    1. 选择 **Organization > Users** 并创建新用户。在此示例中，创建了两个用户（`Cory` 和 `Nick`）。

        ![创建用户 Cory](/mesosphere/dcos/2.0/img/GUI-Organization-Users-Create_User_Modal-1_12.png)

        图 3. 创建新用户

        完成后，您应该看到两个用户。

        ![所有用户](/mesosphere/dcos/2.0/img/GUI-Organization-Users-Users_List_View_w_Users-1_12.png)

        图 4. 用户页面中的新用户

        接下来，我们将创建组并为 DC/OS 服务分配权限。

    1. 从 **Organization > Groups** 创建用户组。

    1. 选择 **New Group**。在本示例中，创建了两个组：

        - `prod-a-group`，用于管理用户 Cory 的 DC/OS 服务。
        - `prod-b-group`，用于管理用户 Nick 的 DC/OS 服务。

        ![prod-a group](/mesosphere/dcos/2.0/img/GUI-Organization-Groups-Create_New_Group_Modal-1_12.png)

        图 5. 创建新组

## 定义权限

1. 选择 **Organization > Groups**。

1. 选择 **prod-a-group** 并选择 **ADD PERMISSION**。在此示例中，权限被分配给 prod-a，以允许用户创建自己的服务！

1. 选择 **INSERT PERMISSION STRING** 切换键以使用字符串格式进行输入。字符串区分大小写。

    此处添加了每个组所需的所有权限。这些权限允许用户访问 DC/OS 群集并部署自己的服务。这些权限也将限制每个组，以便他们只能看到自己的 DC/OS 服务。

1. 为 prod-a-group 添加这些权限，然后单击 **Close**。

    ```
    dcos:adminrouter:service:marathon full
    dcos:adminrouter:service:nginx full
    dcos:service:marathon:marathon:services:/prod-a full
    dcos:adminrouter:ops:slave full
    dcos:adminrouter:ops:mesos full
    dcos:adminrouter:package full
    ```

    ![prod-a-group](/mesosphere/dcos/2.0/img/GUI-Organization-Groups-Add_Permission_String_w_Perms-1_12.png)

    图 6. 为 `prod-a-group` 添加权限

    以下是添加后的权限视图：

    ![prod-a-group](/mesosphere/dcos/2.0/img/GUI-Organization-Groups-Group_Detail_w_Permissions-1_12.png)

    图 7. 添加的组权限

1. 为 `prod-b-group` 添加这些权限并单击 **关闭**。

    ```
    dcos:adminrouter:service:marathon full
    dcos:adminrouter:service:nginx full
    dcos:service:marathon:marathon:services:/prod-b full
    dcos:adminrouter:ops:slave full
    dcos:adminrouter:ops:mesos full
    dcos:adminrouter:package full
    ```

    既然权限被分配给组，您可以将用户添加到组以继承权限。

1. 选择 **Organization > Users**，然后选择 **Cory**。

1. 选择 **Group Membership**，然后在搜索框中键入 `prod-a-group`，然后单击选择。

    ![prod-a-group](/mesosphere/dcos/2.0/img/GUI-Organization-Groups-User_Add_Group_Membership-1_12.png)

    图 8. 将用户添加到组

1. 选择 **Organization > Users**，然后选择 **Nick**。

1. 选择 **Group Membership**，然后在搜索框中键入 `prod-b-group`，然后单击选择。


## 以用户身份登录到 DC/OS UI。

1. 以 Cory 身份登录到 DC/OS UI。您可以看到，用户 Cory 只能访问 **服务** 和 **{{ model.packageRepo }}** 选项卡。同时，Cory 只能看到 **prod-a** 服务。


  ![prod-a-group](/mesosphere/dcos/2.0/img/GUI-Services-Limited_User_Access_List-1_12.png)


  图 9. 限制视图

  <p class="message--note"><strong>注意：</strong>要退出当前用户，可单击右上角的用户名，然后选择<strong>注销</strong>。</p>

  我们将把 NGINX 服务部署到 `prod-a-group`。

1. 选择 **Services > Services**，然后单击加号 (**+**) 来部署服务。

1. 选择 **JSON Configuration** 并粘贴到以下应用定义中：

      ```json
      {
        "id": "/prod-a/nginx",
        "cmd": "rm -rf /usr/share/nginx/html && ln -s /mnt/mesos/sandbox/hello-nginx-master/ /usr/share/nginx/html && nginx -g 'daemon off;'",
        "instances": 1,
        "cpus": 1,
        "mem": 1024,
        "disk": 0,
        "gpus": 0,
        "fetch": [
          {
            "uri": "https://github.com/mesosphere/hello-nginx/archive/master.zip",
            "extract": true,
            "executable": false,
            "cache": false
          }
        ],
        "backoffSeconds": 1,
        "backoffFactor": 1.15,
        "maxLaunchDelaySeconds": 300,
        "container": {
          "type": "DOCKER",
          "docker": {
            "image": "nginx:1.8.1",
            "network": "BRIDGE",
            "portMappings": [
              {
                "hostPort": 0,
                "containerPort": 80,
                "protocol": "tcp",
                "servicePort": 10000
              },
              {
                "hostPort": 0,
                "containerPort": 443,
                "protocol": "tcp",
                "servicePort": 10001
              }
            ],
            "privileged": false,
            "forcePullImage": false
          }
        },
        "healthChecks": [
          {
            "gracePeriodSeconds": 300,
            "intervalSeconds": 60,
            "timeoutSeconds": 20,
            "maxConsecutiveFailures": 3,
            "protocol": "COMMAND",
            "command": {
              "value": "service nginx status | grep -q 'nginx is running.'"
            }
          }
        ],
        "upgradeStrategy": {
          "minimumHealthCapacity": 1,
          "maximumOverCapacity": 1
        },
        "unreachableStrategy": {
          "inactiveAfterSeconds": 900,
          "expungeAfterSeconds": 604800
        },
        "killSelection": "youngest_first",
        "acceptedResourceRoles": [
          "*"
        ],
        "requirePorts": false,
        "labels": {
          "DCOS_PACKAGE_RELEASE": "1",
          "DCOS_SERVICE_SCHEME": "http",
          "DCOS_PACKAGE_SOURCE": "https://universe.mesosphere.com/repo",
          "DCOS_PACKAGE_METADATA": "eyJwYWNrYWdpbmdWZXJzaW9uIjoiMi4wIiwibmFtZSI6Im5naW54IiwidmVyc2lvbiI6IjEuOC4xIiwibWFpbnRhaW5lciI6InN1cHBvcnRAbmdpbnguY29tIiwiZGVzY3JpcHRpb24iOiJOZ2lueCBwYWNrYWdlIiwidGFncyI6WyJwcm94eSIsIndlYi1zZXJ2ZXIiLCJjYWNoZSJdLCJzY20iOiJodHRwOi8vaGcubmdpbngub3JnL25naW54LyIsInByZUluc3RhbGxOb3RlcyI6IlByZXBhcmluZyB0byBpbnN0YWxsIG5naW54LiIsInBvc3RJbnN0YWxsTm90ZXMiOiJOZ2lueCBoYXMgYmVlbiBpbnN0YWxsZWQuIiwicG9zdFVuaW5zdGFsbE5vdGVzIjoiTmdpbnggd2FzIHVuaW5zdGFsbGVkIHN1Y2Nlc3NmdWxseS4iLCJsaWNlbnNlcyI6W3sibmFtZSI6IkJTRCBsaWtlIiwidXJsIjoiaHR0cDovL25naW54Lm9yZy9MSUNFTlNFIn1dLCJpbWFnZXMiOnsiaWNvbi1zbWFsbCI6Imh0dHBzOi8vcGJzLnR3aW1nLmNvbS9wcm9maWxlX2ltYWdlcy81Njc3NzQ4NDQzMjI3MTM2MDAvdFlvVmp1MzEucG5nIiwiaWNvbi1tZWRpdW0iOiJodHRwczovL3Bicy50d2ltZy5jb20vcHJvZmlsZV9pbWFnZXMvNTY3Nzc0ODQ0MzIyNzEzNjAwL3RZb1ZqdTMxLnBuZyIsImljb24tbGFyZ2UiOiJodHRwczovL3Bicy50d2ltZy5jb20vcHJvZmlsZV9pbWFnZXMvNTY3Nzc0ODQ0MzIyNzEzNjAwL3RZb1ZqdTMxLnBuZyJ9fQ==",
          "DCOS_PACKAGE_REGISTRY_VERSION": "2.0",
          "DCOS_SERVICE_NAME": "nginx",
          "DCOS_SERVICE_PORT_INDEX": "0",
          "DCOS_PACKAGE_VERSION": "1.8.1",
          "DCOS_PACKAGE_NAME": "nginx",
          "DCOS_PACKAGE_IS_FRAMEWORK": "false"
        }
      }
      ```

    ![JSON 视图](/mesosphere/dcos/2.0/img/GUI-Services-Add_Service_With_JSON-1_12.png)

    图 10. JSON 文件视图


3. 单击 **REVIEW & RUN**，然后单击 **RUN SERVICE**。

1. 针对 Nick 重复之前的步骤。确保指定 `"id": "/prod-b/nginx",`，例如：

    ```json
    {
      "id": "/prod-b/nginx",
      "cmd": "rm -rf /usr/share/nginx/html && ln -s /mnt/mesos/sandbox/hello-nginx-master/ /usr/share/nginx/html && nginx -g 'daemon off;'",
      "instances": 1,
      "cpus": 1,
      "mem": 1024,
      "disk": 0,
      "gpus": 0,
      "fetch": [
      ...
    }
    ```

1. 在 Cory 或 Nick 登录时，单击 NGINX 启动图标，查看确认消息。

    ![NGINX](/mesosphere/dcos/2.0/img/GUI-Services-Add_Service_Review_Install-1_12.png)

    图 11. 确认屏幕

接下来，我们将从超级用户视图查看 **服务** 选项卡。

## DC/OS UI：监控用户帐户 

1. 注销当前用户，然后以具有[超级用户](/mesosphere/dcos/2.0/security/ent/perms-reference/#superuser)权限的用户身份返回。您将看到，两个服务都在 `prod-a` 和 `prod-b-groups` 中运行。

    ![prod-a-group](/mesosphere/dcos/2.0/img/GUI-Services-Services_List_w_Groups-1_12.png)

    图 12. 超级用户视图
