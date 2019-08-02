---
layout: layout.pug
navigationTitle: Security
excerpt: Protecting your data
title: Security
menuWeight: 8
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
You can also provision a service account using the UI.

## Using the secret store

DC/OS Enterprise allows users to add privileged information in the form of a file to the DC/OS secret store. These files can be referenced in {{ model.techName }} jobs and used for authentication and authorization with various external services (for example, HDFS). For example, you can use this functionality to pass Kerberos `keytab` files. For details about how to use secrets, see understanding secrets.

### Where to place secrets

For a secret to be available to {{ model.techName }}, it must be placed in a path
that can be accessed by the {{ model.techName }} service. If only {{ model.techName }} requires access to a secret, you can store the secret in a path that matches the name of the {{ model.techName }} service (for example, `{{ model.packageName }}/secret`).  

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

# {{ model.techName }} SSL

SSL support in {{ model.techName }} encrypts the following channels:

* From the [DC/OS admin router][11] to the dispatcher.
* Files served from the drivers to their executors.

To enable SSL, a Java keystore (and, optionally, truststore) must be provided, along with their passwords. The first three settings below are **required** during job submission. If using a truststore, the last two are also **required**:

| Variable                         | Description                                     |
|----------------------------------|-------------------------------------------------|
| `--keystore-secret-path`         | Path to keystore in secret store                |
| `--keystore-password`            | The password used to access the keystore        |
| `--private-key-password`         | The password for the private key                |
| `--truststore-secret-path`       | Path to truststore in secret store              |
| `--truststore-password`          | The password used to access the truststore      |

In addition, there are a number of {{ model.techName }} configuration variables relevant to SSL setup.  These configuration settings are **optional**:
| Variable                         | Description           | Default value |
|----------------------------------|-----------------------|---------------|
| `{{ model.packageName }}.ssl.enabledAlgorithms`    | Allowed cyphers       | JVM defaults  |
| `{{ model.packageName }}.ssl.protocol`             | Protocol              | TLS           |

The keystore and truststore are created using the [Java keytool][12]. The keystore must contain one private key and its signed public key. The truststore is optional and might contain a self-signed root-CA certificate that is explicitly trusted by Java.
Add the stores to your secrets in the DC/OS secret store. For example, if your keystores and truststores are `server.jks` and `trust.jks`, respectively, then use the following commands to add them to the secret store:

```bash
dcos security secrets create /{{ model.packageName }}/keystore --text-file server.jks
dcos security secrets create /{{ model.packageName }}/truststore --text-file trust.jks
```

You must add the following configurations to your `dcos {{ model.packageName }} run ` command. The ones in parentheses are optional:

```bash

dcos {{ model.packageName }} run --verbose --submit-args="\
--keystore-secret-path=<path/to/keystore, e.g. {{ model.packageName }}/keystore> \
--keystore-password=<password to keystore> \
--private-key-password=<password to private key in keystore> \
(—-truststore-secret-path=<path/to/truststore, for example, {{ model.packageName }}/truststore> \)
(--truststore-password=<password to truststore> \)
(—-conf {{ model.packageName }}.ssl.enabledAlgorithms=<cipher, for example, TLS_RSA_WITH_AES_128_CBC_SHA256> \)
--class <{{ model.packageName }} Main class> <{{ model.packageName }} Application JAR> [application args]"
```


[11]: https://docs.mesosphere.com/latest/overview/architecture/components/
[12]: http://docs.oracle.com/javase/8/docs/technotes/tools/unix/keytool.html
[13]: https://docs.mesosphere.com/latest/security/ent/#spaces-for-secrets
[14]: https://docs.mesosphere.com/latest/security/ent/secrets/
