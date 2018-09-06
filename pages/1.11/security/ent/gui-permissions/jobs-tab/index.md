---
layout: layout.pug
navigationTitle:  Granting Access to the Jobs Screen
title: Granting Access to the Jobs Screen
menuWeight: 30
excerpt: Granting access to the Jobs screen

enterprise: true
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->


You can grant users access to the [**Jobs** screen](/1.11/gui/jobs/). By default, new users have no permissions.

**Note:** This procedure grants full user access to the **Jobs** screen and all the jobs inside of it. If you are running in `strict` or `permissive` [security mode](/1.11/security/ent/#security-modes) and want to configure fine-grained user access, see the [documentation](/1.11/deploying-services/service-groups/).

# <a name="jobs-access-via-ui"></a>Granting Access using the web interface

**Prerequisites:**

- A DC/OS user account without the `dcos:superuser` [permission](/1.11/security/ent/users-groups/).

1. Log in to the DC/OS web interface as a user with the `superuser` permission.

   ![Login](/1.11/img/gui-installer-login-ee.gif)

    Figure 1. DC/OS web interface login

2.  Select **Organization** and choose **Users** or **Groups**.

3.  Select the name of the user or group to grant the permission to.

    ![Add permission cory](/1.11/img/services-tab-user.png)

    Figure 2. Select user or group to grant permissions to


4.  From the **Permissions** screen, click **ADD PERMISSION**.

5.  Click **INSERT PERMISSION STRING** to toggle the dialog.

    ![Add permission](/1.11/img/services-tab-user3.png)

    Figure 3. Insert Permission String

6.  Copy and paste the permission in the **Permissions Strings** field. Choose the permission strings based on your [security mode](/1.11/security/ent/#security-modes) and click **ADD PERMISSIONS** and then **Close**.

## Disabled

### DC/OS Jobs screen

    ```
    dcos:adminrouter:service:metronome full
    ```

### DC/OS jobs task and details

    ```
    dcos:adminrouter:ops:mesos full
    dcos:adminrouter:ops:slave full
    ```

## Permissive

### DC/OS Jobs screen

    ```
    dcos:adminrouter:service:metronome full
    dcos:service:metronome:metronome:jobs full
    ```

### DC/OS jobs task and details

    ```
    dcos:adminrouter:ops:mesos full
    dcos:adminrouter:ops:slave full
    ```

## Strict

### DC/OS Jobs screen

    ```
    dcos:adminrouter:service:metronome full
    dcos:service:metronome:metronome:jobs full
    ```

### DC/OS jobs task and details

    ```
    dcos:adminrouter:ops:mesos full
    dcos:adminrouter:ops:slave full
    dcos:mesos:master:framework:role:* read
    dcos:mesos:master:executor:app_id read
    dcos:mesos:master:task:app_id read
    dcos:mesos:agent:framework:role:* read
    dcos:mesos:agent:executor:app_id read
    dcos:mesos:agent:task:app_id read
    dcos:mesos:agent:sandbox:app_id read
    ```


# <a name="services-access-via-api"></a>Granting Acess using the API

**Prerequisites:**

- You must have the [DC/OS CLI installed](/1.11/cli/install/) and be logged in as a superuser.
- If your [security mode](/1.11/security/ent/#security-modes) is `permissive` or `strict`, you must [get the root cert](/1.11/security/ent/tls-ssl/get-cert/) before issuing the curl commands in this section.

**Note:**

- Service resources often include `/` characters that must be replaced with `%252F` in curl requests, as shown in the examples below.
- When using the API to manage permissions, you must create the permission before granting it. If the permission already exists, the API will return an informative message and you can continue to assign the permission.

## Disabled

### DC/OS Jobs screen

1.  Create the permission.

   ```bash
   curl -X PUT \
   -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
   -H 'Content-Type: application/json' \
   $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:service:metronome  \
   -d '{"description":"Grants access to the Jobs screen"}'
   curl -X PUT \
   -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
   -H 'Content-Type: application/json' \
   $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:service:metronome:metronome:jobs  \
   -d '{"description":"Grants access to all jobs"}'
   ```   

2.  Grant the following privileges to the user `uid`.

   ```bash
   curl -X PUT \
   -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
   $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:service:metronome/users/<uid>/full
   curl -X PUT \
   -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
   $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:service:metronome:metronome:jobs/users/<uid>/full
   ```   

   **Note:** To grant this permission to a group instead of a user, replace `/users/<uid>` with `/groups/<gid>`.

### DC/OS jobs task and details

1.  Create the permission.

   ```bash
   curl -X PUT \
   -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
   -H 'Content-Type: application/json' \
   $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:mesos  \
   -d '{"description":"Grants access to the Mesos master API/UI and task details"}'
   curl -X PUT \
   -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
   -H 'Content-Type: application/json' \
   $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:slave  \
   -d '{"description":"Grants access to the Mesos agent API/UI and task details such as logs"}'
   ```   

2.  Grant the following privileges to the user `uid`.

   ```bash
   curl -X PUT \
   -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
   $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:mesos/users/<uid>/full
   curl -X PUT \
   -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
   $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:slave/users/<uid>/full
   ```  

**Note:** To grant this permission to a group instead of a user, replace `/users/<uid>` with `/groups/<gid>`.

## Permissive

### DC/OS Jobs screen

1.  Create the permission.

   ```bash
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
   -H 'Content-Type: application/json' \
   $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:service:metronome  \
   -d '{"description":"Grants access to the Jobs screen"}'
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
   -H 'Content-Type: application/json' \
   $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:service:metronome:metronome:jobs  \
   -d '{"description":"Grants access to all jobs"}'
   ```   

2.  Grant the following privileges to the user `uid`.

   ```bash
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
   $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:service:metronome/users/<uid>/full
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
   $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:service:metronome:metronome:jobs/users/<uid>/full
   ```   

**Note:** To grant this permission to a group instead of a user, replace `/users/<uid>` with `/groups/<gid>`.

### DC/OS jobs task and details

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

2.  Grant the following privileges to the user `uid`.

   ```bash
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
   $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:mesos/users/<uid>/full
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
   $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:slave/users/<uid>/full
   ```  

**Note:** To grant this permission to a group instead of a user, replace `/users/<uid>` with `/groups/<gid>`.

## Strict

### DC/OS Jobs screen

1.  Create the permission.

   ```bash
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
   -H 'Content-Type: application/json' \
   $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:service:metronome  \
   -d '{"description":"Grants access to the Jobs screen"}'
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
   -H 'Content-Type: application/json' \
   $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:service:metronome:metronome:jobs  \
   -d '{"description":"Grants access to all jobs"}'
   ```   

2.  Grant the following privileges to the user `uid`.

   ```bash
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
   $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:service:metronome/users/<uid>/full
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
   $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:service:metronome:metronome:jobs/users/<uid>/full
   ```

**Note:** To grant this permission to a group instead of a user, replace `/users/<uid>` with `/groups/<gid>`.

### DC/OS jobs task and details

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
   $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:framework:role:*  \
   -d '{"description":"Grants access to register as or view Mesos master information about frameworks registered with the Mesos default role"}'
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
   $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:framework:role:*  \
   -d '{"description":"Grants access to view Mesos agent information about frameworks registered with the Mesos default role"}'
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

2.  Grant the following privileges to the user `uid`.

   ```bash
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
   $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:mesos/users/<uid>/full
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
   $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:slave/users/<uid>/full
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
   $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:framework:role:*/users/<uid>/read
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
   $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:executor:app_id/users/<uid>/read
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
   $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:task:app_id/users/<uid>/read
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
   $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:framework:role:*/users/<uid>/read
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
   $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:executor:app_id/users/<uid>/read
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
   $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:task:app_id/users/<uid>/read
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
   $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:sandbox:app_id/users/<uid>/read       
   ```   

**Note:** To grant this permission to a group instead of a user, replace `/users/<uid>` with `/groups/<gid>`.
