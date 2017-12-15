---
layout: layout.pug
navigationTitle:  Granting Access to Services and Groups
title: Granting Access to Services and Groups
menuWeight: 3
excerpt:

enterprise: true
---

You can implement fine-grained user access to services using either the DC/OS GUI or the [API](/1.10/security/ent/iam-api/), or the CLI.

The [Marathon permissions](/1.10/security/ent/perms-reference/#marathon-metronome) allow you to restrict a user's access to services on either a per service or a per service group basis. This section walks you through the steps to accomplish this.  

[Marathon permissions](/1.10/security/ent/perms-reference/#marathon-metronome) and [Mesos permissions](/1.10/security/ent/perms-reference/#mesos) do not distinguish between service names, job names, service groups, or job groups. Therefore your naming must be unique. 

**Prerequisites:** 

- You must have the [DC/OS CLI installed](/1.10/cli/install/) and be logged in as a superuser.
- A [user account](/1.10/security/ent/users-groups/) to assign permissions to.

# <a name="root-service"></a>Granting access to a service

## <a name="root-service-ui"></a>Via the DC/OS GUI

1. Log into the DC/OS GUI as a user with the `superuser` permission.

   ![Login](/1.10/img/gui-installer-login-ee.gif)

1.  Select **Organization** and choose **Users** or **Groups**.

1.  Select the name of the user or group to grant the permission to.

    ![Add permission cory](/1.10/img/services-tab-user.png)

1.  From the **Permissions** tab, click **ADD PERMISSION**.

1.  Click **INSERT PERMISSION STRING** to toggle the dialog.

    ![Add permission](/1.10/img/services-tab-user3.png)

1.  Copy and paste the permission in the **Permissions Strings** field. Choose the permission strings based on your [security mode](/1.10/security/ent/#security-modes).

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

## <a name="root-service-cli"></a>Via the CLI

**Prerequisites:** 

- You must have the [DC/OS CLI installed](/1.10/cli/install/) and be logged in as a superuser.

**Tips:** 

- To grant permissions to a group instead of a user, replace `users grant <user-name>` with `groups grant <group-name>`. 

### Disabled
This mode does not offer fine-grained control.

### Permissive

-  **DC/OS service access:**

   1.  Grant the permission to a user (`<user-name>`) for a particular service (`<service-name>`). 
   
       ```bash
       dcos security org users grant <user-name> dcos:adminrouter:service:marathon full --description "Controls access to Marathon services"
       dcos security org users grant <user-name> dcos:service:marathon:marathon:services:/<service-name> full --description "Controls access to a service, job, service group, or job group named <service-name>"
       ```
       
-  **DC/OS service tasks and logs:**

   1.  Grant the permission to a user (`<user-name>`).
   
       ```bash
       dcos security org users grant <user-name> dcos:adminrouter:ops:mesos full --description "Grants access to the Mesos master API/UI and task details"
       dcos security org users grant <user-name> dcos:adminrouter:ops:slave full --description "Grants access to the Mesos agent API/UI and task details such as logs"
       ```

### Strict

-  **DC/OS service access:**

   1.  Grant the permission to a user (`<user-name>`) for a particular service (`<service-name>`). 
   
       ```bash
       dcos security org users grant <user-name> dcos:adminrouter:service:marathon full --description "Controls access to Marathon services"
       dcos security org users grant <user-name> dcos:service:marathon:marathon:services:/<service-name> full --description "Controls access to a service, job, service group, or job group named <service-name>"
       ```
 
-  **DC/OS service tasks and logs:**

   1.  Grant the permission to a user (`<user-name>`) for a particular service (`<service-name>`). 
   
       ```bash
       dcos security org users grant <user-name> dcos:adminrouter:ops:mesos full --description "Grants access to the Mesos master API/UI and task details"
       dcos security org users grant <user-name> dcos:adminrouter:ops:slave full --description "Grants access to the Mesos agent API/UI and task details such as logs"
       dcos security org users grant <user-name> dcos:mesos:agent:executor:app_id:/<service-name> read --description "Controls access to executors of a service, job, service group, or job group named <service-name>"
       dcos security org users grant <user-name> dcos:mesos:agent:framework:role:slave_public read --description "Controls access to information about frameworks registered under the slave_public role"
       dcos security org users grant <user-name> dcos:mesos:agent:sandbox:app_id:/<service-name> read --description "Controls access to the sandbox data of a service, job, service group, or job group named <service-name>"
       dcos security org users grant <user-name> dcos:mesos:agent:task:app_id:/<service-name> read --description "Controls access to tasks of a service, job, service group, or job group named <service-name>"
       dcos security org users grant <user-name> dcos:mesos:master:executor:app_id:/<service-name> read --description "Controls access to executors running inside a service, job, service group, or job group named <service-name>"
       dcos security org users grant <user-name> dcos:mesos:master:framework:role:slave_public read --description "Controls access to frameworks registered with the slave_public role"
       dcos security org users grant <user-name> dcos:mesos:master:task:app_id:/<service-name> read --description "Controls access to tasks of a service, job, service group, or job group named <service-name>"
       ```
       
# <a name="service-in-group"></a>Granting access to a service in a service group

## <a name="service-in-group-ui"></a>Via the DC/OS GUI

1. Log into the DC/OS GUI as a user with the `superuser` permission.

   ![Login](/1.10/img/gui-installer-login-ee.gif)

1.  Select **Organization** and choose **Users** or **Groups**.

1.  Select the name of the user or group to grant the permission to.

    ![Add permission cory](/1.10/img/services-tab-user.png)

1.  From the **Permissions** tab, click **ADD PERMISSION**.

1.  Click **INSERT PERMISSION STRING** to toggle the dialog.

    ![Add permission](/1.10/img/services-tab-user3.png)

1.  Copy and paste the permission in the **Permissions Strings** field. Choose the permission strings based on your [security mode](/1.10/security/ent/#security-modes).

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

## <a name="service-in-group-cli"></a>Via the CLI

**Prerequisites:** 

- You must have the [DC/OS CLI installed](/1.10/cli/install/) and be logged in as a superuser.

**Tips:** 

- To grant permissions to a group instead of a user, replace `users grant <user-name>` with `groups grant <group-name>`. 

### Disabled
This mode does not offer fine-grained control.

### Permissive

-  **DC/OS service access:**

   1.  Grant the permission to a user (`<user-name>`) for a particular service (`<service-name>`).
   
       ```bash
       dcos security org users grant <user-name> dcos:adminrouter:service:marathon full --description "Controls access to Marathon services"
       dcos security org users grant <user-name> dcos:service:marathon:marathon:services:/group/<service-name> full --description "Controls access to a service, job, service group, or job group named <service-name> inside a group called group"
       ```
       
-  **DC/OS service tasks and logs:**

   1.  Grant the permission to a user (`<user-name>`).
          
       ```bash
       dcos security org users grant <user-name> dcos:adminrouter:ops:mesos full --description "Grants access to the Mesos master API/UI and task details"
       dcos security org users grant <user-name> dcos:adminrouter:ops:slave full --description "Grants access to the Mesos agent API/UI and task details such as logs"
       ```
       
### Strict

-  **DC/OS service access:**
   
   1.  Grant the permission to a user (`<user-name>`).
   
       ```bash
       dcos security org users grant <user-name> dcos:adminrouter:service:marathon full --description "Controls access to Marathon services"
       dcos security org users grant <user-name> dcos:service:marathon:marathon:services:/group/<service-name> full --description "Controls access to a service, job, service group, or job group named <service-name> inside a group called group"
       ```

-  **DC/OS service tasks and logs:**

   1.  Grant the permission to a user (`<user-name>`) for a particular service (`<service-name>`).
          
       ```bash
       dcos security org users grant <user-name> dcos:adminrouter:ops:mesos full --description "Grants access to the Mesos master API/UI and task details"
       dcos security org users grant <user-name> dcos:adminrouter:ops:slave full --description "Grants access to the Mesos agent API/UI and task details such as logs"
       dcos security org users grant <user-name> dcos:mesos:agent:executor:app_id:/group/<service-name> read --description "Controls access to executors of a service, job, service group, or job group named <service-name> inside the group group"
       dcos security org users grant <user-name> dcos:mesos:agent:framework:role:slave_public read --description "Controls access to information about frameworks registered under the slave_public role"
       dcos security org users grant <user-name> dcos:mesos:agent:sandbox:app_id:/group/<service-name> read --description "Controls access to the sandbox data of a service, job, service group, or job group named <service-name> inside the group group"
       dcos security org users grant <user-name> dcos:mesos:agent:task:app_id:/group/<service-name> read --description "Controls access to tasks of a service, job, service group, or job group named <service-name> inside the group group"
       dcos security org users grant <user-name> dcos:mesos:master:executor:app_id:/group/<service-name> read --description "Controls access to executors running inside a service, job, service group, or job group named <service-name>"
       dcos security org users grant <user-name> dcos:mesos:master:framework:role:slave_public read --description "Controls access to frameworks registered with the slave_public role"
       dcos security org users grant <user-name> dcos:mesos:master:task:app_id:/group/<service-name> read --description "Controls access to tasks of a service, job, service group, or job group named <service-name>"
       ```

# <a name="service-group"></a>Granting a user access to a service group

## <a name="service-group-ui"></a>Via the DC/OS GUI

1. Log into the DC/OS GUI as a user with the `superuser` permission.

   ![Login](/1.10/img/gui-installer-login-ee.gif)

1.  Select **Organization** and choose **Users** or **Groups**.

1.  Select the name of the user or group to grant the permission to.

    ![Add permission cory](/1.10/img/services-tab-user.png)

1.  From the **Permissions** tab, click **ADD PERMISSION**.

1.  Click **INSERT PERMISSION STRING** to toggle the dialog.

    ![Add permission](/1.10/img/services-tab-user3.png)

1.  Copy and paste the permission in the **Permissions Strings** field. Choose the permission strings based on your [security mode](/1.10/security/ent/#security-modes).

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

## <a name="service-group-cli"></a>Via the CLI

**Prerequisites:** 

- You must have the [DC/OS CLI installed](/1.10/cli/install/) and be logged in as a superuser.

**Tips:** 

- To grant permissions to a group instead of a user, replace `users grant <user-name>` with `groups grant <group-name>`. 

### Disabled
This mode does not offer fine-grained control. 

### Permissive

-  **DC/OS group access:**

   1.  Grant the permission to a user (`<user-name>`).
   
       ```bash
       dcos security org users grant <user-name> dcos:adminrouter:service:marathon full --description "Controls access to Marathon services"
       dcos security org users grant <user-name> dcos:service:marathon:marathon:services:/group full --description "Controls access to a service, job, service group, or job group named group"
       ```

-  **Group tasks and logs:**

   1.  Grant the permission to a user (`<user-name>`).
   
       ```bash
       dcos security org users grant <user-name> dcos:adminrouter:ops:mesos full --description "Grants access to the Mesos master API/UI and task details"
       dcos security org users grant <user-name> dcos:adminrouter:ops:slave full --description "Grants access to the Mesos agent API/UI and task details such as logs"
       ```

### Strict

-  **DC/OS group access:**

   1.  Grant the permission to a user (`<user-name>`).
   
       ```bash
       dcos security org users grant <user-name> dcos:adminrouter:service:marathon full --description "Controls access to Marathon services"
       dcos security org users grant <user-name> dcos:service:marathon:marathon:services:/group full --description "Controls access to a service, job, service group, or job group named group"
       ```
   
-  **Group tasks and logs:**

   1.  Grant the permission to a user (`<user-name>`).
   
       ```bash
       dcos security org users grant <user-name> dcos:adminrouter:ops:mesos full --description "Grants access to the Mesos master API/UI and task details"
       dcos security org users grant <user-name> dcos:adminrouter:ops:slave full --description "Grants access to the Mesos agent API/UI and task details such as logs"
       dcos security org users grant <user-name> dcos:mesos:agent:executor:app_id:/group read --description "Controls access to executors of a service, job, service group, or job group named group"
       dcos security org users grant <user-name> dcos:mesos:agent:framework:role:slave_public read --description "Controls access to information about frameworks registered under the slave_public role"
       dcos security org users grant <user-name> dcos:mesos:agent:sandbox:app_id:/group read --description "Controls access to the sandbox data of a service, job, service group, or job group named group"
       dcos security org users grant <user-name> dcos:mesos:agent:task:app_id:/group read --description "Controls access to tasks of a service, job, service group, or job group named group"
       dcos security org users grant <user-name> dcos:mesos:master:executor:app_id:/group read --description "Controls access to executors running inside a service, job, service group, or job group named group"
       dcos security org users grant <user-name> dcos:mesos:master:framework:role:slave_public read --description "Controls access to frameworks registered with the slave_public role"
       dcos security org users grant <user-name> dcos:mesos:master:task:app_id:/group read --description "Controls access to tasks of a service, job, service group, or job group named group"
       ```
