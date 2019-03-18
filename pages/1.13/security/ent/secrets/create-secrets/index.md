---
layout: layout.pug
navigationTitle:  Creating secrets
title: Creating secrets
menuWeight: 0
excerpt: Creating secrets with a key-value pair or file

enterprise: true
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->


You can create secrets in DC/OS by using a key-value pair or as a file. Both methods add a name and secret value to the secret store. You may find it convenient to add a secret as a file if you already have a secret value stored in a file locally and want to avoid cutting-and-pasting.

See [Configuring services and pods to use secrets](/1.13/security/ent/secrets/use-secrets/) for information on how to reference these secrets in your app or pod definition.

# Creating secrets

The sections below explain how to create secrets as both key/value pairs and as files using the web interface, CLI, and the Secrets API.

Secrets should include paths, unless you want to allow all services to access its value. See [Spaces](/1.13/security/ent/#spaces) for more information about secret paths.

## Prerequisites

### DC/OS web interface
- The `dcos:superuser` permission.

### DC/OS CLI or Secrets API

- See [Secret Store Permissions](/1.13/security/ent/perms-reference/#secrets) for the permissions needed to create secrets from the CLI or API. The permissions you configure must include the name of the secret the user is allowed to create. You must have one permission per secret. The secret name and permission name must match.

- [DC/OS CLI installed](/1.13/cli/install/) and the [DC/OS Enterprise CLI installed](/1.13/cli/enterprise-cli/#ent-cli-install).

# <a name="ui"></a>Creating key-value pair secrets using the web interface

1. Log in to the DC/OS web interface as a user with the `dcos:superuser` permission.

1. Open the **Secrets** tab.

1. Click the **+** icon in the top right.

    ![New Secret](/1.13/img/new-secret.png)

    Figure 1. New Secret icon

1. In the **ID** box, provide the name of your secret and its path, if any. 

1. Type or paste the secret into the **Value** box.

    ![Secret ID/Value Fields](/1.13/img/create-secret.png)

    Figure 2. Creating a new Secret

1. Click **Create**.

# <a name="api"></a>Creating key-value pair secrets using the API

This procedure describes how to create a secret called `my-secret` inside the `developer` path.

<p class="message--note"><strong>NOTE: </strong>You must follow the steps in <a href="/1.12/security/ent/tls-ssl/get-cert/">Obtaining the DC/OS CA bundle</a> before issuing the curl commands in this section.</p>


1. Use `dcos auth login` log in to the CLI.

1. Use the following command to create the secret.

   ```bash
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -d '{"value":"very-secret"}' $(dcos config show core.dcos_url)/secrets/v1/secret/default/developer/my-secret -H 'Content-Type: application/json'
   ```

# <a name="cli"></a>Creating key/value pair secrets via the DC/OS Enterprise CLI

This procedure describes how to create a key/value pair secret called `my-secret` inside the `developer` path using the DC/OS Enterprise CLI. 

1. Use `dcos auth login` to log into the CLI. You can find more information about this command in the [CLI Reference](/1.13/cli/command-reference/dcos-auth/dcos-auth-login/).

1. Use the following command to create the new secret.

   ```bash
   dcos security secrets create --value=top-secret developer/my-secret
   ```

# Creating secrets from a file via the DC/OS Enterprise CLI

This procedure describes how to use a file to create a secret called `my-secret` inside the `developer` path using the DC/OS Enterprise CLI.

The contents of the file (referred to below as `my-secret.txt`) can be any text value.

<p class="message--note"><strong>NOTE: </strong>As of DC/OS 1.10, you can only upload a secret as a file from the DC/OS CLI. The maximum file size for a secret is approximately one MiB, subtracting approximately one KB for the secret store metadata.</p>

1. Use `dcos auth login` to log into the CLI. You can find more information about this command in the [CLI Reference](/1.13/cli/command-reference/dcos-auth/dcos-auth-login/).

1. Use the following command to create the new secret.

  ```bash
  dcos security secrets create -f my-secret.txt developer/my-secret
  ```

  <p class="message--important"><strong>IMPORTANT: </strong>The maximum file size for a secret is approximately one MB, subtracting approximately one KB for the secret store metadata.
