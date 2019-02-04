---
layout: layout.pug
excerpt: Installing Marathon-LB using default or custom options for a DC/OS cluster
title: Installing Marathon-LB
# model: /services/marathon-lb/data.yml
# render: mustache
menuWeight: 10
---
# Installing Marathon-LB on DC/OS
You can install Marathon-LB on a DC/OS open source or DC/OS enterprise cluster. You can install the Marathon-LB package and customize its configuration settings using the DC/OS web-based administrative console or by running DC/OS commands in a shell terminal.

## Before you begin
* You must have a DC/OS open source or enterprise cluster with a bootstrap node, at least one master node, and at least one agent node.
* You must have access to the DC/OS web-based administrative console or DC/OS command-line interface.
* You must have an account with administrative privileges to provision a service account and to store a secret to secure the cluster.

If you are installing on DC/OS Enterprise, you must log in as a user with the appropriate permissions for the security mode--disabled, permissive, or strict--associated with the cluster. For more information about the permissions required when using different security modes, see [Permissions reference](/1.12/security/ent/perms-reference/).

## Install with the default configuration options
You can install Marathon-LB with its default configuration settings on a DC/OS open source cluster or on a DC/OS enterprise cluster by using either the DC/OS web-based administrative console or by running DC/OS commands in a shell terminal. 

