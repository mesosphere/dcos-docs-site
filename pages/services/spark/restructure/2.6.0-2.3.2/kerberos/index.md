---
layout: layout.pug
excerpt: Setting up Kerberos to run with DC/OS Apache Spark
title: Kerberos
navigationTitle: Kerberos
menuWeight: 120
render: mustache
model: /services/spark/data.yml
---


# HDFS Kerberos

Kerberos is an authentication system that allows {{ model.techShortName }} to retrieve and write data securely to a Kerberos-enabled HDFS cluster. As of Mesosphere {{ model.techShortName }} `2.2.0-2`, long-running jobs will renew their delegation tokens (authentication credentials). This section assumes you have previously set up a Kerberos-enabled HDFS cluster.

<p class="message--note"><strong>NOTE: </strong>Depending on your OS, {{ model.techShortName }} may need to be run as <code>root</code> in order to authenticate with your Kerberos-enabled service. This can be done by setting <code>--conf .mesos.driverEnv.SPARK_USER=root</code> when submitting your job.</p>

## {{ model.techShortName }} installation

{{ model.techShortName }} (and all Kerberos-enabled) components need a valid `krb5.conf` configuration file. You can set up the {{ model.techShortName }} service to use a single `krb5.conf` file for all of its drivers. The `krb5.conf` file tells {{ model.techShortName }} how to connect to your Kerberos key distribution center (KDC).  

To use Kerberos with {{ model.techShortName }}:

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

1. Install {{ model.techShortName }} with your custom configuration, here called `options.json`:

        dcos package install --options=/path/to/options.json
1. Make sure your `keytab` file is in the DC/OS secret store, under a path that is accessible
    by the {{ model.techShortName }} service. 
    
    Since the `keytab` is a binary file, you must also base64 encode it on DC/OS 1.10 or earlier. See [Using the Secret Store](/1.12/security/) for details.

1. If you are using the history server, you must also configure the `krb5.conf`, principal, and keytab for the history server. Add the Kerberos configurations to your `-history` JSON configuration file:

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

## Job submission

To authenticate to a Kerberos KDC, {{ model.techShortName }} on Mesos supports keytab files as well as ticket-granting tickets (TGTs). Keytabs are valid indefinitely, while tickets can expire. Keytabs are recommended, especially for long-running streaming jobs.

### Controlling the `krb5.conf` with environment variables

If you did not specify `service.security.kerberos.kdc.hostname`, `service.security.kerberos.kdc.port`, and `services.security.realm` at install time, but wish to use a templated `krb5.conf` on a job submission, you can do this with the following environment variables:

    --conf .mesos.driverEnv.SPARK_SECURITY_KERBEROS_KDC_HOSTNAME=<kdc_hostname> \
    --conf .mesos.driverEnv.SPARK_SECURITY_KERBEROS_KDC_PORT=<kdc_port> \
    --conf .mesos.driverEnv.SPARK_SECURITY_KERBEROS_REALM=<kerberos_realm> \

You can also set the base64 encoded `krb5.conf` after install time:

    --conf .mesos.driverEnv.SPARK_MESOS_KRB5_CONF_BASE64=<krb5.conf_base64_encoding> \

<p class="message--note"><strong>NOTE: </strong>This setting <code>SPARK_MESOS_KRB5_CONF_BASE64</code> overrides any settings set with <code>SPARK_SECURITY_KERBEROS_KDC_HOSTNAME</code>, <code>SPARK_SECURITY_KERBEROS_KDC_PORT</code>, and <code>SPARK_SECURITY_KERBEROS_REALM</code>.</p>

### Setting the {{ model.techShortName }} user

By default, when Kerberos is enabled, {{ model.techShortName }} runs as the OS user corresponding to the primary of the specified Kerberos principal. For example, the principal "alice@LOCAL" would map to the user name "alice". If it is known that "alice" is not available as an OS user, either in the Docker image or in the host, the {{ model.techShortName }} user should be specified as `root` or `nobody` instead:

        --conf .mesos.driverEnv.SPARK_USER=<{{ model.techShortName }} user>

### Keytab authentication

Submit the job with the keytab:

    dcos  run --submit-args="\
    --kerberos-principal user@REALM \
    --keytab-secret-path //hdfs-keytab \
    --conf .mesos.driverEnv.SPARK_USER=< user> \
    --conf ... --class My{{ model.techShortName }}Job <url> <args>"

### TGT authentication

Submit the job with the ticket:

    dcos  run --submit-args="\
    --kerberos-principal user@REALM \
    --tgt-secret-path //tgt \
    --conf .mesos.driverEnv.SPARK_USER=< user> \
    --conf ... --class My{{ model.techShortName }}Job <url> <args>"

<p class="message--note"><strong>NOTE: </strong>The examples on this page assume that you are using the default service name for {{ model.techShortName }}, "spark". If using a different service name, update the secret paths accordingly.</p>

You can access external (non-DC/OS) Kerberos-secured HDFS clusters from {{ model.techShortName }} on Mesos.

<p class="message--important"><strong>IMPORTANT: DC/OS 1.10 or earlier:</strong> These credentials are security-critical. The DC/OS secret store requires you to use base64 to encode binary secrets (such as the Kerberos keytab) before adding them. If they are uploaded with the <code>__dcos_base64__</code> prefix, they are automatically decoded when the secret is made available to your {{ model.techShortName }} job. If the secret name <strong>does not</strong> have this prefix, the keytab will be decoded and written to a file in the sandbox. This leaves the secret exposed and is not recommended. </p>

# Using Kerberos-secured Kafka

{{ model.techShortName }} can consume data from a Kerberos-enabled Kafka cluster. Connecting {{ model.techShortName }} to secure Kafka does not require special installation parameters. 

However, the Kafka cluster does require the {{ model.techShortName }} driver **and** the {{ model.techShortName }} executors be able to access the following files:

* Client Java Authentication and Authorization Service (JAAS) file. This file is provided using Mesos URIS with `--conf .mesos.uris=<location_of_jaas>`.
* `krb5.conf` for your Kerberos setup. Like HDFS, this file is provided using a base64 encoding of the file:

        cat krb5.conf | base64 -w 0

    The encoded file is assigned to the environment variable `KRB5_CONFIG_BASE64` for the driver and the executors:

        --conf .mesos.driverEnv.KRB5_CONFIG_BASE64=<base64_encoded_string>
        --conf .executorEnv.KRB5_CONFIG_BASE64=<base64_encoded_string>

* The `keytab` containing the credentials for accessing the Kafka cluster.

        --conf .mesos.containerizer=mesos                            # required for secrets
        --conf .mesos.driver.secret.names=<keytab>                   # e.g. /kafka_keytab
        --conf .mesos.driver.secret.filenames=<keytab_file_name>     # e.g. kafka.keytab
        --conf .mesos.executor.secret.names=<keytab>                 # e.g. /kafka_keytab
        --conf .mesos.executor.secret.filenames=<keytab_file_name>   # e.g. kafka.keytab

* Finally, you will need to tell {{ model.techShortName }} to use the JAAS file:

        --conf park.driver.extraJavaOptions=-Djava.security.auth.login.config=/mnt/mesos/sandbox/<jaas_file>
        --conf .executor.extraJavaOptions=-Djava.security.auth.login.config=/mnt/mesos/sandbox/<jaas_file>

<p class="message--important"><strong>IMPORTANT: </strong>It is important that the file name is the same for the driver and executor keytab file (<code>keytab_file_name</code> above) and that this file is properly addressed in your JAAS file. </p>
