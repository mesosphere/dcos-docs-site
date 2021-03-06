---
layout: layout.pug
navigationTitle:  Unsealing the Secret Store
title: Unsealing the Secret Store
menuWeight: 5
excerpt: Understanding how to unseal the Secret Store
enterprise: true
render: mustache
model: /mesosphere/dcos/2.1/data.yml
---

# About unsealing the Secret Store

The Secret Store can become sealed under the following circumstances:

- [After being manually sealed.](/mesosphere/dcos/2.1/security/ent/secrets/seal-store/)
- After a power outage.
- Due to inability to access underlying storage (such as ZooKeeper) by the Vault instance.

A sealed Secret Store cannot be accessed from the web interface. Secret values cannot be retrieved using the [Secrets API](/mesosphere/dcos/2.1/security/ent/secrets/secrets-api/). Services that depend on values provisioned to them via environment variables may fail to deploy.

To unseal the Secret Store, complete the following steps. They will unseal just a single instance of `dcos-secrets`. If the cluster URL obtained through `dcos config show core.dcos_url` points to a load balancer and there is more than one master node in the cluster, then these steps should be issued against each master node instead, and the cluster URL should be changed to the address of individual master nodes.

The intended status of the seal is persisted, so if one of the prerequisites for sealing the store occurs, `dcos-secrets` will unseal it again automatically even after being restarted. Only the steps depicted in [sealing the store](/mesosphere/dcos/2.1/security/ent/secrets/seal-store/) will seal it back.

**Prerequisites:**
- [DC/OS CLI installed](/mesosphere/dcos/2.1/cli/install/)
- Logged into the DC/OS CLI as a superuser via `dcos auth login`
- You must follow the steps in [Downloading the Root Cert](/mesosphere/dcos/2.1/security/ent/tls-ssl/get-cert/) before issuing the `curl` commands in this section. 
# <a name="unseal-def-keys"></a>Unsealing a Secret Store sealed with default keys

1. From a terminal prompt, check the status of the Secret Store:

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

1. Confirm that the Secret Store was unsealed:

   ```bash
   curl --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/secrets/v1/seal-status/default
   ```
    The Secret Store service should return the following JSON response, indicating success.

   ```json
   {"sealed":false,"threshold":1,"shares":1,"progress":0}
   ```