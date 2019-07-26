---
layout: layout.pug
navigationTitle: Kerberos
excerpt: Using Kerberos with DC/OS Data Science Engine to retrieve and write data securely
title: Kerberos
menuWeight: 5
model: /services/data-science-engine/data.yml
render: mustache
---
Kerberos is an authentication system that allows {{ model.techName }} to retrieve and write data securely to a Kerberos-enabled HDFS cluster. Long-running jobs will renew their delegation tokens (authentication credentials). This section assumes you have previously set up a Kerberos-enabled HDFS cluster.

<p class="message--note"><strong>NOTE: </strong>Depending on your OS, Spark may need to be run as root in order to authenticate with your Kerberos-enabled service. This can be done by setting <tt>--conf .mesos.driverEnv.SPARK_USER=root</tt> when submitting your job.</p>

# Installation

{{ model.techName }} and all Kerberos-enabled components need a valid `krb5.conf` configuration file. You can set up {{ model.techName }} to use a single `krb5.conf` file for all of its drivers. The `krb5.conf` file tells `{{ model.packageName }}` how to connect to your Kerberos key distribution center (KDC). 

## Configuring Kerberos with {{ model.techName }}:

1. Base64 encode the `krb5.conf` file:

       cat krb5.conf | base64 -w 0

1. Add the encoded file as a string value into your JSON configuration file:

    ```json
    {
        "security": {
        "kerberos": {
            "enabled": "true",
            "krb5conf": "<base64 encoding>"
            }
        }
    }
    ```

    The JSON configuration will probably also have the `hdfs` parameters similar to the following:

    ```json
        {
        "service": {
            "name": "kerberized-",
            "user": "nobody"
        },
        "hdfs": {
            "config-url": "http://api.hdfs.marathon.l4lb.thisdcos.directory/v1/endpoints"
        },
        "security": {
            "kerberos": {
                "enabled": true,
                "krb5conf": "<base64_encoding>"
            }
        }
        }
    ```

    Alternatively, you can specify properties for the `krb5.conf` file with more concise options:
   ```json
       {
       "security": {
           "kerberos": {
           "enabled": true,
           "kdc": {
               "hostname": "<kdc_hostname>",
               "port": <kdc_port>
           },
           "realm": "<kdc_realm>"
           }
       }
       }
   ```

1. Install {{ model.packageName }} with your custom configuration, here called `options.json`:

    ```bash
    dcos package install --options=/path/to/options.json
    ```

    Make sure your `keytab` file is in the DC/OS secret store, under a path that is accessible  by the {{ model.packageName }} service.  Since the `keytab` is a binary file, you must also base64 encode it on DC/OS 1.10 or earlier. See Using the Secret Store for details.

    If you are using the history server, you must also configure the `krb5.conf`, principal, and keytab for the history server. Add the Kerberos configurations to your `-history` JSON configuration file:

   ```json
       {
       "service": {
           "user": "nobody",
           "hdfs-config-url": "http://api.hdfs.marathon.l4lb.thisdcos.directory/v1/endpoints"
       },
       "security": {
           "kerberos": {
               "enabled": true,
               "krb5conf": "<base64_encoding>",
               "principal": "<Kerberos principal>",  # e.g. @REALM
               "keytab": "<keytab secret path>"      # e.g. -history/hdfs_keytab
           }
       }
       }
   ```
   Alternatively, you can specify properties of the `krb5.conf`:

   ```json
       {
       "security": {
           "kerberos": {
               "enabled": true,
               "kdc": {
                   "hostname": "<kdc_hostname>",
                   "port": <kdc_port>
           },
               "realm": "<kdc_realm>"
               "principal": "<Kerberos principal>",  # e.g. @REALM
               "keytab": "<keytab secret path>"      # e.g. -history/hdfs_keytab
           }
       }
       }
   ```

1. Make sure all users have write permission to the history HDFS directory. In an HDFS client:

   ```bash
   hdfs dfs -chmod 1777 <history directory>
   ```

# Job submission

To authenticate to a Kerberos KDC, {{ model.techName }} on Mesos supports keytab files as well as ticket-granting tickets (TGTs). Keytabs are valid indefinitely, while tickets can expire. Keytabs are recommended, especially for long-running streaming jobs.

## Controlling environment variables

