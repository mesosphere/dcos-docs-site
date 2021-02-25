---
layout: layout.pug
navigationTitle: Kerberos
excerpt: Using Kerberos with DC/OS Data Science Engine to retrieve and write data securely
title: Kerberos
menuWeight: 5
enterprise: true
model: /mesosphere/dcos/services/data-science-engine/data.yml
---
Kerberos is an authentication system that allows {{ model.techName }} to retrieve and write data securely to a Kerberos-enabled HDFS cluster. Long-running jobs will renew their delegation tokens (authentication credentials). 

This guide assumes you have already set up a Kerberos-enabled HDFS cluster.

# Configuring Kerberos with {{ model.techName }}

{{ model.techName }} and all Kerberos-enabled components need a valid `krb5.conf` configuration file. The `krb5.conf` file tells `{{ model.packageName }}` how to connect to your Kerberos key distribution center (KDC). You can specify properties for the `krb5.conf` file with the following options.

```json
{
  "security": {
    "kerberos": {
      "enabled": true,
      "kdc": {
        "hostname": "<kdc_hostname>",
        "port": <kdc_port>
      },
      "primary": "<primary_for_principal>",
      "realm": "<kdc_realm>",
      "keytab_secret": "<path_to_keytab_secret>"
    }
  }
}
```

Make sure your `keytab` file is in the DC/OS secret store, under a path that is accessible by the {{ model.packageName }} service.