### To install with the default settings using the web-based DC/OS console:
1. Log in to your DC/OS cluster using a web browser.
1. Click **Catalog** and search for the Marathon-LB package.
1. Select the package, then click **Review & Run** to display the **Edit Configuration** page.
1. Configure the package settings, as needed, using the DC/OS UI or by clicking **JSON Editor** and modifying the app definition manually. 

    For example, you might customize configuration settings to specify a load balancing group name or the specific number of instances to run.

    For more information about customizing the configuration and the configuration settings available, see [Install with custom configuration options](#custom-config-options).

1. Click **Review & Run**.
1. Review the installation notes, then click **Run Service** to deploy the Marathon-LB package.

### To install with the default settings using the DC/OS CLI:
1. Open a terminal and connect to the DC/OS enterprise cluster from a computer where the DC/OS CLI is available.
1. Run the following command to install Marathon-LB with its default configuration settings:

  ```bash
  dcos package install marathon-lb
  ```

Installing with the default configuration options is most appropriate if you are setting up a test environment, preparing a cluster for development, or establishing a basic pilot program before moving components to production.

In most cases, you would instead deploy load balancing with at least a few custom configuration settings, such as virtual host information or SSL certificates. If you are installing load balancing on DC/OS Enterprise using `strict` security, you must also provision a service account with valid credentials to run Marathon-LB. Provisioning a service account with SSL credentials is optional if security for DC/OS Enterprise is `disabled` or in `permissive` mode.

<a name=custom-config-options>

## Install with custom configuration options
You can install Marathon-LB with custom configuration settings on a DC/OS open source cluster or on a DC/OS enterprise cluster. You can specify the custom configuration options by using either the DC/OS web-based administrative console or by running DC/OS commands in a shell terminal. 

Regardless of whether you install using the web-based console or the CLI, the steps are essentially the same as installing with the default configuration options. However, Marathon-LB offers many basic and advanced load balancing settings that you can customize. At a minimum, most organizations customize the load balancing group, virtual network information, secure socket layer certificates and keys, and service account information. For more information about configuration settings and using templates and app definition label, see [High availability template reference]().

### To install with custom configuration settings using the DC/OS CLI:
1. Open a terminal and connect to the DC/OS cluster from a computer where the DC/OS CLI is available.
1. Run the following command to view all of the available Marathon-LB configuration options:

    ``` bash
    dcos package describe --config marathon-lb
    ```
  
      You can redirect the output from this command to a file to save the configuration properties for editing. The default app definition for Marathon-LB looks like this:

    ``` json
    {
      "properties": {
        "marathon-lb": {
          "properties": {
            "auto-assign-service-ports": {
              "default": false,
              "description": "Auto assign service ports for tasks which use IP-per-task. See https://github.com/mesosphere/marathon-lb#mesos-with-ip-per-task-support for details.",
              "type": "boolean"
            },
            "bind-http-https": {
              "default": true,
              "description": "Reserve ports 80 and 443 for the LB. Use this if you intend to use virtual hosts.",
              "type": "boolean"
            },
            "container-syslogd": {
              "default": false,
              "description": "Enable verbose syslogd logging to container stdout. This will also capture all HAProxy http connection and other logs.",
              "type": "boolean"
            },
            "cpus": {
              "default": 2,
              "description": "CPU shares to allocate to each marathon-lb instance.",
              "minimum": 1,
              "type": "number"
            },
            "haproxy-group": {
              "default": "external",
              "description": "HAProxy group parameter. Matches with HAPROXY_GROUP in the app labels.",
              "type": "string"
            },
            "haproxy-map": {
              "default": true,
              "description": "Enable HAProxy VHost maps for fast VHost routing.",
              "type": "boolean"
            },
            "haproxy_global_default_options": {
              "default": "redispatch,http-server-close,dontlognull",
              "description": "Default global options for HAProxy.",
              "type": "string"
            },
            "instances": {
              "default": 1,
              "description": "Number of instances to run.",
              "minimum": 1,
              "type": "integer"
            },
            "marathon-uri": {
              "default": "http://marathon.mesos:8080",
              "description": "URI of Marathon instance",
              "type": "string"
            },
            "max-reload-retries": {
              "default": 10,
              "description": "Max reload retries before failure. Reloads happen every --reload-interval seconds. Set to 0 to disable or -1 for infinite retries.",
              "type": "integer"
            },
            "maximumOverCapacity": {
              "default": 0.2,
              "description": "Maximum over capacity.",
              "minimum": 0,
              "type": "number"
            },
            "mem": {
              "default": 1024.0,
              "description": "Memory (MB) to allocate to each marathon-lb task.",
              "minimum": 256.0,
              "type": "number"
            },
            "minimumHealthCapacity": {
              "default": 0.5,
              "description": "Minimum health capacity.",
              "minimum": 0,
              "type": "number"
            },
            "name": {
              "default": "marathon-lb",
              "description": "Name for this LB instance",
              "type": "string"
            },
            "parameters": {
              "default": [],
              "description": "Docker parameters",
              "items": {
                "properties": {
                  "key": {
                    "type": "string"
                  },
                  "value": {
                    "type": "string"
                  }
                },
                "required": [
                  "key",
                  "value"
                ],
                "type": "object"
              },
              "type": "array"
            },
            "reload-interval": {
              "default": 10,
              "description": "When retry-reload enabled, wait this long before attempting another reload.",
              "type": "integer"
            },
            "role": {
              "default": "slave_public",
              "description": "Deploy marathon-lb only on nodes with this role.",
              "type": "string"
            },
            "secret_name": {
              "default": "",
              "description": "Name of the Secret Store credentials to use for DC/OS service authentication. This should be left empty unless service authentication is needed.",
              "type": "string"
            },
            "ssl-cert": {
              "description": "TLS Cert and private key for HTTPS.",
              "type": "string"
            },
            "strict-mode": {
              "default": false,
              "description": "Enable strict mode. This requires that you explicitly enable each backend with `HAPROXY_{n}_ENABLED=true`.",
              "type": "boolean"
            },
            "sysctl-params": {
              "default": "net.ipv4.tcp_tw_reuse=1 net.ipv4.tcp_fin_timeout=30 net.ipv4.tcp_max_syn_backlog=10240 net.ipv4.tcp_max_tw_buckets=400000 net.ipv4.tcp_max_orphans=60000 net.core.somaxconn=10000",
              "description": "sysctl params to set at startup for HAProxy.",
              "type": "string"
            },
            "template-url": {
              "default": "",
              "description": "URL to tarball containing a directory templates/ to customize haproxy config.",
              "type": "string"
            }
          },
          "required": [
            "cpus",
            "mem",
            "haproxy-group",
            "instances",
            "name"
          ],
          "type": "object"
        }
      },
      "type": "object"
    }
    ```

1. Edit the JSON configuration file with your customizations. 

    You can choose an any file name, However, you might want to choose a file name that includes a package identifier, such as `marathon-lb-options.json`, in the name. 

    For example:
    * Change the CPU shares allocated to each Marathon-LB instance to `3`:

        ```
          "cpus": {
            "default": 3,
            "description": "CPU shares to allocate to each marathon-lb instance.",
            "minimum": 3,
            "type": "number"
          },
        ```

    * Set the load balancing group to `na-external`:

        ```
          "haproxy-group": {
            "default": "na-external",
            "description": "HAProxy group parameter. Matches with HAPROXY_GROUP in the app labels.",
            "type": "string"
          },
        ```

    * Set the memory allocation to `2048`:
        ```
          "mem": {
            "default": 2048.0,
            "description": "Memory (MB) to allocate to each marathon-lb task.",
            "minimum": 2048.0,
            "type": "number"
          },
        ```

1. Run the following command to install Marathon-LB using the settings in the customized `marathon-lb-options.json` file:

  ``` bash
  dcos package install marathon-lb --options=marathon-lb-options.json --yes
  ```

## Install on a cluster with a provisioned service account
If you are installing Marathon-LB on a DC/OS Enterprise cluster, creating a service account is **optional** when the security mode is disabled or permissive. The service account is **required** if the security mode is strict. If the DC/OS cluster uses strict security, you must create a service account and a certificate that authorizes the service account to access Marathon-LB.

To increase the security of your cluster and conform to the principle of least privilege, Mesosphere recommends that you provision a service account even if the cluster runs in disabled or permissive security mode. Note that you must have superuser permission for the cluster to create the service account. 

The following steps summarize how to prepare a service account for running Marathon-LB and how set provision the service account to run a Marathon-LB instance that distributes application instances to agent nodes. If you set up multiple Marathon-LB instances that interact with the same Marathon instance, you can use the same service account for each Marathon-LB instance.
* Create a public-private key pair.
* Create a service account.
* Create a service account secret (optional)
* Provision the service account with the necessary permissions.
* Create a customized configuration file.
* Install Marathon-LB.

If you currently running the cluster in permissive mode and plan to upgrade to strict security in the future, provisioning a service account for Marathon-LB makes upgrading easier.

<a name="create-key-pair">

### Create a public-private key pair
You must generate a 2048-bit RSA public-private key pair to use to encrypt and decrypt certificates for secure socket layer (SSL) connections. One convenient way to generate the key pair is by using the DC/OS Enterprise CLI. The DC/OS command-line interface returns the keys in the `.pem` format required by DC/OS.

1. Open a terminal and connect to the DC/OS enterprise cluster from a computer where the DC/OS CLI is available.

1. Install the DC/OS Enterprise command-line interface (CLI), if necessary.

    ``` bash
    dcos package install dcos-enterprise-cli --yes
    ```

1. Run the following command to create a public-private key pair and save each value into a separate file within the current directory.

    ``` bash
    dcos security org service-accounts keypair mlb-private-key.pem mlb-public-key.pem
    ```

    In this example, `mlb-private-key.pem` is the name of the file containing the private key and `mlb-public-key.pem` is the name of the file containing the public key. Use the modified names to specify the private and public key files. 
 
1. Verify the contents of each file.

### Create a service account
You can create a service account to use with Marathon-LB by running DC/OS Enterprise commands or by using the DC/OS web-based administrative console.

#### To create a service account using the DC/OS Enterprise CLI:
1. Open a terminal and connect to the DC/OS enterprise cluster from a computer where the DC/OS CLI is available.
1. Run the following command to set your login authentication level to superuser.

    ``` bash
    dcos auth login
    ```

1.	Run the following command to create a new service account called `marathon-lb-sa` containing the public key you just generated.

    ``` bash
    dcos security org service-accounts create -p mlb-public-key.pem -d "Marathon-LB service account" marathon-lb-sa
    ```

1. 	Verify your new service account using the following command.

    ``` bash
    dcos security org service-accounts show marathon-lb-sa
    ```

#### To create a service account using the DC/OS Enterprise web-based console:
1. In the DC/OS web interface, navigate to the Organization > Service Accounts tab.
1. Click **New Service Account**.
1. Enter a description and the service account ID. 
1. Copy the contents of the relevant public key file, for example, `mlb-public-key.pem` into the **Public Key** field.

### Create a secret for the service account
For additional security, you can create a secret associated with the service account that contains the private key. You can create the secret by running DC/OS Enterprise commands or by using the DC/OS web-based administrative console.

#### To create a secret for a service account using the DC/OS Enterprise CLI:
1. Open a terminal and connect to the DC/OS enterprise cluster from a computer where the DC/OS CLI is available.
1. Run the following command to set your login authentication level to superuser.

    ``` bash
    dcos auth login
    ```

1. Run one of the following commands to create a new secret called `service-account-secret` in the marathon-lb path. 

    * For **strict** or **permissive** security:

      ``` bash
      dcos security secrets create-sa-secret --strict mlb-private-key.pem marathon-lb-sa marathon-lb/service-account-secret
      ```

    * For **disabled** security:

      ``` bash
      dcos security secrets create-sa-secret mlb-private-key.pem marathon-lb-sa marathon-lb/service-account-secret
      ```

    The full path to the secret for this example is `marathon-lb/service-account-secret`. Locating the secret inside the marathon-lb path ensures that only the Marathon-LB service can access it. The secret will contain the private key, the name of the service account, and other data.

1. Ensure the secret was created successfully:

    ``` bash
    dcos security secrets list /
    ```

    If you have jq 1.5 or later installed, you can also use the following command to retrieve the secret and ensure that it contains the correct service account ID and private key.

      ``` bash
      dcos security secrets get /marathon-lb/service-account-secret --json | jq -r .value | jq
      ```

      If the cluster uses strict or permissive security, verify that the `login_endpoint` URL uses HTTPS protocol. If security is disabled for the cluster, the `login_endpoint` should use HTTP. If the URL begins with `https` and the cluster is in disabled mode, try upgrading the DC/OS Enterprise CLI, deleting the secret, and recreating it.

1. Delete the private key file from your file system.

    After you have stored the private key in the DC/OS secret store, you should delete your copy of the private key to prevent unauthorized users from using it to authenticate to DC/OS.

    ``` bash
    rm -rf mlb-private-key.pem
    ```

#### To create a secret for a service account using the DC/OS web-based console:

1. Log in to the DC/OS web-based administrative console as a user with the superuser permission.
1. Click **System**, then click **Security**.
1. Click **New Secret**.
1. Type `marathon-lb/service-account-secret` into the ID field to create a new secret called `service-account-secret` in the `marathon-lb` path. Locating the secret inside the `marathon-lb` path ensures that only the Marathon-LB service can access it.

    If you have a **strict** or **permissive** cluster, paste the following JSON into the Value field.

    ``` bash
    {
      "scheme": "RS256",
      "uid": "marathon-lb-sa",
      "private_key": "<private-key-value>",
      "login_endpoint": "https://master.mesos/acs/api/v1/auth/login"
    }
    ```

    If you have a **disabled** cluster, paste the following JSON into the Value field.

    ```  bash
    {
      "scheme": "RS256",
      "uid": "marathon-lb-sa",
      "private_key": "<private-key-value>",
      "login_endpoint": "http://master.mesos/acs/api/v1/auth/login"
    }
    ```

1. Replace <private-key-value> with the value of the private key created in [Create a public-private key pair](#create-key-pair).
1. Click **Create** to store the secret.
1. Copy the path to your secret into a text editor. You will need this later.

#### Changing the service name or location
If you are not using `marathon-lb` as the marathon service name or if you are installing Marathon-LB in a custom location, keep in mind that you must change the secret location accordingly. The sample commands also use `marathon-lb/service-account-secret` as the full path for the secret used to store the credentials for the Marathon-LB service account. If you change the `marathon-lb` service name, you must also change this path.

#### Modifying the command strings for storing a secret
If you use the names included in the examples, you can copy and paste the commands directly into a terminal. If you decide to change any names, make sure to modify the commands before issuing them. You should note that storing the secret in the `marathon-lb/service-account-secret` path protects the secret from other services, so Mesosphere recommends you leave the path unchanged.

### Provision the service account with permissions
You can run the following commands to provision the Marathon-LB service account with the required permissions. You can execute these commands from outside of the cluster.

1. Open a terminal and connect to the DC/OS enterprise cluster from a computer where the DC/OS CLI is available.
1. Run the following command to set your login authentication level to superuser.

    ``` bash
    dcos auth login
    ```

1. Grant permissions and allowed actions to the service account using the following commands.

    ``` bash
      dcos security org users grant marathon-lb-sa dcos:service:marathon:marathon:services:/ read
      dcos security org users grant marathon-lb-sa dcos:service:marathon:marathon:admin:events read --description "Allows access to Marathon events"
    ```
    You can optionally specify a description for the permissions granted. However, the `--description` argument is ignored if an access control list (ACL) already exists for the service account you are modifying.

1. Add the service account secret to the configuration file by modifying the `marathon-lb-options.json` file to include the secret name.
    * For **strict** or **permissive** security, copy and paste the following JSON into the `marathon-lb-options.json` file. Replace `marathon-lb/service-account-secret` with the secret name you used, if necessary:

      ``` bash
      {
          "marathon-lb": {
              "secret_name": "marathon-lb/service-account-secret",
              "marathon-uri": "https://marathon.mesos:8443"
          }
      }
      ```

      This example illustrates changing the port used to communicate with Marathon to 8443. Changing the port is not required for clusters configured for `permissive` security. However, changing this setting is recommended because it ensures that communication between Marathon-LB and Marathon is encrypted.

    * For **disabled** security, copy and paste the following JSON into the `marathon-lb-options.json` file. Replace `marathon-lb/service-account-secret` with the secret name you used, if necessary:

      ``` bash
      {
          "marathon-lb": {
              "secret_name": "marathon-lb/service-account-secret"
          }
      }
      ```

### Install Marathon-LB
You can modify other default values before installing the service. To view the configuration options and default values for Marathon-LB, type the following command:

``` bash
dcos package describe --config marathon-lb
```

After you have reviewed the default `config.json` file and modified it to include the appropriate required and optional parameters, use a command similar to the following to install the package with the modified `marathon-lb-options.json` configuration file:

``` bash
dcos package install marathon-lb --options=marathon-lb-options.json --yes
```