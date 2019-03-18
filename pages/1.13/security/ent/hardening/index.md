---
layout: layout.pug
navigationTitle:  Hardening
title: Hardening
menuWeight: 100
excerpt: Increasing the security of your cluster
enterprise: true
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->


Your cluster will become more secure as you move from `permissive` to `strict` [security modes](/1.13/security/ent/#security-modes). However, there are a number of settings that you can modify independently of your security mode to increase the security of your cluster.

- Ensure the network is setup according to the information for [securing your cluster](/1.13/administering-clusters/securing-your-cluster/).

- <a name="secure-flag"></a>Set the [`auth_cookie_secure_flag`](/1.13/installing/ent/custom/configuration/configuration-parameters/#auth-cookie-secure-flag-enterprise) to `true`.

- <a name="zk"></a>Do not use the default ZooKeeper credentials. Instead, specify long, random values for the following: [`zk_super_credentials`](/1.13/installing/ent/custom/configuration/configuration-parameters/#zk-superuser), [`zk_master_credentials`](/1.13/installing/ent/custom/configuration/configuration-parameters/#zk-master), and [`zk_agent_credentials`](/1.13/installing/ent/custom/configuration/configuration-parameters/#zk-agent).

- [Get the root certificate of your DC/OS CA](/1.13/security/ent/tls-ssl/get-cert/#oob) and manually provision [browsers](/1.13/security/ent/tls-ssl/ca-trust-browser/), [DC/OS CLI](/1.13/security/ent/tls-ssl/ca-trust-cli/), [curl](/1.13/security/ent/tls-ssl/ca-trust-curl/), and other clients with it.

- [Provision services with service accounts even when optional](/1.13/security/ent/service-auth/).

- [Use secrets to store and pass sensitive information to services](/1.13/security/ent/secrets/).

- [Use spaces to restrict service access to secrets](/1.13//security/ent/#spaces).

- Tightly restrict the distribution of SSH keys. For debugging, consider using [`dcos task exec`](/1.13/monitoring/debugging/) instead.

- Adhere to the [principle of least privilege](http://searchsecurity.techtarget.com/definition/principle-of-least-privilege-POLP) and give your users only the minimum [permissions](/1.13/security/ent/perms-reference/) that they need. Avoid granting users or service accounts the `dcos:superuser` permission.

- If you [configure an external LDAP directory](/1.13/security/ent/ldap/ldap-conn/), select either **Use SSL/TLS for all connections** or **Attempt StartTLS, abort if it fails** and provide the root CA certificate and any intermediate certificates of the LDAP directory server in the **CA certificate chain (Optional)** field.

- [Override the Linux user account of your services](/1.13/security/ent/users-groups/config-linux-user/) to use a less privileged account such as `nobody`.
