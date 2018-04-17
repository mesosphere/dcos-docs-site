---
layout: layout.pug
navigationTitle:  Creating secrets
title: Creating secrets
menuWeight: 0
excerpt:

enterprise: true
---


# About creating secrets

The permissions needed to create a secret vary by interface. 

- **DC/OS GUI:** `dcos:superuser` 

- **[DC/OS CLI](/1.9/cli/) or [Secrets API](/1.9/security/ent/secrets/secrets-api/):** <code>dcos:secrets:default:[/<i>path</i>]/<i>name</i> create</code> (minimum permission), or <code>dcos:secrets:default:[/<i>path</i>]/<i>name</i> full</code>. The permission must include the name of the secret the user is allowed to create. Users need one permission per secret. The secret itself does not need to exist yet, but when it is created its name must match the name in the permission.

Secret should include paths, unless you want to allow all services to access its value. See [Spaces](/1.9/security/ent/#spaces) for more information about secret paths.

The procedure for creating a secret varies by interface. Refer to the section that corresponds to your desired interface.

- [GUI](#ui)
- [Secrets API](#api)
- [DC/OS Enterprise CLI](#cli)

# <a name="ui"></a>Creating secrets via the GUI 

1. Log into the DC/OS GUI as a user with the `dcos:superuser` permission.

1. Open the **Security** -> **Secrets** tab.

1. Click the **+** icon in the top right.

1. In the **ID** box, provide the name of your secret and its path, if any. Example, **developer/my-secret**.

1. Type or paste the secret into the **Value** box.

1. When you have completed your entries, the secret should look something like the following.

    ![Creating the Secret](/1.9/img/create-secret.png)
    
1. Click **Create**. 


# <a name="api"></a>Creating secrets via the API

This procedure describes how to create a secret called `my-secret` inside the `developer` path. 

**Prerequisites:** 

- [DC/OS CLI installed](/1.9/cli/install/)
- If your [security mode](/1.9/installing/ent/custom/configuration/configuration-parameters/#security-enterprise) is `permissive` or `strict`, you must follow the steps in [Downloading the Root Cert](/1.9/networking/tls-ssl/get-cert/) before issuing the curl commands in this section. If your [security mode](/1.9/installing/ent/custom/configuration/configuration-parameters/#security-enterprise) is `disabled`, you must delete `--cacert dcos-ca.crt` from the commands before issuing them.

1. Using `dcos auth login` log into the CLI as a user with one of the following permissions.

     - `dcos:superuser full`
     - `dcos:secrets:default:/developer/my-secret create`
     - `dcos:secrets:default:/developer/my-secret full`
   
2. Use the following command to create the secret.

   ```bash
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -d '{"value":"very-secret"}' $(dcos config show core.dcos_url)/secrets/v1/secret/default/developer/my-secret -H 'Content-Type: application/json'
   ```

# <a name="cli"></a>Creating secrets via the DC/OS Enterprise CLI

This procedure describes how to create a secret called `my-secret` inside the `developer` path using the DC/OS Enterprise CLI.

**Prerequisite:** You must have the [DC/OS CLI installed](/1.9/cli/install/) and the  [DC/OS Enterprise CLI installed](/1.9/cli/enterprise-cli/#ent-cli-install).

1. Using `dcos auth login` log into the CLI as a user with one of the following permissions.

     - `dcos:superuser full`
     - `dcos:secrets:default:/developer/my-secret create`
     - `dcos:secrets:default:/developer/my-secret full`
    
1. Use the following command to create the new secret.

   ```bash
   dcos security secrets create --value=top-secret developer/my-secret
   ```
