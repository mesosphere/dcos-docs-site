---
layout: layout.pug
navigationTitle:  Granting Access to Services and Groups
title: Granting Access to Services and Groups
menuWeight: 3
excerpt:

enterprise: true
---

You can implement fine-grained user access to services using either the DC/OS GUI or the API.

The [Marathon permissions](/1.9/security/ent/perms-reference/#marathon-metronome) allow you to restrict a user's access to services on either a per service or a per service group basis. This section walks you through the steps to accomplish this.  

[Marathon permissions](/1.9/security/ent/perms-reference/#marathon-metronome) and [Mesos permissions](/1.9/security/ent/perms-reference/#mesos) do not distinguish between service names, job names, service groups, or job groups. Therefore your naming must be unique. 

**Prerequisites:** 

- You must have the [DC/OS CLI installed](/1.9/cli/install/) and be logged in as a superuser.
- A [user account](/1.9/security/ent/users-groups/) to assign permissions to.
- If your [security mode](/1.9/security/ent/#security-modes) is `permissive` or `strict`, you must [get the root cert](/1.9/networking/tls-ssl/get-cert/) before issuing the curl commands in this section. 

# <a name="root-service"></a>Granting access to a service

## <a name="root-service-ui"></a>Via the DC/OS GUI

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
    This mode does not offer fine-grained control.
    
    ### Permissive
    
    -  **DC/OS service access:**
    
       Specify your service (`<service-name>`) and action (`<action>`). Actions can be either `create`, `read`, `update`, `delete`, or `full`. To permit more than one operation, use a comma to separate them, for example: `dcos:service:marathon:marathon:services:/<service-name> read,update`. 
       
       ```bash
       dcos:adminrouter:service:marathon full
       dcos:service:marathon:marathon:services:/<service-name> <action>
       ```
    -  **DC/OS service tasks and logs:**
    
       ```bash
       dcos:adminrouter:ops:slave full
       ```
    
    ### Strict
    
    -  **DC/OS service access:**
        
       Specify your service (`<service-name>`) and action (`<action>`). Actions can be either `create`, `read`, `update`, `delete`, or `full`. To permit more than one operation, use a comma to separate them, for example: `dcos:service:marathon:marathon:services:/<service-name> read,update`. 
     
       ```bash
       dcos:adminrouter:service:marathon full
       dcos:service:marathon:marathon:services:/<service-name> <action>
       ```
    -  **DC/OS service tasks and logs:**
  
       ```bash
       dcos:adminrouter:ops:slave full
       dcos:mesos:agent:executor:app_id:/<service-name> read
       dcos:mesos:agent:framework:role:slave_public read
       dcos:mesos:agent:sandbox:app_id:/<service-name> read
       dcos:mesos:agent:task:app_id:/<service-name> read
       dcos:mesos:master:executor:app_id:/<service-name> read
       dcos:mesos:master:framework:role:slave_public read
       dcos:mesos:master:task:app_id:/<service-name> read       
       ```

1.  Click **ADD PERMISSIONS** and then **Close**. 

## <a name="root-service-api"></a>Via the IAM API

**Prerequisites:** 

- You must have the [DC/OS CLI installed](/1.9/cli/install/) and be logged in as a superuser.
- If your [security mode](/1.9/security/ent/#security-modes) is `permissive` or `strict`, you must [get the root cert](/1.9/networking/tls-ssl/get-cert/) before issuing the curl commands in this section. 

**Tips:** 

- Service resources often include `/` characters that must be replaced with `%252F` in curl requests, as shown in the examples below.
- When using the API to manage permissions, you must create the permission before granting it. If the permission already exists, the API will return an informative message and you can continue to assign the permission.

### Disabled
This mode does not offer fine-grained control.

### Permissive

-  **DC/OS service access:**

   1.  Create the permission with service (`<service-name>`) specified.
   
       ```bash
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:service:marathon -d '{"description":"Controls access to Marathon services"}'
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:service:marathon:marathon:services:%252F<service-name> -d '{"description":"Controls access to a service, job, service group, or job group named <service-name>"}'
       ```
   
   1.  Grant the permission to a user (`<user-name>`). 
   
       ```bash
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:service:marathon/users/<user-name>/full
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:service:marathon:marathon:services:%252F<service-name>/users/<user-name>/full
       ```
       
       **Tips:** 
       
       - To grant this permission to a group instead of a user, replace `/users/<user-name>` with `/groups/<group-name>`. 
       - To give the user a different level of access, replace `full` with the desired access level: `create`, `read`, `update`, or `delete`.
     
-  **DC/OS service tasks and logs:**

   1.  Create the permission.
   
       ```bash
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:mesos -d '{"description":"Grants access to the Mesos master API/UI and task details"}'
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:slave -d '{"description":"Grants access to the Mesos agent API/UI and task details such as logs"}'
       ```
   
   1.  Grant the permission to a user (`<user-name>`).
   
       ```bash
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:mesos/users/<user-name>/full
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:slave/users/<user-name>/full
       ```

### Strict

-  **DC/OS service access:**

   1.  Create the permission with service (`<service-name>`) specified.
   
       ```bash
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:service:marathon -d '{"description":"Controls access to Marathon services"}'
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:service:marathon:marathon:services:%252F<service-name> -d '{"description":"Controls access to a service, job, service group, or job group named <service-name>"}'
       ```
   
   1.  Grant the permission to a user (`<user-name>`). 
   
       ```bash
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:service:marathon/users/<user-name>/full
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:service:marathon:marathon:services:%252F<service-name>/users/<user-name>/full
       ```
       
       **Tips:** 
       
       - To grant this permission to a group instead of a user, replace `/users/<user-name>` with `/groups/<group-name>`. 
       - To give the user a different level of access, replace `full` with the desired access level: `create`, `read`, `update`, or `delete`.
     
-  **DC/OS service tasks and logs:**

   1.  Create the permission.
   
       ```bash
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:mesos -d '{"description":"Grants access to the Mesos master API/UI and task details"}'
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:slave -d '{"description":"Grants access to the Mesos agent API/UI and task details such as logs"}'
       ```
   
   1.  Grant the permission to a user (`<user-name>`).
   
       ```bash
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:mesos/users/<user-name>/full
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:slave/users/<user-name>/full
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:executor:app_id:%252F<service-name> -d '{"description":"Controls access to executors of a service, job, service group, or job group named <service-name>"}'
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:executor:app_id:%252F<service-name>/users/<user-name>/read
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:framework:role:slave_public -d '{"description":"Controls access to information about frameworks registered under the slave_public role"}'
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:framework:role:slave_public/users/<user-name>/read
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:sandbox:app_id:%252F<service-name> -d '{"description":"Controls access to the sandbox data of a service, job, service group, or job group named <service-name>"}'
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:sandbox:app_id:%252F<service-name>/users/<user-name>/read
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:task:app_id:%252F<service-name> -d '{"description":"Controls access to tasks of a service, job, service group, or job group named <service-name>"}'
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:task:app_id:%252F<service-name>/users/<user-name>/read
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:executor:app_id:%252F<service-name> -d '{"description":"Controls access to executors running inside a service, job, service group, or job group named <service-name>"}'
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:executor:app_id:%252F<service-name>/users/<user-name>/read
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:framework:role:slave_public -d '{"description":"Controls access to frameworks registered with the slave_public role"}'
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:framework:role:slave_public/users/<user-name>/read
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:task:app_id:%252F<service-name> -d '{"description":"Controls access to tasks of a service, job, service group, or job group named <service-name>"}'
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:task:app_id:%252F<service-name>/users/<user-name>/read       
       ```
       
       **Tips:** 
       
       - To grant this permission to a group instead of a user, replace `/users/<user-name>` with `/groups/<group-name>`. 
       - To give the user a different level of access, replace `full` with the desired access level: `create`, `read`, `update`, or `delete`.       

# <a name="service-in-group"></a>Granting access to a service in a service group

## <a name="service-in-group-ui"></a>Via the DC/OS GUI

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
    This mode does not offer fine-grained control.
    
    ### Permissive
    
    -  **DC/OS service access:**
    
       Specify your service (`<service-name>`), group (`<group-name>`), and action (`<action>`). Actions can be either `create`, `read`, `update`, `delete`, or `full`. To permit more than one operation, use a comma to separate them, for example: `dcos:service:marathon:marathon:services:/<service-name> read,update`.
       
       ```bash
       dcos:adminrouter:service:marathon full
       dcos:service:marathon:marathon:services:/<group-name>/<service-name> <action>
       ```
       
    -  **DC/OS service tasks and logs:**
      
       ```bash
       dcos:adminrouter:ops:mesos full
       dcos:adminrouter:ops:slave full
       ```
    
    ### Strict
    
    -  **DC/OS service access:**
    
       Specify your service (`<service-name>`), group (`<group-name>`), and action (`<action>`). Actions can be either `create`, `read`, `update`, `delete`, or `full`. To permit more than one operation, use a comma to separate them, for example: `dcos:service:marathon:marathon:services:/<service-name> read,update`.
       
       ```bash
       dcos:adminrouter:service:marathon full
       dcos:service:marathon:marathon:services:/<group-name>/<service-name> <action>
       ```
       
    -  **DC/OS service tasks and logs:**
      
       ```bash
       dcos:adminrouter:ops:mesos full
       dcos:adminrouter:ops:slave full
       dcos:mesos:agent:executor:app_id:/<group-name>/<service-name> read
       dcos:mesos:agent:framework:role:slave_public read
       dcos:mesos:agent:sandbox:app_id:/<group-name>/<service-name> read
       dcos:mesos:agent:task:app_id:/<group-name>/<service-name> read
       dcos:mesos:master:executor:app_id:/<group-name>/<service-name> read
       dcos:mesos:master:framework:role:slave_public read
       dcos:mesos:master:task:app_id:/<group-name>/<service-name> read
       ```
       
1.  Click **ADD PERMISSIONS** and then **Close**. 

## <a name="service-in-group-api"></a>Via the IAM API

**Prerequisites:** 

- You must have the [DC/OS CLI installed](/1.9/cli/install/) and be logged in as a superuser.
- If your [security mode](/1.9/security/ent/#security-modes) is `permissive` or `strict`, you must [get the root cert](/1.9/networking/tls-ssl/get-cert/) before issuing the curl commands in this section. 

**Tips:** 

- Service resources often include `/` characters that must be replaced with `%252F` in curl requests, as shown in the examples below.
- When using the API to manage permissions, you must create the permission before granting it. If the permission already exists, the API will return an informative message and you can continue to assign the permission.

### Disabled
This mode does not offer fine-grained control.

### Permissive

-  **DC/OS service access:**

   1.  Create the permission.
   
       ```bash
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:service:marathon -d '{"description":"Controls access to Marathon services"}'
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:service:marathon:marathon:services:%252Fgroup%252F<service-name> -d '{"description":"Controls access to a service, job, service group, or job group named <service-name> inside a group called group"}'
       ```
   
   1.  Grant the permission to a user (`<user-name>`).
   
       ```bash
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:service:marathon/users/<user-name>/full
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:service:marathon:marathon:services:%252Fgroup%252F<service-name>/users/<user-name>/full
       ```
       
       **Tips:** 
       
       - To grant this permission to a group instead of a user, replace `/users/<user-name>` with `/groups/<group-name>`. 
       - To give the user a different level of access, replace `full` with the desired access level: `create`, `read`, `update`, or `delete`.         
       

-  **DC/OS service tasks and logs:**

   1.  Create the permission.
   
       ```bash
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:mesos -d '{"description":"Grants access to the Mesos master API/UI and task details"}'
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:slave -d '{"description":"Grants access to the Mesos agent API/UI and task details such as logs"}'
       ```
       
   1.  Grant the permission to a user (`<user-name>`).
          
       ```bash
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:mesos/users/<user-name>/full
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:slave/users/<user-name>/full
       ```
       
       **Tips:** 
       
       - To grant this permission to a group instead of a user, replace `/users/<user-name>` with `/groups/<group-name>`. 
       - To give the user a different level of access, replace `full` with the desired access level: `create`, `read`, `update`, or `delete`.
       
### Strict

-  **DC/OS service access:**

   1.  Create the permission.
   
       ```bash
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:service:marathon -d '{"description":"Controls access to Marathon services"}'
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:service:marathon:marathon:services:%252Fgroup%252F<service-name> -d '{"description":"Controls access to a service, job, service group, or job group named <service-name> inside a group called group"}'
       ```
   
   1.  Grant the permission to a user (`<user-name>`).
   
       ```bash
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:service:marathon/users/<user-name>/full
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:service:marathon:marathon:services:%252Fgroup%252F<service-name>/users/<user-name>/full
       ```
       
       **Tips:** 
       
       - To grant this permission to a group instead of a user, replace `/users/<user-name>` with `/groups/<group-name>`. 
       - To give the user a different level of access, replace `full` with the desired access level: `create`, `read`, `update`, or `delete`.         
       

-  **DC/OS service tasks and logs:**

   1.  Create the permission.
   
       ```bash
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:mesos -d '{"description":"Grants access to the Mesos master API/UI and task details"}'
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:slave -d '{"description":"Grants access to the Mesos agent API/UI and task details such as logs"}'
       ```
       
   1.  Grant the permission to a user (`<user-name>`).
          
       ```bash
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:mesos/users/<user-name>/full
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:slave/users/<user-name>/full
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:executor:app_id:%252Fgroup%252F<service-name> -d '{"description":"Controls access to executors of a service, job, service group, or job group named <service-name> inside the group group"}'
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:executor:app_id:%252Fgroup%252F<service-name>/users/<user-name>/read
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:framework:role:slave_public -d '{"description":"Controls access to information about frameworks registered under the slave_public role"}'
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:framework:role:slave_public/users/<user-name>/read
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:sandbox:app_id:%252Fgroup%252F<service-name> -d '{"description":"Controls access to the sandbox data of a service, job, service group, or job group named <service-name> inside the group group"}'
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:sandbox:app_id:%252Fgroup%252F<service-name>/users/<user-name>/read
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:task:app_id:%252Fgroup%252F<service-name> -d '{"description":"Controls access to tasks of a service, job, service group, or job group named <service-name> inside the group group"}'
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:task:app_id:%252Fgroup%252F<service-name>/users/<user-name>/read
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:executor:app_id:%252Fgroup%252F<service-name> -d '{"description":"Controls access to executors running inside a service, job, service group, or job group named <service-name>"}'
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:executor:app_id:%252Fgroup%252F<service-name>/users/<user-name>/read
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:framework:role:slave_public -d '{"description":"Controls access to frameworks registered with the slave_public role"}'
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:framework:role:slave_public/users/<user-name>/read
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:task:app_id:%252Fgroup%252F<service-name> -d '{"description":"Controls access to tasks of a service, job, service group, or job group named <service-name>"}'
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:task:app_id:%252Fgroup%252F<service-name>/users/<user-name>/read       
       ```
       
       **Tips:** 
       
       - To grant this permission to a group instead of a user, replace `/users/<user-name>` with `/groups/<group-name>`. 
       - To give the user a different level of access, replace `full` with the desired access level: `create`, `read`, `update`, or `delete`.

# <a name="service-group"></a>Granting a user access to a service group

## <a name="service-group-ui"></a>Via the DC/OS GUI

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
    This mode does not offer fine-grained control. 
    
    ### Permissive
    
    -  **DC/OS group access:**
    
       Specify your group (`<group-name>`) and action (`<action>`). Actions can be either `create`, `read`, `update`, `delete`, or `full`. To permit more than one operation, use a comma to separate them, for example: `dcos:service:marathon:marathon:services:/<service-name> read,update`.
    
       ```bash
       dcos:adminrouter:service:marathon full
       dcos:service:marathon:marathon:services:/<group-name> <action>
       ```
       
    -  **Group tasks and logs:**
       
       ```bash
       dcos:adminrouter:ops:mesos full
       dcos:adminrouter:ops:slave full
       ```
    
    ### Strict

    -  **DC/OS group access:**
    
       Specify your group (`<group-name>`) and action (`<action>`). Actions can be either `create`, `read`, `update`, `delete`, or `full`. To permit more than one operation, use a comma to separate them, for example: `dcos:service:marathon:marathon:services:/<service-name> read,update`.
    
       ```bash
       dcos:adminrouter:service:marathon full
       dcos:service:marathon:marathon:services:/<group-name> <action>
       ```
       
    -  **Group tasks and logs:**
       
       ```bash
       dcos:adminrouter:ops:mesos full
       dcos:adminrouter:ops:slave full
       dcos:mesos:agent:executor:app_id:/<group-name> read
       dcos:mesos:agent:framework:role:slave_public read
       dcos:mesos:agent:sandbox:app_id:/<group-name> read
       dcos:mesos:agent:task:app_id:/<group-name> read
       dcos:mesos:master:executor:app_id:/<group-name> read
       dcos:mesos:master:framework:role:slave_public read
       dcos:mesos:master:task:app_id:/<group-name> read
       ```
    
1.  Click **ADD PERMISSIONS** and then **Close**.   

## <a name="service-group-api"></a>Via the IAM API

**Prerequisites:** 

- You must have the [DC/OS CLI installed](/1.9/cli/install/) and be logged in as a superuser.
- If your [security mode](/1.9/security/ent/#security-modes) is `permissive` or `strict`, you must [get the root cert](/1.9/networking/tls-ssl/get-cert/) before issuing the curl commands in this section. 

**Tips:** 

- Service resources often include `/` characters that must be replaced with `%252F` in curl requests, as shown in the examples below.
- When using the API to manage permissions, you must create the permission before granting it. If the permission already exists, the API will return an informative message and you can continue to assign the permission. 

### Disabled
This mode does not offer fine-grained control. 

### Permissive

-  **DC/OS group access:**

   1.  Create the permission.
   
       ```bash
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:service:marathon -d '{"description":"Controls access to Marathon services"}'
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:service:marathon:marathon:services:%252Fgroup -d '{"description":"Controls access to a service, job, service group, or job group named group"}'
       ```
   
   1.  Grant the permission to a user (`<user-name>`).
   
       ```bash
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:service:marathon/users/<user-name>/full
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:service:marathon:marathon:services:%252Fgroup/users/<user-name>/full
       ```
       
       **Tips:** 
      
       - To grant this permission to a group instead of a user, replace `/users/<user-name>` with `/groups/<group-name>`. 
       - To give the user a different level of access, replace `full` with the desired access level: `create`, `read`, `update`, or `delete`.
   
-  **Group tasks and logs:**

   1.  Create the permission.
   
       ```bash
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:mesos -d '{"description":"Grants access to the Mesos master API/UI and task details"}'
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:slave -d '{"description":"Grants access to the Mesos agent API/UI and task details such as logs"}'
       ```
   1.  Grant the permission to a user (`<user-name>`).
   
       ```bash
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:mesos/users/<user-name>/full
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:slave/users/<user-name>/full
       ```

### Strict

-  **DC/OS group access:**

   1.  Create the permission.
   
       ```bash
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:service:marathon -d '{"description":"Controls access to Marathon services"}'
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:service:marathon:marathon:services:%252Fgroup -d '{"description":"Controls access to a service, job, service group, or job group named group"}'
       ```
   
   1.  Grant the permission to a user (`<user-name>`).
   
       ```bash
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:service:marathon/users/<user-name>/full
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:service:marathon:marathon:services:%252Fgroup/users/<user-name>/full
       ```
       
      **Tips:** 
      
      - To grant this permission to a group instead of a user, replace `/users/<user-name>` with `/groups/<group-name>`. 
      - To give the user a different level of access, replace `full` with the desired access level: `create`, `read`, `update`, or `delete`.
   
-  **Group tasks and logs:**

   1.  Create the permission.
   
       ```bash
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:mesos -d '{"description":"Grants access to the Mesos master API/UI and task details"}'
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:slave -d '{"description":"Grants access to the Mesos agent API/UI and task details such as logs"}'
       ```
   1.  Grant the permission to a user (`<user-name>`).
   
       ```bash
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:mesos/users/<user-name>/full
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:slave/users/<user-name>/full
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:executor:app_id:%252Fgroup -d '{"description":"Controls access to executors of a service, job, service group, or job group named group"}'
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:executor:app_id:%252Fgroup/users/<user-name>/read
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:framework:role:slave_public -d '{"description":"Controls access to information about frameworks registered under the slave_public role"}'
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:framework:role:slave_public/users/<user-name>/read
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:sandbox:app_id:%252Fgroup -d '{"description":"Controls access to the sandbox data of a service, job, service group, or job group named group"}'
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:sandbox:app_id:%252Fgroup/users/<user-name>/read
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:task:app_id:%252Fgroup -d '{"description":"Controls access to tasks of a service, job, service group, or job group named group"}'
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:task:app_id:%252Fgroup/users/<user-name>/read
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:executor:app_id:%252Fgroup -d '{"description":"Controls access to executors running inside a service, job, service group, or job group named group"}'
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:executor:app_id:%252Fgroup/users/<user-name>/read
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:framework:role:slave_public -d '{"description":"Controls access to frameworks registered with the slave_public role"}'
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dco
       s config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:framework:role:slave_public/users/<user-name>/read
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:task:app_id:%252Fgroup -d '{"description":"Controls access to tasks of a service, job, service group, or job group named group"}'
       curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:task:app_id:%252Fgroup/users/<user-name>/read
       ```
       
       **Tips:** 
      
       - To grant this permission to a group instead of a user, replace `/users/<user-name>` with `/groups/<group-name>`. 
       - To give the user a different level of access, replace `full` with the desired access level: `create`, `read`, `update`, or `delete`.
       
   
