---
layout: layout.pug
navigationTitle: Getting started with Kafka using custom TLS 
title: Getting started with Kafka using custom TLS certificate
menuWeight: 5
excerpt: DC/OS Kafka is a distributed high-throughput publish-subscribe messaging system with strong ordering guarantees.
enterprise: false
model: /mesosphere/dcos/services/kafka/data.yml
render: mustache
---

## Using Custom TLS settings Kafka package

To use the custom TLS certs for kafka service, we need to add the following options in the configuration of the package:

```
"service": {
    "name" : "kafka",
    "transport_encryption": {
        "enabled": true,
        "tls_cert": "${SERVICE_NAME}/customtlscert",
        "key_store": "${SERVICE_NAME}/keystore",
        "key_store_password_file": "${SERVICE_NAME}/keystorepass",
        "trust_store": "${SERVICE_NAME}/truststore",
        "trust_store_password_file": "${SERVICE_NAME}/truststorepass"
        "allow_plaintext": false
    }
}
```

> Note: `transport_encryption.enabled:true` means that custom transport encryption is enabled.  In future releases, we will separate the custom tls and default tls feature.

## Example with self-signed certificate

Generate CA-cert and CA-private-key, called `ca-cert` and `ca-key` respectively

```
openssl req -new -newkey rsa:4096 -days 365 -x509 -subj "/C=US/ST=CA/L=SF/O=Mesosphere/OU=Mesosphere/CN=kafka" -keyout ca-key -out ca-cert -nodes
```

Generate a keystore, called `broker.keystore`
```
keytool -genkey -keyalg RSA -keystore broker.keystore -validity 365 -storepass changeit -keypass changeit -dname "CN=kafka" -storetype JKS
```

Generate Certificate Signing Request (CSR) called `cert-file`
```
keytool -keystore broker.keystore -certreq -file cert-file -storepass changeit -keypass changeit
```

Sign the Generated certificate
```
openssl x509 -req -CA ca-cert -CAkey ca-key -in cert-file -out cert-signed -days 365 -CAcreateserial -passin pass:changeit
```

Generate a truststore with ca-cert
```
keytool -keystore broker.truststore -alias CARoot -import -file ca-cert -storepass changeit -keypass changeit -noprompt
```

Generate a truststore called `broker.truststore` with ca-cert
```
keytool -keystore broker.truststore -alias CARoot -importcert -file ca-cert -storepass changeit -keypass changeit -noprompt
```

Generate a truststore with self-signed cert
```
keytool -keystore broker.truststore -alias CertSigned -importcert -file cert-signed -storepass changeit -keypass changeit -noprompt
```

Attach the dcos cluster using
```
dcos cluster setup {CLUSTER_URL}
```

Create Service account and its secret to use the TLS feature
```
dcos security org service-accounts keypair ${SERVICE_NAME}-private-key.pem ${SERVICE_NAME}-public-key.pem

dcos security org service-accounts create -p ${SERVICE_NAME}-public-key.pem -d "desc" "${SERVICE_NAME}"

dcos security secrets create-sa-secret --strict ${SERVICE_NAME}-private-key.pem "${SERVICE_NAME}" "${SERVICE_NAME}-secret"
```

Assign permissions to the user

```
dcos security org groups add_user superusers ${SERVICE_NAME}
dcos security org users grant ${SERVICE_NAME}dcos:mesos:master:task:user:nobody create
dcos security org users grant ${SERVICE_NAME}dcos:mesos:master:framework:role:${SERVICE_NAME}-role create
dcos security org users grant ${SERVICE_NAME}dcos:mesos:master:reservation:role:${SERVICE_NAME}-role create
dcos security org users grant ${SERVICE_NAME}dcos:mesos:master:volume:role:${SERVICE_NAME}-role create
dcos security org users grant ${SERVICE_NAME}dcos:mesos:master:reservation:principal:${SERVICE_NAME} delete
dcos security org users grant ${SERVICE_NAME}dcos:mesos:master:volume:principal:${SERVICE_NAME} delete
dcos security org users grant ${SERVICE_NAME}dcos:secrets:default:/${SERVICE_NAME}/\* full
dcos security org users grant ${SERVICE_NAME}dcos:secrets:list:default:/${SERVICE_NAME} read
```

Now we are ready to install a Kafka cluster with custom transport encryption enabled.

Create a file named `dcos-kafka-options-customtls.json` with following configuration

```
cat <<EOF >>dcos-kafka-options-customtls.json
{
  "service": {
    "name": "${SERVICE_NAME}",
    "service_account": "${SERVICE_NAME}",
    "service_account_secret": "${SERVICE_NAME}-secret",
    "security": {
      "transport_encryption": {
        "enabled": true,
        "allow_plaintext": false,
        "tls_cert": "${SERVICE_NAME}/customtlscert",
        "key_store": "${SERVICE_NAME}/keystore",
        "key_store_password_file": "${SERVICE_NAME}/keystorepass",
        "trust_store": "${SERVICE_NAME}/truststore",
        "trust_store_password_file": "${SERVICE_NAME}/truststorepass"
      }
    }
  }
}
EOF
```

Install the kafka service
```
dcos package install kafka --options=dcos-kafka-options-customtls.json --yes
```

The custom transport encryption settings can be verified from the `server.properties` file of brokers.