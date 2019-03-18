---
layout: layout.pug
navigationTitle:  Granting Access to the Mesos UI
title: Granting Access to the Mesos UI
menuWeight: 31
excerpt: Granting access to the Mesos UI

enterprise: true
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->


You can grant users access to the Mesos UI. By default, new users have no permissions.

# <a name="services-access-via-ui"></a>Grant Access by using the GUI

**Prerequisite:**

- A DC/OS user account without the `dcos:superuser` [permission](/1.13/security/ent/users-groups/).

1.  Log into the DC/OS GUI as a user with the `dcos:superuser` permission.

    ![Login](/1.13/img/LOGIN-EE-Modal_View-1_12.png)

    Figure 1. DC/OS web interface login

1.  Select **Organization** and choose **Users** or **Groups**.

1.  Select the name of the user or group to grant the permission to.

    ![Add permission cory](/1.13/img/GUI-Organization-Users-List_View-1_12.png)

    Figure 2. Select user or group to grant permissions to


1.  From the **Permissions** tab, click **ADD PERMISSION**.

1.  Click **INSERT PERMISSION STRING** to toggle the dialog.

    ![Add permission](/1.13/img/services-tab-user3.png)

    Figure 3. Insert Permission String

1.  Copy and paste the permission in the **Permissions Strings** field. Choose the permission strings based on your [security mode](/1.13/security/ent/#security-modes) and click **ADD PERMISSIONS** and then **Close**.

    ## Permissive

    ### Mesos master UI and API

    ```bash
    dcos:adminrouter:ops:mesos full
    ```

    ### Mesos agent API for accessing task sandboxes and logs, and task exec

    ```bash
    dcos:adminrouter:ops:slave full
    ```

    ## Strict

    ### Mesos master UI and API

    ```bash
    dcos:adminrouter:ops:mesos full
    ```

    ### Mesos agent API for accessing task sandboxes and logs, and task exec

    ```bash
    dcos:adminrouter:ops:slave full
    ```

You can now send the URL of the Mesos UI for DC/OS to the user: `http://<master-public-ip>/mesos/`.

# <a name="services-access-via-api"></a>Granting Access by using the API

**Prerequisites:**

- You must have the [DC/OS CLI installed](/1.13/cli/install/) and be logged in as a superuser.
- You must [get the root cert](/1.13/security/ent/tls-ssl/get-cert/) before issuing the curl commands in this section.

**Tips:**

- Service resources often include `/` characters that must be replaced with `%252F` in curl requests, as shown in the examples below.
- When using the API to manage permissions, you must create the permission before granting it. If the permission already exists, the API will return an informative message and you can continue to assign the permission.


## Permissive

### Mesos master UI and API

1.  Create the permission.

    ```bash
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    -H 'Content-Type: application/json' \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:mesos \
    -d '{"description":"Grants access to the Mesos master API/UI and task details"}'
    ```   

1.  Grant the following privileges to the user `uid`.

    ```bash
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:mesos/users/<uid>/full
    ```
    **Tip:** To grant this permission to a group instead of a user, replace `/users/<uid>` with `/groups/<gid>`.

1.  You can send the URL of the Mesos UI for DC/OS to the user: `http://<master-public-ip>/mesos/`.     

### Mesos agent API for accessing task sandboxes and logs, and task exec

1.  Create the permission.

    ```bash
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    -H 'Content-Type: application/json' \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:slave \
    -d '{"description":"Grants access to the Mesos agent API/UI and task details such as logs"}'
    ```   

1.  Grant the following privileges to the user `uid`.

    ```bash
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:slave/users/<uid>/full
    ```  
    **Tip:** To grant this permission to a group instead of a user, replace `/users/<uid>` with `/groups/<gid>`.


## Strict

### Mesos master UI and API

1.  Create the permission.

    ```bash
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    -H  'Content-Type: application/json' \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:mesos \
    -d '{"description":"Grants access to the Mesos master API/UI and task details"}'
    ```   

1.  Grant the following privileges to the user `uid`.

    ```bash
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:mesos/users/<uid>/full
    ```
    **Tip:** To grant this permission to a group instead of a user, replace `/users/<uid>` with `/groups/<gid>`.

1.  You can send the URL of the Mesos UI for DC/OS to the user: `http://<master-public-ip>/mesos/`.

### Mesos agent API for accessing task sandboxes and logs, and task exec

1.  Create the permission.

    ```bash
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    -H 'Content-Type: application/json' \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:slave \
    -d '{"description":"Grants access to the Mesos agent API/UI and task details such as logs"}'
    ```   

1.  Grant the following privileges to the user `uid`.

    ```bash
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:slave/users/<uid>/full
    ```  
    **Tip:** To grant this permission to a group instead of a user, replace `/users/<uid>` with `/groups/<gid>`.
