---
layout: layout.pug
navigationTitle:  >
title: >
  Granting Access to the Settings and
  Organization tabs
menuWeight: 70
excerpt:

enterprise: true
---
You can grant users access to the **Settings** and **Organization** tabs. By default, new users have no permissions.

## <a name="network-access-via-ui"></a>Grant Access by using the GUI

**Prerequisites:** 

- A DC/OS user account without the `dcos:superuser` [permission](/mesosphere/dcos/1.9/security/ent/users-groups/).

1. Log into the DC/OS GUI as a user with the `superuser` permission.

   ![Login](/mesosphere/dcos/1.9/img/gui-installer-login-ee.gif)

1.  Select **Organization** and choose **Users** or **Groups**.

1.  Select the name of the user or group to grant the permission to.

    ![Add permission cory](/mesosphere/dcos/1.9/img/services-tab-user.png)

1.  From the **Permissions** tab, click **ADD PERMISSION**.

1.  Click **INSERT PERMISSION STRING** to toggle the dialog.

    ![Add permission](/mesosphere/dcos/1.9/img/services-tab-user3.png)

1.  Copy and paste the permission in the **Permissions Strings** field. Choose the permission strings based on your [security mode](/mesosphere/dcos/1.9/security/ent/#security-modes) and click **ADD PERMISSIONS** and then **Close**.

    ## Disabled
    
    ```bash
    dcos:adminrouter:acs full
    ```
       
    ## Permissive
    
    ```bash
    dcos:adminrouter:acs full
    ```
       
    ## Strict

    ```bash
    dcos:adminrouter:acs full
    ```

 
   
## <a name="network-access-via-api"></a>Granting Access by using the API

**Prerequisites:** 

- You must have the [DC/OS CLI installed](/mesosphere/dcos/1.9/cli/install/) and be logged in as a superuser.
- If your [security mode](/mesosphere/dcos/1.9/security/ent/#security-modes) is `permissive` or `strict`, you must [get the root cert](/mesosphere/dcos/1.9/networking/tls-ssl/get-cert/) before issuing the curl commands in this section. 

**Tips:** 

- Service resources often include `/` characters that must be replaced with `%252F` in curl requests, as shown in the examples below.
- When using the API to manage permissions, you must create the permission before granting it. If the permission already exists, the API will return an informative message and you can continue to assign the permission.

## Disabled

1.  Create the permission.

    ```bash
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    -H 'Content-Type: application/json' \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:acs  \
    -d '{"description":"Grants access to the contents of the Settings and Organization tabs"}'
    ```

1.  Grant the permission to a user (`<user-name>`).

    ```bash
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:acs/users/<user-name>/full
    ```
    
    **Tip:** To grant this permission to a group instead of a user, replace `/users/<user-name>` with `/groups/<group-name>`. 

## Permissive

1.  Create the permission.

    ```bash
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    -H 'Content-Type: application/json' \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:acs  \
    -d '{"description":"Grants access to the contents of the Settings and Organization tabs"}'
    ```

1.  Grant the permission to a user (`<user-name>`).

    ```bash
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:acs/users/<user-name>/full
    ```
    
    **Tip:** To grant this permission to a group instead of a user, replace `/users/<user-name>` with `/groups/<group-name>`.

## Strict

1.  Create the permission.

    ```bash
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    -H 'Content-Type: application/json' \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:acs  \
    -d '{"description":"Grants access to the contents of the Settings and Organization tabs"}'
    ```

1.  Grant the permission to a user (`<user-name>`).

    ```bash
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:acs/users/<user-name>/full
    ```
    
    **Tip:** To grant this permission to a group instead of a user, replace `/users/<user-name>` with `/groups/<group-name>`. 
