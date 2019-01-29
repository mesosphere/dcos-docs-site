---
layout: layout.pug
navigationTitle:
excerpt: Securing your service
title: Security
menuWeight: 40
model: /services/spark/data.yml
render: mustache
---

This topic describes how to configure DC/OS service accounts for {{ model.techShortName }}.

When running in [DC/OS strict security mode](https://docs.mesosphere.com/latest/security/), both the dispatcher and jobs
must authenticate to Mesos using a [DC/OS Service Account](https://docs.mesosphere.com/latest/security/ent/service-auth/).

#include /services/include/service-account.tmpl

# <a name="give-perms"></a>Create and assign permissions
Use the following `curl` commands to rapidly provision the {{ model.techShortName }} service account with the required permissions. This can also be done through the UI.

**Notes:**

- Any `/` character in a resource must be replaced with `%252F` before it can be passed in a `curl` command.
- When using the API to manage permissions, you must first create the permissions and then assign them. Sometimes, the permission may already exist. In this case, the API returns an informative message. You can regard this as a confirmation and continue to the next command.

1.  Create the permissions. Some of these permissions may exist already.

    **Note:** {{ model.techShortName }} runs by default under the [Mesos default role](http://mesos.apache.org/documentation/latest/roles/), which is represented by the `*` symbol. You can deploy multiple instances of {{ model.techShortName }} without modifying this default. If you want to override the default {{ model.techShortName }} role, you must modify these code samples accordingly.

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
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" "$(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:task:app_id:%252F{{ model.serviceName }}" \
    -d '{"description":"Allow to read the task state"}' \
    -H 'Content-Type: application/json'

    ```

    **Note** If these commands return a `307 Temporary Redirect` error it can be because your cluster url (`dcos config show core.dcos_url`) is not set as Hyper Text Transfer Protocol Secure (`https://`).  


1.  Grant the permissions and the allowed actions to the service account using the following commands. Run these commands with your service account name (`<service-account-id>`) specified.

    ```bash
    curl -X PUT -k \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" "$(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:framework:role:*/users/<service-account-id>/create"
    curl -X PUT -k \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" "$(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:task:app_id:%252F{{ model.serviceName }}/users/<service-account-id>/create"
    curl -X PUT -k \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:task:user:nobody/users/<service-account-id>/create
    ```

#include /services/include/configuration-create-json-file.tmpl

# Set permissions for jobs running outside of the cluster

You must set the following permissions if you want to execute a Spark job (`dcos spark run`) from outside of the DC/OS cluster:

 ```
 dcos:adminrouter:service:marathon full 
 dcos:adminrouter:service:spark full 
 dcos:service:marathon:marathon:services:/spark read 
 ```

Replace `spark` when setting these permissions with the appropriate service name if you are not using the default service name.

# Using the secret store

DC/OS Enterprise allows users to add privileged information in the form of a file to the DC/OS secret store. These files
can be referenced in {{ model.techShortName }} jobs and used for authentication and authorization with various external services (e.g.
HDFS). For example, we use this functionality to pass the Kerberos Keytab. Details about how to use Secrets can be found
at the [official documentation](https://docs.mesosphere.com/latest/security/ent/secrets/).

### Where to place secrets
In order for a secret to be available to {{ model.techShortName}}, it must be placed in a path that can be accessed by the {{ model.techShortName}} service. If only {{ model.techShortName}} requires access to a secret, store the secret in a path that matches the name of the {{ model.techShortName}} service (e.g. `{{ model.serviceName}}/secret`).  See the [Secrets Documentation about Spaces][13] for details about how secret paths restrict service access to secrets.

### Limitations
Anyone who has access to the {{ model.techShortName}} (Dispatcher) service instance has access to all secrets available to it. Do not grant users access to the {{ model.techShortName}} Dispatchers instance unless they are also permitted to access all secrets available to the {{ model.techShortName}} Dispatcher instance.

### Binary secrets

You can store binary files, like a Kerberos keytab, in the DC/OS secrets store. In DC/OS 1.11 and later,  you can create
secrets from binary files directly, while in DC/OS 1.10 or earlier, files must be base64-encoded as specified in
RFC 4648 prior to being stored as secrets.

#### DC/OS 1.11+

To create a secret called `mysecret` with the binary contents of `kerb5.keytab` run:

```bash
$ dcos security secrets create --file kerb5.keytab mysecret
```

#### DC/OS 1.10 or earlier

To create a secret called `mysecret` with the binary contents of `kerb5.keytab`, first encode it using the
`base64` command line utility. The following example uses BSD `base64` (default on macOS).

```bash
$ base64 -i krb5.keytab -o kerb5.keytab.base64-encoded
```

Alternatively, GNU `base64` (the default on Linux) inserts line-feeds in the encoded data by default.
Disable line-wrapping with the `-w 0` argument.

```bash
$ base64 -w 0 -i krb5.keytab > kerb5.keytab.base64-encoded
```

Now that the file is encoded it can be stored as a secret.

```bash
$ dcos security secrets  create -f kerb5.keytab.base64-encoded  some/path/__dcos_base64__mysecret
```

**Note:** The secret name **must** be prefixed with `__dcos_base64__`.

When the `some/path/__dcos_base64__mysecret` secret is referenced in your `dcos {{ model.serviceName }} run` command, its base64-decoded
contents will be made available as a [temporary file](http://mesos.apache.org/documentation/latest/secrets/#file-based-secrets)
in your {{ model.techShortName }} application. **Note:** Make sure to only refer to binary secrets as files since holding binary content
in environment variables is discouraged.


# Using Mesos secrets

Once a secret has been added in the secret store,
you can pass them to {{ model.techShortName }} with the `{{ model.serviceName }}.mesos.<task-name>.secret.names` and
`{{ model.serviceName }}.mesos.<task-name>.secret.<filenames|envkeys>` configuration parameters where `<task-name>` is either `driver` or
`executor`. Specifying `filenames` or `envkeys` will materialize the secret as either a file-based secret or an
environment variable. These configuration parameters take comma-separated lists that are "zipped" together to make the
final secret file or environment variable. We recommend using file-based secrets whenever possible as they are more
secure than environment variables.

**Note**: Secrets are only supported for Mesos containerizer and not for the Docker containerizer. To use the Mesos containerizer, add this configuration:
```
--conf {{ model.serviceName }}.mesos.containerizer=mesos
```

For example to use a secret named `{{ model.serviceName }}/my-secret-file` as a file in the driver _and_ the executors add these configuration
parameters:
```
--conf {{ model.serviceName }}.mesos.containerizer=mesos
--conf {{ model.serviceName }}.mesos.driver.secret.names={{ model.serviceName }}/my-secret-file
--conf {{ model.serviceName }}.mesos.driver.secret.filenames=target-secret-file
--conf {{ model.serviceName }}.mesos.executor.secret.names={{ model.serviceName }}/my-secret-file
--conf {{ model.serviceName }}.mesos.executor.secret.filenames=target-secret-file
```
this will put the contents of the secret `{{ model.serviceName }}/my-secret-file` in a secure RAM-FS mounted secret file named
`target-secret-file` in the driver and executors sandboxes. If you want to use a secret as an environment variable (e.g.
AWS credentials) you change the configurations to be the following:
```
--conf {{ model.serviceName }}.mesos.containerizer=mesos
--conf {{ model.serviceName }}.mesos.driver.secret.names=/{{ model.serviceName }}/my-aws-secret,/{{ model.serviceName }}/my-aws-key
--conf {{ model.serviceName }}.mesos.driver.secret.envkeys=AWS_SECRET_ACCESS_KEY,AWS_ACCESS_KEY_ID
```
This assumes that your secret access key is stored in a secret named `{{ model.serviceName }}/my-aws-secret` and your secret key ID in
`{{ model.serviceName }}/my-aws-key`.

### Limitations
When using a combination of environment and file-based secrets there needs to be an equal number of sinks and secret
sources (i.e. files and environment variables). For example
```
--conf {{ model.serviceName }}.mesos.containerizer=mesos
--conf {{ model.serviceName }}.mesos.driver.secret.names=/{{ model.serviceName }}/my-secret-file,/{{ model.serviceName }}/my-secret-envvar
--conf {{ model.serviceName }}.mesos.driver.secret.filenames=target-secret-file,placeholder-file
--conf {{ model.serviceName }}.mesos.driver.secret.envkeys=PLACEHOLDER,SECRET_ENVVAR
```
will place the content of `{{ model.serviceName }}/my-secret-file` into the `PLACEHOLDER` environment variable and the `target-secret-file` file
as well as the content of `{{ model.serviceName }}/my-secret-envvar` into the `SECRET_ENVVAR` and `placeholder-file`. In the case of binary
secrets the environment variable will still be empty because environment
variables cannot be assigned binary values.

# {{ model.techShortName }} SSL

SSL support in DC/OS {{ model.techName}} encrypts the following channels:

*   From the [DC/OS admin router][11] to the dispatcher.
*   Files served from the drivers to their executors.

To enable SSL, a Java keystore (and, optionally, truststore) must be provided, along with their passwords. The first
three settings below are **required** during job submission. If using a truststore, the last two are also **required**:

| Variable                         | Description                                     |
|----------------------------------|-------------------------------------------------|
| `--keystore-secret-path`         | Path to keystore in secret store                |
| `--keystore-password`            | The password used to access the keystore        |
| `--private-key-password`         | The password for the private key                |
| `--truststore-secret-path`       | Path to truststore in secret store              |
| `--truststore-password`          | The password used to access the truststore      |


In addition, there are a number of {{ model.techShortName }} configuration variables relevant to SSL setup.  These configuration settings
are **optional**:

| Variable                         | Description           | Default Value |
|----------------------------------|-----------------------|---------------|
| `{{ model.serviceName }}.ssl.enabledAlgorithms`    | Allowed cyphers       | JVM defaults  |
| `{{ model.serviceName }}.ssl.protocol`             | Protocol              | TLS           |


The keystore and truststore are created using the [Java keytool][12]. The keystore must contain one private key and its
signed public key. The truststore is optional and might contain a self-signed root-ca certificate that is explicitly
trusted by Java.

Add the stores to your secrets in the DC/OS secret store. For example, if your keystores and truststores
are server.jks and trust.jks, respectively, then use the following commands to add them to the secret
store:

```bash
dcos security secrets create /{{ model.serviceName }}/keystore --file server.jks
dcos security secrets create /{{ model.serviceName }}/truststore --file trust.jks
```

You must add the following configurations to your `dcos {{ model.serviceName }} run ` command.
The ones in parentheses are optional:

```bash

dcos {{ model.serviceName }} run --verbose --submit-args="\
--keystore-secret-path=<path/to/keystore, e.g. {{ model.serviceName }}/keystore> \
--keystore-password=<password to keystore> \
--private-key-password=<password to private key in keystore> \
(—-truststore-secret-path=<path/to/truststore, e.g. {{ model.serviceName }}/truststore> \)
(--truststore-password=<password to truststore> \)
(—-conf {{ model.serviceName }}.ssl.enabledAlgorithms=<cipher, e.g., TLS_RSA_WITH_AES_128_CBC_SHA256> \)
--class <{{ model.techShortName }} Main class> <{{ model.techShortName }} Application JAR> [application args]"
```

**DC/OS 1.10 or earlier:** Since both stores are binary files, they must be base64 encoded before being placed in the
DC/OS secret store. Follow the instructions above on encoding binary secrets to encode the keystore and truststore.

**Note:** If you specify environment-based secrets with `{{ model.serviceName }}.mesos.[driver|executor].secret.envkeys`, the keystore and
truststore secrets will also show up as environment-based secrets, due to the way secrets are implemented. You can
ignore these extra environment variables.

# {{ model.techShortName }} SASL (Executor authentication and BlockTransferService encryption)
{{ model.techShortName }} uses Simple Authentication Security Layer (SASL) to authenticate Executors with the Driver and for encrypting
messages sent between components. This functionality relies on a shared secret between all components you expect to
communicate with each other. A secret can be generated with the DC/OS {{ model.techShortName }} CLI
```bash
dcos {{ model.serviceName }} secret <secret_path>
# for example
dcos {{ model.serviceName }} secret /{{ model.serviceName }}/{{ model.serviceName }}AuthSecret
```
This will generate a random secret and upload it to the DC/OS secrets store [14] at the designated path. To use this
secret for RPC authentication add the following configutations to your CLI command:
```bash
dcos {{ model.serviceName }} run --submit-args="\
...
--executor-auth-secret=/{{ model.serviceName }}/{{ model.serviceName }}AuthSecret
...
"

```



 [11]: https://docs.mesosphere.com/latest/overview/architecture/components/
 [12]: http://docs.oracle.com/javase/8/docs/technotes/tools/unix/keytool.html
 [13]: https://docs.mesosphere.com/latest/security/ent/#spaces-for-secrets
 [14]: https://docs.mesosphere.com/latest/security/ent/secrets/
