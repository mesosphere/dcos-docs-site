---
layout: layout.pug
title: Hardening
menuWeight: 800
excerpt: >
  Your cluster will become more secure as
  you move from disabled to permissive to
  strict security modes. However, there
  are a number of settings that you can
  modify independent of your security mode
  to increase the security of your
  cluster.
featureMaturity: ""
enterprise: 'yes'
navigationTitle:  Hardening
---


Your cluster will become more secure as you move from `disabled` to `permissive` to `strict` [security modes](/docs/1.10/security/#security-modes).

However, there are a number of settings that you can modify independent of your security mode to increase the security of your cluster.

- <a name="secure-flag"></a>In `permissive` and `strict` modes, set the [`auth_cookie_secure_flag`](/docs/1.10/installing/custom/configuration/configuration-parameters/#auth-cookie) to `true`.

- <a name="zk"></a>Do not use the default ZooKeeper credentials. Instead, specify long, random values for the following: [`zk_super_credentials`](/docs/1.10/installing/custom/configuration/configuration-parameters/#zk-superuser), [`zk_master_credentials`](/docs/1.10/installing/custom/configuration/configuration-parameters/#zk-master), and [`zk_agent_credentials`](/docs/1.10/installing/custom/configuration/configuration-parameters/#zk-agent).

- [Implement IPsec encryption of ZooKeeper communications](https://datatracker.ietf.org/wg/ipsec/documents/).

- [Get the root certificate of your DC/OS CA](/docs/1.10/networking/tls-ssl/get-cert/#oob) and manually provision [browsers](/docs/1.10/networking/tls-ssl/ca-trust-browser/), [DC/OS CLI](/docs/1.10/networking/tls-ssl/ca-trust-cli/), [curl](/docs/1.10/networking/tls-ssl/ca-trust-curl/), and other clients with it.

- [Reinitialize your Secret Store with a custom keypair](/docs/1.10/security/secrets/custom-key/) and store the custom key in a very secure location.

- [Provision services with service accounts even when optional](/docs/1.10/security/service-auth/).

- [Use secrets to store and pass sensitive information to services](/docs/1.10/security/secrets/).

- [Use spaces to restrict service access to secrets](/docs/1.10/overview/security/spaces/).

- Tightly restrict the distribution of SSH keys. For debugging, consider using [`dcos task exec`](/docs/1.10/monitoring/debugging/) instead. 

- Adhere to the [principle of least privilege](http://searchsecurity.techtarget.com/definition/principle-of-least-privilege-POLP) and give your users only the minimum [permissions](/docs/1.10/security/perms-reference/) that they need. Avoid granting users or service accounts the `dcos:superuser` permission.

- If you [configure an external LDAP directory](/docs/1.10/security/ldap/ldap-conn/), select either **Use SSL/TLS for all connections** or **Attempt StartTLS, abort if it fails** and provide the root CA certificate and any intermediate certificates of the LDAP directory server in the **CA certificate chain (Optional)** field.

- [Override the Linux user account of your services](/docs/1.10/security/users-groups/config-linux-user/) to use a less privileged account such as `nobody`.