---
layout: layout.pug
navigationTitle: Security
excerpt: Configuring secure DC/OS service accounts 
title: Security
menuWeight: 10
model: /services/data-science-engine/data.yml
render: mustache
---
This section describes how to configure secure DC/OS service accounts for {{ model.techName }}.
When running in DC/OS strict security mode, both the {{ model.techName }} and Spark applications launched from it must authenticate to Mesos using a DC/OS service account.

#include /services/include/service-account.tmpl

# Create and assign permissions
In strict mode, any Spark applications launched by the {{ model.techName }} will require additional permissions for authenticating with Mesos. This includes the launching of executors (worker tasks) on the cluster.

Use the following `DCOS CLI` commands to rapidly provision a service account with the required permissions:

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
dcos security org users grant <service-account-id> dcos:mesos:master:task:app_id:/{{ model.serviceName }} create
```
    
<!-- You can also provision a service account using the UI. -->

## Using the secret store

DC/OS Enterprise allows users to add privileged information in the form of a file to the DC/OS secret store. These files can be referenced in {{ model.nickName }} jobs and used for authentication and authorization with various external services (for example, HDFS). For example, you can use this functionality to pass Kerberos `keytab` files. For details about how to use secrets, see understanding secrets.

### Where to place secrets

For a secret to be available to {{ model.techName }}, it must be placed in a path
that can be accessed by the {{ model.nickName }} service. If only {{ model.nickName }} requires access to a secret, you can store the secret in a path that matches the name of the {{ model.packageName }} service (for example, `{{ model.packageName }}/secret`).  

## Limitations

Anyone who has access to the {{ model.techName }}'s notebook has access to all secrets available to it. Do not grant users access to the notebook unless they are also permitted to access its secrets.

## Binary secrets

You can store binary files, like a Kerberos keytab, in the DC/OS secrets store. In DC/OS 1.11 and later, you can create secrets from binary files directly. In DC/OS 1.10 or earlier, files must be base64-encoded--as specified in RFC 4648--before being stored as secrets.

### DC/OS 1.11 and later
To create a secret called `mysecret` with the binary contents of `kerb5.keytab`, run the following command:

```bash
dcos security secrets create --file kerb5.keytab mysecret
```

# Using Mesos secrets in Spark jobs

Once a secret has been added to the secret store, you can include it in the service's configuration under the `security` section:

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

When using environment variables and file-based secrets,  there must be an equal number of sinks and secret sources. That is, the keys `secret_names`, `secret_filenames`, and `secret_envkeys` must have the same number of values. For example:

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

<p class="message--note"><strong>NOTE: </strong> If the content size of binary secrets is greater than 4KB, Mesos' security module will reject container execution due to the overhead.


# Authenticating to your {{ model.techName }} instance

You can run multiple installations of {{ model.techName }} by changing the `service.name` option during installation.
Each instance can have different authentication mechanisms configured.

## Password Authentication (default)

The default {{ model.techName }} password is set to`{{ model.security.defaultPassword }}`. You can override it with `service.jupyter_password` option.

## OpenID Connect 

You can choose to enable OpenID Connect authentication. The OpenID Connect flow will be triggered if `oidc.enabled` is
`true` and both `oidc.discovery_uri` and `oidc.client_secret` are set, since they are the minimal options.

Default client name is `{{ model.security.defaultClientId }}` and it can be overridden with `oidc.client_id` option.

Here is an example of a simple OpenID configuration for {{ model.techName }}:

```json
{
  "oidc": {
      "enabled": true,
      "discovery_uri": "https://keycloak.example.com/auth/realms/notebook/.well-known/openid-configuration",
      "client_id": "dse-client",
      "client_secret": "11111111-2222-3333-4444-555555555555"
  }
}
```

There are a few more options for advanced OpenID Connect configuration, that can be found in `Oidc` section when
installing {{ model.techName }} from the catalog in DC/OS UI. 

 


[11]: https://docs.mesosphere.com/latest/overview/architecture/components/
[12]: http://docs.oracle.com/javase/8/docs/technotes/tools/unix/keytool.html
[13]: https://docs.mesosphere.com/latest/security/ent/#spaces-for-secrets
[14]: https://docs.mesosphere.com/latest/security/ent/secrets/
