---
layout: layout.pug
navigationTitle: Security
excerpt: Configuring secure DC/OS service accounts
title: Security
enterprise: true
menuWeight: 10
model: /mesosphere/dcos/services/data-science-engine/data.yml
render: mustache
---

This section describes how to configure secure DC/OS service accounts for {{ model.techName }}.
When running in DC/OS strict security mode, both the {{ model.techName }} and Spark applications launched from it must authenticate to Mesos using a DC/OS service account.

# <a name="provision-a-service-account"></a>Provisioning a service account

This section describes how to configure DC/OS access for {{ model.techName }}. Depending on your [security mode](/mesosphere/dcos/latest/security/ent/#security-modes/), {{ model.techName }} may require [service authentication](/mesosphere/dcos/latest/security/ent/service-auth/) for access to DC/OS.

| Security mode | Service Account |
|---------------|-----------------------|
| Disabled      | Not available   |
| Permissive    | Optional   |
| Strict        | Required |

If you install a service in permissive mode and do not specify a service account, Metronome and Marathon will act as if requests made by this service are made by an account with the [superuser permission](/mesosphere/dcos/latest/security/ent/perms-reference/#superuser-permissions).

## Prerequisites:

- [DC/OS CLI installed](/mesosphere/dcos/latest/cli/install/) and be logged in as a superuser.
- [Enterprise DC/OS CLI 0.4.14](/mesosphere/dcos/latest/cli/enterprise-cli/#ent-cli-install) or later installed.
- If your [security mode](/mesosphere/dcos/latest/security/ent/#security-modes/) is `permissive` or `strict`, you must [get the root cert](/mesosphere/dcos/latest/security/ent/tls-ssl/get-cert/) before issuing the `curl` commands in this section. 

# <a name="create-a-keypair"></a>Create a Key Pair
In this step, a 2048-bit RSA public-private key pair is created using the Enterprise DC/OS CLI.

Create a public-private key pair and save each value into a separate file within the current directory.

```bash
dcos security org service-accounts keypair <private-key>.pem <public-key>.pem
```

<p class="message--note"><strong>NOTE: </strong>You can use the <a href="/mesosphere/dcos/latest/security/ent/secrets/">DC/OS Secret Store</a> to secure the key pair.</p>


# <a name="create-a-service-account"></a>Create a Service Account

From a terminal prompt, create a new service account (for example, `{{ model.serviceName }}`) containing the public key (`<your-public-key>.pem`).

```bash
dcos security org service-accounts create -p <your-public-key>.pem -d <description> {{ model.serviceName }}
```

You can verify your new service account using the following command.

```bash
dcos security org service-accounts show {{ model.serviceName }}
```

# <a name="create-an-sa-secret"></a>Create a Secret
Create a secret (`{{ model.packageName }}/<secret-name>`) with your service account and private key specified (`<private-key>.pem`).

<p class="message--note"><strong>NOTE: </strong>If you store your secret in a path that matches the service name, for example, service name and secret path are both <tt>{{ model.serviceName }}</tt>, then only the service named <tt>{{ model.serviceName }}</tt> can access it.</p>


## Permissive

```bash
dcos security secrets create-sa-secret <private-key>.pem <service-account-id> {{ model.serviceName }}/<secret-name>
```

## Strict

```bash
dcos security secrets create-sa-secret --strict <private-key>.pem <service-account-id> {{ model.packageName }}/<secret-name>
```

You can list the secrets with this command:

```bash
dcos security secrets list /
```


# Create and assign permissions
In strict mode, any Spark applications launched by the {{ model.techName }} will require additional permissions for authenticating with Mesos. This includes the launching of executors (worker tasks) on the cluster.

<p class="message--note"><strong>NOTE: </strong> Spark applications launched by the {{ model.techName }} do not require an additional service account setup and will reuse the service account created for {{ model.techName }} with additional required permissions.</p>

Use the following DC/OS CLI commands to rapidly provision a service account with the required permissions:

```bash
# Allows the default user 'nobody' to execute tasks
dcos security org users grant <service-account-id> dcos:mesos:master:task:user:nobody create
dcos security org users grant <service-account-id> dcos:mesos:agent:task:user:nobody create

# Allows Spark framework to reserve cluster resources using <service-account-id> role and principal
dcos security org users grant <service-account-id> dcos:mesos:master:framework:role:<service-account-id> create
dcos security org users grant <service-account-id> dcos:mesos:master:reservation:role:<service-account-id> create
dcos security org users grant <service-account-id> dcos:mesos:master:reservation:principal:<service-account-id> delete
dcos security org users grant <service-account-id> dcos:mesos:master:volume:role:<service-account-id> create
dcos security org users grant <service-account-id> dcos:mesos:master:volume:principal:<service-account-id> delete

# Allows Spark framework to launch tasks using <service-account-id> role and principal
dcos security org users grant <service-account-id> dcos:mesos:master:task:role:<service-account-id> create
dcos security org users grant <service-account-id> dcos:mesos:master:task:principal:<service-account-id> create
dcos security org users grant <service-account-id> dcos:mesos:master:task:app_id:<service-account-name> create
```

<p class="message--note"><strong>NOTE: </strong> The default service account name is <tt>data-science-engine</tt>, however, please ensure that the <tt>&#60service-account-name&#62</tt> entered here is the same as the service name specified in the options.json or in the UI when {{ model.techName }} is installed.

<!-- You can also provision a service account using the UI. -->

To configure Spark for using created service account and permissions, add the following configuration under the `spark` section:

```json
"spark": {
    "spark_mesos_principal": "<service-account-id>",
    "spark_mesos_secret": "<service-account-secret>",
    "spark_mesos_role": "<service-account-id>"
}
```

## Using the secret store

DC/OS Enterprise allows users to add privileged information in the form of a file to the [DC/OS Secret Store](/mesosphere/dcos/latest/security/ent/secrets/). These files can be referenced in {{ model.nickName }} jobs and used for authentication and authorization with various external services (for example, HDFS). For example, you can use this functionality to pass Kerberos `keytab` files. 

### Where to place secrets

For a secret to be available to {{ model.techName }}, it must be placed in a path
that can be accessed by the {{ model.nickName }} service. If only {{ model.nickName }} requires access to a secret, you can store the secret in a path that matches the name of the {{ model.nickName }} service (for example, `{{ model.packageName }}/secret`).  

## Limitations

Anyone who has access to the {{ model.techName }}'s notebook has access to all secrets available to it. Do not grant users access to the notebook unless they are also permitted to access its secrets.

## Binary secrets

You can store binary files, like a Kerberos keytab, in the DC/OS Secrets Store. In DC/OS 1.11 and later, you can create secrets from binary files directly. 

To create a secret called `mysecret` with the binary contents of `kerb5.keytab`, run the following command:

```bash
dcos security secrets create --file kerb5.keytab mysecret
```

In DC/OS 1.10 or earlier, files must be base64-encoded--as specified in RFC 4648--before being stored as secrets.

# Using Mesos secrets in Spark jobs

Once a secret has been added to the Secret Store, you can include it in the service's configuration under the `security` section:

```json
"service": {
  "security": {
    "extra_spark_secrets": {
      "secret_names": "/{{ model.packageName }}/my-secret",
      "secret_filenames": ".secrets/my-secret",
	    "secret_envkeys": "MY_SECRET_ENV_VAR"
    }
  }
}
```

Provided secrets will be automatically mounted to {{ model.techName }}'s sandbox. The secrets will also be made available to all Spark executors by adding them to the following Spark configuration properties:
-`spark.mesos.executor.secret.names`
-`spark.mesos.executor.secret.<filenames|envkeys>`

# Limitations

When using environment variables and file-based secrets, there must be an equal number of sinks and secret sources. That is, the keys `secret_names`, `secret_filenames`, and `secret_envkeys` must have the same number of values. For example:

```json
"service":{
  "security": {
    "extra_spark_secrets": {
      "secret_names": "/{{ model.packageName }}/my-secret-file,/{{ model.packageName }}/my-secret-envvar",
      "secret_filenames": "target-secret-file,placeholder-file",
      "secret_envkeys": "PLACEHOLDER,SECRET_ENVVAR"
    }
  }
}
```

This configuration places the contents of `{{ model.packageName }}/my-secret-file` into the `target-secret-file` as well as the `PLACEHOLDER` environment variable. Additionally, the contents of `{{ model.packageName }}/my-secret-envvar` are exported to the `SECRET_ENVVAR` and written to the `placeholder-file`.

<p class="message--note"><strong>NOTE: </strong> If the content size of binary secrets is greater than 4KB, Mesos' security module will reject container execution due to the overhead.</p>


# Authenticating to your {{ model.techName }} instance

You can run multiple installations of {{ model.techName }} by changing the `service.name` option during installation.
Each instance can have different authentication mechanisms configured.

## Password Authentication (default)

The default {{ model.techName }} password is set to`jupyter`. You can override it with the `service.jupyter_password` option.

## OpenID Connect

You can choose to enable OpenID Connect authentication. The OpenID Connect flow will be triggered if `oidc.enabled` is
`true` and both `oidc.discovery_uri` and `oidc.client_secret` are set, since they are the minimal options.

The default client name is `notebook` and it can be overridden with the `oidc.client_id` option.

Here is an example of a simple OpenID Connect configuration for {{ model.techName }}:

```json
{
  "oidc": {
      "enabled": true,
      "discovery_uri": "https://keycloak.example.com/auth/realms/notebook/.well-known/openid-configuration",
      "client_id": "{{ model.serviceName }}-client",
      "client_secret": "11111111-2222-3333-4444-555555555555"
  }
}
```

<!-- There are a few more options for advanced OpenID Connect configuration, that can be found in the `Oidc` section when
installing {{ model.techName }} from the catalog in the DC/OS UI.  -->




[11]: /mesosphere/dcos/latest/overview/architecture/components/
[12]: http://docs.oracle.com/javase/8/docs/technotes/tools/unix/keytool.html
[13]: /mesosphere/dcos/latest/security/ent/#spaces-for-secrets
[14]: /mesosphere/dcos/latest/security/ent/secrets/