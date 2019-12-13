---
layout: layout.pug
navigationTitle: TLS
excerpt: Using TLS to encrypt channels for greater security
title: TLS
menuWeight: 9
enterprise: true
model: /mesosphere/dcos/services/data-science-engine/data.yml
render: mustache
---

TLS support in {{ model.techName }} encrypts the following channels:

* From the [DC/OS admin router][11] to the {{ model.techName }}.
* Files served from the Spark Driver launched by {{ model.techName }} to Spark Executors.

The keystore and truststore are created using the [Java keytool][12]. The keystore must contain one private key and its signed public key. The truststore is optional and might contain a self-signed root-CA certificate that is explicitly trusted by Java.

You can add the stores as secrets in the DC/OS secret store. For example, if your keystores, truststores and CA bundle are `server.jks`, `trust.jks` and `trust-ca.jks`, respectively, then use the following commands to add them and their passwords to the secret store:

```bash
dcos security secrets create /{{ model.packageName }}/keystore --text-file server.jks
dcos security secrets create /{{ model.packageName }}/truststore --text-file trust.jks
dcos security secrets create /{{ model.packageName }}/ca_bundle_truststore --text-file trust-ca.jks
dcos security secrets create /{{ model.packageName }}/keystore_password --value changeit
dcos security secrets create /{{ model.packageName }}/key_password --value changeit
dcos security secrets create /{{ model.packageName }}/truststore_password --value changeit
```

To enable TLS, a Java keystore (and, optionally, truststore) must be provided, along with their passwords. The first four settings below are **required** during job submission. If using a truststore, the next three are also **required**. The last one is optional:

```json
{
  "security": {
    "tls": {
      "enabled": true,
      "keystore_secret": "/{{ model.packageName }}/keystore",
      "keystore_password": "/{{ model.packageName }}/keystore_password",
      "key_password": "/{{ model.packageName }}/key_password",
      "truststore_secret": "/{{ model.packageName }}/truststore",
      "truststore_password": "/{{ model.packageName }}/truststore_password",
      "ca_bundle_secret": "/{{ model.packageName }}/ca_bundle_truststore",
      "protocol": "TLSv1.2"
    }
  }
}
```

[11]: https://docs.d2iq.com/latest/overview/architecture/components/
[12]: http://docs.oracle.com/javase/8/docs/technotes/tools/unix/keytool.html
