---
layout: layout.pug
navigationTitle:  Creating secrets
title: Creating secrets
menuWeight: 1
excerpt: Creating secrets with a key-value pair or file
enterprise: true
render: mustache
model: /mesosphere/dcos/2.0/data.yml
---


You can create secrets in DC/OS by using a key-value pair or as a file. Both methods add a name and secret value to the secret store. You may find it convenient to add a secret as a file if you already have a secret value stored in a file locally and want to avoid copying-and-pasting.

See [Configuring services and pods to use secrets](/mesosphere/dcos/2.0/security/ent/secrets/use-secrets/) for information on how to reference these secrets in your app or pod definition.

<p class="message--important"><strong>IMPORTANT: </strong>The maximum file size for a secret is approximately 1 MB, subtracting approximately 1 KB for the secret store metadata.</p>


# Creating secrets

The sections below explain how to create secrets as both key/value pairs and as files using the UI, CLI, and the Secrets API.

Secrets should include paths, unless you want to allow all services to access its value. See [Spaces](/mesosphere/dcos/2.0/security/ent/#spaces) for more information about secret paths.

## Prerequisites

### DC/OS UI
- The `dcos:superuser` permission.

### DC/OS CLI or Secrets API

- See [Secret Store Permissions](/mesosphere/dcos/2.0/security/ent/perms-reference/#secrets) for the permissions needed to create secrets from the CLI or API. The permissions you configure must include the name of the secret the user is allowed to create. You must have one permission per secret. The secret name and permission name must match.

- [DC/OS CLI installed](/mesosphere/dcos/2.0/cli/install/) and the [DC/OS Enterprise CLI installed](/mesosphere/dcos/2.0/cli/enterprise-cli/#ent-cli-install).

# <a name="ui"></a>Creating key-value pair secrets using the UI

1. Log in to the DC/OS UI as a user with the `dcos:superuser` permission.

1. Open the **Secrets** tab.

1. Click the **+** icon in the top right.

    ![New Secret](/mesosphere/dcos/2.0/img/new-secret.png)

    Figure 1 - New Secret icon

    If you have no current secrets, a **Create Secret** screen will be displayed. Click on the **Create Secret** button.

    ![Create Secret](/mesosphere/dcos/2.0/img/GUI-Secrets-Create-Secret.png)

    Figure 2 - Create Secret button

1. In the **ID** box of the **Create New Secret** screen, type the name of your secret and its path, if any.

    ![Secret ID Keypair](/mesosphere/dcos/2.0/img/GUI-Secrets-Create-New-Keypair.png)

    Figure 3 - Creating a new keypair 

1. Select **Key-Value Pair** as Type.

1. Type or paste the secret into the **Value** box.
    ![Secret ID/Value Fields](/mesosphere/dcos/2.0/img/GUI-Secrets-Create-New-Keypair.png)

    Figure 4 - Creating a new Secret

1. Click **Create Secret**.

Returning to the Secrets screen, you can see that your secret has been deployed.

   ![Secret deployed](/mesosphere/dcos/2.0/img/GUI-Secrets-Secrets-Keypair-Deployed.png)

   Figure 5 - Secret with keypair deployed

# <a name="api"></a>Creating key-value pair secrets using the API

This procedure describes how to create a secret called `my-secret` inside the `developer` path.

<p class="message--note"><strong>NOTE: </strong>You must follow the steps in <a href="/mesosphere/dcos/2.0/security/ent/tls-ssl/get-cert/">Obtaining the DC/OS CA bundle</a> before issuing the curl commands in this section.</p>


1. Use `dcos auth login` log in to the CLI.

1. Use the following command to create the secret.

   ```bash
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -d '{"value":"very-secret"}' $(dcos config show core.dcos_url)/secrets/v1/secret/default/developer/my-secret -H 'Content-Type: application/json'
   ```

# <a name="cli"></a>Creating key/value pair secrets via the DC/OS Enterprise CLI

This procedure describes how to create a key/value pair secret called `my-secret` inside the `developer` path using the DC/OS Enterprise CLI.

1. Use `dcos auth login` to log into the CLI. You can find more information about this command in the [CLI Reference](/mesosphere/dcos/2.0/cli/command-reference/dcos-auth/dcos-auth-login/).

1. Use the following command to create the new secret.

   ```bash
   dcos security secrets create --value=top-secret developer/my-secret
   ```
   

# Creating secrets from a file via the DC/OS Enterprise CLI

This procedure describes how to use a file to create a secret called `my-secret` inside the `developer` path using the DC/OS Enterprise CLI.

The contents of the file (referred to below as `my-secret.txt`) can be any text value.

<p class="message--note"><strong>NOTE: </strong>As of DC/OS 1.10, you can only upload a secret as a file from the DC/OS CLI. The maximum file size for a secret is approximately one MiB, subtracting approximately one KB for the secret store metadata.</p>

1. Use `dcos auth login` to log into the CLI. You can find more information about this command in the [CLI Reference](/mesosphere/dcos/2.0/cli/command-reference/dcos-auth/dcos-auth-login/).

1. Use the following command to create the new secret.

  ```bash
  dcos security secrets create -f my-secret.txt developer/my-secret
  ```

  <p class="message--important"><strong>IMPORTANT: </strong>The maximum file size for a secret is approximately one MB, subtracting approximately one KB for the secret store metadata.</p>

# Creating secrets from a file via the DC/OS UI

This procedure describes how to use a file to create a secret using the DC/OS web interface.

1. Log in to the DC/OS UI as a user with the `dcos:superuser` permission.
1. Click the **Secrets** tab on the left hand navigation menu.
1. Click the **+** icon in the top right.

    ![New Secret](/mesosphere/dcos/2.0/img/new-secret.png)

    Figure 6 - Secrets screen

    If you have no current secrets, a Create Secret screen will be displayed. Click on the **Create Secret** button.

    ![Create Secret](/mesosphere/dcos/2.0/img/GUI-Secrets-Create-Secret.png)

    Figure 7 - Create Secret button

1. In the **ID** box, provide the name of your secret and its path, if any.

    ![Create New Secret](/mesosphere/dcos/2.0/img/GUI-Secrets-Create-New-Secret.png)

    Figure 8 - Create New Secret dialog showing file chosen

1. Select **File** as Type.
1. Click **Choose File**.
1. Find and select the file you wish to create a secret from.
1. Click **Create Secret**.

Returning to the Secrets screen, you can see that your secret has been deployed.

   ![Secret deployed](/mesosphere/dcos/2.0/img/GUI-Secrets-Deployed.jpeg)

   Figure 9-  Secret deployed
