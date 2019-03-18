---
layout: layout.pug
navigationTitle:  Accessing system and component logs
title: Accessing system and component logs
menuWeight: 1
excerpt: Managing user access to system and component logs
beta: true
enterprise: true
---

You can restrict user access to system and component logs.

Here is the [permission](/1.13/security/ent/perms-reference/) that is required to view the system and component logs:

|     Permission string     | full | C | R | U | D |
|----------------------------|------|---|---|---|---|
| `dcos:adminrouter:ops:system-logs` <br>Controls access to [System logs API](/1.13/api/master-routes/#system).                                                                                                                                                                      | x    |   |   |   |   |

**Prerequisites:**

- DC/OS and DC/OS CLI are [installed](/1.13/installing/) and you are logged in as a superuser.

# Via the DC/OS web interface

### Create the users and grant permissions

1.  Select **Organization** and choose **Users**. Select an existing or create a new user.

    ![New user](/1.13/img/GUI-Organization-Users-View_w_AddUser_Tooltip-1_12.png)

    Figure 1. New user screen

1.  From the **Permissions** tab, select **ADD PERMISSION**.

    ![Add permission to user](/1.13/img/GUI-Organization-Users-User_Main_View.png)

    Figure 2. Add Permission button

1.  Click **INSERT PERMISSION STRING** to toggle the dialog and paste in the following permissions and click **ADD PERMISSIONS**.

    ```bash
    dcos:adminrouter:ops:system-logs full
    ```

    ![Add permission](/1.13/img/GUI-Organization-User-Add_Single_User_Perm_String-1_12.png)

    Figure 3. Permission string dialog

    The **Permissions** tab should now look like this:

    ![prod-group permissions complete](/1.13/img/GUI-Organization-Users-User_View_w_Perm.png)

    Figure 4. Permissions have been added

### <a name="verify-perms"></a>Log in to the CLI as user

1. Log in to the DC/OS CLI as the user.

   ```bash
   dcos auth login
   ```

1. Run this command to access the system and component logs.

   ```bash
   dcos node log --leader --component=dcos-mesos-master
   ```

   You should see the logs from the Mesos master.

   If you do not have the correct permissions, you will see this output:

   ```bash
   You are not authorized to perform this operation
   ```

# Via the IAM API

**Prerequisite:**
You must [get the root cert](/1.13/security/ent/tls-ssl/get-cert/) before issuing the curl commands in this section.

### Tips

- Service resources often include `/` characters that must be replaced with `%252F` in curl requests, as shown in the examples below.
- When using the API to manage permissions, you must create the permission before granting it. If the permission already exists, the API will return an informative message and you can continue to assign the permission.

### <a name="grant-perm"></a>Create and grant the permissions

1. Grant the permission to the user (`<username>`).

   ```bash
   dcos security org users grant <username> dcos:adminrouter:ops:system-logs full --description "Grants access to system and component logs."
   ```

### <a name="verify-perms"></a>Log in to the CLI as user

1. Log in to the DC/OS CLI as the user.

   ```bash
   dcos auth login
   ```

1. Run this command to access the system and component logs.

   ```bash
   dcos node log --leader --component=dcos-mesos-master
   ```

   You should see the logs from the Mesos master.

   If you do not have the correct permissions, you will see this output:

   ```bash
   You are not authorized to perform this operation
   ```
