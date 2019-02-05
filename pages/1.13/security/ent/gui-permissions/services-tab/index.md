---
layout: layout.pug
navigationTitle:  Granting Access to the Services Tab
title: Granting Access to the Services Tab
menuWeight: 10
excerpt: Granting access to the Services tab

enterprise: true
---



You can grant users access to the Services tab. By default, new users have no permissions.

**Tip:** This procedure grants full user access to the **Services** tab. If you want to configure fine-grained user access, see the [documentation](/1.13/deploying-services/service-groups/).

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

### Services tab

```
dcos:adminrouter:service:marathon full
dcos:service:marathon:marathon:services:/ full
```

### Services tasks

```
dcos:adminrouter:ops:mesos full
```

### Task details and logs

```
dcos:adminrouter:ops:slave full
```

## Strict

### Services tab

```
dcos:adminrouter:service:marathon full
dcos:service:marathon:marathon:services:/ full
```

### Services tasks

```
dcos:adminrouter:ops:mesos full
```

### Task details and logs

```
dcos:adminrouter:ops:slave full
dcos:mesos:master:framework:role:slave_public read
dcos:mesos:master:executor:app_id read
dcos:mesos:master:task:app_id read
dcos:mesos:agent:framework:role:slave_public read
dcos:mesos:agent:executor:app_id read
dcos:mesos:agent:task:app_id read
dcos:mesos:agent:sandbox:app_id read
```

# <a name="services-access-via-api"></a>Granting Access by using the API

**Prerequisites:**

- You must have the [DC/OS CLI installed](/1.13/cli/install/) and be logged in as a superuser.
- You must [get the root cert](/1.13/security/ent/tls-ssl/get-cert/) before issuing the curl commands in this section.

**Tips:**

- Service resources often include `/` characters that must be replaced with `%252F` in curl requests, as shown in the examples below.
- When using the API to manage permissions, you must create the permission before granting it. If the permission already exists, the API will return an informative message and you can continue to assign the permission.


## Permissive

### Grant access to DC/OS Services tab

1.  Create the permission.

    ```bash
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    -H 'Content-Type: application/json' \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:service:marathon  \
    -d '{"description":"Grants access to the Services tab"}'
    ```

1.  Grant the following privileges to the user `uid`.

    ```bash
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:service:marathon/users/<uid>/full
    ```

    **Tip:** To grant this permission to a group instead of a user, replace `/users/<uid>` with `/groups/<gid>`.

### Grant access to DC/OS services task details and logs

1.  Create the permission.

    ```bash
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    -H 'Content-Type: application/json' \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:mesos  \
    -d '{"description":"Grants access to the Mesos master API/UI and task details"}'
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    -H 'Content-Type: application/json' \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:slave  \
    -d '{"description":"Grants access to the Mesos agent API/UI and task details such as logs"}'
    ```

1.  Grant the following privileges to the user `uid`.

    ```bash
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:mesos/users/<uid>/full
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:slave/users/<uid>/full
    ```

    **Tip:** To grant this permission to a group instead of a user, replace `/users/<uid>` with `/groups/<gid>`.

### Grant access to all services in the Services tab

1.  Create the permission.

    ```bash
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    -H 'Content-Type: application/json' \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:service:marathon:marathon:services:%252F  \
    -d '{"description":"Grants access to all services"}'
    ```

1.  Grant the following privileges to the user `uid`.

    ```bash
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:service:marathon:marathon:services:%252F/users/<uid>/full
    ```

    **Tip:** To grant this permission to a group instead of a user, replace `/users/<uid>` with `/groups/<gid>`.

## Strict

### Grant access to DC/OS Services tab

1.  Create the permission.

    ```bash
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    -H 'Content-Type: application/json' \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:service:marathon  \
    -d '{"description":"Grants access to the Services tab"}'
    ```

1.  Grant the following privileges to the user `uid`.

    ```bash
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:service:marathon/users/<uid>/full
    ```

    **Tip:** To grant this permission to a group instead of a user, replace `/users/<uid>` with `/groups/<gid>`.

### Grant access to DC/OS services task details and logs

1.  Create the permission.

    ```bash
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    -H 'Content-Type: application/json' \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:mesos  \
    -d '{"description":"Grants access to the Mesos master API/UI and task details"}'
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    -H 'Content-Type: application/json' \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:slave  \
    -d '{"description":"Grants access to the Mesos agent API/UI and task details such as logs"}'
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    -H 'Content-Type: application/json' \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:framework:role:slave_public  \
    -d '{"description":"Grants access to register as or view Mesos master information about frameworks registered with the slave_public role"}'
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    -H 'Content-Type: application/json' \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:executor:app_id  \
    -d '{"description":"Grants access to all executors on the Mesos master"}'
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    -H 'Content-Type: application/json' \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:task:app_id  \
    -d '{"description":"Grants access to all tasks on the Mesos master"}'
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    -H 'Content-Type: application/json' \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:framework:role:slave_public  \
    -d '{"description":"Grants access to view Mesos agent information about frameworks registered with the slave_public role"}'
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    -H 'Content-Type: application/json' \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:executor:app_id  \
    -d '{"description":"Grants access to all executors running on the Mesos agent"}'
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    -H 'Content-Type: application/json' \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:task:app_id  \
    -d '{"description":"Grants access to all tasks running on the Mesos agent"}'
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    -H 'Content-Type: application/json' \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:sandbox:app_id  \
    -d '{"description":"Grants access to the sandboxes on the Mesos agent"}'
    ```

1.  Grant the following privileges to the user `uid`.

    ```bash
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:mesos/users/<uid>/full
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:slave/users/<uid>/full
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:framework:role:slave_public/users/<uid>/read
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:executor:app_id/users/<uid>/read
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:task:app_id/users/<uid>/read
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:framework:role:slave_public/users/<uid>/read
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:executor:app_id/users/<uid>/read
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:task:app_id/users/<uid>/read
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:sandbox:app_id/users/<uid>/read
    ```

    **Tip:** To grant this permission to a group instead of a user, replace `/users/<uid>` with `/groups/<gid>`.

### Grant access to all services in the Services tab

1.  Create the permission.

    ```bash
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    -H 'Content-Type: application/json' \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:service:marathon:marathon:services:%252F  \
    -d '{"description":"Grants access to all services"}'
    ```

1.  Grant the following privileges to the user `uid`.

    ```bash
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:service:marathon:marathon:services:%252F/users/<uid>/full
    ```

    **Tip:** To grant this permission to a group instead of a user, replace `/users/<uid>` with `/groups/<gid>`.
