---
layout: layout.pug
navigationTitle:  Controlling user access to jobs
title: Controlling user access to jobs
menuWeight: 200
excerpt: "Learn how to achieve fine-grained control over a user's access to jobs using either the DC/OS web interface or the API."
preview: true
enterprise: true
---


# About controlling user access to jobs

The [Metronome permissions](/1.8/administration/id-and-access-mgt/permissions/user-service-perms/#metronome) allow you to restrict a user's access to jobs on either a per job or a per job group basis. This section walks you through the steps to accomplish this.

**Important:** This section is not relevant to `disabled` mode clusters. In `disabled` mode you either give a user or group access to all jobs or you do not. `disabled` mode does not offer the finer-grained controls of `permissive` and `strict` modes.

Refer to the section that corresponds to your desired interface.

- [Via the DC/OS web interface](#job-group-access-via-ui)
- [Via the IAM API](#job-group-access-via-api)

**Prerequisites:**

- A DC/OS user account with the `dcos:superuser` permission.

- A DC/OS user account without the following permissions: `dcos:superuser`, `dcos:adminrouter:service:metronome`, and `dcos:service:metronome:metronome:jobs`. We call this user the unprivileged user or `alice`. If you do not have a user account without these permissions, see [adding local users](/1.8/administration/id-and-access-mgt/users-groups/add-local-user/) or [adding external users](/1.8/administration/id-and-access-mgt/users-groups/add-external-user/).

**Note:** The commands that follow will use a user named `alice`. If you have a group containing the user account without the `dcos:superuser`, `dcos:adminrouter:service:metronome`, and `dcos:service:metronome:metronome:jobs` permissions, you can replace `alice` with the name of the group to achieve the same effect.


# <a name="job-group-access-via-ui"></a>Controlling user access to jobs via the DC/OS web interface

1. Log into the DC/OS web interface as a user with the `dcos:superuser` permission.

1. Click to open the **Jobs** tab.

1. Click **Create Job**.

1. Within the **ID** field, type a name for the job that includes a group. For the purposes of this exercise, let's use `dev.batch.job1`. In this example, `job1` represents the name of the job itself. The job is nested inside a group called `batch`, which is nested inside a group called `dev`.

1. Type a shell command of some kind in the **Command** field, such as `sleep 1000`, and click **Create Job**.

1. Click `New Job` to create another job.

1. Within the **ID** field, type `dev.batch.job2`.

1. Type `sleep 1000` in the **Command** field, and click **Create Job**.

1. Click to open the new `dev` parent directory, the new `batch` subdirectory, and the new `job1` job.

1. Click **Run Now** to start `job1`.

1. Use the back button of your browser to navigate to the previous view and click to open the `job2` job.

1. Click **Run Now** to start `job2`.

1. Click to open one of the following tabs:

    - **System** -> **Organization** -> **Users**
    - **System** -> **Organization** -> **Groups**

1. Click the name of the user or group of users that you wish to grant the permission to.

1. Click **Add Permission**.

1. Click **Insert Permission String** to toggle the dialog.

1. Copy and paste the following string into the **Object** field: `dcos:adminrouter:service:metronome`. Type `full` in the **Action** field.

1. Click **Add Permission**.

1. Copy and paste the following string into the **Object** field: `dcos:service:metronome:metronome:jobs:dev.batch.job1`.

1. Type the operation you wish to permit in the **Action** field: `create`, `read`, `update`, or `delete`. Type `full` to allow all of the operations.

1. Click **Add Permission**.

1. To allow the user to view the **Task** tab, type `dcos:adminrouter:ops:mesos` in the **Object** field, type `full` in the **Action** field, and click **Add Permission**.

1. To allow the user to view task details, including the logs, type `dcos:adminrouter:ops:slave` in the **Object** field, type `full` in the **Action** field, and click **Add Permission**.

1. If you are running in `strict` mode and you want the user to be able to view task details and logs, you must also perform the following steps.

     - Type `dcos:mesos:master:framework:role:*` in the **Object** field, type `read` in the **Action** field, and click **Add Permission**.
     - Type `dcos:mesos:master:executor:app_id:dev/batch/job1` in the **Object** field, type `read` in the **Action** field, and click **Add Permission**.
     - Type `dcos:mesos:master:task:app_id:dev/batch/job1` in the **Object** field, type `read` in the **Action** field, and click **Add Permission**.
     - Type `dcos:mesos:agent:framework:role:*` in the **Object** field, type `read` in the **Action** field, and click **Add Permission**.
     - Type `dcos:mesos:agent:executor:app_id:dev/batch/job1` in the **Object** field, type `read` in the **Action** field, and click **Add Permission**.
     - Type `dcos:mesos:agent:task:app_id:dev/batch/job1` in the **Object** field, type `read` in the **Action** field, and click **Add Permission**.
     - Type `dcos:mesos:agent:sandbox:app_id:dev/batch/job1` in the **Object** field, type `read` in the **Action** field, and click **Add Permission**.

1. Click **Close**.

1. Log out and log back in as your new user to verify the permissions. The user should now have the designated level of access to `dev/batch/job1` inside the **Jobs** tab.

**Next:**

- Remove `/job1` from the permissions and observe that this gives the user access to both jobs.


# <a name="job-group-access-via-api"></a>Controlling user access to jobs via the IAM API

**Prerequisites:**

- You must have the [DC/OS CLI installed](/1.8/usage/cli/install/) and be logged in as a superuser via `dcos auth login`.

- If your [security mode](/1.8/administration/installing/ent/custom/configuration-parameters/#security) is `permissive` or `strict`, you must follow the steps in [Obtaining and passing the DC/OS certificate in curl requests](/1.8/administration/tls-ssl/ent/get-cert/) before issuing the curl commands in this section. If your [security mode](/1.8/administration/installing/ent/custom/configuration-parameters/#security) is `disabled`, you must delete `--cacert dcos-ca.crt` from the commands before issuing them.

**Note:** When using the API to manage permissions, you must first create the permission and then assign it. Sometimes, the permission may already exist. In this case, the API returns an informative message and you can then proceed to assign the permission.

1. Use the following command to create a new job called `campaign1` inside a job group called `marketing.email`.

   ```bash
   curl -X POST --cacert dcos-ca.crt $(dcos config show core.dcos_url)/service/metronome/v1/jobs -d '{"id":"marketing.email.campaign1","run":{"cmd":"sleep 1000","cpus":0.01,"mem":32,"disk":0}}' -H "Content-type: application/json" -H "Authorization: token=$(dcos config show core.dcos_acs_token)"
   ```

1. Use the following command to create another new job called `campaign2` inside the same `marketing.email` job group.

   ```bash
   curl -X POST --cacert dcos-ca.crt $(dcos config show core.dcos_url)/service/metronome/v1/jobs -d '{"id":"marketing.email.campaign2","run":{"cmd":"sleep 1000","cpus":0.01,"mem":32,"disk":0}}' -H "Content-type: application/json" -H "Authorization: token=$(dcos config show core.dcos_acs_token)"
   ```

1. Use the following commands to create the required permissions.

   ```bash
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:service:metronome -d '{"description":"Controls access to Metronome services"}'
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:service:metronome:metronome:jobs:marketing.email.campaign1 -d '{"description":"Controls access to marketing.email.campaign1"}'
   ```

1. Grant the new permission that controls access to `marketing.email.campaign1` to your user.

   ```bash
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:adminrouter:service:metronome/users/alice/full
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:service:metronome:metronome:jobs:marketing.email.campaign1/users/alice/full
   ```

   **Note:** This curl gives the user full access to `marketing.email.campaign1`. To restrict the user's level of access, replace `full` in the command with the desired access level: `create`, `read`, `update`, or `delete`.

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
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:framework:role:* -d '{"description":"Controls access to frameworks registered with the Mesos default role"}'
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:framework:role:*/users/alice/read
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:executor:app_id:%252Fmarketing%252Femail%252Fcampaign1 -d '{"description":"Controls access to executors running inside marketing.email.campaign1"}'
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:executor:app_id:%252Fmarketing%252Femail%252Fcampaign1/users/alice/read
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:task:app_id:%252Fmarketing%252Femail%252Fcampaign1 -d '{"description":"Controls access to tasks running inside marketing.email.campaign1"}'
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:task:app_id:%252Fmarketing%252Femail%252Fcampaign1/users/alice/read
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:framework:role:* -d '{"description":"Controls access to information about frameworks registered under the Mesos default role"}'
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:framework:role:*/users/alice/read
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:executor:app_id:%252Fmarketing%252Femail%252Fcampaign1 -d '{"description":"Controls access to executors running inside marketing.email.campaign1"}'
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:executor:app_id:%252Fmarketing%252Femail%252Fcampaign1/users/alice/read
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:task:app_id:%252Fmarketing%252Femail%252Fcampaign1 -d '{"description":"Controls access to tasks running inside marketing.email.capaign1"}'
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:task:app_id:%252Fmarketing%252Femail%252Fcampaign1/users/alice/read
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -H 'Content-Type: application/json' $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:sandbox:app_id:%252Fmarketing%252Femail%252F -d '{"description":"Controls access to the sandboxes of marketing.email.campaign1"}'
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:agent:sandbox:app_id:%252Fmarketing%252Femail%252Fcampaign1/users/alice/read
   ```

   **Tip:** To grant this permission to a group instead of a user, replace `/users/alice` in the commands above with `/groups/<group-name>`, where `<group-name>` is the name of the group.


1. Log out and log back in as your new user to verify the permissions. The user should now have the designated level of access to `marketing.email.campaign1` in the **Jobs** tab.

**Next:**

- Remove `campaign1` from the permissions and observe that the user has access to both jobs inside of `marketing.email`.
