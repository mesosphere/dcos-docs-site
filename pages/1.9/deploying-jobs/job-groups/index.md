---
layout: layout.pug
navigationTitle:  Granting Access to Jobs
title: Granting Access to Jobs
menuWeight: 200
excerpt:

enterprise: true
---

You can implement fine-grained user access to jobs by using either the DC/OS GUI or the API. The [Metronome permissions](/1.9/security/ent/perms-reference/#marathon-metronome) allow you to restrict a user's access to jobs on either a per job or a per job group basis. This section walks you through the steps to accomplish this.  

**Prerequisites:** 

- You must have the [DC/OS CLI installed](/1.9/cli/install/) and be logged in as a superuser.
- A [user account](/1.9/security/ent/users-groups/) to assign permissions to.
- If your [security mode](/1.9/security/ent/#security-modes) is `permissive` or `strict`, you must [get the root cert](/1.9/networking/tls-ssl/get-cert/) before issuing the curl commands in this section. 

# <a name="job-group-access-via-ui"></a>Via the DC/OS GUI

1. Log into the DC/OS GUI as a user with the `superuser` permission.

   ![Login](/1.9/img/gui-installer-login-ee.gif)

1.  Select **Organization** and choose **Users** or **Groups**.

1.  Select the name of the user or group to grant the permission to.

    ![Add permission cory](/1.9/img/services-tab-user.png)

1.  From the **Permissions** tab, click **ADD PERMISSION**.

1.  Click **INSERT PERMISSION STRING** to toggle the dialog.

    ![Add permission](/1.9/img/services-tab-user3.png)

1.  Copy and paste the permission in the **Permissions Strings** field. Choose the permission strings based on your [security mode](/1.9/security/ent/#security-modes).

    ### Disabled

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


# <a name="job-group-access-via-api"></a>Via the IAM API

**Prerequisite:** 
If your [security mode](/1.9/security/ent/#security-modes) is `permissive` or `strict`, you must [get the root cert](/1.9/networking/tls-ssl/get-cert/) before issuing the curl commands in this section. 

**Tips:** 

- Service resources often include `/` characters that must be replaced with `%252F` in curl requests, as shown in the examples below.
- When using the API to manage permissions, you must create the permission before granting it. If the permission already exists, the API will return an informative message and you can continue to assign the permission.

### Disabled
This mode does not offer fine-grained control.

### Permissive

-  **DC/OS jobs access:**

    1.  Create the permission with job group (`<job-group>`) and job name (`<job-name>`) specified.
    
        ```bash
        curl -X PUT --cacert dcos-ca.crt \
        -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
        -H 'Content-Type: application/json' \
        $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:service:metronome  \
        -d '{"description":"Controls access to Metronome services"}'
        curl -X PUT --cacert dcos-ca.crt \
        -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
        -H 'Content-Type: application/json' \
        $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:service:metronome:metronome:jobs:<job-group>/<job-name>  \
        -d '{"description":"Controls access to <job-group>/<job-name>"}'
        ```   
         
    1.  Grant the permission to job group (`<job-group>`) and job name (`<job-name>`).
            
        ```bash
        curl -X PUT --cacert dcos-ca.crt \
        -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
        $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:service:metronome/users/<user-name>/full
        curl -X PUT --cacert dcos-ca.crt \
        -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
        $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:service:metronome:metronome:jobs:<job-group>/<job-name>/users/<user-name>/full    
        ```
        
        **Tip:** To give the user a different level of access, replace `full` with the desired access level: `create`, `read`, `update`, or `delete`.
        
-  **DC/OS service tasks and logs:**

   1.  Create the permission.
   
        ```bash
        curl -X PUT --cacert dcos-ca.crt \
        -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
        -H 'Content-Type: application/json' \
        $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:mesos  \
        -d '{"description":"Grants access to the Mesos master API/UI and task details"}'
        curl -X PUT --cacert dcos-ca.crt \
        -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
        -H 'Content-Type: application/json' \
        $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:slave  \
        -d '{"description":"Grants access to the Mesos agent API/UI and task details such as logs"}'
        ```
        
   1.  Grant the permission to the user (`<user-name>`).
   
        ```bash
        curl -X PUT --cacert dcos-ca.crt \
        -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
        $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:mesos/users/<user-name>/full
        curl -X PUT --cacert dcos-ca.crt \
        -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
        $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:slave/users/<user-name>/full
        ```

### Strict

-  **DC/OS jobs access:**

    1.  Create the permission with job group (`<job-group>`) and job name (`<job-name>`) specified.
    
        ```bash
        curl -X PUT --cacert dcos-ca.crt \
        -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
        -H 'Content-Type: application/json' \
        $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:service:metronome  \
        -d '{"description":"Controls access to Metronome services"}'
        curl -X PUT --cacert dcos-ca.crt \
        -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
        -H 'Content-Type: application/json' \
        $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:service:metronome:metronome:jobs:<job-group>/<job-name>  \
        -d '{"description":"Controls access to <job-group>/<job-name>"}'
        ```
         
    1.  Grant the permission to job group (`<job-group>`) and job name (`<job-name>`).
    
        ```bash
        curl -X PUT --cacert dcos-ca.crt \
        -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
        $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:service:metronome/users/<user-name>/full
        curl -X PUT --cacert dcos-ca.crt \
        -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
        $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:service:metronome:metronome:jobs:<job-group>/<job-name>/users/<user-name>/full    
        ```
        
        **Tip:** To give the user a different level of access, replace `full` with the desired access level: `create`, `read`, `update`, or `delete`.
        
-  **DC/OS service tasks and logs:**

   1.  Create the permission.
   
        ```bash
        curl -X PUT --cacert dcos-ca.crt \
        -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
        -H 'Content-Type: application/json' \
        $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:mesos  \
        -d '{"description":"Grants access to the Mesos master API/UI and task details"}'
        curl -X PUT --cacert dcos-ca.crt \
        -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
        -H 'Content-Type: application/json' \
        $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:slave  \
        -d '{"description":"Grants access to the Mesos agent API/UI and task details such as logs"}'
        ```
        
   1.  Grant the permission to the user (`<user-name>`) and group (`<job-group>`).
   
        ```bash
        curl -X PUT --cacert dcos-ca.crt \
        -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
        $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:mesos/users/<user-name>/full
        curl -X PUT --cacert dcos-ca.crt \
        -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
        $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:slave/users/<user-name>/full
        curl -X PUT --cacert dcos-ca.crt \
        -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
        -H 'Content-Type: application/json' \
        $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:framework:role:*  \
        -d '{"description":"Controls access to frameworks registered with the Mesos default role"}'
        curl -X PUT --cacert dcos-ca.crt \
        -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
        $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:framework:role:*/users/<user-name>/read
        curl -X PUT --cacert dcos-ca.crt \
        -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
        -H 'Content-Type: application/json' \
        $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:executor:app_id:%252F<job-group>%252F<job-name>  \
        -d '{"description":"Controls access to executors running inside <job-group>/<job-name>"}'
        curl -X PUT --cacert dcos-ca.crt \
        -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
        $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:executor:app_id:%252F<job-group>%252F<job-name>/users/<user-name>/read
        curl -X PUT --cacert dcos-ca.crt \
        -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
        -H 'Content-Type: application/json' \
        $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:task:app_id:%252F<job-group>%252F<job-name>  \
        -d '{"description":"Controls access to tasks running inside <job-group>/<job-name>"}'
        curl -X PUT --cacert dcos-ca.crt \
        -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
        $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:task:app_id:%252F<job-group>%252F<job-name>/users/<user-name>/read
        curl -X PUT --cacert dcos-ca.crt \
        -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
        -H 'Content-Type: application/json' \
        $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:framework:role:*  \
        -d '{"description":"Controls access to information about frameworks registered under the Mesos default role"}'
        curl -X PUT --cacert dcos-ca.crt \
        -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
        $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:framework:role:*/users/<user-name>/read
        curl -X PUT --cacert dcos-ca.crt \
        -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
        -H 'Content-Type: application/json' \
        $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:executor:app_id:%252F<job-group>%252F<job-name>  \
        -d '{"description":"Controls access to executors running inside <job-group>/<job-name>"}'
        curl -X PUT --cacert dcos-ca.crt \
        -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
        $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:executor:app_id:%252F<job-group>%252F<job-name>/users/<user-name>/read
        curl -X PUT --cacert dcos-ca.crt \
        -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
        -H 'Content-Type: application/json' \
        $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:task:app_id:%252F<job-group>%252F<job-name>  \
        -d '{"description":"Controls access to tasks running inside <job-group>/<job-name>"}'
        curl -X PUT --cacert dcos-ca.crt \
        -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
        $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:task:app_id:%252F<job-group>%252F<job-name>/users/<user-name>/read
        curl -X PUT --cacert dcos-ca.crt \
        -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
        -H 'Content-Type: application/json' \
        $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:sandbox:app_id:%252<group-name>%252F  \
        -d '{"description":"Controls access to the sandboxes of <job-group>/<job-name>"}'
        curl -X PUT --cacert dcos-ca.crt \
        -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
        $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:sandbox:app_id:%252F<job-group>%252F<job-name>/users/<user-name>/read
        ``` 
