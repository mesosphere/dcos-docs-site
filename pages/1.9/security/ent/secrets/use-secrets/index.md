---
layout: layout.pug
navigationTitle:  >
title: >
  Configuring services and pods to use
  secrets
menuWeight: 1
excerpt:

enterprise: true
---

The permissions that a user will need to deploy a service or pod that uses a secret vary by [security mode](/1.9/security/ent/#security-modes). 

<table class="table">
  <tr>
    <th>Permission</th>
    <th>Enforced in</th>
  </tr>
  <tr>
    <td><code>dcos:adminrouter:service:marathon full</code></td>
    <td>All security modes</td>
  </tr>
  <tr>
    <td><code>dcos:service:marathon:marathon:services:/[<i>service-group</i> full</code></td>
    <td><code>strict</code> and <code>permissive</code> security modes</td>
  </tr>
</table>

In `strict` mode, users may also need the following.

- `dcos:adminrouter:ops:mesos full`: to view **Task** panel information.
- `dcos:adminrouter:ops:slave full`: to view the details about the task, including the logs.

As long as the path of the secret and the path of the group [match up properly](/1.9//security/ent/#spaces), the service will be able to access the secret value.

The procedure differs depending on whether or not you want to make the secret available to a [pod](/1.9/deploying-services/pods/) or to an individual service. 

- [Individual service](#service)
- [Pod](#pod)

**Prerequisite:** The secret must exist. The examples below use a secret called `my-secret` stored in the `developer` path. If you complete the steps in [Creating secrets](/1.9/security/ent/secrets/create-secrets/), you will meet this prerequisite.


# <a name="service"></a>Configuring a service to use a secret 


## About configuring a service to use a secret 

The procedure varies by interface. Refer to the section that corresponds to your desired interface.

- [GUI](#deploying-the-service-via-the-web-interface)

- [Marathon API](#deploying-the-service-via-marathon-app-definition)


## <a name="deploying-the-service-via-the-web-interface"></a>Configuring a service to use a secret via the GUI

1. Log into the GUI as a user with the necessary permissions as discussed in the [previous section](#service).

1. Click **Services** -> **Services**.

1. Click **RUN A SERVICE**.

1. Click **JSON Configuration**.

1. Select the contents of the default JSON schema and delete them so that no text is shown in the black box.

1. Copy the following simple application and paste it into the black box. This application definition creates a new service inside of the developer group and references a secret stored inside a developer path. It stores the secret under the environment variable `"MY_SECRET"`. Observe below how the `"env"` and `"secrets"` objects are used to define secrets. 

   ```json
   {  
      "id":"/developer/service",
      "cmd":"sleep 100",
      "env":{  
         "MY_SECRET":{  
            "secret":"secret0"
         }
      },
      "secrets":{  
         "secret0":{  
            "source":"developer/my-secret"
         }
      }
   }
   ```

   Because the service and the secret paths match, the service will be able to access the secret. See [Spaces](/1.9/security/ent/#spaces) for more details about the paths.

1. Click **REVIEW & RUN**.

1. Click **RUN SERVICE**.

1. Click the group name of your service, i.e., **developer**.

1. Click the name of your service.

1. Click the name of its task.

1. Scroll through the **Details** tab to locate your `DCOS_SECRETS_DIRECTIVE`.


# <a name="deploying-the-service-via-marathon-app-definition"></a>Configuring a service to use a secret via Marathon app definition

**Prerequisites:** 

- You must have the [DC/OS CLI installed](/1.9/cli/install/).

- If your [security mode](/1.9/security/ent/#security-modes) is `permissive` or `strict`, you must [get the root cert](/1.9/networking/tls-ssl/get-cert/) before issuing the curl commands in this section.  If your [security mode](/1.9/security/ent/#security-modes) is `disabled`, you must delete `--cacert dcos-ca.crt` from the commands before issuing them.

1. Log into the CLI as a user with the necessary permissions via `dcos auth login`. Refer to [About configuring services and pods to use secrets](#service) to discover the required permissions.

1. Within a text editor, create an application definition for your Marathon service. The following application definition creates a new service inside of the developer group and references a secret stored inside a developer path. It stores the secret under the environment variable `"MY_SECRET"`. Observe below how the `"env"` and `"secrets"` objects are used to define secrets. 

   ```json
   {  
      "id":"/developer/service",
      "cmd":"sleep 100",
      "env":{  
         "MY_SECRET":{  
            "secret":"secret0"
         }
      },
      "secrets":{  
         "secret0":{  
            "source":"developer/my-secret"
         }
      }
   }
   ```

   Because the service group and the secret paths match, the service will be able to access the secret. See [Spaces](/1.9/security/ent/#spaces) for more details about the paths.

1. Save the file with a descriptive name, such as `myservice.json`.

1. Use the Marathon API to deploy the app as shown below.

  ```bash
  curl -X POST --cacert dcos-ca.crt $(dcos config show core.dcos_url)/service/marathon/v2/apps -d @myservice.json -H "Content-type: application/json" -H "Authorization: token=$(dcos config show core.dcos_acs_token)"
  ```

1. Open the DC/OS GUI. 

1. Click the group name of your service, i.e., **developer**.

1. Click the name of your service.

1. Click the name of its task.

1. Scroll through the **Details** tab to locate your `DCOS_SECRETS_DIRECTIVE`.


# <a name="pod"></a>Configuring a pod to use a secret 

**Prerequisites:** 

- You must have the [DC/OS CLI installed](/1.9/cli/install/).
- If your [security mode](/1.9/installing/ent/custom/configuration/configuration-parameters/#security-enterprise) is `permissive` or `strict`, you must follow the steps in [Downloading the Root Cert](/1.9/networking/tls-ssl/get-cert/) before issuing the curl commands in this section. If your [security mode](/1.9/installing/ent/custom/configuration/configuration-parameters/#security-enterprise) is `disabled`, you must delete `--cacert dcos-ca.crt` from the commands before issuing them.

1. Log into the CLI as a user with the necessary permissions via `dcos auth login`. Refer to [About configuring services and pods to use secrets](#service) for more information about the permissions.

1. Within a text editor, create an application definition for your pod. You can add the secret using the `"environment"` and `"secrets"` objects as shown below. The following simple application defines a new service inside of the developer group and references a secret stored inside a developer path. It stores the secret under the environment variable `"MY_SECRET"`.

   ```json
   {
     "id": "/developer/pod-secret",
     "environment": {
       "MY_SECRET": {
         "secret": "secret0"
       }
     },
     "secrets": {
       "secret0": { "source": "developer/my-secret"}
     },
     "containers": [
       {
         "name": "container-1",
         "resources": {
           "cpus": 0.1,
           "mem": 128
         },
         "exec": {
           "command": {
             "shell": "sleep 3600"
           }
         }
       }
     ],
     "scaling": {
       "kind": "fixed",
       "instances": 1
     },
     "networks": [
       {
         "mode": "host"
       }
     ]
   }
   ```

   **Note:** Because the service group and the secret paths match, the pod will be able to access the secret. See [Namespacing](/1.9//security/ent/#spaces) for more details about the paths.

1. Save the file with a descriptive name, such as `mypod.json`.

1. Use the DC/OS CLI to deploy the pod as shown below.

  ```bash
  dcos marathon pod add mypod.json
  ```

1. Open the DC/OS GUI. 

1. Click the group name of your service, i.e., **developer**.

1. Click the name of your pod.

1. Click to open the **Configuration** tab.

1. Scroll to the **Environment Variables** area to locate your secret `MY_SECRET`.
