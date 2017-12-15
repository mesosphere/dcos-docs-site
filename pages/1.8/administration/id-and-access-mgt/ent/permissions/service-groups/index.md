---
layout: layout.pug
navigationTitle:  Controlling user access to services
title: Controlling user access to services
menuWeight: 100
excerpt: "Learn how to achieve fine-grained control over a user's access to services using either the DC/OS web interface or the API."
preview: true
enterprise: true
---

# About controlling user access to services

Service groups allow you to restrict user access to services. Only users with the permission that corresponds to the service group can access the services inside of it. This section walks you through the steps for creating a service group and granting a user access to it.

**Important:** This section is not relevant to `disabled` mode clusters. In `disabled` mode you either give a user or group access to the entire **Services** tab or you do not. `disabled` mode does not offer the finer-grained controls of `permissive` and `strict` modes.

Refer to the section that corresponds to your desired interface.

- [Via the DC/OS web interface](#serv-group-access-via-ui)
- [Via the IAM API](#serv-group-access-via-api)

**Prerequisites:**

- A DC/OS user account with the `dcos:superuser` permission.

- A DC/OS user account without the `dcos:superuser` permission and without the `dcos:service:marathon:marathon:services:/` permission. If you do not have a user account without these permissions, see [adding local users](/1.8/administration/id-and-access-mgt/users-groups/add-local-user/) or [adding external users](/1.8/administration/id-and-access-mgt/users-groups/add-external-user/).



# <a name="serv-group-access-via-ui"></a>Via the DC/OS user interface

1. Log into the DC/OS user interface as a user with the `dcos:superuser` permission.

1. Click to open the **Services** tab.

1. Click **Create Group**.

1. Type a name for your new service group and click **Create Group**. In this example, we will use a service group named `/core-dev`.

1. Click to open the **System** -> **Organization** -> **Users** tab.

1. Click the name of your new user.

1. Click **Add Permission**.

1. Click **Insert Permission String** to toggle the dialog.

1. Copy and paste `dcos:adminrouter:service:marathon` into the **Object** field.

1. Type `full` in the **Action** field.

1. Click **Add Permission**.

1. Copy and paste the following string into the **Object** field: `dcos:service:marathon:marathon:services:/core-dev`.

1. Type the operation you wish to permit in the **Action** field: `create`, `read`, `update`, or `delete`. Type `full` to allow all of the operations.

1. Click **Add Permission**.

1. To allow the user to view the **Task** tab, type `dcos:adminrouter:ops:mesos` in the **Object** field, type `full` in the **Action** field, and click **Add Permission**.

1. To allow the user to view task details, including the logs, type `dcos:adminrouter:ops:slave` in the **Object** field, type `full` in the **Action** field, and click **Add Permission**.

1. If you are running in `strict` mode and you want the user to be able to view task details and logs, you must also perform the following steps.

     - Type `dcos:mesos:master:framework:role:slave_public` in the **Object** field, type `read` in the **Action** field, and click **Add Permission**.
     - Type `dcos:mesos:master:executor:app_id:/core-dev` in the **Object** field, type `read` in the **Action** field, and click **Add Permission**.
     - Type `dcos:mesos:master:task:app_id:/core-dev` in the **Object** field, type `read` in the **Action** field, and click **Add Permission**.
     - Type `dcos:mesos:agent:framework:role:slave_public` in the **Object** field, type `read` in the **Action** field, and click **Add Permission**.
     - Type `dcos:mesos:agent:executor:app_id:/core-dev` in the **Object** field, type `read` in the **Action** field, and click **Add Permission**.
     - Type `dcos:mesos:agent:task:app_id:/core-dev` in the **Object** field, type `read` in the **Action** field, and click **Add Permission**.
     - Type `dcos:mesos:agent:sandbox:app_id:/core-dev` in the **Object** field, type `read` in the **Action** field, and click **Add Permission**.

1. Click **Close**.

1. Take a look over the permissions and make sure they correspond to the ones that you wanted to add.

1. Log out and log back in as your new user to verify the permissions. The user should now have the designated level of access to the `core-dev` group inside the **Services** tab.

## <a name="serv-group-access-via-api"></a>Via the IAM API

**Prerequisites:**

- You must have the [DC/OS CLI installed](/1.8/usage/cli/install/) and be logged in as a superuser via `dcos auth login`.

- If your [security mode](/1.8/administration/installing/ent/custom/configuration-parameters/#security) is `permissive` or `strict`, you must follow the steps in [Obtaining and passing the DC/OS certificate in curl requests](/1.8/administration/tls-ssl/get-cert/) before issuing the curl commands in this section. If your [security mode](/1.8/administration/installing/ent/custom/configuration-parameters/#security) is `disabled`, you must delete `--cacert dcos-ca.crt` from the commands before issuing them.

**Notes:**

- When using the API to manage permissions, you must first create the permission and then assign it. Sometimes, the permission may already exist. In this case, the API returns an informative message and you can then proceed to assign the permission.

- The commands that follow will use a user named `alice`. If you have a group containing the user account without the `dcos:superuser` and `dcos:service:marathon:marathon:services:/` permissions, you can replace `alice` with the name of the group to achieve the same effect.

- Service group names include `/` characters that must be replaced with `%252F`, as shown in the examples below.

1. Use the following command to create a new service group called `core-dev`.

   ```bash
   curl -X POST --cacert dcos-ca.crt $(dcos config show core.dcos_url)/service/marathon/v2/groups -d '{"id":"core-dev"}' -H "Content-type: application/json" -H "Authorization: token=$(dcos config show core.dcos_acs_token)"
   ```

1. Use the following commands to create the required permissions.

   ```bash
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:service:marathon -d '{"description":"Controls access to Marathon services"}'
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:service:marathon:marathon:services:%252Fcore-dev -d '{"description":"Controls access to a service, job, service group, or job group named core-dev"}'
   ```

1. Use the following commands to grant the permissions to `alice`.

   ```bash
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:service:marathon/users/alice/full
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:service:marathon:marathon:services:%252Fcore-dev/users/alice/full
   ```

   **Note:** To give the user a different level of access, replace `full` with the desired access level: `create`, `read`, `update`, or `delete`.

   **Tip:** To grant this permission to a group instead of just one user, replace `/users/alice` in the command above with `/groups/<group-name>`, where `<group-name>` is the name of the group.

1. If you also want to allow the user to access task details and logs, execute the following commands to create and grant permission to the Mesos master and agent.

   **To create the permissions:**

   ```bash
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:mesos -d '{"description":"Grants access to the Mesos master API/UI and task details"}'
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:slave -d '{"description":"Grants access to the Mesos agent API/UI and task details such as logs"}'
   ```

   **To grant the permissions:**

   ```bash
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:mesos/users/alice/full
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:slave/users/alice/full
   ```


1. If your cluster is running in `strict` mode and you want to provide the user or group access to the task details and logs, you must also issue the following commands.

   ```bash
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:framework:role:slave_public -d '{"description":"Controls access to frameworks registered with the slave_public role"}'
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:framework:role:slave_public/users/alice/read
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:executor:app_id:%252Fcore-dev -d '{"description":"Controls access to executors running inside the core-dev service group"}'
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:executor:app_id:%252Fcore-dev/users/alice/read
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:task:app_id:%252Fcore-dev -d '{"description":"Controls access to tasks running inside the core-dev service group"}'
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:task:app_id:%252Fcore-dev/users/alice/read
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:framework:role:slave_public -d '{"description":"Controls access to information about frameworks registered under the slave_public role"}'
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:framework:role:slave_public/users/alice/read
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:executor:app_id:%252Fcore-dev -d '{"description":"Controls access to executors running inside the core-dev service group"}'
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:executor:app_id:%252Fcore-dev/users/alice/read
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:task:app_id:%252Fcore-dev -d '{"description":"Controls access to tasks running inside the core-dev service group"}'
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:task:app_id:%252Fcore-dev/users/alice/read
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:sandbox:app_id:%252Fcore-dev -d '{"description":"Controls access to the sandboxes inside the core-dev service group"}'
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:sandbox:app_id:%252Fcore-dev/users/alice/read
   ```

   **Tip:** To grant this permission to a group instead of a user, replace `/users/alice` in the commands above with `/groups/<group-name>`, where `<group-name>` is the name of the group.

1. Log out and log back in as your new user to verify the permissions. The user should now have the designated level of access to the `core-dev` folder inside the **Services** tab.
