---
layout: layout.pug
title: Configuring DC/OS Access for Edge-LB
menuWeight: 3
excerpt:
featureMaturity:
enterprise: true
---

This topic describes how to configure DC/OS access for Edge-LB. Depending on your [security mode](/1.11/security/#security-modes), Edge-LB requires [service authentication](/1.11/security/service-auth/) for access to DC/OS.

| Security mode | Service Account |
|---------------|-----------------------|
| Disabled      | Not available   |
| Permissive    | Recommended (optional) |

**Prerequisites:**

- [DC/OS CLI installed](/1.11/cli/install/) and be logged in as a superuser.
- [Enterprise DC/OS CLI 0.4.14 or later installed](/1.11/cli/enterprise-cli/#ent-cli-install).

# <a name="create-a-keypair"></a>Create a Key Pair
In this step, a 2048-bit RSA public-private key pair is created using the Enterprise DC/OS CLI.

Create a public-private key pair and save each value into a separate file within the current directory.

```bash
dcos security org service-accounts keypair edge-lb-private-key.pem edge-lb-public-key.pem
```

**Tip:** You can use the [DC/OS Secret Store](/1.11/security/secrets/) to secure the key pair.

# <a name="create-a-service-account"></a>Create a Service Account

## Permissive
From a terminal prompt, create a new service account (`edge-lb-principal`) containing the public key (`edge-lb-public-key.pem`).

```bash
dcos security org service-accounts create -p edge-lb-public-key.pem -d "Edge-LB service account" edge-lb-principal
```

**Tip:** You can verify your new service account using the following command.

```bash
dcos security org service-accounts show edge-lb-principal
```

# <a name="create-an-sa-secret"></a>Create a Secret
Create a secret (`edge-lb/edge-lb-secret`) with your service account (`edge-lb-principal`) and private key specified (`edge-lb-private-key.pem`).

**Tip:** If you store your secret in a path that matches the service name (e.g. service name and path are `edge-lb`), then only the service named `edge-lb` can access it.

## Permissive

```bash
dcos security secrets create-sa-secret edge-lb-private-key.pem edge-lb-principal edge-lb/edge-lb-secret
```

**Tip:**
You can list the secrets with this command:

```bash
dcos security secrets list /
```

# <a name="give-perms"></a>Create and Assign Permissions
Use the following CLI commands to rapidly provision the Edge-LB service account with the required permissions.

All CLI commands can also be executed via the [IAM API](/1.11/security/iam-api/).

1.  Grant the permissions and the allowed actions to the service account using the following commands.

    ```bash
    dcos security org users grant edgelb-principal dcos:service:marathon:marathon:services:/ read --description "Allows access to any service launched by the native Marathon instance"
    dcos security org users grant edgelb-principal dcos:service:marathon:marathon:admin:events read --description "Allows access to Marathon events"
    ```

For more information about the available Edge-LB commands, see the [Edge-LB command reference](/1.11/cli/command-reference/dcos-edgelb/).
