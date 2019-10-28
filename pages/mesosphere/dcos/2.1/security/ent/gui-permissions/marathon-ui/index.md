---
layout: layout.pug
navigationTitle:  Granting Access to the Marathon Tab
title: Granting Access to the Marathon Tab
menuWeight: 32
excerpt: Granting access to the Marathon Tab
render: mustache
model: /mesosphere/dcos/2.0/data.yml
enterprise: true
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->


You can grant users access to the Marathon Tab. By default, new users have no permissions.

# <a name="services-access-via-ui"></a>Granting Access using the UI

**Prerequisite:**

- A DC/OS user account without the `dcos:superuser` [permission](/mesosphere/dcos/2.0/security/ent/users-groups/).

1.  Log into the DC/OS UI as a user with the `dcos:superuser` permission.

    ![Login](/mesosphere/dcos/2.0/img/LOGIN-EE-Modal_View-1_12.png)

    Figure 1. Log in to UI

1.  Select **Organization** and choose **Users** or **Groups**.

1.  Select the name of the user or group to grant the permission to.

    ![Add permission cory](/mesosphere/dcos/2.0/img/GUI-Organization-Users-List_View-1_12.png)

    Figure 2. Select user or group to grant permissions to


1.  From the **Permissions** tab, click **ADD PERMISSION**.

1.  Click **INSERT PERMISSION STRING** to toggle the dialog.

    ![Add permission](/mesosphere/dcos/2.0/img/services-tab-user3.png)

    Figure 3. Add permission 


1.  Copy and paste the permission in the **Permissions Strings** field. Choose the permission strings based on your [security mode](/mesosphere/dcos/2.0/security/ent/#security-modes) and click **ADD PERMISSIONS** and then **Close**.

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
  To view task details and logs, you must grant access to the [Mesos UI](/mesosphere/dcos/2.0/security/ent/gui-permissions/mesos-ui/).   

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
    To view Marathon task details and logs, you must grant access to the [Mesos UI](/mesosphere/dcos/2.0/security/ent/gui-permissions/mesos-ui/).

You can send the URL of the native Marathon UI for DC/OS to the user: `http://<master-public-ip>/marathon/`.

# <a name="services-access-via-api"></a>Granting Access using the API

**Prerequisites:**

- You must have the [DC/OS CLI installed](/mesosphere/dcos/2.0/cli/install/) and be logged in as a superuser.
- You must [get the root cert](/mesosphere/dcos/2.0/security/ent/tls-ssl/get-cert/) before issuing the curl commands in this section.

### Notes

- Service resources often include `/` characters that must be replaced with `%252F` in curl requests, as shown in the examples below.
- When using the API to manage permissions, you must create the permission before granting it. If the permission already exists, the API will return an informative message and you can continue to assign the permission.


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

1.  Grant the following privileges to the user `uid`.

    ```bash
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:service:marathon/users/<uid>/full
    ```

<p class="message--note"><strong>NOTE: </strong>To grant this permission to a group instead of a user, replace <code>/users/"uid"</code> with <code>/groups/"gid"</code>.</p>


### Launch tasks


1.  Create the permission.

    ```bash
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    -H 'Content-Type: application/json' \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:service:marathon:marathon:services:%252F \
    -d '{"description":"Grants access to launch Marathon task from UI"}'
    ```

1.  Grant the following privileges to the user `uid`.

    ```bash
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:service:marathon:marathon:services:%252F/full
    ```

<p class="message--note"><strong>NOTE: </strong>To grant this permission to a group instead of a user, replace <code>/users/"uid"</code> with <code>/groups/"gid"</code>.</p>



### Task details and logs
To view task details and logs, you must grant access to the [Mesos UI](/mesosphere/dcos/2.0/security/ent/gui-permissions/mesos-ui/).

## Strict

### Marathon dashboard

1.  Create the permission.

    ```bash
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:service:marathon \
    -d '{"description":"Grants access to the Marathon UI"}'
    ```

1.  Grant the following privileges to the user `uid`.

    ```bash
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:service:marathon/users/<uid>/full
    ```

<p class="message--note"><strong>NOTE: </strong>To grant this permission to a group instead of a user, replace <code>/users/"uid"</code> with <code>/groups/"gid"</code>.</p>


### Launch tasks


1.  Create the permission.

    ```bash
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:service:marathon:marathon:services:%252F \
    -d '{"description":"Grants access to launch Marathon task from UI"}'
    ```

1.  Grant the following privileges to the user `uid`.

    ```bash
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:service:marathon:marathon:services:%252F/full
    ```

<p class="message--note"><strong>NOTE: </strong>To grant this permission to a group instead of a user, replace <code>/users/"uid"</code> with <code>/groups/"gid"</code>.</p>


### Task details and logs
To view task details and logs, you must grant access to the [Mesos UI](/mesosphere/dcos/2.0/security/ent/gui-permissions/mesos-ui/).

You can now send the URL of the native Marathon UI for DC/OS to the user: `http://<master-public-ip>/marathon/`.
