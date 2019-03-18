---
layout: layout.pug
navigationTitle:  Granting Access to Jobs
title: Granting Access to Jobs
menuWeight: 200
excerpt: Granting access to jobs using the CLI or the web interface

enterprise: true
---

You can implement fine-grained user access to jobs by using either the DC/OS web interface, the CLI or [the API](/1.13/security/ent/iam-api/). The [Metronome permissions](/1.13/security/ent/perms-reference/#marathon-metronome) allow you to restrict a user's access to jobs on either a per job or a per job group basis. This section walks you through the steps to accomplish this.

**Prerequisites:**

- You must have the [DC/OS CLI installed](/1.13/cli/install/) and be logged in as a superuser.
- A [user account](/1.13/security/ent/users-groups/) to assign permissions to.

# <a name="job-group-access-via-ui"></a>Via the DC/OS web interface

1. Log into the DC/OS web interface as a user with the `superuser` permission.

   ![Login](/1.13/img/LOGIN-EE-Modal_View-1_12.png)

   Figure 1. DC/OS web interface login

1.  Select **Organization** and choose **Users** or **Groups**.

1.  Select the name of the user or group to grant the permission to.

    ![Add permission cory](/1.13/img/GUI-Organization-Users-Users_List_View_w_Users-1_12.png)

    Figure 2. Choose user or group to add permissions to

1.  From the **Permissions** tab, click **ADD PERMISSION**.

1.  Click **INSERT PERMISSION STRING** to toggle the dialog.

    ![Add permission](/1.13/img/GUI-Organization-Users-User_Alice_Add_Gen_Perms-1_12.png)

    Figure 3. Add permissions

1.  Copy and paste the permission in the **Permissions Strings** field. Choose the permission strings based on your [security mode](/1.13/security/ent/#security-modes).

    ### Permissive

    -  **DC/OS jobs access:**

       Specify your job group (`<job-group>`), job name (`<job-name>`), and action (`<action>`). Actions can be either `create`, `read`, `update`, `delete`, or `full`. To permit more than one operation, use a comma to separate them, for example: `dcos:service:metronome:metronome:jobs:<job-group>/<job-name> read,update`.

       ```bash
       dcos:adminrouter:service:metronome full
       dcos:service:metronome:metronome:jobs:<job-group>/<job-name> <action>
       ```

    -  **DC/OS service tasks and logs:**

       ```bash
       dcos:adminrouter:ops:mesos full
       dcos:adminrouter:ops:slave full
       ```

    ### Strict

    -  **DC/OS jobs access:**

       Specify your job group (`<job-group>`), job name (`<job-name>`), and action (`<action>`). Actions can be either `create`, `read`, `update`, `delete`, or `full`. To permit more than one operation, use a comma to separate them, for example: `dcos:service:metronome:metronome:jobs:<job-group>/<job-name> read,update`.

       ```bash
       dcos:adminrouter:service:metronome full
       dcos:service:metronome:metronome:jobs:<job-group>/<job-name> <action>
       ```

    -  **DC/OS service tasks and logs:**

       ```bash
       dcos:adminrouter:ops:mesos full
       dcos:adminrouter:ops:slave full
       dcos:mesos:master:framework:role:* read
       dcos:mesos:master:executor:app_id:/<job-group>/<job-name> read
       dcos:mesos:master:task:app_id:/<job-group>/<job-name> read
       dcos:mesos:agent:framework:role:* read
       dcos:mesos:agent:executor:app_id:/<job-group>/<job-name> read
       dcos:mesos:agent:task:app_id:/<job-group>/<job-name> read
       dcos:mesos:agent:sandbox:app_id:/<job-group>/<job-name> read
       ```       

1.  Click **ADD PERMISSIONS** and then **Close**.


# <a name="job-group-access-via-cli"></a>Via the CLI

**Prerequisites:**

- You must have the [DC/OS CLI installed](/1.13/cli/install/) and be logged in as a superuser.

**Tips:**

- To grant permissions to a group instead of a user, replace `users grant <user-name>` with `groups grant <gid>`.

### Permissive

-  **DC/OS jobs access:**

    1.  Grant the permission to job group (`<job-group>`) and job name (`<job-name>`).

        ```bash
        dcos security org users grant <user-name> adminrouter:service:metronome full --description "Controls access to Metronome services"
        dcos security org users grant <user-name> service:metronome:metronome:jobs:<job-group>/<job-name> full --description "Controls access to <job-group>/<job-name>"
        ```

-  **DC/OS service tasks and logs:**

    1.  Grant the permission to a user (`<user-name>`).

        ```bash
        dcos security org users grant <user-name> adminrouter:ops:mesos full --description "Grants access to the Mesos master API/UI and task details"
        dcos security org users grant <user-name> adminrouter:ops:slave full --description "Grants access to the Mesos agent API/UI and task details such as logs"
        ```   

### Strict

-  **DC/OS jobs access:**

    1.  Grant the permission to job group (`<job-group>`) and job name (`<job-name>`).

        ```bash
        dcos security org users grant <user-name> adminrouter:service:metronome full --description "Controls access to Metronome services"
        dcos security org users grant <user-name> service:metronome:metronome:jobs:<job-group>/<job-name> full --description "Controls access to <job-group>/<job-name>"
        ```

-  **DC/OS service tasks and logs:**

   1.  Grant the permission to the user (`<user-name>`) and group (`<job-group>`).

        ```bash
        dcos security org users grant <user-name> adminrouter:ops:mesos full --description "Grants access to the Mesos master API/UI and task details"
        dcos security org users grant <user-name> adminrouter:ops:slave full --description "Grants access to the Mesos agent API/UI and task details such as logs"
        dcos security org users grant <user-name> mesos:master:framework:role:* read --description "Controls access to frameworks registered with the Mesos default role"
        dcos security org users grant <user-name> mesos:master:executor:app_id:/<job-group>/<job-name> read --description "Controls access to executors running inside <job-group>/<job-name>"
        dcos security org users grant <user-name> mesos:master:task:app_id:/<job-group>/<job-name> read --description "Controls access to tasks running inside <job-group>/<job-name>"
        dcos security org users grant <user-name> mesos:agent:framework:role:* read --description "Controls access to information about frameworks registered under the Mesos default role"
        dcos security org users grant <user-name> mesos:agent:executor:app_id:/<job-group>/<job-name> read --description "Controls access to executors running inside <job-group>/<job-name>"
        dcos security org users grant <user-name> mesos:agent:task:app_id:/<job-group>/<job-name> read --description "Controls access to tasks running inside <job-group>/<job-name>"
        dcos security org users grant <user-name> mesos:agent:sandbox:app_id:/<gid>/ read --description "Controls access to the sandboxes of <job-group>/<job-name>"
        ```
