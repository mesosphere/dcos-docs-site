---
layout: layout.pug
navigationTitle: Configuring DC/OS access for NiFi
title: Configuring DC/OS access for NiFi
menuWeight: 4
excerpt: Configuring DC/OS access for NiFi
featureMaturity:
enterprise: false
---

This topic describes how to configure DC/OS access for NiFi. Depending on your [security mode](/1.12/security/ent/#security-modes/), NiFi requires [service authentication](/1.12/security/ent/service-auth/) for access to DC/OS.

| Security mode | Service Account |
|---------------|-----------------------|
| Disabled      | Not available   |
| Permissive    | Optional   |
| Strict        | Required |

If you install a service in permissive mode and do not specify a service account, Metronome and Marathon will act as if requests made by this service are made by an account with the [superuser permission](/1.12/security/ent/perms-reference/#superuser).

**Prerequisites:**

- [DC/OS CLI installed](/1.12/cli/install/) and be logged in as a superuser.
- [DC/OS Enterprise CLI 0.4.14 or later installed](/1.12/cli/enterprise-cli/#ent-cli-install).
- If your [security mode](/1.12/security/ent/#security-modes/) is `permissive` or `strict`, you must [get the root cert](/1.12/security/ent/tls-ssl/get-cert/) before issuing the curl commands in this section.

# <a name="create-a-keypair"></a>Create a Key Pair
In this step, a 2048-bit RSA public-private key pair is created uses the DC/OS Enterprise CLI.

Create a public-private key pair and save each value into a separate file within the current directory.

```bash
dcos security org service-accounts keypair <private-key>.pem <public-key>.pem
```

<p class="message--note"><strong>NOTE: </strong>You can use the <a href="https://docs.mesosphere.com/1.12/security/ent/secrets/">DC/OS Secret Store</a> to secure the key pair.</p>

# <a name="create-a-service-account"></a>Create a Service Account

From a terminal prompt, create a new service account (`<service-account-id>`) containing the public key (`<your-public-key>.pem`).

```bash
dcos security org service-accounts create -p <your-public-key>.pem -d "dcos_nifi" <service-name>
```

You can verify your new service account using the following command.

```bash
dcos security org service-accounts show <service-account-id>
```

# <a name="create-a-secret"></a>Create a Secret
Create a secret (`nifi/<secret-name>`) with your service account (`<service-account-id>`) and private key specified (`<private-key>.pem`).

If you store your secret in a path that matches the service name (e.g. service name and secret path are `nifi`), then only the service named `nifi` can access it.

## Permissive

```bash
dcos security secrets create-sa-secret <private-key>.pem <service-name> <service name secret>
```

## Strict

```bash
dcos security secrets create-sa-secret --strict <private-key>.pem <service-name> <service name secret>
```


You can list the secrets with the following command:

```bash
dcos security secrets list /
```

# <a name="assign-permissions"></a> Assign Permissions
```bash
dcos security org users grant <service name> dcos:superuser full --description "grant permission to superuser"
```


