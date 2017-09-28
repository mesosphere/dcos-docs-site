---
layout: layout.pug
navigationTitle:  Granting Access to the Catalog Tab
title: Granting Access to the Catalog Tab
menuWeight: 80
excerpt:
featureMaturity:
enterprise: true
---

You can grant users access to the **Catalog** tab. By default, new users have no permissions.

**Tip:** This procedure grants full user access to the **Catalog** tab. If you are running in `strict` or `permissive` [security mode](/docs/1.10/overview/security/security-modes/) and want to configure fine-grained user access, see the [documentation](/docs/1.10/deploying-services/service-groups/).

## <a name="services-access-via-ui"></a>Grant Access by using the GUI

**Prerequisites:**

- A DC/OS user account without the `dcos:superuser` [permission](/docs/1.10/security/ent/users-groups/).

1. Log into the DC/OS GUI as a user with the `superuser` permission.

   ![Login](/docs/1.10/img/gui-installer-login-ee.gif)

1.  Select **Organization** and choose **Users** or **Groups**.

1.  Select the name of the user or group to grant the permission to.

    ![Add permission cory](/docs/1.10/img/services-tab-user.png)

1.  From the **Permissions** tab, click **ADD PERMISSION**.

1.  Click **INSERT PERMISSION STRING** to toggle the dialog.

    ![Add permission](/docs/1.10/img/services-tab-user3.png)

1.  Copy and paste the permission in the **Permissions Strings** field. Choose the permission strings based on your [security mode](/docs/1.10/overview/security/security-modes/) and click **ADD PERMISSIONS** and then **Close**.

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

- You must have the [DC/OS CLI installed](/docs/1.10/cli/install/) and be logged in as a superuser.
- If your [security mode](/docs/1.10/overview/security/security-modes/) is `permissive` or `strict`, you must [get the root cert](/docs/1.10/networking/tls-ssl/get-cert/) before issuing the curl commands in this section.

**Tips:**

- Service resources often include `/` characters that must be replaced with `%252F` in curl requests, as shown in the examples below.
- When using the API to manage permissions, you must create the permission before granting it. If the permission already exists, the API will return an informative message and you can continue to assign the permission.

## Disabled

1.  Create the permission.

    ```bash
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    -H 'Content-Type: application/json' \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:package  \
    -d '{"description":"Grants access to the Catalog tab"}'
    ```

1.  Grant the permission to a user (`<user-name>`).

    ```bash
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:package/users/<user-name>/full
    ```

    **Tip:** To grant this permission to a group instead of a user, replace `/users/<user-name>` with `/groups/<group-name>`.

## Permissive

1.  Create the permission.

    ```bash
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    -H 'Content-Type: application/json' \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:package  \
    -d '{"description":"Grants access to the Catalog tab"}'
    ```

1.  Grant the permission to a user (`<user-name>`).

    ```bash
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:package/users/<user-name>/full
    ```

    **Tip:** To grant this permission to a group instead of a user, replace `/users/<user-name>` with `/groups/<group-name>`.

## Strict

1.  Create the permission.

    ```bash
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    -H 'Content-Type: application/json' \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:package  \
    -d '{"description":"Grants access to the Catalog tab"}'
    ```

1.  Grant the permission to a user (`<user-name>`).

    ```bash
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:package/users/<user-name>/full
    ```

    **Tip:** To grant this permission to a group instead of a user, replace `/users/<user-name>` with `/groups/<group-name>`.
