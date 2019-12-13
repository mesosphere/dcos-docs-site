---
layout: layout.pug
navigationTitle: Advanced
excerpt: Advanced features of Apache Cassandra service
title: Advanced features
menuWeight: 45
model: /mesosphere/dcos/services/cassandra/data.yml
render: mustache
---

#include /mesosphere/dcos/services/include/advanced.tmpl

[enterprise]
## Secure JMX
[/enterprise]

{{ model.techName }} supports Secure JMX allowing you to remotely manage and monitor Cassandra.

### Configuration Options

| Option | Description |
|----------------------|-------------|
| jmx.enabled | Enables the secure JMX |
| jmx_port | JMX port |
| jmx.rmi_port | JMX RMI port |
| jmx.access_file | The path to the secret in the Secret Store that has the contents of the access file. |
| jmx.password_file | The path to the secret in the Secret Store that has the contents of the password file. |
| jmx.key_store | The path to the secret in the Secret Store that has the contents of the key store. |
| jmx.key_store_password_file | The path to the secret in the Secret Store that has the contents of the key store password file. |
| jmx.add_trust_store | Enables the user provided trust store. |
|jmx.trust_store | The path to the secret in the Secret Store that has the contents of the trust store. |
|jmx.trust_store_password_file | The path to the secret in the Secret Store that has the contents of the trust store password file. |

Read more about using JMX options <a href="https://docs.oracle.com/javadb/10.10.1.2/adminguide/radminjmxenablepwdssl.html">here</a>.

### Configuring JMX with self-signed certificate

1. Generate a self-signed key store and trust store.

    ```bash
    keytool -genkey -alias server-cert -keyalg rsa  -dname "CN=cassandra.example.com,O=Example Company,C=US"  -keystore keystore.ks -storetype JKS -storepass changeit -keypass changeit
    ```

    ```bash
    keytool -genkey -alias server-cert -keyalg rsa  -dname "CN=cassandra.example.com,O=Example Company,C=US"  -keystore truststore.ks -storetype JKS -storepass changeit -keypass changeit
    ```

1. Generate files containing the trust store and key store passwords.

    ```bash
    cat <<EOF >> trust_store_pass
    changeit
    EOF
    ```

    ```bash
    cat <<EOF >> key_store_pass
    changeit
    EOF
    ```

1. Create a JMX access file.

    ```bash
    cat <<EOF >> access_file
    admin readwrite
    user  readonly
    EOF
    ```

1. Create a JMX password file.

    ```bash
    cat <<EOF >> password_file
    admin  adminpassword
    user   userpassword
    EOF
    ```

1. Create necessary secrets in DC/OS for JMX.

    ```bash
    dcos package install dcos-enterprise-cli --yes
    dcos security secrets create -f keystore.ks cassandra/keystore
    dcos security secrets create -f key_store_pass cassandra/keystorepass
    dcos security secrets create -f truststore.ks cassandra/truststore
    dcos security secrets create -f trust_store_pass cassandra/truststorepass
    dcos security secrets create -f password_file cassandra/passwordfile
    dcos security secrets create -f access_file cassandra/access
    ```

1. Create a custom service configuration `options.json` with JMX enabled.

    ```json
    {
      "service": {
        "jmx": {
          "enabled": true,
          "rmi_port": 31298,
          "access_file": "cassandra/access",
          "password_file": "cassandra/passwordfile",
          "key_store": "cassandra/keystore",
          "key_store_password_file": "cassandra/keystorepass",
          "add_trust_store": true,
          "trust_store": "cassandra/truststore",
          "trust_store_password_file": "cassandra/truststorepass"
        }
      },
      "cassandra": {
        "jmx_port": 31297
      }
    }
    ```

1. Install Cassandra with the options file you created.

  ```bash
  dcos package install cassandra --options="options.json"
  ```
