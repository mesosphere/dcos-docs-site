---
layout: layout.pug
navigationTitle:  Sealing the Secret Store
title: Sealing the Secret Store
menuWeight: 2
excerpt:

enterprise: true
---

You may want to manually seal the Secret Store to protect its contents from an intruder.

Sealed Secret Stores cannot be accessed from the GUI. Secret values cannot be retrieved using the [Secrets API](/1.9/security/ent/secrets/secrets-api/). Services that depend on values in the Secret Store may fail to deploy.

To seal the Secret Store, complete the following steps. They will seal just a single instance of dcos-secrets. If the cluster URL obtained through `dcos config show core.dcos_url` points to a load balancer and there is more than one master node in the cluster, then these steps should be issued against each and every master node instead and the cluster URL should be changed to the address of individual master nodes.

**Prerequisites:**

- You must have the [DC/OS CLI installed](/1.9/cli/install/) and be logged in as a superuser via `dcos auth login`.

- If your [security mode](/1.9/security/ent/#security-modes) is `permissive` or `strict`, you must [get the root cert](/1.9/networking/tls-ssl/get-cert/) before issuing the curl commands in this section.  If your [security mode](/1.9/security/ent/#security-modes) is `disabled`, you must delete `--cacert dcos-ca.crt` from the commands before issuing them.


1. From a terminal prompt, check the status of the Secret Store via the following command.

   ```bash
   curl --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/secrets/v1/seal-status/default
   ```

1. The Secret Store service should return a response like the following.

   ```json
   {"sealed":false,"threshold":1,"shares":1,"progress":0}
   ```

   If the value of `"sealed"` is `true`, do not complete the rest of this procedure. If the Secret Store is already sealed, you cannot seal it again.

1. Use the following command to seal the Secret Store.

   ```bash
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/secrets/v1/seal/default
   ```

1. Confirm that the Secret Store was sealed with this command.

   ```bash
   curl --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/secrets/v1/seal-status/default
   ```

1. It should return the following JSON.

   ```json
   {"sealed":true,"threshold":1,"shares":1,"progress":0}
   ```
