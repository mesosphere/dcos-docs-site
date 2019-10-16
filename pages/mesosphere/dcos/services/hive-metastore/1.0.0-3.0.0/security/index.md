---
layout: layout.pug
navigationTitle: Security
excerpt: Securing your service
title: DC/OS Hive Metastore security
menuWeight: 50
model: /mesosphere/dcos/services/hive-metastore/data.yml
render: mustache
enterprise: true
---

# DC/OS {{ model.techName }} Security

- The DC/OS {{ model.techName }} service allows you to create a service account to configure access for {{ model.techName }}. The service allows you to create and assign permissions as required for access.  

- The DC/OS {{ model.techName }} service supports {{ model.techName }}'s native transport encryption mechanisms. The service provides automation and orchestration to simplify the usage of the following features.

<p class="message--note"><strong>NOTE: </strong>These security features are only available on DC/OS Enterprise 1.10 and later.</p>

#include /mesosphere/dcos/services/include/service-account.tmpl

#include /mesosphere/dcos/services/include/security-create-permissions.tmpl

# <a name="Using the Secret Store for Passwords></a> Using the Secret Store for Passwords

Enterprise DC/OS provides a secrets store to enable access to sensitive data such as database passwords, private keys, and API tokens. DC/OS manages secure transportation of secret data, access control and authorization, and secure storage of secret content. Detailed information as described [here](https://docs.d2iq.com/mesosphere/dcos/latest/security/ent/secrets)

All tasks defined in the pod will have access to secret data. If the content of the secret is changed, the relevant pod needs to be restarted so that it can get updated content from the secret store.

We can use secrets in Hive Metastore to store database passwords. We can use the secret store as follows in order to store and use secrets in Hive Metastore service:

1. From the left-side navigation menu, click on `Secrets`.

2. From the Secrets page, click on the '+' icon in the top-right corner of the screen to create a new secret key-value pair.

3. In the `ID` field, provide a unique ID for the key-pair we want to create. This ID will be used later to enable secrets. In the `Value` field, enter the value of the secret i.e. database password, private key, or API token. Lastly, click on `Create Secret`. 

![Creating Secrets](https://downloads.mesosphere.com/hive-metastore/assets/secret_docs_screen1.png)

4. Now, go to the Hive Metastore's service configuration page for a fresh deployment of service using secrets. Click on 'Hive Metastore' configuration menu to proceed.

![Hive Metastore Configuration](https://downloads.mesosphere.com/hive-metastore/assets/secret_docs_screen2.png)

5. Scroll down and look for the `Enable Secrets` checkbox. Check the box to enable secrets. Now, enter the `ID` of the secret created earlier in the `Database Password` field. Click 'Review & Run'. The service will now be deployed using secrets.

![Using Secrets as the Database Password](https://downloads.mesosphere.com/hive-metastore/assets/secret_docs_screen3.png)

# <a name="Forwarding DNS and Custom Domain"></a> Forwarding DNS and Custom Domain

#include /mesosphere/dcos/services/include/forwarding-dns-custom-domain.tmpl

