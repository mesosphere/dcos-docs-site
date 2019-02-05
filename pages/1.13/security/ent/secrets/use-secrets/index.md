---
layout: layout.pug
navigationTitle:  Configuring services and pods
title: Configuring services and pods
menuWeight: 1
excerpt: Configuring services and pods to use secrets

enterprise: true
---

<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->

Your service definition can reference secrets as environment variables or as a file.

## File-based secrets

You can reference the secret as a file for increased security from other processes, or if your service needs to read secrets from files mounted in the container. Referencing a file-based secret can be particularly useful for:

- Kerberos keytabs or other credential files.
- SSL certificates.
- Configuration files with sensitive data.

File-based secrets are available in the sandbox of the task (`$MESOS_SANDBOX/<configured-path>`).

### Prerequisites

- An existing secret. The examples below use a secret called `my-secret` stored in the `developer` path. If you complete the steps in [Creating secrets](/1.13/security/ent/secrets/create-secrets/), you will meet this prerequisite.

- [DC/OS CLI installed](/1.13/cli/install/) and the [DC/OS Enterprise CLI installed](/1.13/cli/enterprise-cli/#ent-cli-install).
- You must [get the root cert](/1.13/security/ent/tls-ssl/get-cert/) before issuing the curl commands in this section.  
- The appropriate permissions for your [security mode](/1.13/security/ent/#security-modes).

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

  As long as the path of the secret and the path of the group [match up properly](/1.13/security/ent/#spaces), the service will be able to access the secret value.

The procedure differs depending on whether or not you want to make the secret available to a [pod](/1.13/deploying-services/pods/) or to an individual service.

- [Individual service](#service)
- [Pod](#pod)

# <a name="service"></a>Configuring a service to use a secret

The procedure varies by interface. Refer to the section that corresponds to your desired interface.

- [web interface](#deploying-the-service-via-the-web-interface)

- [Marathon API](#deploying-the-service-via-marathon-app-definition)

## <a name="deploying-the-service-via-the-web-interface"></a>Configuring a service to use a secret via the web interface

1. Log into the web interface as a user with the necessary permissions as discussed in [Permissions Management](/1.13/security/ent/perms-management/) and [Granting Access to the Secrets Tab](/1.13/security/ent/gui-permissions/secrets-tab/).

1. Click the **Services** tab.

1. Click the **+** icon in the top right.

    ![Add a Service](/1.13/img/add-service.png)

    Figure 1. Running a service

1. Click the **JSON Editor** toggle.

1. Select the contents of the default JSON schema and delete them so that no text is shown in the black box.

1. Copy one of the following simple application definitions and paste it into the black box. This application definition creates a new service inside of the developer group and references a secret stored inside a developer path.

   Environment variable-based secret:

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

   In the example above, DC/OS stores the secret under the environment variable `"MY_SECRET"`. Observe how the `"env"` and `"secrets"` objects are used to define environment variable-based secrets.

   File-based secret:

   ```json
   {
     "id": "developer/service",
     "cmd": "sleep 100",
     "container": {
        "type": "MESOS",
        "volumes": [
         {
           "containerPath": "path",
           "secret": "secretpassword"
         }
       ]
     },
     "secrets": {
       "secretpassword": {
         "source": "developer/databasepassword"
       }
     }
   }
   ```

   In the example above, the secret will have the filename `path` and will be available in the task's sandbox (`$MESOS_SANDBOX/path`).

   Because the service and the secret paths match, the service will be able to access the secret. See [Spaces](/1.13/security/ent/#spaces) for more details about the paths.

1. Click **REVIEW & RUN**.

1. Click **RUN SERVICE**.

1. Click the group name of your service, i.e., **developer**.

1. Click the name of your service.

1. Click the name of its task.

1. Scroll through the **Details** tab to locate your `DCOS_SECRETS_DIRECTIVE` for environmment variable-based secrets.

    If you want to test whether file-based secrets are successful, you can add `cat path` to the application `cmd` to have the secret printed to the `stdout` logs.

    For example:
    ```json
    {
      "id": "developer/service",
      "cmd": "cat path && sleep 100",
      "container": {
        "type": "MESOS",
        "volumes": [
      {
        "containerPath": "path",
        "secret": "secretpassword"
      }
      ]
      },
        "secrets": {
          "secretpassword": {
            "source": "developer/databasepassword"
        }
      }
    }
    ```

# <a name="deploying-the-service-via-marathon-app-definition"></a>Configuring a service to use an environment variable-based secret via Marathon app definition

1. Log into the CLI as a user with the necessary permissions via `dcos auth login`. Refer to [About configuring services and pods to use secrets](#service) to discover the required permissions.

1. Within a text editor, create an application definition for your Marathon service. The following application definition creates a new service inside of the developer group and references a secret stored inside a developer path.

   Environment variable-based secret:

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

   In the example above, DC/OS stores the secret under the environment variable `"MY_SECRET"`. Observe how the `"env"` and `"secrets"` objects are used to define environment variable-based secrets.

   File-based secret:

   ```json
   {
     "id": "developer/service",
     "cmd": "sleep 100",
     "container": {
        "type": "MESOS",
        "volumes": [
         {
           "containerPath": "path",
           "secret": "secretpassword"
         }
       ]
     },
     "secrets": {
       "secretpassword": {
         "source": "developer/databasepassword"
       }
     }
   }
   ```

   Because the service group and the secret paths match, the service will be able to access the secret. See [Spaces](/1.13/security/ent/#spaces) for more details about the paths.

1. Save the file with a descriptive name, such as `myservice.json`.

1. Add the service to DC/OS via the DC/OS CLI.

   ```bash
   dcos marathon app add myservice.json
   ```

   Alternatively, use the Marathon API to deploy the app as shown below.

   ```bash
   curl -X POST --cacert dcos-ca.crt $(dcos config show core.dcos_url)/service/marathon/v2/apps -d @myservice.json -H "Content-type: application/json" -H "Authorization: token=$(dcos config show core.dcos_acs_token)"
   ```

1. Open the DC/OS web interface.

1. Click the group name of your service, i.e., **developer**.

1. Click the name of your service.

1. Click the name of its task.

1. Scroll through the **Details** tab to locate your `DCOS_SECRETS_DIRECTIVE` for environment variable-based secrets.

    If you want to test whether file-based secrets are successful, you can add `cat path` to the application `cmd` to have the secret printed to the `stdout` logs.

    For example:
    ```json
    {
      "id": "developer/service",
      "cmd": "cat path && sleep 100",
      "container": {
        "type": "MESOS",
        "volumes": [
        {
        "containerPath": "path",
        "secret": "secretpassword"
        }
      ]
      },
        "secrets": {
          "secretpassword": {
            "source": "developer/databasepassword"
        }
      }
    }
    ```

# <a name="pod"></a>Configuring a pod to use a secret

1. Log into the CLI as a user with the necessary permissions via `dcos auth login`. Refer to [About configuring services and pods to use secrets](#service) for more information about the permissions.

1. Within a text editor, create an application definition for your pod. You can add the secret using the `"environment"` and `"secrets"` objects as shown below. The following simple application defines a new service inside of the developer group and references a secret stored inside a developer path. It stores the secret under the environment variable `"MY_SECRET"`.

    Environment variable-based secret:

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

    File-based secret:

    ```json
    {
      "id": "developer/pod-with-secrets",
      "containers": [
         {
           "type": "MESOS",
           "name": "container-1",
           "exec": {
             "command": {
               "shell": "sleep 1"
             }
         },
         "volumeMounts": [
           {
             "name": "secretvolume",
             "mountPath": "path/to/db/password"
           }
         ]
       }
     ],
     "volumes": [
       {
         "name": "secretvolume",
         "secret": "secretpassword"
       }
     ],
     "secrets": {
       "secretpassword": {
         "source": "developer/databasepassword"
       }
     }
   }
   ```
    <p class="message--note"><strong>NOTE: </strong>Because the service group and the secret paths match, the pod will be able to access the secret. See <a href="/1.12/security/ent/#spaces">Namespacing</a> for more details about the paths.</p>

1. Save the file with a descriptive name, such as `mypod.json`.

1. Use the DC/OS CLI to deploy the pod as shown below.

   ```bash
   dcos marathon pod add mypod.json
   ```

1. Open the DC/OS web interface.

1. Click the group name of your service, i.e., **developer**.

1. Click the name of your pod.

1. Click to open the **Configuration** tab.

1. Scroll to the **Environment Variables** area to locate your secret `MY_SECRET`.

## Limitation

 The file-based secrets work only with the UCR. 
