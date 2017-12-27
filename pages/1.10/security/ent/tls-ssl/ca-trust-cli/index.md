---
layout: layout.pug
navigationTitle:  >
title: >
  Configuring the DC/OS CLI to trust your
  DC/OS CA
menuWeight: 300
excerpt: >
  By default, the DC/OS CLI does not
  verify the signer of TLS certificates.
  We recommend completing the following
  brief procedure to ensure that the DC/OS
  CLI trusts only your DC/OS CA and
  refuses connections with other parties.
enterprise: true
---

**Note:** This procedure should be unnecessary if you have [set up a proxy](/1.10/security/ent/tls-ssl/haproxy-adminrouter/).

By default, the DC/OS CLI does not verify the signer of TLS certificates. We recommend completing the following brief procedure to ensure that the DC/OS CLI trusts only your DC/OS CA and refuses connections with other parties. 

**Prerequisite:** A local copy of the [root certificate of your DC/OS CA](/1.10/security/ent/tls-ssl/get-cert/).

1. Use the following command to change the default and to set the DC/OS CLI to trust your DC/OS CA.

   ```bash
   dcos config set core.ssl_verify $(pwd)/dcos-ca.crt
   ```

1. You should receive the following message, indicating success.

   ```bash
   [core.ssl_verify]: changed from 'False' to '/path/dcos-ca.crt'
   ```
