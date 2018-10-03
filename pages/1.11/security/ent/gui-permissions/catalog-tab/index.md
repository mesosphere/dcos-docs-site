---
layout: layout.pug
navigationTitle:  Granting Access to the Catalog Screen
title: Granting Access to the Catalog Screen
menuWeight: 80
excerpt: Granting access to the Catalog screen

enterprise: true
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->

You can grant users access to the [**Catalog** screen](/1.11/gui/catalog/). By default, new users have no permissions.

**Tip:** This procedure grants full user access to the **Catalog** screen. If you are running in `strict` or `permissive` [security mode](/1.11/security/ent/#security-modes) and want to configure fine-grained user access, see the [documentation](/1.11/deploying-services/service-groups/).

## <a name="services-access-via-ui"></a>Grant Access by using the web interface

**Prerequisites:**

- A DC/OS user account without the `dcos:superuser` [permission](/1.11/security/ent/users-groups/).

1. Log in to the DC/OS web interface as a user with the `superuser` permission.

   ![Login](/1.11/img/gui-installer-login-ee.gif)

   Figure 1. DC/OS web interface login

1.  Select **Organization** and choose **Users** or **Groups**.

1.  Select the name of the user or group to grant the permission to.

    ![Add permission cory](/1.11/img/services-tab-user.png)

    Figure 2. Select user or group to grant permissions to

1.  From the **Permissions** screen, click **ADD PERMISSION**.

1.  Click **INSERT PERMISSION STRING** to toggle the dialog.

    ![Add permission](/1.11/img/services-tab-user3.png)

    Figure 3. Insert Permission String 

1.  Copy and paste the permission in the **Permissions Strings** field. Choose the permission strings based on your [security mode](/1.11/security/ent/#security-modes) and click **ADD PERMISSIONS** and then **Close**.

    ## Disabled

    ```bash
    dcos:adminrouter:package full
    ```

    ## Permissive

    ```bash
    dcos:adminrouter:package full
    ```

    ## Strict

    ```bash
    dcos:adminrouter:package full
    ```

## <a name="universe-access-via-api"></a>Granting Access by using the API

**Prerequisites:**

- You must have the [DC/OS CLI installed](/1.11/cli/install/) and be logged in as a superuser.
- If your [security mode](/1.11/security/ent/#security-modes) is `permissive` or `strict`, you must [get the root cert](/1.11/security/ent/tls-ssl/get-cert/) before issuing the `curl` commands in this section.

**Note:**

- Service resources often include `/` characters that must be replaced with `%252F` in `curl` requests, as shown in the examples below.
- When using the API to manage permissions, you must create the permission before granting it. If the permission already exists, the API will return an informative message and you can continue to assign the permission.

## Disabled

1.  Create the permission.

    ```bash
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    -H 'Content-Type: application/json' \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:package  \
    -d '{"description":"Grants access to the Catalog screen"}'
    ```

1.  Grant the following privileges to the user `uid`.

    ```bash
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:package/users/<uid>/full
    ```

    **Note:** To grant this permission to a group instead of a user, replace `/users/<uid>` with `/groups/<gid>`.

## Permissive

1.  Create the permission.

    ```bash
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    -H 'Content-Type: application/json' \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:package  \
    -d '{"description":"Grants access to the Catalog screen"}'
    ```

1.  Grant the following privileges to the user `uid`.

    ```bash
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:package/users/<uid>/full
    ```

    **Note:** To grant this permission to a group instead of a user, replace `/users/<uid>` with `/groups/<gid>`.

## Strict

1.  Create the permission.

    ```bash
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    -H 'Content-Type: application/json' \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:package  \
    -d '{"description":"Grants access to the Catalog screen"}'
    ```

1.  Grant the following privileges to the user `uid`.

    ```bash
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:package/users/<uid>/full
    ```

    **Note:** To grant this permission to a group instead of a user, replace `/users/<uid>` with `/groups/<gid>`.
