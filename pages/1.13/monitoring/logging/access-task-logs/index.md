---
layout: layout.pug
navigationTitle:  Controlling Access to Task Logs
title: Controlling Access to Task Logs
menuWeight: 2
excerpt: Managing user access to task logs using Marathon groups
beta: true
enterprise: true
---


You can control user access to task logs by using Marathon groups for jobs and services. You can then assign permissions to access these groups, allowing you to control which logs a user can access.

<p class="message--important"><strong>IMPORTANT: </strong>The functionality described in this document is only available in strict security mode.</p> 

In this procedure, you will deploy services in separate Marathon groups, and grant user permissions to view the tasks for these Marathon groups.

Here is an overview of the [permissions](/1.13/security/ent/perms-reference/) that are required:

|     Permission string     | full | C | R | U | D |
|----------------------------|------|---|---|---|---|
| `dcos:adminrouter:ops:mesos`<br> Controls access to the Mesos master UI and API.                                                                                                                                                                                                  | x    |   |   |   |   |
| `dcos:adminrouter:ops:slave`<br>Controls access to the Mesos agent UI and API.                                                                                                                                                                                                    | x    |   |   |   |   |
| `dcos:mesos:agent:executor:app_id[:<service-or-job-group>]`<br> Controls view access to service and job [executor information](https://mesos.apache.org/documentation/latest/app-framework-development-guide/).                                                                           |      |   | x |   |   |
| `dcos:mesos:agent:framework:role[:<role-name>]`<br> Controls view access to DC/OS services registered with a particular role.                                                                                                                                                     |      |   | x |   |   |
| `dcos:mesos:agent:sandbox:app_id[:<service-or-job-group>]`<br> Controls access to the Mesos sandbox.                                                                                                                                                                              |      |   | x |   |   |
| `dcos:mesos:agent:task:app_id[:<service-or-job-group>]`<br> Controls access to task information.                                                                                                                                                                                  |      |   | x |   |   |
| `dcos:mesos:master:executor:app_id[:<service-or-job-group>]`<br> Controls access to [executor](https://mesos.apache.org/documentation/latest/app-framework-development-guide/) service and job groups.                                                                                    |      |   | x |   |   |
| `dcos:mesos:master:framework:role[:<role-name>]` <br> Controls access, by role, to register as a framework with [Mesos](https://mesos.apache.org/documentation/latest/roles/).                                                                                                    |      | x |   |   |   |
| `dcos:mesos:master:task:app_id[:<service-or-job-group>]`<br> Controls access to run tasks.                                                                                                                                                                                        |      | x |   |   |   |


**Prerequisites:**

- DC/OS and DC/OS CLI are [installed](/1.13/installing/) and you are logged in as a superuser.

# Via the DC/OS web interface

### Create the groups and grant permission

1.  Select **Organization** and choose **Groups**.

    ![New group](/1.13/img/GUI-Organization-Groups-Add_Group_w_Plus_Button_Tooltip-1_12.png)

    Figure 1. New user group

1.  Create a new group.

    ![Prod group](/1.13/img/GUI-Organization-Groups-Create_New_Group_Modal-1_12.png)

    Figure 2. Create new group screen

1.  Select the group name and from the **Permissions** tab, click **ADD PERMISSION**.

    ![Add permission to prod-group](/1.13/img/GUI-Organization-Groups-Group_Detail_Page-1_12.png)

    Figure 3. Add Permission button

1.  Click **INSERT PERMISSION STRING** to toggle the dialog, and then paste in the following permissions and click **ADD PERMISSIONS**.

    ```bash
    dcos:adminrouter:ops:mesos full
    dcos:adminrouter:ops:slave full
    dcos:mesos:agent:executor:app_id:/prod-group/ read
    dcos:mesos:agent:framework:role:slave_public/ read
    dcos:mesos:agent:sandbox:app_id:/prod-group/ read
    dcos:mesos:agent:task:app_id:/prod-group/ read
    dcos:mesos:master:executor:app_id:/prod-group/ read
    dcos:mesos:master:framework:role:slave_public/ read
    dcos:mesos:master:task:app_id:/prod-group/ read
    ```

    ![Add permission](/1.13/img/GUI-Organization-Groups-Add_Perms_Modal_Logging-1_12.png)

    Figure 4. Permissions string added

### Create the users and grant permission

1.  Select **Organization** and choose **Users**. Select an existing or create a new user.

    ![New user](/1.13/img/GUI-Organization-Users-View_w_AddUser_Tooltip-1_12.png)

    Figure 5. Users screen

1.  From the **Group Membership** tab, type in the search box and choose the group name. This will grant the group permissions to an individual user.

    ![Add alice to security group](/1.13/img/GUI-Organization-Users-User_Alice_Add_prod_group-1_12.png)

    Figure 6. Adding user to security group

### Launch apps in the user groups

This section shows you how to deploy a simple application in your group.

1.  Select **Services** > **RUN A SERVICE**.

1.  Select **Single Container** and define your service as:

    -  **SERVICE ID** Specify `/<gid>/<service-name>`. This creates a service within a service group.
    -  **COMMAND** Specify `sleep 1000000000`.
    -  **Container Runtime** Select **UNIVERSAL CONTAINER RUNTIME (UCR)**.

    ![Define nested service](/1.13/img/GUI-Services-Add_Service_Single_Container_Alice-1_12.png)

    Figure 7. Define a nested service

1.  Click **REVIEW & RUN** and **RUN SERVICE** to complete your installation. You should now see a service that is running in a group.

    ![Service running within group](/1.13/img/GUI-Services-Main_View_prod_group_Alice-1_12.png)

    Figure 8. Service running in a group

Now you can [verify access](#verifying-access).

# Via the IAM API

**Prerequisite:**
You must [get the root cert](/1.13/security/ent/tls-ssl/get-cert/) before issuing the curl commands in this section.

### Tips

- Service resources often include `/` characters that must be replaced with `%252F` in `curl` requests, as shown in the examples below.
- When using the API to manage permissions, you must create the permission before granting it. If the permission already exists, the API will return an informative message and you can continue to assign the permission.

### <a name="create-services"></a>Create the User Groups and Launch App

1. Use the following command to create a Marathon group (`<gid>`).

   ```bash
   curl -X POST --cacert dcos-ca.crt \
   $(dcos config show core.dcos_url)/service/marathon/v2/groups \
   -d '{"id":"<gid>"}' \
   -H "Content-type: application/json" \
   -H "Authorization: token=$(dcos config show core.dcos_acs_token)"
   ```

1. Use the following command to deploy a simple application (`<service-name>`) inside of `<gid>`.

   ```bash
   curl -X POST --cacert dcos-ca.crt \
   $(dcos config show core.dcos_url)/service/marathon/v2/apps \
   -d '{"id":"/<gid>/<service-name>","cmd":"sleep 1000000000"}' \
   -H "Content-type: application/json" \
   -H "Authorization: token=$(dcos config show core.dcos_acs_token)"
   ```

### <a name="grant-perms"></a>Create and grant the permissions

1. Use the following commands to create the permissions for your group (`<gid>`).

   ```bash
   curl -X PUT --cacert dcos-ca.crt \
   -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
   -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:mesos \
   -d '{"description":"Grants access to the Mesos master API/UI and task details"}'
   curl -X PUT --cacert dcos-ca.crt \
   -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
   -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:slave \
   -d '{"description":"Grants access to the Mesos agent API/UI and task details such as logs"}'
   curl -X PUT --cacert dcos-ca.crt \
   -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
   -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:framework:role:slave_public \
   -d '{"description":"Grants access to register as or view Mesos master information about frameworks registered with the slave_public role"}'
   curl -X PUT --cacert dcos-ca.crt \
   -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
   -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:executor:app_id:%252F<gid> \
   -d '{"description":"Controls access to executors running inside <gid>"}'
   curl -X PUT --cacert dcos-ca.crt \
   -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
   -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:task:app_id:%252F<gid> \
   -d '{"description":"Grants access to the tasks on the Mesos master that are running inside of <gid>"}'
   curl -X PUT --cacert dcos-ca.crt \
   -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
   -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:framework:role:slave_public \
   -d '{"description":"Grants access to view Mesos agent information about frameworks registered with the slave_public role"}'
   curl -X PUT --cacert dcos-ca.crt \
   -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
   -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:executor:app_id:%252F<gid> \
   -d '{"description":"Grants access to executors running on the Mesos agent inside <gid>"}'
   curl -X PUT --cacert dcos-ca.crt \
   -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
   -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:task:app_id:%252F<gid> \
   -d '{"description":"Grants access to tasks running on the Mesos agent inside <gid>"}'
   curl -X PUT --cacert dcos-ca.crt \
   -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
   -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:sandbox:app_id:%252F<gid> \
   -d '{"description":"Grants access to the sandboxes on the Mesos agent inside <gid>"}'
   ```

1. Use the following commands to grant the permissions to the user (`<username>`). These will allow her to view the task logs in `<gid>`.

   ```bash
   curl -X PUT --cacert dcos-ca.crt \
   -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:mesos/users/<username>/full
   curl -X PUT --cacert dcos-ca.crt \
   -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:slave/users/<username>/full
   curl -X PUT --cacert dcos-ca.crt \
   -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:framework:role:slave_public/users/<username>/read
   curl -X PUT --cacert dcos-ca.crt \
   -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:executor:app_id:%252F<gid>/users/<username>/read
   curl -X PUT --cacert dcos-ca.crt \
   -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:task:app_id:%252F<gid>/users/<username>/read
   curl -X PUT --cacert dcos-ca.crt \
   -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:framework:role:slave_public/users/<username>/read
   curl -X PUT --cacert dcos-ca.crt \
   -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:executor:app_id:%252F<gid>/users/<username>/read
   curl -X PUT --cacert dcos-ca.crt \
   -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:task:app_id:%252F<gid>/users/<username>/read
   curl -X PUT --cacert dcos-ca.crt \
   -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:sandbox:app_id:%252F<gid>/users/<username>/read
   ```  

Now you can [verify access](#verifying-access).

# Verifying Access

1. Log into the DC/OS CLI as the user.

   ```bash
   dcos auth login
   ```

1. Run this command to access the logs for a service which the user has access.

   ```bash
   dcos task log --follow <service-name>
   ```

   For example, if your service name is `alice-service`:

   ```bash
   dcos task log --follow alice-service
   ```

   The output should resemble:

   ```bash
   Executing pre-exec command '{"arguments":["mesos-containerizer","mount","--help=false","--operation=make-rslave","--path=\/"],"shell":false,"value":"\/opt\/mesosphere\/active\/mesos\/libexec\/mesos\/mesos-containerizer"}'
   Executing pre-exec command '{"shell":true,"value":"mount -n -t proc proc \/proc -o nosuid,noexec,nodev"}'
   Executing pre-exec command '{"arguments":["mount","-n","-t","ramfs","ramfs","\/var\/lib\/mesos\/slave\/slaves\/151ee739-d2b9-4024-8dbd-1345148774df-S1\/frameworks\/151ee739-d2b9-4024-8dbd-1345148774df-0001\/executors\/dev-group_alice-service.363072a5-65b5-11e7-a133-1a6ac27c9efe\/runs\/b46bea37-f3bb-4d9b-b0b9-00b1215c8404\/.secret-48e7541e-6634-4c25-9185-986255249439"],"shell":false,"value":"mount"}'
   ```

   If you do not have the correct permissions, you will see this output:

   ```bash
   You are not authorized to perform this operation
   ```
