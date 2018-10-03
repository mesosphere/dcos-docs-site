---
layout: layout.pug
navigationTitle:  Unsealing the Secret Store
title: Unsealing the Secret Store
menuWeight: 3
excerpt: Unsealing the Secret Store

enterprise: true
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->

# About unsealing the Secret Store

The Secret Store can become sealed under the following circumstances:

- [After being manually sealed.](/1.11/security/ent/secrets/seal-store/)
- After a power outage.
- Due to inability to access underlying storage (such as ZooKeeper) by the Vault instance.

A sealed Secret Store cannot be accessed from the web interface. Secret values cannot be retrieved using the [Secrets API](/1.11/security/ent/secrets/secrets-api/). Services that depend on values provisioned to them via environment variables may fail to deploy.

To unseal the Secret Store, complete the following steps. They will unseal just a single instance of `dcos-secrets`. If the cluster URL obtained through `dcos config show core.dcos_url` points to a load balancer and there is more than one master node in the cluster, then these steps should be issued against each master node instead, and the cluster URL should be changed to the address of individual master nodes.

The intended status of the seal is persisted, so if one of the prerequisites for sealing the store occurs, `dcos-secrets` will unseal it again automatically even after being restarted. Only the steps depicted in [sealing the store](/1.11/security/ent/secrets/unseal-store/) will seal it back.

**Prerequisites:**


- [DC/OS CLI installed](/1.11/cli/install/)
- Logged into the DC/OS CLI as a superuser via `dcos auth login`
- If your [security mode](/1.11/security/ent/#security-modes) is `permissive` or `strict`, you must follow the steps in [Downloading the Root Cert](/1.11/security/ent/tls-ssl/get-cert/) before issuing the `curl` commands in this section. 
- If your [security mode](1/1.11/security/ent/#security-modes) is `disabled`, you must delete `--cacert dcos-ca.crt` from the commands before issuing them.


# <a name="unseal-def-keys"></a>Unsealing a Secret Store sealed with default keys

1. From a terminal prompt, check the status of the Secret Store via the following command.

   ```bash
   curl --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/secrets/v1/seal-status/default
   ```

1. The Secret Store service should return a response like the following.

   ```json
   {"sealed":true,"threshold":1,"shares":1,"progress":0}
   ```

   If the value of `"sealed"` is `false`, do not complete the rest of this procedure. If the Secret Store is not sealed, you cannot unseal it.

1. Use the following `curl` command to unseal the store.

    ```bash
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/secrets/v1/auto-unseal/default
    ```

1. Confirm that the Secret Store was unsealed with this command.

   ```bash
   curl --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/secrets/v1/seal-status/default
   ```

    The Secret Store service should return the following JSON response, indicating success.

   ```json
   {"sealed":false,"threshold":1,"shares":1,"progress":0}
   ```
