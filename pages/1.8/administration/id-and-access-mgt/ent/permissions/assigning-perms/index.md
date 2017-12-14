---
layout: layout.pug
navigationTitle:  Assigning permissions
title: Assigning permissions
menuWeight: 800
excerpt: >
  This topic describes how to assign a
  permission using either the DC/OS web
  interface or the IAM API.
preview: true
enterprise: true
---





# About assigning permissions

To assign permissions:

1. [Obtain the strings that correspond to the permission/action you want to assign.](#get-perm-strings)

2. Assign the permission:

    - [Via the DC/OS user interface](#assign-perm-via-ui)
    - [Via the API](#assign-perm-via-api)

# <a name="get-perm-strings"></a>Obtaining the permission strings

Refer to the following sections to determine and obtain the permission strings that you need.

- [Admin Router permissions](/1.8/administration/id-and-access-mgt/permissions/admin-router-perms/)
- [User service permissions](/1.8/administration/id-and-access-mgt/permissions/user-service-perms/)
- [Secret Store service permissions](/1.8/administration/id-and-access-mgt/permissions/secrets-perms/)
- [Mesos master and agent permissions](https://docs.mesosphere.com/1.8/administration/id-and-access-mgt/permissions/master-agent-perms/)
- [Superuser permission](/1.8/administration/id-and-access-mgt/permissions/superuser-perm/)

# <a name="assign-perm-via-ui"></a>Assigning permissions via the DC/OS web interface

**Note:** When using the DC/OS web interface to manage permissions, you can create and assign the permission in one step.

1. Log into the DC/OS web interface as a user with `superuser` permissions.

2. Click to open one of the following:

    - **System** -> **Organization** -> **Users** tab
    - **System** -> **Organization** -> **Groups** tab

3. Click the name of the user or group you want to assign the permission to.

4. Click **Add Permission**.

5. Click **Insert Permission String** to toggle the dialog.

6. Paste the permission string into the **Object** field.

7. Paste the action string into the adjacent field.

8. Click **Add Permission**.

9. Click **Close**.

10. Log out and log back in as your new user to verify the permissions.


# <a name="assign-perm-via-api"></a>Assigning permissions via the API

**Note:** When managing permissions via the API, you must first create the permission and then assign it. Sometimes the permission may already exist. In this event, the API returns an informative message and you can proceed to assign it.

**Prerequisites:**

- You must have the [DC/OS CLI installed](/1.8/usage/cli/install/) and be logged in as a superuser via `dcos auth login`.

- If your [security mode](/1.8/administration/installing/ent/custom/configuration-parameters/#security) is `permissive` or `strict`, you must follow the steps in [Obtaining and passing the DC/OS certificate in curl requests](/1.8/administration/tls-ssl/get-cert/) before issuing the curl commands in this section. If your [security mode](/1.8/administration/installing/ent/custom/configuration-parameters/#security) is `disabled`, you must delete `--cacert dcos-ca.crt` from the commands before issuing them.

1. You must first create the permission, as shown in the following example.

   ```bash
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/<resource-string> -d '{"description":"<description>"}' -H 'Content-Type: application/json'
   ```

1. Use one of the following curl commands to grant the permission.

     * **To a user:**

     ```bash
     curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/<resource-string>/users/<user-name>/<action-string>
     ```

     * **To a group:**

     ```bash
     curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/<resource-string>/groups/<group-name>/<action-string>
     ```
