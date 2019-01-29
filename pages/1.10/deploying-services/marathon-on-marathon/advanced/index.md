---
layout: layout.pug
navigationTitle:  >
title: >
  Deploying Services using a Custom
  Marathon with Security Features
menuWeight: 40
excerpt:
preview: true
enterprise: true
---

This topic describes how to deploy a non-native instance of Marathon with isolated roles, reservations, quotas, and security features. The advanced non-native Marathon procedure should only be used if you require [secrets](/1.10/security/ent/secrets/) or fine-grain ACLs, otherwise use the [basic procedure](/1.10/deploying-services/marathon-on-marathon/basic/).

or this procedure, we are assuming that you have obtained an enterprise version of Marathon from a support team member. If you still need the enterprise artifact, you will want to first file a ticket via the [Mesosphere support portal](https://support.mesosphere.com/s/). The enterprise artifact is delivered as a Docker image file and contains Marathon plus plugins for Marathon that enable DC/OS Enterprise features - such as secrets and fine-grained access control.

**Prerequisites:**

-  DC/OS and DC/OS CLI [installed](/1.10/installing/).
-  [DC/OS Enterprise CLI 0.4.14 or later](/1.10/cli/enterprise-cli/#ent-cli-install).
-  Custom non-native Marathon image [deployed in your private Docker registry]((/1.12/deploying-services/private-docker-registry#tarball-instructions). File a ticket with via the [support portal](https://support.mesosphere.com) to obtain the enterprise Marathon image file.
-  A private Docker registry that each private DC/OS agent can access over the network. You can follow [these](/1.10/deploying-services/private-docker-registry/) instructions for how to set up in Marathon, or use another option such as [DockerHub](https://hub.docker.com/), [Amazon EC2 Container Registry](https://aws.amazon.com/ecr/), and [Quay](https://quay.io/)).
-  You must be logged in as a superuser.
-  SSH access to the cluster.

# Step 1 - Load and Push the Custom Non-Native Marathon Image
In this step, the custom non-native Marathon instance is pushed to the private Docker registry.

1. Load the tarball into Docker with the custom non-native Marathon file (`marathon-dcos-ee.<version>.tar`) specified.

   ```bash
   docker load -i marathon-dcos-ee.<version>.tar
   ```

    **Tip:** You can view the Marathon image with this command.

    ```
    docker images
    ```

    You should see output similar to this:

    ```bash
    REPOSITORY                    TAG                 IMAGE ID            CREATED             SIZE
    mesosphere/marathon-dcos-ee   1.4.0-RC4_1.9.4     d1ffa68a50c0        3 months ago        926.4 MB
    ```

1. Rename the file to match the repository that you are using in your private Docker registry, where:
   - `<mesosphere-tag>` is the tag of the image from Mesosphere. Typically, this will match the version number in the filename.
   - `<your-repo>` is the name of the private repository that you want to store the image in.
   - `<your-tag>` is the tag for the image. It is recommended that you use the same tag as the Mesosphere image.

   ```bash
   docker tag mesosphere/marathon-dcos-ee:<mesosphere-tag> <your-repo>/marathon-dcos-ee:<your-tag>
   ```

1. Push the Marathon image up to your private Docker registry.

   ```bash
   docker push <your-repo>/marathon-dcos-ee:<your-tag>
   ```

# Step 2 - Reserve Resources
In this step, Mesos resources are reserved. Choose the procedure for either [static](#static-reservations) or [dynamic](#dynamic-reservations) reservations.

## Static Reservations
**Warning:** This procedure kills all running tasks on your node.

1.  [SSH](/1.10/administering-clusters/sshcluster/) to your private agent node.

   ```bash
   dcos node ssh --master-proxy --mesos-id=<agent-id>
   ```

1.  Navigate to `/var/lib/dcos` and create a file named `mesos-slave-common` with these contents, where `<myrole>` is the name of your role.

    ```bash
    MESOS_DEFAULT_ROLE='<myrole>'
    ```
1.  Stop the private agent node:

    ```bash
    sudo sh -c 'systemctl kill -s SIGUSR1 dcos-mesos-slave && systemctl stop dcos-mesos-slave'
    ```

1.  Add the node back to your cluster.

    1.  Reload the systemd configuration.

        ```bash
        ﻿⁠⁠sudo systemctl daemon-reload
        ```

    1.  Remove the `latest` metadata pointer on the agent node:

        ```bash
        ⁠⁠⁠⁠sudo rm /var/lib/mesos/slave/meta/slaves/latest
        ```

    1.  Start your agents with the newly configured attributes and resource specification⁠⁠.

        ```bash
        sudo systemctl start dcos-mesos-slave
        ```

        **Tip:** You can check the status with this command:

        ```bash
        sudo systemctl status dcos-mesos-slave
        ```

1.  Repeat these steps for each additional node.

## Dynamic Reservations
Reserve resources for your non-native Marathon instance with the Mesos ID (`<mesos-id>`), user ID (`<userid>`), role (`<myrole>`), and ports (`<begin-port>` and `<end-port>`) specified.

```bash
curl -i -k \
      -H "Authorization: token=`dcos config show core.dcos_acs_token`" \
      -H "Content-Type: application/json" \
      -H "Accept: application/json" \
      -d '{
  "type": "RESERVE_RESOURCES",
  "reserve_resources": {
    "agent_id": {
      "value": "<mesos-id>"
    },
    "resources": [
      {
        "type": "SCALAR",
        "name": "cpus",
        "reservation": {
          "principal": "<userid>"
        },
        "role": "<myrole>",
        "scalar": {
          "value": 1.0
        }
      },
      {
        "type": "SCALAR",
        "name": "mem",
        "reservation": {
          "principal": "<userid>"
        },
        "role": "<myrole>",
        "scalar": {
          "value": 512.0
        }
      },
      {
        "type": "RANGES",
        "name": "ports",
        "reservation": {
          "principal": "<userid>"
        },
        "role": "<myrole>",
        "ranges": {
          "begin": "[<begin-port>]",
          "end": "[<end-port>]"
        }
      }
    ]
  }
}' \
      -X POST "`dcos config show core.dcos_url`/mesos/api/v1"
```

# Step 3 - Create a Marathon Service Account
In this step, a Marathon Service Account is created. Depending on your [security mode](/1.10/security/ent/#security-modes), a Marathon Service Account is either optional or required.

| Security Mode | Marathon Service Account |
|---------------|----------------------|
| Disabled | Optional |
| Permissive | Optional |
| Strict | Required |

1.  Create a 2048-bit RSA public-private key pair (`<private-key>.pem` and `<public-key>.pem`) and save each value into a separate file within the current directory.

    ```bash
    dcos security org service-accounts keypair <private-key>.pem <public-key>.pem
    ```

1.  Create a new service account called `<service-account-id>`, with the public key specified (`<public-key>.pem`).

    ```bash
    dcos security org service-accounts create -p <public-key>.pem -d "Non-native Marathon service account" <service-account-id>
    ```

# Step 4 - Create Private Docker Registry Credentials for Private Agents
In this step, the credential tarball is transferred to the local file system of each private agent using [secure copy](https://linux.die.net/man/1/scp).

**Tip:** The following instructions are optimized for CoreOS masters and agents. If you are running CentOS, just replace `core` with `centos` throughout the following commands.

1. From a terminal prompt, log into your private Docker registry.
   -  If your private repository is on Docker Hub, use this command:

      ```bash
      docker login
      ```
   -  If your private repository is not on Docker Hub, use this command, with the domain name (`<domain-name>`) of your private registry specified.

      ```bash
      docker login <domain-name>
      ```

1. Navigate into your home directory and verify the contents of the `.docker` directory look similar to this.

   ```bash
   ls -la .docker
   drwxr-xr-x    4 user  group   136 Aug 15 17:29 .
   drwxr-xr-x+ 118 user  group  4012 Jan 26 18:16 ..
   -rw-------    1 user  group   217 Jan 25 13:52 config.json
   ```

1. Compress the Docker credentials.

   ```bash
   sudo tar cvzf docker.tar.gz .docker
   ```

    **Tip:** You can confirm that the operation succeeded with this command.

   ```bash
   tar -tvf docker.tar.gz
   ```

   You should see output similar to this.

   ```bash
   drwxr-xr-x  0 user group       0 Jan 23 15:47 .docker/
   -rw-------  0 user group     217 Jan 23 15:48 .docker/config.json
   ```

1. Copy the Docker credentials file to one of your masters with the public master IP address (`<public-master-ip>`) specified.

   **Tip:** You can find the public master IP address by clicking on the cluster name in the top-left corner of the DC/OS GUI.

   ```bash
   scp docker.tar.gz core@<public-master-ip>:~
   ```

1. [SSH](/1.10/administering-clusters/sshcluster/) to the master node that contains the Docker credentials file.

   ```bash
   dcos node ssh --master-proxy --mesos-id=<master-id>
   ```

1. Store the IP address of each private agent in an environment variable. <!-- What is this step for -->The steps required depend on your [security mode](/1.10/security/ent/#security-modes).

   ### Disabled

   ```bash
   PRIVATE_AGENT_IPS=$(curl -sS leader.mesos:5050/slaves | jq '.slaves[] | select(.reserved_resources.slave_public == null) | .hostname' | tr -d '"');
   ```

   ### Permissive

   ```bash
   PRIVATE_AGENT_IPS=$(curl -sS leader.mesos:5050/slaves | jq '.slaves[] | select(.reserved_resources.slave_public == null) | .hostname' | tr -d '"');
   ```

   ### Strict

   1.  Authenticate and save your authentication token to the `AUTH_TOKEN` environment variable, with your DC/OS username (`<username>`) and password (`<password>` specified.

       ```bash
       AUTH_TOKEN=$(curl -X POST localhost:8101/acs/api/v1/auth/login \
       -d '{"uid":"<username>","password":"<password>"}' \
       -H 'Content-Type: application/json' | jq -r '.token')
       ```

   1.  Download the certificate bundle, with your cluster URL (`<cluster-url>`) specified.

       ```bash
       sudo curl -k -v https://<cluster-url>/ca/dcos-ca.crt -o /etc/ssl/certs/dcos-ca.crt
       ```

   1.  Save the private IP address of each of your private agents to the `PRIVATE_AGENT_IPS` environment variable.

       ```bash
       PRIVATE_AGENT_IPS=$(curl -sS --cacert /etc/ssl/certs/dcos-ca.crt \
       -H "Authorization: token=$AUTH_TOKEN" https://leader.mesos:5050/slaves | jq '.slaves[] | select(.reserved_resources.slave_public == null) | .hostname' | tr -d '"');
       ```

1. Copy the `docker.tar.gz` file to the `/home/core` directory of each of your private agents.

   ```bash
   for i in $PRIVATE_AGENT_IPS; do scp -o StrictHostKeyChecking=no docker.tar.gz core@$i:~/docker.tar.gz ; done
   ```
# Step 5 - Create a Service Account Secret
In this step, a secret is created for the Marathon service account and stored in the Secret Store.

Create a secret (`<path-to-secret-name>`) for your service account. The secret will contain the private key (`<private-key>.pem`) and the name of the service account (`<service-account-id>`).

### Disabled

```bash
dcos security secrets create-sa-secret <private-key>.pem <service-account-id> <path-to-secret-name>
```

### Permissive

```bash
dcos security secrets create-sa-secret <private-key>.pem <service-account-id> <path-to-secret-name>
```

### Strict

```bash
dcos security secrets create-sa-secret --strict <private-key>.pem <service-account-id> <path-to-secret-name>
```

#### Recommendations

-  Review your secret to ensure that it contains the correct service account ID, private key, and `login_endpoint` URL. If you're in `strict` it should be HTTPS, in `disabled` or `permissive` mode it should be HTTP. If the URL is incorrect, try [upgrading the DC/OS Enterprise CLI](/1.10/cli/enterprise-cli/#ent-cli-upgrade), deleting the secret, and recreating it. You can use this commands to view the contents:

   ```bash
   dcos security secrets list /
   ```

   Alternatively, if you have [jq 1.5 or later](https://stedolan.github.io/jq/download) installed, you can use this command:

   ```bash
   dcos security secrets get /momee-serv-group/momee-serv-group-service/<secret-name> --json | jq -r .value | jq
   ```

-  Delete the private key file from your file system to prevent bad actors from using the private key to authenticate to DC/OS.

# Step 6 - Assign Permissions (Strict mode only)
In this step, permissions are assigned to the Marathon-on-Marathon instance. Permissions are required in strict mode and are ignored in other security modes.

| Security Mode | Permissions |
|---------------|----------------------|
| Disabled | Not available |
| Permissive | Not available |
| Strict | Required |

All CLI commands can also be executed via the [IAM API](/1.10/security/ent/iam-api/).

1.  Grant the permission for user (`<service-account-id>`) with the `nobody` Linux user account specified. To use a different user account, replace `nobody` with the name of the user account.

    ```bash
    dcos security org users grant <service-account-id> dcos:mesos:master:task:user:nobody create --description "Allows Linux user nobody to execute tasks"
    dcos security org users grant <service-account-id> dcos:mesos:master:framework:role:<myrole> create --description "Controls the ability of <myrole> to register as a framework with the Mesos master"
    dcos security org users grant <service-account-id> dcos:mesos:master:reservation:role:<myrole> create --description "Controls the ability of <myrole> to reserve resources"
    dcos security org users grant <service-account-id> dcos:mesos:master:volume:role:<myrole> create --description "Controls the ability of <myrole> to access volumes"
    dcos security org users grant <service-account-id> dcos:mesos:master:reservation:principal:<service-account-id> delete --description "Controls the ability of <service-account-id> to reserve resources"
    dcos security org users grant <service-account-id> dcos:mesos:master:task:app_id:/ create --description "Controls the ability to launch tasks"
    dcos security org users grant <service-account-id> dcos:mesos:master:volume:principal:<service-account-id> delete --description "Controls the ability of <service-account-id> to access volumes"
    ```

# Step 7 - Install a Non-Native Marathon Instance with Assigned Role
In this step, a non-native Marathon instance is installed on DC/OS with the Mesos role assigned.

1.  Create a custom JSON config file and save as `config.json`. This file is used to install the custom non-native Marathon instance. The JSON file contents vary according to your [security mode](/1.10/security/ent/#security-modes). Replace these variables in the examples with your specific information:

    | Variable | Description |
    |--------------------------|--------------------------------------------|
    | `<non-native-marathon>` | Non-native Marathon framework name |
    | `<service-account-id>` | Non-native Marathon service account |
    | `<secret-name>` | Secret  |
    | `<myrole>` | Mesos role |
    | `<your-repo>` | Private Docker registry repo |
    | `<your-tag>` | Docker tag |
    | `<linux-user>` | Linux user  `core` or `centos` |

    ### Disabled

    ```json
    {
      "id":"/<non-native-marathon>",
      "cmd":"cd $MESOS_SANDBOX && LIBPROCESS_PORT=$PORT1 && /marathon/bin/start --default_accepted_resource_roles \"*,<myrole>\" --enable_features \"vips,task_killing,external_volumes,secrets,gpu_resources\" --framework_name <non-native-marathon> --hostname $LIBPROCESS_IP --http_port $PORT0 --master zk://master.mesos:2181/mesos --max_tasks_per_offer 1 --mesos_leader_ui_url /mesos --mesos_role <myrole>  --zk zk://master.mesos:2181/universe/<non-native-marathon> --mesos_user nobody --mesos_authentication --mesos_authentication_principal <service-account-id>",
      "user":"nobody",
      "cpus":2,
      "mem":4096,
      "disk":0,
      "instances":1,
      "constraints":[
         [
            "hostname",
            "UNIQUE"
         ]
      ],
      "container":{
         "type":"DOCKER",
         "docker":{
            "image":"<your-repo>/marathon-dcos-ee:<your-tag>",
            "network":"HOST",
            "privileged":false,
            "parameters":[

            ],
            "forcePullImage":false
         },
         "volumes":[
            {
               "containerPath":"/opt/mesosphere",
               "hostPath":"/opt/mesosphere",
               "mode":"RO"
            }
         ]
      },
      "env":{
         "JVM_OPTS":"-Xms256m -Xmx2g",
         "DCOS_STRICT_SECURITY_ENABLED":"false",
         "DCOS_SERVICE_ACCOUNT_CREDENTIAL_TOFILE":{
            "secret":"service-credential"
         },
         "MESOS_AUTHENTICATEE":"com_mesosphere_dcos_ClassicRPCAuthenticatee",
         "MESOS_MODULES":"file:///opt/mesosphere/etc/mesos-scheduler-modules/dcos_authenticatee_module.json",
         "MESOS_NATIVE_JAVA_LIBRARY":"/opt/mesosphere/lib/libmesos.so",
         "MESOS_VERBOSE":"true",
         "GLOG_v":"2",
         "PLUGIN_ACS_URL":"http://master.mesos",
         "PLUGIN_AUTHN_MODE":"dcos/jwt+anonymous",
         "PLUGIN_FRAMEWORK_TYPE":"marathon"
      },
      "healthChecks":[
         {
            "path":"/ping",
            "protocol":"HTTP",
            "portIndex":0,
            "gracePeriodSeconds":1800,
            "intervalSeconds":10,
            "timeoutSeconds":5,
            "maxConsecutiveFailures":3,
            "ignoreHttp1xx":false
         }
      ],
      "secrets":{
         "service-credential":{
            "source":"<path-to-secret-name>"
         }
      },
      "labels":{
         "DCOS_SERVICE_NAME":"<non-native-marathon>",
         "DCOS_SERVICE_PORT_INDEX":"0",
         "DCOS_SERVICE_SCHEME":"http"
      },
      "portDefinitions":[
         {
            "port":0,
            "name":"http"
         },
         {
            "port":0,
            "name":"libprocess"
         }
      ],
      "fetch":[
         {
            "uri":"file:///home/<linux-user>/docker.tar.gz"
         }
      ]
    }
    ```

    ### Permissive

    ```json
    {
      "id":"/<non-native-marathon>",
      "cmd":"cd $MESOS_SANDBOX && LIBPROCESS_PORT=$PORT1 && /marathon/bin/start --default_accepted_resource_roles \"*,<myrole>\" --enable_features \"vips,task_killing,external_volumes,secrets,gpu_resources\" --framework_name <non-native-marathon> --hostname $LIBPROCESS_IP --http_port $PORT0 --master zk://master.mesos:2181/mesos --max_tasks_per_offer 1 --mesos_leader_ui_url /mesos --mesos_role <myrole>  --zk zk://master.mesos:2181/universe/<non-native-marathon> --mesos_user nobody --mesos_authentication --mesos_authentication_principal <service-account-id>",
      "user":"nobody",
      "cpus":2,
      "mem":4096,
      "disk":0,
      "instances":1,
      "constraints":[
         [
            "hostname",
            "UNIQUE"
         ]
      ],
      "container":{
         "type":"DOCKER",
         "docker":{
            "image":"<your-repo>/marathon-dcos-ee:<your-tag>",
            "network":"HOST",
            "privileged":false,
            "parameters":[

            ],
            "forcePullImage":false
         },
         "volumes":[
            {
               "containerPath":"/opt/mesosphere",
               "hostPath":"/opt/mesosphere",
               "mode":"RO"
            }
         ]
      },
      "env":{
         "JVM_OPTS":"-Xms256m -Xmx2g",
         "DCOS_STRICT_SECURITY_ENABLED":"false",
         "DCOS_SERVICE_ACCOUNT_CREDENTIAL_TOFILE":{
            "secret":"service-credential"
         },
         "MESOS_AUTHENTICATEE":"com_mesosphere_dcos_ClassicRPCAuthenticatee",
         "MESOS_MODULES":"file:///opt/mesosphere/etc/mesos-scheduler-modules/dcos_authenticatee_module.json",
         "MESOS_NATIVE_JAVA_LIBRARY":"/opt/mesosphere/lib/libmesos.so",
         "MESOS_VERBOSE":"true",
         "GLOG_v":"2",
         "PLUGIN_ACS_URL":"http://master.mesos",
         "PLUGIN_AUTHN_MODE":"dcos/jwt+anonymous",
         "PLUGIN_FRAMEWORK_TYPE":"marathon"
      },
      "healthChecks":[
         {
            "path":"/ping",
            "protocol":"HTTP",
            "portIndex":0,
            "gracePeriodSeconds":1800,
            "intervalSeconds":10,
            "timeoutSeconds":5,
            "maxConsecutiveFailures":3,
            "ignoreHttp1xx":false
         }
      ],
      "secrets":{
         "service-credential":{
            "source":"<path-to-secret-name>"
         }
      },
      "labels":{
         "DCOS_SERVICE_NAME":"<non-native-marathon>",
         "DCOS_SERVICE_PORT_INDEX":"0",
         "DCOS_SERVICE_SCHEME":"http"
      },
      "portDefinitions":[
         {
            "port":0,
            "name":"http"
         },
         {
            "port":0,
            "name":"libprocess"
         }
      ],
      "fetch":[
         {
            "uri":"file:///home/<linux-user>/docker.tar.gz"
         }
      ]
    }
    ```

    ### Strict

    ```json
    {
      "id":"/<non-native-marathon>",
      "cmd":"cd $MESOS_SANDBOX && LIBPROCESS_PORT=$PORT1 && /marathon/bin/start --default_accepted_resource_roles \"*,<myrole>\" --enable_features \"vips,task_killing,external_volumes,secrets,gpu_resources\" --framework_name <non-native-marathon> --hostname $LIBPROCESS_IP --http_port $PORT0 --master zk://master.mesos:2181/mesos --max_tasks_per_offer 1 --mesos_leader_ui_url /mesos --mesos_role <myrole>  --zk zk://master.mesos:2181/universe/<non-native-marathon> --mesos_user nobody --mesos_authentication --mesos_authentication_principal <service-account-id>",
      "user":"nobody",
      "cpus":2,
      "mem":4096,
      "disk":0,
      "instances":1,
      "constraints":[
         [
            "hostname",
            "UNIQUE"
         ]
      ],
      "container":{
         "type":"DOCKER",
         "docker":{
            "image":"<your-repo>/marathon-dcos-ee:<your-tag>",
            "network":"HOST",
            "privileged":false,
            "parameters":[

            ],
            "forcePullImage":false
         },
         "volumes":[
            {
               "containerPath":"/opt/mesosphere",
               "hostPath":"/opt/mesosphere",
               "mode":"RO"
            }
         ]
      },
      "env":{
         "JVM_OPTS":"-Xms256m -Xmx2g",
         "DCOS_STRICT_SECURITY_ENABLED":"true",
         "DCOS_SERVICE_ACCOUNT_CREDENTIAL_TOFILE":{
            "secret":"service-credential"
         },
         "MESOS_AUTHENTICATEE":"com_mesosphere_dcos_ClassicRPCAuthenticatee",
         "MESOS_MODULES":"file:///opt/mesosphere/etc/mesos-scheduler-modules/dcos_authenticatee_module.json",
         "MESOS_NATIVE_JAVA_LIBRARY":"/opt/mesosphere/lib/libmesos.so",
         "MESOS_VERBOSE":"true",
         "GLOG_v":"2",
         "PLUGIN_ACS_URL":"https://master.mesos",
         "PLUGIN_AUTHN_MODE":"dcos/jwt",
         "PLUGIN_FRAMEWORK_TYPE":"marathon"
      },
      "healthChecks":[
         {
            "path":"/",
            "protocol":"HTTP",
            "portIndex":0,
            "gracePeriodSeconds":1800,
            "intervalSeconds":10,
            "timeoutSeconds":5,
            "maxConsecutiveFailures":3,
            "ignoreHttp1xx":false
         }
      ],
      "secrets":{
         "service-credential":{
            "source":"<path-to-secret-name>"
         }
      },
      "labels":{
         "DCOS_SERVICE_NAME":"<non-native-marathon>",
         "DCOS_SERVICE_PORT_INDEX":"0",
         "DCOS_SERVICE_SCHEME":"http"
      },
      "portDefinitions":[
         {
            "port":0,
            "name":"http"
         },
         {
            "port":0,
            "name":"libprocess"
         }
      ],
      "fetch":[
         {
            "uri":"file:///home/<linux-user>/docker.tar.gz"
         }
      ]
    }
    ```

1.  Deploy the Marathon instance.

    ```bash
    dcos marathon app add config.json
    ```

# Step 8 - Grant User Access to Non-Native Marathon
In this step, a user is granted access to the non-native Marathon instance.

1. Log into the DC/OS GUI as a user with the `superuser` permission.

   ![Login](/1.10/img/gui-installer-login-ee.gif)

1.  Select **Organization** and choose **Users** or **Groups**.

1.  Select the name of the user or group to grant the permission to.

    ![Add permission cory](/1.10/img/services-tab-user.png)

1.  From the **Permissions** tab click **ADD PERMISSION**.

1.  Click **INSERT PERMISSION STRING** to toggle the dialog.

    ![Add permission](/1.10/img/services-tab-user3.png)

1.  Copy and paste the permission in the **Permissions Strings** field. Choose the permission strings based on your [security mode](/1.10/security/ent/#security-modes).

    ### Disabled

    -   Full access

        ```bash
        dcos:adminrouter:service:<service-name> full
        dcos:service:marathon:<service-name>:services:/ full
        dcos:adminrouter:ops:mesos full
        dcos:adminrouter:ops:slave full
        ```

    -  Access to an individual service or group is not supported in disabled security mode.

    ### Permissive

    -  **Full access**

        ```bash
        dcos:adminrouter:service:<service-name> full
        dcos:service:marathon:<service-name>:services:/ full
        dcos:adminrouter:ops:mesos full
        dcos:adminrouter:ops:slave full
        ```

    -  **Access to an individual service or group**

       Specify the service or group (`<service-or-group>`) and action (`<action>`). Actions can be either `create`, `read`, `update`, `delete`, or `full`. To permit more than one operation, use a comma to separate them, for example: `dcos:service:marathon:<service-name>:services:/<service-or-group> read,update`.

       ```bash
       dcos:adminrouter:service:<service-name> full
       dcos:service:marathon:<service-name>:services:/<service-or-group> <action>
       dcos:adminrouter:ops:mesos full
       dcos:adminrouter:ops:slave full
       ```

    ### Strict

    -  **Full access**

        ```bash
        dcos:adminrouter:service:<service-name> full
        dcos:service:marathon:<service-name>:services:/ full
        dcos:adminrouter:ops:mesos full
        dcos:adminrouter:ops:slave full
        dcos:mesos:agent:executor:app_id:/ read
        dcos:mesos:agent:framework:role:<myrole> read
        dcos:mesos:agent:sandbox:app_id:/ read
        dcos:mesos:agent:task:app_id:/ read
        dcos:mesos:master:executor:app_id:/ read
        dcos:mesos:master:framework:role:<myrole> read
        dcos:mesos:master:task:app_id:/ read
        ```

    -  **Access to an individual service or group**

       Specify the service or group (`<service-or-group>`), service name (`<service-name>`), role (`<myrole>`), and action (`<action>`). Actions can be either `create`, `read`, `update`, `delete`, or `full`. To permit more than one operation, use a comma to separate them, for example: `dcos:service:marathon:<service-name>:services:/<service-or-group> read,update`.

       ```bash
       dcos:adminrouter:service:<service-name> full
       dcos:service:marathon:<service-name>:services:/<service-or-group> <action>
       dcos:adminrouter:ops:mesos full
       dcos:adminrouter:ops:slave full
       dcos:mesos:agent:executor:app_id:/<service-or-group> read
       dcos:mesos:agent:framework:role:<myrole> read
       dcos:mesos:agent:sandbox:app_id:/<service-or-group> read
       dcos:mesos:agent:task:app_id:/<service-or-group> read
       dcos:mesos:master:executor:app_id:/<service-or-group> read
       dcos:mesos:master:framework:role:<myrole> read
       dcos:mesos:master:task:app_id:/<service-or-group> read
       ```


1.  Click **ADD PERMISSIONS** and then **Close**.

# Step 9 - Access the Non-Native Marathon Instance
In this step, you log in as a authorized user to the non-native Marathon DC/OS service.

1.  Launch the non-native Marathon interface at: `http://<master-public-ip>/service/<service-name>/`.

1.  Enter your username and password and click **LOG IN**.

    ![Log in DC/OS](/1.10/img/gui-installer-login-ee.gif)

    You are done!

    ![Marathon on Marathon](/1.10/img/mom-marathon-gui.png)

# Next Steps

After deploying the non-native Marathon with a unique Mesos role, you may wish to use quotas, static reservations, or dynamic reservations to guarantee certain resources to the non-native Marathon instance.

-  Dynamic reservations will take effect once some tasks complete and yield their resources. Alternatively, you can kill some tasks to free the resources.
-  Static reservations will require you to restart the agent and kill all of its tasks.

Please refer to the Apache Mesos documentation for more details.

-  [Reservations](http://mesos.apache.org/documentation/latest/reservation/)
-  [Quotas](https://mesos.apache.org/documentation/latest/quota/)
