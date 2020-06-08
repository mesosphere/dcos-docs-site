---
layout: layout.pug
navigationTitle:  Installing Edge-LB
title: Installing Edge-LB
menuWeight: 5
excerpt: Describes how to install Edge-LB
enterprise: false
---

This section guides you through the basic steps to prepare and install Edge-LB for load balancing in a DC/OS&trade; cluster.

The steps to follow depend on the deployment scenario you want to implement. For example, if you are setting up a demonstration or small-scale cluster for testing, evaluation, or personal use, you can use an account that is a member of the `superusers` group. In this case, you would use the default configuration settings to get started without creating a dedicated service account with specific permissions and a signed certificate.

For most production deployments, however, you should create a unique service account for installing and managing Edge-LB.

# Before you begin
- You must have the [DC/OS CLI](/mesosphere/dcos/2.0/cli/install/) and [DC/OS Enterprise CLI](/mesosphere/dcos/2.0/cli/enterprise-cli/) installed.
- You must be logged in with an account that has `superuser` permission or the permissions listed in [Installation permissions](/mesosphere/dcos/services/edge-lb/1.6/reference/permissions/#installation-permissions).

## Preparing a service account
After you download the package artifacts and add the Edge-LB packages to the repository, you are ready to create and configure permissions for the service account you want to use to manage Edge-LB server and load balancer operations.

If you have successfully downloaded and added Edge-LB packages, you can continue to the instructions for [creating a service account](#create-service-account).

## Editing settings before adding a service account
If you are not configuring a dedicated service account for managing Edge-LB pools, you can begin configuring Edge-LB settings by selecting the Edge-LB tiles in the Catalog, then clicking **Review & Run**.

1. Open the DC/OS web-based console, then click **Catalog**.

1. Type a string such as `edge` in the **Search catalog** field.

1. Click **edgelb** to display the service summary.

1. Click **Review & Run** to edit the Edge-LB configuration settings by modifying the fields displayed, or by selecting JSON Editor to edit the JSON file directly.

1. Click **Review & Run**, then click **Run Service** to install the Edge-LB API server package with the configuration settings you specified.

1. Repeat steps 1 through 4 to configure **Service** settings for the Edge-LB pool.

1. Click **Edgelbpool** to specify the following required properties:
    - count
    - cpus
    - mem
    - disk

    You can specify additional pool configuration properties as needed, then click **Review & Run**.

1. Click **Run Service** to install the Edge-LB pool service.

1. Click **Services** to verify the Edge-LB API and Edge-LB pool services are installed and running.
    <p>
    <img src="/mesosphere/dcos/services/edge-lb/1.6/img/edgelb-deployment-status.png" alt="Configuring Edge-LB API settings">
    </p>

<p class="message--important"><strong>IMPORTANT: </strong>Although you can add and modify settings directly in the web-based console from the Catalog, do not start the services until you have created the service account principal, configured the appropriate permissions, and completed the remaining installation steps. If you attempt to start the Edge-LB pool service without completing the other installation steps, the deployment will start, but it will not be able to resolve to a healthy Running state.</p>

<a name="create-service-account"></a>

# Create a service account
The Edge-LB API server must be associated with a service account so that it can launch Edge-LB pools on public and private nodes, based on user requests. [Service accounts](/mesosphere/dcos/2.0/security/ent/service-auth/) are used in conjunction with public/private key pairs, secrets, permissions, and authentication tokens to provide secure access for services running on DC/OS Enterprise clusters. For DC/OS Open Source clusters Service Accounts provide the service with a login other than the user's login.


## DC/OS Enterprise Service Accounts

Creating a service account for DC/OS Enterprise involves the following steps:
- Create a public/private key pair
- Create a security principal for the service account
- Assign permissions to the service account principal
- Create and store a secret associated with the service account principal

The secret store is used by Edge-LB to retrieve and install SSL certificates on the Edge-LB pools. The SSL certificates enable transport layer security (TLS) for all HTTP-based traffic between client requests and service backends.

### To create a service account for Edge-LB on DC/OS Enterprise
1. Open a shell terminal where you have access to the [DC/OS Enterprise command-line interface (CLI)](/mesosphere/dcos/2.0/cli/enterprise-cli/#installing-the-dcos-enterprise-cli).

1. Create a public/private key pair and save each value into a separate file:

    ```bash
    dcos security org service-accounts keypair edge-lb-private-key.pem edge-lb-public-key.pem
    ```

    This code sample creates the keys in the current directory. You must have write permission for the directory for the command to complete the operation successfully. Executing this command creates a 2048-bit RSA public/private key pair.

1. Create the security principal (`edge-lb-principal`) for the new service account containing the public key (`edge-lb-public-key.pem`) created in the previous step:

    ```bash
    dcos security org service-accounts create -p edge-lb-public-key.pem -d "Edge-LB service account" edge-lb-principal
    ```

1. Verify the new service account:

    ```bash
    dcos security org service-accounts show edge-lb-principal
    ```

    The command displays output similar to the following:

    ```
    description: Edge-LB service account
    is_remote: false
    is_service: true
    provider_id: ''
    provider_type: internal
    public_key: '-----BEGIN PUBLIC KEY-----

        MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAt9cmQPvWq4F/DWDy0HQq

        4wv4eaxKvF7L2do0Cwv3eM01D/W4wEAB7VKLyRCcpZuhCuvwgdblKl2E3ZmdUkTQ

        eJDMIp4QarBy7aeC9XqmHujT+AVsnj4RLsnKq1yGzxNpSGcX4n9IB/dRXZjz+i/z

        yBNA2T3s12FYonThJM+CcRkyforSxkoYlrPj9+fL5V36/1tNl+jP/9q1ZvfOIRPG

        vUPbMw9hXzDDw16rDBFwa91NGddGOGol4/aUTVLYwPoX3f02/cU35rA5qaDcJx92

        6V9627feg55qxCGCqYw6kVVPSiSiUTkhA87PLqOEMIJmMg+V9gxYGRbfZyROPuGU

        5QIDAQAB

        -----END PUBLIC KEY-----'
    ```

1. Create a secret (`dcos-edgelb/edge-lb-secret`) for the service account principal (`edge-lb-principal`) and private key (`edge-lb-private-key.pem`):

    ```bash
    dcos security secrets create-sa-secret edge-lb-private-key.pem edge-lb-principal dcos-edgelb/edge-lb-secret
    ```

    For more information about creating and storing secrets for services, see [Configuring services and pods](/mesosphere/dcos/2.0/security/ent/secrets/use-secrets/) and [Spaces](/mesosphere/dcos/2.0/security/ent/#spaces).

1. List the secrets created:

    ```bash
    dcos security secrets list /
    ```
    The command displays output similar to the following:

    ```
    - dcos-edgelb/edge-lb-secret
    ```

1. Provision the Edge-LB service account with the required permissions by doing one of the following:
    - Adding the service account principal to the `superusers` group.
    - Granting the permissions required to perform specific Edge-LB tasks.

    **Granting all permissions using the superusers group**:  Adding the service account principal (`edge-lb-principal`) to the `superusers` group ensures that the account has sufficient permissions to perform all Edge-LB operations and upgrades. You can add the service account principal to the `superusers` group by running a command similar to the following:

    ```bash
    dcos security org groups add_user superusers edge-lb-principal
    ```

    After adding the service principal to the `supergroups` group, you can continue to [Create a configuration file for service authentication](#create-json) and complete the installation.

    **Granting specific permissions to the service account**:  If you follow the principle of least-privilege, you should not add the service account principal to the `superusers` group. Instead, you should limit the permissions granted to allow only management of DC/OS packages, Marathon tasks, and Edge-LB pool-related activity. You can grant specific permissions to the service account principal using commands similar to the following:

    ```bash
    dcos security org users grant edge-lb-principal dcos:adminrouter:ops:ca:rw full
    dcos security org users grant edge-lb-principal dcos:adminrouter:ops:ca:ro full
    dcos security org users grant edge-lb-principal dcos:adminrouter:service:marathon full
    dcos security org users grant edge-lb-principal dcos:adminrouter:package full
    dcos security org users grant edge-lb-principal dcos:adminrouter:service:edgelb full
    dcos security org users grant edge-lb-principal dcos:service:marathon:marathon:services:/dcos-edgelb full
    dcos security org users grant edge-lb-principal dcos:mesos:master:endpoint:path:/api/v1 full
    dcos security org users grant edge-lb-principal dcos:mesos:master:endpoint:path:/api/v1/scheduler full
    dcos security org users grant edge-lb-principal dcos:mesos:master:framework:principal:edge-lb-principal full
    dcos security org users grant edge-lb-principal dcos:mesos:master:framework:role full
    dcos security org users grant edge-lb-principal dcos:mesos:master:reservation:principal:edge-lb-principal full
    dcos security org users grant edge-lb-principal dcos:mesos:master:reservation:role full
    dcos security org users grant edge-lb-principal dcos:mesos:master:volume:principal:edge-lb-principal full
    dcos security org users grant edge-lb-principal dcos:mesos:master:volume:role full
    dcos security org users grant edge-lb-principal dcos:mesos:master:task:user:root full
    dcos security org users grant edge-lb-principal dcos:mesos:master:task:app_id full
    dcos security org users grant edge-lb-principal 'dcos:secrets:default:/dcos-edgelb/*' full
    dcos security org users grant edge-lb-principal 'dcos:secrets:list:default:/dcos-edgelb/*' full
    ```

    These sample permissions also enable Edge-LB pool framework schedulers to register with Mesos master nodes and to launch load-balancer tasks. You must also grant the following permission for **each Edge-LB pool** created:

    ```bash
    dcos security org users grant edge-lb-principal dcos:adminrouter:service:dcos-edgelb/pools/<pool-name> full
    ```

    For more information about the permissions required to perform specific tasks, see the Edge-LB [Permissions](/services/edge-lb/1.6/reference/permissions) reference section.

After you have created a service account principal, stored the certificate as a secret, and assigned appropriate permissions, you are ready to [create a configuration file](#create-json) and complete the installation.

### DC/OS Open Source Service Accounts
Creating a service account for DC/OS Open Source involves the following steps:
- Create a public/private key pair
- Create a security principal for the service account

### To create a service account for Edge-LB on DC/OS Open Source
1. Open a shell terminal where you have access to the [DC/OS command-line interface (CLI)](/mesosphere/dcos/2.0/cli/install/#prerequisites), curl, openssl, and sed.

1. Create a public/private key pair and save each value into a separate file:

    ```bash
    openssl genpkey -algorithm RSA -out private-key.pem -pkeyopt rsa_keygen_bits:2048
    openssl rsa -pubout -in private-key.pem -out public-key.pem
    ```

    This code sample creates the keys in the current directory. You must have write permission for the directory for the command to complete the operation successfully. Executing this command creates a 2048-bit RSA public/private key pair.

1. Create the security principal (`edge-lb-principal`) for the new service account containing the public key (`edge-lb-public-key.pem`) created in the previous step:

    ```bash
    curl \
        --insecure \
        --header "Authorization: token=$(dcos config show core.dcos_acs_token)" \
        --header 'Content-Type: application/json' "$(dcos config show core.dcos_url)/acs/api/v1/users/edge-lb-principal" \
        --request PUT \
        --data '{"public_key": "'"$(sed ':a;N;$!ba;s/\n/\\n/g' public-key.pem)"'"}'
    ```

After you have created a service account principal, stored the certificate as a secret, and assigned appropriate permissions, you are ready to [create a configuration file](#create-json) and complete the installation.


<a name="create-json"></a>

# Create a configuration file for service authentication
After configuring service authentication, you must create a JSON options file with your credentials. This file is passed to DC/OS when you install Edge-LB.

1. For DC/OS Enterprise, open a new file for Edge-LB configuration options in a text editor.

    For example:
    ```bash
    vi edge-lb-options.json
    ```

    Edit the file to specify the service account secret (`dcos-edgelb/edge-lb-secret`) that you created earlier.

    ```json
    {
      "service": {
        "secretName": "dcos-edgelb/edge-lb-secret",
        "principal": "edge-lb-principal"
      }
    }
    ```

    For DC/OS Open Source specify the `dcosServiceAccountCreds` directly, newlines in the `private-key.pem` must be embeded. The simplist way to do this is using `bash` redirection:

    ```sh
    tee edge-lb-options.json <<EOF
    {
      "service": {
        "dcosServiceAccountCreds": "{\"login_endpoint\": \"http://leader.mesos/acs/api/v1/auth/login\", \"private_key\": \"$(sed ':a;N;$!ba;s/\n/\\\\n/g' private-key.pem)\", \"uid\": \"edge-lb-principal\"}"
      }
    }
    EOF
    ```

1. Specify other configuration settings, as needed.

    <p class="message--note"><strong>NOTE: </strong>If you are using the install --options= approach and you modify the service name to be other than the default, edgelb, then you must be explicit when specifying the service name when you use any "dcos edgelb xxxx" commands.</p>

    As an example of this effect, suppose you deployed a service with the JSON configuration file:
    ```json
    {
      "service": {
        "name": "dcos-edgelb/api",
        "secretName": "dcos-edgelb/edge-lb-secret",
        "principal": "edge-lb-principal"
      }
    }
    ```
    This command creates a service called `dcos-edgelb/api` from the Edge-LB service's point of view. But that service name causes creation of the <strong>task</strong> name, `dcos-edgelb/api/api`, which could become confusing! The string value, /api, is always (implicitly) appended to the name.

    As an alternative, after creating the edge-lb-options.json file and installing the edgelb/api service, execute the following command to rename the service so that you don't have to track the name:

    ``` bash
    dcos config set edgelb.service_name "dcos-edgelb"
    ```

    Examples of other configuration settings you can change include specifying the service path for the `apiserver` where `dcos-edgelb` corresponds to the `pool.namespace` when [configuring pools](/mesosphere/dcos/services/edge-lb/1.6/reference/pool-configuration-reference/). Other common configuration settings specify the CPU, memory, disk, and log level (`debug`, `info`, `warn`, or `error`) as shown here.

    ```json
    {
        "service": {
            "name": "dcos-edgelb/api",
            "cpus": 1,
            "mem": 1024,
            "disk": 10,
            "mesosProtocol": "https",
            "mesosAuthNZ": true,
            "logLevel": "info"
        }
    }
    ```

1. Save the configuration file.

1. Add the configuration file to source control so that you can update configuration at a later time.

# Install Edge-LB
After you have added the packages to the cluster catalog, created a secure service account, and configured settings for Edge-LB in a JSON file, you can install Edge-LB to begin creating and managing load balancing pools.

1. Install Edge-LB using the command:

    ```bash
    dcos package install --options=edge-lb-options.json edgelb
    ```

   This command prompts you to accept the terms and conditions to continue.

    ```
    By Deploying, you agree to the Terms and Conditions https://d2iq.com/catalog-terms-conditions/#certified-services
    Continue installing? [yes/no]
    ```

1. Enter yes to continue and review the output.

    ```
    Installing Marathon app for package [edgelb] version [v1.6.0]
    Installing CLI subcommand for package [edgelb] version [v1.6.0]
    New command available: dcos edgelb
    DC/OS edgelb is being installed!
    ```

1. Run a command similar to the following to determine whether the Edge-LB service is ready for use:

    ```bash
    until dcos edgelb ping; do sleep 1; done
    ```

    When Edge-LB is ready, the ping command should return the `pong` response in standard output (`stdout`).

- For more information about configuring Edge-LB, see the Edge-LB [pool configuration](/mesosphere/dcos/services/edge-lb/1.6/reference/pool-configuration-reference) reference section.

- For more information about the available Edge-LB commands, see the Edge-LB [command-line](/mesosphere/dcos/services/edge-lb/1.6/reference/cli-reference) reference section.
