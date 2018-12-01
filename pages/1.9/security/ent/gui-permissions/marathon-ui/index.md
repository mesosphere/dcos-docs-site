---
layout: layout.pug
navigationTitle:  Granting Access to the Marathon UI
title: Granting Access to the Marathon UI
menuWeight: 32
excerpt:

enterprise: true
---

You can grant users access to the Marathon UI. By default, new users have no permissions.

# <a name="services-access-via-ui"></a>Grant Access by using the GUI

**Prerequisite:** 

- A DC/OS user account without the `dcos:superuser` [permission](/1.9/security/ent/users-groups/).

1.  Log into the DC/OS GUI as a user with the `dcos:superuser` permission.

    ![Login](/1.9/img/gui-installer-login-ee.gif)

1.  Select **Organization** and choose **Users** or **Groups**.

1.  Select the name of the user or group to grant the permission to.

    ![Add permission cory](/1.9/img/services-tab-user.png)

1.  From the **Permissions** tab, click **ADD PERMISSION**.

1.  Click **INSERT PERMISSION STRING** to toggle the dialog.

    ![Add permission](/1.9/img/services-tab-user3.png)

1.  Copy and paste the permission in the **Permissions Strings** field. Choose the permission strings based on your [security mode](/1.9/security/ent/#security-modes) and click **ADD PERMISSIONS** and then **Close**.

    ## Disabled
    
    ### All Marathon permissions
 
    ```bash
    dcos:adminrouter:service:marathon full
    ```
    
    ## Permissive
    
    ### Marathon dashboard
    
    ```bash
    dcos:adminrouter:service:marathon full
    ```
       
    ### Launch tasks
    
    ```bash
    dcos:service:marathon:marathon:services:/ full
    ```
    
    ### Task details and logs
    To view task details and logs, you must grant access to the [Mesos UI](/1.9/security/ent/gui-permissions/mesos-ui/).   

    ## Strict
    
    ### Marathon dashboard
    
    ```bash
    dcos:adminrouter:service:marathon full
    ```
       
    ### Launch tasks
    
    ```bash
    dcos:service:marathon:marathon:services:/ full
    ```
    
    ### Task details and logs
    To view Marathon task details and logs, you must grant access to the [Mesos UI](/1.9/security/ent/gui-permissions/mesos-ui/).
 
1.  You can send the URL of the native Marathon UI for DC/OS to the user: `http://<master-public-ip>/marathon/`.

# <a name="services-access-via-api"></a>Granting Access by using the API

**Prerequisites:** 

- You must have the [DC/OS CLI installed](/1.9/cli/install/) and be logged in as a superuser.
- If your [security mode](/1.9/security/ent/#security-modes) is `permissive` or `strict`, you must [get the root cert](/1.9/networking/tls-ssl/get-cert/) before issuing the curl commands in this section. 

**Tips:** 

- Service resources often include `/` characters that must be replaced with `%252F` in curl requests, as shown in the examples below.
- When using the API to manage permissions, you must create the permission before granting it. If the permission already exists, the API will return an informative message and you can continue to assign the permission.


## Disabled

### Marathon dashboard and launch tasks

1.  Create the permission.

   ```bash
   curl -X PUT \
   -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
   -H 'Content-Type: application/json' \
   $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:service:marathon \
   -d '{"description":"Grants access to the Marathon UI"}'
   ```
   
1.  Grant the permission to a user (`<user-name>`).

   ```bash
   curl -X PUT \
   -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
   $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:service:marathon/users/<user-name>/full
   ```
   
   **Tip:** To grant this permission to a group instead of a user, replace `/users/<user-name>` with `/groups/<group-name>`. 

## Permissive

### Marathon dashboard 

1.  Create the permission.

   ```bash
   curl -X PUT --cacert dcos-ca.crt \
   -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
   -H 'Content-Type: application/json' \
   $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:service:marathon \
   -d '{"description":"Grants access to the Marathon UI"}'
   ```
   
1.  Grant the permission to a user (`<user-name>`).

   ```bash
   curl -X PUT --cacert dcos-ca.crt \
   -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:service:marathon/users/<user-name>/full
   ```
   
   **Tip:** To grant this permission to a group instead of a user, replace `/users/<user-name>` with `/groups/<group-name>`. 
         
### Launch tasks


1.  Create the permission.

   ```bash
   curl -X PUT --cacert dcos-ca.crt \
   -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
   -H 'Content-Type: application/json' \
   $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:service:marathon:marathon:services:%252F \
   -d '{"description":"Grants access to launch Marathon task from UI"}'
   ```
   
1.  Grant the permission to a user (`<user-name>`).

   ```bash
   curl -X PUT --cacert dcos-ca.crt \
   -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
   $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:service:marathon:marathon:services:%252F/full
   ```
   
   **Tip:** To grant this permission to a group instead of a user, replace `/users/<user-name>` with `/groups/<group-name>`. 
       

### Task details and logs
To view task details and logs, you must grant access to the [Mesos UI](/1.9/security/ent/gui-permissions/mesos-ui/).

## Strict

### Marathon dashboard 

1.  Create the permission.

   ```bash
   curl -X PUT --cacert dcos-ca.crt \
   -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
   -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:service:marathon \
   -d '{"description":"Grants access to the Marathon UI"}'
   ```
   
1.  Grant the permission to a user (`<user-name>`).

   ```bash
   curl -X PUT --cacert dcos-ca.crt \
   -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:service:marathon/users/<user-name>/full
   ```
   
   **Tip:** To grant this permission to a group instead of a user, replace `/users/<user-name>` with `/groups/<group-name>`. 
         
### Launch tasks


1.  Create the permission.

   ```bash
   curl -X PUT --cacert dcos-ca.crt \
   -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
   -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:service:marathon:marathon:services:%252F \
   -d '{"description":"Grants access to launch Marathon task from UI"}'
   ```
   
1.  Grant the permission to a user (`<user-name>`).

   ```bash
   curl -X PUT --cacert dcos-ca.crt \
   -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
   $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:service:marathon:marathon:services:%252F/full
   ```
   
   **Tip:** To grant this permission to a group instead of a user, replace `/users/<user-name>` with `/groups/<group-name>`. 

### Task details and logs
To view task details and logs, you must grant access to the [Mesos UI](/1.9/security/ent/gui-permissions/mesos-ui/).

You can now send the URL of the native Marathon UI for DC/OS to the user: `http://<master-public-ip>/marathon/`.
