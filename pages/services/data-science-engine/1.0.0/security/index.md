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
When running in DC/OS strict security mode, both the dispatcher and jobs must authenticate to Mesos using a DC/OS service account.

#include /services/include/service-account.tmpl

# Create and assign permissions
Use the following `curl` commands to rapidly provision the {{ model.techName }} service account with the required permissions. You can also provision the service account through the UI.
When running in DC/OS strict security mode, both the dispatcher and jobs must authenticate to Mesos using a DC/OS service account.

**Tips:**

- Any `/` character in a resource must be replaced with `%252F` before it can be passed in a curl command.
- When using the API to manage permissions, you must first create the permissions and then assign them. Sometimes, the permission may already exist. In this case, the API returns an informative message. You can consider this as a confirmation and continue to the next command.


<p class="message--important"><strong>IMPORTANT: </strong>{{ model.techName }} runs by default under the <a href="http://mesos.apache.org/documentation/latest/roles/">Mesos default role</a>, which is represented by the `*` symbol. You can deploy multiple instances of {{ model.techName }} without modifying this default.</p>

1. Create the permissions. Some of these permissions may exist already.
If you want to override the default {{ model.techName }} role, you must modify these code samples accordingly.

    ```bash
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:task:user:nobody \
    -d '{"description":"Allows Linux user nobody to execute tasks"}' \
    -H 'Content-Type: application/json'
    curl -X PUT --cacert dcos-ca.crt \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:framework:role:* \
    -d '{"description":"Allows a framework to register with the Mesos master using the Mesos default role"}' \
    -H 'Content-Type: application/json'
    curl -X PUT -k \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" "$(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:task:app_id:%252F{{ model.packageName }}" \
    -d '{"description":"Allow to read the task state"}' \
    -H 'Content-Type: application/json'
    ```


<p class="message--warning"><strong>WARNING: </strong>If these commands return a `307 Temporary Redirect` error it can be because your cluster url (`dcos config show core.dcos_url`) is not set as Hyper Text Transfer Protocol Secure (`https://`).</p>

2. Grant the permissions and the allowed actions to the service account using the following commands.

1. Run these commands with your service account name (`<service-account-id>`) specified:

    ```bash
    curl -X PUT -k \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" "$(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:framework:role:*/users/<service-account-id>/create"
    curl -X PUT -k \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" "$(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:task:app_id:%252F{{ model.packageName }}/users/<service-account-id>/create"
    curl -X PUT -k \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:task:user:nobody/users/<service-account-id>/create
    ```

