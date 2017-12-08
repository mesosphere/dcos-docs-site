---
layout: layout.pug
navigationTitle:  >
title: >
  Configuring Linux users for user
  services via Marathon app definition
menuWeight: 3
excerpt: >
  Discusses what Linux user owns the
  sandbox and executes tasks by default
  and how to modify it.
featureMaturity:
enterprise: true
---




# About the default Linux users

The default Linux user varies according to your security mode and the type of container the service runs inside of.

- **Container type:** By default, all user services will run inside of Mesos containers. However, a user service can be configured to run inside of a Docker container instead. Please see [Deploying a Docker-based Service to Marathon](/1.8/usage/managing-services/application-basics/deploy-docker-app/) for more information.

- **Security mode:** By default, DC/OS runs in `permissive` mode. Please review the [Installation section](/1.8/administration/installing/ent/custom/configuration-parameters/#security) for more information on the `security` modes.

The following table identifies the default Linux user in each situation.

<table class="table">
  <tr>
    <th>
      Container type
    </th>
    <th>
      Security mode: strict
    </th>
    <th>
      Security mode: permissive
    </th>
    <th>
      Security mode: disabled
    </th>
  </tr>
  <tr>
    <td>
      Mesos
    </td>
    <td>
      Task runs under <code>nobody</code><br>
      Fetched/created files owned by <code>nobody</code>
    </td>
    <td>
      Task runs under <code>root</code><br>
      Fetched/created files owned by <code>root</code>
    </td>
    <td>
      Task runs under <code>root</code><br>
      Fetched/created files owned by <code>root</code>
    </td>
  </tr>
  <tr>
    <td>
      Docker
    </td>
    <td>
      Task runs under <code>root</code><br>
      Fetched/created files owned by <code>nobody</code>
    </td>
    <td>
      Task runs under <code>root</code><br>
      Fetched/created files owned by <code>root</code>
    </td>
    <td>
      Task runs under <code>root</code><br>
      Fetched/created files owned by <code>root</code>
    </td>
  </tr>
</table>

Docker tasks run under `root` by default, but Docker user privileges are confined to the Docker container. Should you wish to change the default task user, modify the Docker container. Please reference the [Docker documentation](https://docs.docker.com/engine/tutorials/dockerimages/) for more information, as well as the user service documentation in the [Usage](/1.8/usage/) section.

**Note:** If the fetched file is compressed, the individual files inside will retain the permissions and ownership assigned when the file was compressed and are unaffected by any other configurations or settings.


# Overriding the default Linux user

Marathon app definitions provide a `"user"` key which you can use to override the default Linux user. **Tip:** Reference the [Marathon documentation](https://mesosphere.github.io/marathon/docs/) for more details on writing Marathon services.

The following procedure will walk you through a quick tutorial to demonstrate how the permissions and ownership work in action.

**Prerequisites:** Before you begin, make sure that:

- The Linux user account already exists on the agent
- You have installed and are logged into the DC/OS CLI
- If your [security mode](/1.8/administration/installing/ent/custom/configuration-parameters/#security) is `permissive` or `strict`, you must follow the steps in [Obtaining and passing the DC/OS certificate in curl requests](/1.8/administration/tls-ssl/get-cert/) before issuing the curl commands in this section. If your [security mode](/1.8/administration/installing/ent/custom/configuration-parameters/#security) is `disabled`, you must delete `--cacert dcos-ca.crt` from the commands before issuing them.

Once you have met these prerequisites, complete the following steps to override the default Linux user.

1. Create a Marathon app definition and save it with an informative name such as `myservice.json`. The following service will write the name of the user it's running under to the logs, create a new file, and fetch the Mesosphere logo from dcos.io.

  ```json
  {
    "id": "linux-user-override",
    "cmd": "whoami && tee file && sleep 1000",
    "user": "<your-test-user-account>",
    "uris": [
        "https://dcos.io/assets/images/logos/mesosphere.svg"
    ]
  }
  ```
  **Important:** Don't forget to replace `<your-test-user-account>` with the name of a Linux user that exists on the agent and differs from the default.

2. Deploy the service using the Marathon REST API.

  ```bash
curl -X POST --cacert dcos-ca.crt $(dcos config show core.dcos_url)/service/marathon/v2/apps -d @myservice.json -H "Content-type: application/json" -H "Authorization: token=$(dcos config show core.dcos_acs_token)"
  ```

3. Check the **Services** tab of the DC/OS web interface to confirm that your app has successfully been created.

4. Click your service and then click the **Configuration** tab.

5. Scroll down to see the Linux user account that you specified as the value of **User**.

6. Click the **Tasks** tab. By this time, your service should have succeeded in deploying. Click the task name.

7. Click the **Files** tab.

8. Observe the Linux user name that you passed in as the **OWNER** of the fetched and created files.

**Note:** Due to a [known Apache Mesos issue](https://issues.apache.org/jira/browse/MESOS-6027), the `stdout`, `stderr`, and `*.logrotate.conf` files may still be owned by the default Linux user.
