---
layout: layout.pug
navigationTitle:  Configuring services to use secrets
title: Configuring services to use secrets
menuWeight: 1
excerpt:
preview: true
enterprise: true
---

# <a name="about-config"></a>About configuring services to use secrets

To deploy an application that uses a secret, a user needs the permission to access Marathon and the permission to deploy services from within the designated service group.

<table class="table">
  <tr>
    <th>Resource</th>
    <th>Action</th>
  </tr>
  <tr>
    <td><code>dcos:adminrouter:service:marathon</code></td>
    <td><code>full</code></td>
  </tr>
  <tr>
    <td><code>dcos:service:marathon:marathon:services:/[<i>service-group</i>]</code></td>
    <td><code>full</code></td>
  </tr>
</table>

**Tip:** For a user to be able to see the **Task** panel information about a service, the user will also need the `dcos:adminrouter:ops:mesos` permission (`full` action). For the user to be able to view the details about the task, including the logs, the user needs the `dcos:adminrouter:ops:slave` permission (`full` action).

As long as the path of the secret and the path of the group [match up properly](/1.8/administration/secrets/create-secrets/#secret-paths), the service will be able to access the secret value.

A user with the necessary permissions can configure a service to use a secret using either of the following methods.

* [Web interface](#deploying-the-service-via-the-web-interface)

* [Marathon application definition](#deploying-the-service-via-marathon-app-definition)

# <a name="deploying-the-service-via-the-web-interface"></a>Deploying the service via the web interface

1. Log into the web interface as a user with the necessary permissions as discussed in the [previous section](#service).

1. Click **Services**.

1. Click **Deploy Service**.

1. Click to toggle to **JSON mode**.

1. You can add the secret using the `"env"` and `"secrets"` objects in the JSON as shown below. The following simple application defines a new service inside of the developer group and references a secret stored inside a developer path. It stores the secret under the environment variable `"MY_SECRET"`.

   ```json
{
   "id":"/developer/service",
   "cmd":"env && sleep 100",
   "env":{
      "MY_SECRET":{
         "secret":"secret0"
      }
   },
   "secrets":{
      "secret0":{
         "source":"developer/secret"
      }
   }
}
   ```

   Because the service and the secret paths match, the service will be able to access the secret. See [About controlling access with secret paths](/1.8/administration/secrets/create-secrets/#secret-paths) for more details about the paths.

1. Click **Deploy**.

1. Click the group name of your service; then click the name of your service; then click the **Configuration** tab.

1. You will see your secret listed in the **Health Checks** area.


# <a name="deploying-the-service-via-marathon-app-definition"></a>Deploying the service via Marathon app definition

**Prerequisites:**

- You must have the [DC/OS CLI installed](/1.8/usage/cli/install/).

- If your [security mode](/1.8/administration/installing/ent/custom/configuration-parameters/#security) is `permissive` or `strict`, you must follow the steps in [Obtaining and passing the DC/OS certificate in curl requests](/1.8/administration/tls-ssl/get-cert/) before issuing the curl commands in this section. If your [security mode](/1.8/administration/installing/ent/custom/configuration-parameters/#security) is `disabled`, you must delete `--cacert dcos-ca.crt` from the commands before issuing them.

1. Log into the CLI as a user with the necessary permissions via `dcos auth login`. Refer to [About configuring services to use secrets](#service) for more information about the permissions.

1. Within a text editor, create an application definition for your Marathon service. You can add the secret using the `"env"` and `"secrets"` objects as shown below. The following simple application defines a new service inside of the developer group and references a secret stored inside a developer path. It stores the secret under the environment variable `"MY_SECRET"`.

   ```json
{
   "id":"/developer/service",
   "cmd":"env && sleep 100",
   "env":{
      "MY_SECRET":{
         "secret":"secret0"
      }
   },
   "secrets":{
      "secret0":{
         "source":"developer/secret"
      }
   }
}
   ```

   Because the service group and the secret paths match, the service will be able to access the secret. See [About controlling access with secret paths](/1.8/administration/secrets/create-secrets/#secret-paths) for more details about the paths.

1. Save the file with a descriptive name, such as `myservice.json`.

1. Use the Marathon REST API to deploy the app as shown below.

  ```bash
  curl -X POST --cacert dcos-ca.crt $(dcos config show core.dcos_url)/service/marathon/v2/apps -d @myservice.json -H "Content-type: application/json" -H "Authorization: token=$(dcos config show core.dcos_acs_token)"
  ```

1. Check the web interface to observe the new app deploying.