If you are setting permissions to execute {{ model.packageName }} jobs from outside of the DC/OS cluster, see [Set permissions for jobs running outside of the cluster](#SetPermsOutsideCluster).

## Using the secret store

DC/OS Enterprise allows users to add privileged information in the form of a file to the DC/OS secret store. These files can be referenced in {{ model.techName }} jobs and used for authentication and authorization with various external services (for example, HDFS). For example, you can use this functionality to pass Kerberos `keytab` files. For details about how to use secrets, see understanding secrets.

### Where to place secrets

For a secret to be available to {{ model.techName }}, it must be placed in a path
that can be accessed by the {{ model.techName }} service. If only {{ model.techName }} requires access to a secret, you can store the secret in a path that matches the name of the {{ model.techName }} service (for example, `{{ model.packageName }}/secret`).  

## Limitations

Anyone who has access to the {{ model.techName }} (Dispatcher) service instance has access to all secrets available to it. Do not grant users access to the {{ model.techName }} Dispatchers instance unless they are also permitted to access all secrets available to the {{ model.techName }} Dispatcher instance.

## Binary secrets

You can store binary files, like a Kerberos keytab, in the DC/OS secrets store. In DC/OS 1.11 and later, you can create secrets from binary files directly. In DC/OS 1.10 or earlier, files must be base64-encoded--as specified in RFC 4648--before being stored as secrets.

### DC/OS 1.11 and later
To create a secret called `mysecret` with the binary contents of `kerb5.keytab`, run the following command:

```bash
dcos security secrets create --file kerb5.keytab mysecret
```

### DC/OS 1.10 or earlier
To create a secret called `mysecret` with the binary contents of `kerb5.keytab`, first encode it using the `base64` command line utility. The following example uses BSD `base64` (default on macOS).

```bash
base64 -i krb5.keytab -o kerb5.keytab.base64-encoded
```

Alternatively, GNU `base64` (the default on Linux) inserts line-feeds in the encoded data by default.
Disable line-wrapping with the `-w 0` argument.

```bash
base64 -w 0 -i krb5.keytab > kerb5.keytab.base64-encoded
```

Now that the file is encoded, it can be stored as a secret.

```bash
dcos security secrets  create -f kerb5.keytab.base64-encoded  some/path/__dcos_base64__mysecret
```

<p class="message--note"><strong>NOTE: </strong>The secret name must be prefixed with <tt>__dcos_base64__</tt>.</p>

When the `some/path/__dcos_base64__mysecret` secret is referenced in your `dcos {{ model.packageName }} run` command, its base64-decoded contents are made available as a temporary file in your {{ model.techName }} application.

<p class="message--note"><strong>NOTE: </strong> Make sure to only refer to binary secrets as <strong>files</strong>, since holding binary content in environment variables is discouraged.</p>

# Using Mesos secrets

Once a secret has been added in the secret store, you can pass it to {{ model.techName }} with the `{{ model.packageName }}.mesos.<task-name>.secret.names` and `{{ model.packageName }}.mesos.<task-name>.secret.<filenames|envkeys>` configuration parameters, where `<task-name>` is either `driver` or `executor`. Specifying `filenames` or `envkeys` identifies the secret as either a file-based secret or an environment variable. These configuration parameters take comma-separated lists that are "zipped" together to make the final secret file or environment variable. In most cases, you should use file-based secrets whenever possible because they are more secure than environment variable secrets.

<p class="message--note"><strong>NOTE: </strong>Secrets are only supported for the Mesos Universal containerizer and not for the Docker containerizer.</p>

To use the Mesos containerizer, add this configuration:

```
--conf {{ model.packageName }}.mesos.containerizer=mesos
```

For example, to use a secret named `{{ model.packageName }}/my-secret-file` as a file in the driver **and** the executors, add these configuration parameters:
```
--conf {{ model.packageName }}.mesos.containerizer=mesos
--conf {{ model.packageName }}.mesos.driver.secret.names={{ model.packageName }}/my-secret-file
--conf {{ model.packageName }}.mesos.driver.secret.filenames=target-secret-file
--conf {{ model.packageName }}.mesos.executor.secret.names={{ model.packageName }}/my-secret-file
--conf {{ model.packageName }}.mesos.executor.secret.filenames=target-secret-file
```
These settings put the contents of the secret `{{ model.packageName }}/my-secret-file` in a secure RAM-FS mounted secret file named `target-secret-file` in the drivers' and executors' sandboxes. If you want to use a secret as an environment variable (for example, AWS credentials), you can change the configurations to be similar to the following:
```
--conf {{ model.packageName }}.mesos.containerizer=mesos
--conf {{ model.packageName }}.mesos.driver.secret.names=/{{ model.packageName }}/my-aws-secret,/{{ model.packageName }}/my-aws-key
--conf {{ model.packageName }}.mesos.driver.secret.envkeys=AWS_SECRET_ACCESS_KEY,AWS_ACCESS_KEY_ID
```
These example settings illustrate a secret access key stored in a secret named `{{ model.packageName }}/my-aws-secret` and a secret key ID in `{{ model.packageName }}/my-aws-key`.

# Limitations

When using a combination of environment and file-based secrets, there must be an equal number of sinks and secret sources (files and environment variables). For example:

```
--conf {{ model.packageName }}.mesos.containerizer=mesos
--conf {{ model.packageName }}.mesos.driver.secret.names=/{{ model.packageName }}/my-secret-file,/{{ model.packageName }}/my-secret-envvar
--conf {{ model.packageName }}.mesos.driver.secret.filenames=target-secret-file,placeholder-file
--conf {{ model.packageName }}.mesos.driver.secret.envkeys=PLACEHOLDER,SECRET_ENVVAR
```

This code places the content of `{{ model.packageName }}/my-secret-file` into the `PLACEHOLDER` environment variable and the `target-secret-file` file as well as the content of `{{ model.packageName }}/my-secret-envvar` into the `SECRET_ENVVAR` and `placeholder-file`. In the case of binary secrets, the environment variable is empty because environment variables cannot be assigned binary values.

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

### DC/OS 1.10 or earlier
Since both stores are binary files, they must be base64 encoded before being placed in the DC/OS secret store. Follow the instructions above on encoding binary secrets to encode the keystore and truststore.
<p class="message--note"><strong>NOTE: </strong>If you specify environment-based secrets with <code>{{ model.packageName }}.mesos.[driver|executor].secret.envkeys</code>, the keystore and
truststore secrets will also show up as environment variable-based secrets because of how secrets are implemented. You can ignore these extra environment variables.</p>

# {{ model.techName }} SASL

This section discusses executor authentication and BlockTransferService encryption.

{{ model.techName }} uses Simple Authentication Security Layer (SASL) to authenticate executors with the driver and for encrypting messages sent between components. This functionality relies on a shared secret between all components you expect to communicate with each other. A secret can be generated with the DC/OS {{ model.packageName }} CLI:

```bash
dcos {{ model.packageName }} secret <secret_path>
```
For example:

```
dcos {{ model.packageName }} secret /{{ model.packageName }}/{{ model.packageName }}AuthSecret
```
This example generates a random secret and uploads it to the DC/OS secrets store at the designated path. To use this secret for RPC authentication, add the following configurations to your CLI command:

```bash
dcos {{ model.packageName }} run --submit-args="\
...
--executor-auth-secret=/{{ model.packageName }}/{{ model.packageName }}AuthSecret
...
"
```

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
