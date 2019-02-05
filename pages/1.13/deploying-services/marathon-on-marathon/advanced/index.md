---
layout: layout.pug
navigationTitle:  Deploying Services using a Custom Marathon with Security Features
title: Deploying Services using a Custom Marathon with Security Features
menuWeight: 40
excerpt: Using an advanced, non-native instance of Marathon
enterprise: true

---

This topic describes how to deploy a non-native instance of Marathon (Marathon on Marathon) with isolated roles, reservations, quotas, and security features. The advanced non-native Marathon procedure should only be used if you require [secrets](/1.12/security/ent/secrets/) or fine-grain ACLs. Otherwise, use the [basic procedure](/1.12/deploying-services/marathon-on-marathon/basic/).

For this procedure, we are assuming that you have obtained an enterprise version of Marathon from a support team member. If you still need the enterprise artifact, you will want to first file a ticket via the [Mesosphere support portal](https://support.mesosphere.com/s/). The enterprise artifact is delivered as a Docker image file and contains Marathon plus plugins for Marathon that enable DC/OS Enterprise features - such as secrets and fine-grained access control.

**Prerequisites:**

-  DC/OS and DC/OS CLI [installed](/1.12/installing/).
-  [DC/OS Enterprise CLI 0.4.14 or later](/1.12/cli/enterprise-cli/#ent-cli-install).
-  A private Docker registry that each private DC/OS agent can access over the network. You can follow [these](/1.12/deploying-services/private-docker-registry/) instructions for how to set up in Marathon, or use another option such as [DockerHub](https://hub.docker.com/), [Amazon EC2 Container Registry](https://aws.amazon.com/ecr/), and [Quay](https://quay.io/)).
-  Custom non-native Marathon image [deployed in your private Docker registry](/1.12/deploying-services/private-docker-registry#tarball-instructions). File a ticket with via the [support portal](https://support.mesosphere.com) to obtain the enterprise Marathon image file.
-  You must be logged in as a superuser.
-  SSH access to the cluster.

<a name="variables-in-example"></a>
**Variables in this example**

Throughout this page, you will be instructed to invoke commands or take actions that will use cluster-specific-values. We refer to these cluster-specific-values using the `${VARIABLE}` notation; please substitute the following variables the appropriate value for your cluster.

The following table contains all the variables used in this page:

| Variable | Description |
|--------------------------|--------------------------------------------|
| `${MESOS_ROLE}` | The name of the [Mesos Role](https://mesos.apache.org/documentation/latest/roles/) that the new Marathon instance will use. This should be all lowercase, and be a valid [Mesos role name](https://mesos.apache.org/documentation/latest/roles/#invalid-role-names), for example `"marathon_ee"`. |
| `${SERVICE_ACCOUNT}` | The name of the [Service Account](/1.12/security/ent/service-auth/) that Marathon will use to communicate with the other services in DC/OS. The name should include only letters, numbers, `@`, `.`, `\`, `_`, and `-`. For example `"marathon_user_ee"` |
| `${MARATHON_INSTANCE_NAME}` | The service name of your new Marathon instance, as launched by the root Marathon instance. This should be a valid [Marathon service name](https://mesosphere.github.io/marathon/docs/application-basics.html), for example `"mom_ee"`. |
| `${SERVICE_ACCOUNT_SECRET}` | The path of the secret in the [Secret Store](/1.12/security/ent/secrets/) to hold the private key that Marathon will use along with the `${SERVICE_ACCOUNT}` account to authenticate on DC/OS. This name **must not** contain a leading `/`. A valid example: `"marathon_user_ee_secret"` |
| `${DOCKER_REGISTRY_SECRET}` | The name of the [Secret](/1.12/security/ent/secrets/) to hold the credentials for fetching the Marathon Docker image from the private registry. This name **must not** contain a leading `/`. A valid example: `"registry_secret"`. |
| `${PRIVATE_KEY}` | The path to a PEM formatted private key file (in your local file system, existing or not), ideally suffixed with `.pem` |
| `${PUBLIC_KEY}` | The path to a PEM formatted public key file (in your local file system, existing or not), ideally suffixed with `.pem` |
| `${MARATHON_IMAGE}` | The name of the Marathon image **in your private repository**, for example `private-repo/marathon-dcos-ee`. |
| `${MARATHON_TAG}` | The Docker image tag of the Marathon version that you want to deploy. For example `v1.5.11_1.10.2` (version 0.11.0 or newer).  |

**Note:** If you are working on a Mac OS or Linux machine, you can pre-define most of the above variables in your terminal session and just copy and paste the snippets in your terminal:

```
set -a
MESOS_ROLE="..."
SERVICE_ACCOUNT="..."
BEGIN_PORT="..."
END_PORT="..."
MARATHON_INSTANCE_NAME="..."
SERVICE_ACCOUNT_SECRET="..."
DOCKER_REGISTRY_SECRET="..."
PRIVATE_KEY="..."
PUBLIC_KEY="..."
MARATHON_IMAGE="..."
MARATHON_TAG="..."
```


# Step 1: Preparation

For the following steps, we are assuming that you have already:

1. Pushed the Marathon enterprise image to your private registry [(Instructions)](/1.12/deploying-services/private-docker-registry#tarball-instructions), under the name `${MARATHON_IMAGE}:${MARATHON_TAG}`.
1. Stored your private Docker credentials in the secrets store [(Instructions)](/1.12/deploying-services/private-docker-registry/#referencing-private-docker-registry-credentials-in-the-secrets-store-enterprise), under the name `${DOCKER_REGISTRY_SECRET}`.

    **Warning:** The name of the secret should either be in the root path (ex. `/some-secret-name`) or prefixed with the name of your app (ex. `/${MARATHON_INSTANCE_NAME}/some-secret-name`). Failing to do so, will make root Marathon unable to read the secret value and will fail to launch your custom Marathon-on-Marathon instance.

# Step 2: Create a Marathon Service Account
In this step, a Marathon [Service Account](/1.12/security/ent/service-auth/) is created. This account will be used by Marathon to authenticate on the rest of DC/OS components. The permissions later given to this account are going to define what Marathon is allowed to do.

Depending on your [security mode](/1.12/security/ent/#security-modes), a Marathon Service Account is either optional or required.

| Security Mode | Marathon Service Account |
|---------------|--------------------------|
| Permissive | Optional |
| Strict | Required |

1.  Create a 2048-bit RSA private and public key pair (`${PRIVATE_KEY}` and `${PUBLIC_KEY}`) and save each value into a separate file within the current directory.

    With the following command, we create a pair of private and public keys. The public key will be used to create the Marathon service account. The private key we will store in the [secret store](/1.12/security/ent/secrets/) and later passed to Marathon so it can authorize itself using this account.

    ```bash
    dcos security org service-accounts keypair ${PRIVATE_KEY} ${PUBLIC_KEY}
    ```

1.  Create a new service account called `${SERVICE_ACCOUNT}`, using the public key we generated (`${PUBLIC_KEY}`).

    ```bash
    dcos security org service-accounts create -p ${PUBLIC_KEY} -d "Marathon-on-Marathon User" ${SERVICE_ACCOUNT}
    ```


# Step 3: Create a Service Account Secret
In this step, a secret is created for the Marathon service account and stored in the Secret Store.

  The secret created (`${SERVICE_ACCOUNT_SECRET}`) will contain the private key (`${PRIVATE_KEY}`) and the name of the service account (`${SERVICE_ACCOUNT}`). This information will be used by Marathon to authenticate against DC/OS.

  ## {.tabs}

  ### Permissive

  ```bash
  dcos security secrets create-sa-secret ${PRIVATE_KEY} ${SERVICE_ACCOUNT} ${SERVICE_ACCOUNT_SECRET}
  ```

  ### Strict

  ```bash
  dcos security secrets create-sa-secret --strict ${PRIVATE_KEY} ${SERVICE_ACCOUNT} ${SERVICE_ACCOUNT_SECRET}
  ```

  #### Recommendations

  * Make sure that your secret is in place, using the following command:

     ```bash
     dcos security secrets list /
     ```

  *  Review your secret to ensure that it contains the correct service account ID, private key, and `login_endpoint` URL. If you're in `strict` it should be HTTPS, in `permissive` mode it should be HTTP. If the URL is incorrect, try [upgrading the DC/OS Enterprise CLI](/1.12/cli/enterprise-cli/#ent-cli-upgrade), deleting the secret, and recreating it.

      You can use this commands to view the contents (requires [jq 1.5 or later](https://stedolan.github.io/jq/download) installed):

      ```bash
      dcos security secrets get ${SERVICE_ACCOUNT_SECRET} --json | jq -r .value | jq
      ```

  *  Delete the private key file from your file system to prevent bad actors from using the private key to authenticate into DC/OS.


# Step 4: Assign Permissions (Strict mode only)
In this step, permissions are assigned to the Marathon-on-Marathon instance. Permissions are required in strict mode and are ignored in other security modes.

| Security Mode | Permissions |
|---------------|----------------------|
| Permissive | Not available |
| Strict | Required |

All CLI commands can also be executed via the [IAM API](/1.12/security/ent/iam-api/).

Grant service account `${SERVICE_ACCOUNT}` permission to launch Mesos tasks that will execute as Linux user `nobody`.

To allow executing tasks as a different Linux user, replace `nobody` with that user's Linux user name. For example, to launch tasks as Linux user `bob`, replace `nobody` with `bob` below.

Note that the `nobody` and `root` users exist on all agents by default; if a custom user is specified (e.g. `bob`), then the user `bob` will need to be manually created on every agent on which tasks can be executed (e.g. using the Linux `adduser` or a similar utility).

```bash
dcos security org users grant ${SERVICE_ACCOUNT} dcos:mesos:master:task:user:nobody create --description "Tasks can execute as Linux user nobody"
dcos security org users grant ${SERVICE_ACCOUNT} dcos:mesos:master:framework:role:${MESOS_ROLE} create --description "Controls the ability of ${MESOS_ROLE} to register as a framework with the Mesos master"
dcos security org users grant ${SERVICE_ACCOUNT} dcos:mesos:master:reservation:role:${MESOS_ROLE} create --description "Controls the ability of ${MESOS_ROLE} to reserve resources"
dcos security org users grant ${SERVICE_ACCOUNT} dcos:mesos:master:volume:role:${MESOS_ROLE} create --description "Controls the ability of ${MESOS_ROLE} to access volumes"
dcos security org users grant ${SERVICE_ACCOUNT} dcos:mesos:master:reservation:principal:${SERVICE_ACCOUNT} delete --description "Controls the ability of ${SERVICE_ACCOUNT} to reserve resources"
dcos security org users grant ${SERVICE_ACCOUNT} dcos:mesos:master:task:app_id:/ create --description "Controls the ability to launch tasks"
dcos security org users grant ${SERVICE_ACCOUNT} dcos:mesos:master:volume:principal:${SERVICE_ACCOUNT} delete --description "Controls the ability of ${SERVICE_ACCOUNT} to access volumes"
```

# Step 5: Install a Non-Native Marathon Instance with Assigned Role {.tabs}
In this step, a non-native Marathon instance is installed on DC/OS with the Mesos role assigned.

1.  Create a custom JSON config that will be used to install the custom non-native Marathon instance. The JSON file contents vary according to your [security mode](/1.12/security/ent/#security-modes).

    Make sure you replace all the `${VARIABLES}` in the JSON file with the correct values for your case.

    Alternatively, if you have exported the variables in your terminal session (as explained in the [Variables Section](#variables-in-example)), you can use the following command to automatically replace all the substitute variables with their exported value. The resulting file will be saved as `marathon-filled.json`:

    ```bash
    perl -p -e 's/\$\{(\w+)\}/(exists $ENV{$1}?$ENV{$1}:"<missing-variable-$1>")/eg' < marathon.json > marathon-filled.json
    ```

    ## {.tabs}

    ### Permissive

    Use the following JSON template if you are running a cluster in `permissive` security mode. Do not forget to **replace** all the environment variables that follow the `${VARIABLES}` format:

    ```json
    {
      "id":"/${MARATHON_INSTANCE_NAME}",
      "cmd":"cd $MESOS_SANDBOX && LIBPROCESS_PORT=$PORT1 && /marathon/bin/start --default_accepted_resource_roles \"*,${MESOS_ROLE}\" --enable_features \"vips,task_killing,external_volumes,secrets,gpu_resources\" --framework_name ${MARATHON_INSTANCE_NAME} --hostname $LIBPROCESS_IP --http_port $PORT0 --master zk://master.mesos:2181/mesos --max_instances_per_offer 1 --mesos_leader_ui_url /mesos --mesos_role ${MESOS_ROLE}  --zk zk://master.mesos:2181/universe/${MARATHON_INSTANCE_NAME} --mesos_user nobody --mesos_authentication --mesos_authentication_principal ${SERVICE_ACCOUNT}",
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
         "type": "MESOS",
         "docker":{
            "image":"${MARATHON_IMAGE}:${MARATHON_TAG}",
            "pullConfig": {
                "secret": "docker-registry-credential"
            }
         }
      },
      "env":{
         "JVM_OPTS":"-Xms256m -Xmx2g",
         "DCOS_STRICT_SECURITY_ENABLED":"false",
         "DCOS_SERVICE_ACCOUNT_CREDENTIAL":{
            "secret":"service-credential"
         },
         "MESOS_AUTHENTICATEE":"com_mesosphere_dcos_ClassicRPCAuthenticatee",
         "MESOS_MODULES":"{\"libraries\":[{\"file\":\"/opt/libmesos-bundle/lib/libdcos_security.so\",\"modules\":[{\"name\":\"com_mesosphere_dcos_ClassicRPCAuthenticatee\"}]}]}",
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
            "source":"${SERVICE_ACCOUNT_SECRET}"
         },
         "docker-registry-credential": {
            "source":"${DOCKER_REGISTRY_SECRET}"
         }
      },
      "labels":{
         "DCOS_SERVICE_NAME":"${MARATHON_INSTANCE_NAME}",
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
      ]
    }
    ```

    ### Strict

    Use the following JSON template if you are running a cluster in `strict` security mode. Don't forget to **replace** all the environment variables that follow the `${VARIABLES}` format:

    ```json
    {
      "id":"/${MARATHON_INSTANCE_NAME}",
      "cmd":"cd $MESOS_SANDBOX && LIBPROCESS_PORT=$PORT1 && /marathon/bin/start --default_accepted_resource_roles \"*,${MESOS_ROLE}\" --enable_features \"vips,task_killing,external_volumes,secrets,gpu_resources\" --framework_name ${MARATHON_INSTANCE_NAME} --hostname $LIBPROCESS_IP --http_port $PORT0 --master zk://master.mesos:2181/mesos --max_instances_per_offer 1 --mesos_leader_ui_url /mesos --mesos_role ${MESOS_ROLE}  --zk zk://master.mesos:2181/universe/${MARATHON_INSTANCE_NAME} --mesos_user nobody --mesos_authentication --mesos_authentication_principal ${SERVICE_ACCOUNT}",
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
         "type": "MESOS",
         "docker":{
            "image":"${MARATHON_IMAGE}:${MARATHON_TAG}",
            "pullConfig": {
                "secret": "docker-registry-credential"
            }
         }
      },
      "env":{
         "JVM_OPTS":"-Xms256m -Xmx2g",
         "DCOS_STRICT_SECURITY_ENABLED":"true",
         "DCOS_SERVICE_ACCOUNT_CREDENTIAL":{
            "secret":"service-credential"
         },
         "MESOS_AUTHENTICATEE":"com_mesosphere_dcos_ClassicRPCAuthenticatee",
         "MESOS_MODULES":"{\"libraries\":[{\"file\":\"/opt/libmesos-bundle/lib/libdcos_security.so\",\"modules\":[{\"name\":\"com_mesosphere_dcos_ClassicRPCAuthenticatee\"}]}]}",
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
            "source":"${SERVICE_ACCOUNT_SECRET}"
         },
         "docker-registry-credential": {
            "source":"${DOCKER_REGISTRY_SECRET}"
         }
      },
      "labels":{
         "DCOS_SERVICE_NAME":"${MARATHON_INSTANCE_NAME}",
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
      ]
    }
    ```

1.  Deploy the Marathon instance, passing the JSON file you created in the previous step.

    ```bash
    dcos marathon app add marathon-filled.json
    ```

# Step 6: Grant User Access to Non-Native Marathon
By now, your new Marathon instance is accessible only by the DC/OS superusers. In order to give access to regular users, you need to explicitly give them access permissions, according to your cluster security mode:

  ## {.tabs}

  ### Permissive

  For each `${USER_ACCOUNT}` that you want to give access, if you are running a cluster in `permissive` security mode, depending on what kind of permissions you want to give:

  - To give **full** permissions to any service (or a group) that runs on the newly created Marathon:

    ```bash
    # Access to the new Marathon service under `/service/<name>` URL
    dcos security org users grant ${USER_ACCOUNT} dcos:adminrouter:service:${MARATHON_INSTANCE_NAME} full
    dcos security org users grant ${USER_ACCOUNT} dcos:service:marathon:${MARATHON_INSTANCE_NAME}:services:/ full

    # Access to the Mesos tasks and their sandbox
    dcos security org users grant ${USER_ACCOUNT} dcos:adminrouter:ops:mesos full
    dcos security org users grant ${USER_ACCOUNT} dcos:adminrouter:ops:slave full

    # (Optionally) Access to the Marathon instance that runs on the root
    # Marathon and can be controlled via the DC/OS UI
    dcos security org users grant ${USER_ACCOUNT} dcos:adminrouter:service:marathon full
    dcos security org users grant ${USER_ACCOUNT} dcos:service:marathon:marathon:services:/${MARATHON_INSTANCE_NAME} full
    ```

  - To give permissions to an **individual** service (or a group) that runs on the newly created Marathon and is named `${CHILD_SERVICE_NAME}`:

    ```bash
    # Access to the new Marathon service under `/service/<name>` URL
    dcos security org users grant ${USER_ACCOUNT} dcos:adminrouter:service:${MARATHON_INSTANCE_NAME} full
    dcos security org users grant ${USER_ACCOUNT} dcos:service:marathon:${MARATHON_INSTANCE_NAME}:services:/${CHILD_SERVICE_NAME} full

    # Access to the Mesos tasks and their sandbox
    dcos security org users grant ${USER_ACCOUNT} dcos:adminrouter:ops:mesos full
    dcos security org users grant ${USER_ACCOUNT} dcos:adminrouter:ops:slave full

    # (Optionally) Access to the Marathon instance that runs on the root
    # Marathon and can be controlled via the DC/OS UI
    dcos security org users grant ${USER_ACCOUNT} dcos:adminrouter:service:marathon full
    dcos security org users grant ${USER_ACCOUNT} dcos:service:marathon:marathon:services:/${MARATHON_INSTANCE_NAME} full
    ```

  ### Strict

  For each `${USER_ACCOUNT}` that you want to give access, if you are running a cluster in `strict` security mode, depending on what kind of permissions you want to give:

  - To give **full** permissions to any service (or a group) that runs on the newly created Marathon:

    ```bash
    # Access to the new Marathon service under `/service/<name>` URL
    dcos security org users grant ${USER_ACCOUNT} dcos:adminrouter:service:${MARATHON_INSTANCE_NAME} full
    dcos security org users grant ${USER_ACCOUNT} dcos:service:marathon:${MARATHON_INSTANCE_NAME}:services:/ full

    # Access to the Mesos tasks and their sandbox
    dcos security org users grant ${USER_ACCOUNT} dcos:adminrouter:ops:mesos full
    dcos security org users grant ${USER_ACCOUNT} dcos:adminrouter:ops:slave full
    dcos security org users grant ${USER_ACCOUNT} dcos:mesos:agent:executor:app_id:/ read
    dcos security org users grant ${USER_ACCOUNT} dcos:mesos:agent:framework:role:${MESOS_ROLE} read
    dcos security org users grant ${USER_ACCOUNT} dcos:mesos:agent:sandbox:app_id:/ read
    dcos security org users grant ${USER_ACCOUNT} dcos:mesos:agent:task:app_id:/ read
    dcos security org users grant ${USER_ACCOUNT} dcos:mesos:master:executor:app_id:/ read
    dcos security org users grant ${USER_ACCOUNT} dcos:mesos:master:framework:role:${MESOS_ROLE} read
    dcos security org users grant ${USER_ACCOUNT} dcos:mesos:master:task:app_id:/ read

    # (Optionally) Access to the Marathon instance that runs on the root
    # Marathon and can be controlled via the DC/OS UI
    dcos security org users grant ${USER_ACCOUNT} dcos:adminrouter:service:marathon full
    dcos security org users grant ${USER_ACCOUNT} dcos:service:marathon:marathon:services:/${MARATHON_INSTANCE_NAME} full
    ```

  - To give permissions to an **individual** service (or a group) that runs on the newly created Marathon and is named `${CHILD_SERVICE_NAME}`:

    ```bash
    # Access to the new Marathon service under `/service/<name>` URL
    dcos security org users grant ${USER_ACCOUNT} dcos:adminrouter:service:${MARATHON_INSTANCE_NAME} full
    dcos security org users grant ${USER_ACCOUNT} dcos:service:marathon:${MARATHON_INSTANCE_NAME}:services:/${CHILD_SERVICE_NAME} full

    # Access to the Mesos tasks and their sandbox
    dcos security org users grant ${USER_ACCOUNT} dcos:adminrouter:ops:mesos full
    dcos security org users grant ${USER_ACCOUNT} dcos:adminrouter:ops:slave full
    dcos security org users grant ${USER_ACCOUNT} dcos:mesos:agent:executor:app_id:/${CHILD_SERVICE_NAME} read
    dcos security org users grant ${USER_ACCOUNT} dcos:mesos:agent:framework:role:${MESOS_ROLE} read
    dcos security org users grant ${USER_ACCOUNT} dcos:mesos:agent:sandbox:app_id:/${CHILD_SERVICE_NAME} read
    dcos security org users grant ${USER_ACCOUNT} dcos:mesos:agent:task:app_id:/${CHILD_SERVICE_NAME} read
    dcos security org users grant ${USER_ACCOUNT} dcos:mesos:master:executor:app_id:/${CHILD_SERVICE_NAME} read
    dcos security org users grant ${USER_ACCOUNT} dcos:mesos:master:framework:role:${MESOS_ROLE} read
    dcos security org users grant ${USER_ACCOUNT} dcos:mesos:master:task:app_id:/${CHILD_SERVICE_NAME} read

    # (Optionally) Access to the Marathon instance that runs on the root
    # Marathon and can be controlled via the DC/OS UI
    dcos security org users grant ${USER_ACCOUNT} dcos:adminrouter:service:marathon full
    dcos security org users grant ${USER_ACCOUNT} dcos:service:marathon:marathon:services:/${MARATHON_INSTANCE_NAME} full
    ```


# Step 7: Access the Non-Native Marathon Instance
In this step, you log in as a authorized user to the non-native Marathon DC/OS service.

1.  Launch the non-native Marathon interface at: `http://<master-public-ip>/service/${SERVICE_ACCOUNT}/`.

1.  Enter your username and password and click **LOG IN**.

    ![Log in DC/OS](/1.12/img/LOGIN-EE-Modal_View-1_12.png)

    Figure 4. You are done!

    ![Marathon on Marathon](/1.12/img/mom-marathon-gui.png)


# Next Steps

- You can configure the DC/OS CLI to interact with your non-native Marathon instance using the following command:

    ```sh
    dcos config set marathon.url \
      $(dcos config show core.dcos_url)/service/${MARATHON_INSTANCE_NAME}
    ```

    Now any future `dcos marathon ...` commands will target your new marathon instance.

    To undo this change, use the following command:

    ```sh
    dcos config unset marathon.url
    ```


# Known pitfalls

- When launching docker containers, the user `nobody` may not have enough rights to successfully run. For example, starting an `nginx` Docker container as the user `nobody` will fail because `nobody` does not have write permissions to `/var/log`, which `nginx` needs.

- User `nobody` has different UIDs on different systems (99 on coreos, 65534 on ubuntu). Depending on the agent's distribution, you may need to modify the container image so that UIDs match! The same goes if you use the user `bob`.

- When using custom users (e.g. `bob`), the user must exist on the agent, or in the case of using containers, within the container.

- When using a new user (e.g. `bob`), remember to give the Marathon service account permissions to run tasks as this user.