If you did not specify `service.security.kerberos.kdc.hostname`, `service.security.kerberos.kdc.port`, and `services.security.realm` at install time, but wish to use a templated `krb5.conf` on a job submission, you can do this with the following environment variables:
```bash
--conf .mesos.driverEnv.SPARK_SECURITY_KERBEROS_KDC_HOSTNAME=<kdc_hostname> \
--conf .mesos.driverEnv.SPARK_SECURITY_KERBEROS_KDC_PORT=<kdc_port> \
--conf .mesos.driverEnv.SPARK_SECURITY_KERBEROS_REALM=<kerberos_realm> \
```
You can also set the base64 encoded `krb5.conf` after install time:
```bash
--conf .mesos.driverEnv.SPARK_MESOS_KRB5_CONF_BASE64=<krb5.conf_base64_encoding> \
```
<p class="message--note"><strong>NOTE: </strong>This setting, SPARK_MESOS_KRB5_CONF_BASE64, overrides any settings set with SPARK_SECURITY_KERBEROS_KDC_HOSTNAME, SPARK_SECURITY_KERBEROS_KDC_PORT and SPARK_SECURITY_KERBEROS_REALM.</p>

## Setting the {{ model.techName }} user

By default, when Kerberos is enabled, {{ model.packageName }} runs as the OS user corresponding to the primary of the specified Kerberos principal. For example, the principal "alice@LOCAL" would map to the user name "alice". If it is known that "alice" is not available as an OS user, either in the Docker image or in the host, the {{ model.packageName }} user should be specified as `root` or `nobody` instead:

```bash
 --conf .mesos.driverEnv.SPARK_USER=<{{ model.packageName }} user>
 ```

## Keytab authentication

Submit the job with the keytab:
```bash
   dcos  run --submit-args="\
   --kerberos-principal user@REALM \
   --keytab-secret-path //hdfs-keytab \
   --conf .mesos.driverEnv.SPARK_USER=< user> \
   --conf ... --class My{{ model.packageName }}Job <url> <args>"
```

## TGT authentication

Submit the job with the ticket:
```bash
   dcos  run --submit-args="\
   --kerberos-principal user@REALM \
   --tgt-secret-path //tgt \
   --conf .mesos.driverEnv.SPARK_USER=< user> \
   --conf ... --class My{{ model.packageName }}Job <url> <args>"
```

<p class="message--note"><strong>NOTE: </strong>The examples on this page assume that you are using the default service name for {{ model.packageName }}, "{{ model.packageName }}". If using a different service name, update the secret paths accordingly.</p>

You can access external (non-DC/OS) Kerberos-secured HDFS clusters from {{ model.techName }} on Mesos.

<p class="message--important"><strong>IMPORTANT: </strong>DC/OS 1.10 or earlier:  These credentials are security-critical. The DC/OS secret store requires you to use base64 to encode binary secrets (such as the Kerberos keytab) before adding them. If they are uploaded with the <tt>__dcos_base64__</tt> prefix, they are automatically decoded when the secret is made available to your {{ model.packageName }} job. If the secret name does not have this prefix, the keytab will be decoded and written to a file in the sandbox. This leaves the secret exposed and is not recommended. </p>

# Using Kerberos-secured Kafka

{{ model.techName }} can consume data from a Kerberos-enabled Kafka cluster. Connecting {{ model.techName }} to secure Kafka does not require special installation parameters.
However, the Kafka cluster does require that the {{ model.techName }} driver and the {{ model.techName }} executors be able to access the following files:

Client Java Authentication and Authorization Service ({{ model.productName }}) file. This file is provided using Mesos URIS with `--conf .mesos.uris=<location_of_{{ model.productName }}>`.
`krb5.conf` for your Kerberos setup. Like HDFS, this file is provided using a base64 encoding of the file:
```bash
cat krb5.conf | base64 -w 0
```

The encoded file is assigned to the environment variable `KRB5_CONFIG_BASE64` for the driver and the executors:

```bash
--conf .mesos.driverEnv.KRB5_CONFIG_BASE64=<base64_encoded_string>
--conf .executorEnv.KRB5_CONFIG_BASE64=<base64_encoded_string>
```

The `keytab` containing the credentials for accessing the Kafka cluster.
```bash
--conf .mesos.containerizer=mesos                            # required for secrets
--conf .mesos.driver.secret.names=<keytab>                   # e.g. /kafka_keytab
--conf .mesos.driver.secret.filenames=<keytab_file_name>     # e.g. kafka.keytab
--conf .mesos.executor.secret.names=<keytab>                 # e.g. /kafka_keytab
--conf .mesos.executor.secret.filenames=<keytab_file_name>   # e.g. kafka.keytab
```
Finally, you will need to tell {{ model.packageName }} to use the {{ model.productName }} file:
```bash
--conf park.driver.extraJavaOptions=-Djava.security.auth.login.config=/mnt/mesos/sandbox/<{{ model.productName }}_file>
--conf .executor.extraJavaOptions=-Djava.security.auth.login.config=/mnt/mesos/sandbox/<{{ model.productName }}_file>
```

<p class="message--important"><strong>IMPORTANT: </strong>It is important that the file name is the same for the driver and executor keytab file (<tt>keytab_file_name</tt> above) and that this file is properly addressed in your {{ model.productName }} file. </p>



