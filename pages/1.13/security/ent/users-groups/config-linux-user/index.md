---
layout: layout.pug
navigationTitle:  Overriding the default Linux user
title: Overriding the default Linux user
menuWeight: 31
excerpt: Overriding the default Linux user 
enterprise: true
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->

The default Linux user of a service or job can vary according to the security mode and the container type. See [Linux users](/1.13/security/ent/#linux-users) for more information.

The procedure for overriding the default Linux user varies by the type of service or job.

- [Overriding the default Linux user of a Universe service](#universe)
- [Overriding the default user of a service via Marathon app definition](#marathon-app-def)
- [Overriding the default user of a job via Metronome job definition](#metronome-job-def)

# <a name="universe"></a>Overriding the default Linux user of a Universe service

Many Universe services ignore overrides of their user accounts except in `strict` mode. We provide detailed steps for overriding the default Linux user for services that support this in [Service Accounts](/1.13/security/ent/service-auth/). Refer to the section that pertains to the service of interest for step-by-step instructions. The procedures also include how to configure the service to use encryption and service accounts.

Remember to grant permission to perform the `create` action on the `dcos:mesos:master:task:user[:<linux-user-name>]` resource to the service account user that the Universe service is launched with. See [Mesos Permissions](https://docs.mesosphere.com/1.12/security/ent/perms-reference/#mesos-permissions) for more information.

# <a name="marathon-app-def"></a>Overriding the default Linux user via Marathon app definition

Marathon app definitions provide a `"user"` key which you can use to override the default Linux user. **Tip:** Reference the [Marathon documentation](/1.13/deploying-services/creating-services/) for more details on writing Marathon services.

The following tutorial will demonstrate how ownership works in action. Before you begin, make sure that:

- The Linux user account already exists on the agent.
- You have installed and are logged into the [DC/OS CLI](/1.13/cli/).
- You must follow the steps in [Downloading the Root Cert](/1.13/security/ent/tls-ssl/get-cert/) before issuing the curl commands in this section. 
- You have granted permission to perform the `create` action on the `dcos:mesos:master:task:user:<linux-user-name>` resource to the `dcos_marathon` DC/OS service account user.

Once you have met these prerequisites, complete the following steps to override the default Linux user.

1. Create a Marathon app definition and save it with an informative name such as `myservice.json`. The following service will write the name of the user it's running under to the logs, create a new file, and fetch the Mesosphere logo from dcos.io.

  ```json
  {
    "id": "linux-user-override",
    "cmd": "whoami && tee file && sleep 1000",
    "user": "<your-test-user-account>",
    "uris": [
        "/1.12/img/logos/mesosphere.svg"
    ]
  }
  ```
<p class="message--important"><strong>IMPORTANT: </strong> Do not forget to replace "your-test-user-account" with the name of a Linux user who exists on the agent and differs from the default.</p>

1. Deploy the service using the [Marathon API](/1.13/deploying-services/marathon-api/).

  ```bash
curl -X POST --cacert dcos-ca.crt $(dcos config show core.dcos_url)/service/marathon/v2/apps -d @myservice.json -H "Content-type: application/json" -H "Authorization: token=$(dcos config show core.dcos_acs_token)"
  ```


1. Check the **Services** tab of the DC/OS web interface to confirm that your app has successfully been created.

1. Click your service and then click the **Configuration** tab.

1. Scroll down to see the Linux user account that you specified as the value of **User**.

1. Click the **Tasks** tab. By this time, your service should have succeeded in deploying. Click the task name.

1. Click the **Files** tab.

1. Observe the Linux user name that you passed in as the **OWNER** of the fetched and created files.

1. Click to open the **stdout** file.

1. Scroll to the bottom and you should see the results of the `whoami` command, i.e., the name of the user your task is running under.

# <a name="metronome-job-def"></a>Overriding the default Linux user via Metronome job definition

Metronome job definitions provide a `"user"` key which you can use to override the default Linux user.

<p class="message--note"><strong>NOTE: </strong>Refer to the <a href="/1.12/deploying-jobs/quickstart/">Jobs documentation</a> for more information about creating and deploying jobs.</p>


The following procedure will walk you through a quick tutorial to demonstrate how the ownership works in action. Before you begin, make sure that:

- The Linux user account already exists on the agent.
- You have installed and are logged into the [DC/OS CLI](/1.13/cli/).
- You must follow the steps in [Downloading the Root Cert](/1.13/security/ent/tls-ssl/get-cert/) before issuing the curl commands in this section.
- You have granted permission to perform the `create` action on the `dcos:mesos:master:task:user:<linux-user-name>` resource to the `dcos_metronome` DC/OS service account user.

Once you have met these prerequisites, complete the following steps to override the default Linux user.


1. Create a Metronome job definition and save it with an informative name such as `myjob.json`.

  ```json
{
  "id": "test-user-override",
  "run": {
    "artifacts": [
      {
        "uri": "/1.12/img/logos/mesosphere.svg"
      }
    ],
    "cmd": "whoami && printf 'iamme' | tee file && sleep 1000",
    "cpus": 0.01,
    "mem": 32,
    "disk": 0,
    "user": "<your-test-user-account>"
  }
}
  ```
  <p class="message--important"><strong>IMPORTANT: </strong>Do not forget to replace "your-test-user-account" with the name of a Linux user that exists on the agent and differs from the default. The Linux user <code>nobody</code> will exist if you have not already provisioned a user.</p>

2. Deploy the job using the [Metronome REST API](https://dcos.github.io/metronome/docs/generated/api.html).

   ```bash
   curl -X POST --cacert dcos-ca.crt $(dcos config show core.dcos_url)/service/metronome/v1/jobs -d @myjob.json -H "Content-type: application/json" -H "Authorization: token=$(dcos config show core.dcos_acs_token)"
   ```

1. Check the **Jobs** tab of the DC/OS web interface to confirm that your job has successfully deployed.

1. Click your job and then click **Run Now**.

1. Open the drop-down menu from the top right by clicking the three stacked dots and select **Run Now**.

1. Expand the job and click to open its task.

1. Click to open the **Files** tab. Observe that all of the files have your Linux user as the **OWNER**.

1. Click to open the `stdout` file.

1. Scroll to the bottom and you should see the results of the `whoami` command, the name of the user your task is running under, followed by `iamme`.
