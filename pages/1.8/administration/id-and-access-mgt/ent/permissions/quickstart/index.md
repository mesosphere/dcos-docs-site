---
layout: layout.pug
navigationTitle:  Quickstart
title: Quickstart
menuWeight: 0
excerpt: >
  Learn how to grant users and groups
  permission to access one or more tabs in
  the DC/OS web interface using either the
  DC/OS web interface or the IAM API.
preview: true
enterprise: true
---

# About the quickstart

By default, a new user has no permissions and cannot view the DC/OS web interface at all. To give a user access to the DC/OS web interface, grant the user access to one or more of the following.

- [Services tab](#services-tab)
- [Jobs tab](#jobs-tab)
- [Network tab](#network-tab)
- [Universe tab](#universe-tab)
- [Dashboard and Nodes tab](#nodes-dash-tabs)


**Prerequisites:**

- A DC/OS user account with the `dcos:superuser` permission.

- A DC/OS user account without the `dcos:superuser` permission. If you do not have a user account without the `dcos:superuser` permission, see [adding local users](/1.8/administration/id-and-access-mgt/ent/users-groups/add-local-user/) or [adding external users](/1.8/administration/id-and-access-mgt/ent/users-groups/add-external-user/).

**Note:** The commands that follow will use a user named `alice`. If you have a group containing the user account without the `dcos:superuser` permission, you can replace `alice` with the name of the group to achieve the same effect.

# <a name="services-tab"></a>Granting access to the Services tab

## About granting access to the Services tab

This procedure describes how to grant a user access to the **Services** tab and all the services inside of it.

**Tip:** If you are running in `strict` or `permissive` [security mode](/1.8/administration/installing/ent/custom/configuration-parameters/#security) and don't want to give the user access to all of the services in the **Services** tab, see [Controlling user access to services](/1.8/administration/id-and-access-mgt/ent/permissions/service-groups/).

The steps to accomplish this vary based on your preferred method.

- [Via the DC/OS web interface](#services-access-via-ui)
- [Via the IAM API](#services-access-via-api)

## <a name="services-access-via-ui"></a>Via the DC/OS web interface

1. Log into the DC/OS web interface as a user with the `dcos:superuser` permission.

1. Click to open one of the following tabs:

    - **System** -> **Organization** -> **Users**
    - **System** -> **Organization** -> **Groups**

1. Click the name of the user or group that you wish to grant the permission to.

1. Click **Add Permission**.

1. Click **Insert Permission String** to toggle the dialog.

1. Copy and paste `dcos:adminrouter:service:marathon` into the **Object** field.

1. Type `full` in the **Action** field.

1. Click **Add Permission**.

1. To allow the user to view the **Task** tab, type `dcos:adminrouter:ops:mesos` in the **Object** field, type `full` in the **Action** field, and click **Add Permission**.

1. To allow the user to view task details, including the logs, type `dcos:adminrouter:ops:slave` in the **Object** field, type `full` in the **Action** field, and click **Add Permission**.

1. If your [security mode](/1.8/administration/installing/ent/custom/configuration-parameters/#security) is `permissive` or `strict`, type `dcos:service:marathon:marathon:services:/` in the **Object** field, type `full` in the **Action** field, and click **Add Permission**.

   **Note:** The above permission grants access to all services. To restrict which services a user can access, see [Controlling user access to services](/1.8/administration/id-and-access-mgt/ent/permissions/service-groups/).

1. If your [security mode](/1.8/administration/installing/ent/custom/configuration-parameters/#security) is `strict` and you want the user to be able to view task details, you must also perform the following steps.

     - Type `dcos:mesos:master:framework:role:slave_public` in the **Object** field, type `read` in the **Action** field, and click **Add Permission**.
     - Type `dcos:mesos:master:executor:app_id` in the **Object** field, type `read` in the **Action** field, and click **Add Permission**.
     - Type `dcos:mesos:master:task:app_id` in the **Object** field, type `read` in the **Action** field, and click **Add Permission**.
     - Type `dcos:mesos:agent:framework:role:slave_public` in the **Object** field, type `read` in the **Action** field, and click **Add Permission**.
     - Type `dcos:mesos:agent:executor:app_id` in the **Object** field, type `read` in the **Action** field, and click **Add Permission**.
     - Type `dcos:mesos:agent:task:app_id` in the **Object** field, type `read` in the **Action** field, and click **Add Permission**.
     - Type `dcos:mesos:agent:sandbox:app_id` in the **Object** field, type `read` in the **Action** field, and click **Add Permission**.

1. Click **Close**.

1. Log out and log back in as the user you just gave these permissions to. You should be able to view the DC/OS web interface and all the services in the **Services** tab. If you granted the user access to the task details and logs, you should be able to access these too.


## <a name="services-access-via-api"></a>Via the IAM API

**Prerequisites:**

- You must have the [DC/OS CLI installed](/1.8/usage/cli/install/) and be logged in as a superuser via `dcos auth login`.

- If your [security mode](/1.8/administration/installing/ent/custom/configuration-parameters/#security) is `permissive` or `strict`, you must follow the steps in [Obtaining and passing the DC/OS certificate in curl requests](/1.8/administration/tls-ssl/ent/get-cert/) before issuing the curl commands in this section. If your [security mode](/1.8/administration/installing/ent/custom/configuration-parameters/#security) is `disabled`, you must delete `--cacert dcos-ca.crt` from the commands before issuing them.

**Tips:**

- Service resources often include `/` characters that must be replaced with `%252F` in curl requests, as shown in the examples below.

- To grant a permission to a group instead of a user, replace `/users/alice` in the commands below with `/groups/<group-name>`, where `<group-name>` is the name of the group. The group must contain at least one user account without the `superuser` permission that you can use to verify your success.

**Note:** When using the API to manage permissions, you must create the permission before granting it. Sometimes, the permission may already exist. In this case, the API returns an informative message. You can regard this as a confirmation message and proceed to assign the permission.


1. In all [security modes](/1.8/administration/installing/ent/custom/configuration-parameters/#security), execute the following commands to create and grant permission to the **Services** tab.

   **To create the permission:**

   ```bash
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:service:marathon -d '{"description":"Grants access services managed by the native Marathon instance"}'
   ```

   **To grant the permission:**

   ```bash
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:service:marathon/users/alice/full
   ```

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

1. If your [security mode](/1.8/administration/installing/ent/custom/configuration-parameters/#security) is `permissive` or `strict`, execute the following commands to create and grant permission to access any service inside of the **Services** tab.

   **To create the permission:**

   ```bash
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:service:marathon:marathon:services:%252F -d '{"description":"Grants access to all services"}'
   ```

   **To grant the permission:**

   ```bash
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:service:marathon:marathon:services:%252F/users/alice/full
   ```

1. If your [security mode](/1.8/administration/installing/ent/custom/configuration-parameters/#security) is `strict`, and you want to allow the user to access task details and logs, execute the following commands to create and grant permission to the necessary Mesos resources.


   **To create the permissions:**

   ```bash
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:framework:role:slave_public -d '{"description":"Grants access to register as or view Mesos master information about frameworks registered with the slave_public role"}'
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:executor:app_id -d '{"description":"Grants access to all executors on the Mesos master"}'
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:task:app_id -d '{"description":"Grants access to all tasks on the Mesos master"}'
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:framework:role:slave_public -d '{"description":"Grants access to view Mesos agent information about frameworks registered with the slave_public role"}'
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:executor:app_id -d '{"description":"Grants access to all executors running on the Mesos agent"}'
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:task:app_id -d '{"description":"Grants access to all tasks running on the Mesos agent"}'
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:sandbox:app_id -d '{"description":"Grants access to the sandboxes on the Mesos agent"}'
   ```

   **To grant the permissions:**

   ```bash
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:framework:role:slave_public/users/alice/read
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:executor:app_id/users/alice/read
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:task:app_id/users/alice/read
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:framework:role:slave_public/users/alice/read
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:executor:app_id/users/alice/read
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:task:app_id/users/alice/read
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:sandbox:app_id/users/alice/read
   ```

1. Log out and log back in as the user you just gave these permissions to. You should be able to view the DC/OS web interface and all the services in the **Services** tab. If you granted the user access to the task details and logs, you should be able to access these too.

# <a name="jobs-tab"></a>Granting access to the Jobs tab

## About granting access to the Jobs tab

This procedure describes how to grant a user access to the **Jobs** tab and all the jobs inside of it.

**Tip:** If you don't want to give the user access to all of the jobs in the **Jobs** tab, see [Controlling user access to jobs](/1.8/administration/id-and-access-mgt/ent/permissions/job-groups/).

The steps to accomplish this vary based on your preferred method.

- [Via the DC/OS web interface](#jobs-access-via-ui)
- [Via the IAM API](#jobs-access-via-api)

## <a name="jobs-access-via-ui"></a>Via the DC/OS web interface

1. Log into the DC/OS web interface as a user with the `superuser` permission.

1. Click to open one of the following tabs:

    - **System** -> **Organization** -> **Users**
    - **System** -> **Organization** -> **Groups**

1. Click the name of the user or group that you wish to grant the permission to.

1. Click **Add Permission**.

1. Click **Insert Permission String** to toggle the dialog.

1. Copy and paste `dcos:adminrouter:service:metronome` into the **Object** field.

1. Type `full` in the **Action** field.

1. Click **Add Permission**.

1. To allow the user to view the **Task** tab, type `dcos:adminrouter:ops:mesos` in the **Object** field, type `full` in the **Action** field, and click **Add Permission**.

1. To allow the user to view task details, including the logs, type `dcos:adminrouter:ops:slave` in the **Object** field, type `full` in the **Action** field, and click **Add Permission**.

1. If your [security mode](/1.8/administration/installing/ent/custom/configuration-parameters/#security) is `permissive` or `strict`, type `dcos:service:metronome:metronome:jobs` in the **Object** field, type `full` in the **Action** field, and click **Add Permission**.

   **Note:** The above permission grants access to all jobs. To restrict which services a user can access, see [Controlling user access to jobs](/1.8/administration/id-and-access-mgt/ent/permissions/job-groups/).

1. If your [security mode](/1.8/administration/installing/ent/custom/configuration-parameters/#security) is `strict` and you want the user to be able to view task details, you must also perform the following steps.

     - Type `dcos:mesos:master:framework:role:*` in the **Object** field, type `read` in the **Action** field, and click **Add Permission**.
     - Type `dcos:mesos:master:executor:app_id` in the **Object** field, type `read` in the **Action** field, and click **Add Permission**.
     - Type `dcos:mesos:master:task:app_id` in the **Object** field, type `read` in the **Action** field, and click **Add Permission**.
     - Type `dcos:mesos:agent:framework:role:*` in the **Object** field, type `read` in the **Action** field, and click **Add Permission**.
     - Type `dcos:mesos:agent:executor:app_id` in the **Object** field, type `read` in the **Action** field, and click **Add Permission**.
     - Type `dcos:mesos:agent:task:app_id` in the **Object** field, type `read` in the **Action** field, and click **Add Permission**.
     - Type `dcos:mesos:agent:sandbox:app_id` in the **Object** field, type `read` in the **Action** field, and click **Add Permission**.

1. Click **Close**.

1. Log out and log back in as the user you just gave these permissions to. You should be able to view the DC/OS web interface and all the jobs in the **Jobs** tab. If you granted the user access to the task details and logs, you should be able to access these too.

## <a name="jobs-access-via-api"></a>Via the IAM API

**Prerequisites:**

- You must have the [DC/OS CLI installed](/1.8/usage/cli/install/) and be logged in as a superuser via `dcos auth login`.

- If your [security mode](/1.8/administration/installing/ent/custom/configuration-parameters/#security) is `permissive` or `strict`, you must follow the steps in [Obtaining and passing the DC/OS certificate in curl requests](/1.8/administration/tls-ssl/ent/get-cert/) before issuing the curl commands in this section. If your [security mode](/1.8/administration/installing/ent/custom/configuration-parameters/#security) is `disabled`, you must delete `--cacert dcos-ca.crt` from the commands before issuing them.

**Tip:** To grant a permission to a group instead of a user, replace `/users/alice` in the commands below with `/groups/<group-name>`, where `<group-name>` is the name of the group. The group must contain at least one user account without the `superuser` permission that you can use to verify your success.

**Note:** When using the API to manage permissions, you must create the permission before granting it. Sometimes, the permission may already exist. In this case, the API returns an informative message. You can regard this as a confirmation message and proceed to assign the permission.

1. In all [security modes](/1.8/administration/installing/ent/custom/configuration-parameters/#security), execute the following commands to create and grant permission to the **Jobs** tab and all the jobs in it.

   **To create the permissions:**

   ```bash
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:service:metronome -d '{"description":"Grants access to the Jobs tab"}'
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:service:metronome:metronome:jobs -d '{"description":"Grants access to all jobs"}'
   ```

   **To grant the permissions:**

   ```bash
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:service:metronome/users/alice/full
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:service:metronome:metronome:jobs/users/alice/full
   ```

   **Note:** The `dcos:service:metronome:metronome:jobs` permission grants access to all jobs. To restrict which jobs a user can access, see [Controlling user access to jobs](/1.8/administration/id-and-access-mgt/ent/permissions/job-groups/).

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

1. If your [security mode](/1.8/administration/installing/ent/custom/configuration-parameters/#security) is `strict`, and you want to allow the user to access task details and logs, execute the following commands to create and grant permission to the necessary Mesos resources.


   **To create the permissions:**

   ```bash
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:framework:role:* -d '{"description":"Grants access to register as or view Mesos master information about frameworks registered with the Mesos default role"}'
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:executor:app_id -d '{"description":"Grants access to all executors on the Mesos master"}'
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:task:app_id -d '{"description":"Grants access to all tasks on the Mesos master"}'
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:framework:role:* -d '{"description":"Grants access to view Mesos agent information about frameworks registered with the Mesos default role"}'
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:executor:app_id -d '{"description":"Grants access to all executors running on the Mesos agent"}'
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:task:app_id -d '{"description":"Grants access to all tasks running on the Mesos agent"}'
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:sandbox:app_id -d '{"description":"Grants access to the sandboxes on the Mesos agent"}'
   ```

   **To grant the permissions:**

   ```bash
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:framework:role:*/users/alice/read
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:executor:app_id/users/alice/read
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:task:app_id/users/alice/read
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:framework:role:*/users/alice/read
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:executor:app_id/users/alice/read
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:task:app_id/users/alice/read
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:sandbox:app_id/users/alice/read
   ```

1. Log into the DC/OS web interface as the user you just granted these permissions to. You should be able to view the DC/OS web interface and all the jobs in the **Jobs** tab. If you granted the user access to the task details and logs, you should be able to access these too.

# <a name="network-tab"></a>Granting access to the Network tab

## About granting access to the Network tab

This procedure describes how to grant a user access to the **Networking** tab.

The steps to accomplish this vary based on your preferred method.

- [Via the DC/OS web interface](#network-access-via-ui)
- [Via the IAM API](#network-access-via-api)

## <a name="network-access-via-ui"></a>Via the DC/OS web interface

1. Log into the DC/OS web interface as a user with the `superuser` permission.

1. Click to open one of the following tabs:

    - **System** -> **Organization** -> **Users**
    - **System** -> **Organization** -> **Groups**

1. Click the name of the user or group that you wish to grant the permission to.

1. Click **Add Permission**.

1. Click **Insert Permission String** to toggle the dialog.

1. Copy and paste `dcos:adminrouter:ops:networking` into the **Object** field.

1. Type `full` in the **Action** field.

1. Click **Add Permission**.

1. Copy and paste `dcos:adminrouter:ops:mesos` into the **Object** field.

1. Type `full` in the **Action** field.

1. Click **Add Permission**.

1. Click **Close**.

1. Log out and log back in as the user you just gave these permissions to. You should be able to view the DC/OS web interface, the **Networking** tab, and the contents of the **Networking** tab.


## <a name="network-access-via-api"></a>Via the IAM API

**Prerequisites:**

- You must have the [DC/OS CLI installed](/1.8/usage/cli/install/) and be logged in as a superuser via `dcos auth login`.

- If your [security mode](/1.8/administration/installing/ent/custom/configuration-parameters/#security) is `permissive` or `strict`, you must follow the steps in [Obtaining and passing the DC/OS certificate in curl requests](/1.8/administration/tls-ssl/ent/get-cert/) before issuing the curl commands in this section. If your [security mode](/1.8/administration/installing/ent/custom/configuration-parameters/#security) is `disabled`, you must delete `--cacert dcos-ca.crt` from the commands before issuing them.

**Note:** When using the API to manage permissions, you must first create the permission and then assign it. Sometimes, the permission may already exist. In this case, the API returns an informative message. You can regard this as a confirmation message and proceed to assign the permission.

1. Use the following command to create the permission. The permission may already exist. If so, the API returns an informative message. You can regard this as a confirmation message and continue to the next step.

   ```bash
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:networking -d '{"description":"Grants access to the contents of the Network tab"}'
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:mesos -d '{"description":"Grants access to the Mesos master API/UI and task details"}'
   ```

1. Use the following command to assign the permission to a user named `alice`.

   ```bash
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:networking/users/alice/full
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:mesos/users/alice/full
   ```

   **Tip:** To grant this permission to a group instead of a user, replace `/users/alice` in the commands above with `/groups/<group-name>`, where `<group-name>` is the name of the group. The group must contain at least one user account without the `superuser` permission that you can use to verify your success.

1. Log into the DC/OS web interface as the user you just granted these permissions to. You should be able to view the DC/OS web interface, the **Networking** tab, and the contents of the **Networking** tab.


# <a name="universe-tab"></a>Granting access to the Universe tab

## About granting access to the Universe tab

**Prerequisite:** If you want the user to be able to install a service from the Universe, you must also grant the user or group access to the [Services tab](#services-tab).

This procedure describes how to grant a user access to the **Universe** tab.

The steps to accomplish this vary based on your preferred method.

- [Via the DC/OS web interface](#universe-access-via-ui)
- [Via the IAM API](#universe-access-via-api)

## <a name="universe-access-via-ui"></a>Via the DC/OS web interface

1. Log into the DC/OS web interface as a user with the `dcos:superuser` permission.

1. Click to open one of the following tabs:

    - **System** -> **Organization** -> **Users**
    - **System** -> **Organization** -> **Groups**

1. Click the name of the user or group that you wish to grant the permission to.

1. Click **Add Permission**.

1. Click **Insert Permission String** to toggle the dialog.

1. Copy and paste `dcos:adminrouter:package` into the **Object** field.

1. Type `full` in the **Action** field.

1. Click **Add Permission**.

1. Click **Close**.

1. Log out and log back in as the user you just gave these permissions to. You should be able to view the DC/OS web interface, the **Universe** tab, and the contents of the **Universe** tab.




## <a name="universe-access-via-api"></a>Via the IAM API

**Prerequisites:**

- You must have the [DC/OS CLI installed](/1.8/usage/cli/install/) and be logged in as a superuser via `dcos auth login`.

- If your [security mode](/1.8/administration/installing/ent/custom/configuration-parameters/#security) is `permissive` or `strict`, you must follow the steps in [Obtaining and passing the DC/OS certificate in curl requests](/1.8/administration/tls-ssl/ent/get-cert/) before issuing the curl commands in this section. If your [security mode](/1.8/administration/installing/ent/custom/configuration-parameters/#security) is `disabled`, you must delete `--cacert dcos-ca.crt` from the commands before issuing them.

**Note:** When using the API to manage permissions, you must first create the permission and then assign it. Sometimes, the permission may already exist. In this case, the API returns an informative message. You can regard this as a confirmation message and proceed to assign the permission.

1. Use the following command to create the permission.

   ```bash
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:package -d '{"description":"Grants access to the Universe tab"}'
   ```

1. Use the following command to assign the permission to a user named `alice`.

   ```bash
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:package/users/alice/full
   ```

   **Tip:** To grant this permission to a group instead of a user, replace `/users/alice` in the commands above with `/groups/<group-name>`, where `<group-name>` is the name of the group. The group must contain at least one user account without the `superuser` permission that you can use to verify your success.

1. Log into the DC/OS web interface as the user you just granted these permissions to. You should be able to view the DC/OS web interface, the **Packages** tab, and the contents of the **Packages** tab.


# <a name="nodes-dash-tabs"></a>Granting access to the Dashboard and Nodes tabs

## About granting access to the Dashboard and Nodes tabs

Only users with the `superuser` permission can see the **Nodes** and **Dashboard** options in the left menu.

However, any user with access to DC/OS web interface can view the **Nodes** tab at `http[s]://<cluster-url>/#/nodes` and the **Dashboard** tab at `http[s]://<cluster-url>/#/dashboard`.

They will not be able to view any data inside of these tabs without being granted several permissions. To give a user access to the data inside the **Nodes** and **Dashboard** tabs, complete the procedure in this section.

**Important:** Granting a user access to the **Dashboard** and **Nodes** tabs also gives them read-only access to all task information across the cluster. Such users should be highly trusted.

The steps to accomplish this vary based on your preferred method.

- [Via the DC/OS web interface](#nodes-dash-access-via-ui)
- [Via the IAM API](#nodes-dash-access-via-api)

## <a name="nodes-dash-access-via-ui"></a>Via the DC/OS web interface

1. Log into the DC/OS web interface as a user with the `superuser` permission.

1. Click to open one of the following tabs:

    - **System** -> **Organization** -> **Users**
    - **System** -> **Organization** -> **Groups**

1. Click the name of the user or group that you wish to grant the permission to.

1. Click **Add Permission**.

1. Click **Insert Permission String** to toggle the dialog.

1. Copy and paste `dcos:adminrouter:ops:historyservice` into the **Object** field.

1. Type `full` in the **Action** field.

1. Click **Add Permission**.

1. Copy and paste `dcos:adminrouter:ops:system-health` into the **Object** field.

1. Type `full` in the **Action** field.

1. Click **Add Permission**.

1. Click **Close**.

1. Log out and log back in as the user you just gave these permissions to. You should be able to view the **Nodes** tab and its contents at `http[s]://<cluster-url>/#/nodes`. You should also be able to view the **Dashboard** tab and its contents at `http[s]://<cluster-url>/#/dashboard`.


## <a name="nodes-dash-access-via-api"></a>Via the IAM API

**Prerequisites:**

- You must have the [DC/OS CLI installed](/1.8/usage/cli/install/) and be logged in as a superuser via `dcos auth login`.

- If your [security mode](/1.8/administration/installing/ent/custom/configuration-parameters/#security) is `permissive` or `strict`, you must follow the steps in [Obtaining and passing the DC/OS certificate in curl requests](/1.8/administration/tls-ssl/ent/get-cert/) before issuing the curl commands in this section. If your [security mode](/1.8/administration/installing/ent/custom/configuration-parameters/#security) is `disabled`, you must delete `--cacert dcos-ca.crt` from the commands before issuing them.

**Note:** When using the API to manage permissions, you must first create the permission and then assign it. Sometimes, the permission may already exist. In this case, the API returns an informative message. You can regard this as a confirmation message and proceed to assign the permission.

1. Use the following command to create the permissions.

   ```bash
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:historyservice -d '{"description":"Grants access to History Service resources"}'
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:system-health -d '{"description":"Grants access to system health resources"}'
   ```

1. Use the following command to assign the permissions to a user named `alice`.

   ```bash
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/adminrouter:ops:historyservice/users/alice/full
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:ops:system-health/users/alice/full
   ```

   **Tip:** To grant this permission to a group instead of a user, replace `/users/alice` in the commands above with `/groups/<group-name>`, where `<group-name>` is the name of the group. The group must contain at least one user account without the `superuser` permission that you can use to verify your success.


1. Log into the DC/OS web interface as the user you just gave these permissions to. You should be able to view the **Nodes** tab and its contents at `http[s]://<cluster-url>/#/nodes`. You should also be able to view the **Dashboard** tab and its contents at `http[s]://<cluster-url>/#/dashboard`.
