---
layout: layout.pug
navigationTitle:  Granting Access to the Secrets Tab
title: Granting Access to the Secrets Tab
menuWeight: 50
excerpt: Granting access to the Secrets tab
render: mustache
model: /1.14/data.yml
enterprise: true
---

<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->

You can grant users access to the **Secrets** tab. By default, new users have no permissions.

<p class="message--note"><strong>NOTE: </strong>This procedure grants full user access to the <strong>Secrets</strong> tab. If you want to configure fine-grained user access, see the <a href="/1.14/security/ent/secrets/use-secrets/">documentation</a>.</p>

## <a name="network-access-via-ui"></a>Grant Access by using the UI

**Prerequisites:**

- A DC/OS user account without the `dcos:superuser` [permission](/1.14/security/ent/users-groups/).

1. Log into the DC/OS UI as a user with the `superuser` permission.

   ![Login](/1.14/img/LOGIN-EE-Modal_View-1_12.png)

   Figure 1. DC/OS UI login

1.  Select **Organization** and choose **Users** or **Groups**.

1.  Select the name of the user or group to grant the permission to.

    ![Add user or group for granting permissions](/1.14/img/GUI-Organization-Users-List_VIew-1_12.png)
    Figure 2. Select user or group to grant permissions to

1.  From the **Permissions** tab, click **ADD PERMISSION**.

1.  Click **INSERT PERMISSION STRING** to toggle the dialog.

    ![Add permission](/1.14/img/services-tab-user3.png)

    Figure 3. Insert Permission String

    ## Disabled

    ```bash
    dcos:adminrouter:secrets full
    dcos:secrets:list:default:/ read
    ```

1.  Copy and paste the permission in the **Permissions Strings** field. Choose the permission strings based on your [security mode](/1.14/security/ent/#security-modes) and click **ADD PERMISSIONS** and then **Close**.

    ## Permissive

    ```bash
    dcos:adminrouter:secrets full
    dcos:secrets:list:default:/ read
    ```

    ## Strict

    ```bash
    dcos:adminrouter:secrets full
    dcos:secrets:list:default:/ read
    ```


## <a name="network-access-via-api"></a>Granting Access by using the API

**Prerequisites:**

- You must have the [DC/OS CLI installed](/1.14/cli/install/) and be logged in as a superuser.
- You must [get the root cert](/1.14/security/ent/tls-ssl/get-cert/) before issuing the curl commands in this section.

**Tips:**

- Service resources often include `/` characters that must be replaced with `%252F` in curl requests, as shown in the examples below.
- When using the API to manage permissions, you must create the permission before granting it. If the permission already exists, the API will return an informative message and you can continue to assign the permission.

## Permissive

1.  Create the permission.

    ```bash
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    -H 'Content-Type: application/json' \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:secrets  \
    -d '{"description":"Grants access to the contents of the Secrets tab"}'
    ```

1.  Grant the following privileges to the user `uid`.

    ```bash
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:secrets/users/<uid>/full
    ```

<p class="message--note"><strong>NOTE: </strong>To grant this permission to a group instead of a user, replace <code>/users/"uid"</code> with <code>/groups/"gid"</code>.</p>

## Strict

1.  Create the permission.

    ```bash
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    -H 'Content-Type: application/json' \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:secrets  \
    -d '{"description":"Grants access to the contents of the Secrets tab"}'
    ```

1.  Grant the following privileges to the user `uid`.

    ```bash
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:secrets/users/<uid>/full
    ```

<p class="message--note"><strong>NOTE: </strong>To grant this permission to a group instead of a user, replace <code>/users/"uid"</code> with <code>/groups/"gid"</code>.</p>
